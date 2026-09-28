(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // _astro/api-paths.BeHY0xnA.js
  var i;
  var init_api_paths_BeHY0xnA = __esm({
    "_astro/api-paths.BeHY0xnA.js"() {
      i = { health: "/health", siteSettings: "/site-settings", media: { instagramPreview: "/media/instagram-preview" }, auth: { discord: "/auth/discord", discordStart: "/auth/discord/start", discordCallback: "/auth/discord/callback", me: "/auth/me", logout: "/auth/logout" }, applications: { root: "/applications", me: "/applications/me", byId: (s) => `/applications/${s}` }, ngc: { submissions: "/ngc/submissions", mySubmission: "/ngc/submissions/me" }, scores: { public: "/scores/public", user: "/scores/user", userMe: (s) => `/scores/user/me/${s}`, jury: "/scores/jury" }, participant: { submissions: "/participant/submissions", submission: (s) => `/participant/submissions/${s}`, submissionsMe: "/participant/submissions/me", dashboardMe: "/participant/dashboard/me", historyMe: "/participant/history/me", profileMe: "/participant/profile/me", scores: (s) => `/participant/scores/${s}` }, tournament: { bracket: "/tournament/bracket", matchPublicDetailed: (s) => `/tournament/matches/${s}/publicDetailed`, matchCriteriaAverages: (s) => `/tournament/matches/${s}/criteriaAverages`, submissionsByRound: (s) => `/tournament/submissions/${s}` }, admin: { users: "/admin/users", userRole: (s) => `/admin/users/${s}/role`, userRoleByDiscordId: (s) => `/admin/users/discord/${s}/role`, applications: "/admin/applications", ngcSubmissions: "/admin/ngc-submissions", ngcSubmission: (s) => `/admin/ngc-submissions/${s}`, rounds: "/admin/rounds", roundSettings: (s) => `/admin/rounds/${s}/settings`, matches: "/admin/matches", matchParticipants: (s) => `/admin/matches/${s}/participants`, matchScores: (s) => `/admin/matches/${s}/scores`, userScore: (s) => `/admin/scores/user/${s}`, matchNicknames: (s) => `/admin/matches/${s}/nicknames`, matchWinner: (s) => `/admin/matches/${s}/winner`, roundAssignments: "/admin/round-assignments", roundAssignment: (s) => `/admin/round-assignments/${s}`, placements: "/admin/placements", submissions: "/admin/submissions", submission: (s) => `/admin/submissions/${s}`, siteSettings: "/admin/site-settings", siteSettingsVideo: "/admin/site-settings/background-video" } };
    }
  });

  // _astro/http.BUnDBjdO.js
  async function i2(t, e = {}) {
    const n = e.method ?? "GET", c = E(e.baseUrl), g = U(c, t), o2 = new Headers(e.headers);
    o2.set("Accept", "application/json"), e.token && o2.set("Authorization", `Bearer ${e.token}`);
    const l2 = e.body !== void 0;
    l2 && o2.set("Content-Type", "application/json");
    const s = await fetch(g, { method: n, headers: o2, body: l2 ? JSON.stringify(e.body) : void 0, signal: e.signal }), u = await _(s);
    if (!s.ok) {
      const d2 = u;
      throw new m(s.status, w(s.status, d2), d2);
    }
    return u;
  }
  var import_meta, p, a, r, v, T, I, h, B, f, m, S, y, E, _, w, U;
  var init_http_BUnDBjdO = __esm({
    "_astro/http.BUnDBjdO.js"() {
      import_meta = {};
      p = "ngt_token";
      a = "ngt_user";
      r = () => typeof window < "u" && typeof localStorage < "u";
      v = () => {
        if (!r()) return null;
        const t = localStorage.getItem(p)?.trim() ?? "";
        return t.length > 0 ? t : null;
      };
      T = (t) => {
        if (r()) {
          if (!t) {
            localStorage.removeItem(a);
            return;
          }
          localStorage.setItem(a, JSON.stringify(t));
        }
      };
      I = () => {
        r() && (localStorage.removeItem(p), localStorage.removeItem(a));
      };
      h = (t = "/", e = "/login") => {
        const n = t.startsWith("/") ? t : "/";
        return `${e}?next=${encodeURIComponent(n)}`;
      };
      B = (t = "/", e = "/login") => {
        if (!r()) return;
        const n = h(t, e);
        window.location.replace(n);
      };
      f = { ASSETS_PREFIX: void 0, BASE_URL: "/", DEV: false, MODE: "production", PROD: true, PUBLIC_API_BASE_URL: "", SITE: "https://nwgn.art", SSR: false };
      m = class extends Error {
        status;
        payload;
        constructor(e, n, c) {
          super(n), this.name = "HttpError", this.status = e, this.payload = c;
        }
      };
      S = "http://localhost:3000";
      y = (t) => t.replace(/\/+$/, "");
      E = (t) => {
        const e = typeof document < "u" ? document.body?.dataset.apiBaseUrl : void 0, n = typeof import_meta < "u" && f && "PUBLIC_API_BASE_URL" in f ? "" : void 0;
        return y(t ?? e ?? n ?? S);
      };
      _ = async (t) => {
        if ((t.headers.get("content-type") ?? "").includes("application/json")) try {
          return await t.json();
        } catch {
          return;
        }
      };
      w = (t, e) => {
        const n = e?.message ?? e?.error;
        return typeof n == "string" && n.trim().length > 0 ? n : `Request failed with status ${t}`;
      };
      U = (t, e) => e.startsWith("/") ? `${t}${e}` : `${t}/${e}`;
    }
  });

  // _astro/dom.B1j3phAb.js
  var a2, r2, i3, o, l, d;
  var init_dom_B1j3phAb = __esm({
    "_astro/dom.B1j3phAb.js"() {
      a2 = (t) => {
        const e = document.getElementById(t);
        return e instanceof HTMLElement ? e : null;
      };
      r2 = (t) => {
        t instanceof HTMLElement && t.classList.remove("hidden");
      };
      i3 = (t) => {
        t instanceof HTMLElement && t.classList.add("hidden");
      };
      o = (t, e) => {
        t instanceof HTMLElement && (t.textContent = e == null ? "" : String(e));
      };
      l = (t, e) => {
        !(t instanceof HTMLButtonElement) && !(t instanceof HTMLInputElement) && !(t instanceof HTMLSelectElement) && !(t instanceof HTMLTextAreaElement) && !(t instanceof HTMLOptGroupElement) && !(t instanceof HTMLOptionElement) && !(t instanceof HTMLFieldSetElement) || (t.disabled = e);
      };
      d = (t, e, n = "neutral") => {
        if (t instanceof HTMLElement) {
          if (t.textContent = e, t.classList.remove("text-white/60", "text-white/70", "text-red-300", "text-emerald-300"), n === "ok") {
            t.classList.add("text-emerald-300");
            return;
          }
          if (n === "err") {
            t.classList.add("text-red-300");
            return;
          }
          t.classList.add("text-white/60");
        }
      };
    }
  });

  // _astro/judge.astro_astro_type_script_index_0_lang.CaRAhbzU.js
  var require_judge_astro_astro_type_script_index_0_lang_CaRAhbzU = __commonJS({
    "_astro/judge.astro_astro_type_script_index_0_lang.CaRAhbzU.js"() {
      init_api_paths_BeHY0xnA();
      init_http_BUnDBjdO();
      init_dom_B1j3phAb();
      var S2 = ["storyboard", "individuality", "overall", "execution", "styleImplementation"];
      var le = "ngt:judge-score";
      var I2 = () => ({ storyboard: 0, individuality: 0, overall: 0, execution: 0, styleImplementation: 0 });
      var h2 = (e) => typeof e == "string" ? e.trim() : "";
      var i4 = (e) => {
        const r3 = h2(e);
        return r3 || null;
      };
      var A = (e) => typeof e == "number" && Number.isFinite(e) ? e : null;
      var c = (e) => !!e && typeof e == "object";
      var y2 = (...e) => {
        for (const r3 of e) {
          const t = i4(r3);
          if (t) return t;
        }
        return null;
      };
      var re = (e) => {
        const r3 = i4(e);
        if (!r3) return null;
        if (r3.includes("youtube.com/embed/index.html") || r3.includes("player.vimeo.com/video/index.html")) return r3;
        try {
          const t = new URL(r3), n = t.hostname.replace(/^www\./i, "").toLowerCase();
          if (n === "youtu.be") {
            const o2 = t.pathname.replace(/\//g, "").trim();
            if (o2) return `https://www.youtube.com/embed/${o2}`;
          }
          if (n === "youtube.com" || n.endsWith(".youtube.com")) {
            if (t.pathname === "/watch") {
              const a3 = t.searchParams.get("v")?.trim();
              if (a3) return `https://www.youtube.com/embed/${a3}`;
            }
            const o2 = t.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/i);
            if (o2?.[1]) return `https://www.youtube.com/embed/${o2[1]}`;
          }
        } catch {
        }
        return r3;
      };
      var W = (e) => typeof e == "number" && Number.isFinite(e) ? String(Math.round(e)) : "-";
      var de = (e) => {
        const r3 = e.storyboard * 0.15 + e.individuality * 0.15 + e.execution * 0.15 + e.styleImplementation * 0.15 + e.overall * 0.4;
        return Math.max(0, Math.min(100, Math.round(r3 * 10)));
      };
      var k = (e) => ({ storyboard: e.storyboard, individuality: e.individuality, overall: e.overall, execution: e.execution, styleImplementation: e.styleImplementation });
      var ne = (e) => {
        if (!c(e)) return null;
        const r3 = I2();
        for (const t of S2) {
          const n = e[t];
          if (typeof n != "number" || !Number.isFinite(n)) return null;
          r3[t] = Math.max(0, Math.min(10, Math.round(n)));
        }
        return r3;
      };
      var oe = (e, r3, t) => [le, e, r3, t].join(":");
      var me = (e) => e.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      var ae = (e) => {
        if (e.roundNumber > 0) return `round-${e.roundNumber}`;
        const r3 = me(e.roundTitle);
        return r3 ? `title-${r3}` : `match-${e.id}`;
      };
      var fe = (e) => {
        const r3 = h2(e.roundTitle);
        return r3 || (e.roundNumber > 0 ? `Round ${e.roundNumber}` : "Round");
      };
      var be = () => {
        const e = a2("judge-loading"), r3 = a2("judge-denied"), t = a2("judge-error"), n = a2("judge-error-text"), o2 = a2("judge-content");
        return !e || !r3 || !t || !n || !o2 ? null : { loading: e, denied: r3, errorWrap: t, errorText: n, content: o2, loadButton: a2("judge-load-matches"), roundTabs: a2("judge-round-tabs"), search: a2("judge-filter-search"), matchesList: a2("judge-matches-list"), matchEmpty: a2("judge-match-empty"), matchPanel: a2("judge-match-panel"), roundTitle: a2("judge-round-title"), roundMeta: a2("judge-round-meta"), globalStatus: a2("judge-global-status") };
      };
      var he = () => {
        const e = /* @__PURE__ */ new Map();
        return document.querySelectorAll("[data-judge-side]").forEach((r3) => {
          const t = r3.dataset.judgeSide;
          if (t !== "A" && t !== "B") return;
          const n = r3.querySelector('[data-field="name"]'), o2 = r3.querySelector('[data-field="socials"]'), a3 = r3.querySelector('[data-field="avatar-image"]'), s = r3.querySelector('[data-field="avatar-fallback"]'), u = r3.querySelector('[data-field="video-frame"]'), l2 = r3.querySelector('[data-field="video-placeholder"]'), E2 = r3.querySelector('[data-field="users-average"]'), C = r3.querySelector('[data-field="jury-average"]'), $ = r3.querySelector('[data-field="description"]'), P = r3.querySelector('[data-field="comment"]'), H = r3.querySelector('[data-field="your-rating"]'), q = r3.querySelector('[data-field="form"]'), F = r3.querySelector('[data-field="publish"]'), J = r3.querySelector('[data-field="status"]');
          if (!(n instanceof HTMLElement) || !(o2 instanceof HTMLElement) || !(a3 instanceof HTMLImageElement) || !(s instanceof HTMLElement) || !(u instanceof HTMLIFrameElement) || !(l2 instanceof HTMLElement) || !(E2 instanceof HTMLElement) || !(C instanceof HTMLElement) || !($ instanceof HTMLElement) || !(P instanceof HTMLTextAreaElement) || !(H instanceof HTMLElement) || !(q instanceof HTMLFormElement) || !(F instanceof HTMLButtonElement) || !(J instanceof HTMLElement)) return;
          const D = {}, z = {};
          for (const j of S2) {
            const G = r3.querySelector(`[data-criterion="${j}"]`), O = G?.querySelector('[data-field="criterion-input"]'), V = G?.querySelector('[data-field="criterion-value"]');
            if (!(O instanceof HTMLInputElement) || !(V instanceof HTMLElement)) return;
            D[j] = O, z[j] = V;
          }
          e.set(t, { section: r3, name: n, socials: o2, avatarImage: a3, avatarFallback: s, videoFrame: u, videoPlaceholder: l2, usersAverage: E2, juryAverage: C, description: $, comment: P, yourRating: H, form: q, publish: F, status: J, inputs: D, values: z });
        }), e;
      };
      var Y = (e, r3) => {
        i3(e.loading), i3(e.denied), i3(e.content), o(e.errorText, r3), r2(e.errorWrap);
      };
      var ye = (e) => {
        i3(e.loading), i3(e.errorWrap), i3(e.content), r2(e.denied);
      };
      var ge = (e) => {
        i3(e.loading), i3(e.errorWrap), i3(e.denied), r2(e.content);
      };
      var b = (e) => {
        if (!e) return "TBD";
        const r3 = c(e) ? e : {};
        return i4(r3.name) ?? i4(r3.nickname) ?? i4(r3.username) ?? i4(r3.id) ?? "TBD";
      };
      var pe = async (e) => {
        const r3 = await i2(i.auth.me, { method: "GET", token: e });
        if (!r3?.user) throw new m(401, "UNAUTHORIZED");
        return r3.user;
      };
      var ve = (e) => (c(e) && Array.isArray(e.matches) ? e.matches : []).map((t) => {
        if (!c(t)) return null;
        const n = i4(t.id);
        if (!n) return null;
        const o2 = c(t.round) ? t.round : null;
        return { id: n, roundNumber: Number(o2?.roundNumber ?? 0) || 0, roundTitle: i4(o2?.title) ?? `Round ${Number(o2?.roundNumber ?? 0) || "-"}`, order: Number(t.order ?? 0) || 0, status: i4(t.status) ?? "-", participantA: c(t.participantA) ? { id: i4(t.participantA.id), name: b(t.participantA) } : null, participantB: c(t.participantB) ? { id: i4(t.participantB.id), name: b(t.participantB) } : null };
      }).filter((t) => !!t).sort((t, n) => t.roundNumber - n.roundNumber || t.order - n.order);
      var Me = (e) => {
        const r3 = c(e) && Array.isArray(e.rounds) ? e.rounds : [], t = [];
        for (const n of r3) {
          if (!c(n)) continue;
          const o2 = Number(n.roundNumber ?? 0) || 0, a3 = i4(n.title) ?? `Round ${o2 || "-"}`, s = Array.isArray(n.matches) ? n.matches : [];
          for (const u of s) {
            if (!c(u)) continue;
            const l2 = i4(u.id);
            l2 && t.push({ id: l2, roundNumber: o2, roundTitle: a3, order: Number(u.order ?? 0) || 0, status: i4(u.status) ?? "-", participantA: c(u.participantA) ? { id: i4(u.participantA.id), name: b(u.participantA) } : null, participantB: c(u.participantB) ? { id: i4(u.participantB.id), name: b(u.participantB) } : null });
          }
        }
        return t.sort((n, o2) => n.roundNumber - o2.roundNumber || n.order - o2.order);
      };
      var Ae = async (e) => {
        try {
          const t = await i2(i.admin.matches, { method: "GET", token: e }), n = ve(t);
          if (n.length > 0) return n;
        } catch (t) {
          if (!(t instanceof m) || t.status !== 401 && t.status !== 403) throw t;
        }
        const r3 = await i2(i.tournament.bracket, { method: "GET", token: e });
        return Me(r3);
      };
      var we = (e) => c(e) ? { scorerId: c(e.scorer) ? i4(e.scorer.id) : i4(e.scorerId), scorerUsername: c(e.scorer) ? i4(e.scorer.username) : null, criteria: ne(e.criteria), comment: i4(e.comment), score100: A(e.score100) } : null;
      var X = (e) => {
        if (!c(e)) return null;
        const r3 = c(e.submission) ? e.submission : null, t = c(e.aggregates) ? e.aggregates : null, n = Array.isArray(e.juryScores) ? e.juryScores : [];
        return { id: i4(e.id), name: b(e), avatarUrl: y2(e.avatarUrl, e.avatar), youtubeUrl: y2(e.youtubeUrl, e.youtube), instagramUrl: y2(e.instagramUrl, e.instagram), submission: r3 ? { id: i4(r3.id), embedUrl: re(r3.embedUrl ?? r3.videoUrl ?? r3.workUrl), description: h2(r3.description), status: i4(r3.status) } : null, audienceAverage: c(t?.users) ? A(t.users.average100) : null, juryAverage: c(t?.jury) ? A(t.jury.average100) : null, juryEntries: n.map(we).filter((o2) => !!o2) };
      };
      var Z = (e) => {
        if (!c(e)) return null;
        const r3 = c(e.submission) ? e.submission : null, t = c(e.scores) ? e.scores : null;
        return { id: i4(e.id), name: b(e), avatarUrl: y2(e.avatarUrl, e.avatar), youtubeUrl: y2(e.youtubeUrl, e.youtube), instagramUrl: y2(e.instagramUrl, e.instagram), submission: r3 ? { id: i4(r3.id), embedUrl: re(r3.embedUrl ?? r3.videoUrl ?? r3.workUrl), description: h2(r3.description), status: i4(r3.status) } : null, audienceAverage: c(t?.users) ? A(t.users.average100) : null, juryAverage: c(t?.jury) ? A(t.jury.average100) : null, juryEntries: [] };
      };
      var Se = (e) => {
        if (!c(e)) return null;
        const r3 = c(e.match) ? e.match : null, t = c(e.round) ? e.round : null, n = i4(r3?.id);
        return n ? { id: n, round: { title: i4(t?.title) ?? `Round ${Number(t?.roundNumber ?? 0) || "-"}`, roundNumber: Number(t?.roundNumber ?? 0) || 0, conditions: i4(t?.conditions), status: i4(t?.status) }, match: { order: Number(r3?.order ?? 0) || 0, status: i4(r3?.status), winnerId: i4(r3?.winnerId) }, participantA: X(e.participantA), participantB: X(e.participantB) } : null;
      };
      var Ee = (e) => {
        if (!c(e)) return null;
        const r3 = c(e.match) ? e.match : null, t = c(e.round) ? e.round : null, n = i4(r3?.id);
        return n ? { id: n, round: { title: i4(t?.title) ?? `Round ${Number(t?.roundNumber ?? 0) || "-"}`, roundNumber: Number(t?.roundNumber ?? 0) || 0, conditions: i4(t?.conditions), status: i4(t?.status) }, match: { order: Number(r3?.order ?? 0) || 0, status: i4(r3?.status), winnerId: i4(r3?.winnerId) }, participantA: Z(e.participantA), participantB: Z(e.participantB) } : null;
      };
      var Ie = async (e, r3) => {
        try {
          const o2 = await i2(i.admin.matchScores(r3), { method: "GET", token: e }), a3 = Se(o2);
          if (a3) return a3;
        } catch (o2) {
          if (!(o2 instanceof m) || o2.status !== 401 && o2.status !== 403) throw o2;
        }
        const t = await i2(i.tournament.matchPublicDetailed(r3), { method: "GET", token: e }), n = Ee(t);
        if (!n) throw new Error("Could not normalize judge match detail.");
        return n;
      };
      var Le = (e) => {
        const r3 = e.split(/\s+/).filter(Boolean).slice(0, 2);
        return r3.length === 0 ? "?" : r3.map((t) => t[0]?.toUpperCase() ?? "").join("") || "?";
      };
      var Te = (e, r3) => {
        e.replaceChildren();
        const t = [{ label: "youtube", href: r3?.youtubeUrl ?? null }, { label: "instagram", href: r3?.instagramUrl ?? null }];
        for (const n of t) {
          if (!n.href) continue;
          const o2 = document.createElement("a");
          o2.href = n.href, o2.target = "_blank", o2.rel = "noreferrer noopener", o2.className = "underline hover:text-white transition-colors", o2.textContent = n.label, e.append(o2);
        }
        e.childElementCount === 0 && (e.textContent = "No socials");
      };
      var xe = (e, r3, t = false) => ({ criteria: k(e), comment: r3, published: t });
      var je = (e, r3) => {
        const t = i4(e.currentUser?.id), n = i4(r3?.submission?.id), o2 = i4(e.currentMatch?.id);
        if (!t || !n || !o2) return null;
        try {
          const a3 = window.localStorage.getItem(oe(t, o2, n));
          if (!a3) return null;
          const s = JSON.parse(a3);
          if (!c(s)) return null;
          const u = ne(s.criteria);
          return u ? { criteria: u, comment: h2(s.comment), published: s.published === true } : null;
        } catch {
          return null;
        }
      };
      var U2 = (e, r3, t, n, o2 = false) => {
        const a3 = i4(e.currentUser?.id), s = i4(r3?.submission?.id), u = i4(e.currentMatch?.id);
        if (!(!a3 || !s || !u)) try {
          window.localStorage.setItem(oe(a3, u, s), JSON.stringify(xe(t, n, o2)));
        } catch {
        }
      };
      var Q = (e, r3) => r3 === "A" ? e.currentMatch?.participantA ?? null : e.currentMatch?.participantB ?? null;
      var ke = (e, r3) => {
        const t = i4(e.currentUser?.id), n = i4(e.currentUser?.username);
        if (!r3) return null;
        for (const o2 of r3.juryEntries) if (t && o2.scorerId === t || n && o2.scorerUsername === n) return o2;
        return null;
      };
      var ie = (e, r3) => {
        const t = e.roundTabs;
        if (!(t instanceof HTMLElement)) return;
        const n = Array.from(r3.matches.reduce((o2, a3) => {
          const s = ae(a3);
          return o2.has(s) || o2.set(s, { key: s, label: fe(a3), sortValue: a3.roundNumber > 0 ? a3.roundNumber : Number.MAX_SAFE_INTEGER }), o2;
        }, /* @__PURE__ */ new Map()).values()).sort((o2, a3) => o2.sortValue !== a3.sortValue ? o2.sortValue - a3.sortValue : o2.label.localeCompare(a3.label, "en", { sensitivity: "base" }));
        r3.selectedRound && !n.some((o2) => o2.key === r3.selectedRound) && (r3.selectedRound = null), t.innerHTML = [{ key: "", label: "All rounds" }, ...n.map((o2) => ({ key: o2.key, label: o2.label }))].map((o2) => {
          const a3 = (r3.selectedRound ?? "") === o2.key;
          return `
        <button
          type="button"
          data-round-key="${o2.key}"
          class="border px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-colors ${a3 ? "border-white bg-white text-black" : "border-white/20 bg-transparent text-white/70 hover:border-white/50 hover:text-white"}"
        >
          ${o2.label}
        </button>
      `;
        }).join("");
      };
      var B2 = (e, r3) => {
        const t = h2(e.search?.value).toLowerCase(), n = r3.selectedRound;
        r3.filteredMatches = r3.matches.filter((o2) => n && ae(o2) !== n ? false : t ? [o2.id, o2.roundTitle, o2.roundNumber, o2.order, o2.participantA?.name, o2.participantA?.id, o2.participantB?.name, o2.participantB?.id, o2.status].map((s) => String(s ?? "").toLowerCase()).join(" ").includes(t) : true);
      };
      var L = (e, r3) => {
        const t = e.matchesList;
        if (t instanceof HTMLElement) {
          if (r3.filteredMatches.length === 0) {
            t.innerHTML = "<p class='text-sm text-white/30'>No matches found for the current filters.</p>";
            return;
          }
          t.innerHTML = r3.filteredMatches.map((n) => {
            const o2 = r3.selectedMatchId === n.id;
            return `
        <button
          type="button"
          data-match-id="${n.id}"
          class="w-full border text-left p-4 transition-colors ${o2 ? "border-white bg-white text-black" : "border-white/10 bg-white/[0.02] text-white hover:border-white/40"}"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] uppercase tracking-[0.15em] ${o2 ? "text-black/60" : "text-white/40"}">
                ${n.roundTitle}
              </p>
              <p class="mt-2 text-sm">
                Match ${n.order}
              </p>
            </div>
            <p class="text-[11px] uppercase tracking-[0.15em] ${o2 ? "text-black/60" : "text-white/30"}">
              ${n.status}
            </p>
          </div>
          <p class="mt-3 text-sm ${o2 ? "text-black/85" : "text-white/75"}">
            ${b(n.participantA)} vs ${b(n.participantB)}
          </p>
        </button>
      `;
          }).join("");
        }
      };
      var Ue = (e, r3) => {
        const t = i4(e.currentUser?.id);
        return !t || !r3 ? false : t === r3.participantA?.id || t === r3.participantB?.id;
      };
      var R = (e, r3, t) => {
        const n = r3.get(t);
        if (n) {
          for (const o2 of S2) {
            const a3 = e.criteria[t][o2];
            n.inputs[o2].value = String(a3), n.values[o2].textContent = String(a3);
          }
          n.comment.value = e.comments[t], n.yourRating.textContent = String(de(e.criteria[t]));
        }
      };
      var Be = (e, r3, t) => t?.id ? t.submission?.id ? Ue(e, e.currentMatch) ? "You cannot judge your own match." : e.submitting[r3] ? "Publishing jury score..." : "" : "Submission is not available yet." : "Match participant is not assigned yet.";
      var Re = (e, r3, t) => {
        const n = e.get(t);
        n && (n.publish.textContent = r3.published[t] ? "Update Jury Score" : "Publish Jury Score");
      };
      var T2 = (e, r3, t, n) => {
        const o2 = r3.get(t);
        if (!o2) return;
        const a3 = Be(e, t, n), s = a3.length > 0;
        for (const l2 of S2) l(o2.inputs[l2], s);
        if (l(o2.comment, s), o2.publish.disabled = s, o2.publish.title = a3, Re(r3, e, t), e.submitting[t]) {
          d(o2.status, "Publishing jury score...", "neutral");
          return;
        }
        if (e.published[t]) {
          d(o2.status, "Jury score saved.", "ok");
          return;
        }
        const u = o2.status.textContent?.trim() ?? "";
        (!u || u === "Publishing jury score..." || u === "Jury score saved.") && d(o2.status, "", "neutral");
      };
      var ee = (e, r3, t) => {
        const n = e.get(r3);
        if (!n) return;
        const o2 = t?.name ?? "TBD";
        n.name.textContent = o2, Te(n.socials, t), n.description.textContent = t?.submission?.description?.trim() || "No description yet.", n.usersAverage.textContent = W(t?.audienceAverage), n.juryAverage.textContent = W(t?.juryAverage);
        const a3 = t?.avatarUrl?.trim() || "";
        a3 ? (n.avatarImage.src = a3, n.avatarImage.alt = `${o2} avatar`, n.avatarImage.classList.remove("hidden"), n.avatarFallback.classList.add("hidden")) : (n.avatarImage.src = "", n.avatarImage.alt = "", n.avatarImage.classList.add("hidden"), n.avatarFallback.classList.remove("hidden"), n.avatarFallback.textContent = Le(o2));
        const s = t?.submission?.embedUrl?.trim() || "";
        s ? (n.videoFrame.src = s, n.videoFrame.classList.remove("hidden"), n.videoPlaceholder.classList.add("hidden")) : (n.videoFrame.src = "", n.videoFrame.classList.add("hidden"), n.videoPlaceholder.classList.remove("hidden"), n.videoPlaceholder.textContent = t?.submission ? "Video unavailable" : "Submission not available yet");
      };
      var te = (e, r3, t) => {
        const n = ke(e, t), o2 = je(e, t);
        if (n?.criteria) {
          e.criteria[r3] = k(n.criteria), e.comments[r3] = n.comment ?? "", e.published[r3] = true;
          return;
        }
        if (o2) {
          e.criteria[r3] = k(o2.criteria), e.comments[r3] = o2.comment, e.published[r3] = o2.published;
          return;
        }
        e.criteria[r3] = I2(), e.comments[r3] = "", e.published[r3] = false;
      };
      var N = (e, r3, t) => {
        const n = t.currentMatch;
        if (!n) {
          r2(e.matchEmpty), i3(e.matchPanel);
          return;
        }
        i3(e.matchEmpty), r2(e.matchPanel), o(e.roundTitle, n.round.title), o(e.roundMeta, [`Round ${n.round.roundNumber}`, `Match ${n.match.order}`, n.match.status ? `Status: ${n.match.status}` : "", n.round.conditions ? `Conditions: ${n.round.conditions}` : ""].filter(Boolean).join(" \xB7 ")), te(t, "A", n.participantA), te(t, "B", n.participantB), ee(r3, "A", n.participantA), ee(r3, "B", n.participantB), R(t, r3, "A"), R(t, r3, "B"), T2(t, r3, "A", n.participantA), T2(t, r3, "B", n.participantB);
      };
      var w2 = async (e, r3, t, n) => {
        const o2 = ++t.detailRequestId;
        t.selectedMatchId = n, d(e.globalStatus, "Loading match...", "neutral"), L(e, t);
        try {
          const a3 = await Ie(t.token, n);
          if (o2 !== t.detailRequestId) return;
          t.currentMatch = a3, N(e, r3, t), d(e.globalStatus, "", "neutral");
        } catch (a3) {
          if (o2 !== t.detailRequestId) return;
          t.currentMatch = null, N(e, r3, t);
          const s = a3 instanceof Error ? a3.message : "Could not load match.";
          d(e.globalStatus, s, "err");
        }
      };
      var Ne = async (e, r3, t, n) => {
        const o2 = t.currentMatch, a3 = n === "A" ? o2?.participantA : o2?.participantB, s = i4(a3?.submission?.id), u = i4(o2?.id);
        if (!s || !u) {
          const l2 = r3.get(n)?.status;
          d(l2, "Submission is not available yet.", "err");
          return;
        }
        t.submitting[n] = true, T2(t, r3, n, a3 ?? null);
        try {
          const l2 = t.comments[n].trim();
          await i2(i.scores.jury, { method: "POST", token: t.token, body: { matchId: u, submissionId: s, criteria: t.criteria[n], ...l2 ? { comment: l2 } : {} } }), U2(t, a3 ?? null, t.criteria[n], t.comments[n], true), t.published[n] = true, d(r3.get(n)?.status, "Jury score saved.", "ok"), await w2(e, r3, t, u);
        } catch (l2) {
          const E2 = l2 instanceof Error ? l2.message : "Could not publish jury score.";
          d(r3.get(n)?.status, E2, "err");
        } finally {
          t.submitting[n] = false, T2(t, r3, n, a3 ?? null);
        }
      };
      var Ce = (e, r3, t) => {
        for (const n of ["A", "B"]) {
          const o2 = r3.get(n);
          if (o2) {
            for (const a3 of S2) o2.inputs[a3].addEventListener("input", () => {
              t.criteria[n][a3] = Number(o2.inputs[a3].value) || 0, R(t, r3, n), U2(t, Q(t, n), t.criteria[n], t.comments[n], false), t.published[n] && d(o2.status, "Unsaved changes.", "neutral");
            });
            o2.comment.addEventListener("input", () => {
              t.comments[n] = o2.comment.value, U2(t, Q(t, n), t.criteria[n], t.comments[n], false), t.published[n] && d(o2.status, "Unsaved changes.", "neutral");
            }), o2.form.addEventListener("submit", (a3) => {
              a3.preventDefault(), Ne(e, r3, t, n);
            });
          }
        }
      };
      var $e = (e, r3, t) => {
        e.matchesList?.addEventListener("click", (n) => {
          const o2 = n.target;
          if (!(o2 instanceof Element)) return;
          const a3 = o2.closest("[data-match-id]"), s = i4(a3?.dataset.matchId);
          !s || s === t.selectedMatchId || w2(e, r3, t, s);
        });
      };
      var Pe = (e, r3, t) => {
        e.search?.addEventListener("input", () => {
          B2(e, t), L(e, t);
        }), e.roundTabs?.addEventListener("click", (n) => {
          const o2 = n.target;
          if (!(o2 instanceof Element)) return;
          const a3 = o2.closest("[data-round-key]");
          if (!a3) return;
          const s = h2(a3.dataset.roundKey) || null;
          if (t.selectedRound === s || (t.selectedRound = s, ie(e, t), B2(e, t), L(e, t), t.filteredMatches.some((l2) => l2.id === t.selectedMatchId))) return;
          const u = t.filteredMatches[0]?.id ?? null;
          if (!u) {
            t.selectedMatchId = null, t.currentMatch = null, N(e, r3, t), d(e.globalStatus, "", "neutral");
            return;
          }
          w2(e, r3, t, u);
        });
      };
      var He = (e, r3, t) => {
        const n = e.loadButton;
        n instanceof HTMLButtonElement && n.addEventListener("click", async () => {
          n.disabled = true, n.textContent = "Loading...", o(e.matchesList, "Loading matches...");
          try {
            t.matches = await Ae(t.token), ie(e, t), B2(e, t), L(e, t), !t.selectedMatchId && t.filteredMatches[0]?.id ? await w2(e, r3, t, t.filteredMatches[0].id) : t.selectedMatchId && t.matches.some((o2) => o2.id === t.selectedMatchId) && await w2(e, r3, t, t.selectedMatchId);
          } catch (o2) {
            const a3 = o2 instanceof Error ? o2.message : "Could not load matches.";
            o(e.matchesList, a3);
          } finally {
            n.disabled = false, n.textContent = "Load Matches";
          }
        });
      };
      var qe = async () => {
        const e = be();
        if (!e) return;
        const r3 = v();
        if (!r3) {
          B("/judge");
          return;
        }
        const t = he();
        if (t.size !== 2) {
          Y(e, "Judge form is not mounted correctly.");
          return;
        }
        const n = { token: r3, currentUser: null, matches: [], filteredMatches: [], selectedRound: null, selectedMatchId: null, currentMatch: null, criteria: { A: I2(), B: I2() }, comments: { A: "", B: "" }, published: { A: false, B: false }, submitting: { A: false, B: false }, detailRequestId: 0 };
        Ce(e, t, n), $e(e, t, n), Pe(e, t, n), He(e, t, n);
        try {
          const o2 = await pe(r3);
          if (n.currentUser = o2, T(o2), o2.role !== "JURY" && o2.role !== "ADMIN") {
            ye(e);
            return;
          }
          ge(e), e.loadButton?.click();
        } catch (o2) {
          if (o2 instanceof m && (o2.status === 401 || o2.status === 403)) {
            I(), B("/judge");
            return;
          }
          const a3 = o2 instanceof Error ? o2.message : "Could not load judge page.";
          Y(e, a3);
        }
      };
      function Fe() {
        qe();
      }
      typeof window < "u" && Fe();
    }
  });

  // _astro/_entry_judge.js
  var require_entry_judge = __commonJS({
    "_astro/_entry_judge.js"() {
      var import_judge_astro_astro_type_script_index_0_lang_CaRAhbzU = __toESM(require_judge_astro_astro_type_script_index_0_lang_CaRAhbzU());
    }
  });
  require_entry_judge();
})();
