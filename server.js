require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');

// Import database helper
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// === TRUST PROXY CONFIGURATION ===
// Crucial for capturing real IPs and secure cookies behind Vercel edge reverse proxy
app.set('trust proxy', 1);

// === ENVIRONMENT VARIABLE AUDIT ===
const requiredEnvVars = ['MONGODB_URI', 'SESSION_SECRET'];
const missingRequiredVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingRequiredVars.length > 0) {
  console.error('\n' + '='.repeat(70));
  console.error('❌ CRITICAL CONFIGURATION ERROR: Missing required environment variable(s):');
  missingRequiredVars.forEach(v => console.error(`   - ${v}`));
  console.error('👉 Please configure these in your .env or Vercel Project Settings -> Environment Variables.');
  console.error('='.repeat(70) + '\n');
}

// === PRE-CONNECT DATABASE ON STARTUP (NON-BLOCKING) ===
if (process.env.MONGODB_URI) {
  connectDB().catch(err => {
    console.error('⚠️ Initial database connection attempt failed:', err.message);
    // Do NOT process.exit(1) so serverless lambdas can return informative diagnostics
  });
}

// === MIDDLEWARE ===
app.use(helmet({
  contentSecurityPolicy: false, // Preserves existing frontend scripts/styles/fonts
  referrerPolicy: { policy: 'no-referrer-when-downgrade' }
}));

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// === SESSION MANAGEMENT ===
let sessionStore;
if (process.env.MONGODB_URI) {
  sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    touchAfter: 24 * 3600 // Lazy session update (only once per 24 hours unless data changes)
  });
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_for_unconfigured_env',
  resave: false,
  saveUninitialized: false,
  store: sessionStore, // Falls back to default MemoryStore only if MONGODB_URI is not yet configured
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// === PASSPORT AUTHENTICATION ===
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// === API DATABASE CONNECTION CHECK & MISSING CONFIG GUARD ===
app.use(['/api', '/auth', '/tournament', '/profile'], async (req, res, next) => {
  if (missingRequiredVars.length > 0) {
    return res.status(503).json({
      error: 'Server Configuration Error',
      message: `The server is missing required configuration: ${missingRequiredVars.join(', ')}. Please configure these in Vercel Project Settings.`,
      missingVariables: missingRequiredVars
    });
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('API Database Error:', err.message);
    return res.status(503).json({
      error: 'Database Connection Error',
      message: process.env.NODE_ENV === 'production'
        ? 'Unable to connect to MongoDB Atlas. Ensure network access (0.0.0.0/0) is configured in Atlas.'
        : err.message
    });
  }
});

// === HEALTH CHECK & API STATUS ===
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    name: 'DAREDOWN Tournament API',
    environment: process.env.NODE_ENV || 'development',
    isVercel: !!process.env.VERCEL,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    isVercel: !!process.env.VERCEL
  });
});

// === SITE SETTINGS FALLBACK ROUTE ===
app.get(['/site-settings', '/api/site-settings'], (req, res) => {
  try {
    const siteSettings = require('./site_settings.json');
    res.json(siteSettings);
  } catch (_) {
    res.json({});
  }
});

// === JURY SCORE SUBMISSION ENDPOINT (FOR HOST PANEL) ===
app.post(['/scores/jury', '/api/scores/jury'], (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const userRole = (req.user?.role || '').toLowerCase();
  if (userRole !== 'admin' && userRole !== 'jury') {
    return res.status(403).json({ error: 'Jury or Administrator access required.' });
  }
  res.json({ message: 'Jury score saved successfully.', received: req.body });
});

// === ROUTES ===
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const tournamentRoutes = require('./routes/tournament');
const profileRoutes = require('./routes/profile');

// Auth routes (supports both /api/auth and /auth)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Tournament routes (supports both /api/tournament and /tournament)
app.use('/api/tournament', tournamentRoutes);
app.use('/tournament', tournamentRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Admin API routes (supports /api/admin and direct /admin/matches, /admin/users, /admin/bracket)
app.use('/api/admin', adminRoutes);
app.use('/admin', (req, res, next) => {
  if (
    req.path.startsWith('/matches') ||
    req.path.startsWith('/users') ||
    req.path.startsWith('/bracket') ||
    req.path.startsWith('/security') ||
    req.path.startsWith('/diagnostics')
  ) {
    return adminRoutes(req, res, next);
  }
  next();
});

// === CLEAN PAGE ROUTES ===
app.get(['/profile', '/profile/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'profile', 'index.html'));
});

app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get(['/rules', '/rules/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'rules', 'index.html'));
});

app.get(['/ngc', '/ngc/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'ngc', 'index.html'));
});

app.get(['/judge', '/judge/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'judge', 'index.html'));
});

app.get(['/register', '/register/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'register', 'index.html'));
});

app.get(['/login', '/login/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'register', 'index.html'));
});

// === API 404 HANDLER ===
app.use(['/api', '/auth', '/tournament', '/scores'], (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// === STATIC FILE SERVING (FOR LOCAL DEVELOPMENT AND PREVIEW) ===
// On Vercel, static assets are served directly by Vercel Edge CDN from public/ before hitting Node.
if (require('fs').existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(path.join(__dirname, 'public')));
}
if (require('fs').existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
}
app.use(express.static(path.join(__dirname, '.')));

// Catch-all route for local development SPA-like navigation
// CRITICAL: Never return index.html for static assets or API requests!
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/auth') ||
    req.path.startsWith('/tournament') ||
    req.path.startsWith('/scores') ||
    req.path.startsWith('/site-settings') ||
    /\.[a-zA-Z0-9]+$/.test(req.path)
  ) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === GLOBAL ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message
  });
});

// === START SERVER (FOR LOCAL DEVELOPMENT) ===
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 DAREDOWN Platform running on http://localhost:${PORT}`);
  });
}

module.exports = app;
