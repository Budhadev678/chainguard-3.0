// ChainGuard 3.0 — Global Application State
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { fetchShipments, fetchStats, fetchActiveDisruptions, fetchSuppliers, fetchWarehouses } from '../services/api';

const AppContext = createContext(null);

const initialState = {
  shipments: [],
  suppliers: [],
  warehouses: [],
  activeDisruptions: [],
  stats: {},
  selectedShipment: null,
  selectedDisruption: null,
  activeView: 'command-center',
  loading: true,
  error: null,
  notifications: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SHIPMENTS':
      return { ...state, shipments: action.payload, loading: false };
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload };
    case 'SET_WAREHOUSES':
      return { ...state, warehouses: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_ACTIVE_DISRUPTIONS':
      return { ...state, activeDisruptions: action.payload };
    case 'SELECT_SHIPMENT':
      return { ...state, selectedShipment: action.payload };
    case 'SELECT_DISRUPTION':
      return { ...state, selectedDisruption: action.payload };
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 20) };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshData = useCallback(async () => {
    try {
      const [shipData, statsData, disruptData, supData, whData] = await Promise.all([
        fetchShipments(),
        fetchStats(),
        fetchActiveDisruptions(),
        fetchSuppliers(),
        fetchWarehouses(),
      ]);
      dispatch({ type: 'SET_SHIPMENTS', payload: shipData.shipments || [] });
      dispatch({ type: 'SET_STATS', payload: statsData });
      dispatch({ type: 'SET_ACTIVE_DISRUPTIONS', payload: disruptData.active || [] });
      dispatch({ type: 'SET_SUPPLIERS', payload: supData.suppliers || [] });
      dispatch({ type: 'SET_WAREHOUSES', payload: whData.warehouses || [] });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to connect to ChainGuard API' });
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <AppContext.Provider value={{ state, dispatch, refreshData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
