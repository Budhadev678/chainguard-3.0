<div align="center">

# 🛡️ ChainGuard 3.0 — AI-Powered Supply Chain Control Tower

### Smart Supply Chains: Resilient Logistics & Dynamic Optimization

*Shifting from reactive to proactive/predictive logistics using AI*

**Google Solution Challenge 2026**

[Live Demo](#deployment) · [Architecture](#architecture) · [Features](#features) · [Setup](#quick-start)

---

</div>

## 🎯 Problem Statement

Modern supply chains handle **millions of shipments** simultaneously across complex global networks. The core problem is **reactive management** — disruptions like weather events, port congestion, or road blockages are only discovered **after** delivery timelines are already broken.

### How the Industry Currently Works

| Current Approach | Problem |
|---|---|
| Manual monitoring | Dispatchers watch dashboards and react when something goes wrong |
| Siloed data | Weather, traffic, and shipment data sit in separate systems |
| Fixed routes | Routes are pre-planned and rarely adjusted mid-journey |
| Delayed alerts | A delay is flagged only after it happens, not before |

### Our Solution: ChainGuard 3.0

ChainGuard is a **unified control tower** that uses **Google Gemini AI** to:

1. **Detect** disruptions across 7 data signals before they cascade
2. **Simulate** the downstream impact (cascade analysis over 14 days)
3. **Generate** AI-powered route alternatives with cost/time/carbon tradeoffs
4. **Recommend** optimal decisions with one-click approval
5. **Prevent** losses before they happen — not after

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHAINGUARD 3.0 FRONTEND                      │
│                   React + Vite + Leaflet                        │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Command     │  │  War Room    │  │  Analytics            │  │
│  │ Center      │  │  (Collab)    │  │  Dashboard            │  │
│  │ • Map       │  │  • Team Chat │  │  • KPIs               │  │
│  │ • Risk List │  │  • Activity  │  │  • Risk Distribution  │  │
│  │ • Simulator │  │  • Decisions │  │  • Risk Register      │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Supplier    │  │  What-If     │  │  AI Chat Widget       │  │
│  │ Network     │  │  Scenario    │  │  (Floating Gemini)    │  │
│  │ (3 Tiers)   │  │  Lab         │  │                       │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (axios)
┌────────────────────────────┴────────────────────────────────────┐
│                    CHAINGUARD 3.0 BACKEND                       │
│                   FastAPI + Python                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Layer (14 endpoints)                                │  │
│  │  /shipments /suppliers /warehouses /disruptions           │  │
│  │  /simulate-disruption /cascade /route-options             │  │
│  │  /ai-decision /what-if /chat /approve-decision /stats    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────┐  ┌───────┴──────┐  ┌──────────────────────┐ │
│  │ Data Layer   │  │ Risk Engine  │  │ AI Service           │ │
│  │ • 10 Ships   │  │ • 7-Signal   │  │ • Google Gemini API  │ │
│  │ • 8 Suppliers│  │   Fusion     │  │ • Decision Gen       │ │
│  │ • 5 Warehouses│ │ • Cascade Sim│  │ • What-If Analysis   │ │
│  │ • 5 Scenarios│  │ • Route Opt  │  │ • NL Chat            │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast SPA with HMR |
| **Styling** | Vanilla CSS (custom design system) | Dark navy glassmorphism theme |
| **Maps** | Leaflet + OpenStreetMap | Free, no API key needed |
| **Charts** | Custom SVG + CSS | Risk gauges, progress bars |
| **Backend** | FastAPI (Python) | High-performance async API |
| **AI** | Google Gemini 2.0 Flash | Decision engine, scenario analysis, chat |
| **Animations** | Framer Motion | Smooth micro-interactions |
| **Icons** | Lucide React | Clean, consistent icon set |

---

## ✨ Features

### 1. 🗺️ Command Center (Main View)
The central control tower with a **dark-themed global map** showing all 10 shipments in real-time. Each shipment is color-coded by risk level (green/yellow/red) with animated pulse markers. Route polylines show the journey path. Click any shipment to see full details.

### 2. 📊 7-Signal Risk Fusion Engine
Every shipment is scored on **7 independent risk signals**:
- 🌦️ **Weather** — storms, cyclones in the shipment path
- 🛣️ **Route Delay** — traffic, road conditions
- 🏗️ **Port Congestion** — berth availability, wait times
- 📰 **News/Geopolitical** — sanctions, conflicts, trade disruptions
- 🏭 **Supplier Health** — factory status, labor issues
- 📦 **Inventory Level** — warehouse stock, days-of-supply
- 📊 **Historical Patterns** — past delay data for the route

Signals are weighted and fused into a 0-100 score: **Safe (0-40)**, **Warning (41-70)**, **Critical (71+)**.

### 3. ⚡ Disruption Simulator
Inject **5 real-world disruption scenarios** to see how the system responds:
- 🌀 Tropical Cyclone — Bay of Bengal
- ⚠️ Red Sea Shipping Threat
- 🏭 Supplier Labor Strike — Taiwan
- 🏗️ Panama Canal Drought
- 🚧 European Port Strike

When injected, risk scores update instantly, affected shipments are flagged, and the system generates AI recommendations.

### 4. 🌊 Cascade Simulator
See a **14-day timeline** of what happens if you do nothing vs. act now:
- Day 0: Initial disruption
- Day 2-3: Warehouse stockout risk
- Day 4-7: Production line impact
- Day 7-14: Customer delivery failure, revenue loss

Visual comparison of **"Do Nothing"** (escalating losses) vs **"Act Now"** (contained costs).

### 5. 🔀 Multi-Modal Route Optimizer
When a disruption hits, the system generates **3 route alternatives**:
- 🟢 **Cheapest** — Sea reroute (slower but cheapest)
- 🔵 **Fastest** — Air freight (fastest but expensive)
- 🟡 **Recommended** — Hybrid approach (best cost-time-risk balance)

Each option shows: ETA, cost delta, CO₂ impact, and risk score. **One-click approve** to execute.

### 6. 🤖 Gemini AI Decision Engine
Powered by **Google Gemini 2.0 Flash**, the AI provides:
- Structured analysis with key findings
- Numbered action recommendations
- Financial impact estimates (cost of action vs. cost of inaction)
- Risk assessment with confidence scores

### 7. 🔮 What-If Scenario Lab
Ask natural language questions like:
- *"What if the Suez Canal closes for 3 weeks?"*
- *"What if our top supplier goes bankrupt?"*
- *"Which shipments are most at risk this week?"*

Gemini analyzes against the current supply chain state and returns detailed impact analysis.

### 8. 👥 War Room
A **collaborative decision space** for crisis response:
- **5 participants** (Logistics Manager, Carrier, Supplier, Warehouse, AI Engine)
- **Live activity feed** with color-coded entries
- **Active disruption display** with financial impact
- **Team chat** for real-time coordination
- **Session timer** tracking response time

### 9. 🏭 Supplier Network
**8 suppliers across 3 tiers** with visual health monitoring:
- **Tier 1**: Direct partners (4 suppliers)
- **Tier 2**: Sub-suppliers (3 suppliers)
- **Tier 3**: Raw material sources (1 supplier)

Each supplier shows: health score, products, risk factors, dependency chain, and incident history.

### 10. 📈 Analytics Dashboard
Real-time performance metrics:
- **6 KPI cards** — Shipments, Disruptions, Decisions, Loss Avoided, Carbon Saved, Resolved
- **Risk Distribution** — Visual breakdown of Safe/Warning/Critical
- **Impact Summary** — Before/after comparison (detection speed, cascade prevention, ROI)
- **Shipment Risk Register** — Sortable table of all shipments with risk scores

### 11. 💬 Floating AI Chat
A **persistent chat widget** powered by Gemini that floats across all views:
- Quick prompt buttons for common questions
- Full natural language support
- Minimizable and closeable
- Shows response source (Gemini vs mock)

### 12. 🌱 Carbon Impact
Every route option includes **CO₂ emission estimates**. The system recommends the most carbon-efficient option that still meets delivery deadlines, helping organizations track their environmental impact.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.10+
- **Google Gemini API Key** ([Get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/Budhadev678/chainguard-3.0.git
cd chainguard-3.0

# ── Backend Setup ──
cd backend
pip install -r requirements.txt

# Create .env file with your Gemini API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start backend server
python -m uvicorn main:app --reload --port 8000

# ── Frontend Setup (new terminal) ──
cd ../frontend
npm install

# Start frontend dev server
npm run dev
```

Open `http://localhost:5174/` in your browser.

### Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | `backend/.env` | Google Gemini API key for AI features |
| `VITE_API_BASE` | `frontend/.env` | Backend API URL (defaults to `http://localhost:8000/api`) |

> **Note:** The app works without a Gemini API key — AI features will use intelligent mock responses for demo purposes.

---

## 🎬 Demo Flow (3-Minute Walkthrough)

Follow this flow to demonstrate all features:

1. **Open the app** → Command Center loads with global map and 10 green-status shipments
2. **Inject "Tropical Cyclone"** → Click ⚡ Simulator → Inject → Watch risk scores spike
3. **Click a high-risk shipment** → Right panel shows 7-signal breakdown
4. **Click 🌊 Cascade** → See 14-day "do nothing vs act now" comparison
5. **Click 🔀 Routes** → See 3 route alternatives → Click ✅ Approve on recommended
6. **Click 🤖 AI** → See Gemini's structured analysis and recommendations
7. **Navigate to War Room** → Show collaborative crisis response with activity feed
8. **Navigate to Suppliers** → Show multi-tier supplier health monitoring
9. **Navigate to Analytics** → Show KPIs, risk distribution, and impact metrics
10. **Open AI Chat** → Ask "Which shipments are most at risk?" → Show natural language AI

---

## 📁 Project Structure

```
chainguard-3.0/
├── backend/                        # FastAPI Python Backend
│   ├── main.py                     # 14 REST API endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment template
│   ├── data/
│   │   ├── shipments.py            # 10 realistic shipments with coordinates
│   │   ├── suppliers.py            # 8 multi-tier suppliers
│   │   ├── warehouses.py           # 5 global warehouses
│   │   └── disruptions.py          # 5 disruption scenarios
│   ├── engine/
│   │   ├── risk_engine.py          # 7-signal weighted risk scorer
│   │   ├── cascade_simulator.py    # 14-day cascade timeline
│   │   └── route_optimizer.py      # Multi-modal route generator
│   └── services/
│       └── gemini_service.py       # Google Gemini AI integration
│
├── frontend/                       # React + Vite Frontend
│   ├── index.html                  # Entry HTML
│   ├── package.json                # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   └── src/
│       ├── App.jsx                 # Main app with navigation
│       ├── api.js                  # API client layer
│       ├── index.css               # Design system (500+ lines)
│       ├── main.jsx                # React entry point
│       └── components/
│           ├── TopBar.jsx          # Header with status indicators
│           ├── ShipmentMap.jsx     # Leaflet map with markers
│           ├── ShipmentList.jsx    # Sidebar shipment list
│           ├── ShipmentPanel.jsx   # Detail panel + risk breakdown
│           ├── DisruptionControl.jsx # Disruption injection
│           ├── WhatIfPanel.jsx     # What-If scenario lab
│           ├── CascadeSimulator.jsx # Cascade timeline view
│           ├── RouteOptions.jsx    # Route alternatives
│           ├── StatsBar.jsx        # Bottom statistics bar
│           ├── ChatWidget.jsx      # Floating AI chat
│           ├── WarRoom/WarRoom.jsx # Collaborative decision view
│           ├── Suppliers/SupplierGraph.jsx # Supplier network
│           └── Analytics/Analytics.jsx     # Analytics dashboard
│
├── render.yaml                     # Render deployment blueprint
├── vercel.json                     # Vercel deployment config
└── README.md                       # This file
```

---

## 🌐 Deployment

### Option 1: Render.com (Recommended — Free Tier)

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Blueprint** → Connect your GitHub repo
4. Render reads `render.yaml` and creates both services automatically
5. Add `GEMINI_API_KEY` in the backend service environment variables
6. Update `VITE_API_BASE` in the frontend service to point to your backend URL

### Option 2: Manual Deployment

**Backend (Render/Railway):**
```bash
cd backend
# Deploy as Python web service
# Build: pip install -r requirements.txt
# Start: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
# Deploy the dist/ folder as a static site
# Set VITE_API_BASE to your backend URL
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/shipments` | All shipments with risk scores |
| GET | `/api/shipments/:id` | Single shipment details |
| GET | `/api/suppliers` | All suppliers with health |
| GET | `/api/warehouses` | All warehouses with stock |
| GET | `/api/disruptions` | Available disruption scenarios |
| GET | `/api/active-disruptions` | Currently active disruptions |
| POST | `/api/simulate-disruption` | Inject a disruption |
| POST | `/api/clear-disruptions` | Clear all disruptions |
| GET | `/api/risk-score/:id` | Detailed risk breakdown |
| GET | `/api/cascade/:ship/:dis` | Cascade simulation |
| GET | `/api/route-options/:ship/:dis` | Route alternatives |
| POST | `/api/ai-decision/:ship/:dis` | AI decision (Gemini) |
| POST | `/api/what-if` | What-if scenario analysis |
| POST | `/api/chat` | Natural language chat |
| POST | `/api/approve-decision` | Approve/reject decision |
| GET | `/api/stats` | Dashboard statistics |

---

## 🤖 Google Gemini Integration

ChainGuard uses **Gemini 2.0 Flash** for three AI functions:

1. **Decision Generation** — Analyzes shipment data, risk signals, and disruption context to recommend immediate actions with financial impact analysis

2. **What-If Scenarios** — Runs scenario analysis against the current supply chain state, estimating affected shipments, delays, and costs

3. **Natural Language Chat** — Answers questions about shipments, risks, and metrics in conversational format

All AI features have **intelligent mock fallbacks** that work without an API key for demo purposes.

---

## 📊 Impact Metrics (Simulated)

| Metric | Before ChainGuard | After ChainGuard |
|---|---|---|
| Disruption Detection | 4-6 hours | **41 seconds** |
| Cascade Prevention | 0% | **73% stopped early** |
| Avg Loss per Incident | $340,000 | **$14,000** |
| Monthly ROI | — | **784%** |
| Carbon Reduction | — | **-12% per shipment** |

---

## 👥 Team

Built for the **Google Solution Challenge 2026** — demonstrating how AI can transform supply chain management from reactive firefighting to proactive risk mitigation.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
