const fs = require('fs');
const path = require('path');

const round1Matches = [];
for (let m = 1; m <= 8; m++) {
  const pA = (m * 2) - 1;
  const pB = m * 2;
  round1Matches.push({
    id: `m-r1-${m}`,
    roundNumber: 1,
    order: m,
    participantA: {
      id: `slot-${pA}`,
      username: `player_${pA}`,
      nickname: `Player #${pA}`,
      instagram: null,
      youtube: null,
      avatar: null,
      avatarUrl: null,
      hasSubmission: false
    },
    participantB: {
      id: `slot-${pB}`,
      username: `player_${pB}`,
      nickname: `Player #${pB}`,
      instagram: null,
      youtube: null,
      avatar: null,
      avatarUrl: null,
      hasSubmission: false
    },
    winnerId: null,
    scoreA: null,
    scoreB: null,
    status: 'PENDING'
  });
}

const round2Matches = [];
for (let m = 1; m <= 4; m++) {
  round2Matches.push({
    id: `m-r2-${m}`,
    roundNumber: 2,
    order: m,
    participantA: null,
    participantB: null,
    winnerId: null,
    scoreA: null,
    scoreB: null,
    status: 'PENDING'
  });
}

const round3Matches = [];
for (let m = 1; m <= 2; m++) {
  round3Matches.push({
    id: `m-r3-${m}`,
    roundNumber: 3,
    order: m,
    participantA: null,
    participantB: null,
    winnerId: null,
    scoreA: null,
    scoreB: null,
    status: 'PENDING'
  });
}

const round4Matches = [{
  id: 'm-r4-1',
  roundNumber: 4,
  order: 1,
  participantA: null,
  participantB: null,
  winnerId: null,
  scoreA: null,
  scoreB: null,
  status: 'PENDING'
}];

const neutralBracketData = {
  rounds: [
    {
      roundNumber: 1,
      title: 'Round 1 (R16)',
      conditions: '',
      juryRevealEnabled: true,
      matches: round1Matches
    },
    {
      roundNumber: 2,
      title: 'Quarterfinals',
      conditions: '',
      juryRevealEnabled: true,
      matches: round2Matches
    },
    {
      roundNumber: 3,
      title: 'Semifinals',
      conditions: '',
      juryRevealEnabled: true,
      matches: round3Matches
    },
    {
      roundNumber: 4,
      title: 'Grand Final',
      conditions: '',
      juryRevealEnabled: true,
      matches: round4Matches
    }
  ]
};

// Write bracket_data.json
fs.writeFileSync('bracket_data.json', JSON.stringify(neutralBracketData, null, 2), 'utf8');
console.log('Saved neutral bracket_data.json');

// Write _astro/bracket-data.js
const bracketDataJsContent = `window.__BRACKET_DATA = ${JSON.stringify(neutralBracketData, null, 2)};
window.__SITE_SETTINGS = {
  "timerIso": "2026-10-31T20:00:00.000Z",
  "timerHeaderText": "DAREDOWN TOURNAMENT",
  "ngcDeadlineIso": "2026-10-25T23:59:59.000Z",
  "tournamentBracketHidden": false,
  "description": "NO PROMPTS. NO SHORTCUTS. PROVE YOURSELF. DAREDOWN TOURNAMENT.",
  "subDescription": "Compete against the best. Real participants, real brackets, high stakes.",
  "backgroundVideoFilename": "videos/Comp%201_9.mp4",
  "rounds": [
    { "id": "1", "duration": "48h", "duration_amount": "48", "judge": { "duration": "24h", "duration_amount": "24" } },
    { "id": "2", "duration": "48h", "duration_amount": "48", "judge": { "duration": "24h", "duration_amount": "24" } },
    { "id": "3", "duration": "48h", "duration_amount": "48", "judge": { "duration": "24h", "duration_amount": "24" } },
    { "id": "4", "duration": "72h", "duration_amount": "72", "judge": { "duration": "48h", "duration_amount": "48" } }
  ],
  "specialThanks": [],
  "winners": [],
  "updatedAt": "2026-09-28T00:00:00.000Z",
  "backgroundVideoUrl": "videos/Comp%201_9.mp4",
  "apiBaseUrl": "",
  "loginUrl": "/register/index.html",
  "cabinetUrl": "/profile",
  "adminUrl": "/admin"
};
`;

fs.writeFileSync('_astro/bracket-data.js', bracketDataJsContent, 'utf8');
console.log('Saved _astro/bracket-data.js');
