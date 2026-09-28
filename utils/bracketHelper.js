const TournamentBracket = require('../models/TournamentBracket');
const User = require('../models/User');

const TOURNAMENT_ID = 'daredown-2026';

/**
 * Initializes or retrieves the canonical 16-slot tournament bracket.
 * Guarantees 16 neutral slots (Player #1 .. Player #16) and 4 rounds.
 */
async function getOrInitBracket() {
  let bracket = await TournamentBracket.findOne({ tournamentId: TOURNAMENT_ID });

  if (!bracket) {
    // Generate 16 slots with neutral placeholders
    const slots = [];
    for (let i = 1; i <= 16; i++) {
      slots.push({
        slotNumber: i,
        userId: null,
        displayName: `Player #${i}`,
        username: null,
        avatar: null,
        isOccupied: false
      });
    }

    // Generate 4 Rounds
    // Round 1: 8 matches (16 players)
    const r1Matches = [];
    for (let m = 1; m <= 8; m++) {
      const slotA = (m * 2) - 1;
      const slotB = m * 2;
      r1Matches.push({
        id: `m-r1-${m}`,
        roundNumber: 1,
        order: m,
        participantA: {
          id: null,
          userId: null,
          username: null,
          displayName: `Player #${slotA}`,
          avatar: null,
          slotNumber: slotA
        },
        participantB: {
          id: null,
          userId: null,
          username: null,
          displayName: `Player #${slotB}`,
          avatar: null,
          slotNumber: slotB
        },
        winnerId: null,
        scoreA: null,
        scoreB: null,
        status: 'PENDING'
      });
    }

    // Round 2: Quarterfinals (4 matches)
    const r2Matches = [];
    for (let m = 1; m <= 4; m++) {
      r2Matches.push({
        id: `m-r2-${m}`,
        roundNumber: 2,
        order: m,
        participantA: { id: null, displayName: 'TBD', avatar: null },
        participantB: { id: null, displayName: 'TBD', avatar: null },
        winnerId: null,
        status: 'PENDING'
      });
    }

    // Round 3: Semifinals (2 matches)
    const r3Matches = [];
    for (let m = 1; m <= 2; m++) {
      r3Matches.push({
        id: `m-r3-${m}`,
        roundNumber: 3,
        order: m,
        participantA: { id: null, displayName: 'TBD', avatar: null },
        participantB: { id: null, displayName: 'TBD', avatar: null },
        winnerId: null,
        status: 'PENDING'
      });
    }

    // Round 4: Final (1 match)
    const r4Matches = [{
      id: 'm-r4-1',
      roundNumber: 4,
      order: 1,
      participantA: { id: null, displayName: 'TBD', avatar: null },
      participantB: { id: null, displayName: 'TBD', avatar: null },
      winnerId: null,
      status: 'PENDING'
    }];

    bracket = await TournamentBracket.create({
      tournamentId: TOURNAMENT_ID,
      slots,
      rounds: [
        { roundNumber: 1, title: 'ROUND 1 (R16)', matches: r1Matches },
        { roundNumber: 2, title: 'QUARTERFINALS', matches: r2Matches },
        { roundNumber: 3, title: 'SEMIFINALS', matches: r3Matches },
        { roundNumber: 4, title: 'GRAND FINAL', matches: r4Matches }
      ]
    });
  } else {
    // If bracket exists, synchronize latest user displayNames and avatars from User collection
    let modified = false;
    for (const slot of bracket.slots) {
      if (slot.isOccupied && slot.userId) {
        const u = await User.findById(slot.userId).select('username displayName avatar').lean();
        if (u) {
          const currentName = u.displayName || u.username;
          if (slot.displayName !== currentName || slot.avatar !== (u.avatar || null)) {
            slot.displayName = currentName;
            slot.avatar = u.avatar || null;
            slot.username = u.username;
            modified = true;
            syncRound1Slot(bracket, slot);
          }
        }
      }
    }
    if (modified) {
      await bracket.save();
    }
  }

  return bracket;
}

/**
 * Syncs a single slot's participant data into the corresponding Round 1 match.
 */
function syncRound1Slot(bracket, slot) {
  const round1 = bracket.rounds.find(r => r.roundNumber === 1);
  if (!round1) return;

  const matchIndex = Math.floor((slot.slotNumber - 1) / 2);
  const match = round1.matches[matchIndex];
  if (!match) return;

  const isA = (slot.slotNumber % 2 === 1);
  const participantData = {
    id: slot.isOccupied && slot.userId ? String(slot.userId) : null,
    userId: slot.isOccupied ? slot.userId : null,
    username: slot.isOccupied ? slot.username : null,
    displayName: slot.isOccupied ? (slot.displayName || slot.username) : `Player #${slot.slotNumber}`,
    avatar: slot.isOccupied ? slot.avatar : null,
    slotNumber: slot.slotNumber
  };

  if (isA) {
    match.participantA = participantData;
  } else {
    match.participantB = participantData;
  }
}

/**
 * Automatically assigns a newly registered user to the first available slot.
 */
async function assignUserToAvailableSlot(user) {
  const bracket = await getOrInitBracket();

  // Check if user is already placed
  const existingSlot = bracket.slots.find(s => s.userId && s.userId.toString() === user._id.toString());
  if (existingSlot) {
    if (user.bracketSlot !== existingSlot.slotNumber) {
      user.bracketSlot = existingSlot.slotNumber;
      await user.save();
    }
    return existingSlot;
  }

  // Find lowest unoccupied slot
  const emptySlot = bracket.slots.find(s => !s.isOccupied);
  if (!emptySlot) {
    // Tournament is full (all 16 slots taken)
    return null;
  }

  emptySlot.isOccupied = true;
  emptySlot.userId = user._id;
  emptySlot.username = user.username;
  emptySlot.displayName = user.displayName || user.username;
  emptySlot.avatar = user.avatar || null;

  syncRound1Slot(bracket, emptySlot);
  await bracket.save();

  user.bracketSlot = emptySlot.slotNumber;
  await user.save();

  return emptySlot;
}

/**
 * Admin assigns a specific user to a specific slot (1..16).
 */
async function assignUserToSlot(slotNumber, userId) {
  if (slotNumber < 1 || slotNumber > 16) {
    throw new Error('Invalid slot number. Must be between 1 and 16.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found.');
  }

  const bracket = await getOrInitBracket();

  // Remove user from any other slot first (prevent duplicate placement)
  for (const s of bracket.slots) {
    if (s.userId && s.userId.toString() === user._id.toString() && s.slotNumber !== slotNumber) {
      s.isOccupied = false;
      s.userId = null;
      s.username = null;
      s.displayName = `Player #${s.slotNumber}`;
      s.avatar = null;
      syncRound1Slot(bracket, s);
    }
  }

  const targetSlot = bracket.slots.find(s => s.slotNumber === slotNumber);
  if (!targetSlot) {
    throw new Error('Target slot not found.');
  }

  // If target slot is occupied by a different user, clear that user's bracketSlot
  if (targetSlot.isOccupied && targetSlot.userId && targetSlot.userId.toString() !== user._id.toString()) {
    await User.findByIdAndUpdate(targetSlot.userId, { bracketSlot: null });
  }

  targetSlot.isOccupied = true;
  targetSlot.userId = user._id;
  targetSlot.username = user.username;
  targetSlot.displayName = user.displayName || user.username;
  targetSlot.avatar = user.avatar || null;

  syncRound1Slot(bracket, targetSlot);
  await bracket.save();

  user.bracketSlot = slotNumber;
  await user.save();

  return targetSlot;
}

/**
 * Admin removes a user from a slot.
 */
async function removeUserFromSlot(slotNumber) {
  if (slotNumber < 1 || slotNumber > 16) {
    throw new Error('Invalid slot number. Must be between 1 and 16.');
  }

  const bracket = await getOrInitBracket();
  const slot = bracket.slots.find(s => s.slotNumber === slotNumber);
  if (!slot) {
    throw new Error('Slot not found.');
  }

  if (slot.userId) {
    await User.findByIdAndUpdate(slot.userId, { bracketSlot: null });
  }

  slot.isOccupied = false;
  slot.userId = null;
  slot.username = null;
  slot.displayName = `Player #${slot.slotNumber}`;
  slot.avatar = null;

  syncRound1Slot(bracket, slot);
  await bracket.save();

  return slot;
}

/**
 * Swaps participants between two slots atomically.
 */
async function swapSlots(slotNumberA, slotNumberB) {
  if (slotNumberA < 1 || slotNumberA > 16 || slotNumberB < 1 || slotNumberB > 16) {
    throw new Error('Slot numbers must be between 1 and 16.');
  }
  if (slotNumberA === slotNumberB) return;

  const bracket = await getOrInitBracket();
  const sA = bracket.slots.find(s => s.slotNumber === slotNumberA);
  const sB = bracket.slots.find(s => s.slotNumber === slotNumberB);
  if (!sA || !sB) throw new Error('Slots not found.');

  const tempA = {
    isOccupied: sA.isOccupied,
    userId: sA.userId,
    username: sA.username,
    displayName: sA.displayName,
    avatar: sA.avatar
  };

  sA.isOccupied = sB.isOccupied;
  sA.userId = sB.userId;
  sA.username = sB.username;
  sA.displayName = sB.isOccupied ? sB.displayName : `Player #${sA.slotNumber}`;
  sA.avatar = sB.avatar;

  sB.isOccupied = tempA.isOccupied;
  sB.userId = tempA.userId;
  sB.username = tempA.username;
  sB.displayName = tempA.isOccupied ? tempA.displayName : `Player #${sB.slotNumber}`;
  sB.avatar = tempA.avatar;

  syncRound1Slot(bracket, sA);
  syncRound1Slot(bracket, sB);
  await bracket.save();

  if (sA.userId) await User.findByIdAndUpdate(sA.userId, { bracketSlot: sA.slotNumber });
  if (sB.userId) await User.findByIdAndUpdate(sB.userId, { bracketSlot: sB.slotNumber });

  return { slotA: sA, slotB: sB };
}

/**
 * Whenever a user updates their displayName or avatar, sync it to the bracket.
 */
async function syncUserToBracket(user) {
  const bracket = await TournamentBracket.findOne({ tournamentId: TOURNAMENT_ID });
  if (!bracket) return;

  let modified = false;
  for (const s of bracket.slots) {
    if (s.userId && s.userId.toString() === user._id.toString()) {
      const name = user.displayName || user.username;
      s.displayName = name;
      s.avatar = user.avatar || null;
      syncRound1Slot(bracket, s);
      modified = true;
    }
  }

  // Also check round participants across all rounds
  for (const r of bracket.rounds) {
    for (const m of r.matches) {
      if (m.participantA?.userId && m.participantA.userId.toString() === user._id.toString()) {
        m.participantA.displayName = user.displayName || user.username;
        m.participantA.avatar = user.avatar || null;
        modified = true;
      }
      if (m.participantB?.userId && m.participantB.userId.toString() === user._id.toString()) {
        m.participantB.displayName = user.displayName || user.username;
        m.participantB.avatar = user.avatar || null;
        modified = true;
      }
    }
  }

  if (modified) {
    await bracket.save();
  }
}

module.exports = {
  TOURNAMENT_ID,
  getOrInitBracket,
  assignUserToAvailableSlot,
  assignUserToSlot,
  removeUserFromSlot,
  swapSlots,
  syncUserToBracket
};
