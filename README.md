# MobileMenu

A lightweight, dependency-free JavaScript library for mobile navigation menus. It works with your existing HTML by reading `data-` attributes. The script only manages classes and ARIA attributes; all visual design is yours.

Submenus slide in from the right and fully cover the nav panel. Multi-level nesting is supported via a built-in navigation stack.

---

## Installation

Load both files from jsDelivr. Add the stylesheet in `<head>` and the script before `</body>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ulrichbenedikt/mobileMenu@latest/mobile-menu.css">
<script src="https://cdn.jsdelivr.net/gh/ulrichbenedikt/mobileMenu@latest/index.js"></script>
```

To pin a specific version, replace `@latest` with the desired version like `@v1.0.0`.

---

## Quick Start

```html
<!-- 1. Toggle button -->
<button data-mobile-menu-toggle>Menu</button>

<!-- 2. Nav with submenus — give it a unique id -->
<div id="main-nav">
  <!-- Back button — one per nav, shown/hidden automatically -->
  <button data-mobile-menu-back>← Back</button>

  <a href="/about">About</a>
  <div data-submenu-trigger="products">Products</div>

  <div data-submenu="products">
    <a href="/cat-a">Category A</a>
    <a href="/cat-b">Category B</a>
  </div>
</div>

<!-- 3. Initialise with the nav's id -->
<script>
  new MobileMenu('#main-nav').mount();
</script>
```

The script wires up all interactions. The back button is yours to place and style — the library shows and hides it automatically based on the current navigation depth.

---

## HTML Attributes

### On the nav container

| Attribute | Required | Description |
|---|---|---|
| `id="your-id"` | Yes | The ID passed to the `MobileMenu` constructor. Using an ID guarantees the element is unique on the page |

### On the toggle button

| Attribute | Required | Description |
|---|---|---|
| `data-mobile-menu-toggle` | Yes | Marks the button that opens/closes the mobile nav. With a single menu on the page this is sufficient |
| `data-mobile-menu-toggle="#your-id"` | No | Scopes the toggle to a specific nav when multiple menus exist on the same page (value must match the ID passed to the constructor) |

### On nav items

| Attribute | Required | Description |
|---|---|---|
| `data-submenu-trigger="id"` | — | Clicking this element opens the submenu panel whose `data-submenu` value matches `id`. Use a `<div>` or `<p>`, not `<a>`, to avoid triggering native link/menu behaviour in site builders like Webflow |
| `data-submenu="id"` | — | Marks a submenu panel. Must match the `id` used on its trigger |
| `data-mobile-menu-back` | — | Marks the back button. Place it once anywhere inside the nav. The library shows it when a submenu is open and hides it at root level |

---

## Options

Pass an options object as the second argument to the constructor.

```js
new MobileMenu('#main-nav', {
  breakpoint: 900,
  activeClass: 'is-active',
  animationDuration: 300,
  animationEasing: 'ease',
}).mount();
```

| Option | Type | Default | Description |
|---|---|---|---|
| `breakpoint` | `number` | `900` | The library is active below this pixel width. At or above it, all menus are closed and interactions are disabled |
| `activeClass` | `string` | `'is-active'` | Class added to a `[data-submenu]` panel when it is visible. Also added to `[data-mobile-menu-back]` when a submenu is open |
| `animationDuration` | `number` | `300` | Slide-in/slide-out duration in milliseconds |
| `animationEasing` | `string` | `'ease'` | CSS `transition-timing-function` value for the slide transition. Keyword values: `'ease'` `'linear'` `'ease-in'` `'ease-out'` `'ease-in-out'`. Custom curve: `'cubic-bezier(x1, y1, x2, y2)'` e.g. `'cubic-bezier(0.4, 0, 0.2, 1)'`. Step function: `'steps(n)'` e.g. `'steps(4)'` |

---

## Methods

All methods return `this`, so they are chainable.

```js
const menu = new MobileMenu('#main-nav').mount();

menu.open();    // programmatically open the nav
menu.close();   // programmatically close the nav and reset to root level
menu.destroy(); // remove all event listeners
```

---

## CSS

The `mobile-menu.css` file included in this repository (and available via jsDelivr) contains all structural styles needed for the slide-in behaviour. Load it and you're done — no further CSS is required for the mechanics to work.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ulrichbenedikt/mobileMenu@v.1.0.0/mobile-menu.css">
```

The file covers:
- Positioning submenu panels to cover the nav
- The slide-in/slide-out transition
- Showing and hiding the back button based on navigation depth

---

## Back Button

Place **one** back button anywhere inside the nav and mark it with `data-mobile-menu-back`. The library handles the rest:

```html
<nav id="main-nav">
  <button data-mobile-menu-back>← Back</button>
  <!-- rest of nav -->
</nav>
```

- **Hidden** at root level (no submenu open) — `display: none` via `mobile-menu.css`
- **Visible** (`is-active` class added) as soon as any submenu opens
- **Clicking it** goes back exactly one level in the navigation stack
- **Closing the burger menu** resets the stack to root and hides the button again

Style it with the attribute selector:

```css
[data-mobile-menu-back] {
  /* your styles */
}
```

---

## Multi-Level Nesting

Place a `data-submenu-trigger` inside a `[data-submenu]` panel to create nested submenus. The library maintains a navigation stack internally, so the back button always returns to the correct parent level regardless of depth.

```html
<nav id="main-nav">
  <button data-mobile-menu-back>← Back</button>

  <div data-submenu-trigger="products">Products</div>

  <div data-submenu="products">
    <a href="/overview">Overview</a>
    <div data-submenu-trigger="clothing">Clothing</div>
  </div>

  <div data-submenu="clothing">
    <a href="/shirts">Shirts</a>
    <a href="/pants">Pants</a>
  </div>

</nav>
```

There is no hard limit on nesting depth.

---

## Multiple Menus on the Same Page

Create a separate instance for each menu. Scope toggle buttons by setting `data-mobile-menu-toggle` to the nav's ID:

```html
<button data-mobile-menu-toggle="#main-nav">Main menu</button>
<nav id="main-nav">...</nav>

<button data-mobile-menu-toggle="#footer-nav">Footer menu</button>
<nav id="footer-nav">...</nav>
```

```js
new MobileMenu('#main-nav').mount();
new MobileMenu('#footer-nav').mount();
```

---

## Webflow Integration

This library is designed to work alongside Webflow's native nav component. Webflow handles opening and closing the nav overlay via its own hamburger button — MobileMenu only manages the submenu panel navigation inside it.

### Element type for triggers

**Never use a Webflow Link, Nav Link, or Button element as a `data-submenu-trigger`.** Webflow attaches its own click handlers to these elements that close the mobile nav overlay when clicked, which breaks the submenu behaviour.

Use a plain **Div Block** or **Text Block** instead:

```html
<!-- ✗ Wrong — Webflow link closes the overlay on click -->
<a href="#" data-submenu-trigger="products">Products</a>

<!-- ✓ Correct — plain div, no Webflow handlers -->
<div data-submenu-trigger="products">Products</div>
```

### Setup steps in Webflow

1. Select the **Nav Menu** element → Element Settings → set an **ID** (e.g. `main-nav`)
2. Add a **Div Block** inside the Nav Menu for your mobile content
3. Use **Div Blocks** (not Nav Links or Links) as submenu triggers, marked with the `data-submenu-trigger` custom attribute
4. Add the back button element with the `data-mobile-menu-back` custom attribute
5. Do **not** add `data-mobile-menu-toggle` to Webflow's hamburger — Webflow's own script already controls it
6. Initialise in a before-`</body>` embed:

```html
<script>
  new MobileMenu('#main-nav').mount();
</script>
```

---

## Accessibility

The library automatically manages the following ARIA attributes:

| Attribute | Element | Value |
|---|---|---|
| `aria-expanded` | Toggle button | `true` when open, `false` when closed |
| `aria-hidden` | Each `[data-submenu]` panel | `false` when active, `true` otherwise |
| `aria-hidden` | `[data-mobile-menu-back]` | `false` when a submenu is open, `true` at root level |

---

## Browser Support

Uses `matchMedia`, `closest`, `prepend`, and `addEventListener` — supported in all modern browsers.
