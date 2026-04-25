/**
 * Response Matrix Logic
 * Prioritizes SOS signals based on density and verification.
 */

export const calculatePriority = (signals) => {
  // Simple density check: if multiple signals within 500m
  return signals.map(signal => {
    const nearby = signals.filter(s => {
      if (s.id === signal.id) return false;
      const dist = getDistance(signal.coords, s.coords);
      return dist < 500; // 500 meters
    });

    if (nearby.length > 3) return { ...signal, priority: 'Critical', reason: 'High Density Cluster' };
    if (signal.verified) return { ...signal, priority: 'High', reason: 'Field Verified' };
    return signal;
  });
};

function getDistance(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371e3; // meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

export const getBroadcastOutcome = (userCoords, targetCoords, radiusKm) => {
  const dist = getDistance(userCoords, targetCoords) / 1000;
  if (dist <= 2) return 'Push + SMS (Immediate)';
  if (dist <= radiusKm) return 'Push Only (Informational)';
  return 'Silent (In-App Only)';
};
