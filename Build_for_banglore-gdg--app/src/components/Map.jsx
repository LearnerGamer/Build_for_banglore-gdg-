import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SHELTERS, HOSPITALS, DANGERS, USER_LOC } from '../utils/mockData';

// Custom icons
const createShieldIcon = (color, label, iconType, isHighlighted = false) => new L.DivIcon({
  className: 'custom-shield-icon',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="
        background-color: ${color}; 
        width: ${isHighlighted ? '40px' : '32px'}; 
        height: ${isHighlighted ? '40px' : '32px'}; 
        border-radius: 8px; 
        transform: rotate(45deg); 
        border: 2px solid white; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: ${isHighlighted ? `0 0 25px ${color}` : `0 0 10px rgba(0,0,0,0.5)`};
      ">
        <div style="transform: rotate(-45deg); color: white; font-weight: 900; font-size: ${isHighlighted ? '12px' : '10px'};">${iconType}</div>
      </div>
      <div style="margin-top: 10px; background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 8px; font-weight: 700; white-space: nowrap;">${label}</div>
    </div>
  `,
  iconSize: [40, 60],
  iconAnchor: [20, 20]
});

const UserIcon = new L.DivIcon({
  className: 'user-loc-icon',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; inset: 0; background: #007aff; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px #007aff; z-index: 2;"></div>
      <div style="position: absolute; inset: -8px; background: rgba(0,122,255,0.3); border-radius: 50%; animation: pulse-blue 2s infinite; z-index: 1;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

const Map = ({ onMarkerClick, zoom = 13, center = USER_LOC, rescueMode = false, highlightId }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapResizer />

        {/* User Location */}
        <Marker position={USER_LOC} icon={UserIcon} />

        {/* Markers */}
        {SHELTERS.map(s => (
          <Marker 
            key={s.id} 
            position={s.coords} 
            icon={createShieldIcon('#34c759', 'SHELTER', 'S', s.id === highlightId)}
            eventHandlers={{ click: () => onMarkerClick?.(s) }}
          />
        ))}

        {HOSPITALS.map(h => (
          <Marker 
            key={h.id} 
            position={h.coords} 
            icon={createShieldIcon('#007aff', 'HOSPITAL', 'H', h.id === highlightId)}
            eventHandlers={{ click: () => onMarkerClick?.(h) }}
          />
        ))}

        {/* Danger Zone (Only if high severity) */}
        {DANGERS.map(d => (
          <Circle 
            key={d.id}
            center={d.coords}
            radius={d.radius}
            pathOptions={{ color: '#ff3b30', fillColor: '#ff3b30', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
          />
        ))}
      </MapContainer>

      {/* Rescue Mode Overlay */}
      {rescueMode && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'rgba(0,0,0,0.6)', 
          zIndex: 400, 
          pointerEvents: 'none',
          backdropFilter: 'grayscale(0.5)'
        }}></div>
      )}
    </div>
  );
};

export default Map;
