export const generateMockSOS = () => {
  const priorities = ['Critical', 'High', 'Medium', 'Low'];
  // Center around Bangalore (Lat: 12.9716, Lng: 77.5946)
  const latRef = 12.9716;
  const lngRef = 77.5946;

  // Scatters data across major hubs
  const lat = latRef + (Math.random() - 0.5) * 0.15;
  const lng = lngRef + (Math.random() - 0.5) * 0.15;
  
  const randPrio = Math.random();
  let priority = priorities[3]; 
  if (randPrio > 0.9) priority = priorities[0];
  else if (randPrio > 0.7) priority = priorities[1];
  else if (randPrio > 0.4) priority = priorities[2];

  const areas = ['Whitefield', 'Koramangala', 'Indiranagar', 'Jayanagar', 'HSR Layout', 'Malleshwaram', 'Majestic', 'Hebbal', 'Electronic City'];
  
  return {
    id: `sos-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    latitude: lat,
    longitude: lng,
    areaName: areas[Math.floor(Math.random() * areas.length)],
    timestamp: new Date().toISOString(),
    priority: priority,
    status: 'New',
    type: Math.random() > 0.5 ? 'Flood Emergency' : 'Medical Assistance',
  };
};

export const initialSignals = Array.from({ length: 5 }, generateMockSOS);
