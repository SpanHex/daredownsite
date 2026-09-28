const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');
const { syncUserToBracket, getOrInitBracket } = require('../utils/bracketHelper');
const logSecurityEvent = require('../middleware/securityLogger');

// Rate limit profile mutations to prevent abuse
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  validate: { trustProxy: false },
  message: { error: 'Too many profile requests, please try again later.' }
});

router.use(isAuthenticated);
router.use(profileLimiter);

// === GET CURRENT USER PROFILE ===
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const bracket = await getOrInitBracket();
    const slot = bracket.slots.find(s => s.userId && s.userId.toString() === user._id.toString());

    res.json({
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName || user.username,
        email: user.email,
        authProvider: user.authProvider,
        avatar: user.avatar,
        avatarUrl: user.avatar,
        role: user.role,
        accountStatus: user.accountStatus,
        themePreference: user.themePreference || null,
        bracketSlot: slot ? slot.slotNumber : (user.bracketSlot || null),
        tournamentStatus: user.tournamentStatus || 'registered',
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      },
      tournament: {
        slotNumber: slot ? slot.slotNumber : (user.bracketSlot || null),
        displayName: slot ? slot.displayName : (user.displayName || user.username),
        status: user.tournamentStatus || 'registered'
      }
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// === UPDATE DISPLAY NAME ===
router.patch('/display-name', async (req, res) => {
  try {
    const { displayName } = req.body;

    if (!displayName || typeof displayName !== 'string') {
      return res.status(400).json({ error: 'Display name is required.' });
    }

    const trimmed = displayName.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      return res.status(400).json({ error: 'Display name must be between 2 and 30 characters.' });
    }

    // Check for malicious / control characters
    if (/[\x00-\x1F\x7F<>]/.test(trimmed)) {
      return res.status(400).json({ error: 'Display name contains invalid characters.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.displayName = trimmed;
    await user.save();

    // Sync to TournamentBracket
    await syncUserToBracket(user);

    logSecurityEvent(req, 'profile_update', true, 'Display name updated', user._id, user.username, user.authProvider);

    res.json({
      message: 'Display name updated successfully.',
      displayName: user.displayName,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
        avatarUrl: user.avatar,
        bracketSlot: user.bracketSlot
      }
    });
  } catch (err) {
    console.error('Error updating display name:', err);
    res.status(500).json({ error: 'Failed to update display name.' });
  }
});

// === UPLOAD / REPLACE PROFILE PICTURE ===
router.post('/avatar', async (req, res) => {
  try {
    const avatar = req.body.avatar || req.body.avatarData;

    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Server-side validation: must be data URL with acceptable MIME type
    const mimeMatch = avatar.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,/i);
    if (!mimeMatch) {
      return res.status(400).json({
        error: 'Invalid image format. Allowed formats: JPG, PNG, WEBP, GIF.'
      });
    }

    // Validate size (max 2.5MB payload = ~1.8MB binary image)
    const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
    const approximateSizeBytes = (base64Data.length * 3) / 4;
    if (approximateSizeBytes > 2.5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image file size too large. Maximum size is 2MB.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.avatar = avatar;
    await user.save();

    // Sync to TournamentBracket
    await syncUserToBracket(user);

    logSecurityEvent(req, 'profile_update', true, 'Profile avatar updated', user._id, user.username, user.authProvider);

    res.json({
      message: 'Profile picture updated successfully.',
      avatar: user.avatar,
      avatarUrl: user.avatar
    });
  } catch (err) {
    console.error('Error updating avatar:', err);
    res.status(500).json({ error: 'Failed to upload profile picture.' });
  }
});

// === REMOVE PROFILE PICTURE ===
router.delete('/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.avatar = null;
    await user.save();

    // Sync to TournamentBracket
    await syncUserToBracket(user);

    logSecurityEvent(req, 'profile_update', true, 'Profile avatar removed', user._id, user.username, user.authProvider);

    res.json({
      message: 'Profile picture removed successfully.',
      avatar: null,
      avatarUrl: null
    });
  } catch (err) {
    console.error('Error removing avatar:', err);
    res.status(500).json({ error: 'Failed to remove profile picture.' });
  }
});

// === CHANGE LOGIN EMAIL ===
router.patch('/email', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.authProvider !== 'local') {
      return res.status(400).json({
        error: `Account email is managed by your OAuth provider (${user.authProvider.toUpperCase()}) and cannot be changed here.`
      });
    }

    const { newEmail, currentPassword } = req.body;

    if (!newEmail || typeof newEmail !== 'string') {
      return res.status(400).json({ error: 'New email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = newEmail.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to verify identity.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      logSecurityEvent(req, 'email_change', false, 'Incorrect current password', user._id, user.username, 'local');
      return res.status(401).json({ error: 'Incorrect current password.' });
    }

    // Check if new email is taken
    const existing = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
    if (existing) {
      return res.status(400).json({ error: 'Email address is already in use by another account.' });
    }

    user.email = cleanEmail;
    await user.save();

    logSecurityEvent(req, 'email_change', true, 'Email updated', user._id, user.username, 'local');

    res.json({
      message: 'Login email updated successfully.',
      email: user.email
    });
  } catch (err) {
    console.error('Error updating email:', err);
    res.status(500).json({ error: 'Failed to update email address.' });
  }
});

// === CHANGE PASSWORD ===
router.patch('/password', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.authProvider !== 'local') {
      return res.status(400).json({
        error: `Password changes are not applicable. Your account is authenticated via ${user.authProvider.toUpperCase()}.`
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Current password, new password, and confirmation are all required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      logSecurityEvent(req, 'password_change', false, 'Incorrect current password', user._id, user.username, 'local');
      return res.status(401).json({ error: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    logSecurityEvent(req, 'password_change', true, 'Password changed successfully', user._id, user.username, 'local');

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

module.exports = router;
