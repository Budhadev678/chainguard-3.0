// ChainGuard 3.0 — Disruption Control Panel
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateDisruption, clearDisruptions, fetchDisruptions } from '../../services/api';
import { Zap, AlertTriangle, RotateCcw, Play, CheckCircle2, MapPin, Clock, DollarSign } from 'lucide-react';

const SEVERITY_COLORS = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6' };
const TYPE_ICONS = { weather: '🌦️', geopolitical: '🚢', supplier: '🏭', infrastructure: '🏗️' };

export default function DisruptionPanel() {
  const { state, dispatch, refreshData } = useApp();
  const [disruptions, setDisruptions] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  React.useEffect(() => {
    fetchDisruptions().then(d => setDisruptions(d.disruptions || [])).catch(() => {});
  }, []);

  const handleActivate = async (id) => {
    setLoadingId(id);
    try {
      await simulateDisruption(id);
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'critical', message: 'Disruption activated!' } });
      refreshData();
    } catch (e) { console.error(e); }
    setLoadingId(null);
  };

  const handleClearAll = async () => {
    await clearDisruptions();
    refreshData();
  };

  const isActive = (id) => state.activeDisruptions.some(d => d.id === id);

  return (
    <div className="disruption-panel">
      <div className="dp-header">
        <div>
          <h2 className="dp-title"><Zap size={18} /> Disruption Simulator</h2>
          <p className="dp-subtitle">Inject real-world disruption events to test your supply chain resilience</p>
        </div>
        <button className="btn btn-ghost" onClick={handleClearAll}>
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      <div className="dp-active-bar">
        <AlertTriangle size={14} />
        <span>{state.activeDisruptions.length} active disruptions</span>
      </div>

      <div className="dp-grid">
        {disruptions.map((d, i) => {
          const active = isActive(d.id);
          return (
            <div key={d.id} className={`dp-card animate-slide-up ${active ? 'active' : ''}`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="dp-card-header">
                <span className="dp-card-icon">{TYPE_ICONS[d.type] || '⚠️'}</span>
                <div>
                  <div className="dp-card-name">{d.name}</div>
                  <div className={`badge badge-${d.severity === 'critical' ? 'critical' : d.severity === 'high' ? 'warning' : 'info'}`}>
                    {d.severity}
                  </div>
                </div>
                {active && <CheckCircle2 size={18} color="#10b981" style={{ marginLeft: 'auto' }} />}
              </div>
              <p className="dp-card-desc">{d.description}</p>
              <div className="dp-card-impacts">
                <span><Clock size={11} /> +{d.impact.delay_days}d delay</span>
                <span><DollarSign size={11} /> ${(d.impact.estimated_loss / 1e6).toFixed(1)}M at risk</span>
                <span><MapPin size={11} /> {d.affected_shipment_ids.length} shipments</span>
              </div>
              <button
                className={`btn ${active ? 'btn-ghost' : 'btn-danger'}`}
                style={{ width: '100%', marginTop: 10 }}
                onClick={() => !active && handleActivate(d.id)}
                disabled={active || loadingId === d.id}
              >
                {active ? '✅ Active' : loadingId === d.id ? 'Activating...' : '⚡ Inject Disruption'}
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        .disruption-panel { padding: 20px; height: 100%; overflow-y: auto; }
        .dp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .dp-title { font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: var(--text-bright); }
        .dp-subtitle { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }
        .dp-active-bar {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; margin-bottom: 16px;
          background: var(--accent-red-dim); border: 1px solid rgba(239,68,68,0.25);
          border-radius: var(--radius-md); font-size: 0.78rem; font-weight: 600; color: var(--accent-red);
        }
        .dp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
        .dp-card {
          padding: 16px; border-radius: var(--radius-lg);
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          transition: all var(--transition-base);
        }
        .dp-card:hover { border-color: var(--border-hover); box-shadow: var(--glow-blue); }
        .dp-card.active { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }
        .dp-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .dp-card-icon { font-size: 1.5rem; }
        .dp-card-name { font-size: 0.88rem; font-weight: 700; margin-bottom: 4px; }
        .dp-card-desc { font-size: 0.72rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px; }
        .dp-card-impacts { display: flex; gap: 14px; font-size: 0.7rem; color: var(--text-secondary); }
        .dp-card-impacts span { display: flex; align-items: center; gap: 3px; }
      `}</style>
    </div>
  );
}
