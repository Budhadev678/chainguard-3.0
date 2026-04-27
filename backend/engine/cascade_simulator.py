"""
ChainGuard 3.0 — Cascade Ripple Simulator
Simulates downstream cascade effects of a disruption over 14 days.
"""


def simulate_cascade(shipment, disruption, warehouses):
    """
    Generate a cascade timeline showing what happens if no action is taken.
    Returns both "do nothing" and "act now" timelines.
    """
    delay_days = disruption["impact"]["delay_days"]
    estimated_loss = disruption["impact"]["estimated_loss"]
    cargo_value = shipment.get("cargo_value", 1000000)

    # Find linked warehouse
    wh_id = shipment.get("warehouse_id")
    warehouse = None
    for w in warehouses:
        if w["id"] == wh_id:
            warehouse = w
            break

    wh_name = warehouse["name"] if warehouse else "Linked Warehouse"
    wh_stock_days = warehouse["days_of_stock"] if warehouse else 15

    # Build "Do Nothing" cascade timeline
    do_nothing_timeline = []

    # Day 0
    do_nothing_timeline.append({
        "day": 0,
        "event": f"Disruption detected: {disruption['name']}",
        "severity": "critical",
        "financial_impact": 0,
        "status": "alert",
    })

    # Day 1-2
    do_nothing_timeline.append({
        "day": 2,
        "event": f"Shipment {shipment['name']} delayed by {delay_days} days",
        "severity": "high",
        "financial_impact": int(cargo_value * 0.02),
        "status": "delay",
    })

    # Day 3-4
    do_nothing_timeline.append({
        "day": max(3, wh_stock_days - 2),
        "event": f"{wh_name} drops below safety stock level",
        "severity": "high",
        "financial_impact": int(cargo_value * 0.08),
        "status": "shortage",
    })

    # Day 5-7
    do_nothing_timeline.append({
        "day": 7,
        "event": "2 downstream factories pause production lines",
        "severity": "critical",
        "financial_impact": int(cargo_value * 0.25),
        "status": "production_halt",
    })

    # Day 10
    do_nothing_timeline.append({
        "day": 10,
        "event": "12 retail outlets face complete stockout",
        "severity": "critical",
        "financial_impact": int(cargo_value * 0.55),
        "status": "stockout",
    })

    # Day 14
    do_nothing_timeline.append({
        "day": 14,
        "event": f"Total cascading loss: customer churn + penalties",
        "severity": "critical",
        "financial_impact": estimated_loss,
        "status": "total_loss",
    })

    # Build "Act Now" timeline
    reroute_cost = int(estimated_loss * 0.04)
    act_now_timeline = [
        {
            "day": 0,
            "event": f"Disruption detected: {disruption['name']}",
            "severity": "info",
            "financial_impact": 0,
            "status": "alert",
        },
        {
            "day": 0,
            "event": f"Reroute approved (cost: ${reroute_cost:,})",
            "severity": "resolved",
            "financial_impact": reroute_cost,
            "status": "action_taken",
        },
        {
            "day": 2,
            "event": "All downstream nodes stable — no cascade",
            "severity": "safe",
            "financial_impact": reroute_cost,
            "status": "stable",
        },
        {
            "day": 14,
            "event": f"Zero cascades. ${estimated_loss - reroute_cost:,} SAVED",
            "severity": "safe",
            "financial_impact": reroute_cost,
            "status": "resolved",
        },
    ]

    return {
        "shipment_id": shipment["id"],
        "disruption_id": disruption["id"],
        "do_nothing": {
            "timeline": do_nothing_timeline,
            "total_loss": estimated_loss,
            "affected_warehouses": 3,
            "affected_factories": 2,
            "affected_retailers": 12,
            "orders_failed": 847,
        },
        "act_now": {
            "timeline": act_now_timeline,
            "total_cost": reroute_cost,
            "loss_avoided": estimated_loss - reroute_cost,
            "cascades_prevented": "100%",
        },
        "recommendation": "ACT NOW",
        "net_benefit": estimated_loss - reroute_cost,
    }
