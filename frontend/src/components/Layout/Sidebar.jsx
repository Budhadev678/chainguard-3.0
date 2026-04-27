// ChainGuard 3.0 — Sidebar Navigation
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Map, AlertTriangle, FlaskConical, Users, BarChart3, Truck, Package, Factory } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'command-center', icon: Map, label: 'Command Center' },
  { id: 'disruptions', icon: AlertTriangle, label: 'Disruptions' },
  { id: 'what-if', icon: FlaskConical, label: 'What-If Lab' },
  { id: 'war-room', icon: Users, label: 'War Room' },
  { id: 'suppliers', icon: Factory, label: 'Suppliers' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { activeView, activeDisruptions } = state;

  return (
    <nav className="sidebar">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        const hasAlert = item.id === 'disruptions' && activeDisruptions.length > 0;
        return (
          <button
            key={item.id}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
            title={item.label}
          >
            <Icon size={18} />
            <span className="sidebar-label">{item.label}</span>
            {hasAlert && <span className="sidebar-dot" />}
          </button>
        );
      })}

      <style>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 6px;
          width: 58px;
          background: linear-gradient(180deg, rgba(10, 15, 30, 0.98), rgba(6, 10, 20, 0.95));
          border-right: 1px solid var(--border-subtle);
          flex-shrink: 0;
          overflow: hidden;
          transition: width var(--transition-base);
        }
        .sidebar:hover {
          width: 170px;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          white-space: nowrap;
          position: relative;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 500;
        }
        .sidebar-item:hover {
          background: var(--accent-blue-dim);
          color: var(--accent-blue);
        }
        .sidebar-item.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
          color: var(--accent-blue);
          border: 1px solid rgba(59, 130, 246, 0.25);
        }
        .sidebar-label {
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        .sidebar:hover .sidebar-label {
          opacity: 1;
        }
        .sidebar-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: var(--accent-red);
          border-radius: 50%;
          animation: pulse-glow 1.5s infinite;
        }
      `}</style>
    </nav>
  );
}
