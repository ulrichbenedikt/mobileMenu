(() => {
	class MobileMenu {
		constructor(selector, options) {
			this.selector = selector;
			this.options = Object.assign({}, MobileMenu.defaults, options);
			this.nav = null;
			this.toggleBtn = null;
			this.backBtn = null;
			this._stack = [];
			this._isOpen = false;
			this._isMobile = false;
			this._mq = null;
			this._onToggleClick = null;
			this._onNavClick = null;
			this._onBackClick = null;
			this._onMqChange = null;
		}

		mount() {
			this.nav = document.querySelector(this.selector);
			if (!this.nav) return this;

			// Find toggle button — scoped by selector value or fall back to any on page
			this.toggleBtn =
				document.querySelector(`[data-mobile-menu-toggle="${this.selector}"]`) ||
				document.querySelector('[data-mobile-menu-toggle]');

			// Back button lives inside the nav, provided by the website
			this.backBtn = this.nav.querySelector('[data-mobile-menu-back]');

			this._initAria();
			this._bindEvents();
			this._initBreakpoint();

			return this;
		}

		// ── Private ──────────────────────────────────────────────────────────────

		_initAria() {
			this.nav.querySelectorAll('[data-submenu]').forEach((panel) => {
				panel.setAttribute('aria-hidden', 'true');
			});
			if (this.toggleBtn) {
				this.toggleBtn.setAttribute('aria-expanded', 'false');
			}
			if (this.backBtn) {
				this.backBtn.setAttribute('aria-hidden', 'true');
			}
		}

		_bindEvents() {
			this._onToggleClick = () => this._toggleMenu();
			this._onNavClick = (e) => this._handleNavClick(e);

			if (this.toggleBtn) {
				this.toggleBtn.addEventListener('click', this._onToggleClick);
			}
			this.nav.addEventListener('click', this._onNavClick);

			if (this.backBtn) {
				this._onBackClick = () => this._goBack();
				this.backBtn.addEventListener('click', this._onBackClick);
			}
		}

		_handleNavClick(e) {
			const trigger = e.target.closest('[data-submenu-trigger]');
			if (trigger) {
				e.preventDefault();
				this._openPanel(trigger.getAttribute('data-submenu-trigger'));
			}
		}

		_initBreakpoint() {
			this._mq = window.matchMedia(`(max-width: ${this.options.breakpoint - 1}px)`);
			this._isMobile = this._mq.matches;
			this._onMqChange = (e) => {
				this._isMobile = e.matches;
				if (!e.matches) this._closeAll();
			};
			this._mq.addEventListener('change', this._onMqChange);
		}

		_toggleMenu() {
			this._isOpen ? this._closeAll() : this._openMenu();
		}

		_openMenu() {
			this._isOpen = true;
			this._stack = [];
			this.nav.classList.add(this.options.openClass);
			if (this.toggleBtn) {
				this.toggleBtn.classList.add(this.options.openClass);
				this.toggleBtn.setAttribute('aria-expanded', 'true');
			}
		}

		_closeAll() {
			this._isOpen = false;
			this._stack = [];
			this.nav.querySelectorAll('[data-submenu]').forEach((panel) => {
				panel.classList.remove(this.options.activeClass);
				panel.setAttribute('aria-hidden', 'true');
			});
			this.nav.classList.remove(this.options.openClass);
			if (this.toggleBtn) {
				this.toggleBtn.classList.remove(this.options.openClass);
				this.toggleBtn.setAttribute('aria-expanded', 'false');
			}
			this._updateBackButton();
		}

		_openPanel(panelId) {
			const panel = this.nav.querySelector(`[data-submenu="${panelId}"]`);
			if (!panel) return;
			this._stack.push(panelId);
			panel.classList.add(this.options.activeClass);
			panel.setAttribute('aria-hidden', 'false');
			this._updateBackButton();
		}

		_goBack() {
			if (this._stack.length === 0) return;
			const currentId = this._stack.pop();
			const currentPanel = this.nav.querySelector(`[data-submenu="${currentId}"]`);
			if (currentPanel) {
				currentPanel.classList.remove(this.options.activeClass);
				currentPanel.setAttribute('aria-hidden', 'true');
			}
			this._updateBackButton();
		}

		_updateBackButton() {
			if (!this.backBtn) return;
			const active = this._stack.length > 0;
			this.backBtn.classList.toggle(this.options.activeClass, active);
			this.backBtn.setAttribute('aria-hidden', active ? 'false' : 'true');
		}

		// ── Public API ───────────────────────────────────────────────────────────

		open() {
			this._openMenu();
			return this;
		}

		close() {
			this._closeAll();
			return this;
		}

		destroy() {
			if (this.toggleBtn) {
				this.toggleBtn.removeEventListener('click', this._onToggleClick);
			}
			this.nav.removeEventListener('click', this._onNavClick);
			if (this.backBtn && this._onBackClick) {
				this.backBtn.removeEventListener('click', this._onBackClick);
			}
			if (this._mq) {
				this._mq.removeEventListener('change', this._onMqChange);
			}
			return this;
		}
	}

	MobileMenu.defaults = {
		breakpoint: 900,
		openClass: 'is-open',
		activeClass: 'is-active',
	};

	globalThis.MobileMenu = MobileMenu;
})();
