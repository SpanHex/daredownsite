const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logSecurityEvent = require('../middleware/securityLogger');

module.exports = function(passport) {
  // Serialize user ID into session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user ID from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // === LOCAL STRATEGY ===
  passport.use(
    new LocalStrategy({ usernameField: 'username', passReqToCallback: true }, async (req, username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          logSecurityEvent(req, 'login', false, 'User not found', null, username, 'local');
          return done(null, false, { message: 'Incorrect username.' });
        }
        
        if (user.accountStatus === 'suspended') {
          logSecurityEvent(req, 'login', false, 'Account suspended', user._id, username, 'local');
          return done(null, false, { message: 'Account is suspended.' });
        }

        if (user.authProvider !== 'local') {
          logSecurityEvent(req, 'login', false, 'Wrong provider (used local instead of OAuth)', user._id, username, 'local');
          return done(null, false, { message: `Please login with ${user.authProvider}.` });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          user.lastLoginAt = new Date();
          await user.save();
          logSecurityEvent(req, 'login', true, null, user._id, username, 'local');
          return done(null, user);
        } else {
          logSecurityEvent(req, 'login', false, 'Incorrect password', user._id, username, 'local');
          return done(null, false, { message: 'Incorrect password.' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  function getCallbackURL(provider) {
    let base = process.env.APP_URL;
    if (!base && process.env.VERCEL_URL) {
      base = `https://${process.env.VERCEL_URL}`;
    }
    if (base) {
      return `${base.replace(/\/+$/, '')}/api/auth/${provider}/callback`;
    }
    return `/api/auth/${provider}/callback`;
  }

  // === GOOGLE STRATEGY ===
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'mock') {
    const googleCallback = getCallbackURL('google');
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallback,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          if (user.accountStatus === 'suspended') {
             logSecurityEvent(req, 'login', false, 'Account suspended', user._id, user.username, 'google');
             return done(null, false, { message: 'Account is suspended.' });
          }
          user.lastLoginAt = new Date();
          await user.save();
          logSecurityEvent(req, 'login', true, null, user._id, user.username, 'google');
          return done(null, user);
        }

        // Check if a user with that email already exists
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (email) {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                logSecurityEvent(req, 'login', false, 'Email exists via another provider', existingUser._id, existingUser.username, 'google');
                return done(null, false, { message: 'An account with this email already exists.' });
            }
        }

        // New user
        user = await User.create({
          username: profile.displayName || `user_${profile.id.substring(0,6)}`,
          displayName: profile.displayName || `user_${profile.id.substring(0,6)}`,
          email: email,
          googleId: profile.id,
          authProvider: 'google',
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          lastLoginAt: new Date()
        });
        
        try {
          const { assignUserToAvailableSlot } = require('../utils/bracketHelper');
          await assignUserToAvailableSlot(user);
        } catch (bracketErr) {
          console.error('Error assigning Google user to tournament slot:', bracketErr.message);
        }

        logSecurityEvent(req, 'register', true, null, user._id, user.username, 'google');
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
  }

  // === DISCORD STRATEGY ===
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_ID !== 'mock') {
    const discordCallback = getCallbackURL('discord');
    passport.use(new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: discordCallback,
      scope: ['identify', 'email'],
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ discordId: profile.id });
        
        if (user) {
           if (user.accountStatus === 'suspended') {
             logSecurityEvent(req, 'login', false, 'Account suspended', user._id, user.username, 'discord');
             return done(null, false, { message: 'Account is suspended.' });
          }
          user.lastLoginAt = new Date();
          await user.save();
          logSecurityEvent(req, 'login', true, null, user._id, user.username, 'discord');
          return done(null, user);
        }

        const email = profile.email;
        if (email) {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                logSecurityEvent(req, 'login', false, 'Email exists via another provider', existingUser._id, existingUser.username, 'discord');
                return done(null, false, { message: 'An account with this email already exists.' });
            }
        }

        // New user
        user = await User.create({
          username: profile.username,
          displayName: profile.global_name || profile.username,
          email: email,
          discordId: profile.id,
          authProvider: 'discord',
          avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          lastLoginAt: new Date()
        });
        
        try {
          const { assignUserToAvailableSlot } = require('../utils/bracketHelper');
          await assignUserToAvailableSlot(user);
        } catch (bracketErr) {
          console.error('Error assigning Discord user to tournament slot:', bracketErr.message);
        }

        logSecurityEvent(req, 'register', true, null, user._id, user.username, 'discord');
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
  }
};
