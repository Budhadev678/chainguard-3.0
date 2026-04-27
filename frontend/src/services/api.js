// ChainGuard 3.0 — API Service Layer
import axios from 'axios';
import { API_BASE } from '../config';

const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

export const fetchShipments = () => api.get('/shipments').then(r => r.data);
export const fetchShipment = (id) => api.get(`/shipments/${id}`).then(r => r.data);
export const fetchSuppliers = () => api.get('/suppliers').then(r => r.data);
export const fetchWarehouses = () => api.get('/warehouses').then(r => r.data);
export const fetchDisruptions = () => api.get('/disruptions').then(r => r.data);
export const fetchActiveDisruptions = () => api.get('/active-disruptions').then(r => r.data);
export const fetchStats = () => api.get('/stats').then(r => r.data);
export const fetchRiskScore = (id) => api.get(`/risk-score/${id}`).then(r => r.data);
export const fetchCascade = (shipId, disId) => api.get(`/cascade/${shipId}/${disId}`).then(r => r.data);
export const fetchRouteOptions = (shipId, disId) => api.get(`/route-options/${shipId}/${disId}`).then(r => r.data);

export const simulateDisruption = (disruption_id) =>
  api.post('/simulate-disruption', { disruption_id }).then(r => r.data);

export const clearDisruptions = () => api.post('/clear-disruptions').then(r => r.data);

export const getAiDecision = (shipId, disId) =>
  api.post(`/ai-decision/${shipId}/${disId}`).then(r => r.data);

export const runWhatIf = (query) =>
  api.post('/what-if', { query }).then(r => r.data);

export const chatWithAI = (message) =>
  api.post('/chat', { message }).then(r => r.data);

export const approveDecision = (shipment_id, disruption_id, option_id, action) =>
  api.post('/approve-decision', { shipment_id, disruption_id, option_id, action }).then(r => r.data);

export default api;
