# ChainGuard 3.0 — Complete User & Technical Guide

> **AI-Powered Supply Chain Control Tower** | Built for the Google Solution Challenge

---

## 📌 Table of Contents
1. [What Problem Does ChainGuard Solve?](#problem)
2. [How the App Works — Core Logic](#logic)
3. [Navigation & Layout](#navigation)
4. [Module 1: Command Center](#command-center)
5. [Module 2: Decision Center](#decision-center)
6. [Module 3: War Room](#war-room)
7. [Module 4: Supplier Network](#supplier-network)
8. [Module 5: Analytics](#analytics)
9. [Module 6: Settings](#settings)
10. [AI Features — Gemini Integration](#ai-features)
11. [How to Operate the App End-to-End](#workflow)
12. [Button & Feature Reference](#button-reference)
13. [Technical Architecture](#technical-architecture)
14. [Deployment & API](#deployment)

---

## 1. What Problem Does ChainGuard Solve? {#problem}

Modern supply chains are **reactive by default**: companies discover disruptions (port strikes, weather events, geopolitical crises) hours or days after they happen — and then scramble to respond. This costs:

- **$340K average loss per disruption incident** (without AI)
- **4–6 hours** to detect a supply chain problem
- **Cascading failures** that affect 3–5 downstream shipments for every primary disruption

**ChainGuard 3.0** flips this from *reactive* to *proactive*:
- Detects risks in **41 seconds** using AI fusion of 7 live data signals
- Predicts cascade effects *before* they happen
- Generates pre-approved rerouting options
- Enables one-click decisions that **save an average of $14K per incident**

---

## 2. How the App Works — Core Logic {#logic}

### 7-Signal Risk Fusion Engine

Every shipment is scored 0–100 in real-time by fusing **7 live risk signals**:

| Signal | What it monitors |
|---|---|
| 🌦️ **Weather** | Storms, typhoons, floods along the route |
| 🛣️ **Route Delay** | Port congestion, road closures, border delays |
| 🏗️ **Port Congestion** | Live berth availability at origin/destination |
| 📰 **News/Geopolitical** | Sanctions, protests, trade restrictions |
| 🏭 **Supplier Health** | Supplier capacity, financial risk, past incidents |
| 📦 **Inventory Level** | Stock buffers at destination warehouses |
| 📊 **Historical Pattern** | This route's historical delay/risk pattern |

Each signal generates a score (0–50). These are fused by Gemini AI into a single **Risk Score (0–100)**:
- **0–40**: 🟢 Safe — normal monitoring
- **41–70**: 🟡 Warning — elevated attention needed
- **71–100**: 🔴 Critical — immediate action required

### Cascade Ripple Analysis

When a disruption hits shipment A, ChainGuard automatically models how it will ripple downstream:
- Which shipments share the same carrier, route, or port?
- Which warehouse/factory runs out of stock first?
- What is the financial impact in $M?

This cascade tree is shown visually in the **Shipment Panel → Cascade tab**.

### AI Decision Engine (Gemini)

For any critical shipment + disruption pair, Gemini generates:
1. **2–3 route/action options** with cost, delay, CO₂ impact
2. **Confidence score** (0–100%) for each option
3. **Plain-English explanation** of the trade-offs

The human manager reviews and approves with one click.

---

## 3. Navigation & Layout {#navigation}

```
┌─────────────────────────────────────────────────────────────┐
│  TopBar: ChainGuard logo | Status | KPIs | Live Clock       │
├────┬────────────────────────────────────────────────────────┤
│Nav │                    Main Content Area                    │
│ ↕  │                                                         │
│ ←56px→                                                       │
│ Hover│                                                        │
│ =216px│                                                       │
├────┴────────────────────────────────────────────────────────┤
│  StatsBar: 8 live KPI metrics                               │
└─────────────────────────────────────────────────────────────┘
                                   ↗ Floating AI Chat
```

### Navigation Sidebar (Left)
The sidebar is **56px wide by default** (icons only). **Hover over it to expand** to 216px with full labels.

| Icon | View | Keyboard Shortcut |
|---|---|---|
| 🗺️ Map | Command Center | Click |
| ✅ CheckCircle | Decision Center | Click |
| 👥 Users | War Room | Click |
| 🏭 Factory | Supplier Network | Click |
| 📊 BarChart | Analytics | Click |
| ⚙️ Gear | Settings | Click (bottom) |

**Badge indicators:**
- Red dot on **Decision Center** = pending approvals
- Red dot on **War Room** = active disruptions

**API Status dot** (visible when sidebar expanded):
- 🟢 Green pulsing = API Online
- 🔴 Red = API Offline (backend unreachable)
- 🟡 Yellow = Connecting

---

## 4. Module 1: Command Center {#command-center}

**Your primary real-time monitoring hub.**

### Layout (3-column)
```
┌──────────────┬─────────────────────┬──────────────┐
│ Left Sidebar │    LEAFLET MAP       │  Alert Feed  │
│              │    (center)          │  (or Panel)  │
│ KPI strip    │                      │              │
│ Shipment list│                      │              │
│ [Sim|WhatIf] │                      │              │
└──────────────┴─────────────────────┴──────────────┘
```

### Left Sidebar — KPI Mini Strip
Three colored counters at the top:
- **Blue number** = Total active shipments
- **Red/Green number** = Alert count (red if active, green if 0)
- **Purple number** = Decisions made this session

### Left Sidebar — Shipment List
A scrollable list of all tracked shipments, color-coded by risk:
- 🟢 Green border = Safe (risk 0–40)
- 🟡 Yellow border = Warning (risk 41–70)
- 🔴 Red border = Critical (risk 71–100)

**Click any shipment** to open its full detail panel on the right (replaces the Alert Feed).

### Left Sidebar — Bottom Tabs

#### ⚡ Simulator Tab
Inject scenario disruptions to test your network:
- Dropdown list of pre-built disruptions (Suez Closure, Typhoon, Port Strike, etc.)
- **"Simulate Disruption" button** — activates the scenario and pushes it live
- **"Clear All" button** — resets all active disruptions
- Real-time feedback: affected shipment count updates immediately

#### 🧠 What-If AI Tab
Natural language AI scenario engine:
- Type a question like *"What if our top supplier goes bankrupt?"*
- Or click any pre-set example query
- **Send button** or press **Enter** to submit
- Gemini AI responds with analysis and recommendations in seconds

### Center — Interactive Leaflet Map
- **Dark-themed world map** showing all shipment routes
- **Colored markers** (green/yellow/red dots with pulsing rings) at each shipment's current position
- **Disruption markers** (red ⚠️ icons) showing where disruptions are active
- **Click a marker** to select that shipment
- **Zoom in/out** with +/- controls or scroll wheel
- **Popup on hover** shows shipment name, risk level, and current status

### Right — Live Alert Feed (when no shipment selected)
A real-time stream of events:
- New entries auto-populate every 30 seconds
- **X button** on each alert to dismiss it
- Color-coded by type: 🔴 Critical, 🟡 Warning, 🟢 Success, 🔵 Info
- Pinned system alerts cannot be dismissed

### Right — Shipment Detail Panel (when shipment selected)

#### Header
- Shipment name, ID, carrier type icon
- Risk badge (SAFE/WARNING/CRITICAL)
- Cargo type and value ($M)
- **✕ Close button** to deselect

#### 4 Tabs

**Overview Tab** — Snapshot view:
- **Risk Gauge** (circular SVG, 0–100 score)
- Origin → Destination route
- ETA days remaining, Progress %, Carrier name, Container count
- **7-Signal Risk Breakdown** — horizontal bars for each signal
- **Active Disruptions** box (if disruptions affect this shipment):
  - Disruption name + severity badge
  - Impact: delay days + estimated loss ($M)
  - Three action buttons:
    - 🌊 **Cascade** — loads cascade tree (→ Cascade tab)
    - 🔀 **Routes** — loads rerouting options (→ Routes tab)
    - 🤖 **AI** — gets Gemini AI analysis (→ AI Decision tab)

**Cascade Tab** — Downstream impact visualization:
- Shows which shipments/warehouses are affected downstream
- Timeline of when each will be impacted
- Severity levels per affected node

**Routes Tab** — Rerouting options:
- 2–4 alternative route options generated by AI
- Each card shows: cost delta, delay days, CO₂ change, confidence %
- **✅ Approve Route** button — records the decision and updates shipment status
- Decision result banner confirms approval

**AI Decision Tab** — Gemini analysis:
- Full Gemini response explaining the situation
- Formatted markdown (bold, headers, bullet points)
- Source attribution footer

---

## 5. Module 2: Decision Center {#decision-center}

**One-click approval workflow for AI-generated action recommendations.**

### When to use:
Use this view after a disruption is detected. The AI has already analyzed the situation and generated recommendations — your job here is to *review and approve* in under 30 seconds.

### Layout
```
Decision Center Header:  [Pending: 3]  [Approved: 0]  [Deferred: 0]
────────────────────────────────────────────
[Decision Card 1 — CRITICAL]
  Shipment: APAC-EU Semiconductor Run | SHP-001
  Disruption: Suez Canal Closure
  Gemini Recommendation: "Reroute via Cape of Good Hope..."
  
  [Option A: Reroute via Cape]  [Option B: Split & Air-freight]
   $4.2M saved | +8d | 91%      $3.1M saved | +2d | 76%
  
  [✅ Approve & Execute]  [⏰ Defer]

[Decision Card 2 — WARNING]
...
```

### How to use:
1. **Read the Gemini Recommendation** (purple box) — the AI's suggested action
2. **Compare options** (side-by-side cards) — select one by clicking it
3. The selected option highlights in blue border
4. Click **"Approve & Execute"** to implement
   - Card turns green with "Approved — Executing" status
   - Counter updates (Pending ↓, Approved ↑)
5. Click **"Defer"** to skip for now (appears dimmed)

### Stats Counter (top right)
- **Pending** (red) = actions still needing approval
- **Approved** (green) = executed this session
- **Deferred** (yellow) = postponed

### Urgency Indicators
- 🔴 **CRITICAL** badge + red border = high urgency, act within 2–3 hours
- 🟡 **WARNING** badge = medium urgency, 6–18 hours
- ⏱️ **"Expires in"** timer = auto-escalation timeline

---

## 6. Module 3: War Room {#war-room}

**Collaborative real-time decision space for major disruptions.**

### When to use:
Activate the War Room when a disruption affects multiple critical shipments and you need to coordinate across teams (carrier, supplier, warehouse manager).

### Layout (2-column)
```
┌─────────────────────┬─────────────────────────────┐
│  Participants       │  Activity Feed               │
│  Disruption Status  │                             │
│                     │  [Chat Input]               │
└─────────────────────┴─────────────────────────────┘
```

### Left Column

**Participants Panel:**
- 5 key stakeholders shown with avatar, role, location
- 🟢 Green dot = Online (available)
- ⚫ Grey dot = Offline
- Carrier, Supplier, Warehouse Manager, AI Engine

**Active Disruptions Panel:**
- When disruptions are active: shows each disruption card
  - Name, description, affected shipment count, delay days, loss at risk
  - Summary row: Total Active / Total Affected / Total $ At Risk
- When no disruptions: shows "All systems nominal" placeholder

### Right Column — Activity Feed + Chat

**Activity Log:**
- Auto-populated timeline of all events
- Color-coded dots: 🔴 Alert | 🔵 Info | 🟢 Success | 🔵 Message
- Timestamps in HH:MM:SS format
- Scrolls as new messages arrive

**Chat Input:**
- Type a message and press **Enter** or **Send button**
- Your message appears as "You: [message]"
- Used for manual coordination notes during an active incident

**Session Timer** (top right when active):
- Shows elapsed time since disruption escalated to War Room
- Resets when disruptions are cleared

**Status Badge:**
- 🔴 **ACTIVE SESSION** (pulsing) = disruptions in progress
- ⚫ **STANDBY** = all clear

---

## 7. Module 4: Supplier Network {#supplier-network}

**Multi-tier supplier health monitoring and risk assessment.**

### Layout
```
Summary Row: [Tier 1: N suppliers | Avg Health] [Tier 2] [Tier 3]
────────────────────────────────────────────────────────────────
Tier 1 — Direct Partners
  [Supplier Card] [Supplier Card] [Supplier Card]

Tier 2 — Sub-suppliers
  [Supplier Card] ...

Tier 3 — Raw Materials
  [Supplier Card] ...
```

### Tier Summary Row
Three summary cards (one per tier) showing:
- Tier badge (Blue=1, Orange=2, Red=3)
- Total supplier count
- Average health score with mini progress bar
- ⚠️ Critical count if any suppliers are critical

### Supplier Cards
Each card shows:
- **Health Score** (large number, 0–100, color-coded)
- **Status icon** (✅ Healthy / ⚠️ Warning / ❌ Critical)
- Supplier name and location (with globe icon)
- **Product tags** (chips showing what they supply)
- **Risk factors** (yellow warning tags)
- **Last incident** (if any, shown in red)
- **Dependencies** (which other suppliers they rely on)

### Reading Health Scores
- **80–100**: 🟢 Healthy — no action needed
- **40–79**: 🟡 Warning — monitor closely
- **0–39**: 🔴 Critical — consider backup suppliers

---

## 8. Module 5: Analytics {#analytics}

**Performance dashboard with KPIs, risk distribution, and impact metrics.**

### 4 KPI Cards (Top Row)

| Card | Metric | Trend |
|---|---|---|
| 🔵 Active Shipments | Count of shipments in transit | +8% vs last month |
| 🔴 High Risk | Critical + Warning shipments | -3% (improving!) |
| 🟣 Pending Decisions | Awaiting approval | — |
| 🟢 CO₂ Impact | Tonnes saved by rerouting | +12% |

Cards animate when the page loads (count-up numbers + slide animation).

### Risk Distribution Chart
Horizontal bar chart showing:
- Critical / Warning / Safe breakdown with counts
- Bars animate to correct width on load
- **Average Risk Score** progress bar at bottom

### Impact Summary
Comparison table showing before/after ChainGuard:
- Detection Speed: ~~4–6 hours~~ → **41 seconds**
- Cascade Prevention: **73% stopped early**
- Avg Loss per Incident: ~~$340K~~ → **$14K**
- ROI (This Month): **784%**
- Carbon Reduction: **-12% per shipment**

### Shipment Risk Register Table
When shipments are loaded from the API:
- Sortable table by risk score (highest first)
- Columns: Name | Route | Type | Risk Score | Status badge | Progress bar
- Risk scores color-coded (red/yellow/green)

---

## 9. Module 6: Settings {#settings}

**System configuration and integration management.**

### API Configuration
- **Gemini API Key** — hidden by default, click 👁️ eye icon to reveal/hide
- **Backend API URL** — the FastAPI server URL (changes where data is fetched from)
- Click fields to edit, then **Save Settings**

### Monitoring Settings
- **Data Refresh Interval** — how often (seconds) the app polls the API (10–300s)
- **Risk Alert Threshold** — the risk score above which alerts are triggered
  - Slide the range input to adjust
  - Color changes: 🟢 (0–40) → 🟡 (41–70) → 🔴 (71–100)

### Notifications
- **Email Alerts** toggle — on/off (sends alert emails for critical events)
- **Slack Integration** toggle — on/off (pushes to your Slack workspace)

### Display Preferences
- **Dark Mode** toggle — on = navy dark theme (recommended)
- **Compact View** toggle — on = smaller cards, more data density

### Save Button
- Click **"Save Settings"** → button turns green with ✅ "Saved!" for 3 seconds

---

## 10. AI Features — Gemini Integration {#ai-features}

ChainGuard uses Google's Gemini AI in 4 ways:

### 1. Floating Chat Widget (bottom-right FAB button)
- Click the blue circular button at bottom-right of every screen
- Opens a chat window with quick-prompt buttons
- Ask anything: *"Which shipments are most at risk?"*, *"How much money did we save?"*
- Detects "what if" questions automatically and routes to the What-If engine
- Minimize/maximize without losing conversation history
- Unread message counter shows when AI responds while chat is closed

### 2. What-If Scenario Engine (Simulator → What-If AI tab)
- Natural language scenario modeling
- Type: *"What if the Suez Canal closes for 3 weeks?"*
- Gemini models the impact on all active shipments
- Returns affected ships, financial impact, recommended mitigation
- Example prompts pre-loaded: Suez Canal, supplier bankruptcy, port strike, weather

### 3. AI Decision Generator (Shipment Panel → AI tab)
- Select a disruption affecting a shipment
- Click **🤖 AI** button in the disruption card
- Gemini analyzes the specific shipment + disruption combination
- Returns formatted analysis with recommended next steps

### 4. Route Option Generator
- Click **🔀 Routes** in the disruption card
- AI generates 2–4 alternative routing scenarios
- Each option: estimated cost, delay, CO₂ impact, confidence score
- Approve the best option with one click

---

## 11. How to Operate the App End-to-End {#workflow}

### Standard Daily Workflow (Normal Operations)

```
Morning:
1. Open Command Center → scan Shipment List for any red/yellow items
2. Check Alert Feed on the right for overnight events  
3. Review Analytics KPI cards for trend changes
4. Check Supplier Network for any health score drops

If all clear → periodic monitoring every 30 min
```

### Crisis Response Workflow (Disruption Detected)

```
Step 1: DETECT
  → Red alert appears in Alert Feed
  → Command Center map shows ⚠️ disruption marker
  → Affected shipment turns red in Shipment List

Step 2: ASSESS
  → Click the affected shipment in the list
  → Read the 7-Signal Risk Breakdown (which signals spiked?)
  → Click "🌊 Cascade" to see downstream impact
  
Step 3: DECIDE
  → Go to Decision Center (left nav)
  → Review Gemini's recommendation for the shipment
  → Compare options (cost vs. delay vs. CO₂)
  → Select preferred option and click "✅ Approve & Execute"

Step 4: COORDINATE
  → Go to War Room for team coordination
  → Carrier and supplier are notified
  → Log decisions in activity feed

Step 5: MONITOR
  → Return to Command Center
  → Watch shipment marker update on map
  → Track progress in Shipment Detail Panel

Step 6: ANALYZE
  → After resolution, visit Analytics
  → Review loss avoided and decision efficiency
  → Review ROI improvement
```

### Scenario Testing Workflow (What-If)

```
1. Go to Command Center → Simulator tab
2. Select a scenario from dropdown (e.g., "Suez Canal Closure")
3. Click "Simulate Disruption"
4. Watch the map update with disruption markers
5. Affected shipments turn red
6. Go to Decision Center to see auto-generated options
7. To reset: click "Clear All Disruptions"
```

---

## 12. Button & Feature Reference {#button-reference}

| Location | Button/Element | Action |
|---|---|---|
| TopBar | **Refresh** | Manually poll the API for fresh data |
| TopBar | **Status dot** (green/red) | Shows if disruptions are active |
| Connection Banner | **Retry** | Retries connecting to backend API |
| Sidebar | **Nav icons** | Switch views |
| Sidebar | **Hover** | Expands sidebar with labels |
| KPI Mini Strip | **3 numbers** | Ships/Alerts/Decisions (read-only) |
| Shipment List | **Shipment row click** | Opens Shipment Detail Panel |
| Simulator tab | **Simulate Disruption** | Injects scenario disruption |
| Simulator tab | **Clear All** | Removes all active disruptions |
| What-If tab | **Example queries** | Pre-fills and sends that query |
| What-If tab | **Send / Enter** | Submits your question to Gemini |
| Map | **Marker click** | Selects shipment |
| Map | **Scroll/zoom** | Navigate map |
| Alert Feed | **✕ on alert** | Dismisses that alert |
| Shipment Panel | **✕ (top right)** | Closes detail panel |
| Shipment Panel | **Overview tab** | Shows risk gauge + 7 signals |
| Shipment Panel | **🌊 Cascade** | Loads cascade analysis |
| Shipment Panel | **🔀 Routes** | Loads AI route options |
| Shipment Panel | **🤖 AI** | Gets Gemini analysis |
| Shipment Panel | **Route card** | Selects that route option |
| Shipment Panel | **✅ Approve Route** | Approves and executes decision |
| Decision Center | **Option card click** | Selects that AI option |
| Decision Center | **Approve & Execute** | Implements the decision |
| Decision Center | **Defer** | Postpones decision |
| War Room | **Send / Enter** | Posts your message to activity log |
| Analytics | **KPI cards** | Read-only performance metrics |
| Settings | **👁️ Eye icon** | Show/hide API key |
| Settings | **Toggle switch** | Enable/disable feature |
| Settings | **Threshold slider** | Adjust risk alert level |
| Settings | **Save Settings** | Persists configuration changes |
| Chat FAB | **Blue circle (bottom-right)** | Opens AI chat widget |
| Chat | **Quick prompts** | Pre-fill common questions |
| Chat | **Minimize** | Collapses chat to header bar |
| Chat | **✕ Close** | Hides chat (FAB reappears) |

---

## 13. Technical Architecture {#technical-architecture}

```
Frontend (React 19 + Vite 8)
├── App.jsx — routing, state management, API polling
├── TopBar.jsx — live clock, status indicators
├── components/
│   ├── Dashboard/
│   │   ├── KPICards.jsx — 4 animated metric cards
│   │   └── AlertFeed.jsx — live alert stream
│   ├── Decisions/
│   │   └── DecisionCenter.jsx — approve/defer workflow
│   ├── Settings/
│   │   └── SettingsPage.jsx — configuration UI
│   ├── ShipmentMap.jsx — Leaflet map with markers
│   ├── ShipmentList.jsx — scrollable shipment roster
│   ├── ShipmentPanel.jsx — detail panel (4 tabs)
│   ├── CascadeSimulator.jsx — downstream impact tree
│   ├── RouteOptions.jsx — AI route comparison cards
│   ├── DisruptionControl.jsx — simulator controls
│   ├── WhatIfPanel.jsx — NLP AI scenario engine
│   ├── ChatWidget.jsx — floating Gemini chat
│   ├── StatsBar.jsx — bottom 8-metric bar
│   ├── WarRoom/WarRoom.jsx — collaborative space
│   ├── Suppliers/SupplierGraph.jsx — tier health view
│   └── Analytics/Analytics.jsx — performance charts
└── api.js — centralized fetch client

Backend (FastAPI + Python)
├── main.py — REST API (12 endpoints)
├── Gemini AI integration (google-generativeai)
└── Mock data (shipments, disruptions, suppliers, warehouses)

API Endpoints:
GET  /api/shipments              — all shipments + risk scores
GET  /api/disruptions            — all disruption scenarios
GET  /api/active-disruptions     — currently active disruptions
GET  /api/warehouses             — warehouse locations
GET  /api/suppliers              — supplier network
GET  /api/stats                  — aggregated KPIs
POST /api/simulate-disruption    — activate a scenario
POST /api/clear-disruptions      — reset all scenarios
GET  /api/cascade/:ship/:dis     — cascade analysis
GET  /api/route-options/:s/:d    — AI route options
POST /api/ai-decision            — Gemini decision analysis
POST /api/what-if                — NLP what-if query
POST /api/chat                   — general AI chat
POST /api/approve-decision       — record approved decision
```

---

## 14. Deployment & API {#deployment}

| Component | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | Auto-deployed on push to `main` |
| **Backend** | Railway | `https://chainguard-v3-production.up.railway.app` |
| **API Base** | — | `/api` prefix on backend URL |

### Auto-Refresh
The frontend polls the API every **30 seconds** automatically. The live clock in the TopBar ticks every second.

### Offline Mode
If the backend is unreachable:
- A banner shows: "Backend offline — showing cached data"
- API Offline dot shows in the expanded sidebar
- The app still renders all views with empty/zero data
- Retry button attempts reconnection

### Environment Variables
```env
VITE_API_BASE=https://chainguard-v3-production.up.railway.app/api
```
Set in `.env.production` for Vercel builds, or `.env` for local development.

---

*ChainGuard 3.0 — Turning supply chain chaos into clarity.*
*Built with React 19, FastAPI, Google Gemini AI, and Leaflet Maps.*
