/**
 * DisruptionControl — Control panel for injecting/clearing disruption scenarios.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trash2, ChevronDown, ChevronUp, AlertTriangle, Check } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const DISRUPTION_ICONS = {
  weather: '🌀',
  geopolitical: '⚠️',
  supplier: '🏭',
  infrastructure: '🏗️',
};

const SEVERITY_CLASS = {
  critical: 'badge-critical',
  high: 'badge-warning',
  medium: 'badge-info',
};

export default function DisruptionControl({
  disruptions,
  activeDisruptions,
  onSimulate,
  onClear,
  loading,
}) {
  const [expanded, setExpanded] = useState(true);

  const activeIds = activeDisruptions.map(d => d.id);

  return (
    <div className="disruption-control glass-panel">
      <div className="dc-header" onClick={() => setExpanded(!expanded)}>
        <div className="dc-title">
          <Zap size={16} style={{ color: 'var(--accent-blue)' }} />
          <span>Disruption Simulator</span>
          <InfoTooltip text="Inject simulated real-world disruptions (e.g., severe weather, supplier bankruptcy) to test your supply chain's resilience and see how AI responds." position="right" />
          {activeDisruptions.length > 0 && (
            <span className="dc-count">{activeDisruptions.length} active</span>
          )}
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="dc-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dc-scenarios">
              {disruptions.map(d => {
                const isActive = activeIds.includes(d.id);
                return (
                  <div key={d.id} className={`dc-scenario ${isActive ? 'active' : ''}`}>
                    <div className="dc-s-left">
                      <span className="dc-s-icon">{DISRUPTION_ICONS[d.type] || '⚠️'}</span>
                      <div>
                        <div className="dc-s-name">{d.name}</div>
                        <div className="dc-s-meta">
                          <span className={`badge ${SEVERITY_CLASS[d.severity] || 'badge-info'}`}>{d.severity}</span>
                          <span className="dc-s-loss">💰 ${(d.impact.estimated_loss / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`btn btn-sm ${isActive ? 'btn-ghost' : 'btn-danger'}`}
                      onClick={() => !isActive && onSimulate(d.id)}
                      disabled={isActive || loading}
                    >
                      {isActive ? <><Check size={12} /> Active</> : <><AlertTriangle size={12} /> Inject</>}
                    </button>
                  </div>
                );
              })}
            </div>

            {activeDisruptions.length > 0 && (
              <button className="btn btn-ghost dc-clear-btn" onClick={onClear} disabled={loading}>
                <Trash2 size={14} /> Clear All Disruptions
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .disruption-control {
          padding: 0;
          overflow: hidden;
        }
        .dc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          cursor: pointer;
          user-select: none;
          color: var(--text-secondary);
        }
        .dc-header:hover {
          background: var(--bg-tertiary);
        }
        .dc-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .dc-count {
          font-size: 0.68rem;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: var(--status-critical-bg);
          color: var(--status-critical);
          font-weight: 600;
        }
        .dc-body {
          overflow: hidden;
        }
        .dc-scenarios {
          padding: 0 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dc-scenario {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
        }
        .dc-scenario.active {
          border-color: var(--status-critical-border);
          background: rgba(248,113,113,0.06);
        }
        .dc-s-left {
          display: flex;
          gap: 8px;
          align-items: center;
          min-width: 0;
        }
        .dc-s-icon { font-size: 1.2rem; }
        .dc-s-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .dc-s-meta {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-top: 2px;
        }
        .dc-s-loss {
          font-size: 0.68rem;
          color: var(--status-warning);
        }
        .dc-clear-btn {
          width: calc(100% - 20px);
          margin: 0 10px 10px;
        }
      `}</style>
    </div>
  );
}
