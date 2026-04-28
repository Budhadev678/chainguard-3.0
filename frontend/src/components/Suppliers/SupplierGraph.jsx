/**
 * ChainGuard 3.0 — Supplier Network Graph
 * Multi-tier supplier health monitoring with visual hierarchy.
 */
import { Factory, AlertTriangle, CheckCircle, Globe, Link2 } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

const TIER_COLORS = { 1: '#3b82f6', 2: '#f59e0b', 3: '#ef4444' };
const STATUS_MAP = {
  healthy: { color: '#10b981', icon: CheckCircle },
  warning: { color: '#f59e0b', icon: AlertTriangle },
  critical: { color: '#ef4444', icon: AlertTriangle },
};

export default function SupplierGraph({ suppliers = [] }) {
  const tiers = [1, 2, 3];

  return (
    <div className="supplier-panel">
      <div className="sug-header">
        <div className="sug-header-icon">
          <Factory size={20} />
        </div>
        <div>
          <h2 className="sug-title">
            Supplier Network
            <InfoTooltip text="Monitor the health of your multi-tier supply network. Tier 1 are direct partners, Tier 2 are sub-suppliers, and Tier 3 are raw material providers. The AI maps dependencies to predict upstream risks." position="right" />
          </h2>
          <p className="sug-subtitle">
            Multi-tier supplier health monitoring — {suppliers.length} suppliers across 3 tiers
          </p>
        </div>
      </div>

      <div className="sug-summary">
        {tiers.map(t => {
          const tierSuppliers = suppliers.filter(s => s.tier === t);
          const critical = tierSuppliers.filter(s => s.status === 'critical').length;
          const avgHealth = tierSuppliers.length
            ? Math.round(tierSuppliers.reduce((a, s) => a + (s.health_score || 0), 0) / tierSuppliers.length)
            : 0;
          return (
            <div key={t} className="sug-tier-summary glass-panel" style={{ borderColor: `${TIER_COLORS[t]}25` }}>
              <div className="sug-tier-header-badge" style={{ background: `${TIER_COLORS[t]}18`, color: TIER_COLORS[t] }}>
                Tier {t}
              </div>
              <div className="sug-tier-stat-main">{tierSuppliers.length}</div>
              <div className="sug-tier-stat-label">suppliers</div>
              <div className="sug-tier-health">
                <div className="sug-health-bar-track">
                  <div
                    className="sug-health-bar-fill"
                    style={{
                      width: `${avgHealth}%`,
                      background: avgHealth > 70 ? '#10b981' : avgHealth > 40 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="sug-health-val">{avgHealth}%</span>
              </div>
              {critical > 0 && (
                <div className="sug-tier-alert">
                  <AlertTriangle size={11} /> {critical} critical
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sug-grid">
        {tiers.map(tier => {
          const tierSups = suppliers.filter(s => s.tier === tier);
          if (tierSups.length === 0) return null;
          return (
            <div key={tier} className="sug-tier-group">
              <div className="sug-tier-label" style={{ color: TIER_COLORS[tier] }}>
                <span className="sug-tier-dot" style={{ background: TIER_COLORS[tier] }} />
                Tier {tier} — {tier === 1 ? 'Direct Partners' : tier === 2 ? 'Sub-suppliers' : 'Raw Materials'}
                <InfoTooltip text={tier === 1 ? "Your direct contract manufacturers and primary assembly partners." : tier === 2 ? "Secondary suppliers that provide components to your Tier 1 partners." : "Deep-tier suppliers providing raw materials like metals, chemicals, or base elements."} position="right" />
              </div>
              <div className="sug-tier-cards">
                {tierSups.map((sup, i) => {
                  const StatusIcon = STATUS_MAP[sup.status]?.icon || CheckCircle;
                  const statusColor = STATUS_MAP[sup.status]?.color || '#10b981';
                  return (
                    <div
                      key={sup.id}
                      className="sug-card glass-panel animate-slide-up"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="sug-card-top">
                        <div className="sug-card-status" style={{ background: `${statusColor}15`, border: `1.5px solid ${statusColor}40` }}>
                          <StatusIcon size={14} color={statusColor} />
                        </div>
                        <div className="sug-card-info">
                          <div className="sug-card-name">{sup.name}</div>
                          <div className="sug-card-location">
                            <Globe size={10} /> {typeof sup.location === 'string' ? sup.location : sup.location?.name || 'Unknown'}
                          </div>
                        </div>
                        <div className="sug-card-score" style={{ color: statusColor }}>
                          {sup.health_score}
                        </div>
                      </div>

                      <div className="sug-card-tags">
                        {sup.products.map((p, j) => (
                          <span key={j} className="sug-product-tag">{p}</span>
                        ))}
                      </div>

                      {sup.risk_factors.length > 0 && (
                        <div className="sug-card-risks">
                          {sup.risk_factors.map((r, j) => (
                            <span key={j} className="sug-risk-tag">⚠ {r}</span>
                          ))}
                        </div>
                      )}

                      {sup.last_incident && (
                        <div className="sug-card-incident">
                          <AlertTriangle size={11} />
                          <span>{sup.last_incident}</span>
                        </div>
                      )}

                      {sup.dependencies?.length > 0 && (
                        <div className="sug-card-deps">
                          <Link2 size={10} /> Depends on: {sup.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .supplier-panel { padding: 24px; height: 100%; overflow-y: auto; }
        .sug-header { display: flex; gap: 14px; align-items: center; margin-bottom: 20px; }
        .sug-header-icon {
          width: 40px; height: 40px; border-radius: var(--radius-md);
          background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2);
          display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);
        }
        .sug-title { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }
        .sug-subtitle { font-size: 0.75rem; color: var(--text-muted); }
        .sug-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .sug-tier-summary {
          padding: 16px; text-align: center; display: flex;
          flex-direction: column; align-items: center; gap: 4px;
        }
        .sug-tier-header-badge {
          font-size: 0.7rem; font-weight: 700; padding: 3px 12px;
          border-radius: var(--radius-full); letter-spacing: 0.03em;
        }
        .sug-tier-stat-main { font-size: 1.8rem; font-weight: 900; font-family: var(--font-mono); color: var(--text-primary); }
        .sug-tier-stat-label { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 6px; }
        .sug-tier-health { display: flex; align-items: center; gap: 8px; width: 100%; }
        .sug-health-bar-track {
          flex: 1; height: 4px; background: rgba(255,255,255,0.06);
          border-radius: var(--radius-full); overflow: hidden;
        }
        .sug-health-bar-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.8s ease; }
        .sug-health-val { font-size: 0.7rem; font-weight: 600; font-family: var(--font-mono); color: var(--text-secondary); }
        .sug-tier-alert { font-size: 0.68rem; color: #ef4444; display: flex; align-items: center; gap: 4px; margin-top: 4px; }
        .sug-grid { display: flex; flex-direction: column; gap: 24px; }
        .sug-tier-label {
          font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .sug-tier-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .sug-tier-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
        .sug-card { padding: 16px; }
        .sug-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .sug-card-status {
          width: 34px; height: 34px; display: flex;
          align-items: center; justify-content: center; border-radius: 50%; flex-shrink: 0;
        }
        .sug-card-info { flex: 1; min-width: 0; }
        .sug-card-name { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
        .sug-card-location { font-size: 0.68rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
        .sug-card-score { font-size: 1.3rem; font-weight: 900; font-family: var(--font-mono); }
        .sug-card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
        .sug-product-tag {
          font-size: 0.65rem; padding: 2px 8px; border-radius: 12px;
          background: rgba(56,189,248,0.08); color: var(--accent-blue);
          border: 1px solid rgba(56,189,248,0.15);
        }
        .sug-card-risks { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
        .sug-risk-tag {
          font-size: 0.63rem; padding: 2px 7px; border-radius: 12px;
          background: rgba(251,191,36,0.08); color: var(--status-warning);
        }
        .sug-card-incident {
          display: flex; align-items: flex-start; gap: 5px;
          font-size: 0.68rem; color: var(--status-critical);
          background: rgba(248,113,113,0.06); padding: 6px 8px;
          border-radius: var(--radius-sm); margin-bottom: 6px;
        }
        .sug-card-deps { font-size: 0.65rem; color: var(--text-muted); font-style: italic; display: flex; align-items: center; gap: 4px; }
      `}</style>
    </div>
  );
}
