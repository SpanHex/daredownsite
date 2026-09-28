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
    } catch (e2) {
      throw err = [e2], e2;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e2) {
      throw mod = 0, e2;
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
      i = { health: "/health", siteSettings: "/site-settings", media: { instagramPreview: "/media/instagram-preview" }, auth: { discord: "/auth/discord", discordStart: "/auth/discord/start", discordCallback: "/auth/discord/callback", me: "/auth/me", logout: "/auth/logout" }, applications: { root: "/applications", me: "/applications/me", byId: (s2) => `/applications/${s2}` }, ngc: { submissions: "/ngc/submissions", mySubmission: "/ngc/submissions/me" }, scores: { public: "/scores/public", user: "/scores/user", userMe: (s2) => `/scores/user/me/${s2}`, jury: "/scores/jury" }, participant: { submissions: "/participant/submissions", submission: (s2) => `/participant/submissions/${s2}`, submissionsMe: "/participant/submissions/me", dashboardMe: "/participant/dashboard/me", historyMe: "/participant/history/me", profileMe: "/participant/profile/me", scores: (s2) => `/participant/scores/${s2}` }, tournament: { bracket: "/tournament/bracket", matchPublicDetailed: (s2) => `/tournament/matches/${s2}/publicDetailed`, matchCriteriaAverages: (s2) => `/tournament/matches/${s2}/criteriaAverages`, submissionsByRound: (s2) => `/tournament/submissions/${s2}` }, admin: { users: "/admin/users", userRole: (s2) => `/admin/users/${s2}/role`, userRoleByDiscordId: (s2) => `/admin/users/discord/${s2}/role`, applications: "/admin/applications", ngcSubmissions: "/admin/ngc-submissions", ngcSubmission: (s2) => `/admin/ngc-submissions/${s2}`, rounds: "/admin/rounds", roundSettings: (s2) => `/admin/rounds/${s2}/settings`, matches: "/admin/matches", matchParticipants: (s2) => `/admin/matches/${s2}/participants`, matchScores: (s2) => `/admin/matches/${s2}/scores`, userScore: (s2) => `/admin/scores/user/${s2}`, matchNicknames: (s2) => `/admin/matches/${s2}/nicknames`, matchWinner: (s2) => `/admin/matches/${s2}/winner`, roundAssignments: "/admin/round-assignments", roundAssignment: (s2) => `/admin/round-assignments/${s2}`, placements: "/admin/placements", submissions: "/admin/submissions", submission: (s2) => `/admin/submissions/${s2}`, siteSettings: "/admin/site-settings", siteSettingsVideo: "/admin/site-settings/background-video" } };
    }
  });

  // _astro/site-settings.CKBpDEDM.js
  var import_meta, p, d, L, y, l, r, R, A, _, N, S, w, C, f, D, O, s, P, B, k, h, b, U, z, H, u, F, $;
  var init_site_settings_CKBpDEDM = __esm({
    "_astro/site-settings.CKBpDEDM.js"() {
      init_api_paths_BeHY0xnA();
      import_meta = {};
      p = { ASSETS_PREFIX: void 0, BASE_URL: "/", DEV: false, MODE: "production", PROD: true, PUBLIC_API_BASE_URL: "", SITE: "https://nwgn.art", SSR: false };
      d = "site-settings:cache:v1";
      L = "/site-settings";
      y = 6e4;
      l = (e2) => typeof e2 == "object" && e2 !== null;
      r = (e2, t = "") => typeof e2 == "string" ? e2 : t;
      R = (e2) => {
        try {
          const t = new URL(e2), n = t.hostname.toLowerCase();
          if (n === "youtu.be") return t.pathname.split("/").filter(Boolean)[0] ?? "";
          if (n === "youtube.com" || n === "www.youtube.com" || n === "m.youtube.com") {
            if (t.pathname === "/watch") return t.searchParams.get("v") ?? "";
            const [, i5, a4] = t.pathname.split("/");
            if (i5 === "embed" || i5 === "shorts" || i5 === "live") return a4 ?? "";
          }
        } catch {
          return "";
        }
        return "";
      };
      A = (e2) => {
        const t = R(e2);
        return t ? `https://i.ytimg.com/vi/${t}/hqdefault.jpg` : "";
      };
      _ = (e2) => {
        try {
          const t = new URL(e2), n = t.hostname.toLowerCase();
          if (n !== "streamable.com" && n !== "www.streamable.com" && n !== "m.streamable.com") return "";
          const i5 = t.pathname.split("/").filter(Boolean);
          if (i5.length === 0) return "";
          const a4 = i5[0] === "e" || i5[0] === "s" ? i5[1] : i5[0];
          return /^[A-Za-z0-9]+$/.test(a4 ?? "") ? a4 ?? "" : "";
        } catch {
          return "";
        }
      };
      N = (e2) => {
        const t = _(e2);
        return t ? `https://cdn-cf-east.streamable.com/image/${t}.jpg` : "";
      };
      S = (e2) => {
        try {
          const t = new URL(e2), n = t.hostname.toLowerCase();
          if (n !== "instagram.com" && n !== "www.instagram.com" && n !== "m.instagram.com") return "";
          const [i5, a4] = t.pathname.split("/").filter(Boolean);
          return i5 !== "p" && i5 !== "reel" && i5 !== "reels" && i5 !== "tv" ? "" : /^[A-Za-z0-9_-]+$/.test(a4 ?? "") ? a4 ?? "" : "";
        } catch {
          return "";
        }
      };
      w = (e2) => S(e2) ? `${b()}${i.media.instagramPreview}?url=${encodeURIComponent(e2)}` : "";
      C = (e2) => Array.isArray(e2) ? e2.filter(l).map((t) => ({ name: r(t.name).trim(), link: r(t.link).trim() })).filter((t) => t.name.length > 0) : [];
      f = [{ place: "first", name: "walsii", title: "CHAMPION", link: "" }, { place: "second", name: "goof", title: "RUNNER-UP", link: "" }, { place: "third", name: "fuze", title: "TOP 3", link: "" }];
      D = (e2) => e2 === "first" || e2 === "second" || e2 === "third";
      O = (e2) => {
        if (!Array.isArray(e2)) return [...f];
        const t = /* @__PURE__ */ new Map();
        return e2.filter(l).forEach((n) => {
          D(n.place) && t.set(n.place, { place: n.place, name: r(n.name).trim(), title: r(n.title).trim(), link: r(n.link).trim() });
        }), f.map((n) => {
          const i5 = t.get(n.place);
          return { ...n, ...i5 ?? {}, place: n.place, name: i5?.name || n.name, title: i5?.title || n.title, link: i5?.link || "" };
        });
      };
      s = { headingAccent: "NGC", heading: "WINNER", winnerPlace: "1ST PLACE", winnerName: "@SHADOWCTRL", winnerVideoUrl: "", winnerThumbnailUrl: "", restrictionLabel: "RESTRICTION", restriction: "USED RESTRICTION", prizeLabel: "PRIZE", prize: "$200", mentionsTitle: "HONORABLE MENTIONS", mentions: [{ name: "@VOIDEDITS", title: "BLOOD MOON", url: "", thumbnailUrl: "" }, { name: "@KXRA.AE", title: "FALLEN", url: "", thumbnailUrl: "" }, { name: "@YUUTAA", title: "CHAOS THEORY", url: "", thumbnailUrl: "" }, { name: "@XENZ.VFX", title: "ECLIPSE", url: "", thumbnailUrl: "" }, { name: "@RIPTIDEEDITZ", title: "B BIT HEART", url: "", thumbnailUrl: "" }, { name: "@ZORO.AM", title: "NO SLEEP", url: "", thumbnailUrl: "" }] };
      P = (e2) => {
        if (!l(e2)) return null;
        const t = r(e2.url).trim(), n = r(e2.thumbnailUrl).trim(), i5 = w(t) || w(n), a4 = (n && !S(n) ? n : "") || A(t) || N(t) || i5, o2 = { name: r(e2.name).trim(), title: r(e2.title).trim(), url: t, thumbnailUrl: a4 };
        return o2.name || o2.title || o2.url ? o2 : null;
      };
      B = (e2) => {
        const t = l(e2) ? e2 : {}, n = r(t.winnerVideoUrl).trim() || s.winnerVideoUrl, i5 = Array.isArray(t.mentions) ? t.mentions.map(P).filter((a4) => a4 !== null) : [...s.mentions];
        return { headingAccent: r(t.headingAccent).trim() || s.headingAccent, heading: r(t.heading).trim() || s.heading, winnerPlace: r(t.winnerPlace).trim() || s.winnerPlace, winnerName: r(t.winnerName).trim() || s.winnerName, winnerUrl: r(t.winnerUrl).trim(), winnerVideoUrl: n, winnerThumbnailUrl: r(t.winnerThumbnailUrl).trim() || A(n) || s.winnerThumbnailUrl, restrictionLabel: r(t.restrictionLabel).trim() || s.restrictionLabel, restriction: r(t.restriction).trim() || s.restriction, prizeLabel: r(t.prizeLabel).trim() || s.prizeLabel, prize: r(t.prize).trim() || s.prize, mentionsTitle: r(t.mentionsTitle).trim() || s.mentionsTitle, mentions: i5 };
      };
      k = (e2) => Array.isArray(e2) ? e2.filter(l).map((t, n) => {
        const i5 = l(t.judge) ? t.judge : {};
        return { id: r(t.id, String(n + 1)), duration: r(t.duration), duration_amount: r(t.duration_amount), judge: { duration: r(i5.duration), duration_amount: r(i5.duration_amount) } };
      }) : [];
      h = (e2) => {
        const t = l(e2) ? e2 : {};
        return { timerIso: t.timerIso == null ? null : r(t.timerIso).trim() || null, timerHeaderText: t.timerHeaderText == null ? null : r(t.timerHeaderText).trim() || null, ngcDeadlineIso: t.ngcDeadlineIso == null ? null : r(t.ngcDeadlineIso).trim() || null, tournamentBracketHidden: !!t.tournamentBracketHidden, description: t.description == null ? null : r(t.description).trim() || null, subDescription: t.subDescription == null ? null : r(t.subDescription).trim() || null, backgroundVideoFilename: t.backgroundVideoFilename == null ? null : r(t.backgroundVideoFilename).trim() || null, backgroundVideoUrl: t.backgroundVideoUrl == null ? null : r(t.backgroundVideoUrl).trim() || null, rounds: k(t.rounds), specialThanks: C(t.specialThanks), winners: O(t.winners), ngcResults: B(t.ngcResults), updatedAt: r(t.updatedAt).trim() || (/* @__PURE__ */ new Date(0)).toISOString() };
      };
      b = (e2) => {
        const t = document.body?.dataset.apiBaseUrl, n = typeof import_meta < "u" && p && "PUBLIC_API_BASE_URL" in p ? "" : void 0;
        return (e2 ?? t ?? n ?? "http://localhost:3000").replace(/\/$/, "");
      };
      U = (e2) => {
        try {
          const t = localStorage.getItem(e2);
          if (!t) return null;
          const n = JSON.parse(t);
          return !l(n) || !l(n.data) || typeof n.fetchedAt != "number" ? null : { data: h(n.data), fetchedAt: n.fetchedAt };
        } catch {
          return null;
        }
        if (typeof window != "undefined" && window.__SITE_SETTINGS) return { data: h(window.__SITE_SETTINGS), fetchedAt: Date.now() };
        return null;
      };
      z = (e2, t) => {
        try {
          localStorage.setItem(e2, JSON.stringify(t));
        } catch {
        }
      };
      H = (e2 = d) => U(e2);
      u = (e2) => {
        window.dispatchEvent(new CustomEvent("siteSettings:loaded", { detail: e2 }));
      };
      F = (e2) => {
        const t = (n) => {
          const a4 = h(n.detail);
          e2(a4, { fromCache: false, fetchedAt: Date.now() });
        };
        return window.addEventListener("siteSettings:loaded", t), () => window.removeEventListener("siteSettings:loaded", t);
      };
      $ = async (e2 = {}) => {
        const t = e2.cacheKey ?? d, n = e2.endpoint ?? L, i5 = e2.ttlMs ?? y, a4 = Date.now(), o2 = U(t);
        if (!e2.forceRefresh && o2 && a4 - o2.fetchedAt <= i5) return u(o2.data), { settings: o2.data, fromCache: true, fetchedAt: o2.fetchedAt };
        const T = b(e2.apiBaseUrl);
        let c;
        try {
          c = await fetch(`${T}${n}`, { headers: { Accept: "application/json" }, signal: e2.signal });
        } catch (err) {
          if (o2) return u(o2.data), { settings: o2.data, fromCache: true, fetchedAt: o2.fetchedAt };
          if (typeof window != "undefined" && window.__SITE_SETTINGS) {
            const m3 = h(window.__SITE_SETTINGS);
            return u(m3), { settings: m3, fromCache: true, fetchedAt: Date.now() };
          }
          throw err;
        }
        if (!c.ok) {
          if (o2) return u(o2.data), { settings: o2.data, fromCache: true, fetchedAt: o2.fetchedAt };
          if (typeof window != "undefined" && window.__SITE_SETTINGS) {
            const m3 = h(window.__SITE_SETTINGS);
            return u(m3), { settings: m3, fromCache: true, fetchedAt: Date.now() };
          }
          throw new Error(`Failed to load site settings: ${c.status}`);
        }
        const E2 = await c.json(), m2 = h(E2), g = { data: m2, fetchedAt: Date.now() };
        return z(t, g), u(m2), { settings: m2, fromCache: false, fetchedAt: g.fetchedAt };
      };
    }
  });

  // _astro/Winners.astro_astro_type_script_index_0_lang.9ape3wy-.js
  var require_Winners_astro_astro_type_script_index_0_lang_9ape3wy = __commonJS({
    "_astro/Winners.astro_astro_type_script_index_0_lang.9ape3wy-.js"() {
      init_site_settings_CKBpDEDM();
      var o2 = ["first", "second", "third"];
      var a4 = (t) => typeof t == "string" ? t.trim() : "";
      var l2 = (t) => {
        if (!t || !o2.includes(t.place)) return;
        const e2 = document.querySelector(`[data-winner-name][data-winner-place="${t.place}"]`), r3 = document.querySelector(`[data-winner-title][data-winner-place="${t.place}"]`);
        if (e2 instanceof HTMLAnchorElement) {
          typeof t.name == "string" && t.name.trim() && (e2.textContent = t.name.trim());
          const n = a4(t.link);
          n ? (e2.href = n, e2.target = "_blank", e2.rel = "noopener noreferrer") : (e2.removeAttribute("href"), e2.removeAttribute("target"), e2.removeAttribute("rel"));
        }
        r3 instanceof HTMLElement && typeof t.title == "string" && t.title.trim() && (r3.textContent = t.title.trim());
      };
      F((t) => {
        Array.isArray(t.winners) && t.winners.forEach(l2);
      });
    }
  });

  // _astro/http.BUnDBjdO.js
  async function i2(t, e2 = {}) {
    const n = e2.method ?? "GET", c = E(e2.baseUrl), g = U2(c, t), o2 = new Headers(e2.headers);
    o2.set("Accept", "application/json"), e2.token && o2.set("Authorization", `Bearer ${e2.token}`);
    const l2 = e2.body !== void 0;
    l2 && o2.set("Content-Type", "application/json");
    const s2 = await fetch(g, { method: n, headers: o2, body: l2 ? JSON.stringify(e2.body) : void 0, signal: e2.signal }), u2 = await _2(s2);
    if (!s2.ok) {
      const d2 = u2;
      throw new m(s2.status, w2(s2.status, d2), d2);
    }
    return u2;
  }
  var import_meta2, p2, a, r2, v, A2, h2, B2, f2, m, S2, y2, E, _2, w2, U2;
  var init_http_BUnDBjdO = __esm({
    "_astro/http.BUnDBjdO.js"() {
      import_meta2 = {};
      p2 = "ngt_token";
      a = "ngt_user";
      r2 = () => typeof window < "u" && typeof localStorage < "u";
      v = () => {
        if (!r2()) return null;
        const t = localStorage.getItem(p2)?.trim() ?? "";
        return t.length > 0 ? t : null;
      };
      A2 = () => {
        if (!r2()) return null;
        const t = localStorage.getItem(a);
        if (!t) return null;
        try {
          const e2 = JSON.parse(t);
          return !e2 || typeof e2 != "object" ? null : e2;
        } catch {
          return null;
        }
      };
      h2 = (t = "/", e2 = "/login") => {
        const n = t.startsWith("/") ? t : "/";
        return `${e2}?next=${encodeURIComponent(n)}`;
      };
      B2 = (t = "/", e2 = "/login") => {
        if (!r2()) return;
        const n = h2(t, e2);
        window.location.replace(n);
      };
      f2 = { ASSETS_PREFIX: void 0, BASE_URL: "/", DEV: false, MODE: "production", PROD: true, PUBLIC_API_BASE_URL: "", SITE: "https://nwgn.art", SSR: false };
      m = class extends Error {
        status;
        payload;
        constructor(e2, n, c) {
          super(n), this.name = "HttpError", this.status = e2, this.payload = c;
        }
      };
      S2 = "http://localhost:3000";
      y2 = (t) => t.replace(/\/+$/, "");
      E = (t) => {
        const e2 = typeof document < "u" ? document.body?.dataset.apiBaseUrl : void 0, n = typeof import_meta2 < "u" && f2 && "PUBLIC_API_BASE_URL" in f2 ? "" : void 0;
        return y2(t ?? e2 ?? n ?? S2);
      };
      _2 = async (t) => {
        if ((t.headers.get("content-type") ?? "").includes("application/json")) try {
          return await t.json();
        } catch {
          return;
        }
      };
      w2 = (t, e2) => {
        const n = e2?.message ?? e2?.error;
        return typeof n == "string" && n.trim().length > 0 ? n : `Request failed with status ${t}`;
      };
      U2 = (t, e2) => e2.startsWith("/") ? `${t}${e2}` : `${t}/${e2}`;
    }
  });

  // _astro/text.DgeDZjdf.js
  var e, a2, o, i3;
  var init_text_DgeDZjdf = __esm({
    "_astro/text.DgeDZjdf.js"() {
      e = (s2) => String(s2).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      a2 = (s2) => s2.trim().split(/\s+/).filter(Boolean);
      o = (s2, r3 = 0, n = {}) => {
        const l2 = n.clipClass ?? "word-clip", c = n.innerClass ?? "word-inner";
        return a2(s2).map((t, p3) => `<span class="${e(l2)}" style="--word-index:${r3 + p3};"><span class="${e(c)}">${e(t)}</span></span>`).join("");
      };
      i3 = (s2) => a2(s2).length;
    }
  });

  // _astro/Bracket.astro_astro_type_script_index_0_lang.By8uBWsx.js
  var require_Bracket_astro_astro_type_script_index_0_lang_By8uBWsx = __commonJS({
    "_astro/Bracket.astro_astro_type_script_index_0_lang.By8uBWsx.js"() {
      init_http_BUnDBjdO();
      init_site_settings_CKBpDEDM();
      init_text_DgeDZjdf();
      var p3 = (l2) => {
        const g = document.getElementById(l2);
        return g instanceof HTMLElement ? g : null;
      };
      var f3 = p3("bracket-shell");
      var L2 = p3("bracket-status");
      var T = p3("bracket-content");
      var R2 = p3("bracket-stub");
      var H2 = p3("bracket-viewport");
      var b2 = p3("bracket-stage");
      if (f3 instanceof HTMLElement && L2 instanceof HTMLElement && T instanceof HTMLElement && R2 instanceof HTMLElement && H2 instanceof HTMLElement && b2 instanceof HTMLElement) {
        const l2 = (f3.dataset.stubMode ?? "auto").trim().toLowerCase(), g = l2 === "on" || l2 === "true" || l2 === "1", G = l2 === "off" || l2 === "false" || l2 === "0", U3 = f3.dataset.emptyText ?? "Bracket is not available yet.";
        let h3 = Math.max(1, Number.parseInt(f3.dataset.totalRounds ?? "4", 10) || 4), V = Math.max(2, Number.parseInt(f3.dataset.totalParticipants ?? "16", 10) || 16);
        const j = () => String(A2()?.role ?? "").toUpperCase() === "ADMIN", F2 = () => "Bracket is hidden right now.", S3 = (t, e2 = "neutral") => {
          L2.textContent = t, L2.className = "text-[10px] md:text-xs uppercase tracking-[0.2em] text-center " + (e2 === "ok" ? "text-white/32" : e2 === "err" ? "text-red-300" : "text-white/45");
        }, v2 = (t) => {
          S3(t, "neutral"), R2.classList.remove("hidden"), T.classList.add("hidden");
        }, W = () => {
          S3("", "ok"), T.classList.remove("hidden"), R2.classList.add("hidden");
        };
        let B3 = 0;
        const k2 = () => {
          window.requestAnimationFrame(() => {
            const t = b2.scrollWidth > H2.clientWidth + 1;
            H2.dataset.scrollable = t ? "true" : "false";
          });
        }, u2 = () => {
          k2(), window.requestAnimationFrame(() => k2()), window.requestAnimationFrame(() => window.requestAnimationFrame(() => k2())), B3 && window.clearTimeout(B3), B3 = window.setTimeout(() => {
            k2();
          }, 140);
        }, I = (t) => {
          const e2 = t?.nickname?.trim(), r3 = t?.username?.trim();
          return e2 || r3 || "TBD";
        }, D2 = (t) => t?.avatar?.trim() || t?.avatarUrl?.trim() || "", E2 = (t, e2 = 0) => {
          if (typeof t == "number" && Number.isFinite(t)) return Math.trunc(t);
          const r3 = Number.parseInt(String(t ?? "").trim(), 10);
          return Number.isFinite(r3) ? r3 : e2;
        }, x = (t) => {
          if (!t || typeof t != "object") return null;
          const e2 = t, r3 = String(e2.id ?? "").trim(), n = String(e2.username ?? "").trim(), i5 = String(e2.nickname ?? "").trim() || null, o2 = String(e2.avatar ?? "").trim() || String(e2.avatarUrl ?? "").trim() || null;
          return !r3 && !n && !i5 && !o2 ? null : { id: r3, username: n, nickname: i5, avatar: o2, avatarUrl: o2 };
        }, _3 = (t, e2, r3) => {
          if (!t || typeof t != "object") return null;
          const n = t, i5 = String(n.id ?? "").trim();
          if (!i5) return null;
          const o2 = (a4) => {
            if (a4 == null || a4 === "") return null;
            if (typeof a4 == "number" && Number.isFinite(a4)) return a4;
            const s2 = Number(a4);
            return Number.isFinite(s2) ? s2 : null;
          };
          return { id: i5, roundNumber: E2(n.roundNumber, e2), order: E2(n.order, r3), participantA: x(n.participantA), participantB: x(n.participantB), winnerId: String(n.winnerId ?? "").trim() || null, scoreA: o2(n.scoreA), scoreB: o2(n.scoreB), status: String(n.status ?? "PENDING").trim() === "FINISHED" ? "FINISHED" : "PENDING" };
        }, J = (t) => {
          let B4 = Array.isArray(t.rounds) ? t.rounds : Array.isArray(t.data?.rounds) ? t.data.rounds : [];
          if (h3 === 4 && B4.length >= 5) B4 = B4.slice(-4);
          return B4.map((r3, n) => {
            if (!r3 || typeof r3 != "object") return null;
            const i5 = r3, o2 = n + 1, a4 = Array.isArray(i5.matches) ? i5.matches : [];
            return { roundNumber: o2, title: String(i5.title ?? "").trim() || M(o2), matches: a4.map((s2, c) => _3(s2, o2, c + 1)).filter((s2) => !!s2) };
          }).filter((r3) => !!r3);
        }, w3 = (t, e2) => ({ id: `placeholder-${t}-${e2}`, roundNumber: t, order: e2, participantA: null, participantB: null, winnerId: null, scoreA: null, scoreB: null, status: "PENDING" }), z2 = (t) => Math.max(1, V / 2 ** t), M = (t) => t === h3 ? "Final" : t === h3 - 1 ? "Semifinal" : t === h3 - 2 ? "Quarterfinal" : `Round ${t}`, Q = (t, e2, r3) => {
          const n = /* @__PURE__ */ new Map(), i5 = r3.slice().sort((a4, s2) => (a4.order ?? 0) - (s2.order ?? 0)), o2 = (a4, s2) => !Number.isInteger(a4) || a4 < 1 || a4 > e2 || n.has(a4) ? false : (n.set(a4, s2), true);
          for (const a4 of i5) if (!o2(Number(a4.order ?? 0), a4)) for (let s2 = 1; s2 <= e2 && !o2(s2, a4); s2 += 1) ;
          return Array.from({ length: e2 }, (a4, s2) => n.get(s2 + 1) ?? w3(t, s2 + 1));
        }, K = (t) => {
          const e2 = /* @__PURE__ */ new Map();
          for (const n of t) typeof n?.roundNumber == "number" && e2.set(n.roundNumber, n);
          const r3 = [];
          for (let n = 1; n <= h3; n += 1) {
            const i5 = e2.get(n), o2 = Array.isArray(i5?.matches) ? i5.matches.slice().sort((c, m2) => (c.order ?? 0) - (m2.order ?? 0)) : [], a4 = z2(n), s2 = Q(n, a4, o2);
            r3.push({ roundNumber: n, title: i5?.title?.trim() || M(n), matches: s2 });
          }
          return r3;
        }, $2 = (t, e2 = "regular") => {
          const r3 = I(t.participantA), n = I(t.participantB), i5 = D2(t.participantA), o2 = D2(t.participantB), a4 = !t.participantA && !t.participantB, s2 = !t.id.startsWith("placeholder-") && !!(t.participantA || t.participantB), c = `Open match ${r3} versus ${n}`, m2 = s2 ? `data-vs-trigger="true" data-match-id="${e(t.id)}" role="button" tabindex="0" aria-label="${e(c)}"` : "";
          return `
          <article class="bracket-match ${e2 === "final" ? "is-final" : ""} ${a4 ? "is-placeholder" : ""} ${s2 ? "is-interactive" : ""}" ${m2}>
            <div class="bracket-slot is-top shift-left ${r3 === "TBD" ? "is-empty" : ""} ${i5 ? "has-visual" : ""}">
              ${i5 ? `<span class="bracket-slot-visual is-right" aria-hidden="true"><img src="${e(i5)}" alt="" loading="lazy" decoding="async" /></span>` : ""}
              <span class="bracket-slot-main">
                <span class="bracket-slot-name">${e(r3)}</span>
              </span>
            </div>
            <div class="bracket-slot shift-right ${n === "TBD" ? "is-empty" : ""} ${o2 ? "has-visual" : ""}">
              ${o2 ? `<span class="bracket-slot-visual is-left" aria-hidden="true"><img src="${e(o2)}" alt="" loading="lazy" decoding="async" /></span>` : ""}
              <span class="bracket-slot-main">
                <span class="bracket-slot-name">${e(n)}</span>
              </span>
            </div>
          </article>
        `;
        }, X = (t) => {
          const e2 = K(t), r3 = e2.at(-1), n = e2.slice(0, -1), i5 = r3 && Array.isArray(r3.matches) && r3.matches[0] ? r3.matches.slice().sort((s2, c) => (s2.order ?? 0) - (c.order ?? 0))[0] : w3(r3?.roundNumber ?? 1, 1), o2 = [], a4 = [];
          for (const s2 of n) {
            const c = Array.isArray(s2.matches) ? s2.matches.slice().sort((tt, et) => (tt.order ?? 0) - (et.order ?? 0)) : [], m2 = Math.ceil(c.length / 2);
            o2.push({ roundNumber: s2.roundNumber, title: s2.title, matches: c.slice(0, m2) }), a4.push({ roundNumber: s2.roundNumber, title: s2.title, matches: c.slice(m2) });
          }
          return { leftRounds: o2, rightRounds: a4, finalMatch: i5 };
        }, Y = () => Array.from({ length: h3 }, (t, e2) => {
          const r3 = e2 + 1, n = z2(r3);
          return { roundNumber: r3, title: M(r3), matches: Array.from({ length: n }, (i5, o2) => w3(r3, o2 + 1)) };
        }), y3 = (t, e2, r3) => {
          if (e2 < 0) return null;
          const n = t[e2], i5 = n?.matches?.[r3] ?? w3(n?.roundNumber ?? e2 + 1, r3 + 1);
          if (e2 === 0) return { match: i5, top: null, bottom: null, depth: 1 };
          const o2 = y3(t, e2 - 1, r3 * 2), a4 = y3(t, e2 - 1, r3 * 2 + 1), s2 = Math.max(o2?.depth ?? 0, a4?.depth ?? 0) + 1;
          return { match: i5, top: o2, bottom: a4, depth: s2 };
        }, N2 = (t, e2) => t ? !t.top && !t.bottom ? $2(t.match) : `
          <div class="bracket-branch is-${e2}" data-depth="${e(String(t.depth))}">
            <div class="bracket-children">
              <div class="bracket-child">${N2(t.top, e2)}</div>
              <div class="bracket-child">${N2(t.bottom, e2)}</div>
            </div>
            <div class="bracket-link"></div>
            ${$2(t.match)}
          </div>
        ` : "", P2 = (t) => {
          const rawRounds = Array.isArray(t.rounds) ? t.rounds : Array.isArray(t.data?.rounds) ? t.data.rounds : [];
          if (rawRounds.length > 0) {
            h3 = rawRounds.length;
            V = Math.max(2, (rawRounds[0]?.matches?.length || 8) * 2);
          }
          const e2 = J(t), r3 = e2.length ? e2 : Y(), { leftRounds: n, rightRounds: i5, finalMatch: o2 } = X(r3), a4 = y3(n, n.length - 1, 0), s2 = y3(i5, i5.length - 1, 0);
          b2.innerHTML = `
          <div class="bracket-side is-left"><div class="bracket-side-track is-left">${N2(a4, "left")}</div></div>
          <div class="bracket-center">
            <div class="bracket-center-finals">
              <div class="bracket-center-side-link"></div>
              ${$2(o2, "final")}
              <div class="bracket-center-side-link"></div>
            </div>
          </div>
          <div class="bracket-side is-right"><div class="bracket-side-track is-right">${N2(s2, "right")}</div></div>
        `, W(), u2();
        }, O2 = (t) => !t || j() ? false : (v2(F2()), true), Z = H()?.data;
        let A3 = O2(!!Z?.tournamentBracketHidden);
        const C2 = async () => {
          if (b2.children.length > 0) {
            W();
            u2();
          }
          if (g) {
            v2("Stub mode enabled.");
            return;
          }
          if (G) {
            v2(U3);
            return;
          }
          if (!A3) {
            if (b2.children.length === 0 && window.__BRACKET_DATA) {
              P2(window.__BRACKET_DATA);
            } else if (b2.children.length === 0) {
              S3("Loading bracket...", "neutral");
            }
            try {
              const t = await i2("/tournament/bracket", { method: "GET", token: v() });
              P2(t);
            } catch (t) {
              if (t instanceof m && t.status === 403) {
                v2(F2());
                return;
              }
              if (window.__BRACKET_DATA) {
                P2(window.__BRACKET_DATA);
                return;
              }
              if (b2.children.length > 0) {
                W();
                u2();
                return;
              }
              P2({ rounds: [] });
            }
          }
        };
        F((t) => {
          const e2 = A3;
          A3 = O2(!!t.tournamentBracketHidden), e2 && !A3 && C2();
        }), C2(), window.addEventListener("resize", u2), window.addEventListener("load", u2, { once: true }), window.addEventListener("pageshow", u2);
        const q = (t) => {
          if (!(t instanceof Element)) return;
          const r3 = t.closest("[data-vs-trigger='true']")?.dataset.matchId?.trim();
          r3 && document.dispatchEvent(new CustomEvent("ngt:vs-open", { detail: { matchId: r3 } }));
        };
        b2.addEventListener("click", (t) => {
          q(t.target);
        }), b2.addEventListener("keydown", (t) => {
          if (t.key !== "Enter" && t.key !== " ") return;
          const e2 = t.target;
          if (!(e2 instanceof Element)) return;
          const r3 = e2.closest("[data-vs-trigger='true']");
          r3 instanceof HTMLElement && (t.preventDefault(), q(r3));
        }), new IntersectionObserver((t) => {
          t[0]?.isIntersecting && u2();
        }, { threshold: 0.12 }).observe(f3), "fonts" in document && "ready" in document.fonts && document.fonts.ready.then(u2).catch(() => {
        });
      }
    }
  });

  // _astro/reveal.C1o38KJz.js
  function a3(s2, e2 = {}) {
    const r3 = e2.threshold ?? 0.2, t = e2.className ?? "is-visible", c = new IntersectionObserver((o2) => {
      const [n] = o2;
      n?.isIntersecting && (s2.classList.add(t), c.disconnect());
    }, { threshold: r3 });
    return { observe() {
      c.observe(s2);
    }, disconnect() {
      c.disconnect();
    }, reset() {
      s2.classList.remove(t);
    }, restart() {
      s2.classList.remove(t), c.observe(s2);
    } };
  }
  function i4(s2, e2 = {}) {
    const r3 = a3(s2, e2);
    return r3.observe(), r3;
  }
  var init_reveal_C1o38KJz = __esm({
    "_astro/reveal.C1o38KJz.js"() {
    }
  });

  // _astro/Sponsors.astro_astro_type_script_index_0_lang.kMc95YVg.js
  var require_Sponsors_astro_astro_type_script_index_0_lang_kMc95YVg = __commonJS({
    "_astro/Sponsors.astro_astro_type_script_index_0_lang.kMc95YVg.js"() {
      init_reveal_C1o38KJz();
      var e2 = document.getElementById("sponsors-reveal");
      e2 instanceof HTMLElement && a3(e2, { threshold: 0.2 }).observe();
    }
  });

  // _astro/About.astro_astro_type_script_index_0_lang.DRiQXxsm.js
  var require_About_astro_astro_type_script_index_0_lang_DRiQXxsm = __commonJS({
    "_astro/About.astro_astro_type_script_index_0_lang.DRiQXxsm.js"() {
      init_reveal_C1o38KJz();
      init_text_DgeDZjdf();
      init_site_settings_CKBpDEDM();
      var d2 = document.getElementById("about-reveal");
      if (d2 instanceof HTMLElement) {
        const t = document.getElementById("about-heading"), o2 = document.getElementById("about-body"), r3 = i4(d2, { threshold: 0.25 });
        F((s2) => {
          const e2 = s2.description, n = s2.subDescription;
          if (!e2 && !n) return;
          r3.disconnect();
          let c = 0;
          e2 && t instanceof HTMLElement && (c = i3(e2), t.innerHTML = o(e2, 0)), n && o2 instanceof HTMLElement && (o2.innerHTML = o(n, c)), r3.restart();
        });
      }
    }
  });

  // _astro/Rounds.astro_astro_type_script_index_0_lang.DyZ9KqsY.js
  var require_Rounds_astro_astro_type_script_index_0_lang_DyZ9KqsY = __commonJS({
    "_astro/Rounds.astro_astro_type_script_index_0_lang.DyZ9KqsY.js"() {
      init_reveal_C1o38KJz();
      init_text_DgeDZjdf();
      (() => {
        const s2 = document.getElementById("rounds-reveal");
        if (!(s2 instanceof HTMLElement)) return;
        const a4 = a3(s2, { threshold: 0.2 });
        a4.observe();
        const i5 = (r3) => r3.map((e2, n) => `
          <div class="round-card flex flex-col gap-[40px] items-start justify-center w-full max-w-[280px]" style="--round-index:${n};">
            <div class="flex flex-col gap-[5px] items-start justify-center">
              <p class="text-[75px] text-white">${e(e2.id)}</p>
              <p class="text-[24px] text-white uppercase">${e(e2.duration)} - ${e(e2.duration_amount)} days</p>
            </div>
            <div class="flex flex-col gap-[5px] items-start justify-center">
              <p class="text-[24px] text-white uppercase">JUDGE</p>
              <p class="text-[24px] text-white uppercase">${e(e2.judge?.duration ?? "")} - ${e(e2.judge?.duration_amount ?? "")} days</p>
            </div>
          </div>`).join("");
        window.addEventListener("siteSettings:loaded", (r3) => {
          const e2 = r3.detail?.rounds;
          !Array.isArray(e2) || e2.length === 0 || (a4.disconnect(), s2.innerHTML = i5(e2), a4.restart());
        });
      })();
    }
  });

  // _astro/SpecialThanks.astro_astro_type_script_index_0_lang.C9B1wXl3.js
  var require_SpecialThanks_astro_astro_type_script_index_0_lang_C9B1wXl3 = __commonJS({
    "_astro/SpecialThanks.astro_astro_type_script_index_0_lang.C9B1wXl3.js"() {
      init_reveal_C1o38KJz();
      init_text_DgeDZjdf();
      init_site_settings_CKBpDEDM();
      var r3 = document.getElementById("special-thanks-reveal");
      if (r3 instanceof HTMLElement) {
        const s2 = r3.querySelector("ul");
        if (s2 instanceof HTMLElement) {
          const n = a3(r3, { threshold: 0.2 });
          n.observe();
          const a4 = r3.querySelectorAll("h2 .word-clip, p .word-clip").length, l2 = (t) => t.map((e2, i5) => `
        <li>
          <a
            href="${e(e2.link || "#")}"
            target="_blank"
            rel="noopener noreferrer"
            class="word-clip"
            style="--word-index:${i5 + a4};"
          >
            <span class="word-inner hover:text-white/70 transition-colors duration-300">
              ${e(e2.name)}
            </span>
          </a>
        </li>`).join("");
          F((t) => {
            const e2 = t.specialThanks;
            !Array.isArray(e2) || e2.length === 0 || (n.disconnect(), s2.innerHTML = l2(e2), n.restart());
          });
        }
      }
    }
  });

  // _astro/VsScreenModal.astro_astro_type_script_index_0_lang.BXoPRkcZ.js
  var require_VsScreenModal_astro_astro_type_script_index_0_lang_BXoPRkcZ = __commonJS({
    "_astro/VsScreenModal.astro_astro_type_script_index_0_lang.BXoPRkcZ.js"() {
      init_api_paths_BeHY0xnA();
      init_http_BUnDBjdO();
      var b2 = ["storyboard", "individuality", "overall", "execution", "styleImplementation"];
      var pe = ["storyboard", "individuality", "execution", "styleImplementation", "overall"];
      var fe = { storyboard: "concept", individuality: "individuality", overall: "overall", execution: "execution", styleImplementation: "style implementation" };
      var u2 = (e2, t) => {
        const r3 = e2.querySelector(t);
        return r3 instanceof Element ? r3 : null;
      };
      var m2 = document.querySelector("[data-vs-modal]");
      var ve = document.querySelector("[data-vs-panel]");
      var x = document.querySelector("[data-vs-close]");
      var w3 = document.querySelector("[data-vs-global-status]");
      if (!(m2 instanceof HTMLElement) || !(ve instanceof HTMLElement) || !(x instanceof HTMLButtonElement) || !(w3 instanceof HTMLElement)) throw new Error("VS screen modal is not mounted correctly.");
      var v2 = /* @__PURE__ */ new Map();
      document.querySelectorAll("[data-vs-side]").forEach((e2) => {
        const t = e2.dataset.vsSide;
        if (t !== "A" && t !== "B") return;
        const r3 = u2(e2, '[data-field="name"]'), a4 = u2(e2, '[data-field="socials"]'), i5 = u2(e2, '[data-field="avatar-image"]'), o2 = u2(e2, '[data-field="avatar-fallback"]'), s2 = u2(e2, '[data-field="result-badge"]'), l2 = u2(e2, '[data-field="video-frame"]'), f3 = u2(e2, '[data-field="video-placeholder"]'), d2 = u2(e2, '[data-field="jury-average"]'), _3 = u2(e2, '[data-field="audience-average"]'), H2 = u2(e2, '[data-field="averages-tooltip"]'), P2 = u2(e2, '[data-field="description"]'), F2 = u2(e2, '[data-field="your-rating"]'), D2 = u2(e2, '[data-field="form"]'), N2 = u2(e2, '[data-field="publish"]'), O2 = u2(e2, '[data-field="side-status"]');
        if (!(r3 instanceof HTMLElement) || !(a4 instanceof HTMLElement) || !(i5 instanceof HTMLImageElement) || !(o2 instanceof HTMLElement) || !(s2 instanceof HTMLElement) || !(l2 instanceof HTMLIFrameElement) || !(f3 instanceof HTMLElement) || !(d2 instanceof HTMLElement) || !(_3 instanceof HTMLElement) || !(H2 instanceof HTMLElement) || !(P2 instanceof HTMLElement) || !(F2 instanceof HTMLElement) || !(D2 instanceof HTMLFormElement) || !(N2 instanceof HTMLButtonElement) || !(O2 instanceof HTMLElement)) return;
        const $2 = {}, q = {};
        for (const M of b2) {
          const z2 = u2(e2, `[data-criterion="${M}"]`), V = u2(z2 ?? e2, '[data-field="criterion-input"]'), J = u2(z2 ?? e2, '[data-field="criterion-value"]');
          if (!(V instanceof HTMLInputElement) || !(J instanceof HTMLElement)) return;
          $2[M] = V, q[M] = J;
        }
        v2.set(t, { section: e2, name: r3, socials: a4, avatarImage: i5, avatarFallback: o2, resultBadge: s2, videoFrame: l2, videoPlaceholder: f3, juryAverage: d2, audienceAverage: _3, averagesTooltip: H2, description: P2, yourRating: F2, form: D2, publish: N2, sideStatus: O2, inputs: $2, values: q });
      });
      if (v2.size !== 2) throw new Error("VS screen modal sides are not mounted correctly.");
      var y3 = () => ({ storyboard: 0, individuality: 0, overall: 0, execution: 0, styleImplementation: 0 });
      var ye = () => ({ storyboard: null, individuality: null, overall: null, execution: null, styleImplementation: null });
      var ge = (e2) => false;
      var n = { isOpen: false, currentMatchId: null, payload: null, lastFocused: null, closeTimeout: 0, loadRequestId: 0, criteria: { A: y3(), B: y3() }, publishedCriteria: { A: null, B: null }, submitting: { A: false, B: false } };
      var U3 = (e2) => typeof e2 == "string" ? e2.trim() : "";
      var c = (e2) => {
        const t = U3(e2);
        return t.length > 0 ? t : null;
      };
      var g = (e2) => typeof e2 == "number" && Number.isFinite(e2) ? e2 : null;
      var T = (...e2) => {
        for (const t of e2) {
          const r3 = c(t);
          if (r3) return r3;
        }
        return null;
      };
      var be = (e2) => {
        const t = c(e2);
        if (!t) return null;
        if (t.includes("youtube.com/embed/index.html") || t.includes("player.vimeo.com/video/index.html")) return t;
        try {
          const a4 = new URL(t), i5 = a4.hostname.replace(/^www\./i, "").toLowerCase();
          if (i5 === "youtu.be") {
            const o2 = a4.pathname.replace(/\//g, "").trim();
            if (o2) return `https://www.youtube.com/embed/${o2}`;
          }
          if (i5 === "youtube.com" || i5.endsWith(".youtube.com")) {
            if (a4.pathname === "/watch") {
              const s2 = a4.searchParams.get("v")?.trim();
              if (s2) return `https://www.youtube.com/embed/${s2}`;
            }
            const o2 = a4.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/i);
            if (o2?.[1]) return `https://www.youtube.com/embed/${o2[1]}`;
          }
        } catch {
        }
        const r3 = t.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
        return r3?.[1] ? `https://player.vimeo.com/video/${r3[1]}` : t;
      };
      var Q = (e2) => typeof e2 != "number" || !Number.isFinite(e2) ? "--" : String(Math.round(e2));
      var G = (e2) => {
        if (typeof e2 != "number" || !Number.isFinite(e2)) return "--";
        const t = Math.round(e2 * 10) / 10;
        return Number.isInteger(t) ? String(t) : t.toFixed(1);
      };
      var W = (e2, t) => {
        if (!e2 || typeof e2 != "object") return null;
        const r3 = e2, a4 = r3.averages100 && typeof r3.averages100 == "object" ? r3.averages100 : null;
        if (a4) {
          const l2 = g(a4[t]);
          if (l2 !== null) return l2;
        }
        const i5 = r3[t] && typeof r3[t] == "object" ? r3[t] : null;
        if (i5) {
          const l2 = g(i5.average100);
          if (l2 !== null) return l2;
        }
        if (t === "users") {
          const l2 = g(r3.average100);
          if (l2 !== null) return l2;
        }
        const o2 = g(r3[`${t}Average100`]);
        if (o2 !== null) return o2;
        const s2 = g(r3[t === "users" ? "audienceAverage" : "juryAverage"]);
        return s2 !== null ? s2 : null;
      };
      var j = (e2) => {
        if (!e2 || typeof e2 != "object") return null;
        const t = e2, r3 = ye();
        let a4 = false;
        for (const i5 of b2) {
          const o2 = i5 === "storyboard" ? ["storyboard", "concept"] : [i5];
          let s2 = null;
          for (const l2 of o2) if (s2 = g(t[l2]), s2 !== null) break;
          r3[i5] = s2, s2 !== null && (a4 = true);
        }
        return a4 ? r3 : null;
      };
      var Y = (e2, t) => {
        if (!e2 || typeof e2 != "object") return null;
        const r3 = e2, a4 = r3[t] && typeof r3[t] == "object" ? r3[t] : null, i5 = [r3.criteriaAverages, r3.criteriaAverage, r3.averageCriteria, r3.averagesByCriteria, r3.criteriaAvg, r3.criteria], o2 = [a4, a4?.criteriaAverages, a4?.criteriaAverage, a4?.averageCriteria, a4?.averagesByCriteria, a4?.criteriaAvg, a4?.criteria, r3[`${t}CriteriaAverages`], r3[`${t}CriteriaAverage`], r3[`${t}AverageCriteria`], r3[t === "users" ? "audienceCriteriaAverages" : "juryCriteriaAverages"], r3[t === "users" ? "audienceCriteriaAverage" : "juryCriteriaAverage"]];
        for (const s2 of i5) {
          if (!s2 || typeof s2 != "object") continue;
          const l2 = s2[t];
          o2.push(l2);
        }
        for (const s2 of o2) {
          const l2 = j(s2);
          if (l2) return l2;
        }
        return null;
      };
      var K = (e2) => {
        if (!e2 || typeof e2 != "object") return null;
        const t = e2;
        return j(t.criteria) ?? j(t);
      };
      var Z = (e2) => {
        if (!e2 || typeof e2 != "object") return null;
        const t = e2, r3 = t.averages && typeof t.averages == "object" ? t.averages : t, a4 = r3.jury ?? t.jury;
        return { audience: K(r3.audience ?? t.audience), jury: a4 === null ? null : K(a4) };
      };
      var he = (e2) => {
        const t = e2 && typeof e2 == "object" ? e2 : {};
        return { participantA: Z(t.participantA), participantB: Z(t.participantB) };
      };
      var Ae = (e2, t) => {
        e2 && (e2.participantA && t.participantA && (e2.participantA.audienceCriteriaAverages = t.participantA.audience, e2.participantA.juryCriteriaAverages = t.participantA.jury), e2.participantB && t.participantB && (e2.participantB.audienceCriteriaAverages = t.participantB.audience, e2.participantB.juryCriteriaAverages = t.participantB.jury));
      };
      var we = async (e2) => {
        if (n.payload) try {
          const t = await i2(i.tournament.matchCriteriaAverages(e2), { method: "GET", token: v() });
          Ae(n.payload, he(t));
        } catch {
          return;
        }
      };
      var ie = (e2) => {
        if (e2?.round.status === "FINISHED") return true;
        const r3 = e2?.round.submissionDeadline;
        if (!r3) return false;
        const a4 = Date.parse(r3);
        return Number.isFinite(a4) && a4 <= Date.now();
      };
      var Ie = (e2) => {
        const t = e2.storyboard * 0.15 + e2.individuality * 0.15 + e2.execution * 0.15 + e2.styleImplementation * 0.15 + e2.overall * 0.4;
        return Math.max(0, Math.min(100, Math.round(t * 10)));
      };
      var se = (e2) => ({ storyboard: e2.storyboard, individuality: e2.individuality, overall: e2.overall, execution: e2.execution, styleImplementation: e2.styleImplementation });
      var Ce = (e2, t) => !e2 || !t ? false : e2.storyboard === t.storyboard && e2.individuality === t.individuality && e2.execution === t.execution && e2.styleImplementation === t.styleImplementation && e2.overall === t.overall;
      var Ee = (e2) => {
        if (!e2 || typeof e2 != "object") return null;
        const t = e2, r3 = y3();
        for (const a4 of b2) {
          const i5 = t[a4];
          if (typeof i5 != "number" || !Number.isFinite(i5)) return null;
          r3[a4] = Math.max(0, Math.min(10, Math.round(i5)));
        }
        return r3;
      };
      var oe = () => {
        const e2 = String(A2()?.role ?? "").toUpperCase();
        return e2 === "JURY" || e2 === "ADMIN" ? "jury" : "user";
      };
      var Le = async (e2) => {
        const t = { A: null, B: null };
        if (oe() !== "user") {
          n.publishedCriteria = t;
          return;
        }
        const r3 = v();
        if (!r3) {
          n.publishedCriteria = t;
          return;
        }
        let a4;
        try {
          a4 = await i2(i.scores.userMe(e2), { method: "GET", token: r3 });
        } catch (s2) {
          if (s2 instanceof m && (s2.status === 401 || s2.status === 403 || s2.status === 404)) return;
          throw s2;
        }
        const i5 = Array.isArray(a4.scores) ? a4.scores : [], o2 = /* @__PURE__ */ new Map();
        for (const s2 of i5) {
          const l2 = c(s2?.submissionId), f3 = Ee(s2?.criteria);
          !l2 || !f3 || o2.set(l2, f3);
        }
        for (const s2 of ["A", "B"]) {
          const l2 = s2 === "A" ? n.payload?.participantA : n.payload?.participantB, f3 = c(l2?.submission?.id), d2 = f3 ? o2.get(f3) ?? null : null;
          t[s2] = d2, d2 && (n.criteria[s2] = se(d2));
        }
        n.publishedCriteria = t;
      };
      var S3 = () => {
        const e2 = String(A2()?.role ?? "").toUpperCase();
        return e2 === "JURY" || e2 === "ADMIN";
      };
      var le = (e2) => {
        const t = c(A2()?.id);
        return !t || !e2 ? false : t === e2.participantA?.id || t === e2.participantB?.id;
      };
      var I = (e2, t = "neutral") => {
        w3.textContent = e2, w3.dataset.tone = t, w3.classList.toggle("is-hidden", e2.trim().length === 0);
      };
      var p3 = (e2, t, r3 = "neutral") => {
        const a4 = v2.get(e2);
        a4 && (a4.sideStatus.textContent = t, a4.sideStatus.dataset.tone = r3, a4.sideStatus.classList.toggle("is-hidden", t.trim().length === 0));
      };
      var k2 = (e2) => {
        const t = new URL(window.location.href);
        e2 ? t.searchParams.set("vs", e2) : t.searchParams.delete("vs"), window.history.replaceState({}, "", `${t.pathname}${t.search}${t.hash}`);
      };
      var Me = () => {
        document.body.classList.add("overflow-hidden");
      };
      var Te = () => {
        document.querySelector("[data-modal].is-open") || document.body.classList.remove("overflow-hidden");
      };
      var je = () => {
        for (const e2 of v2.values()) e2.videoFrame.src = "";
      };
      var Se = () => {
        n.payload = null, I("", "neutral");
        for (const e2 of ["A", "B"]) n.criteria[e2] = y3(), n.publishedCriteria[e2] = null, n.submitting[e2] = false, p3(e2, "", "neutral");
      };
      var ke = () => {
        n.closeTimeout && (window.clearTimeout(n.closeTimeout), n.closeTimeout = 0), !n.isOpen && (n.lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null, m2.classList.remove("hidden"), m2.classList.add("flex"), Me(), window.requestAnimationFrame(() => {
          m2.classList.add("is-open"), m2.setAttribute("aria-hidden", "false"), x.focus();
        }), n.isOpen = true);
      };
      var L2 = (e2 = {}) => {
        const { syncUrl: t = true } = e2;
        if (!n.isOpen && m2.classList.contains("hidden")) {
          t && k2(null);
          return;
        }
        n.closeTimeout && (window.clearTimeout(n.closeTimeout), n.closeTimeout = 0), m2.classList.remove("is-open"), m2.setAttribute("aria-hidden", "true"), n.loadRequestId += 1, je(), Te(), t && k2(null), n.closeTimeout = window.setTimeout(() => {
          m2.classList.add("hidden"), m2.classList.remove("flex"), n.closeTimeout = 0, n.isOpen = false, n.currentMatchId = null, Se(), n.lastFocused instanceof HTMLElement && n.lastFocused.focus();
        }, 320);
      };
      var Be = (e2) => {
        const t = e2.split(/\s+/).filter(Boolean).slice(0, 2);
        return t.length === 0 ? "?" : t.map((r3) => r3[0]?.toUpperCase() ?? "").join("") || "?";
      };
      var Re = (e2, t) => {
        e2.replaceChildren();
        const r3 = [{ label: "youtube", href: t?.youtubeUrl ?? null }, { label: "instagram", href: t?.instagramUrl ?? null }];
        for (const a4 of r3) {
          if (!a4.href) continue;
          const i5 = document.createElement("a");
          i5.href = a4.href, i5.target = "_blank", i5.rel = "noreferrer noopener", i5.className = "vs-screen__social-link", i5.textContent = a4.label, e2.append(i5);
        }
        e2.classList.toggle("is-empty", e2.childElementCount === 0);
      };
      var X = (e2, t) => {
        const r3 = v2.get(e2);
        if (!r3) return;
        const a4 = t?.name?.trim() || "TBD", i5 = ie(n.payload);
        r3.name.textContent = a4, r3.description.textContent = i5 ? t?.submission?.description?.trim() || "No description yet." : "The submission deadline isn't over yet", Re(r3.socials, t);
        const o2 = t?.avatarUrl?.trim() || "";
        o2 ? (r3.avatarImage.src = o2, r3.avatarImage.alt = `${a4} avatar`, r3.avatarImage.classList.remove("hidden"), r3.avatarFallback.classList.add("hidden")) : (r3.avatarImage.src = "", r3.avatarImage.alt = "", r3.avatarImage.classList.add("hidden"), r3.avatarFallback.textContent = Be(a4), r3.avatarFallback.classList.remove("hidden"));
        const s2 = t?.submission?.embedUrl?.trim() || "";
        if (i5 && s2) r3.videoFrame.src = s2, r3.videoFrame.classList.remove("hidden"), r3.videoPlaceholder.classList.add("hidden");
        else {
          r3.videoFrame.src = "", r3.videoFrame.classList.add("hidden"), r3.videoPlaceholder.classList.remove("hidden");
          const d2 = r3.videoPlaceholder.querySelector(".vs-screen__video-placeholder-text");
          d2 instanceof HTMLElement && (d2.textContent = i5 ? t?.submission ? "Video unavailable" : "Participant hasn't uploaded their work yet" : "The submission deadline isn't over yet");
        }
        r3.audienceAverage.textContent = Q(t?.audienceAverage ?? null);
        const l2 = n.payload?.round.juryRevealEnabled === true || S3() ? t?.juryAverage ?? null : null;
        r3.juryAverage.textContent = Q(l2);
        const f3 = n.payload?.round.juryRevealEnabled === true || S3();
        r3.averagesTooltip.innerHTML = `
      <p class="vs-screen__averages-tooltip-title">AVERAGE BY CRITERIA</p>
      <div class="vs-screen__averages-tooltip-table">
        <div class="vs-screen__averages-tooltip-row is-head">
          <span class="vs-screen__averages-tooltip-head">criterion</span>
          <span class="vs-screen__averages-tooltip-head is-jury">jury</span>
          <span class="vs-screen__averages-tooltip-head">audience</span>
        </div>
        ${pe.map((d2) => `
            <div class="vs-screen__averages-tooltip-row">
              <span class="vs-screen__averages-tooltip-key">${fe[d2]}</span>
              <span class="vs-screen__averages-tooltip-value is-jury">${G(f3 ? t?.juryCriteriaAverages?.[d2] ?? null : null)}</span>
              <span class="vs-screen__averages-tooltip-value">${G(t?.audienceCriteriaAverages?.[d2] ?? null)}</span>
            </div>
          `).join("")}
      </div>
    `;
      };
      var xe = (e2, t) => {
        const r3 = c(t?.match.winnerId);
        if (!r3) return null;
        const a4 = c(t?.participantA?.id), i5 = c(t?.participantB?.id);
        return a4 && a4 === r3 ? e2 === "A" ? "winner" : "loser" : i5 && i5 === r3 ? e2 === "B" ? "winner" : "loser" : null;
      };
      var ee = (e2) => {
        const t = v2.get(e2);
        if (!t) return;
        const r3 = xe(e2, n.payload);
        t.resultBadge.textContent = r3 === "winner" ? "WIN" : r3 === "loser" ? "LOSE" : "", t.resultBadge.dataset.result = r3 ?? "", t.resultBadge.classList.toggle("is-hidden", !r3);
      };
      var B3 = (e2) => {
        const t = v2.get(e2);
        if (!t) return;
        const r3 = n.criteria[e2];
        for (const a4 of b2) {
          const i5 = r3[a4];
          t.inputs[a4].value = String(i5), t.values[a4].textContent = String(i5), t.inputs[a4].style.setProperty("--vs-progress", `${i5 / 10 * 100}%`);
        }
        t.yourRating.textContent = String(Ie(r3));
      };
      var Ue = (e2, t) => t?.id ? ie(n.payload) ? t.submission?.id ? v() ? le(n.payload) ? "Participants cannot rate their own match." : S3() ? "Use Judge page to rate works." : n.submitting[e2] ? "Publishing rating..." : "" : "Log in to rate this work." : "Submission is not available yet." : "Submission deadline is not over yet." : "Match participant is not assigned yet.";
      var C2 = (e2, t) => {
        const r3 = v2.get(e2);
        if (!r3) return;
        const a4 = Ue(e2, t), i5 = a4.length > 0;
        for (const s2 of b2) r3.inputs[s2].disabled = i5;
        if (r3.publish.disabled = i5, r3.publish.title = a4, r3.section.classList.toggle("is-disabled", i5), n.submitting[e2]) {
          p3(e2, "Publishing rating...", "neutral");
          return;
        }
        if (n.publishedCriteria[e2]) {
          p3(e2, "Rating published.", "ok");
          return;
        }
        const o2 = r3.sideStatus.textContent?.trim() ?? "";
        (!o2 || o2 === "Publishing rating...") && p3(e2, "", "neutral");
      };
      var te = (e2) => {
        if (!e2 || typeof e2 != "object") return null;
        const t = e2, r3 = t.submission && typeof t.submission == "object" ? t.submission : null, a4 = t.scores && typeof t.scores == "object" ? t.scores : null;
        return { id: c(t.id), name: c(t.nickname) ?? c(t.username) ?? "TBD", avatarUrl: T(t.avatarUrl, t.avatar), youtubeUrl: T(t.youtubeUrl, t.youtube), instagramUrl: T(t.instagramUrl, t.instagram), submission: r3 ? { id: c(r3.id), embedUrl: be(r3.embedUrl ?? r3.videoUrl ?? r3.workUrl), description: U3(r3.description) } : null, audienceAverage: W(a4, "users"), juryAverage: W(a4, "jury"), audienceCriteriaAverages: Y(a4, "users"), juryCriteriaAverages: Y(a4, "jury") };
      };
      var _e = (e2) => {
        const t = e2 && typeof e2 == "object" ? e2 : {}, r3 = t.match && typeof t.match == "object" ? t.match : {}, a4 = t.round && typeof t.round == "object" ? t.round : {};
        return { id: U3(r3.id), match: { status: c(r3.status), winnerId: c(r3.winnerId) }, round: { juryRevealEnabled: !!a4.juryRevealEnabled, status: c(a4.status), submissionDeadline: c(a4.submissionDeadline), endsAt: c(a4.endsAt) }, participantA: te(t.participantA), participantB: te(t.participantB) };
      };
      var re = () => {
        const e2 = n.payload;
        X("A", e2?.participantA ?? null), X("B", e2?.participantB ?? null), ee("A"), ee("B"), B3("A"), B3("B"), C2("A", e2?.participantA ?? null), C2("B", e2?.participantB ?? null);
      };
      var ce = async (e2) => {
        const t = ++n.loadRequestId;
        I("Loading match...", "neutral");
        try {
          ge(e2);
          const r3 = await i2(i.tournament.matchPublicDetailed(e2), { method: "GET", token: v() });
          if (t !== n.loadRequestId || (n.payload = _e(r3), await we(e2), t !== n.loadRequestId) || (await Le(e2), t !== n.loadRequestId)) return;
          re(), I("", "neutral");
        } catch (r3) {
          if (t !== n.loadRequestId) return;
          if (window.__MATCHES_DETAILS && window.__MATCHES_DETAILS[e2]) {
            n.payload = _e(window.__MATCHES_DETAILS[e2]);
            re();
            I("", "neutral");
            return;
          }
          n.payload = null, re(), I(r3 instanceof Error ? r3.message : "Could not load match details.", "err");
        }
      };
      var ue = async (e2, t = {}) => {
        const { syncUrl: r3 = true } = t, a4 = e2.trim();
        a4 && (ke(), r3 && k2(a4), n.currentMatchId !== a4 && (n.criteria.A = y3(), n.criteria.B = y3(), p3("A", "", "neutral"), p3("B", "", "neutral")), n.currentMatchId = a4, await ce(a4));
      };
      var ae = (e2) => {
        const t = v2.get(e2);
        return t ? { storyboard: Number(t.inputs.storyboard.value) || 0, individuality: Number(t.inputs.individuality.value) || 0, overall: Number(t.inputs.overall.value) || 0, execution: Number(t.inputs.execution.value) || 0, styleImplementation: Number(t.inputs.styleImplementation.value) || 0 } : y3();
      };
      var He = async (e2) => {
        const t = n.currentMatchId, r3 = n.payload, a4 = e2 === "A" ? r3?.participantA : r3?.participantB, i5 = v();
        if (!i5) {
          const o2 = new URL(window.location.href);
          t && o2.searchParams.set("vs", t), B2(`${o2.pathname}${o2.search}`);
          return;
        }
        if (!t || !a4?.submission?.id) {
          p3(e2, "Submission is not available yet.", "err");
          return;
        }
        if (le(r3)) {
          p3(e2, "Participants cannot rate their own match.", "err");
          return;
        }
        n.submitting[e2] = true, C2(e2, a4);
        try {
          const o2 = n.criteria[e2], s2 = oe() === "jury" ? i.scores.jury : i.scores.user;
          await i2(s2, { method: "POST", token: i5, body: { matchId: t, submissionId: a4.submission.id, criteria: o2 } }), n.publishedCriteria[e2] = se(o2), p3(e2, "Rating published.", "ok"), await ce(t);
        } catch (o2) {
          const s2 = o2 instanceof m || o2 instanceof Error ? o2.message : "Could not publish rating.";
          p3(e2, s2, "err");
        } finally {
          n.submitting[e2] = false, C2(e2, a4);
        }
      };
      for (const e2 of ["A", "B"]) {
        const t = v2.get(e2);
        if (t) {
          for (const r3 of b2) t.inputs[r3].addEventListener("input", () => {
            n.criteria[e2] = ae(e2), B3(e2), n.publishedCriteria[e2] && p3(e2, Ce(n.criteria[e2], n.publishedCriteria[e2]) ? "Rating published." : "Unsaved changes.", "neutral");
          });
          t.form.addEventListener("submit", (r3) => {
            r3.preventDefault(), n.criteria[e2] = ae(e2), He(e2);
          });
        }
      }
      x.addEventListener("click", (e2) => {
        e2.preventDefault(), L2();
      });
      m2.addEventListener("click", (e2) => {
        e2.target === m2 && L2();
      });
      document.addEventListener("keydown", (e2) => {
        e2.key === "Escape" && n.isOpen && L2();
      });
      document.addEventListener("ngt:vs-open", (e2) => {
        const t = e2 instanceof CustomEvent && e2.detail && typeof e2.detail == "object" ? e2.detail : {}, r3 = c(t.matchId);
        r3 && ue(r3);
      });
      var de = () => {
        const e2 = c(new URLSearchParams(window.location.search).get("vs"));
        if (!e2) {
          n.isOpen && L2({ syncUrl: false });
          return;
        }
        n.currentMatchId === e2 && n.isOpen || ue(e2, { syncUrl: false });
      };
      window.addEventListener("popstate", de);
      de();
    }
  });

  // _astro/index.astro_astro_type_script_index_0_lang.Cv9zphZG.js
  var require_index_astro_astro_type_script_index_0_lang_Cv9zphZG = __commonJS({
    "_astro/index.astro_astro_type_script_index_0_lang.Cv9zphZG.js"() {
      init_site_settings_CKBpDEDM();
      $({ ttlMs: 6e4 }).catch(() => {
      });
    }
  });

  // _astro/_entry_index.js
  var require_entry_index = __commonJS({
    "_astro/_entry_index.js"() {
      var import_Winners_astro_astro_type_script_index_0_lang_9ape3wy = __toESM(require_Winners_astro_astro_type_script_index_0_lang_9ape3wy());
      var import_Bracket_astro_astro_type_script_index_0_lang_By8uBWsx = __toESM(require_Bracket_astro_astro_type_script_index_0_lang_By8uBWsx());
      var import_Sponsors_astro_astro_type_script_index_0_lang_kMc95YVg = __toESM(require_Sponsors_astro_astro_type_script_index_0_lang_kMc95YVg());
      var import_About_astro_astro_type_script_index_0_lang_DRiQXxsm = __toESM(require_About_astro_astro_type_script_index_0_lang_DRiQXxsm());
      var import_Rounds_astro_astro_type_script_index_0_lang_DyZ9KqsY = __toESM(require_Rounds_astro_astro_type_script_index_0_lang_DyZ9KqsY());
      var import_SpecialThanks_astro_astro_type_script_index_0_lang_C9B1wXl3 = __toESM(require_SpecialThanks_astro_astro_type_script_index_0_lang_C9B1wXl3());
      var import_VsScreenModal_astro_astro_type_script_index_0_lang_BXoPRkcZ = __toESM(require_VsScreenModal_astro_astro_type_script_index_0_lang_BXoPRkcZ());
      var import_index_astro_astro_type_script_index_0_lang_Cv9zphZG = __toESM(require_index_astro_astro_type_script_index_0_lang_Cv9zphZG());
    }
  });
  require_entry_index();
})();
