/**
 * Network Connectivity Test
 * Run this to diagnose mobile device connectivity issues
 */

require('dotenv').config();
const http = require('http');

const PORT = 3000;
const ENDPOINTS = [
  { name: 'Health Check', path: '/health' },
  { name: 'Report Incident', path: '/api/report-incident', method: 'POST' }
];

console.log('\n🧪 ========== BACKEND CONNECTIVITY TEST ==========\n');
console.log(`Backend running on: http://192.168.100.11:${PORT}\n`);
console.log('Testing endpoints:\n');

ENDPOINTS.forEach(ep => {
  const url = `http://192.168.100.11:${PORT}${ep.path}`;
  console.log(`📡 ${ep.name}`);
  console.log(`   URL: ${url}`);
  console.log(`   Method: ${ep.method || 'GET'}`);
  
  const req = http.request(url, {
    method: ep.method || 'GET',
    headers: { 'Content-Type': 'application/json' }
  }, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   ✅ Endpoint accessible\n`);
  });

  req.on('error', (err) => {
    console.log(`   ❌ Error: ${err.message}\n`);
  });

  if (ep.method === 'POST') {
    req.write(JSON.stringify({
      lat: 14.5515,
      lng: 121.0275,
      user_phone_number: '+1234567890',
      location_address: 'Test',
      video_url: 'test://video'
    }));
  }

  req.end();
});

console.log('\n🔍 To fix mobile connectivity:\n');
console.log('1. Android Emulator: Use API_BASE_URL="http://10.0.2.2:3000/api"');
console.log('2. Real Android Device: Ensure on same WiFi as computer');
console.log('3. Add Windows Firewall rule:');
console.log('   netsh advfirewall firewall add rule name="Node Backend" dir=in action=allow protocol=tcp localport=3000\n');
