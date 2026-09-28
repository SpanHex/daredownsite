const fs = require('fs');
const path = require('path');
const https = require('https');

const avatarDir = path.join(__dirname, 'avatars');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const sources = [
  { username: 'goof21', url: 'https://cdn.discordapp.com/avatars/1258796182348763146/b6bc170b76b97e3576f887dbc3cf556c.png' },
  { username: 'khalidv2.', url: 'https://cdn.discordapp.com/avatars/254533231594962944/5cce3c18d02445cc4b9faadba5d70f51.png' },
  { username: 'strezelia', url: 'https://cdn.discordapp.com/avatars/319574305274986498/bf19d0bd23a09463fc70c165c01ac4d7.png' },
  { username: 'pola', url: 'https://cdn.discordapp.com/avatars/140412016522166272/f114e2de830842c469657e0da4be9dff.png' },
  { username: 'troubled_duck', url: 'https://i.ytimg.com/vi/H9EE0aoxtPs/hqdefault.jpg' },
  { username: 'vovanddroes', url: 'https://i.ytimg.com/vi/hGWEfEhR9fU/hqdefault.jpg' },
  { username: 'djzelemhan', url: 'https://i.ytimg.com/vi/hhYhsB23gI4/hqdefault.jpg' },
  { username: 'lucas19471', url: 'https://i.ytimg.com/vi/sqpXcknf-0A/hqdefault.jpg' },
  { username: 'wikentens', url: 'https://cdn.discordapp.com/avatars/634426181793349652/4210b37fb20e889cd4ba45b45cd145a8.png' },
  { username: 'shxrtfuze', url: 'https://cdn.discordapp.com/avatars/506560844784467991/a5d1548a271784067f7636ad675cf884.png' },
  { username: 'koshszn', url: 'https://i.ytimg.com/vi/Oo8IgqU-6eo/hqdefault.jpg' },
  { username: 'hantezone', url: 'https://i.ytimg.com/vi/PE48gp2XJrg/hqdefault.jpg' },
  { username: 'sku1l8', url: 'https://i.ytimg.com/vi/GwpEolFbfT4/hqdefault.jpg' },
  { username: 'bluexamasu', url: 'https://cdn.discordapp.com/avatars/1224486850903802038/ede0a08c8b7fcc4d6cd3363a6079ac27.png' },
  { username: 'walsiii', url: 'https://cdn.discordapp.com/avatars/444067403002019841/443cae64e9e153cff3ad76a08e16e8b7.png' },
  { username: 'bynexn', url: 'https://cdn.discordapp.com/avatars/744546636608569384/01eab0ff7a607090f921735e02c4d63d.png' }
];

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function download(item) {
  return new Promise((resolve, reject) => {
    const filename = `${sanitizeFilename(item.username)}.png`;
    const dest = path.join(avatarDir, filename);

    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode !== 200) {
        console.error(`Failed ${item.username}: ${res.statusCode}`);
        return resolve({ username: item.username, success: false, status: res.statusCode });
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Saved: avatars/${filename} (${fs.statSync(dest).size} bytes)`);
        resolve({ username: item.username, success: true, filename: `avatars/${filename}` });
      });
    }).on('error', err => {
      console.error(`Error ${item.username}:`, err.message);
      resolve({ username: item.username, success: false, error: err.message });
    });
  });
}

(async () => {
  console.log('Downloading 16 avatars to local avatars/ directory...');
  const results = await Promise.all(sources.map(download));
  const successCount = results.filter(r => r.success).length;
  console.log(`Successfully downloaded ${successCount}/${sources.length} avatars!`);
})();
