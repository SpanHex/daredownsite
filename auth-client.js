// auth-client.js
// Universal DAREDOWN Authentication & Theme State Synchronization Client
// Works across all pages: index, register, rules, ngc, judge, admin.

(function () {
  'use strict';

  const THEME_KEY = 'ngt_gender_theme';

  // Helper: Read stored theme (returns null if not explicitly set)
  function getStoredTheme() {
    try {
      const l = localStorage.getItem(THEME_KEY);
      if (l === 'boy' || l === 'girl') return l;
    } catch (_) {}
    try {
      const s = sessionStorage.getItem(THEME_KEY);
      if (s === 'boy' || s === 'girl') return s;
    } catch (_) {}
    try {
      const m = document.cookie.match(/(?:^|; )ngt_gender_theme=([^;]*)/);
      if (m && (m[1] === 'boy' || m[1] === 'girl')) return m[1];
    } catch (_) {}
    try {
      if (window.name && (window.name === 'ngt_theme:boy' || window.name === 'ngt_theme:girl')) {
        return window.name.replace('ngt_theme:', '');
      }
    } catch (_) {}
    return null; // Strict: NEVER default to 'boy' or 'girl'
  }

  // Helper: Save theme to all client stores
  function persistTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    try { sessionStorage.setItem(THEME_KEY, theme); } catch (_) {}
    try { document.cookie = `ngt_gender_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`; } catch (_) {}
    try { window.name = `ngt_theme:${theme}`; } catch (_) {}
  }

  // Cross-tab broadcast channels (with fallbacks)
  let authChannel = null;
  let themeChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      authChannel = new BroadcastChannel('daredown_auth_sync');
      themeChannel = new BroadcastChannel('daredown_theme_sync');
    }
  } catch (_) {}

  const Auth = {
    user: null,
    theme: getStoredTheme(),
    isInitialized: false,

    // Returns current user or null
    getUser() {
      return this.user;
    },

    // Apply active theme immediately to DOM and persist
    setTheme(theme, syncBackend = true) {
      if (theme !== 'boy' && theme !== 'girl') return;
      this.theme = theme;
      persistTheme(theme);

      document.documentElement.classList.remove('needs-theme-select');
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.add('has-theme');

      // Dismiss opening selector if present
      const selector = document.getElementById('gender-selector');
      if (selector) {
        selector.classList.add('is-dismissed');
        setTimeout(() => {
          try { selector.style.display = 'none'; } catch (_) {}
        }, 600);
      }

      // Update any theme indicators on page
      document.querySelectorAll('.theme-toggle-pill, #theme-toggle-btn').forEach(btn => {
        const text = btn.querySelector('.theme-toggle-text');
        if (text) text.textContent = theme.toUpperCase();
        btn.setAttribute('aria-label', `Current style: ${theme}. Click to switch.`);
      });

      // Update modal / dropdown buttons if present
      document.querySelectorAll('#theme-switch-menu-btn').forEach(btn => {
        btn.textContent = `Style: ${theme.toUpperCase()} (Switch)`;
      });

      // Sync with MongoDB backend if user is authenticated
      if (syncBackend && this.user) {
        fetch('/api/auth/theme', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme })
        }).catch(() => {});
      }

      // Broadcast to other tabs
      try {
        if (themeChannel) {
          themeChannel.postMessage({ type: 'THEME_CHANGE', theme });
        }
      } catch (_) {}

      window.dispatchEvent(new CustomEvent('theme:change', { detail: { theme } }));
    },

    // Toggle between boy and girl
    toggleTheme() {
      const next = this.theme === 'girl' ? 'boy' : 'girl';
      this.setTheme(next, true);
    },

    // Immediately sets user into client state and renders UI
    setUser(user) {
      this.user = user;
      try {
        if (user) {
          localStorage.setItem('ngt_token', 'session_active');
          localStorage.setItem('ngt_user', JSON.stringify(user));
        }
      } catch (_) {}

      if (user?.themePreference && user.themePreference !== this.theme) {
        this.setTheme(user.themePreference, false);
      }
      this.renderUI();
      this.syncLiveBracket();

      try {
        if (authChannel) {
          authChannel.postMessage({ type: 'AUTH_LOGIN', user });
        }
      } catch (_) {}

      window.dispatchEvent(new CustomEvent('auth:statechange', { detail: { user: this.user } }));
    },

    // Immediately clears user from client state and renders UI
    clearUser() {
      this.user = null;
      try {
        localStorage.removeItem('ngt_token');
        localStorage.removeItem('ngt_user');
      } catch (_) {}
      this.renderUI();

      try {
        if (authChannel) {
          authChannel.postMessage({ type: 'AUTH_LOGOUT' });
        }
      } catch (_) {}

      window.dispatchEvent(new CustomEvent('auth:statechange', { detail: { user: null } }));
    },

    // Check actual session with server
    async checkAuth() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' }
        });

        if (!res.ok) {
          this.clearUser();
          return null;
        }

        const data = await res.json();
        const user = data?.user || null;
        if (user) {
          this.setUser(user);
        } else {
          this.clearUser();
        }
        return user;
      } catch (err) {
        // Network error — leave current state intact
        return this.user;
      } finally {
        this.isInitialized = true;
        window.dispatchEvent(new CustomEvent('auth:ready', { detail: { user: this.user } }));
      }
    },

    // Perform logout
    async logout() {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { Accept: 'application/json' }
        });
      } catch (_) {}

      this.clearUser();

      // If user is currently on an admin page, redirect to home
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/';
      }
    },

    // Synchronize and render navbar across all HTML structures
    renderUI() {
      const user = this.user;

      // 1. Primary main site navbar components
      const loginLink = document.getElementById('login-link');
      const authMenu = document.getElementById('auth-menu');
      const avatarButton = document.getElementById('auth-avatar-button');
      const avatarImage = document.getElementById('auth-avatar-image');
      const avatarFallback = document.getElementById('auth-avatar-fallback');
      const judgeLink = document.getElementById('judge-link');
      const adminLink = document.getElementById('admin-link');
      const usernameDisplay = document.getElementById('auth-username-display');

      if (user) {
        // --- LOGGED IN ---
        if (loginLink) loginLink.classList.add('hidden');
        if (authMenu) authMenu.classList.remove('hidden');

        const name = user.displayName || user.username || 'User';
        const initial = name.charAt(0).toUpperCase();

        if (avatarFallback) avatarFallback.textContent = initial;
        if (usernameDisplay) {
          usernameDisplay.textContent = name;
          usernameDisplay.style.cursor = 'pointer';
        }

        // Fix profile link in dropdown to always point to /profile
        const dropdown = document.getElementById('auth-dropdown');
        if (dropdown) {
          const profileItem = dropdown.querySelector('a:first-child');
          if (profileItem) {
            profileItem.setAttribute('href', '/profile');
            profileItem.textContent = 'Profile';
          }
        }

        const avatarSrc = user.avatar || user.avatarUrl;
        if (avatarImage && typeof avatarSrc === 'string' && avatarSrc.length > 0) {
          avatarImage.src = avatarSrc;
          avatarImage.classList.remove('hidden');
          if (avatarFallback) avatarFallback.classList.add('hidden');
        } else if (avatarImage) {
          avatarImage.classList.add('hidden');
          if (avatarFallback) avatarFallback.classList.remove('hidden');
        }

        const userRole = (user.role || '').toLowerCase();
        if (judgeLink) {
          if (userRole === 'jury' || userRole === 'admin') {
            judgeLink.classList.remove('hidden');
            judgeLink.classList.add('block');
          } else {
            judgeLink.classList.add('hidden');
            judgeLink.classList.remove('block');
          }
        }

        if (adminLink) {
          if (userRole === 'admin') {
            adminLink.classList.remove('hidden');
            adminLink.classList.add('block');
          } else {
            adminLink.classList.add('hidden');
            adminLink.classList.remove('block');
          }
        }

      } else {
        // --- LOGGED OUT ---
        if (loginLink) loginLink.classList.remove('hidden');
        if (authMenu) authMenu.classList.add('hidden');
        if (judgeLink) {
          judgeLink.classList.add('hidden');
          judgeLink.classList.remove('block');
        }
        if (adminLink) {
          adminLink.classList.add('hidden');
          adminLink.classList.remove('block');
        }
      }

      // 2. Mobile header & drawer components
      const mobileLogin = document.getElementById('mobile-login-link');
      const mobileAuthMenu = document.getElementById('mobile-auth-menu');
      const mobileUsername = document.getElementById('mobile-auth-username');
      const mobileAvatarImg = document.getElementById('mobile-auth-avatar-img');
      const mobileAvatarFallback = document.getElementById('mobile-auth-avatar-fallback');
      const mobileDropdown = document.getElementById('mobile-auth-dropdown');
      const mobileDropdownUser = document.getElementById('mobile-dropdown-display-name');
      const mobileDropdownRole = document.getElementById('mobile-dropdown-user-role');
      const mobileDropdownJudge = document.getElementById('mobile-dropdown-judge-link');
      const mobileDropdownAdmin = document.getElementById('mobile-dropdown-admin-link');
      const drawerAuthLink = document.getElementById('mobile-drawer-auth-link');
      const drawerJudge = document.getElementById('mobile-drawer-judge-item');
      const drawerAdmin = document.getElementById('mobile-drawer-admin-item');
      const drawerLogout = document.getElementById('mobile-drawer-logout-btn');
      const drawerThemeName = document.getElementById('mobile-drawer-theme-name');

      if (drawerThemeName) {
        drawerThemeName.textContent = this.theme ? this.theme.toUpperCase() : 'THEME';
      }

      if (user) {
        if (mobileLogin) mobileLogin.classList.add('hidden');
        if (mobileAuthMenu) mobileAuthMenu.classList.remove('hidden');

        const name = user.displayName || user.username || 'User';
        const initial = name.charAt(0).toUpperCase();
        const userRole = (user.role || '').toLowerCase();

        if (mobileUsername) mobileUsername.textContent = name;
        if (mobileAvatarFallback) mobileAvatarFallback.textContent = initial;

        if (mobileDropdownUser) mobileDropdownUser.textContent = name;
        if (mobileDropdownRole) {
          if (userRole === 'admin') mobileDropdownRole.textContent = 'Administrator';
          else if (userRole === 'jury') mobileDropdownRole.textContent = 'Host / Jury';
          else mobileDropdownRole.textContent = 'Contestant';
        }

        // Sync avatar image or fallback initial
        const avatarSrc = user.avatar || user.avatarUrl;
        if (mobileAvatarImg && typeof avatarSrc === 'string' && avatarSrc.length > 0) {
          mobileAvatarImg.src = avatarSrc;
          mobileAvatarImg.classList.remove('hidden');
          if (mobileAvatarFallback) mobileAvatarFallback.classList.add('hidden');
        } else if (mobileAvatarImg) {
          mobileAvatarImg.classList.add('hidden');
          if (mobileAvatarFallback) mobileAvatarFallback.classList.remove('hidden');
        }

        if (mobileDropdownJudge) {
          mobileDropdownJudge.classList.toggle('hidden', !(userRole === 'jury' || userRole === 'admin'));
        }
        if (mobileDropdownAdmin) {
          mobileDropdownAdmin.classList.toggle('hidden', userRole !== 'admin');
        }

        if (drawerAuthLink) {
          drawerAuthLink.setAttribute('href', '/profile');
          const span = drawerAuthLink.querySelector('span');
          if (span) span.textContent = `Profile (${name})`;
        }
        if (drawerJudge) drawerJudge.classList.toggle('hidden', !(userRole === 'jury' || userRole === 'admin'));
        if (drawerAdmin) drawerAdmin.classList.toggle('hidden', userRole !== 'admin');
        if (drawerLogout) drawerLogout.classList.remove('hidden');
      } else {
        if (mobileLogin) mobileLogin.classList.remove('hidden');
        if (mobileAuthMenu) mobileAuthMenu.classList.add('hidden');
        if (mobileDropdown) mobileDropdown.classList.add('hidden');

        if (drawerAuthLink) {
          drawerAuthLink.setAttribute('href', '/register/index.html');
          const span = drawerAuthLink.querySelector('span');
          if (span) span.textContent = 'Register / Log In';
        }
        if (drawerJudge) drawerJudge.classList.add('hidden');
        if (drawerAdmin) drawerAdmin.classList.add('hidden');
        if (drawerLogout) drawerLogout.classList.add('hidden');
      }

      // 3. Generic nav containers fallback
      const navLists = document.querySelectorAll('header ol, header ul, .reg-nav');
      navLists.forEach(nav => {
        const links = Array.from(nav.querySelectorAll('a'));
        const regLinks = links.filter(a => {
          const href = a.getAttribute('href') || '';
          const text = a.textContent.toLowerCase().trim();
          return href.includes('register') || text === 'register' || text === 'register / log in' || text === 'join';
        });

        if (user) {
          regLinks.forEach(a => {
            if (a.id !== 'login-link') {
              a.textContent = user.displayName || user.username;
              a.setAttribute('href', '/profile');
              a.setAttribute('title', `Logged in as ${user.displayName || user.username}`);
            }
          });
        } else {
          regLinks.forEach(a => {
            if (a.id !== 'login-link' && !a.closest('footer')) {
              a.textContent = 'Register';
              a.setAttribute('href', '/register/index.html');
            }
          });
        }
      });

      // 4. Update theme toggle pills
      this.updateThemeButtons();
    },

    updateThemeButtons() {
      document.querySelectorAll('.theme-toggle-pill, #theme-toggle-btn').forEach(btn => {
        const text = btn.querySelector('.theme-toggle-text');
        if (text) text.textContent = this.theme ? this.theme.toUpperCase() : 'THEME';
        btn.setAttribute('aria-label', `Current style: ${this.theme || 'none'}. Click to switch.`);
      });
      document.querySelectorAll('#theme-switch-menu-btn').forEach(btn => {
        btn.textContent = `Style: ${this.theme ? this.theme.toUpperCase() : 'SELECT'} (Switch)`;
      });
    },

    // Live bracket synchronization with MongoDB
    async syncLiveBracket() {
      const stage = document.getElementById('bracket-stage');
      if (!stage) return;

      try {
        const res = await fetch('/api/tournament/bracket', {
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !Array.isArray(data.slots)) return;

        data.slots.forEach(slot => {
          const slotEl = stage.querySelector(`.bracket-slot[data-slot-number="${slot.slotNumber}"]`);
          if (!slotEl) return;

          const nameEl = slotEl.querySelector('.bracket-slot-name');
          const isOccupied = slot.isOccupied && (slot.displayName || slot.username);
          const displayName = isOccupied ? (slot.displayName || slot.username) : `Player #${slot.slotNumber}`;

          if (nameEl) {
            nameEl.textContent = displayName;
          }

          let visualEl = slotEl.querySelector('.bracket-slot-visual');
          const avatarUrl = slot.avatar;

          if (isOccupied && avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim().length > 0) {
            if (!visualEl) {
              visualEl = document.createElement('span');
              visualEl.className = 'bracket-slot-visual ' + (slotEl.classList.contains('shift-left') ? 'is-right' : 'is-left');
              visualEl.setAttribute('aria-hidden', 'true');
              slotEl.prepend(visualEl);
            }
            visualEl.innerHTML = `<img src="${avatarUrl}" alt="" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display='none';" />`;
            slotEl.classList.add('has-visual');
          } else {
            if (visualEl) visualEl.remove();
            slotEl.classList.remove('has-visual');
          }
        });
      } catch (_) {}
    },

    // Show opening personality selector
    showSelector() {
      const selector = document.getElementById('gender-selector');
      if (selector) {
        selector.classList.remove('is-dismissed');
        selector.style.display = 'flex';
      }
    },

    // Initialize listeners and check auth
    init() {
      if (this.theme === 'boy' || this.theme === 'girl') {
        this.setTheme(this.theme, false);
      } else {
        document.documentElement.classList.add('needs-theme-select');
        this.showSelector();
      }

      // Listen for cross-tab messages
      if (authChannel) {
        authChannel.onmessage = (e) => {
          if (e.data?.type === 'AUTH_LOGIN') {
            this.user = e.data.user;
            this.renderUI();
          } else if (e.data?.type === 'AUTH_LOGOUT') {
            this.user = null;
            this.renderUI();
          }
        };
      }

      if (themeChannel) {
        themeChannel.onmessage = (e) => {
          if (e.data?.type === 'THEME_CHANGE' && e.data.theme) {
            this.setTheme(e.data.theme, false);
          }
        };
      }

      // Delegate global click events for dropdown, theme toggles, and logout
      document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;

        // Theme toggle button clicked
        const themeBtn = target.closest('.theme-toggle-pill, #theme-toggle-btn, #theme-switch-menu-btn, #mobile-theme-toggle-btn');
        if (themeBtn) {
          e.preventDefault();
          this.toggleTheme();
          return;
        }

        // Logout button clicked
        const logoutBtn = target.closest('#logout-button, #auth-logout-btn, #mobile-drawer-logout-btn, #mobile-dropdown-logout-btn');
        if (logoutBtn) {
          e.preventDefault();
          this.logout();
          return;
        }

        // Desktop avatar menu toggle
        const avatarBtn = target.closest('#auth-avatar-button');
        const dropdown = document.getElementById('auth-dropdown');
        if (avatarBtn && dropdown) {
          e.preventDefault();
          const isHidden = dropdown.classList.contains('hidden');
          dropdown.classList.toggle('hidden', !isHidden);
          avatarBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
          return;
        }

        // Mobile avatar menu toggle
        const mobileAvatarBtn = target.closest('#mobile-auth-trigger, #mobile-auth-avatar-button');
        const mobileDropdown = document.getElementById('mobile-auth-dropdown');
        if (mobileAvatarBtn && mobileDropdown) {
          e.preventDefault();
          const isHidden = mobileDropdown.classList.contains('hidden');
          mobileDropdown.classList.toggle('hidden', !isHidden);
          mobileAvatarBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
          return;
        }

        // Close desktop dropdown when clicking outside
        if (dropdown && !dropdown.classList.contains('hidden')) {
          const authMenu = document.getElementById('auth-menu');
          if (authMenu && !authMenu.contains(target)) {
            dropdown.classList.add('hidden');
            const btn = document.getElementById('auth-avatar-button');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        }

        // Close mobile dropdown when clicking outside
        if (mobileDropdown && !mobileDropdown.classList.contains('hidden')) {
          const mobileAuthWrapper = document.getElementById('mobile-auth-wrapper');
          if (mobileAuthWrapper && !mobileAuthWrapper.contains(target)) {
            mobileDropdown.classList.add('hidden');
            const btn = document.getElementById('mobile-auth-trigger') || document.getElementById('mobile-auth-avatar-button');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Escape key closes dropdowns and mobile drawer
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const dropdown = document.getElementById('auth-dropdown');
          if (dropdown && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
            const btn = document.getElementById('auth-avatar-button');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
          const mobileDropdown = document.getElementById('mobile-auth-dropdown');
          if (mobileDropdown && !mobileDropdown.classList.contains('hidden')) {
            mobileDropdown.classList.add('hidden');
            const btn = document.getElementById('mobile-auth-trigger') || document.getElementById('mobile-auth-avatar-button');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
          const drawer = document.getElementById('mobile-nav-drawer');
          if (drawer && drawer.classList.contains('is-open')) {
            drawer.classList.remove('is-open');
            drawer.setAttribute('aria-hidden', 'true');
            const toggle = document.getElementById('mobile-menu-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('drawer-open');
          }
        }
      });

      // Mobile nav drawer controls
      const drawer = document.getElementById('mobile-nav-drawer');
      const toggleBtn = document.getElementById('mobile-menu-toggle');
      const closeBtn = document.getElementById('mobile-nav-close-btn');

      const openDrawer = (e) => {
        if (e) e.preventDefault();
        // Close mobile profile dropdown if open
        const mobileDropdown = document.getElementById('mobile-auth-dropdown');
        if (mobileDropdown) mobileDropdown.classList.add('hidden');
        const mobileBtn = document.getElementById('mobile-auth-trigger') || document.getElementById('mobile-auth-avatar-button');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');

        if (drawer) {
          drawer.classList.add('is-open');
          drawer.setAttribute('aria-hidden', 'false');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
          document.body.classList.add('drawer-open');
        }
      };

      const closeDrawer = () => {
        if (drawer) {
          drawer.classList.remove('is-open');
          drawer.setAttribute('aria-hidden', 'true');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('drawer-open');
        }
      };

      if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      if (drawer) {
        drawer.addEventListener('click', (e) => {
          if (e.target === drawer) closeDrawer();
        });
        drawer.querySelectorAll('[data-mobile-nav-close], a').forEach(link => {
          link.addEventListener('click', () => {
            setTimeout(closeDrawer, 120);
          });
        });
      }

      const drawerThemeBtn = document.getElementById('mobile-drawer-theme-btn');
      if (drawerThemeBtn) {
        drawerThemeBtn.addEventListener('click', () => {
          this.toggleTheme();
        });
      }

      const drawerLogoutBtn = document.getElementById('mobile-drawer-logout-btn');
      if (drawerLogoutBtn) {
        drawerLogoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
          closeDrawer();
        });
      }

      // Check session
      this.checkAuth();
      this.syncLiveBracket();
    }
  };

  // Expose globally
  window.Auth = Auth;
  window.__openThemeSelector = () => Auth.toggleTheme();

  // Run immediately on script evaluation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Auth.init());
  } else {
    Auth.init();
  }
})();
