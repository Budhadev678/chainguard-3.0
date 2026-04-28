/**
 * ChainGuard 3.0 — AI-Powered Supply Chain Control Tower
 * Full PRD-compliant navigation and layout.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Map, AlertTriangle, FlaskConical, Users, BarChart3, Factory,
  Shield, CheckCircle2, Settings, HelpCircle, Menu, X, Zap
} from 'lucide-react';
import TopBar from './components/TopBar';
import ShipmentMap from './components/ShipmentMap';
import ShipmentList from './components/ShipmentList';
import ShipmentPanel from './components/ShipmentPanel';
import DisruptionControl from './components/DisruptionControl';
import WhatIfPanel from './components/WhatIfPanel';
import StatsBar from './components/StatsBar';
import WarRoom from './components/WarRoom/WarRoom';
import SupplierGraph from './components/Suppliers/SupplierGraph';
import Analytics from './components/Analytics/Analytics';
import ChatWidget from './components/ChatWidget';
import KPICards from './components/Dashboard/KPICards';
import AlertFeed from './components/Dashboard/AlertFeed';
import DecisionCenter from './components/Decisions/DecisionCenter';
import SettingsPage from './components/Settings/SettingsPage';
import {
  fetchShipments, fetchDisruptions, fetchActiveDisruptions,
  fetchWarehouses, fetchSuppliers, fetchStats,
  simulateDisruption, clearDisruptions,
} from './api';

const NAV_ITEMS = [
  { id: 'command',    icon: Map,          label: 'Command Center',  color: '#38bdf8', group: 'main' },
  { id: 'decisions',  icon: CheckCircle2, label: 'Decision Center', color: '#34d399', group: 'main', badge: 'decisions' },
  { id: 'warroom',    icon: Users,        label: 'War Room',        color: '#22d3ee', group: 'main', badge: 'alerts' },
  { id: 'suppliers',  icon: Factory,      label: 'Supplier Network',color: '#fbbf24', group: 'main' },
  { id: 'analytics',  icon: BarChart3,    label: 'Analytics',       color: '#a78bfa', group: 'main' },
  { id: 'settings',   icon: Settings,     label: 'Settings',        color: '#64748b', group: 'bottom' },
];

export default function App() {
  const [shipments, setShipments] = useState([]);
  const [disruptions, setDisruptions] = useState([]);
  const [activeDisruptions, setActiveDisruptions] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('command');
  const [bottomTab, setBottomTab] = useState('disruptions');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [shipRes, disRes, activeRes, whRes, supRes, statsRes] = await Promise.all([
        fetchShipments(), fetchDisruptions(), fetchActiveDisruptions(),
        fetchWarehouses(), fetchSuppliers(), fetchStats(),
      ]);
      setShipments(shipRes.shipments || []);
      setDisruptions(disRes.disruptions || []);
      setActiveDisruptions(activeRes.active || []);
      setWarehouses(whRes.warehouses || []);
      setSuppliers(supRes.suppliers || []);
      setStats(statsRes);
      if (selectedShipment) {
        const updated = (shipRes.shipments || []).find(s => s.id === selectedShipment.id);
        if (updated) setSelectedShipment(updated);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [selectedShipment?.id]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleSimulateDisruption(id) {
    try { await simulateDisruption(id); await loadData(); } catch(e) { console.error(e); }
  }

  async function handleClearDisruptions() {
    try { await clearDisruptions(); setSelectedShipment(null); await loadData(); } catch(e) { console.error(e); }
  }

  function handleSelectShipment(shipment) {
    setSelectedShipment(prev => prev?.id === shipment.id ? null : shipment);
    if (activeView !== 'command') setActiveView('command');
  }

  const alertCount = activeDisruptions.length;
  const pendingDecisions = 3; // Would come from API in full impl

  const isNavExpanded = sidebarExpanded || navHovered;

  return (
    <div className="app-shell">
      {/* Top Bar */}
      <TopBar stats={stats} activeDisruptions={activeDisruptions} onRefresh={loadData} loading={loading} />

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <AlertTriangle size={14} />
          <span>Backend connection issue: {error}</span>
          <button className="btn btn-ghost btn-sm" onClick={loadData}>Retry</button>
        </div>
      )}

      <div className="app-body">
        {/* Navigation Sidebar */}
        <nav
          className={`nav-sidebar ${isNavExpanded ? 'expanded' : ''}`}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        >
          {/* Brand mini when collapsed */}
          {!isNavExpanded && (
            <div className="nav-brand-mini">
              <Shield size={18} style={{ color: 'var(--accent-blue)' }} />
            </div>
          )}
          {isNavExpanded && (
            <div className="nav-brand-full">
              <div className="nav-brand-icon"><Shield size={16} /></div>
              <span>ChainGuard</span>
              <span className="nav-brand-ver">3.0</span>
            </div>
          )}

          <div className="nav-items">
            {NAV_ITEMS.filter(n => n.group === 'main').map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const badge = item.badge === 'alerts' ? alertCount :
                            item.badge === 'decisions' ? pendingDecisions : 0;
              return (
                <button
                  key={item.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                  style={isActive ? { '--nav-color': item.color } : {}}
                  title={!isNavExpanded ? item.label : undefined}
                >
                  {isActive && <div className="nav-active-bar" style={{ background: item.color }} />}
                  <div className="nav-icon" style={{ color: isActive ? item.color : undefined }}>
                    <Icon size={17} />
                  </div>
                  {isNavExpanded && <span className="nav-label-text">{item.label}</span>}
                  {badge > 0 && <span className="nav-badge">{badge}</span>}
                </button>
              );
            })}
          </div>

          <div className="nav-bottom">
            {NAV_ITEMS.filter(n => n.group === 'bottom').map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                  title={!isNavExpanded ? item.label : undefined}
                >
                  {isActive && <div className="nav-active-bar" style={{ background: item.color }} />}
                  <div className="nav-icon" style={{ color: isActive ? item.color : undefined }}>
                    <Icon size={17} />
                  </div>
                  {isNavExpanded && <span className="nav-label-text">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <div className="app-main">

          {/* COMMAND CENTER */}
          {activeView === 'command' && (
            <div className="command-center animate-fade-in">
              {/* Left Sidebar */}
              <div className="app-sidebar-left">
                {/* KPI mini strip */}
                <div className="sidebar-kpi-strip">
                  <div className="kpi-mini" title="Shipments">
                    <span style={{color:'#38bdf8'}}>{stats?.total_shipments || shipments.length || 0}</span>
                    <small>Ships</small>
                  </div>
                  <div className="kpi-mini" title="Active Disruptions">
                    <span style={{color:'#f87171'}}>{alertCount}</span>
                    <small>Alerts</small>
                  </div>
                  <div className="kpi-mini" title="Decisions Made">
                    <span style={{color:'#34d399'}}>{stats?.decisions_made || 0}</span>
                    <small>Decided</small>
                  </div>
                </div>

                <div className="sidebar-shipments">
                  <ShipmentList
                    shipments={shipments}
                    selectedId={selectedShipment?.id}
                    onSelect={handleSelectShipment}
                  />
                </div>

                <div className="sidebar-bottom-section">
                  <div className="sidebar-tabs">
                    <button
                      className={`sidebar-tab ${bottomTab === 'disruptions' ? 'active' : ''}`}
                      onClick={() => setBottomTab('disruptions')}
                    >
                      ⚡ Simulator
                    </button>
                    <button
                      className={`sidebar-tab ${bottomTab === 'whatif' ? 'active' : ''}`}
                      onClick={() => setBottomTab('whatif')}
                    >
                      🧠 What-If AI
                    </button>
                  </div>
                  <div className="sidebar-tab-content">
                    {bottomTab === 'disruptions' && (
                      <DisruptionControl
                        disruptions={disruptions}
                        activeDisruptions={activeDisruptions}
                        onSimulate={handleSimulateDisruption}
                        onClear={handleClearDisruptions}
                        loading={loading}
                      />
                    )}
                    {bottomTab === 'whatif' && <WhatIfPanel />}
                  </div>
                </div>
              </div>

              {/* Center Map */}
              <div className="app-center">
                <ShipmentMap
                  shipments={shipments}
                  activeDisruptions={activeDisruptions}
                  warehouses={warehouses}
                  selectedShipment={selectedShipment}
                  onSelectShipment={handleSelectShipment}
                />
              </div>

              {/* Right Panel */}
              {selectedShipment && (
                <ShipmentPanel
                  shipment={selectedShipment}
                  activeDisruptions={activeDisruptions}
                  onClose={() => setSelectedShipment(null)}
                  onDecisionMade={loadData}
                />
              )}

              {/* Alert Feed overlay when no shipment selected */}
              {!selectedShipment && (
                <div className="app-alert-feed">
                  <AlertFeed activeDisruptions={activeDisruptions} shipments={shipments} />
                </div>
              )}
            </div>
          )}

          {/* DECISION CENTER */}
          {activeView === 'decisions' && (
            <DecisionCenter
              activeDisruptions={activeDisruptions}
              onDecisionMade={loadData}
            />
          )}

          {/* WAR ROOM */}
          {activeView === 'warroom' && (
            <WarRoom activeDisruptions={activeDisruptions} shipments={shipments} stats={stats} />
          )}

          {/* SUPPLIER NETWORK */}
          {activeView === 'suppliers' && (
            <SupplierGraph suppliers={suppliers} />
          )}

          {/* ANALYTICS */}
          {activeView === 'analytics' && (
            <div className="analytics-view animate-fade-in">
              <KPICards stats={stats} shipments={shipments} />
              <Analytics stats={stats} shipments={shipments} />
            </div>
          )}

          {/* SETTINGS */}
          {activeView === 'settings' && <SettingsPage />}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <StatsBar stats={stats} />

      {/* Floating AI Chat */}
      <ChatWidget />

      <style>{`
        .app-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: var(--bg-primary);
        }
        .error-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 7px 16px;
          background: rgba(248,113,113,0.07);
          border-bottom: 1px solid rgba(248,113,113,0.18);
          color: var(--status-critical);
          font-size: 0.8rem;
          font-weight: 500;
        }
        .app-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* ── Navigation Sidebar ── */
        .nav-sidebar {
          width: 56px;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          flex-shrink: 0;
          transition: width var(--transition-base);
          overflow: hidden;
          z-index: 200;
        }
        .nav-sidebar.expanded {
          width: 210px;
        }
        .nav-brand-mini {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border-subtle);
        }
        .nav-brand-full {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          border-bottom: 1px solid var(--border-subtle);
          white-space: nowrap;
          font-weight: 800;
          font-size: 0.95rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-brand-icon {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          -webkit-text-fill-color: white;
        }
        .nav-brand-ver {
          font-size: 0.65rem;
          color: var(--text-muted);
          -webkit-text-fill-color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .nav-items {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 8px 0;
          gap: 2px;
        }
        .nav-bottom {
          padding: 8px 0;
          border-top: 1px solid var(--border-subtle);
        }
        .nav-btn {
          position: relative;
          width: 100%;
          min-height: 42px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 18px;
          transition: all var(--transition-fast);
          font-family: var(--font-sans);
          overflow: hidden;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-secondary);
        }
        .nav-btn.active {
          background: rgba(56,189,248,0.07);
          color: var(--text-primary);
        }
        .nav-active-bar {
          position: absolute;
          left: 0;
          top: 20%;
          width: 3px;
          height: 60%;
          border-radius: 0 3px 3px 0;
        }
        .nav-icon {
          flex-shrink: 0;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-label-text {
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          color: inherit;
        }
        .nav-badge {
          margin-left: auto;
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          background: var(--status-critical);
          color: white;
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          animation: pulse-dot 2s infinite;
        }

        /* ── Main Content ── */
        .app-main {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Command Center Layout ── */
        .command-center {
          flex: 1;
          display: flex;
          overflow: hidden;
          position: relative;
        }
        .app-sidebar-left {
          width: 280px;
          display: flex;
          flex-direction: column;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(16px);
          border-right: 1px solid var(--border-subtle);
          overflow: hidden;
          flex-shrink: 0;
        }
        .sidebar-kpi-strip {
          display: flex;
          border-bottom: 1px solid var(--border-subtle);
          padding: 8px 0;
        }
        .kpi-mini {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          padding: 4px;
          border-right: 1px solid var(--border-subtle);
        }
        .kpi-mini:last-child { border-right: none; }
        .kpi-mini span { font-size: 1.1rem; font-weight: 900; font-family: var(--font-mono); }
        .kpi-mini small { font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase; }
        .sidebar-shipments {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .sidebar-bottom-section {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border-subtle);
          max-height: 45%;
          min-height: 180px;
        }
        .sidebar-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sidebar-tab {
          flex: 1;
          padding: 7px;
          font-size: 0.73rem;
          font-weight: 600;
          color: var(--text-muted);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: all var(--transition-fast);
        }
        .sidebar-tab:hover { color: var(--text-secondary); }
        .sidebar-tab.active {
          color: var(--accent-blue);
          border-bottom-color: var(--accent-blue);
        }
        .sidebar-tab-content {
          flex: 1;
          overflow-y: auto;
        }
        .app-center {
          flex: 1;
          padding: 8px;
          min-width: 0;
          position: relative;
        }
        .app-alert-feed {
          width: 280px;
          flex-shrink: 0;
          border-left: 1px solid var(--border-subtle);
          overflow: hidden;
        }

        /* ── Analytics view ── */
        .analytics-view {
          padding: 24px;
          height: 100%;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
