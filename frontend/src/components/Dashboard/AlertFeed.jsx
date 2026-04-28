/**
 * ChainGuard 3.0 — Alert Feed
 * Live alert stream for the Command Center dashboard
 */
import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, Info, Zap, X } from 'lucide-react';

const ALERT_TYPES = {
  critical: { icon: AlertTriangle, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
  warning: { icon: Bell, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
  success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
  info: { icon: Info, color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)' },
};

const BASE_ALERTS = [
  { id: 'a1', type: 'info', title: 'System Online', msg: 'ChainGuard AI is monitoring 24 active shipments', time: '09:00', pinned: true },
  { id: 'a2', type: 'success', title: 'Risk Reduced', msg: 'Reroute approved for SHP-003 — estimated $1.2M saved', time: '09:15' },
  { id: 'a3', type: 'info', title: 'AI Analysis Complete', msg: 'Gemini processed 7-signal risk fusion for all vessels', time: '09:20' },
];

const DISRUPTION_ALERTS = [
  { id: 'd1', type: 'critical', title: 'Disruption Detected', msg: 'Port congestion or weather alert active — vessels at risk', time: '' },
  { id: 'd2', type: 'warning', title: 'Cascade Risk', msg: 'AI predicts 3 downstream shipments affected', time: '' },
  { id: 'd3', type: 'warning', title: 'Decision Required', msg: 'Rerouting options generated — awaiting approval', time: '' },
];

export default function AlertFeed({ activeDisruptions = [], shipments = [] }) {
  const [alerts, setAlerts] = useState(BASE_ALERTS);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (activeDisruptions.length > 0) {
      const disAlerts = DISRUPTION_ALERTS.map(a => ({ ...a, time: now }));
      setAlerts([...disAlerts, ...BASE_ALERTS]);
    } else {
      setAlerts(BASE_ALERTS);
    }
  }, [activeDisruptions.length]);

  // Add a live "tick" alert every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const liveAlerts = [
        'AI risk scan completed for all active routes',
        'Weather data refreshed — 3 storm systems tracked',
        'Supplier health scores updated from live feeds',
        'Port congestion index recalculated',
      ];
      const msg = liveAlerts[Math.floor(Math.random() * liveAlerts.length)];
      setAlerts(prev => [{
        id: `live-${Date.now()}`,
        type: 'info',
        title: 'Live Update',
        msg,
        time: now,
      }, ...prev.slice(0, 9)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id));

  return (
    <div className="alert-feed glass-panel">
      <div className="af-header">
        <div className="af-title">
          <Zap size={16} color="#38bdf8" />
          <span>Live Alert Feed</span>
        </div>
        <span className="af-badge">{visibleAlerts.length} Active</span>
      </div>

      <div className="af-list">
        {visibleAlerts.length === 0 ? (
          <div className="af-empty">
            <CheckCircle size={24} style={{ opacity: 0.3 }} />
            <span>No active alerts</span>
          </div>
        ) : (
          visibleAlerts.map((alert, i) => {
            const cfg = ALERT_TYPES[alert.type] || ALERT_TYPES.info;
            const Icon = cfg.icon;
            return (
              <div
                key={alert.id}
                className="af-item animate-slide-up"
                style={{
                  background: cfg.bg,
                  borderLeft: `3px solid ${cfg.color}`,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="af-item-icon" style={{ color: cfg.color }}>
                  <Icon size={14} />
                </div>
                <div className="af-item-body">
                  <div className="af-item-title" style={{ color: cfg.color }}>{alert.title}</div>
                  <div className="af-item-msg">{alert.msg}</div>
                </div>
                <div className="af-item-right">
                  {alert.time && <span className="af-time">{alert.time}</span>}
                  {!alert.pinned && (
                    <button
                      className="af-dismiss"
                      onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .alert-feed {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .af-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px 10px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .af-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .af-badge {
          font-size: 0.65rem;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: rgba(56,189,248,0.08);
          color: var(--accent-blue);
          border: 1px solid rgba(56,189,248,0.2);
          font-weight: 600;
        }
        .af-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .af-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px;
          color: var(--text-muted);
          font-size: 0.78rem;
        }
        .af-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        .af-item:hover { filter: brightness(1.1); }
        .af-item-icon { flex-shrink: 0; margin-top: 1px; }
        .af-item-body { flex: 1; min-width: 0; }
        .af-item-title {
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .af-item-msg {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .af-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }
        .af-time {
          font-size: 0.62rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .af-dismiss {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          transition: all var(--transition-fast);
        }
        .af-dismiss:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
      `}</style>
    </div>
  );
}
