// ChainGuard 3.0 — Top Bar
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Bell, Activity, Zap, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TopBar() {
  const { state } = useApp();
  const { stats, activeDisruptions, shipments } = state;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const criticalCount = shipments.filter(s => s.risk_level === 'critical').length;
  const warningCount = shipments.filter(s => s.risk_level === 'warning').length;
  const safeCount = shipments.filter(s => s.risk_level === 'safe').length;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <Shield size={22} />
          <span className="topbar-brand">ChainGuard</span>
          <span className="topbar-version">3.0</span>
        </div>
        <div className="topbar-divider" />
        <div className="topbar-status">
          <Activity size={14} className="status-pulse" />
          <span>Control Tower — LIVE</span>
        </div>
      </div>

      <div className="topbar-center">
        <div className="topbar-metrics">
          <div className="topbar-metric" data-type="critical">
            <AlertTriangle size={13} />
            <span>{criticalCount} Critical</span>
          </div>
          <div className="topbar-metric" data-type="warning">
            <Zap size={13} />
            <span>{warningCount} Warning</span>
          </div>
          <div className="topbar-metric" data-type="safe">
            <CheckCircle size={13} />
            <span>{safeCount} Clear</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-disruptions">
          <Bell size={15} />
          <span>{activeDisruptions.length} Active Events</span>
          {activeDisruptions.length > 0 && <span className="topbar-alert-dot" />}
        </div>
        <div className="topbar-divider" />
        <div className="topbar-clock">
          <Clock size={13} />
          <span>{time.toLocaleTimeString('en-US', { hour12: false })}</span>
        </div>
      </div>

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 48px;
          background: linear-gradient(180deg, rgba(10, 15, 30, 0.98) 0%, rgba(6, 10, 20, 0.95) 100%);
          border-bottom: 1px solid var(--border-primary);
          backdrop-filter: blur(20px);
          z-index: 100;
          flex-shrink: 0;
        }
        .topbar-left, .topbar-right { display: flex; align-items: center; gap: 14px; }
        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-blue);
        }
        .topbar-brand {
          font-size: 1.05rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        .topbar-version {
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--accent-cyan);
          background: rgba(6, 182, 212, 0.12);
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid rgba(6, 182, 212, 0.25);
        }
        .topbar-divider {
          width: 1px;
          height: 24px;
          background: var(--border-primary);
        }
        .topbar-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--accent-green);
          font-weight: 600;
        }
        .status-pulse { animation: pulse-glow 2s ease-in-out infinite; color: var(--accent-green); }
        .topbar-center { display: flex; align-items: center; }
        .topbar-metrics { display: flex; gap: 16px; }
        .topbar-metric {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .topbar-metric[data-type="critical"] {
          color: var(--accent-red);
          background: var(--accent-red-dim);
        }
        .topbar-metric[data-type="warning"] {
          color: var(--accent-yellow);
          background: var(--accent-yellow-dim);
        }
        .topbar-metric[data-type="safe"] {
          color: var(--accent-green);
          background: var(--accent-green-dim);
        }
        .topbar-disruptions {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          position: relative;
        }
        .topbar-alert-dot {
          width: 7px;
          height: 7px;
          background: var(--accent-red);
          border-radius: 50%;
          animation: pulse-glow 1.5s ease-in-out infinite;
        }
        .topbar-clock {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }
      `}</style>
    </header>
  );
}
