const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const SecurityEvent = require('./models/SecurityEvent');

  // Get the very latest event (should be our test registration)
  const latest = await SecurityEvent.findOne({}).sort({ timestamp: -1 }).lean();
  console.log('\n=== Latest Security Event ===');
  console.log(JSON.stringify(latest, null, 2));

  // Check if new ipv4/ipv6 fields are present
  console.log('\n=== IP Classification ===');
  console.log('ipAddress:', latest.ipAddress);
  console.log('ipv4:', latest.ipv4);
  console.log('ipv6:', latest.ipv6);
  console.log('browser:', latest.browser);
  console.log('browserVersion:', latest.browserVersion);
  console.log('os:', latest.os);
  console.log('osVersion:', latest.osVersion);
  console.log('deviceType:', latest.deviceType);

  await mongoose.disconnect();
}

main().catch(console.error);
