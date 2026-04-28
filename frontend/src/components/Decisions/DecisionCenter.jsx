/**
 * ChainGuard 3.0 — Decision Center (PRD requirement)
 * One-click approve/defer AI-recommended actions
 */
import { useState } from 'react';
import { CheckCircle2, Clock, Zap, DollarSign, Leaf, AlertTriangle, Sparkles, Ship, Truck, Plane } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

const DECISIONS = [
  {
    id: 'dec-001',
    shipmentName: 'MV-Orion',
    shipmentId: 'SHP-001',
    type: 'vessel',
    disruption: 'Pacific Corridor Typhoon',
    severity: 'critical',
    aiRec: 'Activate backup supplier in Mexico. Saves the most time, lowest total cost.',
    options: [
      { id: 'opt-c', label: 'Activate Mexico Supplier', savingsM: 4.2, delayDays: 0, confidence: 95 },
      { id: 'opt-b', label: 'Split & Air Freight Dubai', savingsM: 1.8, delayDays: 4, confidence: 82 },
      { id: 'opt-a', label: 'Reroute via Cape Horn', savingsM: -0.06, delayDays: 10, confidence: 60 },
    ],
    urgency: 'high', expiresIn: '0h 45m',
  },
  {
    id: 'dec-002',
    shipmentName: 'Mumbai Auto Parts',
    shipmentId: 'SHP-004',
    type: 'truck',
    disruption: 'Severe Weather — Bay of Bengal',
    severity: 'warning',
    aiRec: 'Delay departure by 48h to avoid severe weather, then proceed on standard route.',
    options: [
      { id: 'opt-c', label: 'Delay 48h & Proceed', savingsM: 1.8, delayDays: 2, confidence: 88 },
      { id: 'opt-d', label: 'Insure & Continue', savingsM: 0.4, delayDays: 0, confidence: 55 },
    ],
    urgency: 'medium', expiresIn: '6h 40m',
  },
  {
    id: 'dec-003',
    shipmentName: 'Frankfurt Pharma Shipment',
    shipmentId: 'SHP-006',
    type: 'aircraft',
    disruption: 'Supplier Capacity Risk',
    severity: 'warning',
    aiRec: 'Pre-emptively source 30% from Tier-2 supplier to hedge against primary supplier risk.',
    options: [
      { id: 'opt-e', label: 'Activate Tier-2 (30%)', savingsM: 0.9, delayDays: 0, confidence: 82 },
      { id: 'opt-f', label: 'Monitor & Wait', savingsM: 0, delayDays: 0, confidence: 40 },
    ],
    urgency: 'low', expiresIn: '18h 00m',
  },
];

const TYPE_ICONS = { vessel: Ship, truck: Truck, aircraft: Plane };

export default function DecisionCenter({ activeDisruptions = [], onDecisionMade }) {
  const [approved, setApproved] = useState(new Set());
  const [deferred, setDeferred] = useState(new Set());
  const [selected, setSelected] = useState(() => {
    const init = {};
    DECISIONS.forEach(d => { init[d.id] = d.options[0].id; });
    return init;
  });

  const pending = DECISIONS.filter(d => !approved.has(d.id) && !deferred.has(d.id)).length;

  function handleApprove(id) {
    setApproved(prev => new Set([...prev, id]));
    if (onDecisionMade) onDecisionMade({ id, optionId: selected[id], action: 'approved' });
  }

  return (
    <div className="dc-page">
      <div className="dc-hdr">
        <div className="dc-hdr-left">
          <div className="dc-hdr-icon"><CheckCircle2 size={20} /></div>
          <div>
            <h2 className="dc-title">
              Decision Center
              <InfoTooltip text="Review, approve, or defer AI-recommended mitigation strategies. This acts as the final human-in-the-loop validation step before actions are executed." position="right" />
            </h2>
            <p className="dc-sub">AI-recommended actions awaiting your approval</p>
          </div>
        </div>
        <div className="dc-counts">
          <div className="dc-count"><span style={{color:'#f87171'}}>{pending}</span><small>Pending</small></div>
          <div className="dc-count"><span style={{color:'#34d399'}}>{approved.size}</span><small>Approved</small></div>
          <div className="dc-count"><span style={{color:'#fbbf24'}}>{deferred.size}</span><small>Deferred</small></div>
        </div>
      </div>

      {activeDisruptions.length > 0 && (
        <div className="dc-banner">
          <Zap size={14} color="#f87171" />
          {activeDisruptions.length} live disruption(s) active — decisions are time-sensitive
        </div>
      )}

      <div className="dc-list">
        {DECISIONS.map((d, idx) => {
          const Icon = TYPE_ICONS[d.type] || Ship;
          const isApproved = approved.has(d.id);
          const isDeferred = deferred.has(d.id);
          const selOpt = d.options.find(o => o.id === selected[d.id]);
          return (
            <div key={d.id} className={`dc-card glass-panel animate-slide-up ${d.urgency === 'high' ? 'dc-urgent' : ''}`} style={{animationDelay:`${idx*0.08}s`}}>
              <div className="dc-card-top">
                <div className="dc-card-left">
                  <div className={`dc-icon ${d.severity}`}><Icon size={16}/></div>
                  <div>
                    <div className="dc-name">{d.shipmentName}</div>
                    <div className="dc-id">{d.shipmentId}</div>
                  </div>
                </div>
                <div className="dc-card-right">
                  <span className={`badge badge-${d.severity}`}>{d.severity.toUpperCase()}</span>
                  <div className="dc-exp"><Clock size={11}/> {d.expiresIn}</div>
                </div>
              </div>

              <div className="dc-dis-row"><AlertTriangle size={12} color="#f87171"/> {d.disruption}</div>

              <div className="dc-ai-box">
                <div className="dc-ai-lbl"><Sparkles size={12} color="#a78bfa"/> Gemini Recommendation</div>
                <p className="dc-ai-txt">{d.aiRec}</p>
              </div>

              <div className="dc-opts">
                {d.options.map(opt => (
                  <button
                    key={opt.id}
                    className={`dc-opt ${selected[d.id] === opt.id ? 'sel' : ''}`}
                    onClick={() => !isApproved && !isDeferred && setSelected(prev => ({...prev, [d.id]: opt.id}))}
                    disabled={isApproved || isDeferred}
                  >
                    <div className="dc-opt-top">
                      <span className="dc-opt-lbl">{opt.label}</span>
                      <span className="dc-opt-conf">{opt.confidence}%</span>
                    </div>
                    <div className="dc-opt-stats">
                      <span style={{color:'#34d399'}}><DollarSign size={10}/>₹{opt.savingsM > 0 ? opt.savingsM : 0}Cr</span>
                      <span style={{color:'#fbbf24'}}><Clock size={10}/>+{opt.delayDays}d</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="dc-actions">
                {isApproved ? (
                  <div className="dc-approved-msg"><CheckCircle2 size={14}/> Approved — Executing Option: {d.options.find(o=>o.id===selected[d.id])?.label}</div>
                ) : isDeferred ? (
                  <div className="dc-deferred-msg"><Clock size={14}/> Decision Deferred</div>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={() => handleApprove(d.id)}>
                      <CheckCircle2 size={14}/> Approve & Execute
                    </button>
                    <InfoTooltip text="Instantly execute this strategy. The system will update carriers, reroute shipments, and adjust inventory automatically." position="bottom" />
                    <button className="btn btn-ghost" onClick={() => setDeferred(prev => new Set([...prev, d.id]))}>
                      <Clock size={14}/> Defer
                    </button>
                    <InfoTooltip text="Postpone this decision to gather more data or wait for conditions to change." position="bottom" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .dc-page { display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 24px; }
        .dc-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .dc-hdr-left { display: flex; gap: 12px; align-items: center; }
        .dc-hdr-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); display: flex; align-items: center; justify-content: center; color: var(--status-safe); }
        .dc-title { font-size: 1.1rem; font-weight: 800; }
        .dc-sub { font-size: 0.75rem; color: var(--text-muted); }
        .dc-counts { display: flex; gap: 20px; }
        .dc-count { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .dc-count span { font-size: 1.4rem; font-weight: 900; font-family: var(--font-mono); }
        .dc-count small { font-size: 0.62rem; color: var(--text-muted); text-transform: uppercase; }
        .dc-banner { display: flex; align-items: center; gap: 8px; padding: 10px 14px; margin-bottom: 18px; background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.2); border-radius: var(--radius-md); font-size: 0.78rem; color: var(--status-critical); }
        .dc-list { display: flex; flex-direction: column; gap: 14px; }
        .dc-card { padding: 18px; }
        .dc-card.dc-urgent { border-color: rgba(248,113,113,0.3); }
        .dc-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .dc-card-left { display: flex; gap: 10px; align-items: center; }
        .dc-icon { width: 34px; height: 34px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .dc-icon.critical { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
        .dc-icon.warning { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
        .dc-name { font-size: 0.9rem; font-weight: 700; }
        .dc-id { font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono); }
        .dc-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
        .dc-exp { display: flex; align-items: center; gap: 4px; font-size: 0.68rem; color: var(--text-muted); }
        .dc-dis-row { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px; background: rgba(248,113,113,0.04); padding: 6px 10px; border-radius: var(--radius-sm); }
        .dc-ai-box { padding: 10px 12px; background: rgba(167,139,250,0.06); border: 1px solid rgba(167,139,250,0.15); border-radius: var(--radius-md); margin-bottom: 12px; }
        .dc-ai-lbl { display: flex; align-items: center; gap: 6px; font-size: 0.68rem; font-weight: 700; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 5px; }
        .dc-ai-txt { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; }
        .dc-opts { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
        .dc-opt { flex: 1; min-width: 160px; padding: 10px 12px; border-radius: var(--radius-md); background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); cursor: pointer; text-align: left; transition: all var(--transition-fast); font-family: var(--font-sans); }
        .dc-opt:hover:not(:disabled) { border-color: rgba(56,189,248,0.3); background: rgba(56,189,248,0.05); }
        .dc-opt.sel { border-color: rgba(56,189,248,0.4); background: rgba(56,189,248,0.08); }
        .dc-opt:disabled { cursor: default; }
        .dc-opt-top { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .dc-opt-lbl { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
        .dc-opt-conf { font-size: 0.65rem; color: var(--accent-blue); font-weight: 600; }
        .dc-opt-stats { display: flex; gap: 10px; }
        .dc-opt-stats span { display: flex; align-items: center; gap: 3px; font-size: 0.68rem; font-weight: 600; }
        .dc-actions { display: flex; gap: 8px; }
        .dc-approved-msg { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--status-safe); font-weight: 600; padding: 8px 12px; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); border-radius: var(--radius-md); }
        .dc-deferred-msg { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; padding: 8px 12px; background: rgba(100,116,139,0.06); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); }
      `}</style>
    </div>
  );
}
