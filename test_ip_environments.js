const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const SecurityEvent = require('./models/SecurityEvent');
const User = require('./models/User');

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

function formatIpDisplay(ip, family) {
  if (!ip || ip === 'unknown' || ip === 'Unavailable') {
    return 'Unavailable';
  }
  const clean = String(ip).trim();
  if (family === 'v4') {
    if (clean === '127.0.0.1' || clean.startsWith('127.0.0.1')) {
      return '127.0.0.1 (Localhost)';
    }
    return clean;
  }
  if (family === 'v6') {
    if (clean === '::1' || clean.startsWith('::1')) {
      return '::1 (Localhost)';
    }
    return clean;
  }
  return clean;
}

async function run() {
  console.log('=== VERIFYING LOCALHOST VS PRODUCTION VERCEL IP BEHAVIOR ===\n');
  let failures = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  ✅ PASS:', message);
    } else {
      console.error('  ❌ FAIL:', message);
      failures++;
    }
  }

  await mongoose.connect(process.env.MONGODB_URI);

  // 1. LOCALHOST IPv6 Connection (connecting to 'localhost')
  console.log('[TEST 1] Localhost connection (direct without proxy headers)...');
  const u1 = `local_ipv6_${Date.now()}`;
  const res1 = await request('http://localhost:3000/api/auth/register', {
    method: 'POST'
  }, {
    username: u1,
    password: 'Password123!'
  });
  assert(res1.status === 200, `Register response HTTP 200 (Got: ${res1.status})`);

  const ev1 = await SecurityEvent.findOne({ usernameAttempt: u1, eventType: 'register' });
  assert(!!ev1, `SecurityEvent recorded for ${u1}`);
  if (ev1) {
    console.log(`  Observed: ipAddress="${ev1.ipAddress}", ipv4=${ev1.ipv4}, ipv6=${ev1.ipv6}`);
    if (ev1.ipAddress === '::1') {
      assert(ev1.ipv6 === '::1', `IPv6 recorded as ::1`);
      assert(ev1.ipv4 === null, `IPv4 is null (not fabricated from IPv6 connection)`);
      assert(formatIpDisplay(ev1.ipv6, 'v6') === '::1 (Localhost)', `Admin UI renders IPv6 as ::1 (Localhost)`);
      assert(formatIpDisplay(ev1.ipv4, 'v4') === 'Unavailable', `Admin UI renders IPv4 as Unavailable`);
    } else if (ev1.ipAddress === '127.0.0.1') {
      assert(ev1.ipv4 === '127.0.0.1', `IPv4 recorded as 127.0.0.1`);
      assert(ev1.ipv6 === null, `IPv6 is null (not fabricated from IPv4 connection)`);
      assert(formatIpDisplay(ev1.ipv4, 'v4') === '127.0.0.1 (Localhost)', `Admin UI renders IPv4 as 127.0.0.1 (Localhost)`);
      assert(formatIpDisplay(ev1.ipv6, 'v6') === 'Unavailable', `Admin UI renders IPv6 as Unavailable`);
    }
  }

  // 2. LOCALHOST IPv4 Connection (connecting explicitly to '127.0.0.1')
  console.log('\n[TEST 2] Localhost IPv4 explicit connection to 127.0.0.1:3000...');
  const u2 = `local_ipv4_${Date.now()}`;
  const res2 = await request('http://127.0.0.1:3000/api/auth/register', {
    method: 'POST'
  }, {
    username: u2,
    password: 'Password123!'
  });
  assert(res2.status === 200, `Register response HTTP 200 (Got: ${res2.status})`);

  const ev2 = await SecurityEvent.findOne({ usernameAttempt: u2, eventType: 'register' });
  assert(!!ev2, `SecurityEvent recorded for ${u2}`);
  if (ev2) {
    console.log(`  Observed: ipAddress="${ev2.ipAddress}", ipv4=${ev2.ipv4}, ipv6=${ev2.ipv6}`);
    assert(ev2.ipv4 === '127.0.0.1', `IPv4 recorded as 127.0.0.1`);
    assert(ev2.ipv6 === null, `IPv6 is null (no IPv6 connection occurred)`);
    assert(formatIpDisplay(ev2.ipv4, 'v4') === '127.0.0.1 (Localhost)', `Admin UI renders IPv4 as 127.0.0.1 (Localhost)`);
    assert(formatIpDisplay(ev2.ipv6, 'v6') === 'Unavailable', `Admin UI renders IPv6 as Unavailable`);
  }

  // 3. PRODUCTION VERCEL IPv4 Connection (x-vercel-forwarded-for: 203.0.113.195)
  console.log('\n[TEST 3] Production Vercel IPv4 connection...');
  const u3 = `vercel_v4_${Date.now()}`;
  const res3 = await request('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'x-vercel-forwarded-for': '203.0.113.195',
      'x-real-ip': '203.0.113.195',
      'x-forwarded-for': '203.0.113.195'
    }
  }, {
    username: u3,
    password: 'Password123!'
  });
  assert(res3.status === 200, `Register response HTTP 200 (Got: ${res3.status})`);

  const ev3 = await SecurityEvent.findOne({ usernameAttempt: u3, eventType: 'register' });
  assert(!!ev3, `SecurityEvent recorded for ${u3}`);
  if (ev3) {
    console.log(`  Observed: ipAddress="${ev3.ipAddress}", ipv4=${ev3.ipv4}, ipv6=${ev3.ipv6}`);
    assert(ev3.ipAddress === '203.0.113.195', `Primary IP recorded as 203.0.113.195`);
    assert(ev3.ipv4 === '203.0.113.195', `IPv4 recorded as 203.0.113.195`);
    assert(ev3.ipv6 === null, `IPv6 is null (no IPv6 observed)`);
    assert(formatIpDisplay(ev3.ipv4, 'v4') === '203.0.113.195', `Admin UI renders IPv4 as 203.0.113.195`);
    assert(formatIpDisplay(ev3.ipv6, 'v6') === 'Unavailable', `Admin UI renders IPv6 as Unavailable`);
  }

  // 4. PRODUCTION VERCEL IPv6 Connection (x-vercel-forwarded-for: 2001:db8:85a3::8a2e:370:7334)
  console.log('\n[TEST 4] Production Vercel IPv6 connection...');
  const u4 = `vercel_v6_${Date.now()}`;
  const res4 = await request('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'x-vercel-forwarded-for': '2001:db8:85a3::8a2e:370:7334',
      'x-real-ip': '2001:db8:85a3::8a2e:370:7334',
      'x-forwarded-for': '2001:db8:85a3::8a2e:370:7334'
    }
  }, {
    username: u4,
    password: 'Password123!'
  });
  assert(res4.status === 200, `Register response HTTP 200 (Got: ${res4.status})`);

  const ev4 = await SecurityEvent.findOne({ usernameAttempt: u4, eventType: 'register' });
  assert(!!ev4, `SecurityEvent recorded for ${u4}`);
  if (ev4) {
    console.log(`  Observed: ipAddress="${ev4.ipAddress}", ipv4=${ev4.ipv4}, ipv6=${ev4.ipv6}`);
    assert(ev4.ipAddress === '2001:db8:85a3::8a2e:370:7334', `Primary IP recorded as 2001:db8:85a3::8a2e:370:7334`);
    assert(ev4.ipv6 === '2001:db8:85a3::8a2e:370:7334', `IPv6 recorded as 2001:db8:85a3::8a2e:370:7334`);
    assert(ev4.ipv4 === null, `IPv4 is null (not fabricated)`);
    assert(formatIpDisplay(ev4.ipv6, 'v6') === '2001:db8:85a3::8a2e:370:7334', `Admin UI renders IPv6 as 2001:db8:85a3::8a2e:370:7334`);
    assert(formatIpDisplay(ev4.ipv4, 'v4') === 'Unavailable', `Admin UI renders IPv4 as Unavailable`);
  }

  // 5. Admin Dashboard endpoint response check
  console.log('\n[TEST 5] Admin overview data check for rendered events...');
  // Promote u3 to admin to check admin endpoint
  await User.updateOne({ username: u3 }, { $set: { role: 'admin' } });
  const adminCookie = res3.headers['set-cookie'][0].split(';')[0];
  const adminRes = await request('http://localhost:3000/api/admin/security/overview', {
    headers: { Cookie: adminCookie }
  });
  assert(adminRes.status === 200, `Admin overview returns HTTP 200`);
  assert(Array.isArray(adminRes.json?.recentEvents), `recentEvents returned as array`);

  await mongoose.disconnect();
  console.log(`\n=== RESULT: ${failures === 0 ? 'ALL ENVIRONMENT IP TESTS PASSED ✅' : `${failures} TESTS FAILED ❌`} ===`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
