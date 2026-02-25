(() => {
	var MobilMenu = class _MobilMenu {
		constructor(selector, options) {
			this.selector = selector;
			this.options = Object.assign({}, _MobilMenu.defaults, options);
			this.el = document.querySelector(selector);
		}
		mount() {
			return this;
		}
	};
	MobilMenu.defaults = {
		breakpoint: 900,
		// ...
	};

	globalThis.MobileMenu = MobilMenu;
})();
