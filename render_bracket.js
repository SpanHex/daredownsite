const fs = require('fs');

const data = JSON.parse(fs.readFileSync('bracket_data.json', 'utf8'));

const d = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const I = t => t?.nickname?.trim() || t?.username?.trim() || 'TBD';
const D = t => t?.avatar?.trim() || t?.avatarUrl?.trim() || '';
const E = (t, e = 0) => {
  if (typeof t == 'number' && Number.isFinite(t)) return Math.trunc(t);
  const r = Number.parseInt(String(t ?? '').trim(), 10);
  return Number.isFinite(r) ? r : e;
};
const x = t => {
  if (!t || typeof t != 'object') return null;
  const r = String(t.id ?? '').trim(),
    n = String(t.username ?? '').trim(),
    i = String(t.nickname ?? '').trim() || null,
    o = String(t.avatar ?? '').trim() || String(t.avatarUrl ?? '').trim() || null;
  return !r && !n && !i && !o ? null : { id: r, username: n, nickname: i, avatar: o, avatarUrl: o };
};
const _ = (t, e, r) => {
  if (!t || typeof t != 'object') return null;
  const i = String(t.id ?? '').trim();
  if (!i) return null;
  const o = a => {
    if (a == null || a === '') return null;
    if (typeof a == 'number' && Number.isFinite(a)) return a;
    const s = Number(a);
    return Number.isFinite(s) ? s : null;
  };
  return {
    id: i,
    roundNumber: E(t.roundNumber, e),
    order: E(t.order, r),
    participantA: x(t.participantA),
    participantB: x(t.participantB),
    winnerId: String(t.winnerId ?? '').trim() || null,
    scoreA: o(t.scoreA),
    scoreB: o(t.scoreB),
    status: String(t.status ?? 'PENDING').trim() === 'FINISHED' ? 'FINISHED' : 'PENDING'
  };
};

const h = 4;
const V = 16;
const z = t => Math.max(1, V / 2 ** t);
const M = t => (t === h ? 'Final' : t === h - 1 ? 'Semifinal' : t === h - 2 ? 'Quarterfinal' : `Round ${t}`);
const J = t =>
  (Array.isArray(t.rounds) ? t.rounds : Array.isArray(t.data?.rounds) ? t.data.rounds : [])
    .map((r, n) => {
      if (!r || typeof r != 'object') return null;
      const o = E(r.roundNumber, n + 1),
        a = Array.isArray(r.matches) ? r.matches : [];
      return {
        roundNumber: o,
        title: String(r.title ?? '').trim() || M(o),
        matches: a.map((s, c) => _(s, o, c + 1)).filter(s => !!s)
      };
    })
    .filter(r => !!r);

const w = (t, e) => ({
  id: `placeholder-${t}-${e}`,
  roundNumber: t,
  order: e,
  participantA: null,
  participantB: null,
  winnerId: null,
  scoreA: null,
  scoreB: null,
  status: 'PENDING'
});
const Q = (t, e, r) => {
  const n = new Map(),
    i = r.slice().sort((a, s) => (a.order ?? 0) - (s.order ?? 0)),
    o = (a, s) => (!Number.isInteger(a) || a < 1 || a > e || n.has(a) ? false : (n.set(a, s), true));
  for (const a of i) if (!o(Number(a.order ?? 0), a)) for (let s = 1; s <= e && !o(s, a); s += 1);
  return Array.from({ length: e }, (a, s) => n.get(s + 1) ?? w(t, s + 1));
};
const K = t => {
  const e = new Map();
  for (const n of t) typeof n?.roundNumber == 'number' && e.set(n.roundNumber, n);
  const r = [];
  for (let n = 1; n <= h; n += 1) {
    const i = e.get(n),
      o = Array.isArray(i?.matches) ? i.matches.slice().sort((c, m) => (c.order ?? 0) - (m.order ?? 0)) : [],
      a = z(n),
      s = Q(n, a, o);
    r.push({ roundNumber: n, title: i?.title?.trim() || M(n), matches: s });
  }
  return r;
};
const $ = (t, e = 'regular') => {
  const r = I(t.participantA),
    n = I(t.participantB),
    i = D(t.participantA),
    o = D(t.participantB),
    a = !t.participantA && !t.participantB,
    s = !t.id.startsWith('placeholder-') && !!(t.participantA || t.participantB),
    c = `Open match ${r} versus ${n}`,
    m = s
      ? `data-vs-trigger="true" data-match-id="${d(t.id)}" role="button" tabindex="0" aria-label="${d(c)}"`
      : '';
  const slotA = t.roundNumber === 1 ? (t.order * 2) - 1 : '';
  const slotB = t.roundNumber === 1 ? (t.order * 2) : '';
  const attrA = slotA ? `data-slot-number="${slotA}"` : '';
  const attrB = slotB ? `data-slot-number="${slotB}"` : '';
  return `
          <article class="bracket-match ${e === 'final' ? 'is-final' : ''} ${a ? 'is-placeholder' : ''} ${s ? 'is-interactive' : ''}" ${m}>
            <div class="bracket-slot is-top shift-left ${r === 'TBD' ? 'is-empty' : ''} ${i ? 'has-visual' : ''}" ${attrA}>
              ${i ? `<span class="bracket-slot-visual is-right" aria-hidden="true"><img src="${d(i)}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none';" /></span>` : ''}
              <span class="bracket-slot-main">
                <span class="bracket-slot-name">${d(r)}</span>
              </span>
            </div>
            <div class="bracket-slot shift-right ${n === 'TBD' ? 'is-empty' : ''} ${o ? 'has-visual' : ''}" ${attrB}>
              ${o ? `<span class="bracket-slot-visual is-left" aria-hidden="true"><img src="${d(o)}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none';" /></span>` : ''}
              <span class="bracket-slot-main">
                <span class="bracket-slot-name">${d(n)}</span>
              </span>
            </div>
          </article>
        `;
};
const X = t => {
  const e = K(t),
    r = e.at(-1),
    n = e.slice(0, -1),
    i =
      r && Array.isArray(r.matches) && r.matches[0]
        ? r.matches.slice().sort((s, c) => (s.order ?? 0) - (c.order ?? 0))[0]
        : w(r?.roundNumber ?? 1, 1),
    o = [],
    a = [];
  for (const s of n) {
    const c = Array.isArray(s.matches) ? s.matches.slice().sort((tt, et) => (tt.order ?? 0) - (et.order ?? 0)) : [],
      m = Math.ceil(c.length / 2);
    o.push({ roundNumber: s.roundNumber, title: s.title, matches: c.slice(0, m) });
    a.push({ roundNumber: s.roundNumber, title: s.title, matches: c.slice(m) });
  }
  return { leftRounds: o, rightRounds: a, finalMatch: i };
};
const y = (t, e, r) => {
  if (e < 0) return null;
  const n = t[e],
    i = n?.matches?.[r] ?? w(n?.roundNumber ?? e + 1, r + 1);
  if (e === 0) return { match: i, top: null, bottom: null, depth: 1 };
  const o = y(t, e - 1, r * 2),
    a = y(t, e - 1, r * 2 + 1),
    s = Math.max(o?.depth ?? 0, a?.depth ?? 0) + 1;
  return { match: i, top: o, bottom: a, depth: s };
};
const N = (t, e) =>
  t
    ? !t.top && !t.bottom
      ? $(t.match)
      : `
          <div class="bracket-branch is-${e}" data-depth="${d(String(t.depth))}">
            <div class="bracket-children">
              <div class="bracket-child">${N(t.top, e)}</div>
              <div class="bracket-child">${N(t.bottom, e)}</div>
            </div>
            <div class="bracket-link"></div>
            ${$(t.match)}
          </div>
        `
    : '';

const e = J(data),
  r = e.length ? e : Y(),
  { leftRounds: n, rightRounds: i, finalMatch: o } = X(r),
  a = y(n, n.length - 1, 0),
  s = y(i, i.length - 1, 0);

const html = `
          <div class="bracket-side is-left"><div class="bracket-side-track is-left">${N(a, 'left')}</div></div>
          <div class="bracket-center">
            <div class="bracket-center-finals">
              <div class="bracket-center-side-link"></div>
              ${$(o, 'final')}
              <div class="bracket-center-side-link"></div>
            </div>
          </div>
          <div class="bracket-side is-right"><div class="bracket-side-track is-right">${N(s, 'right')}</div></div>
        `;

console.log('16-participant HTML generated! Length:', html.length);
fs.writeFileSync('rendered_bracket.html', html, 'utf8');
