/**
 * ChainGuard 3.0 — KPI Cards
 * 4 primary KPI cards: Active Shipments, High Risk, Pending Decisions, CO2 Impact
 */
import { useState, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle2, Leaf, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

const KPI_CONFIG = [
  {
    key: 'active_shipments',
    dataKey: 'total_shipments',
    label: 'Active Shipments',
    icon: Package,
    color: '#38bdf8',
    gradientFrom: 'rgba(56,189,248,0.15)',
    gradientTo: 'rgba(56,189,248,0.02)',
    borderColor: 'rgba(56,189,248,0.25)',
    trend: +8,
    suffix: '',
    subtitle: 'In Transit',
    tooltip: 'Total number of shipments currently in transit across all modes.'
  },
  {
    key: 'high_risk',
    dataKey: 'active_disruptions',
    label: 'High Risk',
    icon: AlertTriangle,
    color: '#f87171',
    gradientFrom: 'rgba(248,113,113,0.15)',
    gradientTo: 'rgba(248,113,113,0.02)',
    borderColor: 'rgba(248,113,113,0.25)',
    trend: -3,
    suffix: '',
    subtitle: 'Need Attention',
    tooltip: 'Shipments currently flagged with critical or warning risk levels requiring immediate intervention.'
  },
  {
    key: 'pending_decisions',
    dataKey: 'decisions_made',
    label: 'Pending Decisions',
    icon: CheckCircle2,
    color: '#a78bfa',
    gradientFrom: 'rgba(167,139,250,0.15)',
    gradientTo: 'rgba(167,139,250,0.02)',
    borderColor: 'rgba(167,139,250,0.25)',
    trend: 0,
    suffix: '',
    subtitle: 'Awaiting Approval',
    tooltip: 'Operational checkpoints or routing changes awaiting user confirmation.'
  },
  {
    key: 'co2_impact',
    dataKey: 'carbon_saved_tonnes',
    label: 'CO₂ Impact',
    icon: Leaf,
    color: '#34d399',
    gradientFrom: 'rgba(52,211,153,0.15)',
    gradientTo: 'rgba(52,211,153,0.02)',
    borderColor: 'rgba(52,211,153,0.25)',
    trend: +12,
    suffix: 't',
    subtitle: 'Saved This Month',
    tooltip: 'Estimated carbon emissions offset through optimized routing and carrier selection.'
  },
];

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!target || target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count}{suffix}</>;
}

export default function KPICards({ stats = {}, shipments = [] }) {
  const highRiskCount = shipments.filter(s => s.risk_level === 'critical' || s.risk_level === 'warning').length;

  const values = {
    total_shipments: stats.total_shipments || shipments.length || 0,
    active_disruptions: highRiskCount,
    decisions_made: Math.max(0, (stats.decisions_made || 0)),
    carbon_saved_tonnes: stats.carbon_saved_tonnes || 0,
  };

  return (
    <div className="kpi-grid">
      {KPI_CONFIG.map((kpi) => {
        const Icon = kpi.icon;
        const value = values[kpi.dataKey] || 0;
        const TrendIcon = kpi.trend > 0 ? TrendingUp : kpi.trend < 0 ? TrendingDown : Minus;
        const trendColor = kpi.key === 'high_risk'
          ? (kpi.trend < 0 ? '#34d399' : '#f87171')
          : (kpi.trend > 0 ? '#34d399' : kpi.trend < 0 ? '#f87171' : 'var(--text-muted)');

        return (
          <div
            key={kpi.key}
            className="kpi-card animate-slide-up"
            style={{
              background: `linear-gradient(135deg, ${kpi.gradientFrom}, ${kpi.gradientTo})`,
              borderColor: kpi.borderColor,
            }}
          >
            {/* Icon & Trend */}
            <div className="kpi-top">
              <div className="kpi-icon" style={{ color: kpi.color, background: `${kpi.color}18` }}>
                <Icon size={20} />
              </div>
              {kpi.trend !== 0 && (
                <div className="kpi-trend" style={{ color: trendColor }}>
                  <TrendIcon size={12} />
                  <span>{Math.abs(kpi.trend)}%</span>
                </div>
              )}
            </div>

            {/* Value */}
            <div className="kpi-value" style={{ color: kpi.color }}>
              <CountUp target={value} suffix={kpi.suffix} />
            </div>

            {/* Label */}
            <div className="kpi-label-wrapper">
              <div className="kpi-label">{kpi.label}</div>
              <InfoTooltip text={kpi.tooltip} position="bottom" />
            </div>
            <div className="kpi-subtitle">{kpi.subtitle}</div>

            {/* Glow bar */}
            <div className="kpi-glow-bar" style={{ background: `linear-gradient(90deg, transparent, ${kpi.color}40, transparent)` }} />
          </div>
        );
      })}

      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .kpi-card {
          position: relative;
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid;
          overflow: hidden;
          cursor: default;
          transition: all var(--transition-base);
        }
        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .kpi-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          background: rgba(255,255,255,0.05);
          border-radius: var(--radius-full);
        }
        .kpi-value {
          font-size: 2.4rem;
          font-weight: 900;
          font-family: var(--font-mono);
          line-height: 1;
          margin-bottom: 6px;
        }
        .kpi-label-wrapper { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        .kpi-label { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
        .kpi-subtitle {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .kpi-glow-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
        }

        @media (max-width: 1100px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .kpi-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
