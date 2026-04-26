const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'sos_data.json');
const CLUSTER_RADIUS = 0.005; // Approx 500 meters in lat/lng

// Memory cache (Map for O(1) query optimization)
let sosSignals = new Map();

// Helper: Calculate distance between two points
const getDist = (s1, s2) => {
  return Math.sqrt(Math.pow(s1.latitude - s2.latitude, 2) + Math.pow(s1.longitude - s2.longitude, 2));
};

// THREAT ENGINE: Cluster-based priority escalation
const calculateThreatLevels = () => {
  const signals = Array.from(sosSignals.values());
  
  signals.forEach(target => {
    // Find all signals in the same cluster (within radius)
    const cluster = signals.filter(other => getDist(target, other) < CLUSTER_RADIUS);
    const clusterSize = cluster.length;

    // Set Priority based on Cluster Size
    if (clusterSize >= 3) {
      target.priority = 'Critical';
    } else if (clusterSize >= 2) {
      target.priority = 'High';
    } else {
      target.priority = 'Low'; // Single signal is low impact
    }
    
    // Update the Map with the new priority
    sosSignals.set(target.deviceId, target);
  });
};

// Load data from file on startup
try {
  if (fs.existsSync(DB_FILE)) {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    data.forEach(s => sosSignals.set(s.deviceId || s.id, s));
    calculateThreatLevels(); // Initial threat calculation
    console.log('Loaded signals from database file.');
  }
} catch (e) {
  console.error('Error loading database file:', e);
}

const saveToDisk = () => {
  try {
    const data = Array.from(sosSignals.values());
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save to disk:', e);
  }
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET: Return optimized threat-leveled signals
  if (req.url === '/api/sos' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Array.from(sosSignals.values())));
  } 
  
  // DELETE: Remove and recalculate threats
  else if (req.url.startsWith('/api/sos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    let found = false;
    for (let [key, val] of sosSignals) {
      if (val.id === id || val.deviceId === id) {
        sosSignals.delete(key);
        found = true;
        break;
      }
    }

    if (found) {
      calculateThreatLevels();
      saveToDisk();
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: found }));
  } 
  
  // POST: Upsert and calculate threats
  else if (req.url === '/api/sos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const signal = JSON.parse(body);
        const deviceId = signal.deviceId || 'unknown_device';
        const existing = sosSignals.get(deviceId);
        
        const finalSignal = {
          ...signal,
          id: existing ? existing.id : `sos-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: existing ? existing.status : (signal.status || 'New'),
          deviceId: deviceId,
          priority: 'Low' // Default to low, threat engine will escalate
        };

        sosSignals.set(deviceId, finalSignal);
        calculateThreatLevels(); // ESCALATION LOGIC
        saveToDisk();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, signal: sosSignals.get(deviceId) }));
        console.log(`Threat calculated for ${deviceId}. Cluster size check complete.`);
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`SAVIOUR Bridge Server (Optimized) running at http://localhost:${PORT}`);
});


