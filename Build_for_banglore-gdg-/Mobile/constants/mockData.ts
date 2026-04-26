export const SHELTERS = [
  { id: 's1', name: 'Kanteerava Stadium Shelter', coords: { latitude: 12.9698, longitude: 77.5929 }, status: 70, capacity: '1500/2100', resources: ['water', 'medical', 'charging'] },
  { id: 's2', name: 'Whitefield Community Center', coords: { latitude: 12.9698, longitude: 77.7500 }, status: 95, capacity: '475/500', resources: ['water', 'charging'] },
  { id: 's3', name: 'Indiranagar Metro Shelter', coords: { latitude: 12.9784, longitude: 77.6408 }, status: 30, capacity: '300/1000', resources: ['water', 'medical'] },
  { id: 's4', name: 'Koramangala Indoor Stadium', coords: { latitude: 12.9362, longitude: 77.6171 }, status: 45, capacity: '450/1000', resources: ['water', 'charging'] },
  { id: 's5', name: 'Malleshwaram Govt School', coords: { latitude: 12.9972, longitude: 77.5711 }, status: 15, capacity: '75/500', resources: ['water'] },
  { id: 's6', name: 'Electronic City Phase 1 Hall', coords: { latitude: 12.8452, longitude: 77.6633 }, status: 80, capacity: '800/1000', resources: ['water', 'medical', 'charging'] }
];

export const HOSPITALS = [
  { id: 'h1', name: 'Manipal Hospital (HAL)', coords: { latitude: 12.9592, longitude: 77.6444 }, beds: 12, emergency: true },
  { id: 'h2', name: 'Narayana Health (City)', coords: { latitude: 12.8256, longitude: 77.6806 }, beds: 45, emergency: true },
  { id: 'h3', name: 'St. John\'s Medical College', coords: { latitude: 12.9342, longitude: 77.6111 }, beds: 30, emergency: true },
  { id: 'h4', name: 'Columbia Asia (Hebbal)', coords: { latitude: 13.0354, longitude: 77.5971 }, beds: 18, emergency: true },
  { id: 'h5', name: 'Fortis Hospital (Bannerghatta)', coords: { latitude: 12.8942, longitude: 77.5977 }, beds: 25, emergency: true }
];

export const DANGERS = [
  {
    id: 'd1',
    type: 'Flood',
    severity: 'High',
    coords: { latitude: 12.9698, longitude: 77.7500 },
    radius: 1500,
    description: 'Varthur Lake overflow - Evacuate immediately.'
  }
];

export const USER_LOC = { latitude: 12.9716, longitude: 77.5946 }; // MG Road Center
