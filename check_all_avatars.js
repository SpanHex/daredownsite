const fs = require('fs');
const https = require('https');

const bData = JSON.parse(fs.readFileSync('bracket_data.json', 'utf8'));
const mData = JSON.parse(fs.readFileSync('matches_details.json', 'utf8'));

const participants = new Map();
function walk(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.username && (obj.avatar || obj.avatarUrl)) {
    participants.set(obj.username, {
      username: obj.username,
      nickname: obj.nickname,
      avatar: obj.avatar || obj.avatarUrl,
      id: obj.id
    });
  }
  for (const k of Object.keys(obj)) {
    walk(obj[k]);
  }
}
walk(bData);
walk(mData);

async function checkUrl(username, url) {
  return new Promise(resolve => {
    try {
      const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        resolve({ username, url, status: res.statusCode });
      });
      req.on('error', err => resolve({ username, url, error: err.message }));
      req.setTimeout(5000, () => { req.abort(); resolve({ username, url, error: 'timeout' }); });
      req.end();
    } catch (e) {
      resolve({ username, url, error: e.message });
    }
  });
}

(async () => {
  const list = [...participants.values()];
  const results = await Promise.all(list.map(p => checkUrl(p.username, p.avatar)));
  console.log('--- Results ---');
  for (const r of results) {
    console.log(`${r.status === 200 ? 'OK ' : 'ERR(' + (r.status || r.error) + ') '} ${r.username}: ${r.url}`);
  }
})();
