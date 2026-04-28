/**
 * TopBar — Header bar with system status, alerts counter, and action buttons.
 */
import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Zap, RefreshCw, Activity } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

export default function TopBar({ stats, activeDisruptions, onRefresh, loading }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalAlerts = (stats?.active_disruptions || 0);
  const lossAvoided = stats?.total_loss_avoided || 0;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-brand">
          <div className="brand-icon">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="brand-title">ChainGuard</h1>
            <span className="brand-version">3.0 Control Tower</span>
          </div>
        </div>
        <div className="topbar-status">
          <span className="status-dot" data-status={totalAlerts > 0 ? 'alert' : 'ok'} />
          <span className="status-text">
            {totalAlerts > 0 ? 'Disruptions Active' : 'All Systems Normal'}
          </span>
          <InfoTooltip text="Indicates the live operational status of your global supply chain. 'Normal' means no critical alerts." position="bottom" />
        </div>
      </div>

      <div className="topbar-center">
        <div className="stat-pills">
          <div className="stat-pill">
            <Activity size={14} />
            <span>{stats?.total_shipments || 0} Shipments</span>
            <InfoTooltip text="Total number of active shipments currently being tracked globally." position="bottom" />
          </div>
          <div className="stat-pill" data-variant="warning">
            <AlertTriangle size={14} />
            <span>{totalAlerts} Alerts</span>
            <InfoTooltip text="Current active disruptions or critical warnings affecting your logistics network." position="bottom" />
          </div>
          <div className="stat-pill" data-variant="success">
            <Zap size={14} />
            <span>${(lossAvoided / 1000000).toFixed(1)}M Saved</span>
            <InfoTooltip text="Estimated financial loss prevented by AI-driven proactive decisions." position="bottom" />
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <span className="topbar-time">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 1000;
          gap: 16px;
        }
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .topbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-inverse);
          box-shadow: var(--shadow-glow-blue);
        }
        .brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .brand-version {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .topbar-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--status-safe);
          animation: pulse-dot 2s infinite;
        }
        .status-dot[data-status="alert"] {
          background: var(--status-critical);
        }
        .status-text {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .topbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .stat-pills {
          display: flex;
          gap: 8px;
        }
        .stat-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-blue);
        }
        .stat-pill[data-variant="warning"] {
          color: var(--status-warning);
        }
        .stat-pill[data-variant="success"] {
          color: var(--status-safe);
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .topbar-time {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
