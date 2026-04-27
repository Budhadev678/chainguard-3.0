/**
 * ChainGuard 3.0 — AI-Powered Supply Chain Control Tower
 * Main Application Component with full navigation.
 */
import { useState, useEffect, useCallback } from 'react';
import { Map, AlertTriangle, FlaskConical, Users, BarChart3, Factory, Shield } from 'lucide-react';
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
import {
  fetchShipments,
  fetchDisruptions,
  fetchActiveDisruptions,
  fetchWarehouses,
  fetchSuppliers,
  fetchStats,
  simulateDisruption,
  clearDisruptions,
} from './api';

const NAV_ITEMS = [
  { id: 'command', icon: Map, label: 'Command Center', color: '#38bdf8' },
  { id: 'disruptions', icon: AlertTriangle, label: 'Disruptions', color: '#f87171' },
  { id: 'whatif', icon: FlaskConical, label: 'What-If Lab', color: '#a78bfa' },
  { id: 'warroom', icon: Users, label: 'War Room', color: '#22d3ee' },
  { id: 'suppliers', icon: Factory, label: 'Suppliers', color: '#fbbf24' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', color: '#34d399' },
];

export default function App() {
  // ── State ──
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

  // ── Data Loading ──
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [shipRes, disRes, activeRes, whRes, supRes, statsRes] = await Promise.all([
        fetchShipments(),
        fetchDisruptions(),
        fetchActiveDisruptions(),
        fetchWarehouses(),
        fetchSuppliers(),
        fetchStats(),
      ]);
      setShipments(shipRes.shipments || []);
      setDisruptions(disRes.disruptions || []);
      setActiveDisruptions(activeRes.active || []);
      setWarehouses(whRes.warehouses || []);
      setSuppliers(supRes.suppliers || []);
      setStats(statsRes);

      // Update selected shipment if it exists
      if (selectedShipment) {
        const updated = (shipRes.shipments || []).find(s => s.id === selectedShipment.id);
        if (updated) setSelectedShipment(updated);
      }
    } catch (e) {
      setError(e.message);
      console.error('Failed to load data:', e);
    }
    setLoading(false);
  }, [selectedShipment?.id]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Actions ──
  async function handleSimulateDisruption(disruptionId) {
    try {
      await simulateDisruption(disruptionId);
      await loadData();
    } catch (e) {
      console.error('Failed to simulate:', e);
    }
  }

  async function handleClearDisruptions() {
    try {
      await clearDisruptions();
      setSelectedShipment(null);
      await loadData();
    } catch (e) {
      console.error('Failed to clear:', e);
    }
  }

  function handleSelectShipment(shipment) {
    setSelectedShipment(prev => prev?.id === shipment.id ? null : shipment);
    // Switch to command center if on another view
    if (activeView !== 'command') setActiveView('command');
  }

  async function handleDecisionMade() {
    await loadData();
  }

  function handleNavClick(viewId) {
    setActiveView(viewId);
    // For disruptions / whatif views, switch the bottom tab and stay on command
    if (viewId === 'disruptions') {
      setActiveView('command');
      setBottomTab('disruptions');
    } else if (viewId === 'whatif') {
      setActiveView('command');
      setBottomTab('whatif');
    }
  }

  // Count alerts for nav badges
  const alertCount = activeDisruptions.length;

  return (
    <div className="app-shell">
      {/* Top Bar */}
      <TopBar
        stats={stats}
        activeDisruptions={activeDisruptions}
        onRefresh={loadData}
        loading={loading}
      />

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>⚠️ Backend connection error: {error}</span>
          <span className="error-hint">Make sure the FastAPI server is running on port 8000</span>
        </div>
      )}

      <div className="app-body">
        {/* Navigation Sidebar */}
        <nav className="nav-sidebar">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id ||
              (activeView === 'command' && (item.id === 'disruptions' || item.id === 'whatif'));
            const showBadge = item.id === 'warroom' && alertCount > 0;
            return (
              <button
                key={item.id}
                className={`nav-btn ${(activeView === item.id || 
                  (activeView === 'command' && item.id === 'command')) ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
              >
                <Icon size={18} style={{ color: (activeView === item.id || 
                  (activeView === 'command' && item.id === 'command'))
                  ? item.color : undefined }} />
                <span className="nav-label">{item.label}</span>
                {showBadge && <span className="nav-badge">{alertCount}</span>}
              </button>
            );
          })}
          <div className="nav-spacer" />
          <div className="nav-footer">
            <Shield size={14} style={{ color: 'var(--accent-blue)', opacity: 0.4 }} />
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="app-main">
          {/* COMMAND CENTER VIEW */}
          {activeView === 'command' && (
            <div className="command-center">
              {/* Left Sidebar — Shipment List + Controls */}
              <div className="app-sidebar-left">
                <div className="sidebar-shipments">
                  <ShipmentList
                    shipments={shipments}
                    selectedId={selectedShipment?.id}
                    onSelect={handleSelectShipment}
                  />
                </div>

                {/* Bottom tabs in sidebar */}
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

              {/* Center — Map */}
              <div className="app-center">
                <ShipmentMap
                  shipments={shipments}
                  activeDisruptions={activeDisruptions}
                  warehouses={warehouses}
                  selectedShipment={selectedShipment}
                  onSelectShipment={handleSelectShipment}
                />
              </div>

              {/* Right Panel — Selected Shipment Details */}
              {selectedShipment && (
                <ShipmentPanel
                  shipment={selectedShipment}
                  activeDisruptions={activeDisruptions}
                  onClose={() => setSelectedShipment(null)}
                  onDecisionMade={handleDecisionMade}
                />
              )}
            </div>
          )}

          {/* WAR ROOM VIEW */}
          {activeView === 'warroom' && (
            <WarRoom
              activeDisruptions={activeDisruptions}
              shipments={shipments}
              stats={stats}
            />
          )}

          {/* SUPPLIER NETWORK VIEW */}
          {activeView === 'suppliers' && (
            <SupplierGraph suppliers={suppliers} />
          )}

          {/* ANALYTICS VIEW */}
          {activeView === 'analytics' && (
            <Analytics stats={stats} shipments={shipments} />
          )}
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
          gap: 12px;
          padding: 8px 16px;
          background: rgba(248,113,113,0.08);
          border-bottom: 1px solid rgba(248,113,113,0.2);
          color: var(--status-critical);
          font-size: 0.82rem;
          font-weight: 500;
        }
        .error-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .app-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* ── Navigation Sidebar ── */
        .nav-sidebar {
          width: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
          gap: 2px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }
        .nav-btn {
          position: relative;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .nav-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .nav-btn.active {
          background: rgba(56,189,248,0.08);
          color: var(--accent-blue);
        }
        .nav-btn.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          border-radius: 0 3px 3px 0;
          background: var(--accent-blue);
        }
        .nav-label {
          position: absolute;
          left: 56px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-medium);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease;
          z-index: 100;
          color: var(--text-primary);
          box-shadow: var(--shadow-md);
        }
        .nav-btn:hover .nav-label {
          opacity: 1;
        }
        .nav-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--status-critical);
          color: white;
          font-size: 0.55rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-dot 2s infinite;
        }
        .nav-spacer { flex: 1; }
        .nav-footer { padding: 8px; opacity: 0.6; }

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
          width: 300px;
          display: flex;
          flex-direction: column;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(16px);
          border-right: 1px solid var(--border-subtle);
          overflow: hidden;
          flex-shrink: 0;
        }
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
          max-height: 50%;
          min-height: 200px;
        }
        .sidebar-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sidebar-tab {
          flex: 1;
          padding: 7px;
          font-size: 0.75rem;
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
        }
      `}</style>
    </div>
  );
}
