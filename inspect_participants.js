const fs = require('fs');

const bData = JSON.parse(fs.readFileSync('bracket_data.json', 'utf8'));
const mData = JSON.parse(fs.readFileSync('matches_details.json', 'utf8'));

// Extract all participants and their avatars
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

console.log('Unique participants found:', participants.size);
for (const [name, p] of participants.entries()) {
  console.log(`${name}: ${p.avatar}`);
}
