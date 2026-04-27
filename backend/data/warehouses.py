"""
ChainGuard 3.0 — Warehouse Data
5 global warehouses with stock levels, capacity, and risk exposure.
"""

WAREHOUSES = [
    {
        "id": "WH-001",
        "name": "Rotterdam Distribution Hub",
        "location": {"name": "Rotterdam, Netherlands", "lat": 51.9225, "lng": 4.4792},
        "capacity_tons": 50000,
        "current_stock_tons": 32000,
        "utilization_pct": 64,
        "days_of_stock": 12,
        "risk_exposure": ["Storm surge", "Port congestion"],
        "status": "normal",
    },
    {
        "id": "WH-002",
        "name": "Los Angeles Mega Warehouse",
        "location": {"name": "Los Angeles, USA", "lat": 33.7490, "lng": -118.2617},
        "capacity_tons": 75000,
        "current_stock_tons": 58000,
        "utilization_pct": 77,
        "days_of_stock": 18,
        "risk_exposure": ["Earthquake", "Wildfire smoke"],
        "status": "normal",
    },
    {
        "id": "WH-003",
        "name": "Mumbai Central Depot",
        "location": {"name": "Mumbai, India", "lat": 19.0760, "lng": 72.8777},
        "capacity_tons": 35000,
        "current_stock_tons": 29000,
        "utilization_pct": 83,
        "days_of_stock": 6,
        "risk_exposure": ["Monsoon flooding", "Port congestion"],
        "status": "warning",
    },
    {
        "id": "WH-004",
        "name": "London Gateway Facility",
        "location": {"name": "London, UK", "lat": 51.5074, "lng": -0.1278},
        "capacity_tons": 40000,
        "current_stock_tons": 22000,
        "utilization_pct": 55,
        "days_of_stock": 21,
        "risk_exposure": ["Brexit logistics friction"],
        "status": "normal",
    },
    {
        "id": "WH-005",
        "name": "Bangalore Tech Hub Warehouse",
        "location": {"name": "Bangalore, India", "lat": 12.9716, "lng": 77.5946},
        "capacity_tons": 20000,
        "current_stock_tons": 17500,
        "utilization_pct": 88,
        "days_of_stock": 4,
        "risk_exposure": ["Heat wave", "Near capacity"],
        "status": "warning",
    },
]


def get_all_warehouses():
    return WAREHOUSES


def get_warehouse_by_id(warehouse_id: str):
    for w in WAREHOUSES:
        if w["id"] == warehouse_id:
            return w
    return None
