import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import SheltersMap from './SheltersMap';
import FieldForcesMap from '../modules/field-forces/FieldForcesMap';
import MedicalCentersMap from './MedicalCentersMap';

// Custom icons based on priority to match the design
const createCustomIcon = (signal) => {
  const { priority, isForceReport } = signal;
  let color = '#3b82f6'; // Low (Blue)
  
  if (isForceReport) {
    color = '#22c55e'; // Force Report (Green)
  } else {
    if (priority === 'Critical') color = '#ef4444'; // Red
    else if (priority === 'High') color = '#f97316'; // Orange
    else if (priority === 'Medium') color = '#eab308'; // Yellow
  }

  const markerHtmlStyles = `
    background-color: ${color};
    width: 24px;
    height: 24px;
    display: block;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 15px ${color};
    ${priority === 'Critical' && !isForceReport ? 'animation: pulse-red 1.5s infinite;' : ''}
    ${isForceReport ? 'border-radius: 4px;' : ''}
  `;

  return new L.DivIcon({
    className: 'custom-leaflet-marker',
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    html: `<span style="${markerHtmlStyles}"></span>`
  });
};

const MapController = ({ selectedPosition, onMapClick }) => {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    }
  });

  useEffect(() => {
    if (selectedPosition) {
      map.flyTo([selectedPosition.latitude, selectedPosition.longitude], 14, {
        duration: 1.5
      });
    }
  }, [selectedPosition, map]);
  return null;
};

const MapPanel = ({ 
  signals, 
  shelters, 
  forces,
  medicalCenters, 
  selectedSignal, 
  onSelectSignal,
  onMapClick,
  layers
}) => {
  const center = [12.9716, 77.5946];

  // --- CENTROID CLUSTERING LOGIC ---
  const CLUSTER_THRESHOLD = 0.015; // 1.5km
  const clusters = [];
  const processedIds = new Set();

  signals.forEach(s1 => {
    if (processedIds.has(s1.id)) return;

    // Find all signals close to this one
    const members = signals.filter(s2 => {
      const dist = Math.sqrt(Math.pow(s1.latitude - s2.latitude, 2) + Math.pow(s1.longitude - s2.longitude, 2));
      return dist < CLUSTER_THRESHOLD;
    });

    if (members.length >= 2) {
      // Calculate Centroid (Average position)
      const avgLat = members.reduce((sum, m) => sum + m.latitude, 0) / members.length;
      const avgLng = members.reduce((sum, m) => sum + m.longitude, 0) / members.length;
      
      clusters.push({
        id: `cluster-${s1.id}`,
        latitude: avgLat,
        longitude: avgLng,
        count: members.length,
        priority: members.some(m => m.priority === 'Critical') ? 'Critical' : 'High'
      });

      // Mark all members as processed so we don't create duplicate clusters
      members.forEach(m => processedIds.add(m.id));
    }
  });

  return (
    <div className="panel center-panel" style={{ height: '100%', zIndex: 0 }}>
      {/* react-leaflet z-index fix to sit properly in glass panels */}
      <style>{`.leaflet-container { background: #0a0c10; z-index: 1; } .leaflet-popup-content-wrapper { background: var(--bg-panel); color: white; backdrop-filter: blur(10px); border: 1px solid var(--border-color); } .leaflet-popup-tip { background: var(--bg-panel); border: 1px solid var(--border-color); }`}</style>
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        
        {/* Layer: Unified Cluster Circles (One per group) */}
        {layers.sos && clusters.map(cluster => (
          <Circle
            key={cluster.id}
            center={[cluster.latitude, cluster.longitude]}
            radius={800 + (cluster.count * 200)} // Grow with size
            pathOptions={{ 
              color: cluster.priority === 'Critical' ? '#ef4444' : '#f97316', 
              fillColor: cluster.priority === 'Critical' ? '#ef4444' : '#f97316', 
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '10, 10'
            }}
          />
        ))}

        {/* Layer: Individual SOS Markers */}
        {layers.sos && signals.map(signal => (
          <Marker 
            key={signal.id}
            position={[signal.latitude, signal.longitude]}
            icon={createCustomIcon(signal)}
            zIndexOffset={300} 
            eventHandlers={{
              click: () => onSelectSignal(signal),
            }}
          >
            <Popup>
               <h4 style={{margin:0, fontSize:'14px'}}>{signal.areaName}</h4>
               <p style={{margin:'4px 0 0', fontSize:'12px', color:'#8b949e'}}>Priority: {signal.priority}</p>
            </Popup>
          </Marker>
        ))}

        {/* Layer: Shelters */}
        <SheltersMap 
          shelters={shelters} 
          isVisible={layers.shelters} 
        />

        {/* Layer: Medical */}
        <MedicalCentersMap
          centers={medicalCenters}
          isVisible={layers.medical}
        />

        {/* Layer: Field Forces (Modular) */}
        <FieldForcesMap 
          forces={forces} 
          isVisible={layers.forces} 
        />

        <MapController selectedPosition={selectedSignal} onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
};

export default MapPanel;
