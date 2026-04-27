"""
ChainGuard 3.0 — FastAPI Backend
AI-Powered Supply Chain Control Tower API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import copy

from data.shipments import get_all_shipments, get_shipment_by_id, SHIPMENTS
from data.suppliers import get_all_suppliers, get_supplier_by_id
from data.warehouses import get_all_warehouses, get_warehouse_by_id
from data.disruptions import get_all_disruptions, get_disruption_by_id
from engine.risk_engine import compute_risk_score
from engine.cascade_simulator import simulate_cascade
from engine.route_optimizer import generate_route_options
from services.gemini_service import generate_ai_decision, run_what_if_scenario, chat_with_ai

app = FastAPI(
    title="ChainGuard 3.0 API",
    description="AI-Powered Supply Chain Control Tower",
    version="3.0.0",
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory state for active disruptions and decisions
active_disruptions = []
decision_log = []
resolved_shipments = set()


# ─── Request Models ──────────────────────────────────────────

class DisruptionRequest(BaseModel):
    disruption_id: str

class WhatIfRequest(BaseModel):
    query: str

class ChatRequest(BaseModel):
    message: str

class DecisionRequest(BaseModel):
    shipment_id: str
    disruption_id: str
    option_id: str
    action: str  # "approve" or "reject"


# ─── Health Check ────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "version": "3.0.0",
        "service": "ChainGuard Control Tower",
    }


# ─── Shipments ───────────────────────────────────────────────

@app.get("/api/shipments")
def get_shipments():
    """Get all shipments with computed risk scores."""
    shipments = get_all_shipments()
    suppliers = get_all_suppliers()
    warehouses = get_all_warehouses()

    for s in shipments:
        risk = compute_risk_score(s, suppliers, warehouses, active_disruptions)
        s["risk_score"] = risk["score"]
        s["risk_level"] = risk["level"]
        s["risk_signals"] = risk["signals"]

        # Mark if resolved
        if s["id"] in resolved_shipments:
            s["risk_score"] = max(10, s["risk_score"] - 50)
            s["risk_level"] = "safe"
            s["status"] = "rerouted"

    return {"shipments": shipments, "total": len(shipments)}


@app.get("/api/shipments/{shipment_id}")
def get_shipment(shipment_id: str):
    """Get single shipment with full risk breakdown."""
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    suppliers = get_all_suppliers()
    warehouses = get_all_warehouses()
    risk = compute_risk_score(shipment, suppliers, warehouses, active_disruptions)
    shipment["risk_score"] = risk["score"]
    shipment["risk_level"] = risk["level"]
    shipment["risk_signals"] = risk["signals"]
    shipment["risk_weights"] = risk["weights"]

    if shipment["id"] in resolved_shipments:
        shipment["risk_score"] = max(10, shipment["risk_score"] - 50)
        shipment["risk_level"] = "safe"
        shipment["status"] = "rerouted"

    return shipment


# ─── Suppliers ───────────────────────────────────────────────

@app.get("/api/suppliers")
def get_suppliers():
    """Get all suppliers with health data."""
    return {"suppliers": get_all_suppliers()}


# ─── Warehouses ──────────────────────────────────────────────

@app.get("/api/warehouses")
def get_warehouses():
    """Get all warehouses with stock levels."""
    return {"warehouses": get_all_warehouses()}


# ─── Disruptions ─────────────────────────────────────────────

@app.get("/api/disruptions")
def get_disruptions():
    """Get all available disruption scenarios."""
    return {"disruptions": get_all_disruptions()}


@app.get("/api/active-disruptions")
def get_active_disruptions():
    """Get currently active disruptions."""
    return {"active": active_disruptions}


@app.post("/api/simulate-disruption")
def simulate_disruption(req: DisruptionRequest):
    """Inject a disruption into the simulation."""
    disruption = get_disruption_by_id(req.disruption_id)
    if not disruption:
        raise HTTPException(status_code=404, detail="Disruption not found")

    # Check if already active
    for d in active_disruptions:
        if d["id"] == req.disruption_id:
            return {"status": "already_active", "disruption": disruption}

    active_disruptions.append(disruption)
    return {"status": "activated", "disruption": disruption}


@app.post("/api/clear-disruptions")
def clear_disruptions():
    """Clear all active disruptions and reset state."""
    active_disruptions.clear()
    resolved_shipments.clear()
    decision_log.clear()
    return {"status": "cleared"}


# ─── Risk Score ──────────────────────────────────────────────

@app.get("/api/risk-score/{shipment_id}")
def get_risk_score(shipment_id: str):
    """Get detailed risk score breakdown for a shipment."""
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    suppliers = get_all_suppliers()
    warehouses = get_all_warehouses()
    risk = compute_risk_score(shipment, suppliers, warehouses, active_disruptions)
    return {
        "shipment_id": shipment_id,
        "shipment_name": shipment["name"],
        **risk,
    }


# ─── Cascade Simulation ─────────────────────────────────────

@app.get("/api/cascade/{shipment_id}/{disruption_id}")
def get_cascade(shipment_id: str, disruption_id: str):
    """Get cascade simulation for a shipment-disruption pair."""
    shipment = get_shipment_by_id(shipment_id)
    disruption = get_disruption_by_id(disruption_id)
    warehouses = get_all_warehouses()

    if not shipment or not disruption:
        raise HTTPException(status_code=404, detail="Shipment or disruption not found")

    cascade = simulate_cascade(shipment, disruption, warehouses)
    return cascade


# ─── Route Options ───────────────────────────────────────────

@app.get("/api/route-options/{shipment_id}/{disruption_id}")
def get_route_options(shipment_id: str, disruption_id: str):
    """Get optimized route alternatives for a disrupted shipment."""
    shipment = get_shipment_by_id(shipment_id)
    disruption = get_disruption_by_id(disruption_id)

    if not shipment or not disruption:
        raise HTTPException(status_code=404, detail="Shipment or disruption not found")

    options = generate_route_options(shipment, disruption)
    return options


# ─── AI Decision Engine ─────────────────────────────────────

@app.post("/api/ai-decision/{shipment_id}/{disruption_id}")
async def ai_decision(shipment_id: str, disruption_id: str):
    """Get AI-powered decision recommendation from Gemini."""
    shipment = get_shipment_by_id(shipment_id)
    disruption = get_disruption_by_id(disruption_id)

    if not shipment or not disruption:
        raise HTTPException(status_code=404, detail="Shipment or disruption not found")

    suppliers = get_all_suppliers()
    warehouses = get_all_warehouses()
    risk = compute_risk_score(shipment, suppliers, warehouses, active_disruptions)

    result = await generate_ai_decision(shipment, risk, disruption)
    return result


# ─── What-If Scenarios ──────────────────────────────────────

@app.post("/api/what-if")
async def what_if(req: WhatIfRequest):
    """Run a what-if scenario analysis."""
    state = {
        "shipments": get_all_shipments(),
        "suppliers": get_all_suppliers(),
        "warehouses": get_all_warehouses(),
    }
    result = await run_what_if_scenario(req.query, state)
    return result


# ─── Chat ────────────────────────────────────────────────────

@app.post("/api/chat")
async def chat(req: ChatRequest):
    """Natural language chat with ChainGuard AI."""
    # Build context from current state
    shipments = get_all_shipments()
    suppliers = get_all_suppliers()
    warehouses = get_all_warehouses()

    critical = sum(1 for d in active_disruptions if d["severity"] == "critical")
    warnings = sum(1 for d in active_disruptions if d["severity"] in ("high", "medium"))

    context = {
        "total_shipments": len(shipments),
        "critical_count": critical,
        "warning_count": warnings,
        "recent_decisions": len(decision_log),
        "losses_prevented": sum(d.get("loss_avoided", 0) for d in decision_log),
    }

    result = await chat_with_ai(req.message, context)
    return result


# ─── Decision Actions ───────────────────────────────────────

@app.post("/api/approve-decision")
def approve_decision(req: DecisionRequest):
    """Approve or reject a decision card."""
    shipment = get_shipment_by_id(req.shipment_id)
    disruption = get_disruption_by_id(req.disruption_id)

    if not shipment or not disruption:
        raise HTTPException(status_code=404, detail="Not found")

    loss_avoided = disruption["impact"]["estimated_loss"]

    if req.action == "approve":
        resolved_shipments.add(req.shipment_id)
        log_entry = {
            "shipment_id": req.shipment_id,
            "disruption_id": req.disruption_id,
            "option_id": req.option_id,
            "action": "approved",
            "loss_avoided": loss_avoided,
        }
        decision_log.append(log_entry)
        return {
            "status": "approved",
            "message": f"Decision approved for {shipment['name']}. Route updated.",
            "loss_avoided": loss_avoided,
        }
    else:
        log_entry = {
            "shipment_id": req.shipment_id,
            "disruption_id": req.disruption_id,
            "option_id": req.option_id,
            "action": "rejected",
            "loss_avoided": 0,
        }
        decision_log.append(log_entry)
        return {
            "status": "rejected",
            "message": f"Decision rejected for {shipment['name']}.",
        }


# ─── Dashboard Stats ────────────────────────────────────────

@app.get("/api/stats")
def get_stats():
    """Get aggregated dashboard statistics."""
    shipments = get_all_shipments()
    suppliers = get_all_suppliers()
    warehouses = get_all_warehouses()

    total_cargo_value = sum(s.get("cargo_value", 0) for s in shipments)
    critical_suppliers = sum(1 for s in suppliers if s.get("status") == "critical")
    warning_warehouses = sum(1 for w in warehouses if w.get("status") == "warning")

    total_loss_avoided = sum(d.get("loss_avoided", 0) for d in decision_log)
    decisions_made = len(decision_log)

    return {
        "total_shipments": len(shipments),
        "active_disruptions": len(active_disruptions),
        "critical_suppliers": critical_suppliers,
        "warning_warehouses": warning_warehouses,
        "total_cargo_value": total_cargo_value,
        "decisions_made": decisions_made,
        "total_loss_avoided": total_loss_avoided,
        "resolved_shipments": len(resolved_shipments),
        "carbon_saved_tonnes": round(decisions_made * 12.3, 1),
    }
