"""
ChainGuard 3.0 — Pre-built Disruption Scenarios
Real-world disruption events that can be injected into the simulation.
"""

DISRUPTIONS = [
    {
        "id": "DIS-001",
        "name": "Tropical Cyclone — Bay of Bengal",
        "type": "weather",
        "severity": "critical",
        "description": "Category 3 cyclone approaching Bay of Bengal. Expected landfall near Chennai coast in 48 hours. Wind speeds up to 180 km/h with heavy rainfall.",
        "affected_region": {"lat": 13.0, "lng": 80.0, "radius_km": 500},
        "affected_shipment_ids": ["SHP-006", "SHP-007", "SHP-002"],
        "affected_supplier_ids": ["SUP-003"],
        "affected_warehouse_ids": ["WH-003", "WH-005"],
        "impact": {
            "delay_days": 7,
            "cost_increase_pct": 35,
            "estimated_loss": 3400000,
        },
        "signals": {
            "weather_risk": 40,
            "port_congestion": 25,
            "road_closure": 20,
            "inventory_risk": 15,
        },
    },
    {
        "id": "DIS-002",
        "name": "Red Sea Shipping Threat",
        "type": "geopolitical",
        "severity": "critical",
        "description": "Escalating security threats in the Red Sea corridor. Multiple shipping lines rerouting via Cape of Good Hope, adding 10-14 days to transit.",
        "affected_region": {"lat": 15.0, "lng": 42.0, "radius_km": 800},
        "affected_shipment_ids": ["SHP-001", "SHP-004", "SHP-006", "SHP-008"],
        "affected_supplier_ids": [],
        "affected_warehouse_ids": ["WH-001", "WH-004"],
        "impact": {
            "delay_days": 14,
            "cost_increase_pct": 45,
            "estimated_loss": 8200000,
        },
        "signals": {
            "geopolitical_risk": 45,
            "route_delay": 30,
            "cost_spike": 20,
            "insurance_risk": 15,
        },
    },
    {
        "id": "DIS-003",
        "name": "Supplier Labor Strike — Taiwan",
        "type": "supplier",
        "severity": "high",
        "description": "Major semiconductor supplier ChipTech in Taiwan facing labor strike. Workers demanding wage increase. Production halted for estimated 2-3 weeks.",
        "affected_region": {"lat": 24.8, "lng": 120.9, "radius_km": 100},
        "affected_shipment_ids": ["SHP-010", "SHP-001"],
        "affected_supplier_ids": ["SUP-001", "SUP-005"],
        "affected_warehouse_ids": ["WH-004"],
        "impact": {
            "delay_days": 21,
            "cost_increase_pct": 60,
            "estimated_loss": 12000000,
        },
        "signals": {
            "supplier_health": 45,
            "news_sentiment": 25,
            "production_halt": 30,
        },
    },
    {
        "id": "DIS-004",
        "name": "Panama Canal Drought",
        "type": "infrastructure",
        "severity": "high",
        "description": "Severe drought reducing Panama Canal daily transits from 36 to 18 vessels. Wait times exceeding 10 days. Water levels at historic lows.",
        "affected_region": {"lat": 9.0, "lng": -79.5, "radius_km": 200},
        "affected_shipment_ids": ["SHP-003"],
        "affected_supplier_ids": [],
        "affected_warehouse_ids": ["WH-002"],
        "impact": {
            "delay_days": 10,
            "cost_increase_pct": 25,
            "estimated_loss": 1800000,
        },
        "signals": {
            "infrastructure_risk": 40,
            "wait_time": 30,
            "capacity_reduction": 25,
        },
    },
    {
        "id": "DIS-005",
        "name": "Singapore Port Congestion",
        "type": "infrastructure",
        "severity": "medium",
        "description": "Record container volumes at Singapore port. Average waiting time increased to 7 days. Vessel bunching causing cascading delays across Asia-Europe trade lanes.",
        "affected_region": {"lat": 1.3, "lng": 103.8, "radius_km": 300},
        "affected_shipment_ids": ["SHP-004", "SHP-010"],
        "affected_supplier_ids": [],
        "affected_warehouse_ids": [],
        "impact": {
            "delay_days": 7,
            "cost_increase_pct": 15,
            "estimated_loss": 950000,
        },
        "signals": {
            "port_congestion": 35,
            "vessel_bunching": 25,
            "schedule_reliability": 20,
        },
    },
]


def get_all_disruptions():
    return DISRUPTIONS


def get_disruption_by_id(disruption_id: str):
    for d in DISRUPTIONS:
        if d["id"] == disruption_id:
            return d
    return None
