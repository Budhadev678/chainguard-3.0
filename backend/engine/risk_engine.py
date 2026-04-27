"""
ChainGuard 3.0 — 7-Signal Risk Fusion Engine
Combines multiple data signals into a unified risk score per shipment.
"""

import random
import math


def calculate_weather_risk(shipment, disruptions_active):
    """Signal 1: Weather risk based on current location and weather threats."""
    base_risk = random.randint(5, 15)
    for d in disruptions_active:
        if d["type"] == "weather" and shipment["id"] in d.get("affected_shipment_ids", []):
            base_risk += d["signals"].get("weather_risk", 0)
    return min(base_risk, 50)


def calculate_route_risk(shipment, disruptions_active):
    """Signal 2: Route/traffic delay risk."""
    base_risk = random.randint(3, 10)
    if shipment["route_type"] == "road":
        base_risk += 5
    for d in disruptions_active:
        if shipment["id"] in d.get("affected_shipment_ids", []):
            base_risk += d["signals"].get("route_delay", 0)
            base_risk += d["signals"].get("road_closure", 0)
    return min(base_risk, 50)


def calculate_port_risk(shipment, disruptions_active):
    """Signal 3: Port congestion risk."""
    base_risk = random.randint(2, 8)
    if shipment["route_type"] == "maritime":
        base_risk += 3
    for d in disruptions_active:
        if shipment["id"] in d.get("affected_shipment_ids", []):
            base_risk += d["signals"].get("port_congestion", 0)
            base_risk += d["signals"].get("wait_time", 0)
    return min(base_risk, 50)


def calculate_news_risk(shipment, disruptions_active):
    """Signal 4: News/geopolitical risk from media monitoring."""
    base_risk = random.randint(1, 5)
    for d in disruptions_active:
        if shipment["id"] in d.get("affected_shipment_ids", []):
            base_risk += d["signals"].get("news_sentiment", 0)
            base_risk += d["signals"].get("geopolitical_risk", 0)
    return min(base_risk, 50)


def calculate_supplier_risk(shipment, suppliers, disruptions_active):
    """Signal 5: Supplier health risk."""
    base_risk = 5
    supplier_id = shipment.get("supplier_id")
    if supplier_id:
        for s in suppliers:
            if s["id"] == supplier_id:
                health = s.get("health_score", 80)
                base_risk += max(0, (100 - health) // 3)
                break
    for d in disruptions_active:
        if d["type"] == "supplier" and shipment["id"] in d.get("affected_shipment_ids", []):
            base_risk += d["signals"].get("supplier_health", 0)
            base_risk += d["signals"].get("production_halt", 0)
    return min(base_risk, 50)


def calculate_inventory_risk(shipment, warehouses, disruptions_active):
    """Signal 6: Downstream inventory/stock level risk."""
    base_risk = 3
    wh_id = shipment.get("warehouse_id")
    if wh_id:
        for w in warehouses:
            if w["id"] == wh_id:
                days = w.get("days_of_stock", 30)
                if days < 5:
                    base_risk += 20
                elif days < 10:
                    base_risk += 10
                elif days < 15:
                    base_risk += 5
                break
    for d in disruptions_active:
        if shipment["id"] in d.get("affected_shipment_ids", []):
            base_risk += d["signals"].get("inventory_risk", 0)
    return min(base_risk, 50)


def calculate_historical_risk(shipment):
    """Signal 7: Historical delay pattern on this route/lane."""
    route_delay_rates = {
        "maritime": random.randint(15, 35),
        "road": random.randint(20, 40),
        "air": random.randint(5, 15),
        "rail": random.randint(10, 25),
    }
    rate = route_delay_rates.get(shipment["route_type"], 20)
    return min(rate // 3, 20)


def compute_risk_score(shipment, suppliers, warehouses, disruptions_active):
    """
    Compute the fused 7-signal risk score for a shipment.
    Returns score (0-100) and individual signal breakdowns.
    """
    signals = {
        "weather": calculate_weather_risk(shipment, disruptions_active),
        "route_delay": calculate_route_risk(shipment, disruptions_active),
        "port_congestion": calculate_port_risk(shipment, disruptions_active),
        "news_geopolitical": calculate_news_risk(shipment, disruptions_active),
        "supplier_health": calculate_supplier_risk(shipment, suppliers, disruptions_active),
        "inventory_level": calculate_inventory_risk(shipment, warehouses, disruptions_active),
        "historical_pattern": calculate_historical_risk(shipment),
    }

    # Weighted fusion — weather and route get highest weight
    weights = {
        "weather": 1.2,
        "route_delay": 1.1,
        "port_congestion": 1.0,
        "news_geopolitical": 0.9,
        "supplier_health": 1.0,
        "inventory_level": 0.8,
        "historical_pattern": 0.5,
    }

    weighted_sum = sum(signals[k] * weights[k] for k in signals)
    max_possible = sum(50 * w for w in weights.values())
    normalized_score = int((weighted_sum / max_possible) * 100)
    final_score = min(max(normalized_score, 0), 100)

    # Determine risk level
    if final_score >= 71:
        level = "critical"
    elif final_score >= 41:
        level = "warning"
    else:
        level = "safe"

    return {
        "score": final_score,
        "level": level,
        "signals": signals,
        "weights": weights,
    }
