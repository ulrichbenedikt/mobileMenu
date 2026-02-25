(() => {
	class MobileMenu {
		constructor(selector, options) {
			this.selector = selector;
			this.options = Object.assign({}, MobileMenu.defaults, options);
			this.nav = null;
			this.toggleBtn = null;
			this._stack = [];
			this._isOpen = false;
			this._isMobile = false;
			this._mq = null;
			this._onToggleClick = null;
			this._onNavClick = null;
			this._onMqChange = null;
		}

		mount() {
			this.nav = document.querySelector(this.selector);
			if (!this.nav) return this;

			// Find toggle button — scoped by selector value or fall back to any on page
			this.toggleBtn =
				document.querySelector(`[data-mobile-menu-toggle="${this.selector}"]`) ||
				document.querySelector('[data-mobile-menu-toggle]');

			this._injectBackButtons();
			this._initAria();
			this._bindEvents();
			this._initBreakpoint();

			return this;
		}

		// ── Private ──────────────────────────────────────────────────────────────

		_injectBackButtons() {
			this.nav.querySelectorAll('[data-submenu]').forEach((panel) => {
				if (panel.querySelector('[data-back-btn]')) return;
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.setAttribute('data-back-btn', '');
				btn.textContent = this.options.backLabel;
				panel.prepend(btn);
			});
		}

		_initAria() {
			this.nav.querySelectorAll('[data-submenu]').forEach((panel) => {
				panel.setAttribute('aria-hidden', 'true');
			});
			if (this.toggleBtn) {
				this.toggleBtn.setAttribute('aria-expanded', 'false');
			}
		}

		_bindEvents() {
			this._onToggleClick = () => this._toggleMenu();
			this._onNavClick = (e) => this._handleNavClick(e);

			if (this.toggleBtn) {
				this.toggleBtn.addEventListener('click', this._onToggleClick);
			}
			this.nav.addEventListener('click', this._onNavClick);
		}

		_handleNavClick(e) {
			if (!this._isMobile) return;

			const trigger = e.target.closest('[data-submenu-trigger]');
			if (trigger) {
				e.preventDefault();
				this._openPanel(trigger.getAttribute('data-submenu-trigger'));
				return;
			}

			const backBtn = e.target.closest('[data-back-btn]');
			if (backBtn) {
				this._goBack();
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
		}

		_openPanel(panelId) {
			const panel = this.nav.querySelector(`[data-submenu="${panelId}"]`);
			if (!panel) return;
			this._stack.push(panelId);
			panel.classList.add(this.options.activeClass);
			panel.setAttribute('aria-hidden', 'false');
		}

		_goBack() {
			if (this._stack.length === 0) return;
			const currentId = this._stack.pop();
			const currentPanel = this.nav.querySelector(`[data-submenu="${currentId}"]`);
			if (currentPanel) {
				currentPanel.classList.remove(this.options.activeClass);
				currentPanel.setAttribute('aria-hidden', 'true');
			}
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
			if (this._mq) {
				this._mq.removeEventListener('change', this._onMqChange);
			}
			this.nav.querySelectorAll('[data-back-btn]').forEach((btn) => btn.remove());
			return this;
		}
	}

	MobileMenu.defaults = {
		breakpoint: 900,
		openClass: 'is-open',
		activeClass: 'is-active',
		backLabel: '← Back',
	};

	globalThis.MobileMenu = MobileMenu;
})();
