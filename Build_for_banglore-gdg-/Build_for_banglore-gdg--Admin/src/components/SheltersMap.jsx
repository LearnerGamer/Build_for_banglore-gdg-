import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Home, Users } from 'lucide-react';

const createShelterIcon = (status) => {
  let color = '#22c55e'; // Open
  if (status === 'Full' || status === 'Closed') color = '#ef4444'; // Red
  else if (status === 'Limited') color = '#eab308'; // Yellow

  let iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';

  return new L.DivIcon({
    className: 'custom-leaflet-marker shelter-marker',
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    html: `<div style="
      background-color: ${color};
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      box-shadow: 0 6px 12px rgba(0,0,0,0.5);
      transform: rotate(-45deg);
    "><div style="transform: rotate(45deg); display:flex">${iconHtml}</div></div>`
  });
};

const SheltersMap = ({ shelters, isVisible, selectedShelter, onSelectShelter }) => {
  if (!isVisible) return null;

  return (
    <>
      {shelters.map(shelter => (
        <Marker 
          key={shelter.id}
          position={[shelter.latitude, shelter.longitude]}
          icon={createShelterIcon(shelter.status)}
          zIndexOffset={200} // Medium priority
          eventHandlers={{
            click: () => onSelectShelter && onSelectShelter(shelter),
          }}
        >
          <Popup>
             <h4 style={{margin:0, fontSize:'14px', display:'flex', alignItems:'center', gap:'4px'}}>
               <Home size={14} /> {shelter.name}
             </h4>
             <p style={{margin:'4px 0 0', fontSize:'12px', color:'#8b949e'}}>
               Status: <span style={{
                 color: shelter.status === 'Open' ? '#22c55e' : shelter.status === 'Limited' ? '#eab308' : '#ef4444',
                 fontWeight: 600
               }}>{shelter.status}</span>
             </p>
             {shelter.capacity && (
               <p style={{margin:'2px 0 0', fontSize:'12px', color:'#8b949e', display:'flex', alignItems:'center', gap:'4px'}}>
                 <Users size={12} /> Capacity: {shelter.capacity}
               </p>
             )}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default SheltersMap;
