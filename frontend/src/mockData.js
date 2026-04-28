/**
 * ChainGuard 3.0 — Comprehensive Demo/Mock Data
 * Used as fallback when the backend API is unreachable.
 * Provides a realistic, fully-populated supply chain scenario.
 */

export const MOCK_SHIPMENTS = {
  shipments: [
    {
      id: 'SHP-001',
      name: 'APAC-EU Semiconductor Run',
      cargo: 'Semiconductor Chips (TSMC)',
      type: 'vessel',
      carrier: 'Evergreen Marine',
      containers: 42,
      value_usd: 18400000,
      risk_score: 82,
      risk_level: 'critical',
      progress_pct: 38,
      eta_days: 14,
      origin: { name: 'Kaohsiung, Taiwan', code: 'KHH' },
      destination: { name: 'Rotterdam, Netherlands', code: 'RTM' },
      current_location: { lat: 12.5, lng: 55.0 },
      waypoints: [
        { lat: 22.6, lng: 120.3 }, // Kaohsiung
        { lat: 1.3, lng: 103.8 },  // Singapore Strait
        { lat: 12.5, lng: 55.0 },  // Current: Gulf of Aden
        { lat: 29.9, lng: 32.5 },  // Suez Canal
        { lat: 51.9, lng: 4.5 },   // Rotterdam
      ],
      risk_signals: {
        weather: 45,
        route_delay: 78,
        port_congestion: 62,
        geopolitical: 88,
        supplier_health: 30,
        inventory_level: 55,
        historical_pattern: 70,
      },
      disruptions: [
        {
          id: 'DIS-001',
          name: 'Suez Canal Closure',
          type: 'geopolitical',
          severity: 'critical',
          description: 'Geopolitical tensions have forced temporary Suez Canal closure',
          impact: { delay_days: 8, estimated_loss: 4200000 },
        }
      ],
    },
    {
      id: 'SHP-002',
      name: 'Brazil Coffee Export',
      cargo: 'Premium Coffee Beans',
      type: 'vessel',
      carrier: 'MSC Mediterranean',
      containers: 18,
      value_usd: 3200000,
      risk_score: 34,
      risk_level: 'safe',
      progress_pct: 71,
      eta_days: 5,
      origin: { name: 'Santos, Brazil', code: 'SSZ' },
      destination: { name: 'Hamburg, Germany', code: 'HAM' },
      current_location: { lat: 20.0, lng: -28.0 },
      waypoints: [
        { lat: -23.9, lng: -46.3 }, // Santos
        { lat: 20.0, lng: -28.0 },  // Current: Mid-Atlantic
        { lat: 53.6, lng: 9.9 },    // Hamburg
      ],
      risk_signals: { weather: 20, route_delay: 15, port_congestion: 40, geopolitical: 10, supplier_health: 85, inventory_level: 70, historical_pattern: 25 },
      disruptions: [],
    },
    {
      id: 'SHP-003',
      name: 'Mumbai Auto Parts',
      cargo: 'Automotive Components',
      type: 'vessel',
      carrier: 'Maersk Line',
      containers: 28,
      value_usd: 6800000,
      risk_score: 61,
      risk_level: 'warning',
      progress_pct: 55,
      eta_days: 9,
      origin: { name: 'Nhava Sheva, India', code: 'INNSA' },
      destination: { name: 'Los Angeles, USA', code: 'LAX' },
      current_location: { lat: 15.0, lng: 70.0 },
      waypoints: [
        { lat: 18.9, lng: 72.8 },  // Mumbai
        { lat: 15.0, lng: 70.0 },  // Current: Arabian Sea
        { lat: 1.3, lng: 103.8 },  // Singapore
        { lat: 23.1, lng: -109.4 },// Pacific
        { lat: 33.7, lng: -118.2 },// Los Angeles
      ],
      risk_signals: { weather: 72, route_delay: 55, port_congestion: 48, geopolitical: 20, supplier_health: 60, inventory_level: 45, historical_pattern: 50 },
      disruptions: [
        {
          id: 'DIS-002',
          name: 'Bay of Bengal Storm System',
          type: 'weather',
          severity: 'warning',
          description: 'Cyclone Mocha tracking through Bay of Bengal — route deviation required',
          impact: { delay_days: 3, estimated_loss: 1800000 },
        }
      ],
    },
    {
      id: 'SHP-004',
      name: 'Japan Electronics Express',
      cargo: 'Consumer Electronics',
      type: 'aircraft',
      carrier: 'Japan Airlines Cargo',
      containers: 6,
      value_usd: 24000000,
      risk_score: 22,
      risk_level: 'safe',
      progress_pct: 88,
      eta_days: 1,
      origin: { name: 'Narita, Japan', code: 'NRT' },
      destination: { name: 'Frankfurt, Germany', code: 'FRA' },
      current_location: { lat: 55.0, lng: 60.0 },
      waypoints: [
        { lat: 35.7, lng: 140.3 }, // Tokyo
        { lat: 55.0, lng: 60.0 },  // Current: Siberia
        { lat: 50.0, lng: 8.6 },   // Frankfurt
      ],
      risk_signals: { weather: 10, route_delay: 20, port_congestion: 5, geopolitical: 25, supplier_health: 90, inventory_level: 80, historical_pattern: 15 },
      disruptions: [],
    },
    {
      id: 'SHP-005',
      name: 'Gulf Petrochemical Tanker',
      cargo: 'Crude Oil (300,000 bbl)',
      type: 'vessel',
      carrier: 'VLCC Titan',
      containers: 0,
      value_usd: 28500000,
      risk_score: 75,
      risk_level: 'critical',
      progress_pct: 22,
      eta_days: 18,
      origin: { name: 'Ras Tanura, Saudi Arabia', code: 'RSRT' },
      destination: { name: 'Singapore', code: 'SIN' },
      current_location: { lat: 24.0, lng: 58.5 },
      waypoints: [
        { lat: 26.6, lng: 50.1 }, // Ras Tanura
        { lat: 24.0, lng: 58.5 }, // Current: Gulf of Oman
        { lat: 22.0, lng: 63.0 }, // Arabian Sea
        { lat: 1.3, lng: 103.8 }, // Singapore
      ],
      risk_signals: { weather: 35, route_delay: 88, port_congestion: 70, geopolitical: 90, supplier_health: 40, inventory_level: 60, historical_pattern: 65 },
      disruptions: [
        {
          id: 'DIS-001',
          name: 'Suez Canal Closure',
          type: 'geopolitical',
          severity: 'critical',
          description: 'Geopolitical tensions — Strait of Hormuz risk elevated',
          impact: { delay_days: 12, estimated_loss: 7200000 },
        }
      ],
    },
    {
      id: 'SHP-006',
      name: 'USA Grain Export',
      cargo: 'Wheat & Corn (45,000t)',
      type: 'vessel',
      carrier: 'Cargill Ocean Transportation',
      containers: 0,
      value_usd: 12000000,
      risk_score: 42,
      risk_level: 'warning',
      progress_pct: 64,
      eta_days: 7,
      origin: { name: 'New Orleans, USA', code: 'MSY' },
      destination: { name: 'Alexandria, Egypt', code: 'ALY' },
      current_location: { lat: 28.0, lng: -44.0 },
      waypoints: [
        { lat: 29.9, lng: -90.0 }, // New Orleans
        { lat: 28.0, lng: -44.0 }, // Current: Atlantic
        { lat: 31.2, lng: 29.9 },  // Alexandria
      ],
      risk_signals: { weather: 38, route_delay: 30, port_congestion: 55, geopolitical: 60, supplier_health: 75, inventory_level: 35, historical_pattern: 40 },
      disruptions: [],
    },
    {
      id: 'SHP-007',
      name: 'Nairobi Tech Hub Delivery',
      cargo: 'Server Infrastructure',
      type: 'truck',
      carrier: 'DHL Express Africa',
      containers: 4,
      value_usd: 5400000,
      risk_score: 28,
      risk_level: 'safe',
      progress_pct: 79,
      eta_days: 2,
      origin: { name: 'Dubai, UAE', code: 'DXB' },
      destination: { name: 'Nairobi, Kenya', code: 'NBO' },
      current_location: { lat: 4.0, lng: 42.0 },
      waypoints: [
        { lat: 25.2, lng: 55.3 }, // Dubai
        { lat: 4.0, lng: 42.0 },  // Current: Ethiopia/Kenya border
        { lat: -1.2, lng: 36.8 }, // Nairobi
      ],
      risk_signals: { weather: 15, route_delay: 25, port_congestion: 10, geopolitical: 35, supplier_health: 82, inventory_level: 68, historical_pattern: 20 },
      disruptions: [],
    },
    {
      id: 'SHP-008',
      name: 'European Pharma Critical',
      cargo: 'Vaccines (Temperature-Controlled)',
      type: 'aircraft',
      carrier: 'Lufthansa Cargo',
      containers: 2,
      value_usd: 9800000,
      risk_score: 88,
      risk_level: 'critical',
      progress_pct: 15,
      eta_days: 6,
      origin: { name: 'Basel, Switzerland', code: 'BSL' },
      destination: { name: 'Mumbai, India', code: 'BOM' },
      current_location: { lat: 40.0, lng: 28.0 },
      waypoints: [
        { lat: 47.6, lng: 7.5 },  // Basel
        { lat: 40.0, lng: 28.0 }, // Current: Istanbul area
        { lat: 19.0, lng: 72.8 }, // Mumbai
      ],
      risk_signals: { weather: 20, route_delay: 95, port_congestion: 80, geopolitical: 88, supplier_health: 50, inventory_level: 92, historical_pattern: 78 },
      disruptions: [
        {
          id: 'DIS-001',
          name: 'Suez Canal Closure',
          type: 'geopolitical',
          severity: 'critical',
          description: 'Airspace restrictions over conflict zone — alternative routing required',
          impact: { delay_days: 5, estimated_loss: 9800000 },
        }
      ],
    },
  ]
};

export const MOCK_DISRUPTIONS = {
  disruptions: [
    {
      id: 'DIS-001',
      name: 'Suez Canal Closure',
      type: 'geopolitical',
      severity: 'critical',
      description: 'Geopolitical tensions have caused temporary Suez Canal closure. All eastbound and westbound traffic re-routing via Cape of Good Hope.',
      affected_region: { lat: 30.5, lng: 32.3, radius_km: 400 },
      affected_shipments: ['SHP-001', 'SHP-005', 'SHP-008'],
      impact: { estimated_loss: 21400000, delay_days: 8 },
      active: false,
    },
    {
      id: 'DIS-002',
      name: 'Bay of Bengal Cyclone',
      type: 'weather',
      severity: 'warning',
      description: 'Category 3 cyclone Mocha tracking through Bay of Bengal. Wind speeds 150 km/h. Vessels advised to deviate south.',
      affected_region: { lat: 15.0, lng: 87.0, radius_km: 600 },
      affected_shipments: ['SHP-003'],
      impact: { estimated_loss: 1800000, delay_days: 3 },
      active: false,
    },
    {
      id: 'DIS-003',
      name: 'Los Angeles Port Strike',
      type: 'infrastructure',
      severity: 'warning',
      description: 'ILWU dock workers strike — LA/Long Beach ports processing at 30% capacity. Average wait time 14 days.',
      affected_region: { lat: 33.7, lng: -118.2, radius_km: 200 },
      affected_shipments: ['SHP-003'],
      impact: { estimated_loss: 2400000, delay_days: 12 },
      active: false,
    },
    {
      id: 'DIS-004',
      name: 'Taiwan Strait Tensions',
      type: 'geopolitical',
      severity: 'critical',
      description: 'Elevated military activity in Taiwan Strait. US and allied naval vessels conducting exercises. Shipping lanes restricted.',
      affected_region: { lat: 25.0, lng: 121.5, radius_km: 300 },
      affected_shipments: ['SHP-001'],
      impact: { estimated_loss: 5600000, delay_days: 6 },
      active: false,
    },
    {
      id: 'DIS-005',
      name: 'TSMC Supplier Capacity Risk',
      type: 'supplier',
      severity: 'warning',
      description: 'Primary component supplier experiencing capacity constraints. 3nm chip production down 18%.',
      affected_region: { lat: 24.8, lng: 120.9, radius_km: 150 },
      affected_shipments: ['SHP-001', 'SHP-004'],
      impact: { estimated_loss: 8000000, delay_days: 14 },
      active: false,
    },
  ]
};

export const MOCK_ACTIVE_DISRUPTIONS = { active: [] };

export const MOCK_WAREHOUSES = {
  warehouses: [
    { id: 'WH-001', name: 'Rotterdam DC', location: { lat: 51.9, lng: 4.5 }, days_of_stock: 18, utilization_pct: 72, status: 'normal' },
    { id: 'WH-002', name: 'Singapore Hub', location: { lat: 1.35, lng: 103.8 }, days_of_stock: 12, utilization_pct: 88, status: 'high' },
    { id: 'WH-003', name: 'LA Fulfillment', location: { lat: 33.7, lng: -118.2 }, days_of_stock: 7, utilization_pct: 95, status: 'critical' },
    { id: 'WH-004', name: 'Dubai Logistics', location: { lat: 25.2, lng: 55.3 }, days_of_stock: 24, utilization_pct: 61, status: 'normal' },
    { id: 'WH-005', name: 'Mumbai Port Store', location: { lat: 18.9, lng: 72.8 }, days_of_stock: 10, utilization_pct: 79, status: 'high' },
    { id: 'WH-006', name: 'Hamburg Terminal', location: { lat: 53.6, lng: 9.9 }, days_of_stock: 21, utilization_pct: 55, status: 'normal' },
    { id: 'WH-007', name: 'Nairobi DC', location: { lat: -1.2, lng: 36.8 }, days_of_stock: 15, utilization_pct: 68, status: 'normal' },
  ]
};

export const MOCK_SUPPLIERS = {
  suppliers: [
    {
      id: 'SUP-001', name: 'TSMC Taiwan', tier: 1, health_score: 62,
      location: 'Hsinchu, Taiwan', products: ['Semiconductors', '3nm Chips'],
      risk_factors: ['Geopolitical tension', 'Capacity constraint'],
      last_incident: '2024-03-15', dependencies: ['SUP-011'],
      status: 'warning',
    },
    {
      id: 'SUP-002', name: 'Samsung SDI', tier: 1, health_score: 85,
      location: 'Suwon, South Korea', products: ['EV Batteries', 'Capacitors'],
      risk_factors: [], last_incident: null, dependencies: ['SUP-012'],
      status: 'healthy',
    },
    {
      id: 'SUP-003', name: 'Bosch Automotive', tier: 1, health_score: 91,
      location: 'Stuttgart, Germany', products: ['ECUs', 'Sensors', 'ABS'],
      risk_factors: [], last_incident: null, dependencies: ['SUP-013'],
      status: 'healthy',
    },
    {
      id: 'SUP-004', name: 'Foxconn Industrial', tier: 2, health_score: 74,
      location: 'Zhengzhou, China', products: ['Assembly', 'Electronics'],
      risk_factors: ['Labor strikes (historical)', 'FX risk'],
      last_incident: '2024-01-20', dependencies: ['SUP-001'],
      status: 'warning',
    },
    {
      id: 'SUP-005', name: 'Jabil Circuit', tier: 2, health_score: 82,
      location: 'Singapore', products: ['PCBs', 'Circuit Assembly'],
      risk_factors: [], last_incident: null, dependencies: ['SUP-002'],
      status: 'healthy',
    },
    {
      id: 'SUP-006', name: 'Flex Ltd', tier: 2, health_score: 79,
      location: 'Austin, TX, USA', products: ['Manufacturing Services'],
      risk_factors: ['Capacity near limit'],
      last_incident: null, dependencies: ['SUP-003'],
      status: 'warning',
    },
    {
      id: 'SUP-007', name: 'BASF Chemicals', tier: 3, health_score: 93,
      location: 'Ludwigshafen, Germany', products: ['Resins', 'Chemicals'],
      risk_factors: [], last_incident: null, dependencies: [],
      status: 'healthy',
    },
    {
      id: 'SUP-008', name: 'Rio Tinto Minerals', tier: 3, health_score: 38,
      location: 'Perth, Australia', products: ['Rare Earth Metals', 'Copper'],
      risk_factors: ['Mine strike', 'Environmental restrictions', 'Export ban risk'],
      last_incident: '2024-04-01', dependencies: [],
      status: 'critical',
    },
    {
      id: 'SUP-009', name: 'Vale Iron Ore', tier: 3, health_score: 71,
      location: 'Belo Horizonte, Brazil', products: ['Iron Ore', 'Nickel'],
      risk_factors: ['Weather disruption in Q2'],
      last_incident: '2023-11-10', dependencies: [],
      status: 'warning',
    },
  ]
};

export const MOCK_STATS = {
  total_shipments: 8,
  active_disruptions: 0,
  decisions_made: 3,
  total_loss_avoided: 4200000,
  carbon_saved_tonnes: 142,
  avg_risk_score: 54.6,
  critical_suppliers: 1,
  warehouse_warnings: 2,
  resolved_this_month: 12,
};
