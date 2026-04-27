// ChainGuard 3.0 — Risk Overview Cards
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Ship, Truck, Plane, Train, TrendingDown, DollarSign, ShieldCheck } from 'lucide-react';

const TYPE_ICONS = { vessel: Ship, truck: Truck, aircraft: Plane, train: Train };
const RISK_COLORS = { critical: '#ef4444', warning: '#f59e0b', safe: '#10b981' };

export default function RiskOverview() {
  const { state, dispatch } = useApp();
  const { shipments, stats } = state;

  // Sort by risk score descending
  const sorted = [...shipments].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));

  return (
    <div className="risk-overview">
      <div className="ro-header">
        <span className="section-title">Active Shipments</span>
        <span className="section-subtitle">{shipments.length} tracked</span>
      </div>

      <div className="ro-summary">
        <div className="ro-stat">
          <TrendingDown size={14} />
          <span>${((stats.total_cargo_value || 0) / 1e6).toFixed(1)}M</span>
          <span className="ro-stat-label">Cargo Value</span>
        </div>
        <div className="ro-stat">
          <DollarSign size={14} />
          <span>${((stats.total_loss_avoided || 0) / 1e6).toFixed(1)}M</span>
          <span className="ro-stat-label">Loss Avoided</span>
        </div>
        <div className="ro-stat">
          <ShieldCheck size={14} />
          <span>{stats.decisions_made || 0}</span>
          <span className="ro-stat-label">Decisions</span>
        </div>
      </div>

      <div className="ro-list">
        {sorted.map((s, i) => {
          const Icon = TYPE_ICONS[s.type] || Ship;
          const color = RISK_COLORS[s.risk_level] || RISK_COLORS.safe;
          return (
            <div
              key={s.id}
              className={`ro-item animate-slide-up ${state.selectedShipment?.id === s.id ? 'selected' : ''}`}
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => dispatch({ type: 'SELECT_SHIPMENT', payload: s })}
            >
              <div className="ro-item-icon" style={{ borderColor: color, boxShadow: `0 0 8px ${color}30` }}>
                <Icon size={14} color={color} />
              </div>
              <div className="ro-item-info">
                <div className="ro-item-name">{s.name}</div>
                <div className="ro-item-route">
                  {s.origin?.name?.split(',')[0]} → {s.destination?.name?.split(',')[0]}
                </div>
              </div>
              <div className="ro-item-right">
                <div className="ro-item-score" style={{ color }}>
                  {s.risk_score}
                </div>
                <div className={`badge badge-${s.risk_level === 'critical' ? 'critical' : s.risk_level === 'warning' ? 'warning' : 'safe'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                  {s.risk_level}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .risk-overview {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
        .ro-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px 8px;
        }
        .ro-summary {
          display: flex;
          gap: 6px;
          padding: 0 16px 10px;
        }
        .ro-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 4px;
          background: rgba(59, 130, 246, 0.06);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--accent-blue);
        }
        .ro-stat-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .ro-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ro-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }
        .ro-item:hover {
          background: rgba(59, 130, 246, 0.06);
          border-color: var(--border-primary);
        }
        .ro-item.selected {
          background: rgba(59, 130, 246, 0.1);
          border-color: var(--accent-blue);
        }
        .ro-item-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1.5px solid;
          background: rgba(6, 10, 20, 0.6);
          flex-shrink: 0;
        }
        .ro-item-info { flex: 1; min-width: 0; }
        .ro-item-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .ro-item-route {
          font-size: 0.65rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ro-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
        }
        .ro-item-score {
          font-size: 1rem;
          font-weight: 800;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
