const fs = require('fs');

const usernameToAvatar = {
  'goof21': 'avatars/goof21.png',
  'khalidv2.': 'avatars/khalidv2_.png',
  'strezelia': 'avatars/strezelia.png',
  'pola': 'avatars/pola.png',
  'troubled_duck': 'avatars/troubled_duck.png',
  'vovanddroes': 'avatars/vovanddroes.png',
  'djzelemhan': 'avatars/djzelemhan.png',
  'lucas19471': 'avatars/lucas19471.png',
  'wikentens': 'avatars/wikentens.png',
  'shxrtfuze': 'avatars/shxrtfuze.png',
  'koshszn': 'avatars/koshszn.png',
  'hantezone': 'avatars/hantezone.png',
  'sku1l8': 'avatars/sku1l8.png',
  'bluexamasu': 'avatars/bluexamasu.png',
  'walsiii': 'avatars/walsiii.png',
  'bynexn': 'avatars/bynexn.png'
};

// 1. Update bracket_data.json
const bData = JSON.parse(fs.readFileSync('bracket_data.json', 'utf8'));
function updateParticipants(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.username && usernameToAvatar[obj.username]) {
    obj.avatar = usernameToAvatar[obj.username];
    obj.avatarUrl = usernameToAvatar[obj.username];
  }
  for (const k of Object.keys(obj)) {
    updateParticipants(obj[k]);
  }
}
updateParticipants(bData);
fs.writeFileSync('bracket_data.json', JSON.stringify(bData, null, 2), 'utf8');
console.log('Updated bracket_data.json');

// 2. Update matches_details.json
const mData = JSON.parse(fs.readFileSync('matches_details.json', 'utf8'));
updateParticipants(mData);
fs.writeFileSync('matches_details.json', JSON.stringify(mData, null, 2), 'utf8');
console.log('Updated matches_details.json');

// 3. Update _astro/bracket-data.js
let bJs = fs.readFileSync('_astro/bracket-data.js', 'utf8');
bJs = `window.__BRACKET_DATA = ${JSON.stringify(bData)};\nwindow.__MATCHES_DETAILS = ${JSON.stringify(mData)};\n`;
fs.writeFileSync('_astro/bracket-data.js', bJs, 'utf8');
console.log('Updated _astro/bracket-data.js');
