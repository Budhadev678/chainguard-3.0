/**
 * ChainGuard 3.0 — Analytics Dashboard
 * Performance metrics, risk distribution, and impact summary.
 */
import { BarChart3, TrendingUp, Shield, DollarSign, Leaf, Clock, CheckCircle, AlertTriangle, Zap, Package } from 'lucide-react';

export default function Analytics({ stats = {}, shipments = [] }) {
  const cards = [
    { label: 'Total Shipments', value: stats.total_shipments || shipments.length || 0, icon: Package, color: '#38bdf8' },
    { label: 'Active Disruptions', value: stats.active_disruptions || 0, icon: AlertTriangle, color: '#f87171' },
    { label: 'Decisions Made', value: stats.decisions_made || 0, icon: CheckCircle, color: '#34d399' },
    { label: 'Loss Avoided', value: `$${((stats.total_loss_avoided || 0) / 1e6).toFixed(1)}M`, icon: DollarSign, color: '#fbbf24' },
    { label: 'Carbon Saved', value: `${stats.carbon_saved_tonnes || 0}t`, icon: Leaf, color: '#22d3ee' },
    { label: 'Resolved', value: stats.resolved_shipments || 0, icon: Shield, color: '#a78bfa' },
  ];

  const critShips = shipments.filter(s => s.risk_level === 'critical');
  const warnShips = shipments.filter(s => s.risk_level === 'warning');
  const safeShips = shipments.filter(s => s.risk_level === 'safe' || !s.risk_level);
  const totalShips = shipments.length || 1;

  const avgRisk = shipments.length
    ? Math.round(shipments.reduce((a, s) => a + (s.risk_score || 0), 0) / shipments.length)
    : 0;

  return (
    <div className="analytics">
      <div className="an-header">
        <div className="an-header-icon">
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className="an-title">Performance Analytics</h2>
          <p className="an-subtitle">Real-time operational metrics, risk intelligence & impact summary</p>
        </div>
      </div>

      <div className="an-grid">
        {/* Risk Distribution */}
        <div className="glass-panel an-section">
          <div className="an-section-header">
            <span className="an-section-title">Risk Distribution</span>
            <span className="an-section-badge">Live</span>
          </div>
          <div className="an-risk-bars">
            <div className="an-risk-bar-row">
              <span className="an-risk-label" style={{ color: '#f87171' }}>
                <AlertTriangle size={12} /> Critical
              </span>
              <div className="an-risk-bar-track">
                <div className="an-risk-bar-fill" style={{ width: `${(critShips.length / totalShips) * 100}%`, background: 'linear-gradient(90deg, #f87171, #fb923c)' }} />
              </div>
              <span className="an-risk-count" style={{ color: '#f87171' }}>{critShips.length}</span>
            </div>
            <div className="an-risk-bar-row">
              <span className="an-risk-label" style={{ color: '#fbbf24' }}>
                <AlertTriangle size={12} /> Warning
              </span>
              <div className="an-risk-bar-track">
                <div className="an-risk-bar-fill" style={{ width: `${(warnShips.length / totalShips) * 100}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }} />
              </div>
              <span className="an-risk-count" style={{ color: '#fbbf24' }}>{warnShips.length}</span>
            </div>
            <div className="an-risk-bar-row">
              <span className="an-risk-label" style={{ color: '#34d399' }}>
                <CheckCircle size={12} /> Safe
              </span>
              <div className="an-risk-bar-track">
                <div className="an-risk-bar-fill" style={{ width: `${(safeShips.length / totalShips) * 100}%`, background: 'linear-gradient(90deg, #34d399, #22d3ee)' }} />
              </div>
              <span className="an-risk-count" style={{ color: '#34d399' }}>{safeShips.length}</span>
            </div>
          </div>

          {/* Average Risk Score */}
          <div className="an-avg-risk">
            <span>Average Risk Score</span>
            <div className="an-avg-risk-bar">
              <div
                className="an-avg-risk-fill"
                style={{
                  width: `${avgRisk}%`,
                  background: avgRisk > 70 ? '#f87171' : avgRisk > 40 ? '#fbbf24' : '#34d399',
                }}
              />
            </div>
            <span className="an-avg-risk-val" style={{
              color: avgRisk > 70 ? '#f87171' : avgRisk > 40 ? '#fbbf24' : '#34d399',
            }}>{avgRisk}/100</span>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="glass-panel an-section">
          <div className="an-section-header">
            <span className="an-section-title">Impact Summary</span>
            <span className="an-section-badge">This Month</span>
          </div>
          <div className="an-impact">
            <div className="an-impact-row">
              <div className="an-impact-label">
                <Zap size={13} color="#38bdf8" /> Detection Speed
              </div>
              <span className="an-impact-val">
                <span style={{ color: 'var(--status-critical)', textDecoration: 'line-through', marginRight: 8, fontSize: '0.72rem' }}>4-6 hours</span>
                <span style={{ color: 'var(--status-safe)', fontWeight: 700 }}>41 seconds</span>
              </span>
            </div>
            <div className="an-impact-row">
              <div className="an-impact-label">
                <Shield size={13} color="#34d399" /> Cascade Prevention
              </div>
              <span style={{ color: 'var(--status-safe)', fontWeight: 700, fontSize: '0.82rem' }}>73% stopped early</span>
            </div>
            <div className="an-impact-row">
              <div className="an-impact-label">
                <DollarSign size={13} color="#fbbf24" /> Avg Loss per Incident
              </div>
              <span className="an-impact-val">
                <span style={{ color: 'var(--status-critical)', textDecoration: 'line-through', marginRight: 8, fontSize: '0.72rem' }}>$340K</span>
                <span style={{ color: 'var(--status-safe)', fontWeight: 700 }}>$14K</span>
              </span>
            </div>
            <div className="an-impact-row">
              <div className="an-impact-label">
                <TrendingUp size={13} color="#a78bfa" /> ROI (This Month)
              </div>
              <span style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1rem' }}>784%</span>
            </div>
            <div className="an-impact-row">
              <div className="an-impact-label">
                <Leaf size={13} color="#22d3ee" /> Carbon Reduction
              </div>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>-12% per shipment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Risk Table */}
      {shipments.length > 0 && (
        <div className="glass-panel an-section an-table-section">
          <div className="an-section-header">
            <span className="an-section-title">Shipment Risk Register</span>
            <span className="an-section-badge">{shipments.length} Active</span>
          </div>
          <div className="an-table-wrap">
            <table className="an-table">
              <thead>
                <tr>
                  <th>Shipment</th>
                  <th>Route</th>
                  <th>Type</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {shipments.sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0)).map(s => (
                  <tr key={s.id}>
                    <td className="an-table-name">{s.name}</td>
                    <td className="an-table-route">
                      {s.origin?.name?.split(',')[0]} → {s.destination?.name?.split(',')[0]}
                    </td>
                    <td><span className="an-table-type">{s.type}</span></td>
                    <td>
                      <span className={`an-table-risk ${s.risk_level || 'safe'}`}>
                        {s.risk_score || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${s.risk_level || 'safe'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                        {(s.risk_level || 'safe').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="an-progress-bar">
                        <div className="an-progress-fill" style={{ width: `${(s.progress || 0) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .analytics { padding: 24px; height: 100%; overflow-y: auto; }
        .an-header { display: flex; gap: 14px; align-items: center; margin-bottom: 20px; }
        .an-header-icon {
          width: 40px; height: 40px; border-radius: var(--radius-md);
          background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
          display: flex; align-items: center; justify-content: center; color: var(--accent-blue);
        }
        .an-title { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }
        .an-subtitle { font-size: 0.75rem; color: var(--text-muted); }
        .an-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .an-card {
          padding: 16px; display: flex; flex-direction: column;
          align-items: center; gap: 6px; text-align: center;
        }
        .an-card-icon { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .an-card-value { font-size: 1.4rem; font-weight: 900; font-family: var(--font-mono); }
        .an-card-label { font-size: 0.68rem; color: var(--text-muted); }
        .an-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        .an-section { padding: 0; overflow: hidden; }
        .an-section-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px 10px;
        }
        .an-section-title { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
        .an-section-badge {
          font-size: 0.62rem; padding: 2px 8px; border-radius: var(--radius-full);
          background: rgba(56,189,248,0.08); color: var(--accent-blue);
          border: 1px solid rgba(56,189,248,0.15); font-weight: 600;
        }
        .an-risk-bars { padding: 0 18px 12px; display: flex; flex-direction: column; gap: 12px; }
        .an-risk-bar-row { display: flex; align-items: center; gap: 10px; }
        .an-risk-label { font-size: 0.75rem; font-weight: 600; width: 85px; display: flex; align-items: center; gap: 5px; }
        .an-risk-bar-track { flex: 1; height: 8px; background: rgba(255,255,255,0.04); border-radius: 4px; overflow: hidden; }
        .an-risk-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
        .an-risk-count { font-size: 0.85rem; font-weight: 800; font-family: var(--font-mono); width: 24px; text-align: right; }
        .an-avg-risk {
          padding: 10px 18px 16px; display: flex; align-items: center; gap: 10px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.75rem; color: var(--text-secondary);
        }
        .an-avg-risk-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.04); border-radius: 3px; overflow: hidden; }
        .an-avg-risk-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
        .an-avg-risk-val { font-family: var(--font-mono); font-weight: 700; font-size: 0.82rem; }
        .an-impact { padding: 0 18px 18px; display: flex; flex-direction: column; gap: 14px; }
        .an-impact-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-secondary); }
        .an-impact-label { display: flex; align-items: center; gap: 6px; }
        .an-table-section { margin-top: 0; }
        .an-table-wrap { overflow-x: auto; padding: 0 4px 4px; }
        .an-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
        .an-table th {
          text-align: left; padding: 8px 14px; color: var(--text-muted);
          font-weight: 600; border-bottom: 1px solid var(--border-subtle);
          font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .an-table td { padding: 8px 14px; border-bottom: 1px solid rgba(99,130,191,0.06); }
        .an-table-name { font-weight: 700; color: var(--text-primary); }
        .an-table-route { color: var(--text-muted); font-size: 0.7rem; }
        .an-table-type {
          font-size: 0.65rem; padding: 2px 8px; border-radius: var(--radius-full);
          background: rgba(255,255,255,0.04); color: var(--text-secondary); text-transform: capitalize;
        }
        .an-table-risk {
          font-family: var(--font-mono); font-weight: 800; font-size: 0.82rem;
        }
        .an-table-risk.safe { color: var(--status-safe); }
        .an-table-risk.warning { color: var(--status-warning); }
        .an-table-risk.critical { color: var(--status-critical); }
        .an-progress-bar { width: 60px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .an-progress-fill { height: 100%; background: var(--accent-blue); border-radius: 2px; transition: width 0.5s ease; }
      `}</style>
    </div>
  );
}
