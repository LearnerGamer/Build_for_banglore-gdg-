import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Shield } from 'lucide-react';

const createForceIcon = (status) => {
  let color = '#8b949e'; // Offline
  let iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
  
  if (status === 'Active') color = '#22c55e'; // Green
  else if (status === 'Busy') color = '#eab308'; // Yellow

  return new L.DivIcon({
    className: 'custom-leaflet-marker force-marker',
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    html: `<div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      opacity: 0.95;
    ">${iconHtml}</div>`
  });
};

const FieldForcesMap = ({ forces, isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      {forces.map(force => (
        <Marker 
          key={force.id}
          position={[force.latitude, force.longitude]}
          icon={createForceIcon(force.status)}
          zIndexOffset={100} // Lower than SOS which default to higher
        >
          <Popup>
             <h4 style={{margin:0, fontSize:'14px', display:'flex', alignItems:'center', gap:'4px'}}>
               <Shield size={14} /> Unit: {force.id}
             </h4>
             <p style={{margin:'4px 0 0', fontSize:'12px', color:'#8b949e'}}>
               Status: <span style={{
                 color: force.status === 'Active' ? '#22c55e' : force.status === 'Busy' ? '#eab308' : '#8b949e',
                 fontWeight: 600
               }}>{force.status}</span>
             </p>
             <p style={{margin:'2px 0 0', fontSize:'10px', color:'#555'}}>
               Updated: {new Date(force.last_updated).toLocaleTimeString()}
             </p>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default FieldForcesMap;
