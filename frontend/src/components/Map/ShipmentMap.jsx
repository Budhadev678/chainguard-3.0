// ChainGuard 3.0 — Shipment Map with Leaflet
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RISK_COLORS = {
  critical: '#ef4444',
  warning: '#f59e0b',
  safe: '#10b981',
};

const TYPE_ICONS = {
  vessel: '🚢',
  truck: '🚛',
  aircraft: '✈️',
  train: '🚂',
};

function createShipmentIcon(shipment) {
  const color = RISK_COLORS[shipment.risk_level] || RISK_COLORS.safe;
  const icon = TYPE_ICONS[shipment.type] || '📦';
  const pulse = shipment.risk_level === 'critical' ? 'animation: pulse-glow 1.5s infinite;' : '';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(6, 10, 20, 0.9);
        border: 2px solid ${color};
        box-shadow: 0 0 12px ${color}60;
        font-size: 16px;
        cursor: pointer;
        ${pulse}
      ">${icon}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

function createDisruptionIcon() {
  return L.divIcon({
    className: 'disruption-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.2);
        border: 2px solid #ef4444;
        animation: pulse-glow 1s infinite;
        font-size: 14px;
      ">⚠️</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function ShipmentMap() {
  const { state, dispatch } = useApp();
  const { shipments, activeDisruptions } = state;

  const routeLines = useMemo(() => {
    return shipments.map((s) => {
      const color = RISK_COLORS[s.risk_level] || RISK_COLORS.safe;
      const waypoints = s.waypoints?.map(w => [w.lat, w.lng]) || [];
      return { id: s.id, points: waypoints, color, dashArray: s.status === 'rerouted' ? '8 4' : null };
    });
  }, [shipments]);

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 40]}
        zoom={2.5}
        minZoom={2}
        maxZoom={10}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={true}
        worldCopyJump={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Route polylines */}
        {routeLines.map((route) => (
          route.points.length > 1 && (
            <Polyline
              key={`route-${route.id}`}
              positions={route.points}
              pathOptions={{
                color: route.color,
                weight: 2,
                opacity: 0.5,
                dashArray: route.dashArray,
              }}
            />
          )
        ))}

        {/* Shipment markers */}
        {shipments.map((s) => (
          <Marker
            key={s.id}
            position={[s.current_location.lat, s.current_location.lng]}
            icon={createShipmentIcon(s)}
            eventHandlers={{
              click: () => dispatch({ type: 'SELECT_SHIPMENT', payload: s }),
            }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.9rem' }}>
                  {TYPE_ICONS[s.type]} {s.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 6 }}>{s.cargo}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Risk Score</span>
                  <span style={{ color: RISK_COLORS[s.risk_level], fontWeight: 700 }}>
                    {s.risk_score}/100
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: 2 }}>
                  <span>ETA</span>
                  <span>{s.eta_days} days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: 2 }}>
                  <span>Route</span>
                  <span>{s.origin?.name?.split(',')[0]} → {s.destination?.name?.split(',')[0]}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Disruption zones */}
        {activeDisruptions.map((d) => (
          <React.Fragment key={d.id}>
            <Circle
              center={[d.affected_region.lat, d.affected_region.lng]}
              radius={d.affected_region.radius_km * 1000}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '6 3',
              }}
            />
            <Marker
              position={[d.affected_region.lat, d.affected_region.lng]}
              icon={createDisruptionIcon()}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>⚠️ {d.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{d.description}</div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      <style>{`
        .map-container {
          flex: 1;
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
        }
        .custom-marker, .disruption-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
