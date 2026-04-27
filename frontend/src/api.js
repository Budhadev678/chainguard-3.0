/**
 * ChainGuard 3.0 — API Client
 * Centralized API communication with the FastAPI backend.
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'API Error');
  }
  return res.json();
}

// ── Shipments
export const fetchShipments = () => request('/shipments');
export const fetchShipment = (id) => request(`/shipments/${id}`);

// ── Suppliers & Warehouses
export const fetchSuppliers = () => request('/suppliers');
export const fetchWarehouses = () => request('/warehouses');

// ── Disruptions
export const fetchDisruptions = () => request('/disruptions');
export const fetchActiveDisruptions = () => request('/active-disruptions');
export const simulateDisruption = (id) =>
  request('/simulate-disruption', {
    method: 'POST',
    body: JSON.stringify({ disruption_id: id }),
  });
export const clearDisruptions = () =>
  request('/clear-disruptions', { method: 'POST' });

// ── Risk & Analytics
export const fetchRiskScore = (shipmentId) => request(`/risk-score/${shipmentId}`);
export const fetchCascade = (shipmentId, disruptionId) =>
  request(`/cascade/${shipmentId}/${disruptionId}`);
export const fetchRouteOptions = (shipmentId, disruptionId) =>
  request(`/route-options/${shipmentId}/${disruptionId}`);

// ── AI
export const fetchAIDecision = (shipmentId, disruptionId) =>
  request(`/ai-decision/${shipmentId}/${disruptionId}`, { method: 'POST' });
export const runWhatIf = (query) =>
  request('/what-if', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
export const chatWithAI = (message) =>
  request('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

// ── Decisions
export const approveDecision = (shipmentId, disruptionId, optionId, action) =>
  request('/approve-decision', {
    method: 'POST',
    body: JSON.stringify({
      shipment_id: shipmentId,
      disruption_id: disruptionId,
      option_id: optionId,
      action,
    }),
  });

// ── Stats
export const fetchStats = () => request('/stats');
