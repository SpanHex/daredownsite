const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const logSecurityEvent = require('../middleware/securityLogger');
const { isAuthenticated } = require('../middleware/auth');

// === RATE LIMITERS ===
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: { error: 'Too many requests, please try again after 15 minutes.' }
});

const strictLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: { error: 'Too many login attempts. Please wait 15 minutes.' }
});

// === LOCAL REGISTRATION ===
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password, themePreference } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    if (username.length > 30) {
      return res.status(400).json({ error: 'Username must be 30 characters or fewer.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logSecurityEvent(req, 'register', false, 'Username already exists', null, username, 'local');
      return res.status(400).json({ error: 'Username already taken.' });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        logSecurityEvent(req, 'register', false, 'Email already exists', null, username, 'local');
        return res.status(400).json({ error: 'Email already registered.' });
      }
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const initialTheme = (themePreference === 'girl' || themePreference === 'boy') ? themePreference : null;

    const newUser = await User.create({
      username,
      displayName: username,
      email: email || null,
      passwordHash,
      authProvider: 'local',
      themePreference: initialTheme
    });

    try {
      const { assignUserToAvailableSlot } = require('../utils/bracketHelper');
      await assignUserToAvailableSlot(newUser);
    } catch (bracketErr) {
      console.error('Error assigning registered user to tournament slot:', bracketErr.message);
    }

    logSecurityEvent(req, 'register', true, null, newUser._id, username, 'local');

    // Automatically log in the user after registration
    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ error: 'Error logging in after registration' });
      return res.json({
        message: 'Registration successful',
        user: {
          id: newUser._id,
          username: newUser.username,
          displayName: newUser.displayName || newUser.username,
          role: (newUser.role || 'user').toUpperCase(),
          avatar: newUser.avatar,
          avatarUrl: newUser.avatar,
          bracketSlot: newUser.bracketSlot || null,
          themePreference: newUser.themePreference || null
        }
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// === LOCAL LOGIN ===
router.post('/login', strictLoginLimiter, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) {
      // Failed logins are already logged inside the passport strategy
      return res.status(401).json({ error: info?.message || 'Login failed' });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: 'Server error' });
      return res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName || user.username,
          role: (user.role || 'user').toUpperCase(),
          avatar: user.avatar,
          avatarUrl: user.avatar,
          bracketSlot: user.bracketSlot || null,
          themePreference: user.themePreference || null
        }
      });
    });
  })(req, res, next);
});

// === LOGOUT ===
router.post('/logout', (req, res) => {
  if (req.user) {
    logSecurityEvent(req, 'logout', true, null, req.user._id, req.user.username, req.user.authProvider);
  }
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Error logging out' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// === GET CURRENT USER ===
router.get('/me', isAuthenticated, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName || req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      avatarUrl: req.user.avatar,
      role: (req.user.role || 'user').toUpperCase(),
      accountStatus: req.user.accountStatus,
      themePreference: req.user.themePreference || null,
      bracketSlot: req.user.bracketSlot || null,
      tournamentStatus: req.user.tournamentStatus,
      lastLoginAt: req.user.lastLoginAt,
      authProvider: req.user.authProvider,
      createdAt: req.user.createdAt
    }
  });
});

// === UPDATE THEME PREFERENCE ===
router.patch('/theme', isAuthenticated, async (req, res) => {
  try {
    const { theme } = req.body;
    if (theme !== 'boy' && theme !== 'girl') {
      return res.status(400).json({ error: 'Theme must be "boy" or "girl"' });
    }
    req.user.themePreference = theme;
    await req.user.save();
    res.json({ message: 'Theme updated successfully', theme: req.user.themePreference });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update theme preference' });
  }
});

// === GOOGLE OAUTH ===
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/register/index.html?error=oauth_failed' }),
  (req, res) => {
    res.redirect('/');
  }
);

// === DISCORD OAUTH ===
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/register/index.html?error=oauth_failed' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
