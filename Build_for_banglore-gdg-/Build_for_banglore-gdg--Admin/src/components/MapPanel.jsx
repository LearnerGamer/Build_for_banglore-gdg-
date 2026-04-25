import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
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
        
        {/* Layer: SOS Signals */}
        {layers.sos && signals.map(signal => (
          <Marker 
            key={signal.id}
            position={[signal.latitude, signal.longitude]}
            icon={createCustomIcon(signal)}
            zIndexOffset={300} // Highest priority
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
