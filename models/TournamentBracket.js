const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotNumber: { type: Number, required: true }, // 1 to 16
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  displayName: { type: String, default: null }, // e.g. "Player #1" or user display name
  username: { type: String, default: null },
  avatar: { type: String, default: null },
  isOccupied: { type: Boolean, default: false }
}, { _id: false });

const participantSubSchema = new mongoose.Schema({
  id: { type: String, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  username: { type: String, default: null },
  displayName: { type: String, default: null },
  avatar: { type: String, default: null },
  slotNumber: { type: Number, default: null }
}, { _id: false });

const matchSchema = new mongoose.Schema({
  id: { type: String, required: true },
  roundNumber: { type: Number, required: true }, // 1=R16, 2=QF, 3=SF, 4=Final
  order: { type: Number, required: true }, // 1..8 in R1, 1..4 in R2, 1..2 in R3, 1 in R4
  participantA: participantSubSchema,
  participantB: participantSubSchema,
  winnerId: { type: String, default: null },
  scoreA: { type: Number, default: null },
  scoreB: { type: Number, default: null },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'FINISHED'], default: 'PENDING' }
}, { _id: false });

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  title: { type: String, required: true },
  matches: [matchSchema]
}, { _id: false });

const tournamentBracketSchema = new mongoose.Schema({
  tournamentId: { type: String, default: 'daredown-2026', unique: true },
  slots: [slotSchema],
  rounds: [roundSchema]
}, { timestamps: true });

module.exports = mongoose.model('TournamentBracket', tournamentBracketSchema);
