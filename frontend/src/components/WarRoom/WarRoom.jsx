/**
 * ChainGuard 3.0 — War Room
 * Real-time collaborative decision space for critical disruptions.
 */
import { useState, useEffect } from 'react';
import { Users, Shield, Radio, Clock, AlertTriangle, MessageSquare, Send, CheckCircle, Zap } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

const PARTICIPANTS = [
  { name: 'You (Logistics Manager)', role: 'Decision Maker', location: 'Mumbai HQ', avatar: '👤', online: true },
  { name: 'Carrier — Maersk Line', role: 'Shipping Partner', location: 'Singapore', avatar: '🚢', online: true },
  { name: 'Supplier — ChipTech', role: 'Tier 1 Supplier', location: 'Taipei', avatar: '🏭', online: true },
  { name: 'Warehouse — WH-003', role: 'Warehouse Mgr', location: 'Mumbai', avatar: '📦', online: false },
  { name: 'AI Engine — Gemini', role: 'Analysis', location: 'Cloud', avatar: '🤖', online: true },
];

const BASE_ACTIVITY_LOG = [
  { time: '09:41:22', user: 'System', msg: 'War Room activated — monitoring for disruption events', type: 'info' },
  { time: '09:41:30', user: 'AI Engine', msg: 'Connected to live risk feed — all shipments monitored', type: 'info' },
];

const DISRUPTION_LOG_ENTRIES = [
  { user: 'System', msg: 'Disruption detected — War Room escalated to ACTIVE', type: 'alert' },
  { user: 'AI Engine', msg: 'Route options generated for affected vessels', type: 'info' },
  { user: 'Maersk Rep', msg: 'Confirmed: alternate berth available at Jebel Ali', type: 'message' },
  { user: 'ChipTech', msg: 'Can expedite 2000 units via air from Taipei', type: 'message' },
  { user: 'AI Engine', msg: 'Option C recommended — hybrid reroute via Cape of Good Hope', type: 'success' },
];

export default function WarRoom({ activeDisruptions = [], shipments = [], stats }) {
  const hasActive = activeDisruptions.length > 0;
  const [activityLog, setActivityLog] = useState(BASE_ACTIVITY_LOG);
  const [chatInput, setChatInput] = useState('');
  const [elapsed, setElapsed] = useState(0);

  // When disruptions change, add entries to the log
  useEffect(() => {
    if (hasActive) {
      const newEntries = DISRUPTION_LOG_ENTRIES.map((entry, i) => ({
        ...entry,
        time: new Date(Date.now() + i * 30000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }));
      setActivityLog([...BASE_ACTIVITY_LOG, ...newEntries]);
    } else {
      setActivityLog(BASE_ACTIVITY_LOG);
    }
  }, [hasActive]);

  // Elapsed timer
  useEffect(() => {
    if (!hasActive) { setElapsed(0); return; }
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [hasActive]);

  function handleSendChat() {
    if (!chatInput.trim()) return;
    setActivityLog(prev => [...prev, {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: 'You',
      msg: chatInput,
      type: 'message',
    }]);
    setChatInput('');
  }

  const formatElapsed = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const affectedShipmentCount = activeDisruptions.reduce(
    (count, d) => count + (d.affected_shipment_ids?.length || 0), 0
  );

  return (
    <div className="warroom">
      <div className="wr-header">
        <div className="wr-header-left">
          <div className="wr-header-icon">
            <Users size={20} />
          </div>
          <div>
            <h2 className="wr-title">
              War Room
              <InfoTooltip text="A real-time collaborative workspace activated during critical supply chain disruptions. It unites logistics managers, suppliers, carriers, and the AI agent in a single chat room to rapidly align on and execute mitigation strategies." position="right" />
            </h2>
            <p className="wr-subtitle">Real-time collaborative decision space for critical disruptions</p>
          </div>
        </div>
        <div className="wr-header-right">
          {hasActive && (
            <div className="wr-timer">
              <Clock size={12} />
              <span>{formatElapsed(elapsed)}</span>
            </div>
          )}
          <div className={`wr-status ${hasActive ? 'active' : 'inactive'}`}>
            <Radio size={12} />
            <span>{hasActive ? 'ACTIVE SESSION' : 'STANDBY'}</span>
          </div>
        </div>
      </div>

      <div className="wr-body">
        {/* Left Column — Participants + Disruptions */}
        <div className="wr-left-col">
          {/* Participants */}
          <div className="wr-section glass-panel">
            <div className="wr-section-header">
              <span className="wr-section-title">Participants</span>
              <span className="wr-section-count">
                {PARTICIPANTS.filter(p => p.online).length}/{PARTICIPANTS.length} online
              </span>
            </div>
            <div className="wr-participants">
              {PARTICIPANTS.map((p, i) => (
                <div key={i} className="wr-participant">
                  <div className="wr-avatar-wrap">
                    <span className="wr-avatar">{p.avatar}</span>
                    <span className={`wr-online-dot ${p.online ? 'online' : ''}`} />
                  </div>
                  <div className="wr-participant-info">
                    <div className="wr-participant-name">{p.name}</div>
                    <div className="wr-participant-role">{p.role} • {p.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disruption Status */}
          <div className="wr-section glass-panel">
            <div className="wr-section-header">
              <span className="wr-section-title">Active Disruptions</span>
            </div>
            {hasActive ? (
              <div className="wr-disruption-list">
                {activeDisruptions.map(d => (
                  <div key={d.id} className="wr-disruption-card">
                    <div className="wr-dis-name">
                      <AlertTriangle size={13} color="#f87171" />
                      <span>{d.name}</span>
                    </div>
                    <p className="wr-dis-desc">{d.description}</p>
                    <div className="wr-dis-stats">
                      <span>🚢 {d.affected_shipment_ids?.length || 0} shipments</span>
                      <span>⏱ +{d.impact?.delay_days || 0}d</span>
                      <span>💰 ${((d.impact?.estimated_loss || 0) / 1e6).toFixed(1)}M</span>
                    </div>
                  </div>
                ))}
                <div className="wr-dis-summary">
                  <div className="wr-dis-summary-item">
                    <span className="wr-dis-summary-val">{activeDisruptions.length}</span>
                    <span>Active</span>
                  </div>
                  <div className="wr-dis-summary-item">
                    <span className="wr-dis-summary-val">{affectedShipmentCount}</span>
                    <span>Affected</span>
                  </div>
                  <div className="wr-dis-summary-item">
                    <span className="wr-dis-summary-val" style={{ color: '#f87171' }}>
                      ${(activeDisruptions.reduce((s, d) => s + (d.impact?.estimated_loss || 0), 0) / 1e6).toFixed(1)}M
                    </span>
                    <span>At Risk</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="wr-empty">
                <Shield size={32} style={{ opacity: 0.2 }} />
                <p>No active disruptions</p>
                <span>All systems nominal — inject a scenario from the Simulator</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Activity Log */}
        <div className="wr-section wr-right-col glass-panel">
          <div className="wr-section-header">
            <span className="wr-section-title">Activity Feed</span>
            <span className="wr-section-count">Live</span>
          </div>
          <div className="wr-log">
            {activityLog.map((entry, i) => (
              <div key={i} className="wr-log-entry animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <span className="wr-log-time">{entry.time}</span>
                <span className={`wr-log-dot ${entry.type}`} />
                <span className="wr-log-user">{entry.user}:</span>
                <span className="wr-log-msg">{entry.msg}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="wr-chat-input">
            <input
              className="wr-chat-field"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Message the team..."
            />
            <button className="btn btn-primary btn-sm" onClick={handleSendChat} disabled={!chatInput.trim()}>
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .warroom { padding: 24px; height: 100%; overflow-y: auto; display: flex; flex-direction: column; }
        .wr-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .wr-header-left { display: flex; gap: 14px; align-items: center; }
        .wr-header-icon {
          width: 40px; height: 40px; border-radius: var(--radius-md);
          background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2);
          display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);
        }
        .wr-title { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }
        .wr-subtitle { font-size: 0.75rem; color: var(--text-muted); }
        .wr-header-right { display: flex; align-items: center; gap: 10px; }
        .wr-timer {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: var(--radius-full);
          background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2);
          font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-blue);
        }
        .wr-status {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 14px; border-radius: var(--radius-full);
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
        }
        .wr-status.active {
          background: rgba(248,113,113,0.08); color: var(--status-critical);
          border: 1px solid rgba(248,113,113,0.25); animation: pulse-dot 2s infinite;
        }
        .wr-status.inactive {
          background: rgba(100,116,139,0.08); color: var(--text-muted);
          border: 1px solid var(--border-subtle);
        }
        .wr-body { display: grid; grid-template-columns: 320px 1fr; gap: 16px; flex: 1; min-height: 0; }
        .wr-left-col { display: flex; flex-direction: column; gap: 14px; }
        .wr-right-col { display: flex; flex-direction: column; }
        .wr-section { padding: 16px; overflow: hidden; }
        .wr-section-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px;
        }
        .wr-section-title { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
        .wr-section-count { font-size: 0.68rem; color: var(--text-muted); }
        .wr-participants { display: flex; flex-direction: column; gap: 6px; }
        .wr-participant { display: flex; align-items: center; gap: 10px; padding: 4px 0; }
        .wr-avatar-wrap { position: relative; }
        .wr-avatar { font-size: 1.3rem; }
        .wr-online-dot {
          position: absolute; bottom: 0; right: -2px;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--text-muted); border: 2px solid var(--bg-secondary);
        }
        .wr-online-dot.online { background: var(--status-safe); }
        .wr-participant-name { font-size: 0.78rem; font-weight: 600; color: var(--text-primary); }
        .wr-participant-role { font-size: 0.65rem; color: var(--text-muted); }
        .wr-disruption-list { display: flex; flex-direction: column; gap: 8px; }
        .wr-disruption-card {
          padding: 12px; border-radius: var(--radius-md);
          background: rgba(248,113,113,0.04); border: 1px solid rgba(248,113,113,0.15);
        }
        .wr-dis-name { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.82rem; margin-bottom: 4px; }
        .wr-dis-desc { font-size: 0.7rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 6px; }
        .wr-dis-stats { display: flex; gap: 12px; font-size: 0.68rem; color: var(--text-secondary); }
        .wr-dis-summary { display: flex; gap: 8px; margin-top: 10px; }
        .wr-dis-summary-item {
          flex: 1; text-align: center; padding: 8px;
          background: rgba(255,255,255,0.02); border-radius: var(--radius-sm);
          font-size: 0.65rem; color: var(--text-muted);
          display: flex; flex-direction: column; gap: 2px;
        }
        .wr-dis-summary-val { font-size: 1.1rem; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); }
        .wr-empty {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 30px; color: var(--text-muted); text-align: center;
        }
        .wr-empty p { font-size: 0.82rem; font-weight: 600; }
        .wr-empty span { font-size: 0.68rem; }
        .wr-log { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 3px; margin-bottom: 12px; }
        .wr-log-entry { display: flex; align-items: flex-start; gap: 8px; padding: 5px 0; font-size: 0.72rem; }
        .wr-log-time { font-family: var(--font-mono); color: var(--text-muted); width: 60px; flex-shrink: 0; font-size: 0.68rem; }
        .wr-log-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .wr-log-dot.alert { background: var(--status-critical); }
        .wr-log-dot.info { background: var(--accent-blue); }
        .wr-log-dot.message { background: var(--accent-cyan); }
        .wr-log-dot.success { background: var(--status-safe); }
        .wr-log-user { font-weight: 600; color: var(--text-secondary); flex-shrink: 0; }
        .wr-log-msg { color: var(--text-muted); }
        .wr-chat-input { display: flex; gap: 6px; border-top: 1px solid var(--border-subtle); padding-top: 12px; }
        .wr-chat-field {
          flex: 1; padding: 8px 12px; background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
          color: var(--text-primary); font-family: var(--font-sans); font-size: 0.78rem; outline: none;
        }
        .wr-chat-field:focus { border-color: var(--accent-blue); }
        .wr-chat-field::placeholder { color: var(--text-muted); }
      `}</style>
    </div>
  );
}
