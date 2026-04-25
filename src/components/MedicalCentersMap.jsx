import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PlusSquare } from 'lucide-react';

const createMedicalIcon = () => {
  let iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';

  return new L.DivIcon({
    className: 'custom-leaflet-marker medical-marker',
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    html: `<div style="
      background-color: #3b82f6; /* Blue for medical */
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.4);
    ">${iconHtml}</div>`
  });
};

const MedicalCentersMap = ({ centers, isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      {centers.map(center => (
        <Marker 
          key={center.id}
          position={[center.latitude, center.longitude]}
          icon={createMedicalIcon()}
          zIndexOffset={150}
        >
          <Popup>
             <h4 style={{margin:0, fontSize:'14px', display:'flex', alignItems:'center', gap:'4px'}}>
               <PlusSquare size={14} /> {center.name}
             </h4>
             <p style={{margin:'4px 0 0', fontSize:'12px', color:'#8b949e'}}>
               Type: <span style={{ color: 'white', fontWeight: 600 }}>Hospital</span>
             </p>
             <p style={{margin:'2px 0 0', fontSize:'12px', color:'#22c55e'}}>
               Status: Operating
             </p>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MedicalCentersMap;
