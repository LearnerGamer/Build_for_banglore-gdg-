// Simulated Field Forces data and APIs
export const generateMockForce = () => {
  const latRef = 12.9716;
  const lngRef = 77.5946;

  const lat = latRef + (Math.random() - 0.5) * 0.15;
  const lng = lngRef + (Math.random() - 0.5) * 0.15;
  
  const statuses = ['Active', 'Busy', 'Offline'];
  
  return {
    id: `unit-${Math.floor(Math.random() * 1000)}`,
    latitude: lat,
    longitude: lng,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    last_updated: new Date().toISOString()
  };
};

export const fetchFieldForces = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Array.from({ length: 4 }, generateMockForce));
    }, 500);
  });
};

export const updateFieldForceStatus = async (id, status) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, id, status });
    }, 300);
  });
};
