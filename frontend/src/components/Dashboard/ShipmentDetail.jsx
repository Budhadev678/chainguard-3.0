// ChainGuard 3.0 — Shipment Detail Panel + Decision Cards
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchCascade, fetchRouteOptions, getAiDecision, approveDecision } from '../../services/api';
import { X, Navigation, Package, Clock, DollarSign, Leaf, AlertTriangle, CheckCircle, XCircle, Loader2, Bot, ChevronDown, ChevronUp } from 'lucide-react';

const RISK_COLORS = { critical: '#ef4444', warning: '#f59e0b', safe: '#10b981' };

export default function ShipmentDetail() {
  const { state, dispatch, refreshData } = useApp();
  const { selectedShipment: ship, activeDisruptions } = state;
  const [cascade, setCascade] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('risk');
  const [showCascadeDetail, setShowCascadeDetail] = useState(false);

  // Find relevant disruption for this shipment
  const relevantDisruption = activeDisruptions.find(d =>
    d.affected_shipment_ids?.includes(ship?.id)
  );

  useEffect(() => {
    if (ship && relevantDisruption) {
      setLoading(true);
      Promise.all([
        fetchCascade(ship.id, relevantDisruption.id).catch(() => null),
        fetchRouteOptions(ship.id, relevantDisruption.id).catch(() => null),
      ]).then(([c, r]) => {
        setCascade(c);
        setRoutes(r);
        setLoading(false);
      });
    } else {
      setCascade(null);
      setRoutes(null);
      setAiResponse(null);
    }
  }, [ship?.id, relevantDisruption?.id]);

  const handleAiDecision = async () => {
    if (!ship || !relevantDisruption) return;
    setLoading(true);
    try {
      const res = await getAiDecision(ship.id, relevantDisruption.id);
      setAiResponse(res);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleApprove = async (optionId) => {
    if (!ship || !relevantDisruption) return;
    try {
      await approveDecision(ship.id, relevantDisruption.id, optionId, 'approve');
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: `Reroute approved for ${ship.name}` } });
      refreshData();
    } catch (e) { console.error(e); }
  };

  if (!ship) {
    return (
      <div className="detail-empty">
        <Navigation size={32} className="detail-empty-icon" />
        <p>Select a shipment to view details</p>
        <span>Click on any marker on the map or shipment in the list</span>
      </div>
    );
  }

  const riskColor = RISK_COLORS[ship.risk_level] || RISK_COLORS.safe;
  const signals = ship.risk_signals || {};

  return (
    <div className="ship-detail animate-slide-up">
      {/* Header */}
      <div className="sd-header">
        <div>
          <div className="sd-name">{ship.name}</div>
          <div className="sd-cargo">{ship.cargo}</div>
        </div>
        <div className="sd-score" style={{ color: riskColor, borderColor: riskColor }}>
          {ship.risk_score}
        </div>
        <button className="sd-close" onClick={() => dispatch({ type: 'SELECT_SHIPMENT', payload: null })}>
          <X size={16} />
        </button>
      </div>

      {/* Route info */}
      <div className="sd-route">
        <div className="sd-route-point">
          <span className="sd-dot" style={{ background: '#10b981' }} />
          <span>{ship.origin?.name}</span>
        </div>
        <div className="sd-route-line" />
        <div className="sd-route-point">
          <span className="sd-dot" style={{ background: '#ef4444' }} />
          <span>{ship.destination?.name}</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="sd-stats">
        <div className="sd-stat"><Clock size={12} /><span>ETA: {ship.eta_days}d</span></div>
        <div className="sd-stat"><Package size={12} /><span>{ship.containers} cont.</span></div>
        <div className="sd-stat"><DollarSign size={12} /><span>${(ship.cargo_value/1e6).toFixed(1)}M</span></div>
      </div>

      {/* Tabs */}
      <div className="sd-tabs">
        {['risk', 'cascade', 'routes', 'ai'].map(tab => (
          <button
            key={tab}
            className={`sd-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab); if (tab === 'ai' && !aiResponse) handleAiDecision(); }}
          >
            {tab === 'risk' && '📊 Risk'}
            {tab === 'cascade' && '🌊 Cascade'}
            {tab === 'routes' && '🔀 Routes'}
            {tab === 'ai' && '🤖 AI'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sd-content">
        {activeTab === 'risk' && (
          <div className="sd-risk-breakdown">
            {Object.entries(signals).map(([key, val]) => (
              <div key={key} className="sd-signal">
                <span className="sd-signal-name">{key.replace(/_/g, ' ')}</span>
                <div className="sd-signal-bar">
                  <div
                    className="sd-signal-fill"
                    style={{
                      width: `${Math.min(val * 2, 100)}%`,
                      background: val > 25 ? '#ef4444' : val > 15 ? '#f59e0b' : '#10b981',
                    }}
                  />
                </div>
                <span className="sd-signal-val" style={{ color: val > 25 ? '#ef4444' : val > 15 ? '#f59e0b' : '#10b981' }}>
                  +{val}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cascade' && cascade && (
          <div className="sd-cascade">
            <div className="sd-cascade-header">
              <AlertTriangle size={14} color="#ef4444" />
              <span>If you do nothing:</span>
              <span className="sd-cascade-loss" style={{color:'#ef4444'}}>-${(cascade.do_nothing?.total_loss/1e6).toFixed(1)}M</span>
            </div>
            {cascade.do_nothing?.timeline?.map((t, i) => (
              <div key={i} className="sd-cascade-item">
                <div className="sd-cascade-day">Day {t.day}</div>
                <div className={`sd-cascade-dot ${t.severity}`} />
                <div className="sd-cascade-event">{t.event}</div>
              </div>
            ))}
            <div className="sd-cascade-divider" />
            <div className="sd-cascade-header">
              <CheckCircle size={14} color="#10b981" />
              <span>If you act now:</span>
              <span style={{color:'#10b981', fontWeight:700}}>SAVE ${((cascade.act_now?.loss_avoided||0)/1e6).toFixed(1)}M</span>
            </div>
            <button className="btn btn-success" style={{width:'100%',marginTop:8}} onClick={() => routes?.options?.[2] && handleApprove(routes.options[2].id)}>
              ✅ Act Now — Approve Reroute
            </button>
          </div>
        )}

        {activeTab === 'cascade' && !cascade && !relevantDisruption && (
          <div className="sd-empty-tab">No active disruption affecting this shipment</div>
        )}

        {activeTab === 'routes' && routes && (
          <div className="sd-routes">
            {routes.options?.map((opt) => (
              <div key={opt.id} className={`sd-route-card ${opt.tag}`}>
                <div className="sd-route-card-header">
                  <span className={`badge badge-${opt.tag === 'cheapest' ? 'info' : opt.tag === 'fastest' ? 'warning' : 'safe'}`}>
                    {opt.tag}
                  </span>
                  <span className="sd-route-card-name">{opt.name}</span>
                </div>
                <div className="sd-route-card-desc">{opt.description}</div>
                <div className="sd-route-card-stats">
                  <span><Clock size={11} /> {opt.eta_days}d</span>
                  <span><DollarSign size={11} /> +${opt.cost_delta?.toLocaleString()}</span>
                  <span><Leaf size={11} /> {opt.co2_delta_tonnes > 0 ? '+' : ''}{opt.co2_delta_tonnes}t CO₂</span>
                </div>
                <div className="sd-route-card-actions">
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(opt.id)}>
                    <CheckCircle size={12} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'routes' && !routes && !relevantDisruption && (
          <div className="sd-empty-tab">No disruption — routes are optimal</div>
        )}

        {activeTab === 'ai' && (
          <div className="sd-ai">
            {loading && <div className="sd-ai-loading"><Loader2 size={20} className="spin" /> Analyzing with Gemini AI...</div>}
            {aiResponse && (
              <div className="sd-ai-response">
                <div className="sd-ai-badge"><Bot size={14} /> {aiResponse.source === 'gemini' ? 'Gemini AI' : 'AI Analysis'}</div>
                <div className="sd-ai-text">{aiResponse.response}</div>
              </div>
            )}
            {!loading && !aiResponse && !relevantDisruption && (
              <div className="sd-empty-tab">No active disruption to analyze</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .ship-detail { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
        .sd-header {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px 8px; position: relative;
        }
        .sd-name { font-size: 1rem; font-weight: 800; }
        .sd-cargo { font-size: 0.7rem; color: var(--text-muted); }
        .sd-score {
          font-size: 1.3rem; font-weight: 900; font-family: var(--font-mono);
          border: 2px solid; border-radius: var(--radius-md);
          padding: 2px 10px; margin-left: auto;
        }
        .sd-close {
          position: absolute; top: 10px; right: 10px; background: none;
          border: none; color: var(--text-muted); cursor: pointer; padding: 4px;
        }
        .sd-close:hover { color: var(--text-primary); }
        .sd-route {
          padding: 6px 16px; display: flex; flex-direction: column; gap: 3px;
        }
        .sd-route-point { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: var(--text-secondary); }
        .sd-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .sd-route-line { width: 1px; height: 10px; background: var(--border-primary); margin-left: 3px; }
        .sd-stats {
          display: flex; gap: 8px; padding: 6px 16px 10px;
        }
        .sd-stat {
          flex: 1; display: flex; align-items: center; gap: 4px;
          font-size: 0.7rem; color: var(--text-secondary);
          background: rgba(255,255,255,0.03); padding: 5px 8px;
          border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);
        }
        .sd-tabs {
          display: flex; gap: 2px; padding: 0 12px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sd-tab {
          flex: 1; padding: 7px 4px; font-size: 0.7rem; font-weight: 600;
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; border-bottom: 2px solid transparent;
          font-family: var(--font-sans); transition: all var(--transition-fast);
        }
        .sd-tab:hover { color: var(--text-secondary); }
        .sd-tab.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }
        .sd-content { flex: 1; overflow-y: auto; padding: 12px 14px; }
        .sd-risk-breakdown { display: flex; flex-direction: column; gap: 8px; }
        .sd-signal { display: flex; align-items: center; gap: 8px; }
        .sd-signal-name { font-size: 0.7rem; color: var(--text-secondary); width: 90px; text-transform: capitalize; flex-shrink: 0; }
        .sd-signal-bar { flex: 1; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
        .sd-signal-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
        .sd-signal-val { font-size: 0.72rem; font-weight: 700; font-family: var(--font-mono); width: 30px; text-align: right; }
        .sd-cascade { display: flex; flex-direction: column; gap: 6px; }
        .sd-cascade-header { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 700; }
        .sd-cascade-loss { margin-left: auto; }
        .sd-cascade-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
        .sd-cascade-day { font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-muted); width: 38px; }
        .sd-cascade-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .sd-cascade-dot.critical { background: #ef4444; }
        .sd-cascade-dot.high { background: #f59e0b; }
        .sd-cascade-dot.alert { background: #f59e0b; }
        .sd-cascade-dot.safe, .sd-cascade-dot.resolved { background: #10b981; }
        .sd-cascade-dot.info { background: #3b82f6; }
        .sd-cascade-dot.delay, .sd-cascade-dot.shortage { background: #ef4444; }
        .sd-cascade-dot.production_halt, .sd-cascade-dot.stockout, .sd-cascade-dot.total_loss { background: #ef4444; }
        .sd-cascade-dot.action_taken, .sd-cascade-dot.stable { background: #10b981; }
        .sd-cascade-event { font-size: 0.72rem; color: var(--text-secondary); }
        .sd-cascade-divider { height: 1px; background: var(--border-subtle); margin: 6px 0; }
        .sd-routes { display: flex; flex-direction: column; gap: 8px; }
        .sd-route-card {
          padding: 10px; border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle); background: rgba(255,255,255,0.02);
          transition: all var(--transition-fast);
        }
        .sd-route-card:hover { border-color: var(--border-hover); background: rgba(59,130,246,0.04); }
        .sd-route-card.recommended { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }
        .sd-route-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .sd-route-card-name { font-size: 0.8rem; font-weight: 700; }
        .sd-route-card-desc { font-size: 0.68rem; color: var(--text-muted); margin-bottom: 8px; }
        .sd-route-card-stats { display: flex; gap: 12px; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 8px; }
        .sd-route-card-stats span { display: flex; align-items: center; gap: 3px; }
        .sd-route-card-actions { display: flex; gap: 6px; }
        .sd-ai { display: flex; flex-direction: column; gap: 10px; }
        .sd-ai-loading { display: flex; align-items: center; gap: 8px; color: var(--accent-blue); font-size: 0.8rem; padding: 20px 0; justify-content: center; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sd-ai-badge { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: var(--accent-purple); font-weight: 600; }
        .sd-ai-response { background: rgba(139,92,246,0.05); border: 1px solid rgba(139,92,246,0.2); border-radius: var(--radius-md); padding: 12px; }
        .sd-ai-text { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
        .sd-empty-tab { display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.78rem; padding: 30px; text-align: center; }
        .detail-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%; color: var(--text-muted); gap: 8px; text-align: center; padding: 20px;
        }
        .detail-empty-icon { opacity: 0.3; }
        .detail-empty p { font-size: 0.85rem; font-weight: 600; }
        .detail-empty span { font-size: 0.7rem; }
      `}</style>
    </div>
  );
}
