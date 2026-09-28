const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const SecurityEvent = require('./models/SecurityEvent');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (body) {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
        reqOptions.headers['Content-Type'] = 'application/json';
      }
      reqOptions.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING FULL END-TO-END VERIFICATION ===\n');
  let failures = 0;

  const app = require('./server');
  let testServer;
  try {
    testServer = await new Promise((resolve, reject) => {
      const s = app.listen(3000, () => resolve(s));
      s.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          // Server already running on 3000
          resolve(null);
        } else {
          reject(err);
        }
      });
    });
  } catch (err) {
    console.log('Using existing server on 3000');
  }

  function assert(condition, message) {
    if (condition) {
      console.log('  ✅ PASS:', message);
    } else {
      console.error('  ❌ FAIL:', message);
      failures++;
    }
  }

  // Connect to DB for direct inspection
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. TEST BUG 5: Bracket Hover Images
  console.log('[TEST BUG 5] Bracket Avatar Local Assets...');
  const participantUsernames = [
    'goof21', 'khalidv2_', 'strezelia', 'pola', 'troubled_duck', 'vovanddroes',
    'djzelemhan', 'lucas19471', 'wikentens', 'shxrtfuze', 'koshszn', 'hantezone',
    'sku1l8', 'bluexamasu', 'walsiii', 'bynexn'
  ];

  let avatarPassCount = 0;
  for (const name of participantUsernames) {
    const res = await request(`http://localhost:3000/avatars/${name}.png`);
    if (res.status === 200 && res.headers['content-type']?.includes('image')) {
      avatarPassCount++;
    } else {
      console.error(`  Avatar /avatars/${name}.png failed: HTTP ${res.status}`);
    }
  }
  assert(avatarPassCount === 16, `All 16 bracket participant avatars loaded locally (HTTP 200 image/png) [${avatarPassCount}/16]`);

  // 2. TEST BUG 2 & 3: IP Classification & Device / Browser Extraction on Register
  console.log('\n[TEST BUG 2 & 3] Registration with realistic User-Agent and Vercel/Proxy Headers...');
  const testUsername = `tester_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'Password123!';
  const testUa = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

  const regRes = await request('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'User-Agent': testUa,
      'x-vercel-forwarded-for': '198.51.100.42, 2001:db8:85a3::8a2e:370:7334',
      'x-forwarded-for': '198.51.100.42, 2001:db8:85a3::8a2e:370:7334'
    }
  }, {
    username: testUsername,
    email: testEmail,
    password: testPassword,
    themePreference: 'boy'
  });

  assert(regRes.status === 200, `Registration returned HTTP 200 (Got: ${regRes.status})`);
  assert(regRes.json?.user?.username === testUsername, `User object returned with username: ${regRes.json?.user?.username}`);
  assert(regRes.json?.user?.themePreference === 'boy', `User initial themePreference is 'boy'`);

  // Extract session cookie
  const setCookie = regRes.headers['set-cookie'];
  const sessionCookie = Array.isArray(setCookie) ? setCookie[0].split(';')[0] : (setCookie ? setCookie.split(';')[0] : '');
  assert(sessionCookie.includes('connect.sid'), `Session cookie issued after registration (${sessionCookie.slice(0, 25)}...)`);

  // Check MongoDB SecurityEvent for BUG 2 & BUG 3
  const secEvent = await SecurityEvent.findOne({ usernameAttempt: testUsername, eventType: 'register' }).sort({ createdAt: -1 });
  assert(!!secEvent, `SecurityEvent found in MongoDB for user: ${testUsername}`);
  if (secEvent) {
    assert(secEvent.ipv4 === '198.51.100.42', `IPv4 properly extracted: ${secEvent.ipv4}`);
    assert(secEvent.ipv6 === '2001:db8:85a3::8a2e:370:7334', `IPv6 properly extracted: ${secEvent.ipv6}`);
    assert(secEvent.browser === 'Chrome', `Browser parsed correctly: ${secEvent.browser}`);
    assert(secEvent.browserVersion?.startsWith('122'), `Browser version parsed correctly: ${secEvent.browserVersion}`);
    assert(secEvent.os === 'Windows', `OS parsed correctly: ${secEvent.os}`);
    assert(secEvent.deviceType === 'desktop', `Device type classified as desktop: ${secEvent.deviceType}`);
    assert(secEvent.browser !== 'undefined' && secEvent.os !== 'undefined', `No literal "undefined" in security event fields`);
  }

  // 3. TEST BUG 2: Local Loopback Formatting
  console.log('\n[TEST BUG 2] Local Loopback IP extraction...');
  const loopbackUsername = `loopback_${Date.now()}`;
  await request('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
    }
  }, {
    username: loopbackUsername,
    password: 'Password123!'
  });

  const loopbackEvent = await SecurityEvent.findOne({ usernameAttempt: loopbackUsername, eventType: 'register' });
  assert(!!loopbackEvent, `SecurityEvent found for loopback registration`);
  if (loopbackEvent) {
    assert(loopbackEvent.ipAddress === '::1' || loopbackEvent.ipAddress === '127.0.0.1', `Loopback IP legitimately recorded: ${loopbackEvent.ipAddress}`);
    if (loopbackEvent.ipAddress === '::1') {
      assert(loopbackEvent.ipv6 === '::1' && loopbackEvent.ipv4 === null, `Loopback IPv6 is ::1 and IPv4 is null (not fabricated)`);
    } else {
      assert(loopbackEvent.ipv4 === '127.0.0.1' && loopbackEvent.ipv6 === null, `Loopback IPv4 is 127.0.0.1 and IPv6 is null (not fabricated)`);
    }
    assert(loopbackEvent.deviceType === 'mobile', `Mobile device classified correctly from UA: ${loopbackEvent.deviceType}`);
    assert(loopbackEvent.os === 'iOS', `iOS OS parsed correctly: ${loopbackEvent.os}`);
  }

  // 4. TEST BUG 1: Session Persistence & GET /api/auth/me
  console.log('\n[TEST BUG 1] Session Persistence via GET /api/auth/me...');
  const meRes = await request('http://localhost:3000/api/auth/me', {
    method: 'GET',
    headers: {
      Cookie: sessionCookie
    }
  });
  assert(meRes.status === 200, `GET /api/auth/me returned HTTP 200 with session cookie`);
  assert(meRes.json?.user?.username === testUsername, `Current user correctly returned: ${meRes.json?.user?.username}`);

  // 5. TEST BUG 4: Theme Switching & Persistence via PATCH /api/auth/theme
  console.log('\n[TEST BUG 4] Theme Switching & Persistence...');
  const themeRes = await request('http://localhost:3000/api/auth/theme', {
    method: 'PATCH',
    headers: {
      Cookie: sessionCookie
    }
  }, { theme: 'girl' });

  assert(themeRes.status === 200, `PATCH /api/auth/theme returned HTTP 200`);
  assert(themeRes.json?.theme === 'girl', `Theme response confirms updated to 'girl'`);

  // Verify in MongoDB directly
  const updatedUser = await User.findOne({ username: testUsername });
  assert(updatedUser?.themePreference === 'girl', `User model in MongoDB updated to themePreference: 'girl'`);

  // Verify on subsequent GET /api/auth/me
  const meAfterTheme = await request('http://localhost:3000/api/auth/me', {
    method: 'GET',
    headers: {
      Cookie: sessionCookie
    }
  });
  assert(meAfterTheme.json?.user?.themePreference === 'girl', `GET /api/auth/me returns updated themePreference: 'girl'`);

  // 6. TEST Admin Security Overview Data Contract
  console.log('\n[TEST ADMIN] Admin Security Overview endpoint check...');
  // Promote test user to admin for testing admin endpoints
  await User.updateOne({ username: testUsername }, { $set: { role: 'admin' } });

  const adminRes = await request('http://localhost:3000/api/admin/security/overview', {
    method: 'GET',
    headers: {
      Cookie: sessionCookie
    }
  });

  assert(adminRes.status === 200, `GET /api/admin/security/overview returned HTTP 200 for admin user`);
  const recentEvents = adminRes.json?.recentEvents || [];
  assert(recentEvents.length > 0, `Recent events returned: ${recentEvents.length}`);
  
  let hasUndefinedString = false;
  for (const ev of recentEvents.slice(0, 10)) {
    const raw = JSON.stringify(ev);
    if (raw.includes('"undefined"') || raw.includes('undefined undefined')) {
      hasUndefinedString = true;
      console.error('Found undefined in event:', raw);
    }
  }
  assert(!hasUndefinedString, `No literal "undefined" strings found in recent events payload`);

  // Disconnect DB
  await mongoose.disconnect();

  console.log(`\n=== VERIFICATION COMPLETE: ${failures === 0 ? 'ALL CHECKS PASSED ✅' : `${failures} CHECKS FAILED ❌`} ===`);
  process.exit(failures === 0 ? 0 : 1);
}

runTests().catch(err => {
  console.error('Unexpected error running tests:', err);
  process.exit(1);
});
