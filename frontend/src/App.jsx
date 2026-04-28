/**
 * ChainGuard 3.0 — AI-Powered Supply Chain Control Tower
 * Full PRD-compliant App with proper layouts, error handling, and mock data fallbacks.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Map, AlertTriangle, Users, BarChart3, Factory,
  Shield, CheckCircle2, Settings, Wifi, WifiOff
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
  { id: 'command',   icon: Map,          label: 'Command Center',   color: '#38bdf8', group: 'main' },
  { id: 'decisions', icon: CheckCircle2, label: 'Decision Center',  color: '#34d399', group: 'main', badge: 'decisions' },
  { id: 'warroom',   icon: Users,        label: 'War Room',         color: '#22d3ee', group: 'main', badge: 'alerts' },
  { id: 'suppliers', icon: Factory,      label: 'Supplier Network', color: '#fbbf24', group: 'main' },
  { id: 'analytics', icon: BarChart3,    label: 'Analytics',        color: '#a78bfa', group: 'main' },
  { id: 'settings',  icon: Settings,     label: 'Settings',         color: '#64748b', group: 'bottom' },
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
  const [apiOnline, setApiOnline] = useState(null); // null=unknown, true=online, false=offline
  const [activeView, setActiveView] = useState('command');
  const [bottomTab, setBottomTab] = useState('disruptions');
  const [navHovered, setNavHovered] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
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
      setApiOnline(true);
      if (selectedShipment) {
        const updated = (shipRes.shipments || []).find(s => s.id === selectedShipment.id);
        if (updated) setSelectedShipment(updated);
      }
    } catch {
      setApiOnline(false);
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
  const pendingDecisions = 3;
  const safeStats = stats || {};

  return (
    <div className="app-shell">
      {/* Top Bar */}
      <TopBar
        stats={safeStats}
        activeDisruptions={activeDisruptions}
        onRefresh={loadData}
        loading={loading}
        apiOnline={apiOnline}
      />

      {/* Connection Banner */}
      {apiOnline === false && (
        <div className="connection-banner">
          <WifiOff size={13} />
          <span>Backend offline — showing cached data. Live features require the API server.</span>
          <button className="banner-retry" onClick={loadData}>
            <Wifi size={12} /> Retry
          </button>
        </div>
      )}

      <div className="app-body">
        {/* Navigation Sidebar */}
        <nav
          className={`nav-sidebar ${navHovered ? 'expanded' : ''}`}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        >
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <Shield size={15} />
            </div>
            {navHovered && (
              <span className="nav-brand-text">
                ChainGuard <span className="nav-brand-ver">3.0</span>
              </span>
            )}
          </div>

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
                  title={item.label}
                >
                  {isActive && <div className="nav-active-indicator" style={{ background: item.color }} />}
                  <div className="nav-icon-wrap" style={{ color: isActive ? item.color : undefined }}>
                    <Icon size={18} />
                  </div>
                  {navHovered && (
                    <span className="nav-btn-label" style={{ color: isActive ? item.color : undefined }}>
                      {item.label}
                    </span>
                  )}
                  {badge > 0 && (
                    <span className={`nav-badge ${navHovered ? '' : 'nav-badge-dot'}`}>
                      {navHovered ? badge : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="nav-footer">
            {NAV_ITEMS.filter(n => n.group === 'bottom').map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                  title={item.label}
                >
                  {isActive && <div className="nav-active-indicator" style={{ background: item.color }} />}
                  <div className="nav-icon-wrap" style={{ color: isActive ? item.color : undefined }}>
                    <Icon size={18} />
                  </div>
                  {navHovered && (
                    <span className="nav-btn-label" style={{ color: isActive ? item.color : undefined }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
            {navHovered && (
              <div className="nav-api-status">
                <div className={`api-dot ${apiOnline === true ? 'online' : apiOnline === false ? 'offline' : 'unknown'}`} />
                <span>{apiOnline === true ? 'API Online' : apiOnline === false ? 'API Offline' : 'Connecting...'}</span>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content — all views use flex:1 so they fill the space */}
        <div className="app-main">

          {/* COMMAND CENTER */}
          {activeView === 'command' && (
            <div className="command-center animate-fade-in">
              {/* Left Sidebar */}
              <div className="app-sidebar-left">
                <div className="sidebar-kpi-strip">
                  <div className="kpi-mini">
                    <span style={{color:'#38bdf8'}}>{safeStats.total_shipments || shipments.length || 0}</span>
                    <small>Shipments</small>
                  </div>
                  <div className="kpi-mini" style={{borderColor: alertCount > 0 ? 'rgba(248,113,113,0.2)' : undefined}}>
                    <span style={{color: alertCount > 0 ? '#f87171' : '#34d399'}}>{alertCount}</span>
                    <small>Alerts</small>
                  </div>
                  <div className="kpi-mini">
                    <span style={{color:'#a78bfa'}}>{safeStats.decisions_made || 0}</span>
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
                    >⚡ Simulator</button>
                    <button
                      className={`sidebar-tab ${bottomTab === 'whatif' ? 'active' : ''}`}
                      onClick={() => setBottomTab('whatif')}
                    >🧠 What-If AI</button>
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

              {/* Right: Alert Feed or Shipment Panel */}
              {selectedShipment ? (
                <ShipmentPanel
                  shipment={selectedShipment}
                  activeDisruptions={activeDisruptions}
                  onClose={() => setSelectedShipment(null)}
                  onDecisionMade={loadData}
                />
              ) : (
                <div className="app-alert-feed">
                  <AlertFeed activeDisruptions={activeDisruptions} shipments={shipments} />
                </div>
              )}
            </div>
          )}

          {/* DECISION CENTER */}
          {activeView === 'decisions' && (
            <div className="full-view">
              <DecisionCenter activeDisruptions={activeDisruptions} onDecisionMade={loadData} />
            </div>
          )}

          {/* WAR ROOM */}
          {activeView === 'warroom' && (
            <div className="full-view">
              <WarRoom activeDisruptions={activeDisruptions} shipments={shipments} stats={safeStats} />
            </div>
          )}

          {/* SUPPLIER NETWORK */}
          {activeView === 'suppliers' && (
            <div className="full-view">
              <SupplierGraph suppliers={suppliers} />
            </div>
          )}

          {/* ANALYTICS */}
          {activeView === 'analytics' && (
            <div className="full-view analytics-scroll">
              <div className="analytics-inner">
                <KPICards stats={safeStats} shipments={shipments} />
                <Analytics stats={safeStats} shipments={shipments} />
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeView === 'settings' && (
            <div className="full-view">
              <SettingsPage />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <StatsBar stats={safeStats} />

      {/* Floating AI Chat */}
      <ChatWidget />

      <style>{`
        /* ══════════════════════════════════════════════
           APP SHELL
        ══════════════════════════════════════════════ */
        .app-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: var(--bg-primary);
        }

        /* ── Connection Banner ── */
        .connection-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 6px 16px;
          background: rgba(248,113,113,0.06);
          border-bottom: 1px solid rgba(248,113,113,0.15);
          color: rgba(248,113,113,0.9);
          font-size: 0.78rem;
          font-weight: 500;
          flex-shrink: 0;
        }
        .banner-retry {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: rgba(248,113,113,0.12);
          border: 1px solid rgba(248,113,113,0.25);
          color: inherit;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: all var(--transition-fast);
          margin-left: 8px;
        }
        .banner-retry:hover { background: rgba(248,113,113,0.2); }

        /* ══════════════════════════════════════════════
           BODY LAYOUT
        ══════════════════════════════════════════════ */
        .app-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        /* ══════════════════════════════════════════════
           NAVIGATION SIDEBAR
        ══════════════════════════════════════════════ */
        .nav-sidebar {
          width: 58px;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          flex-shrink: 0;
          transition: width 200ms cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
          z-index: 100;
        }
        .nav-sidebar.expanded { width: 216px; }

        .nav-brand {
          height: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 17px;
          border-bottom: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }
        .nav-brand-icon {
          width: 26px; height: 26px;
          border-radius: var(--radius-sm);
          background: var(--gradient-primary);
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .nav-brand-text {
          font-weight: 800; font-size: 0.92rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
        }
        .nav-brand-ver {
          font-size: 0.68rem; font-weight: 600;
          -webkit-text-fill-color: var(--text-muted);
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .nav-items {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 10px 0;
          gap: 1px;
          overflow: hidden;
        }
        .nav-footer {
          padding: 8px 0;
          border-top: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        .nav-btn {
          position: relative;
          width: 100%;
          min-height: 44px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          transition: background 150ms ease, color 150ms ease;
          font-family: var(--font-sans);
          text-align: left;
          overflow: hidden;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-secondary);
        }
        .nav-btn.active {
          background: rgba(56,189,248,0.07);
        }
        .nav-active-indicator {
          position: absolute;
          left: 0; top: 22%; width: 3px; height: 56%;
          border-radius: 0 3px 3px 0;
        }
        .nav-icon-wrap {
          flex-shrink: 0;
          width: 20px;
          display: flex; align-items: center; justify-content: center;
          transition: color 150ms ease;
        }
        .nav-btn-label {
          font-size: 0.84rem; font-weight: 600;
          white-space: nowrap; color: inherit;
          transition: color 150ms ease;
        }
        .nav-badge {
          margin-left: auto;
          min-width: 20px; height: 20px;
          border-radius: var(--radius-full);
          background: #f87171; color: white;
          font-size: 0.62rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px;
        }
        .nav-badge-dot {
          width: 8px; height: 8px;
          min-width: unset; padding: 0;
          position: absolute; top: 9px; right: 9px;
          animation: pulse-dot 2s infinite;
        }

        .nav-api-status {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 20px 4px;
          font-size: 0.68rem; color: var(--text-muted);
          white-space: nowrap;
        }
        .api-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }
        .api-dot.online { background: #34d399; animation: pulse-dot 2s infinite; }
        .api-dot.offline { background: #f87171; }
        .api-dot.unknown { background: #fbbf24; animation: pulse-dot 1s infinite; }

        /* ══════════════════════════════════════════════
           MAIN CONTENT
        ══════════════════════════════════════════════ */
        .app-main {
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* All full-page views use this wrapper */
        .full-view {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Command Center ── */
        .command-center {
          flex: 1;
          min-height: 0;
          display: flex;
          overflow: hidden;
        }
        .app-sidebar-left {
          width: 290px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(16px);
          border-right: 1px solid var(--border-subtle);
          overflow: hidden;
        }
        .sidebar-kpi-strip {
          display: flex;
          flex-shrink: 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .kpi-mini {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1px; padding: 10px 4px;
          border-right: 1px solid var(--border-subtle);
          transition: background var(--transition-fast);
        }
        .kpi-mini:last-child { border-right: none; }
        .kpi-mini:hover { background: rgba(255,255,255,0.02); }
        .kpi-mini span {
          font-size: 1.25rem; font-weight: 900;
          font-family: var(--font-mono); line-height: 1;
        }
        .kpi-mini small {
          font-size: 0.6rem; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .sidebar-shipments {
          flex: 1;
          overflow: hidden;
          display: flex; flex-direction: column;
          min-height: 0;
        }
        .sidebar-bottom-section {
          flex-shrink: 0;
          display: flex; flex-direction: column;
          border-top: 1px solid var(--border-subtle);
          height: 42%;
          min-height: 190px;
          max-height: 340px;
        }
        .sidebar-tabs {
          display: flex;
          flex-shrink: 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sidebar-tab {
          flex: 1;
          padding: 8px 4px;
          font-size: 0.75rem; font-weight: 600;
          color: var(--text-muted);
          background: none; border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: all var(--transition-fast);
        }
        .sidebar-tab:hover { color: var(--text-secondary); }
        .sidebar-tab.active {
          color: var(--accent-blue);
          border-bottom-color: var(--accent-blue);
          background: rgba(56,189,248,0.04);
        }
        .sidebar-tab-content {
          flex: 1; overflow-y: auto; min-height: 0;
        }
        .app-center {
          flex: 1; min-width: 0;
          padding: 8px;
        }
        .app-alert-feed {
          width: 290px; flex-shrink: 0;
          border-left: 1px solid var(--border-subtle);
          overflow: hidden;
          display: flex; flex-direction: column;
        }

        /* ── Analytics scroll container ── */
        .analytics-scroll {
          overflow-y: auto;
        }
        .analytics-inner {
          padding: 24px;
          min-height: 100%;
        }
      `}</style>
    </div>
  );
}
