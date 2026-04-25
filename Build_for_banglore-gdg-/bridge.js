const http = require('http');

let sosSignals = [];

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/sos' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sosSignals));
  } else if (req.url.startsWith('/api/sos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    sosSignals = sosSignals.filter(s => s.id !== id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, id }));
    console.log('SOS Signal deleted:', id);
  } else if (req.url === '/api/sos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const signal = JSON.parse(body);
        signal.id = signal.id || `sos-${Date.now()}`;
        signal.timestamp = signal.timestamp || new Date().toISOString();
        signal.status = signal.status || 'New';
        
        sosSignals = [signal, ...sosSignals].slice(0, 50);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, signal }));
        console.log('New SOS Signal received:', signal);
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
  console.log(`SOS Bridge Server running at http://localhost:${PORT}`);
});
