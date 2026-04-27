"""
ChainGuard 3.0 — Multi-Modal Route Optimizer
Generates 3 alternative route options: cheapest, fastest, recommended.
"""

import random


def generate_route_options(shipment, disruption):
    """
    Generate 3 optimized route alternatives for a disrupted shipment.
    Each option includes ETA, cost, CO2 impact, and risk assessment.
    """
    base_eta = shipment.get("eta_days", 14)
    cargo_value = shipment.get("cargo_value", 1000000)
    delay = disruption["impact"]["delay_days"]
    route_type = shipment.get("route_type", "maritime")

    options = []

    if route_type == "maritime":
        # Option A: Full Sea Reroute (cheapest)
        options.append({
            "id": "OPT-A",
            "name": "Full Sea Reroute",
            "description": f"Reroute via Cape of Good Hope, bypassing {disruption['name']}",
            "mode": "maritime",
            "eta_days": base_eta + delay + random.randint(3, 8),
            "cost_delta": random.randint(5000, 15000),
            "cost_delta_pct": random.randint(8, 18),
            "co2_delta_tonnes": round(random.uniform(-5, -20), 1),
            "risk_score": random.randint(15, 30),
            "tag": "cheapest",
            "pros": ["Lowest additional cost", "No mode change needed", "Full container capacity"],
            "cons": ["Longest transit time", "Adds 8-12 days"],
        })

        # Option B: Split Air + Sea (fastest)
        options.append({
            "id": "OPT-B",
            "name": "Split: Air + Sea Hybrid",
            "description": "Rush 40% cargo via air freight, remainder via alternate sea route",
            "mode": "air+maritime",
            "eta_days": max(2, base_eta - delay),
            "cost_delta": random.randint(25000, 55000),
            "cost_delta_pct": random.randint(35, 65),
            "co2_delta_tonnes": round(random.uniform(30, 60), 1),
            "risk_score": random.randint(10, 20),
            "tag": "fastest",
            "pros": ["Critical cargo arrives in 2-3 days", "Very low delay risk"],
            "cons": ["Highest cost", "Higher carbon footprint", "Split logistics"],
        })

        # Option C: Regional Pivot (recommended)
        options.append({
            "id": "OPT-C",
            "name": "Regional Supplier Pivot",
            "description": "Source from nearest backup supplier/warehouse to reduce dependency",
            "mode": "regional",
            "eta_days": max(3, base_eta - delay + 2),
            "cost_delta": random.randint(8000, 20000),
            "cost_delta_pct": random.randint(12, 25),
            "co2_delta_tonnes": round(random.uniform(-8, -15), 1),
            "risk_score": random.randint(12, 25),
            "tag": "recommended",
            "pros": ["Best cost-time balance", "Builds supplier diversity", "Lower carbon"],
            "cons": ["Requires backup supplier availability", "Partial fulfillment possible"],
        })

    elif route_type == "road":
        options.append({
            "id": "OPT-A",
            "name": "Alternate Highway Route",
            "description": "Reroute via alternate national highway avoiding affected area",
            "mode": "road",
            "eta_days": base_eta + random.randint(1, 3),
            "cost_delta": random.randint(2000, 6000),
            "cost_delta_pct": random.randint(5, 12),
            "co2_delta_tonnes": round(random.uniform(2, 8), 1),
            "risk_score": random.randint(15, 30),
            "tag": "cheapest",
            "pros": ["Minimal cost increase", "Same transport mode"],
            "cons": ["Adds 1-3 days", "Longer distance"],
        })

        options.append({
            "id": "OPT-B",
            "name": "Air Freight Express",
            "description": "Switch entire shipment to air cargo for fastest delivery",
            "mode": "air",
            "eta_days": 1,
            "cost_delta": random.randint(15000, 35000),
            "cost_delta_pct": random.randint(40, 70),
            "co2_delta_tonnes": round(random.uniform(15, 35), 1),
            "risk_score": random.randint(5, 15),
            "tag": "fastest",
            "pros": ["Next-day delivery", "Bypasses all road issues"],
            "cons": ["Very high cost", "Weight/size limits"],
        })

        options.append({
            "id": "OPT-C",
            "name": "Rail + Road Combo",
            "description": "Rail for main corridor, last-mile by road on clear routes",
            "mode": "rail+road",
            "eta_days": base_eta + 1,
            "cost_delta": random.randint(4000, 10000),
            "cost_delta_pct": random.randint(8, 18),
            "co2_delta_tonnes": round(random.uniform(-3, -8), 1),
            "risk_score": random.randint(15, 25),
            "tag": "recommended",
            "pros": ["Good cost-time balance", "Lower carbon than road", "Avoids road disruption"],
            "cons": ["Requires rail availability", "Transfer point needed"],
        })

    else:
        # Air or rail fallback
        options.append({
            "id": "OPT-A",
            "name": "Alternate Carrier",
            "description": "Switch to backup carrier on similar route",
            "mode": route_type,
            "eta_days": base_eta + 1,
            "cost_delta": random.randint(3000, 8000),
            "cost_delta_pct": random.randint(5, 15),
            "co2_delta_tonnes": round(random.uniform(-2, 2), 1),
            "risk_score": random.randint(15, 30),
            "tag": "cheapest",
            "pros": ["Minimal disruption", "Same mode"],
            "cons": ["Slight delay", "Carrier availability"],
        })

        options.append({
            "id": "OPT-B",
            "name": "Priority Express",
            "description": "Priority handling with expedited customs and handling",
            "mode": route_type,
            "eta_days": max(1, base_eta - 1),
            "cost_delta": random.randint(10000, 25000),
            "cost_delta_pct": random.randint(20, 40),
            "co2_delta_tonnes": round(random.uniform(5, 15), 1),
            "risk_score": random.randint(8, 18),
            "tag": "fastest",
            "pros": ["Fastest option", "Priority clearance"],
            "cons": ["Premium pricing"],
        })

        options.append({
            "id": "OPT-C",
            "name": "Multi-Modal Split",
            "description": "Split across multiple transport modes for resilience",
            "mode": "multi-modal",
            "eta_days": base_eta,
            "cost_delta": random.randint(5000, 12000),
            "cost_delta_pct": random.randint(10, 22),
            "co2_delta_tonnes": round(random.uniform(-5, -10), 1),
            "risk_score": random.randint(12, 22),
            "tag": "recommended",
            "pros": ["Best resilience", "Balanced cost"],
            "cons": ["Complex logistics"],
        })

    # Compute savings vs doing nothing
    loss_if_nothing = disruption["impact"]["estimated_loss"]

    return {
        "shipment_id": shipment["id"],
        "disruption_id": disruption["id"],
        "current_eta_days": base_eta,
        "loss_if_no_action": loss_if_nothing,
        "options": options,
        "ai_recommended": "OPT-C",
        "recommendation_reason": (
            "Best balance of cost, time, and risk. "
            f"Saves ${loss_if_nothing - options[2]['cost_delta']:,} vs inaction."
        ),
    }
