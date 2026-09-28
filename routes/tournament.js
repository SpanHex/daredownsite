const express = require('express');
const router = express.Router();
const { getOrInitBracket, TOURNAMENT_ID } = require('../utils/bracketHelper');
const TournamentBracket = require('../models/TournamentBracket');
const { isAuthenticated } = require('../middleware/auth');

// === GET PUBLIC TOURNAMENT BRACKET ===
router.get('/bracket', async (req, res) => {
  try {
    const bracket = await getOrInitBracket();
    res.json({
      tournamentId: bracket.tournamentId,
      slots: bracket.slots,
      rounds: bracket.rounds,
      updatedAt: bracket.updatedAt
    });
  } catch (err) {
    console.error('Failed to get tournament bracket:', err);
    res.status(500).json({ error: 'Failed to retrieve tournament bracket' });
  }
});

// === GET CURRENT USER'S TOURNAMENT SLOT ===
router.get('/my-slot', isAuthenticated, async (req, res) => {
  try {
    const bracket = await getOrInitBracket();
    const slot = bracket.slots.find(s => s.userId && s.userId.toString() === req.user._id.toString());
    
    if (!slot) {
      return res.json({
        hasSlot: false,
        slotNumber: null,
        message: 'No tournament slot currently assigned.'
      });
    }

    res.json({
      hasSlot: true,
      slotNumber: slot.slotNumber,
      displayName: slot.displayName,
      avatar: slot.avatar,
      tournamentStatus: req.user.tournamentStatus || 'registered'
    });
  } catch (err) {
    console.error('Failed to get user slot:', err);
    res.status(500).json({ error: 'Failed to retrieve tournament slot' });
  }
});

// === GET DETAILED PUBLIC MATCH (USED BY JUDGE / HOST / MATCH PREVIEWS) ===
router.get('/matches/:id/publicDetailed', async (req, res) => {
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

    // Format according to expected schema in bundle.judge.js / Ee(t)
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
        id: foundMatch.participantA?.id || (foundMatch.participantA?.slotNumber ? `slot-${foundMatch.participantA.slotNumber}` : null),
        name: foundMatch.participantA?.displayName || 'TBD',
        avatarUrl: foundMatch.participantA?.avatar || null,
        submission: null,
        scores: { users: null, jury: null }
      },
      participantB: {
        id: foundMatch.participantB?.id || (foundMatch.participantB?.slotNumber ? `slot-${foundMatch.participantB.slotNumber}` : null),
        name: foundMatch.participantB?.displayName || 'TBD',
        avatarUrl: foundMatch.participantB?.avatar || null,
        submission: null,
        scores: { users: null, jury: null }
      }
    });
  } catch (err) {
    console.error('Failed to get detailed match:', err);
    res.status(500).json({ error: 'Failed to retrieve match details' });
  }
});

module.exports = router;
