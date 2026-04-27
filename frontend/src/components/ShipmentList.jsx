/**
 * ShipmentList — Left sidebar showing all shipments with risk scores.
 */
import { Ship, Truck, Plane, Train, Package } from 'lucide-react';

const TYPE_ICONS = {
  vessel: Ship,
  truck: Truck,
  aircraft: Plane,
  train: Train,
};

const RISK_COLORS = {
  safe: 'var(--status-safe)',
  warning: 'var(--status-warning)',
  critical: 'var(--status-critical)',
};

export default function ShipmentList({ shipments, selectedId, onSelect }) {
  return (
    <div className="shipment-list">
      <div className="sl-header">
        <h3>Active Shipments</h3>
        <span className="sl-count">{shipments.length}</span>
      </div>

      <div className="sl-items">
        {shipments.map(s => {
          const Icon = TYPE_ICONS[s.type] || Package;
          const riskLevel = s.risk_level || 'safe';
          const isSelected = selectedId === s.id;

          return (
            <div
              key={s.id}
              className={`sl-item ${isSelected ? 'selected' : ''} ${riskLevel}`}
              onClick={() => onSelect(s)}
            >
              <div className="sl-item-left">
                <div className={`sl-icon ${riskLevel}`}>
                  <Icon size={14} />
                </div>
                <div className="sl-info">
                  <span className="sl-name">{s.name}</span>
                  <span className="sl-route">
                    {s.origin.name.split(',')[0]} → {s.destination.name.split(',')[0]}
                  </span>
                </div>
              </div>

              <div className="sl-item-right">
                <div
                  className="sl-score"
                  style={{
                    color: RISK_COLORS[riskLevel],
                    borderColor: RISK_COLORS[riskLevel],
                    background: `${RISK_COLORS[riskLevel]}15`,
                  }}
                >
                  {s.risk_score || 0}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .shipment-list {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .sl-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sl-header h3 {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .sl-count {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 2px 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
        }
        .sl-items {
          flex: 1;
          overflow-y: auto;
          padding: 6px;
        }
        .sl-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
          margin-bottom: 2px;
        }
        .sl-item:hover {
          background: var(--bg-tertiary);
        }
        .sl-item.selected {
          background: var(--bg-tertiary);
          border-color: var(--border-medium);
        }
        .sl-item.selected.critical {
          border-color: var(--status-critical-border);
          background: rgba(248,113,113,0.06);
        }
        .sl-item.selected.warning {
          border-color: var(--status-warning-border);
          background: rgba(251,191,36,0.06);
        }
        .sl-item-left {
          display: flex;
          gap: 8px;
          align-items: center;
          min-width: 0;
        }
        .sl-icon {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sl-icon.safe { background: var(--status-safe-bg); color: var(--status-safe); }
        .sl-icon.warning { background: var(--status-warning-bg); color: var(--status-warning); }
        .sl-icon.critical { background: var(--status-critical-bg); color: var(--status-critical); }
        .sl-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .sl-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .sl-route {
          font-size: 0.68rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sl-score {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 800;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          border: 1px solid;
        }
      `}</style>
    </div>
  );
}
