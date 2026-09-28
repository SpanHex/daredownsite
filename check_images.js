const fs = require('fs');
const https = require('https');
const http = require('http');

const html = fs.readFileSync('rendered_bracket.html', 'utf8');
const urls = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
const unique = [...new Set(urls)];
console.log('Total unique bracket images in rendered_bracket.html:', unique.length);

async function checkUrl(url) {
  return new Promise(resolve => {
    try {
      if (!url.startsWith('http')) {
        // Local file check
        const exists = fs.existsSync(url);
        return resolve({ url, status: exists ? 200 : 404 });
      }
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        resolve({ url, status: res.statusCode });
      });
      req.on('error', err => resolve({ url, error: err.message }));
      req.setTimeout(5000, () => { req.abort(); resolve({ url, error: 'timeout' }); });
      req.end();
    } catch(e) {
      resolve({ url, error: e.message });
    }
  });
}

(async () => {
  const results = await Promise.all(unique.map(checkUrl));
  for (const r of results) {
    console.log(r.status || r.error, r.url);
  }
})();
