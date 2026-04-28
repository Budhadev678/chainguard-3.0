/**
 * ChainGuard 3.0 — API Client
 * Centralized API communication with the FastAPI backend.
 * Falls back to rich mock data automatically when the backend is unreachable.
 */
import {
  MOCK_SHIPMENTS, MOCK_DISRUPTIONS, MOCK_ACTIVE_DISRUPTIONS,
  MOCK_WAREHOUSES, MOCK_SUPPLIERS, MOCK_STATS,
} from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

// Track simulated state locally when backend is offline
let _simulatedDisruptions = new Set();
let _approvedDecisions = new Set();

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

// ── Shipments ──────────────────────────────────────────────────────────────
export async function fetchShipments() {
  try { return await request('/shipments'); }
  catch { return MOCK_SHIPMENTS; }
}
export async function fetchShipment(id) {
  try { return await request(`/shipments/${id}`); }
  catch { return MOCK_SHIPMENTS.shipments.find(s => s.id === id) || null; }
}

// ── Suppliers & Warehouses ─────────────────────────────────────────────────
export async function fetchSuppliers() {
  try { return await request('/suppliers'); }
  catch { return MOCK_SUPPLIERS; }
}
export async function fetchWarehouses() {
  try { return await request('/warehouses'); }
  catch { return MOCK_WAREHOUSES; }
}

// ── Disruptions ────────────────────────────────────────────────────────────
export async function fetchDisruptions() {
  try { return await request('/disruptions'); }
  catch { return MOCK_DISRUPTIONS; }
}
export async function fetchActiveDisruptions() {
  try { return await request('/active-disruptions'); }
  catch {
    // Return whichever disruptions have been locally simulated
    const active = MOCK_DISRUPTIONS.disruptions.filter(d => _simulatedDisruptions.has(d.id));
    return { active };
  }
}
export async function simulateDisruption(id) {
  try { return await request('/simulate-disruption', { method: 'POST', body: JSON.stringify({ disruption_id: id }) }); }
  catch {
    _simulatedDisruptions.add(id);
    return { success: true, mock: true };
  }
}
export async function clearDisruptions() {
  try { return await request('/clear-disruptions', { method: 'POST' }); }
  catch {
    _simulatedDisruptions.clear();
    return { success: true, mock: true };
  }
}

// ── Risk & Analytics ───────────────────────────────────────────────────────
export async function fetchRiskScore(shipmentId) {
  try { return await request(`/risk-score/${shipmentId}`); }
  catch {
    const s = MOCK_SHIPMENTS.shipments.find(s => s.id === shipmentId);
    return { risk_score: s?.risk_score ?? 50, risk_level: s?.risk_level ?? 'warning', signals: s?.risk_signals ?? {} };
  }
}
export async function fetchCascade(shipmentId, disruptionId) {
  try { return await request(`/cascade/${shipmentId}/${disruptionId}`); }
  catch {
    return {
      cascade: [
        { id: 'CAS-1', name: 'Samsung Korea Factory', type: 'supplier', delay_days: 3, loss: 1200000, severity: 'warning' },
        { id: 'CAS-2', name: 'Rotterdam DC', type: 'warehouse', delay_days: 5, loss: 800000, severity: 'critical' },
        { id: 'CAS-3', name: 'EU Assembly Line', type: 'factory', delay_days: 8, loss: 2600000, severity: 'critical' },
      ]
    };
  }
}
export async function fetchRouteOptions(shipmentId, disruptionId) {
  try { return await request(`/route-options/${shipmentId}/${disruptionId}`); }
  catch {
    return {
      options: [
        {
          id: 'OPT-1', label: 'Cape of Good Hope Reroute', type: 'reroute',
          cost_delta: 280000, delay_days: 8, co2_delta_tonnes: 120,
          confidence: 91, description: 'Reroute via Cape bypassing Suez entirely. Adds 8 days but eliminates geopolitical risk.',
          recommended: true,
        },
        {
          id: 'OPT-2', label: 'Split Shipment (40% Air)', type: 'split',
          cost_delta: 850000, delay_days: 2, co2_delta_tonnes: 340,
          confidence: 76, description: 'Air-freight 40% of high-value cargo immediately. Sea-route remainder via Cape.',
          recommended: false,
        },
        {
          id: 'OPT-3', label: 'Wait & Monitor (48h hold)', type: 'delay',
          cost_delta: 120000, delay_days: 2, co2_delta_tonnes: 0,
          confidence: 52, description: 'Hold at Port Said for 48h awaiting canal reopening. High uncertainty.',
          recommended: false,
        },
      ]
    };
  }
}

// ── AI ─────────────────────────────────────────────────────────────────────
export async function fetchAIDecision(shipmentId, disruptionId) {
  try { return await request(`/ai-decision/${shipmentId}/${disruptionId}`, { method: 'POST' }); }
  catch {
    return {
      success: true,
      source: 'mock',
      response: `## AI Risk Analysis — ${shipmentId}\n\n**Situation:** The ${disruptionId === 'DIS-001' ? 'Suez Canal closure' : 'active disruption'} poses a **Critical** risk to this shipment with an estimated $4.2M loss exposure if no action is taken.\n\n**Recommendation:** Reroute via Cape of Good Hope immediately.\n\n### Key Factors\n- **Time sensitivity**: Rerouting within 24h saves $2.8M vs waiting\n- **Risk reduction**: Cape route reduces risk score from 82 → 31\n- **Trade-off**: +8 days ETA, +$280K fuel cost — still net positive vs. inaction\n\n### Alternative Options\n1. **Split shipment** — air-freight critical 40% now (2d delay, higher cost)\n2. **Hold position** — wait 48h for canal update (uncertain, not recommended)\n\n**Confidence: 91%** | Powered by Gemini`,
    };
  }
}
export async function runWhatIf(query) {
  try { return await request('/what-if', { method: 'POST', body: JSON.stringify({ query }) }); }
  catch {
    const q = query.toLowerCase();
    let answer = '';
    if (q.includes('suez') || q.includes('canal')) {
      answer = `## What-If: Suez Canal Closure

**Impact on your fleet:**
- **3 shipments directly affected** (SHP-001, SHP-005, SHP-008)
- **Total loss at risk:** $21.4M
- **Average rerouting cost:** +$280K per vessel via Cape

**Recommended Actions:**
1. Immediately reroute SHP-001 (Semiconductors) — highest value, highest urgency
2. SHP-005 (Petrochemical) — reroute but negotiate demurrage insurance
3. SHP-008 (Pharma) — air-freight alternative for temperature-sensitive cargo

**System Impact:** Rotterdam DC stock drops to 9 days (from 18) — trigger emergency resupply within 5 days.`;
    } else if (q.includes('supplier') || q.includes('bankrupt')) {
      answer = `## What-If: Primary Supplier Failure

**Scenario: TSMC production shutdown (30 days)**

- **Revenue at risk:** $18.4M (SHP-001 semiconductor run)
- **Tier-2 activation time:** 14–21 days (Samsung SDI can cover 60%)
- **Gap period:** 7–10 days of reduced supply to EU assembly lines

**Mitigation:**
1. Pre-position inventory at Rotterdam DC (+$800K cost, covers 12 days)
2. Activate Samsung SDI as Tier-1 backup immediately
3. Notify downstream EU customers of 2-week delay`;
    } else if (q.includes('weather') || q.includes('storm') || q.includes('typhoon')) {
      answer = `## What-If: Category 4 Typhoon (Pacific)

**Affected routes:** Trans-Pacific (US/Asia) — SHP-003, SHP-004

**Impact:**
- SHP-003 (Auto Parts): +5 days delay, $2.1M loss exposure
- SHP-004 (Electronics): Air routing unaffected — no impact

**Actions:**
1. Reroute SHP-003 south of typhoon track (+3 days vs. +5 days direct hit)
2. Pre-alert LA port for delayed arrival
3. Activate inventory buffer at LA Fulfillment Center`;
    } else {
      answer = `## What-If Analysis

Based on your query: *"${query}"*

**Current Fleet Status:**
- 8 active shipments tracked globally
- 2 critical risk shipments (SHP-001, SHP-008)
- 1 critical supplier (Rio Tinto — rare earth metals)

**Recommended Monitoring Priority:**
1. SHP-001 (APAC-EU Semiconductors) — highest value + active disruption
2. SHP-008 (European Pharma) — time-sensitive cargo
3. SHP-005 (Gulf Petrochemical) — highest geopolitical exposure

Run a specific scenario for detailed cascade modeling.`;
    }
    return { success: true, response: answer, source: 'mock' };
  }
}
export async function chatWithAI(message) {
  try { return await request('/chat', { method: 'POST', body: JSON.stringify({ message }) }); }
  catch {
    const m = message.toLowerCase();
    let reply = '';
    if (m.includes('risk') || m.includes('danger')) {
      reply = '🔴 **2 Critical shipments** right now: SHP-001 (Suez/Semiconductor, risk score 82) and SHP-008 (Pharma/Airspace, 88). SHP-003 is at Warning (61). Recommend reviewing Decision Center for queued approvals.';
    } else if (m.includes('money') || m.includes('saved') || m.includes('loss')) {
      reply = '💰 This month ChainGuard has helped **avoid $4.2M in losses** through the SHP-003 rerouting decision. Current at-risk exposure is **$21.4M** tied to the Suez closure (pending your Decision Center approval).';
    } else if (m.includes('weather') || m.includes('storm')) {
      reply = '🌀 **Active weather alert**: Cyclone Mocha in the Bay of Bengal affecting SHP-003 (Mumbai Auto Parts). Wind speeds 150 km/h. Recommend immediate south deviation — adds 1 day but avoids the storm center.';
    } else if (m.includes('summary') || m.includes('status')) {
      reply = '📊 **Fleet Status Summary:**\n- 8 shipments active globally\n- 2 Critical 🔴 (SHP-001, SHP-008)\n- 2 Warning 🟡 (SHP-003, SHP-006)\n- 4 Safe 🟢\n- $4.2M losses avoided this month\n- 3 decisions pending your approval';
    } else if (m.includes('supplier')) {
      reply = '🏭 **Supplier Alert**: Rio Tinto (Tier-3 Raw Materials) is at **Critical health (38/100)** due to an ongoing mine strike and export restrictions. This affects 2 downstream shipments. Recommend activating backup supplier Vale Iron Ore for next quarter orders.';
    } else {
      reply = `I understand your question about "${message}". Based on real-time data: all 8 shipments are being monitored. SHP-001 and SHP-008 need your immediate attention in the Decision Center. Would you like me to analyze a specific shipment, disruption, or run a What-If scenario?`;
    }
    return { success: true, response: reply, source: 'mock' };
  }
}

// ── Decisions ──────────────────────────────────────────────────────────────
export async function approveDecision(shipmentId, disruptionId, optionId, action) {
  try { return await request('/approve-decision', { method: 'POST', body: JSON.stringify({ shipment_id: shipmentId, disruption_id: disruptionId, option_id: optionId, action }) }); }
  catch {
    _approvedDecisions.add(`${shipmentId}-${disruptionId}`);
    return { success: true, mock: true, message: `Decision recorded: ${action} for ${shipmentId}` };
  }
}

// ── Stats ──────────────────────────────────────────────────────────────────
export async function fetchStats() {
  try { return await request('/stats'); }
  catch { return MOCK_STATS; }
}
