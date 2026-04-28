/**
 * ShipmentPanel — Right-side panel showing shipment details, risk breakdown, and action buttons.
 */
import { useState, useEffect } from 'react';
import { X, Ship, Truck, Plane, Train, MapPin, Clock, Package, DollarSign, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { fetchCascade, fetchRouteOptions, fetchAIDecision, approveDecision } from '../api';
import CascadeSimulator from './CascadeSimulator';
import RouteOptions from './RouteOptions';

const TYPE_ICONS = {
  vessel: Ship,
  truck: Truck,
  aircraft: Plane,
  train: Train,
};

function RiskGauge({ score, level }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  const color = level === 'critical' ? '#f87171' : level === 'warning' ? '#fbbf24' : '#34d399';

  return (
    <div className="risk-gauge">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(99,130,191,0.1)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
        <text x="50" y="46" textAnchor="middle" fill={color} fontSize="24" fontWeight="800" fontFamily="var(--font-sans)">
          {score}
        </text>
        <text x="50" y="62" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" textTransform="uppercase">
          RISK
        </text>
      </svg>
    </div>
  );
}

function SignalBar({ label, value, maxVal = 50 }) {
  const pct = Math.min((value / maxVal) * 100, 100);
  const color = pct > 60 ? '#f87171' : pct > 30 ? '#fbbf24' : '#34d399';
  return (
    <div className="signal-bar-row">
      <div className="signal-label">{label}</div>
      <div className="signal-track">
        <div className="signal-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="signal-value" style={{ color }}>{value}</div>
    </div>
  );
}

export default function ShipmentPanel({ shipment, activeDisruptions, onClose, onDecisionMade }) {
  const [tab, setTab] = useState('overview');
  const [cascadeData, setCascadeData] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loadingCascade, setLoadingCascade] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [decisionResult, setDecisionResult] = useState(null);

  if (!shipment) return null;

  const TypeIcon = TYPE_ICONS[shipment.type] || Package;
  const riskLevel = shipment.risk_level || 'safe';
  const riskScore = shipment.risk_score || 0;
  const signals = shipment.risk_signals || {};

  // Find matching disruptions — support both API and mock data field names
  const matchedDisruptions = activeDisruptions.length > 0
    ? activeDisruptions.filter(d =>
        (d.affected_shipment_ids || d.affected_shipments || []).includes(shipment.id)
      )
    : (shipment.disruptions || []);

  const signalLabels = {
    weather: '🌦️ Weather',
    route_delay: '🛣️ Route',
    port_congestion: '🏗️ Port',
    news_geopolitical: '📰 News',
    geopolitical: '📰 Geopolitical',
    supplier_health: '🏭 Supplier',
    inventory_level: '📦 Inventory',
    historical_pattern: '📊 History',
  };

  async function loadCascade(disId) {
    setLoadingCascade(true);
    try {
      const data = await fetchCascade(shipment.id, disId);
      setCascadeData(data);
      setTab('cascade');
    } catch (e) { console.error(e); }
    setLoadingCascade(false);
  }

  async function loadRoutes(disId) {
    setLoadingRoutes(true);
    try {
      const data = await fetchRouteOptions(shipment.id, disId);
      setRouteData(data);
      setTab('routes');
    } catch (e) { console.error(e); }
    setLoadingRoutes(false);
  }

  async function loadAI(disId) {
    setLoadingAI(true);
    try {
      const data = await fetchAIDecision(shipment.id, disId);
      setAiData(data);
      setTab('ai');
    } catch (e) { console.error(e); }
    setLoadingAI(false);
  }

  async function handleApprove(optionId, disruptionId) {
    try {
      const result = await approveDecision(shipment.id, disruptionId, optionId, 'approve');
      setDecisionResult(result);
      if (onDecisionMade) onDecisionMade(result);
    } catch (e) { console.error(e); }
  }

  return (
    <div className="shipment-panel animate-slide-right">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-header-top">
          <div className="sp-header-left">
            <div className={`sp-type-icon ${riskLevel}`}>
              <TypeIcon size={18} />
            </div>
            <div>
              <h2 className="sp-name">{shipment.name}</h2>
              <span className="sp-id">{shipment.id}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="sp-meta-row">
          <span className={`badge badge-${riskLevel}`}>{riskLevel.toUpperCase()}</span>
          <span className="sp-meta"><Package size={12} /> {shipment.cargo}</span>
          <span className="sp-meta"><DollarSign size={12} /> ${((shipment.value_usd || shipment.cargo_value || 0) / 1000000).toFixed(1)}M</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sp-tabs">
        {['overview', 'cascade', 'routes', 'ai'].map(t => (
          <button
            key={t}
            className={`sp-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'overview' ? 'Overview' : t === 'cascade' ? 'Cascade' : t === 'routes' ? 'Routes' : 'AI Decision'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sp-content">
        {tab === 'overview' && (
          <div className="sp-overview animate-fade-in">
            {/* Risk Gauge */}
            <div className="sp-risk-section">
              <RiskGauge score={riskScore} level={riskLevel} />
              <div className="sp-risk-info">
                <div className="sp-route-info">
                  <div className="sp-route-point">
                    <MapPin size={12} style={{ color: 'var(--status-safe)' }} />
                    <span>{shipment.origin.name}</span>
                  </div>
                  <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
                  <div className="sp-route-point">
                    <MapPin size={12} style={{ color: 'var(--accent-blue)' }} />
                    <span>{shipment.destination.name}</span>
                  </div>
                </div>
                <div className="sp-detail-grid">
                  <div className="sp-detail"><Clock size={12} /> ETA: {shipment.eta_days}d</div>
                  <div className="sp-detail"><TrendingUp size={12} /> Progress: {Math.round(shipment.progress_pct || shipment.progress * 100 || 0)}%</div>
                  <div className="sp-detail"><Ship size={12} /> {shipment.carrier}</div>
                  <div className="sp-detail"><Package size={12} /> {shipment.containers} containers</div>
                </div>
              </div>
            </div>

            {/* 7-Signal Breakdown */}
            <div className="sp-signals">
              <h3 className="sp-section-title">7-Signal Risk Fusion</h3>
              {Object.entries(signalLabels).map(([key, label]) => (
                <SignalBar key={key} label={label} value={signals[key] || 0} />
              ))}
            </div>

            {/* Matched Disruptions */}
            {matchedDisruptions.length > 0 && (
              <div className="sp-disruptions">
                <h3 className="sp-section-title">
                  <AlertTriangle size={14} style={{ color: 'var(--status-critical)' }} />
                  Active Disruptions
                </h3>
                {matchedDisruptions.map(d => (
                  <div key={d.id} className="sp-disruption-card">
                    <div className="sp-dis-header">
                      <span className="badge badge-critical">{d.severity}</span>
                      <strong>{d.name}</strong>
                    </div>
                    <p className="sp-dis-desc">{d.description}</p>
                    <div className="sp-dis-impact">
                      <span>⏱ +{d.impact.delay_days}d delay</span>
                      <span>💰 ${(d.impact.estimated_loss / 1000000).toFixed(1)}M at risk</span>
                    </div>
                    <div className="sp-dis-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => loadCascade(d.id)} disabled={loadingCascade}>
                        {loadingCascade ? 'Loading...' : '🌊 Cascade'}
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => loadRoutes(d.id)} disabled={loadingRoutes}>
                        {loadingRoutes ? 'Loading...' : '🔀 Routes'}
                      </button>
                      <button className="btn btn-success btn-sm" onClick={() => loadAI(d.id)} disabled={loadingAI}>
                        {loadingAI ? 'Loading...' : '🤖 AI'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {matchedDisruptions.length === 0 && (
              <div className="sp-all-clear">
                <span style={{ fontSize: '2rem' }}>✅</span>
                <p>No active disruptions affecting this shipment</p>
              </div>
            )}
          </div>
        )}

        {tab === 'cascade' && (
          <div className="animate-fade-in">
            {cascadeData ? (
              <CascadeSimulator data={cascadeData} />
            ) : (
              <div className="sp-empty">Select a disruption to see cascade simulation</div>
            )}
          </div>
        )}

        {tab === 'routes' && (
          <div className="animate-fade-in">
            {routeData ? (
              <RouteOptions data={routeData} onApprove={handleApprove} decisionResult={decisionResult} />
            ) : (
              <div className="sp-empty">Select a disruption to see route options</div>
            )}
          </div>
        )}

        {tab === 'ai' && (
          <div className="animate-fade-in">
            {aiData ? (
              <div className="sp-ai-response">
                <div className="ai-badge"><span>🤖</span> Gemini AI Analysis</div>
                <div className="markdown-content" dangerouslySetInnerHTML={{
                  __html: (aiData.response || aiData.decision || 'No response').replace(/\\n/g, '\n').replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*?)<br\/>/g, '<h3>$1</h3>').replace(/## (.*?)<br\/>/g, '<h2>$1</h2>')
                }} />
                <div className="ai-source">Source: {aiData.source || 'gemini'}</div>
              </div>
            ) : (
              <div className="sp-empty">Select a disruption to get AI analysis</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .shipment-panel {
          width: 420px;
          height: 100%;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(20px);
          border-left: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sp-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sp-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .sp-header-left {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .sp-type-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sp-type-icon.safe { background: var(--status-safe-bg); color: var(--status-safe); border: 1px solid var(--status-safe-border); }
        .sp-type-icon.warning { background: var(--status-warning-bg); color: var(--status-warning); border: 1px solid var(--status-warning-border); }
        .sp-type-icon.critical { background: var(--status-critical-bg); color: var(--status-critical); border: 1px solid var(--status-critical-border); }
        .sp-name {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .sp-id {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .sp-meta-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .sp-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .sp-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-subtle);
          padding: 0 16px;
        }
        .sp-tab {
          padding: 8px 14px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-sans);
        }
        .sp-tab:hover { color: var(--text-secondary); }
        .sp-tab.active {
          color: var(--accent-blue);
          border-bottom-color: var(--accent-blue);
        }
        .sp-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        .sp-risk-section {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .risk-gauge {
          flex-shrink: 0;
        }
        .sp-risk-info {
          flex: 1;
          min-width: 0;
        }
        .sp-route-info {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .sp-route-point {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .sp-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
        }
        .sp-detail {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .sp-signals {
          margin-bottom: 16px;
        }
        .sp-section-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .signal-bar-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }
        .signal-label {
          width: 100px;
          font-size: 0.72rem;
          color: var(--text-secondary);
          flex-shrink: 0;
        }
        .signal-track {
          flex: 1;
          height: 5px;
          background: rgba(99,130,191,0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .signal-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.8s ease;
        }
        .signal-value {
          width: 24px;
          text-align: right;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
        }
        .sp-disruption-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--status-critical-border);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 8px;
        }
        .sp-dis-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 0.85rem;
        }
        .sp-dis-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
          line-height: 1.5;
        }
        .sp-dis-impact {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
          font-size: 0.75rem;
          color: var(--status-warning);
        }
        .sp-dis-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sp-all-clear {
          text-align: center;
          padding: 32px 16px;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }
        .sp-empty {
          text-align: center;
          padding: 32px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .sp-ai-response {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 16px;
        }
        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: rgba(56,189,248,0.12);
          color: var(--accent-blue);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .ai-source {
          margin-top: 12px;
          font-size: 0.7rem;
          color: var(--text-muted);
          text-align: right;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
