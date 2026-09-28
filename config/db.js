const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Global cache across Vercel serverless function invocations.
 * In a serverless environment, Node.js global variables persist
 * across warm invocations within the same container.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, adminSeeded: false };
}

/**
 * Seeds the initial administrator account if configured.
 * Runs once upon database connection.
 */
async function seedAdmin() {
  if (cached.adminSeeded) return;
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists && process.env.ADMIN_USERNAME && process.env.ADMIN_INITIAL_PASSWORD) {
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD, 10);

      await User.create({
        username: process.env.ADMIN_USERNAME,
        passwordHash,
        authProvider: 'local',
        role: 'admin'
      });
      console.log('✅ Initial Admin account seeded successfully.');
    }
    cached.adminSeeded = true;
  } catch (error) {
    console.error('⚠️ Warning: Error checking/seeding admin account:', error.message);
  }
}

/**
 * Connects to MongoDB Atlas with connection caching for serverless environments.
 */
async function connectDB() {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    const error = new Error('MONGODB_URI environment variable is missing.');
    error.code = 'CONFIG_MISSING_MONGODB_URI';
    throw error;
  }

  // Strip surrounding quotes and whitespace if copy-pasted into Vercel dashboard with quotes
  uri = uri.trim();
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1).trim();
  }

  const readyState = mongoose.connection.readyState;

  // 1 = connected: reuse active connection immediately
  if (cached.conn && readyState === 1) {
    return cached.conn;
  }

  // 2 = connecting: if a connection attempt is in flight, await it
  if (readyState === 2 && cached.promise) {
    return await cached.promise;
  }

  // If connection dropped (0 = disconnected, 3 = disconnecting) or not yet started, create new promise
  if (readyState === 0 || readyState === 3 || !cached.promise) {
    cached.conn = null;

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4 // Enforce IPv4 to bypass delays/timeouts on serverless environments without IPv6 routing for Atlas
    };

    console.log('🔄 Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(uri, opts).then(async (mongooseInstance) => {
      console.log('✅ MongoDB Atlas connected successfully');
      cached.conn = mongooseInstance;
      await seedAdmin();
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      console.error('❌ MongoDB Atlas connection error:', err.name, err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}

// Clear cache if disconnected event fires
mongoose.connection.on('disconnected', () => {
  if (cached) {
    cached.conn = null;
    cached.promise = null;
  }
});

module.exports = connectDB;

