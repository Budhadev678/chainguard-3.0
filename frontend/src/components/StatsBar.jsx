/**
 * StatsBar — Bottom bar with aggregated supply chain KPIs.
 */
import { motion } from 'framer-motion';
import { Package, AlertTriangle, Factory, Warehouse, DollarSign, CheckCircle, Leaf, TrendingUp } from 'lucide-react';

const STAT_ITEMS = [
  { key: 'total_shipments', icon: Package, label: 'Shipments', color: '#38bdf8' },
  { key: 'active_disruptions', icon: AlertTriangle, label: 'Disruptions', color: '#f87171' },
  { key: 'critical_suppliers', icon: Factory, label: 'Critical Suppliers', color: '#fb923c' },
  { key: 'warning_warehouses', icon: Warehouse, label: 'WH Warnings', color: '#fbbf24' },
  { key: 'decisions_made', icon: CheckCircle, label: 'Decisions', color: '#34d399' },
  { key: 'total_loss_avoided', icon: DollarSign, label: 'Loss Avoided', color: '#a78bfa', format: 'money' },
  { key: 'carbon_saved_tonnes', icon: Leaf, label: 'CO₂ Saved', color: '#22d3ee', suffix: 't' },
  { key: 'resolved_shipments', icon: TrendingUp, label: 'Resolved', color: '#34d399' },
];

function formatValue(value, format, suffix) {
  if (format === 'money') {
    return value >= 1000000
      ? `$${(value / 1000000).toFixed(1)}M`
      : value >= 1000
      ? `$${(value / 1000).toFixed(0)}K`
      : `$${value}`;
  }
  return `${value}${suffix || ''}`;
}

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-bar">
      {STAT_ITEMS.map((item, i) => {
        const Icon = item.icon;
        const value = stats[item.key] || 0;

        return (
          <motion.div
            key={item.key}
            className="sb-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Icon size={14} style={{ color: item.color }} />
            <div className="sb-info">
              <span className="sb-value" style={{ color: item.color }}>
                {formatValue(value, item.format, item.suffix)}
              </span>
              <span className="sb-label">{item.label}</span>
            </div>
          </motion.div>
        );
      })}

      <style>{`
        .stats-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 8px 16px;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-subtle);
          gap: 4px;
        }
        .sb-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        .sb-item:hover {
          background: var(--bg-tertiary);
        }
        .sb-info {
          display: flex;
          flex-direction: column;
        }
        .sb-value {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .sb-label {
          font-size: 0.62rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}
