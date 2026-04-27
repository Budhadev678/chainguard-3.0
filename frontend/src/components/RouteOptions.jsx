/**
 * RouteOptions — Displays 3 AI-generated route alternatives with approve/reject actions.
 */
import { motion } from 'framer-motion';
import { Clock, DollarSign, Leaf, Shield, Check, Star, Zap, Wallet } from 'lucide-react';

const TAG_CONFIG = {
  cheapest: { icon: Wallet, color: '#34d399', label: 'CHEAPEST' },
  fastest: { icon: Zap, color: '#fbbf24', label: 'FASTEST' },
  recommended: { icon: Star, color: '#38bdf8', label: 'AI RECOMMENDED' },
};

export default function RouteOptions({ data, onApprove, decisionResult }) {
  if (!data) return null;

  const { options, ai_recommended, recommendation_reason, loss_if_no_action, disruption_id } = data;

  return (
    <div className="route-options">
      {/* Header */}
      <div className="ro-header">
        <div className="ro-loss-info">
          <span className="ro-loss-label">Loss if no action:</span>
          <span className="ro-loss-value">${(loss_if_no_action / 1000000).toFixed(1)}M</span>
        </div>
        {recommendation_reason && (
          <p className="ro-reason">💡 {recommendation_reason}</p>
        )}
      </div>

      {/* Decision Result */}
      {decisionResult && (
        <motion.div
          className="ro-result"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Check size={16} />
          <span>{decisionResult.message}</span>
          {decisionResult.loss_avoided > 0 && (
            <strong>${(decisionResult.loss_avoided / 1000000).toFixed(1)}M saved!</strong>
          )}
        </motion.div>
      )}

      {/* Options */}
      {options.map((opt, i) => {
        const tagConfig = TAG_CONFIG[opt.tag] || TAG_CONFIG.recommended;
        const TagIcon = tagConfig.icon;
        const isRecommended = opt.id === ai_recommended;

        return (
          <motion.div
            key={opt.id}
            className={`ro-card ${isRecommended ? 'recommended' : ''}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="ro-card-header">
              <div className="ro-tag" style={{ color: tagConfig.color, borderColor: `${tagConfig.color}40`, background: `${tagConfig.color}10` }}>
                <TagIcon size={12} />
                {tagConfig.label}
              </div>
              <span className="ro-opt-id">{opt.id}</span>
            </div>

            <h4 className="ro-opt-name">{opt.name}</h4>
            <p className="ro-opt-desc">{opt.description}</p>

            <div className="ro-metrics">
              <div className="ro-metric">
                <Clock size={13} />
                <span className="rm-label">ETA</span>
                <span className="rm-value">{opt.eta_days}d</span>
              </div>
              <div className="ro-metric">
                <DollarSign size={13} />
                <span className="rm-label">Extra Cost</span>
                <span className="rm-value">+${(opt.cost_delta / 1000).toFixed(0)}K</span>
              </div>
              <div className="ro-metric">
                <Leaf size={13} />
                <span className="rm-label">CO₂</span>
                <span className="rm-value" style={{ color: opt.co2_delta_tonnes < 0 ? '#34d399' : '#fb923c' }}>
                  {opt.co2_delta_tonnes > 0 ? '+' : ''}{opt.co2_delta_tonnes}t
                </span>
              </div>
              <div className="ro-metric">
                <Shield size={13} />
                <span className="rm-label">Risk</span>
                <span className="rm-value">{opt.risk_score}/100</span>
              </div>
            </div>

            <div className="ro-pros-cons">
              <div className="ro-pros">
                {opt.pros.map((p, j) => <span key={j} className="ro-pro">✅ {p}</span>)}
              </div>
              <div className="ro-cons">
                {opt.cons.map((c, j) => <span key={j} className="ro-con">⚠️ {c}</span>)}
              </div>
            </div>

            <div className="ro-card-actions">
              <button
                className="btn btn-success btn-sm"
                onClick={() => onApprove(opt.id, data.disruption_id)}
                disabled={!!decisionResult}
              >
                <Check size={14} /> Approve {opt.tag === 'recommended' ? '(Recommended)' : ''}
              </button>
            </div>
          </motion.div>
        );
      })}

      <style>{`
        .route-options { display: flex; flex-direction: column; gap: 10px; }
        .ro-header {
          padding: 10px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }
        .ro-loss-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ro-loss-label {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .ro-loss-value {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--status-critical);
        }
        .ro-reason {
          font-size: 0.75rem;
          color: var(--accent-blue);
          margin-top: 6px;
          line-height: 1.4;
        }
        .ro-result {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(52,211,153,0.12);
          border: 1px solid rgba(52,211,153,0.3);
          border-radius: var(--radius-md);
          color: var(--status-safe);
          font-size: 0.82rem;
          font-weight: 500;
        }
        .ro-card {
          padding: 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }
        .ro-card.recommended {
          border-color: rgba(56,189,248,0.3);
          box-shadow: var(--shadow-glow-blue);
        }
        .ro-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .ro-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border: 1px solid;
        }
        .ro-opt-id {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .ro-opt-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .ro-opt-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .ro-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        .ro-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 4px;
          background: var(--bg-card);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }
        .ro-metric svg { color: var(--text-muted); }
        .rm-label {
          font-size: 0.62rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .rm-value {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .ro-pros-cons {
          margin-bottom: 10px;
        }
        .ro-pro, .ro-con {
          display: block;
          font-size: 0.72rem;
          line-height: 1.6;
        }
        .ro-pro { color: var(--status-safe); }
        .ro-con { color: var(--text-muted); }
        .ro-card-actions {
          display: flex;
          gap: 6px;
        }
      `}</style>
    </div>
  );
}
