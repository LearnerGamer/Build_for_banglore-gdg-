const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'sos_data.json');

// Memory cache (Map for O(1) query optimization)
let sosSignals = new Map();

// Load data from file on startup
try {
  if (fs.existsSync(DB_FILE)) {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    data.forEach(s => sosSignals.set(s.deviceId || s.id, s));
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

  // GET: Optimized O(1) conversion for transport
  if (req.url === '/api/sos' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Array.from(sosSignals.values())));
  } 
  
  // DELETE: O(1) removal
  else if (req.url.startsWith('/api/sos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    
    // Check both id and deviceId for removal
    let found = false;
    for (let [key, val] of sosSignals) {
      if (val.id === id || val.deviceId === id) {
        sosSignals.delete(key);
        found = true;
        break;
      }
    }

    saveToDisk();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: found }));
  } 
  
  // POST: Single message per device optimization
  else if (req.url === '/api/sos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const signal = JSON.parse(body);
        
        // UNIQUE CONSTRAINT: Single message per device
        // We use deviceId as the primary key for the Map
        const deviceId = signal.deviceId || 'unknown_device';
        
        const existing = sosSignals.get(deviceId);
        
        const finalSignal = {
          ...signal,
          id: existing ? existing.id : `sos-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: existing ? existing.status : (signal.status || 'New'),
          deviceId: deviceId
        };

        sosSignals.set(deviceId, finalSignal);
        saveToDisk();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, signal: finalSignal, isUpdate: !!existing }));
        console.log(existing ? 'SOS Updated for device:' : 'New SOS from device:', deviceId);
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

