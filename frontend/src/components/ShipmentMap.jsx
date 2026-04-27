/**
 * ShipmentMap — Leaflet map showing all shipments, routes, and disruption zones.
 */
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const RISK_COLORS = {
  safe: '#34d399',
  warning: '#fbbf24',
  critical: '#f87171',
};

const TYPE_ICONS = {
  vessel: '🚢',
  truck: '🚛',
  aircraft: '✈️',
  train: '🚂',
};

function createShipmentIcon(riskLevel, type) {
  const color = RISK_COLORS[riskLevel] || RISK_COLORS.safe;
  const icon = TYPE_ICONS[type] || '📦';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:32px;height:32px;border-radius:50%;border:2px solid ${color};opacity:0;animation:pulse-ring 2s infinite;"></div>
        <div style="width:28px;height:28px;border-radius:50%;background:${color}20;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 12px ${color}40;">
          ${icon}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function createDisruptionIcon(type) {
  const icons = { weather: '🌀', geopolitical: '⚠️', supplier: '🏭', infrastructure: '🏗️' };
  const icon = icons[type] || '⚠️';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:50px;height:50px;border-radius:50%;border:2px solid #f87171;animation:pulse-ring 2.5s infinite;"></div>
        <div style="width:36px;height:36px;border-radius:50%;background:rgba(248,113,113,0.25);border:2px solid #f87171;display:flex;align-items:center;justify-content:center;font-size:18px;animation:pulse-dot 1.5s infinite;">
          ${icon}
        </div>
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });
}

function warehouseIcon() {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:24px;height:24px;border-radius:6px;background:rgba(129,140,248,0.2);border:2px solid #818cf8;display:flex;align-items:center;justify-content:center;font-size:13px;">🏪</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function FitBounds({ shipments }) {
  const map = useMap();
  useEffect(() => {
    if (shipments.length === 0) return;
    const bounds = shipments.map(s => [s.current_location.lat, s.current_location.lng]);
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    }
  }, [shipments, map]);
  return null;
}

export default function ShipmentMap({
  shipments,
  activeDisruptions,
  warehouses,
  selectedShipment,
  onSelectShipment,
}) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={[20, 60]}
        zoom={3}
        minZoom={2}
        maxZoom={10}
        style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        <FitBounds shipments={shipments} />

        {/* Warehouses */}
        {warehouses.map(wh => (
          <Marker
            key={wh.id}
            position={[wh.location.lat, wh.location.lng]}
            icon={warehouseIcon()}
          >
            <Popup>
              <div style={{ color: '#e8ecf4', fontSize: '12px' }}>
                <strong>{wh.name}</strong><br/>
                Stock: {wh.days_of_stock} days | {wh.utilization_pct}% full
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Disruption zones */}
        {activeDisruptions.map(d => (
          <span key={d.id}>
            <Circle
              center={[d.affected_region.lat, d.affected_region.lng]}
              radius={d.affected_region.radius_km * 1000}
              pathOptions={{
                color: '#f87171',
                fillColor: '#f87171',
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '6 4',
              }}
            />
            <Marker
              position={[d.affected_region.lat, d.affected_region.lng]}
              icon={createDisruptionIcon(d.type)}
            >
              <Popup>
                <div style={{ color: '#e8ecf4', fontSize: '12px', maxWidth: 220 }}>
                  <strong style={{ color: '#f87171' }}>{d.name}</strong><br/>
                  <span style={{ color: '#8b9dc3' }}>{d.description}</span><br/>
                  <span style={{ color: '#fbbf24' }}>Estimated loss: ${(d.impact.estimated_loss / 1000000).toFixed(1)}M</span>
                </div>
              </Popup>
            </Marker>
          </span>
        ))}

        {/* Shipment routes */}
        {shipments.map(s => {
          const riskLevel = s.risk_level || 'safe';
          const color = RISK_COLORS[riskLevel];
          const isSelected = selectedShipment?.id === s.id;

          return (
            <span key={s.id}>
              {/* Route polyline */}
              <Polyline
                positions={s.waypoints.map(wp => [wp.lat, wp.lng])}
                pathOptions={{
                  color: isSelected ? '#38bdf8' : color,
                  weight: isSelected ? 3 : 1.5,
                  opacity: isSelected ? 0.9 : 0.4,
                  dashArray: isSelected ? null : '4 6',
                }}
              />
              {/* Shipment marker at current location */}
              <Marker
                position={[s.current_location.lat, s.current_location.lng]}
                icon={createShipmentIcon(riskLevel, s.type)}
                eventHandlers={{
                  click: () => onSelectShipment(s),
                }}
              >
                <Popup>
                  <div style={{ color: '#e8ecf4', fontSize: '12px', minWidth: 160 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong>{s.name}</strong>
                      <span style={{
                        padding: '1px 8px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontWeight: 700,
                        background: `${color}20`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}>
                        {s.risk_score}
                      </span>
                    </div>
                    <div style={{ color: '#8b9dc3', fontSize: '11px', lineHeight: 1.5 }}>
                      {s.cargo}<br/>
                      {s.origin.name} → {s.destination.name}<br/>
                      ETA: {s.eta_days} days | {s.carrier}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </span>
          );
        })}
      </MapContainer>

      {/* Map legend */}
      <div className="map-legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: '#34d399' }} />Safe (0-40)</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#fbbf24' }} />Warning (41-70)</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#f87171' }} />Critical (71+)</div>
      </div>

      <style>{`
        .map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
        }
        .leaflet-tile-pane {
          filter: none !important;
        }
        .map-legend {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          gap: 12px;
          padding: 6px 14px;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(12px);
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          z-index: 500;
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
