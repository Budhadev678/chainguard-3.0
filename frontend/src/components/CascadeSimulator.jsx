/**
 * CascadeSimulator — Visual cascade timeline comparing "Do Nothing" vs "Act Now"
 */
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingDown, Clock, DollarSign } from 'lucide-react';

const SEVERITY_COLORS = {
  critical: '#f87171',
  high: '#fb923c',
  alert: '#fbbf24',
  info: '#38bdf8',
  resolved: '#34d399',
  safe: '#34d399',
};

const SEVERITY_ICONS = {
  critical: '🔴',
  high: '🟠',
  alert: '🟡',
  info: '🔵',
  resolved: '✅',
  safe: '✅',
};

export default function CascadeSimulator({ data }) {
  if (!data) return null;

  const { do_nothing, act_now, net_benefit } = data;

  return (
    <div className="cascade-sim">
      {/* Summary cards */}
      <div className="cascade-summary">
        <div className="cascade-card cascade-danger">
          <div className="cc-label">If You Do Nothing</div>
          <div className="cc-value">${(do_nothing.total_loss / 1000000).toFixed(1)}M</div>
          <div className="cc-sublabel">Total Loss</div>
          <div className="cc-details">
            <span>📦 {do_nothing.affected_warehouses} warehouses</span>
            <span>🏭 {do_nothing.affected_factories} factories</span>
            <span>🏪 {do_nothing.affected_retailers} retailers</span>
            <span>❌ {do_nothing.orders_failed} orders failed</span>
          </div>
        </div>

        <div className="cascade-card cascade-success">
          <div className="cc-label">If You Act Now</div>
          <div className="cc-value">${(act_now.total_cost / 1000000).toFixed(2)}M</div>
          <div className="cc-sublabel">Rerouting Cost</div>
          <div className="cc-benefit">
            <CheckCircle size={14} />
            <span>Save ${(act_now.loss_avoided / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      {/* Net benefit banner */}
      <motion.div
        className="cascade-benefit-banner"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <DollarSign size={18} />
        <span>Net Benefit: <strong>${(net_benefit / 1000000).toFixed(1)}M SAVED</strong></span>
      </motion.div>

      {/* Timelines */}
      <div className="cascade-timelines">
        {/* Do Nothing Timeline */}
        <div className="cascade-timeline">
          <h4 className="timeline-title danger">
            <TrendingDown size={14} /> Do Nothing — Cascade Over 14 Days
          </h4>
          {do_nothing.timeline.map((event, i) => (
            <motion.div
              key={i}
              className="timeline-event"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="te-left">
                <div className="te-dot" style={{ background: SEVERITY_COLORS[event.severity] }} />
                {i < do_nothing.timeline.length - 1 && <div className="te-line" />}
              </div>
              <div className="te-content">
                <div className="te-header">
                  <span className="te-day">Day {event.day}</span>
                  <span className="te-severity" style={{ color: SEVERITY_COLORS[event.severity] }}>
                    {SEVERITY_ICONS[event.severity]}
                  </span>
                </div>
                <p className="te-event">{event.event}</p>
                {event.financial_impact > 0 && (
                  <span className="te-impact" style={{ color: SEVERITY_COLORS[event.severity] }}>
                    💰 ${(event.financial_impact / 1000000).toFixed(2)}M
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Act Now Timeline */}
        <div className="cascade-timeline">
          <h4 className="timeline-title success">
            <CheckCircle size={14} /> Act Now — Cascade Prevention
          </h4>
          {act_now.timeline.map((event, i) => (
            <motion.div
              key={i}
              className="timeline-event"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 + 0.5 }}
            >
              <div className="te-left">
                <div className="te-dot" style={{ background: SEVERITY_COLORS[event.severity] }} />
                {i < act_now.timeline.length - 1 && <div className="te-line success" />}
              </div>
              <div className="te-content">
                <div className="te-header">
                  <span className="te-day">Day {event.day}</span>
                  <span className="te-severity" style={{ color: SEVERITY_COLORS[event.severity] }}>
                    {SEVERITY_ICONS[event.severity]}
                  </span>
                </div>
                <p className="te-event">{event.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .cascade-sim { display: flex; flex-direction: column; gap: 12px; }
        .cascade-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .cascade-card {
          padding: 12px;
          border-radius: var(--radius-md);
          text-align: center;
        }
        .cascade-danger {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.25);
        }
        .cascade-success {
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.25);
        }
        .cc-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .cc-value {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .cascade-danger .cc-value { color: var(--status-critical); }
        .cascade-success .cc-value { color: var(--status-safe); }
        .cc-sublabel {
          font-size: 0.72rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
        .cc-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .cc-benefit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: var(--status-safe);
          font-weight: 600;
          font-size: 0.82rem;
          margin-top: 4px;
        }
        .cascade-benefit-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: var(--radius-md);
          background: var(--gradient-success);
          color: var(--text-inverse);
          font-size: 0.88rem;
          font-weight: 600;
        }
        .cascade-timelines {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cascade-timeline {
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 12px;
          border: 1px solid var(--border-subtle);
        }
        .timeline-title {
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .timeline-title.danger { color: var(--status-critical); }
        .timeline-title.success { color: var(--status-safe); }
        .timeline-event {
          display: flex;
          gap: 10px;
          padding-bottom: 8px;
        }
        .te-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .te-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .te-line {
          width: 2px;
          flex: 1;
          background: rgba(248,113,113,0.3);
          margin-top: 2px;
        }
        .te-line.success {
          background: rgba(52,211,153,0.3);
        }
        .te-content { flex: 1; min-width: 0; }
        .te-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }
        .te-day {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .te-event {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .te-impact {
          font-size: 0.72rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
