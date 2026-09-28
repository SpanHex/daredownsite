const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  usernameAttempt: {
    type: String
  },
  eventType: {
    type: String,
    required: true,
    enum: ['register', 'login', 'logout', 'failed_login', 'account_update', 'profile_update', 'password_change', 'email_change', 'avatar_update']
  },
  success: {
    type: Boolean,
    required: true
  },
  failureReason: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'discord']
  },
  // Raw normalized IP (for filtering/search)
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  // Classified IPv4 address (null if not available)
  ipv4: {
    type: String,
    default: null
  },
  // Classified IPv6 address (null if not available)
  ipv6: {
    type: String,
    default: null
  },
  userAgent: {
    type: String
  },
  browser: {
    type: String
  },
  browserVersion: {
    type: String
  },
  os: {
    type: String
  },
  osVersion: {
    type: String
  },
  deviceType: {
    type: String
  },
  deviceModel: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound indexes for efficient admin queries
securityEventSchema.index({ userId: 1, timestamp: -1 });
securityEventSchema.index({ eventType: 1, success: 1, timestamp: -1 });
securityEventSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
