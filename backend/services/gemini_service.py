"""
ChainGuard 3.0 — Gemini AI Service
Integrates Google Gemini for decision generation, what-if scenarios, and natural language chat.
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Try to import google.generativeai
try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    HAS_GEMINI = bool(GEMINI_API_KEY)
except ImportError:
    HAS_GEMINI = False
    genai = None


SYSTEM_PROMPT = """You are ChainGuard AI — an expert supply chain intelligence assistant.
You analyze supply chain data including shipments, risk scores, supplier health, warehouse levels,
and disruption events. You provide actionable recommendations to logistics managers.

Always respond in structured, clear format with:
- Key findings
- Recommended actions (numbered)
- Financial impact estimates
- Risk assessment

Be concise, data-driven, and action-oriented. Use bullet points."""


async def generate_ai_decision(shipment_data: dict, risk_data: dict, disruption_data: dict) -> dict:
    """Generate AI-powered route decision using Gemini."""
    prompt = f"""Analyze this supply chain disruption and recommend the best course of action:

SHIPMENT:
- Name: {shipment_data.get('name')}
- Cargo: {shipment_data.get('cargo')} (Value: ${shipment_data.get('cargo_value', 0):,})
- Route: {shipment_data.get('origin', {}).get('name')} → {shipment_data.get('destination', {}).get('name')}
- Current ETA: {shipment_data.get('eta_days')} days
- Type: {shipment_data.get('route_type')}

RISK SCORE: {risk_data.get('score', 0)}/100 ({risk_data.get('level', 'unknown')})
Risk Signals: {json.dumps(risk_data.get('signals', {}), indent=2)}

DISRUPTION: {disruption_data.get('name')}
- Type: {disruption_data.get('type')}
- Severity: {disruption_data.get('severity')}
- Description: {disruption_data.get('description')}
- Expected delay: {disruption_data.get('impact', {}).get('delay_days')} days
- Estimated loss if no action: ${disruption_data.get('impact', {}).get('estimated_loss', 0):,}

Provide:
1. Immediate action recommendation
2. Three route alternatives (cheapest, fastest, recommended)
3. Financial impact analysis
4. Risk mitigation steps"""

    if HAS_GEMINI and genai:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                f"{SYSTEM_PROMPT}\n\n{prompt}",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=1024,
                    temperature=0.7,
                ),
            )
            return {"success": True, "response": response.text, "source": "gemini"}
        except Exception as e:
            return {"success": False, "response": f"Gemini API error: {str(e)}", "source": "error"}
    else:
        return _mock_decision_response(shipment_data, disruption_data)


async def run_what_if_scenario(query: str, supply_chain_state: dict) -> dict:
    """Run a what-if scenario analysis using Gemini."""
    shipments = supply_chain_state.get("shipments", [])
    suppliers = supply_chain_state.get("suppliers", [])
    warehouses = supply_chain_state.get("warehouses", [])

    prompt = f"""A logistics manager asks: "{query}"

Current supply chain state:
- Active shipments: {len(shipments)}
- Shipment routes: {', '.join(f"{s['name']}: {s['origin']['name']}→{s['destination']['name']}" for s in shipments[:5])}
- Suppliers monitored: {len(suppliers)}
- Warehouses: {len(warehouses)}
- Critical suppliers: {', '.join(s['name'] for s in suppliers if s.get('status') == 'critical')}

Analyze this scenario and provide:
1. Which shipments would be affected and why
2. Expected delays and financial impact
3. Recommended preventive actions (numbered)
4. Estimated cost of prevention vs cost of inaction"""

    if HAS_GEMINI and genai:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                f"{SYSTEM_PROMPT}\n\n{prompt}",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=1024,
                    temperature=0.7,
                ),
            )
            return {"success": True, "response": response.text, "source": "gemini"}
        except Exception as e:
            return {"success": False, "response": f"Gemini error: {str(e)}", "source": "error"}
    else:
        return _mock_what_if_response(query)


async def chat_with_ai(message: str, context: dict) -> dict:
    """Natural language chat interface powered by Gemini."""
    prompt = f"""Manager message: "{message}"

Context:
- Total shipments: {context.get('total_shipments', 0)}
- Critical alerts: {context.get('critical_count', 0)}
- Warnings: {context.get('warning_count', 0)}
- Recent decisions: {context.get('recent_decisions', 0)}
- Losses prevented this month: ${context.get('losses_prevented', 0):,}

Respond naturally and helpfully. If the manager asks about specific shipments or risks,
provide data-driven answers. Keep responses concise (3-5 sentences max)."""

    if HAS_GEMINI and genai:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                f"{SYSTEM_PROMPT}\n\n{prompt}",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=512,
                    temperature=0.8,
                ),
            )
            return {"success": True, "response": response.text, "source": "gemini"}
        except Exception as e:
            return {"success": False, "response": f"Gemini error: {str(e)}", "source": "error"}
    else:
        return _mock_chat_response(message)


def _mock_decision_response(shipment, disruption):
    name = shipment.get("name", "Unknown")
    loss = disruption.get("impact", {}).get("estimated_loss", 500000)
    return {
        "success": True,
        "source": "mock",
        "response": (
            f"## AI Analysis — {name}\n\n"
            f"**Immediate Action Required:** The {disruption['name']} poses a critical threat.\n\n"
            f"### Recommended Actions:\n"
            f"1. **Reroute immediately** via alternate corridor to avoid disruption zone\n"
            f"2. **Pre-position inventory** at nearest safe warehouse (estimated 48h window)\n"
            f"3. **Activate backup supplier** for critical components\n\n"
            f"### Financial Impact:\n"
            f"- Cost of rerouting: ~${int(loss * 0.04):,}\n"
            f"- Loss if no action: ~${loss:,}\n"
            f"- **Net saving: ${int(loss * 0.96):,}**\n\n"
            f"### Risk Assessment:\n"
            f"- Current risk: CRITICAL\n"
            f"- Post-action risk: LOW\n"
            f"- Confidence: 87%"
        ),
    }


def _mock_what_if_response(query):
    return {
        "success": True,
        "source": "mock",
        "response": (
            f"## Scenario Analysis\n\n"
            f"**Query:** {query}\n\n"
            f"### Simulation Results (1,000 runs):\n"
            f"- **Shipments affected:** 4 of 10 active\n"
            f"- **Average delay:** 8.3 days\n"
            f"- **Revenue at risk:** ₹4.2 Crore\n"
            f"- **Probability of stockout:** 28%\n\n"
            f"### Recommended Strategy:\n"
            f"1. Reroute 3 vessels via alternate corridor NOW\n"
            f"2. Airfreight top 2 critical SKUs (pharma + electronics)\n"
            f"3. Activate backup supplier for affected commodities\n\n"
            f"**Cost of strategy:** ₹38 Lakhs\n"
            f"**Loss avoided:** ₹4.2 Crore\n"
            f"**Net benefit:** ₹3.82 Crore ✅"
        ),
    }


def _mock_chat_response(message):
    msg_lower = message.lower()
    if "risk" in msg_lower or "danger" in msg_lower:
        text = "Currently, 3 shipments are at elevated risk: MV-Orion (typhoon zone, score 82), TRK-4821 (road flooding, score 71), and MV-Poseidon (Red Sea threat, score 68). I recommend reviewing the decision queue for immediate actions."
    elif "save" in msg_lower or "money" in msg_lower or "cost" in msg_lower:
        text = "This month, ChainGuard has prevented 5 disruption cascades. Total rerouting cost: ₹28 Lakhs. Estimated losses avoided: ₹2.8 Crore. That's an ROI of approximately 900%."
    elif "weather" in msg_lower or "storm" in msg_lower:
        text = "A tropical cyclone is forming in the Bay of Bengal with projected landfall near Chennai in 48 hours. 3 shipments are in the affected zone. I've prepared decision cards for each — check the queue."
    else:
        text = f"I've analyzed your query. Based on current supply chain data, all systems are being monitored in real-time. There are 2 critical alerts and 3 warnings requiring attention. Would you like me to detail any specific shipment or risk area?"
    return {"success": True, "response": text, "source": "mock"}
