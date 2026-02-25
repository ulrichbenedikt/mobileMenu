# MobileMenu

A lightweight, dependency-free JavaScript library for mobile navigation menus. It works with your existing HTML by reading `data-` attributes — no markup is generated, no CSS is injected. The script only manages classes and ARIA attributes; all visual design is yours.

Submenus slide in from the right and fully cover the nav panel. Multi-level nesting is supported via a built-in navigation stack.

---

## Installation

Load the script directly from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/ulrichbenedikt/mobileMenu@v.1.0.0/index.js"></script>
```

To pin a specific version, replace `@latest` with a tag, e.g. `@1.0.0`.

---

## Quick Start

```html
<!-- 1. Toggle button -->
<button data-mobile-menu-toggle>Menu</button>

<!-- 2. Nav with submenus -->
<nav data-mobile-menu>
  <a href="/about">About</a>
  <a href="#" data-submenu-trigger="products">Products</a>

  <div data-submenu="products">
    <a href="/cat-a">Category A</a>
    <a href="/cat-b">Category B</a>
  </div>
</nav>

<!-- 3. Initialise -->
<script>
  new MobileMenu('[data-mobile-menu]').mount();
</script>
```

That's it. The script injects a back button into each submenu panel and wires up all interactions.

---

## HTML Attributes

### On the nav container

| Attribute | Required | Description |
|---|---|---|
| `data-mobile-menu` | Yes | Marks the nav element the library controls |

### On the toggle button

| Attribute | Required | Description |
|---|---|---|
| `data-mobile-menu-toggle` | Yes | Marks the button that opens/closes the mobile nav |
| `data-mobile-menu-toggle="[selector]"` | No | Scopes the toggle to a specific nav when multiple menus exist on the same page (value must match the constructor selector) |

### On nav items

| Attribute | Required | Description |
|---|---|---|
| `data-submenu-trigger="id"` | — | Clicking this element opens the submenu panel whose `data-submenu` value matches `id` |
| `data-submenu="id"` | — | Marks a submenu panel. Must match the `id` used on its trigger |

---

## Options

Pass an options object as the second argument to the constructor.

```js
new MobileMenu('[data-mobile-menu]', {
  breakpoint: 900,
  openClass:  'is-open',
  activeClass: 'is-active',
  backLabel:  '← Back',
}).mount();
```

| Option | Type | Default | Description |
|---|---|---|---|
| `breakpoint` | `number` | `900` | The library is active below this pixel width. At or above it, all menus are closed and interactions are disabled |
| `openClass` | `string` | `'is-open'` | Class added to the nav and toggle button when the menu is open |
| `activeClass` | `string` | `'is-active'` | Class added to a `[data-submenu]` panel when it is visible |
| `backLabel` | `string` | `'← Back'` | Text content of the back button injected into each submenu panel |

---

## Methods

All methods return `this`, so they are chainable.

```js
const menu = new MobileMenu('[data-mobile-menu]').mount();

menu.open();    // programmatically open the nav
menu.close();   // programmatically close the nav and all submenus
menu.destroy(); // remove all injected elements and event listeners
```

---

## CSS

The library does not inject any styles. You must write the CSS yourself. The classes the library adds act as hooks.

### Minimum required CSS

```css
/* The nav must be a positioned container so panels can overlay it */
[data-mobile-menu] {
  position: relative;
  overflow: hidden;
}

/* Hide the nav on mobile until the toggle opens it */
@media (max-width: 899px) {
  [data-mobile-menu] {
    display: none;
  }
  [data-mobile-menu].is-open {
    display: block;
  }
}

/* Panels sit on top of the nav, initially off-screen to the right */
[data-submenu] {
  position: absolute;
  inset: 0;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

/* Slide into view when active */
[data-submenu].is-active {
  transform: translateX(0);
}
```

> **Note:** The `@media` breakpoint in your CSS should match the `breakpoint` option passed to the constructor (default `900`, so the media query uses `max-width: 899px`).

---

## Back Button

When `mount()` is called, the library automatically prepends a `<button>` to each `[data-submenu]` panel:

```html
<button type="button" data-back-btn>← Back</button>
```

Style it however you like using the `[data-back-btn]` attribute selector:

```css
[data-back-btn] {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* ... */
}
```

The button text is controlled by the `backLabel` option.

---

## Multi-Level Nesting

Place a `data-submenu-trigger` inside a `[data-submenu]` panel to create nested submenus. The library maintains a navigation stack internally, so the back button always returns to the correct parent level regardless of depth.

```html
<nav data-mobile-menu>

  <a href="#" data-submenu-trigger="products">Products</a>

  <div data-submenu="products">
    <!-- auto-injected back button returns to root nav -->
    <a href="/overview">Overview</a>
    <a href="#" data-submenu-trigger="clothing">Clothing</a>
  </div>

  <div data-submenu="clothing">
    <!-- auto-injected back button returns to "products" panel -->
    <a href="/shirts">Shirts</a>
    <a href="/pants">Pants</a>
  </div>

</nav>
```

There is no hard limit on nesting depth.

---

## Multiple Menus on the Same Page

Create a separate instance for each menu and scope toggle buttons using the attribute value:

```html
<button data-mobile-menu-toggle="[data-mobile-menu='main']">Main menu</button>
<nav data-mobile-menu="main">...</nav>

<button data-mobile-menu-toggle="[data-mobile-menu='footer']">Footer menu</button>
<nav data-mobile-menu="footer">...</nav>
```

```js
new MobileMenu('[data-mobile-menu="main"]').mount();
new MobileMenu('[data-mobile-menu="footer"]').mount();
```

---

## Accessibility

The library automatically manages the following ARIA attributes:

| Attribute | Element | Value |
|---|---|---|
| `aria-expanded` | Toggle button | `true` when open, `false` when closed |
| `aria-hidden` | Each `[data-submenu]` panel | `false` when active, `true` otherwise |

---

## Browser Support

Uses `matchMedia`, `closest`, `prepend`, and `addEventListener` — supported in all modern browsers.
