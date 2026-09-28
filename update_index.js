const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
const bracketHtml = fs.readFileSync('rendered_bracket.html', 'utf8');

// 1. Update bracket shell rounds and participants to 4 and 16
indexHtml = indexHtml.replace(/data-total-rounds="5"\s+data-total-participants="32"/g, 'data-total-rounds="4" data-total-participants="16"');

// 2. Hide bracket status text by default
indexHtml = indexHtml.replace(
  /<p id="bracket-status" class="([^"]*?)" aria-live="polite">[\s\S]*?<\/p>/,
  '<p id="bracket-status" class="$1 hidden" aria-live="polite"></p>'
);
indexHtml = indexHtml.replace(/class="([^"]*?)hidden hidden"/g, 'class="$1hidden"');

// 3. Ensure bracket-content is visible
indexHtml = indexHtml.replace('<div id="bracket-content" class="w-full hidden">', '<div id="bracket-content" class="w-full">');

// 4. Inject pre-rendered bracket HTML into #bracket-stage
const stageStart = indexHtml.indexOf('<div id="bracket-stage" class="bracket-stage">');
const stageEndTag = '</div> </div> </div> <div id="bracket-stub"';
const stageEnd = indexHtml.indexOf(stageEndTag);

if (stageStart !== -1 && stageEnd !== -1) {
  const prefix = indexHtml.slice(0, stageStart + '<div id="bracket-stage" class="bracket-stage">'.length);
  const suffix = indexHtml.slice(stageEnd);
  indexHtml = `${prefix}\n${bracketHtml}\n        ${suffix}`;
} else {
  console.error('Bracket stage container not found in index.html');
  process.exit(1);
}

// 5. Ensure bracket-data.js is included before Bracket.astro script
const scriptTarget = '<script type="module" src="_astro/Bracket.astro_astro_type_script_index_0_lang.By8uBWsx.js"></script>';
const scriptReplacement = '<script src="_astro/bracket-data.js"></script> <script type="module" src="_astro/Bracket.astro_astro_type_script_index_0_lang.By8uBWsx.js"></script>';

if (indexHtml.includes(scriptTarget) && !indexHtml.includes('_astro/bracket-data.js')) {
  indexHtml = indexHtml.replace(scriptTarget, scriptReplacement);
}

// 6. Ensure updateWinnersLayout is safely injected into hero-winners script ONLY
const hwScriptMarker = 'document.getElementById("hero-winners-transition")';
const hwStart = indexHtml.indexOf(hwScriptMarker);

const winnersFunc = `
    const updateWinnersLayout = () => {
      if (window.innerWidth <= 900) {
        setVar("--winners-scale", "1");
        setVar("--winners-section-offset", "0px");
        return;
      }
      const vh = window.innerHeight;
      const header = document.getElementById("site-header");
      const headerH = header ? header.getBoundingClientRect().height : 90;
      
      // Total vertical span of the winners content from top of title (25px) to bottom of card 2 (1060px) is 1060px.
      const targetH = 1060;
      const topPadding = Math.max(headerH + 8, 92);
      const bottomPadding = 20;
      const availableH = Math.max(280, vh - topPadding - bottomPadding);
      const scale = Math.min(1, Math.max(0.40, availableH / targetH));
      const offset = topPadding - (25.6 * scale);
      
      setVar("--winners-scale", scale.toFixed(4));
      setVar("--winners-section-offset", offset.toFixed(1) + "px");
      setVar("--winners-visual-height", (targetH * scale + offset).toFixed(1) + "px");
    };
`;

if (indexHtml.includes('const updateWinnersLayout = () =>')) {
  // Cleanly replace existing updateWinnersLayout
  indexHtml = indexHtml.replace(/const updateWinnersLayout = \(\) => \{[\s\S]*?\n    \};/, winnersFunc.trim());
} else if (hwStart !== -1) {
  const hwEnd = indexHtml.indexOf('</script>', hwStart);
  if (hwEnd !== -1) {
    let hwScript = indexHtml.slice(hwStart, hwEnd);

    // Insert function before applyProgress
    hwScript = hwScript.replace(/const applyProgress = \(\) => \{(\r?\n)\s*frame = 0;/, (match, newline) => {
      return winnersFunc + newline + '    const applyProgress = () => {' + newline + '      frame = 0;' + newline + '      updateWinnersLayout();';
    });

    // Hook resize
    hwScript = hwScript.replace(/window\.addEventListener\("resize", requestSync\);/, 'window.addEventListener("resize", () => { updateWinnersLayout(); requestSync(); });');

    // Hook pageshow & load
    hwScript = hwScript.replace(/window\.addEventListener\("pageshow", \(\) => \{[\s\S]*?window\.setTimeout\(syncInitialHash, 500\);\s*\}\);/, `window.addEventListener("pageshow", () => {
      updateWinnersLayout();
      syncInitialHash();
      requestSync();
    });
    window.addEventListener("load", () => {
      updateWinnersLayout();
      syncInitialHash();
      window.setTimeout(() => {
        updateWinnersLayout();
        syncInitialHash();
      }, 120);
      window.setTimeout(() => {
        updateWinnersLayout();
        syncInitialHash();
      }, 500);
    });`);

    indexHtml = indexHtml.slice(0, hwStart) + hwScript + indexHtml.slice(hwEnd);
  }
}

// 7. Ensure #site-loader is present for firsthand preloading
if (!indexHtml.includes('id="site-loader"')) {
  const bodyMatch = indexHtml.match(/<body[^>]*>/);
  if (bodyMatch) {
    const bodyTag = bodyMatch[0];
    const loaderCode = `
  <!-- FIRSTHAND SITE LOADER -->
  <div id="site-loader" style="position: fixed; inset: 0; z-index: 99999; background: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: auto;">
    <div style="display: flex; flex-direction: column; align-items: center; gap: 24px; max-width: 90vw;">
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: clamp(1.2rem, 3.5vw, 2.2rem); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #ffffff; text-align: center; text-shadow: 0 0 30px rgba(255,255,255,0.2);">
        NEWGEN TOURNAMENT 1
      </div>
      <div style="width: clamp(220px, 40vw, 360px); height: 2px; background: rgba(255, 255, 255, 0.1); border-radius: 999px; overflow: hidden; position: relative;">
        <div id="loader-progress-bar" style="position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: linear-gradient(90deg, #c78a56, #e2c275, #ffffff); border-radius: 999px; transition: width 0.15s ease-out; box-shadow: 0 0 12px rgba(226, 194, 117, 0.6);"></div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; width: clamp(220px, 40vw, 360px); font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5);">
        <span id="loader-status-text">INITIALIZING...</span>
        <span id="loader-percent-text">0%</span>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const loader = document.getElementById("site-loader");
      const bar = document.getElementById("loader-progress-bar");
      const status = document.getElementById("loader-status-text");
      const percent = document.getElementById("loader-percent-text");
      if (!loader || !bar || !status || !percent) return;

      let targetProgress = 10;
      let currentProgress = 0;
      let animFrame = null;

      const updateDisplay = () => {
        currentProgress += (targetProgress - currentProgress) * 0.18;
        const rounded = Math.min(100, Math.round(currentProgress));
        bar.style.width = rounded + "%";
        percent.textContent = rounded + "%";
        if (currentProgress < 99.5 || targetProgress < 100) {
          animFrame = requestAnimationFrame(updateDisplay);
        } else {
          bar.style.width = "100%";
          percent.textContent = "100%";
          status.textContent = "READY";
          setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.transform = "scale(1.02)";
            loader.style.pointerEvents = "none";
            document.body.style.overflow = "";
            setTimeout(() => {
              if (loader.parentNode) loader.parentNode.removeChild(loader);
            }, 600);
          }, 200);
        }
      };
      animFrame = requestAnimationFrame(updateDisplay);

      const tasks = [];

      if ("fonts" in document && document.fonts.ready) {
        tasks.push(document.fonts.ready.then(() => {
          targetProgress = Math.max(targetProgress, 35);
          status.textContent = "FONTS READY";
        }).catch(() => {}));
      }

      const avatarUrls = [
        "https://cdn.discordapp.com/avatars/1258796182348763146/b6bc170b76b97e3576f887dbc3cf556c.png",
        "https://cdn.discordapp.com/avatars/1483876630270050436/77ecef8c4490049e46a5855d62421b32.png",
        "https://cdn.discordapp.com/avatars/319574305274986498/bf19d0bd23a09463fc70c165c01ac4d7.png",
        "https://cdn.discordapp.com/avatars/140412016522166272/f114e2de830842c469657e0da4be9dff.png",
        "https://cdn.discordapp.com/avatars/1141874824931721276/b69ad2d995ea4c4eb07af30c692271f1.png",
        "https://cdn.discordapp.com/avatars/395873307850833921/198fa433114e1b9399fe211471c22540.png",
        "https://cdn.discordapp.com/avatars/607242372719312961/e6413a86b0e0ae0cda049bb09fa3ece8.png",
        "https://cdn.discordapp.com/avatars/960170719407382569/d5f43ac41f6cf70b1f9680551abeeeeb.png",
        "https://cdn.discordapp.com/avatars/634426181793349652/4210b37fb20e889cd4ba45b45cd145a8.png",
        "https://cdn.discordapp.com/avatars/506560844784467991/a5d1548a271784067f7636ad675cf884.png",
        "https://cdn.discordapp.com/avatars/432279612572303370/926fd77c4876517832eb4ce799da85c3.png",
        "https://cdn.discordapp.com/avatars/1321510684189655060/9a6fbaa786c4316b12826f1b66e106aa.png",
        "https://cdn.discordapp.com/avatars/739388055546232893/7751079f928efe771e8c22af38677112.png",
        "https://cdn.discordapp.com/avatars/1224486850903802038/ede0a08c8b7fcc4d6cd3363a6079ac27.png",
        "https://cdn.discordapp.com/avatars/444067403002019841/443cae64e9e153cff3ad76a08e16e8b7.png",
        "https://cdn.discordapp.com/avatars/744546636608569384/01eab0ff7a607090f921735e02c4d63d.png"
      ];
      let loaded = 0;
      const preloadPromise = Promise.all(avatarUrls.map(url => new Promise(resolve => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          targetProgress = Math.max(targetProgress, 35 + Math.round((loaded / avatarUrls.length) * 45));
          status.textContent = "PRELOADING BRACKET (" + loaded + "/" + avatarUrls.length + ")";
          resolve();
        };
        img.src = url;
      })));
      tasks.push(preloadPromise);

      const docReady = new Promise(resolve => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", resolve, { once: true });
      });
      tasks.push(docReady);

      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));

      Promise.race([
        Promise.all(tasks),
        timeoutPromise
      ]).then(() => {
        targetProgress = 100;
        status.textContent = "ALL ASSETS READY";
      });
    })();
  </script>
`;
    indexHtml = indexHtml.replace(bodyTag, bodyTag + loaderCode);
  }
}

// 8. Ensure early theme restore and theme.css link in <head>
const earlyThemeRestoreScript = `<script>
    (function () {
      try {
        function readTheme() {
          try {
            var l = localStorage.getItem("ngt_gender_theme");
            if (l === "boy" || l === "girl") return l;
          } catch(e) {}
          try {
            var s = sessionStorage.getItem("ngt_gender_theme");
            if (s === "boy" || s === "girl") return s;
          } catch(e) {}
          try {
            var m = document.cookie.match(/(?:^|; )ngt_gender_theme=([^;]*)/);
            if (m && (m[1] === "boy" || m[1] === "girl")) return m[1];
          } catch(e) {}
          try {
            if (window.name && (window.name === "ngt_theme:boy" || window.name === "ngt_theme:girl")) {
              return window.name.replace("ngt_theme:", "");
            }
          } catch(e) {}
          return null;
        }
        var savedTheme = readTheme();
        if (savedTheme === "boy" || savedTheme === "girl") {
          document.documentElement.setAttribute("data-theme", savedTheme);
          document.documentElement.classList.add("has-theme");
        }
      } catch (e) {}
    })();
  </script>
  <link rel="stylesheet" href="theme.css">
  `;

if (!indexHtml.includes('href="theme.css"')) {
  indexHtml = indexHtml.replace('</head>', `${earlyThemeRestoreScript}</head>`);
}

// 9. Ensure theme switcher is completely removed from header nav
indexHtml = indexHtml.replace(/\s*<li>\s*<button id="theme-switch-btn"[\s\S]*?<\/button>\s*<\/li>/gi, '');

// 10. Inject opening gender selector overlay and controller script
// Remove old gender selector block if present so we can update cleanly
indexHtml = indexHtml.replace(/<!-- EXPANDING THEME WASH TRANSITION LAYER -->[\s\S]*?<\/script>\s*(?=\s*<!-- FIRSTHAND SITE LOADER -->|<header)/i, '');

const bodyMatch = indexHtml.match(/<body[^>]*>/);
if (bodyMatch) {
  const bodyTag = bodyMatch[0];
  const selectorHtml = `
  <!-- EXPANDING THEME WASH TRANSITION LAYER -->
  <div id="theme-expand-wash" class="theme-expand-wash" aria-hidden="true"></div>

  <!-- INTERACTIVE OPENING QUESTION SELECTOR OVERLAY (Hidden by default to prevent FOUC on reload) -->
  <div id="gender-selector" role="dialog" aria-modal="true" aria-label="Visual Personality Selector" style="display: none;">
    <div class="selector-ambient-layer"></div>
    <div class="selector-bg-grid"></div>

    <div class="selector-container">
      <h1 class="selector-title">are you a boy or girl?</h1>

      <div class="selector-options">
        <!-- BOY OPTION -->
        <button id="select-boy-btn" type="button" class="gender-card card-boy" aria-label="Boy">
          <span class="card-label">BOY</span>
        </button>

        <!-- GIRL OPTION -->
        <button id="select-girl-btn" type="button" class="gender-card card-girl" aria-label="Girl">
          <span class="card-label">GIRL</span>
        </button>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const THEME_KEY = "ngt_gender_theme";
      const selector = document.getElementById("gender-selector");
      const wash = document.getElementById("theme-expand-wash");
      const boyBtn = document.getElementById("select-boy-btn");
      const girlBtn = document.getElementById("select-girl-btn");

      function saveTheme(theme) {
        try { localStorage.setItem(THEME_KEY, theme); } catch(e) {}
        try { sessionStorage.setItem(THEME_KEY, theme); } catch(e) {}
        try { document.cookie = "ngt_gender_theme=" + theme + "; path=/; max-age=31536000; SameSite=Lax"; } catch(e) {}
        try { window.name = "ngt_theme:" + theme; } catch(e) {}
      }

      function getSavedTheme() {
        try {
          var l = localStorage.getItem(THEME_KEY);
          if (l === "boy" || l === "girl") return l;
        } catch(e) {}
        try {
          var s = sessionStorage.getItem(THEME_KEY);
          if (s === "boy" || s === "girl") return s;
        } catch(e) {}
        try {
          var m = document.cookie.match(/(?:^|; )ngt_gender_theme=([^;]*)/);
          if (m && (m[1] === "boy" || m[1] === "girl")) return m[1];
        } catch(e) {}
        try {
          if (window.name && (window.name === "ngt_theme:boy" || window.name === "ngt_theme:girl")) {
            return window.name.replace("ngt_theme:", "");
          }
        } catch(e) {}
        return null;
      }

      const storedTheme = getSavedTheme();

      if (storedTheme === "boy" || storedTheme === "girl") {
        document.documentElement.setAttribute("data-theme", storedTheme);
        document.documentElement.classList.add("has-theme");
        if (selector) {
          selector.style.display = "none";
          selector.remove();
        }
      } else {
        // First-time visitors: unhide selector and attach listeners
        if (selector) {
          selector.style.display = "flex";

          boyBtn?.addEventListener("mouseenter", () => selector.classList.add("hover-boy"));
          boyBtn?.addEventListener("mouseleave", () => selector.classList.remove("hover-boy"));
          girlBtn?.addEventListener("mouseenter", () => selector.classList.add("hover-girl"));
          girlBtn?.addEventListener("mouseleave", () => selector.classList.remove("hover-girl"));

          const handleSelect = (theme) => {
            saveTheme(theme);
            document.documentElement.setAttribute("data-theme", theme);
            document.documentElement.classList.add("has-theme");

            if (wash) {
              wash.className = "theme-expand-wash active-" + theme;
            }

            setTimeout(() => {
              selector.classList.add("is-dismissed");
              setTimeout(() => {
                if (wash) {
                  wash.className = "theme-expand-wash";
                }
                selector.remove();
              }, 750);
            }, 300);
          };

          boyBtn?.addEventListener("click", () => handleSelect("boy"));
          girlBtn?.addEventListener("click", () => handleSelect("girl"));

          boyBtn?.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelect("boy");
            }
          });
          girlBtn?.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelect("girl");
            }
          });
        }
      }

      window.__openThemeSelector = () => {
        try { localStorage.removeItem(THEME_KEY); } catch(e) {}
        try { sessionStorage.removeItem(THEME_KEY); } catch(e) {}
        try { document.cookie = "ngt_gender_theme=; path=/; max-age=0"; } catch(e) {}
        try { window.name = ""; } catch(e) {}
        window.location.reload();
      };
    })();
  </script>
`;
  indexHtml = indexHtml.replace(bodyTag, bodyTag + selectorHtml);
}
// 7. Update hero video to local file in videos subfolder
indexHtml = indexHtml.replace(
  '<source src="background.mp4" type="video/mp4" data-astro-cid-4z5ypzu4>',
  '<source src="videos/Comp%201_9.mp4" type="video/mp4" data-astro-cid-4z5ypzu4>'
);
indexHtml = indexHtml.replace(
  /const videoUrl = event\.detail\?\.backgroundVideoUrl;\s+if \(!videoUrl\) return;/,
  'const videoUrl = event.detail?.backgroundVideoUrl;\n      if (!videoUrl || videoUrl.includes("background_v1783289610658.mp4")) return;'
);

// 8. Remove Sponsors section completely
indexHtml = indexHtml.replace(/<section id="sponsors"[\s\S]*?<\/section>/i, '');

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Successfully updated index.html with all features (bracket, winners layout, site-loader, theme system, hero video, sponsors removed)!');


