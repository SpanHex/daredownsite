const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const SecurityEvent = require('../models/SecurityEvent');
const { isAdmin } = require('../middleware/auth');

// Protect all admin routes with server-side role check
router.use(isAdmin);

// Admin routes themselves should not be aggressively rate-limited,
// but we add a light limiter to prevent scraping
const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  validate: { trustProxy: false },
  message: { error: 'Too many requests.' }
});
router.use(adminLimiter);

// === GET USERS (Paginated + Searchable) ===
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.status) {
      query.accountStatus = req.query.status;
    }
    if (req.query.role) {
      query.role = req.query.role;
    }
    if (req.query.provider) {
      query.authProvider = req.query.provider;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash') // NEVER send password hash
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// === GET SINGLE USER ===
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// === GET USER SECURITY EVENTS (Paginated + Filterable) ===
router.get('/users/:id/security-events', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const query = { userId: req.params.id };
    if (req.query.eventType) query.eventType = req.query.eventType;
    if (req.query.success !== undefined) query.success = req.query.success === 'true';
    if (req.query.provider) query.authProvider = req.query.provider;
    if (req.query.ip) query.ipAddress = { $regex: req.query.ip };
    if (req.query.dateFrom || req.query.dateTo) {
      query.timestamp = {};
      if (req.query.dateFrom) query.timestamp.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) query.timestamp.$lte = new Date(req.query.dateTo);
    }

    const total = await SecurityEvent.countDocuments(query);
    const events = await SecurityEvent.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch security events' });
  }
});

// === CHANGE USER STATUS (Suspend/Restore) ===
router.post('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "active" or "suspended".' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent admin from suspending themselves or other admins
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot modify other administrator accounts.' });
    }

    user.accountStatus = status;
    await user.save();

    res.json({ message: `User status updated to "${status}"`, userId: user._id, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// === GET SECURITY OVERVIEW ===
router.get('/security/overview', async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsers24h,
      recentLogins,
      failedLogins24h,
      recentSuspicious,
      recentEvents
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      SecurityEvent.countDocuments({ eventType: 'login', success: true, timestamp: { $gte: oneDayAgo } }),
      SecurityEvent.countDocuments({ eventType: 'login', success: false, timestamp: { $gte: oneDayAgo } }),
      SecurityEvent.find({ eventType: 'login', success: false, timestamp: { $gte: oneDayAgo } })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean(),
      SecurityEvent.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .lean()
    ]);

    res.json({
      totalUsers,
      newUsers24h,
      recentLogins,
      failedLogins24h,
      recentSuspicious,
      recentEvents
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch security overview' });
  }
});

// === SAFE SERVER REQUEST DIAGNOSTICS ===
router.get('/diagnostics', (req, res) => {
  const forwardedFor = req.headers['x-forwarded-for'] || null;
  const vercelForwardedFor = req.headers['x-vercel-forwarded-for'] || null;
  const realIp = req.headers['x-real-ip'] || null;
  const cfConnectingIp = req.headers['cf-connecting-ip'] || null;
  const host = req.headers['host'] || null;
  const connectionRemoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress || null;

  res.json({
    detectedClientIp: req.ip,
    headers: {
      'x-vercel-forwarded-for': vercelForwardedFor,
      'x-real-ip': realIp,
      'x-forwarded-for': forwardedFor,
      'cf-connecting-ip': cfConnectingIp,
      host: host
    },
    remoteAddress: connectionRemoteAddress,
    expressIp: req.ip || null,
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      isVercel: !!process.env.VERCEL,
      platform: process.platform
    },
    timestamp: new Date().toISOString()
  });
});

// === TOURNAMENT BRACKET MANAGEMENT (ADMIN) ===
const {
  getOrInitBracket,
  assignUserToSlot,
  removeUserFromSlot,
  swapSlots
} = require('../utils/bracketHelper');

// Get bracket and all eligible registered users
router.get('/bracket', async (req, res) => {
  try {
    const [bracket, registeredUsers] = await Promise.all([
      getOrInitBracket(),
      User.find()
        .select('username displayName email avatar bracketSlot tournamentStatus createdAt role')
        .sort({ createdAt: -1 })
        .lean()
    ]);

    res.json({
      bracket,
      registeredUsers
    });
  } catch (err) {
    console.error('Error fetching admin bracket:', err);
    res.status(500).json({ error: 'Failed to retrieve tournament bracket.' });
  }
});

// Assign a registered user to a bracket slot
router.post('/bracket/assign', async (req, res) => {
  try {
    const { slotNumber, userId } = req.body;
    if (!slotNumber || !userId) {
      return res.status(400).json({ error: 'slotNumber (1-16) and userId are required.' });
    }

    const slotNum = parseInt(slotNumber, 10);
    const updatedSlot = await assignUserToSlot(slotNum, userId);

    res.json({
      message: `User assigned to Slot #${slotNum} successfully.`,
      slot: updatedSlot
    });
  } catch (err) {
    console.error('Error assigning user to slot:', err);
    res.status(400).json({ error: err.message || 'Failed to assign user to slot.' });
  }
});

// Remove participant from a bracket slot
router.post('/bracket/remove', async (req, res) => {
  try {
    const { slotNumber } = req.body;
    if (!slotNumber) {
      return res.status(400).json({ error: 'slotNumber (1-16) is required.' });
    }

    const slotNum = parseInt(slotNumber, 10);
    const updatedSlot = await removeUserFromSlot(slotNum);

    res.json({
      message: `Slot #${slotNum} has been cleared.`,
      slot: updatedSlot
    });
  } catch (err) {
    console.error('Error removing user from slot:', err);
    res.status(400).json({ error: err.message || 'Failed to remove user from slot.' });
  }
});

// Swap two bracket slots
router.post('/bracket/swap', async (req, res) => {
  try {
    const slotNumberA = req.body.slotNumberA ?? req.body.slotA;
    const slotNumberB = req.body.slotNumberB ?? req.body.slotB;
    if (slotNumberA === undefined || slotNumberB === undefined) {
      return res.status(400).json({ error: 'slotNumberA and slotNumberB are required.' });
    }

    const sA = parseInt(slotNumberA, 10);
    const sB = parseInt(slotNumberB, 10);
    const result = await swapSlots(sA, sB);

    res.json({
      message: `Slots #${sA} and #${sB} swapped successfully.`,
      result
    });
  } catch (err) {
    console.error('Error swapping slots:', err);
    res.status(400).json({ error: err.message || 'Failed to swap slots.' });
  }
});

// === MATCHES / HOST PANEL API ===
// GET /admin/matches - Formatted for Host Panel / Judge bundle
router.get('/matches', async (req, res) => {
  try {
    const bracket = await getOrInitBracket();
    const formattedMatches = [];

    for (const round of bracket.rounds) {
      for (const m of round.matches) {
        formattedMatches.push({
          id: m.id,
          round: {
            title: round.title,
            roundNumber: round.roundNumber,
            conditions: 'Standard 1v1',
            status: 'ACTIVE'
          },
          order: m.order,
          status: m.status || 'PENDING',
          winnerId: m.winnerId || null,
          participantA: {
            id: m.participantA?.id || (m.participantA?.slotNumber ? `slot-${m.participantA.slotNumber}` : null),
            name: m.participantA?.displayName || `Player #${m.participantA?.slotNumber || 1}`,
            avatarUrl: m.participantA?.avatar || null
          },
          participantB: {
            id: m.participantB?.id || (m.participantB?.slotNumber ? `slot-${m.participantB.slotNumber}` : null),
            name: m.participantB?.displayName || `Player #${m.participantB?.slotNumber || 2}`,
            avatarUrl: m.participantB?.avatar || null
          }
        });
      }
    }

    res.json({ matches: formattedMatches });
  } catch (err) {
    console.error('Error fetching admin matches:', err);
    res.status(500).json({ error: 'Failed to retrieve matches.' });
  }
});

// GET /admin/matches/:id/scores - Details for jury/host review
router.get('/matches/:id/scores', async (req, res) => {
  try {
    const bracket = await getOrInitBracket();
    const matchId = req.params.id;

    let foundMatch = null;
    let foundRound = null;

    for (const r of bracket.rounds) {
      const m = r.matches.find(item => item.id === matchId);
      if (m) {
        foundMatch = m;
        foundRound = r;
        break;
      }
    }

    if (!foundMatch) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    res.json({
      match: {
        id: foundMatch.id,
        order: foundMatch.order,
        status: foundMatch.status,
        winnerId: foundMatch.winnerId
      },
      round: {
        title: foundRound.title,
        roundNumber: foundRound.roundNumber,
        conditions: 'Standard DAREDOWN 1v1',
        status: 'ACTIVE'
      },
      participantA: {
        id: foundMatch.participantA?.id || `slot-${foundMatch.participantA?.slotNumber || 1}`,
        name: foundMatch.participantA?.displayName || 'TBD',
        avatarUrl: foundMatch.participantA?.avatar || null,
        youtubeUrl: null,
        instagramUrl: null,
        submission: {
          id: `sub-a-${foundMatch.id}`,
          embedUrl: null,
          description: `Submission for ${foundMatch.participantA?.displayName || 'Participant A'}`,
          status: 'PENDING'
        },
        aggregates: { users: null, jury: null },
        juryScores: []
      },
      participantB: {
        id: foundMatch.participantB?.id || `slot-${foundMatch.participantB?.slotNumber || 2}`,
        name: foundMatch.participantB?.displayName || 'TBD',
        avatarUrl: foundMatch.participantB?.avatar || null,
        youtubeUrl: null,
        instagramUrl: null,
        submission: {
          id: `sub-b-${foundMatch.id}`,
          embedUrl: null,
          description: `Submission for ${foundMatch.participantB?.displayName || 'Participant B'}`,
          status: 'PENDING'
        },
        aggregates: { users: null, jury: null },
        juryScores: []
      }
    });
  } catch (err) {
    console.error('Error fetching match scores:', err);
    res.status(500).json({ error: 'Failed to retrieve match scores.' });
  }
});

module.exports = router;
