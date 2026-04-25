export const generateMockSOS = () => {
  const priorities = ['Critical', 'High', 'Medium', 'Low'];
  // Center roughly around Bangalore for demo (Lat: 12.9716, Lng: 77.5946)
  const latRef = 12.9716;
  const lngRef = 77.5946;

  const lat = latRef + (Math.random() - 0.5) * 0.1;
  const lng = lngRef + (Math.random() - 0.5) * 0.1;
  
  // Weight Critical slightly lower occurrence
  const randPrio = Math.random();
  let priority = priorities[3]; // Low
  if (randPrio > 0.9) priority = priorities[0]; // Critical (10%)
  else if (randPrio > 0.7) priority = priorities[1]; // High (20%)
  else if (randPrio > 0.4) priority = priorities[2]; // Medium (30%)

  const areas = ['Whitefield', 'Koramangala', 'Indiranagar', 'Jayanagar', 'HSR Layout', 'Malleshwaram', 'MG Road', 'Electronic City'];
  
  return {
    id: `sos-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    latitude: lat,
    longitude: lng,
    areaName: areas[Math.floor(Math.random() * areas.length)],
    timestamp: new Date().toISOString(),
    priority: priority,
    status: 'New',
    type: 'Medical Emergency', // could be simulated later
  };
};

export const initialSignals = Array.from({ length: 5 }, generateMockSOS);
