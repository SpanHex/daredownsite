const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  displayName: {
    type: String,
    trim: true,
    default: null
  },
  bracketSlot: {
    type: Number,
    default: null // 1 to 16
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true // Allows multiple nulls (e.g. discord users without email)
  },
  passwordHash: {
    type: String
  },
  authProvider: {
    type: String,
    required: true,
    enum: ['local', 'google', 'discord'],
    default: 'local'
  },
  googleId: {
    type: String,
    sparse: true
  },
  discordId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'jury', 'USER', 'ADMIN', 'JURY'],
    default: 'user'
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  themePreference: {
    type: String,
    enum: ['boy', 'girl'],
    default: null
  },
  lastLoginAt: {
    type: Date
  },
  tournamentStatus: {
    type: String,
    enum: ['registered', 'active', 'eliminated', 'winner'],
    default: 'registered'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
