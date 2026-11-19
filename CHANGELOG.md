# Changelog

All notable changes to Sassy are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- A "Coming from Bootstrap" guide, [docs/bootstrap.md](docs/bootstrap.md): what Sassy does differently, and the placeholder or HTML for each Bootstrap 5.3 class and `data-bs-*` attribute. The README has a short summary.
- Colour modes: `%bf-theme-dark` switches an element, such as `html` or a section, and everything in it to dark colours, `%bf-theme-light` switches back, and `%bf-theme-auto` follows the visitor's system setting. Each sets the colour roles, the theme colours, the element's background and text, `color-scheme` and the select chevron. The dark set lifts `primary`, `secondary`, `ok` and `error` to lighter shades, with their `-contrast` worked out again, and button text and the check mark follow it.
- Colour roles on `:root`: `--sassy-body-bg`, `--sassy-surface`, `--sassy-surface-subtle`, `--sassy-line`, `--sassy-line-strong`, `--sassy-muted` and `--sassy-disabled`. Component, form and content colours now default to them, so setting one changes every component that uses it. The light and dark values are `$sassy-roles-light` / `-dark`, and the theme colours `$sassy-theme-light` / `-dark`.
- Dropdowns: `%bf-dropdown` styles a popover menu opened by a `popovertarget` button, placed below it by CSS anchor positioning. `-up` and `-end` change where it opens, `-header` and `-divider` group its items, `%bf-dropdown-toggle` adds a chevron to the button, and `%bf-dropdown-split` makes the chevron button of a split button.
- Scrollspy: in a nav or list of links to sections where one link has `aria-current="location"`, `sassy.js` moves it to the link of the section in view as the page, or the box the sections are in, scrolls. `--sassy-scrollspy-offset` sets how far down a section must be. In a box that scrolls, the links scroll only the box, not the page. Navs, list groups and dropdowns already show the link as current.
- Carousels: `%bf-carousel` makes its children a row of slides that scrolls sideways and snaps to each one, `--sassy-carousel-per-view` at a time. Where browsers support `::scroll-button` and `::scroll-marker`, it has previous and next buttons and a row of dots, with no script.
- `sassy.js` plays a carousel whose slides element has `aria-live="off"`, every `--sassy-carousel-interval`, with a pause button (`aria-pressed` and `aria-controls`), waiting while it is hovered or focused, and starting paused for reduced motion.
- Toasts: `%bf-toast` styles a short message, with a `<header>` it starts with as its title row, closed by a `--dismiss` close button. `%bf-toast-container` stacks toasts in a corner of the window, moved by `-top`, `-start` and `-centre`, and `%bf-toast-autohide` hides a toast after a delay with CSS alone, waiting while it is hovered or focused.
- Popovers: `%bf-popover` styles a panel of content in a popover opened by a `popovertarget` button, placed above it by CSS anchor positioning, with the heading it starts with as a title bar and a `popovertargetaction="hide"` button in its top corner. `-bottom`, `-start` and `-end` change where it opens.
- `sassy.js` places popovers in browsers without CSS anchor positioning, on any side, and leaves a popover with `role="dialog"` open when a link or button in it is clicked.
- Offcanvas: `%bf-offcanvas-start`, `-end`, `-top` and `-bottom` turn a `%bf-dialog` into a panel that slides in from that edge of the window, opened as a modal with `command="show-modal"`. With `%bf-offcanvas-{breakpoint}`, it is part of the page from that breakpoint up, such as a sidebar.
- `sassy.js` closes a modal dialog with `closedby="any"` when its backdrop is clicked, in browsers without `closedby`.
- `sassy.js` keeps a `popovertarget` button's `aria-expanded` up to date, gives `role="menu"` its arrow keys, Home, End and Tab, closes a menu when an item is chosen, and places menus in browsers without CSS anchor positioning.

### Changed

- A few default colours moved to the nearest colour role: card caps and read-only inputs from `grey-50` to `grey-100`; form help text, input placeholders and the current breadcrumb from `grey-500` to `grey-600`; and the text of dropdowns, popovers, toasts and carousel controls from `grey-900` to the body colour, `grey-800`.
- Outline buttons in a light theme colour (`ok`, `info`, `warn`, `grey-light`) mix it with the body text colour rather than with the button's dark text, so they stay readable on a dark background.
- The current link of `%bf-nav-pills` uses the primary button's text colour, `--sassy-btn-primary-colour`, rather than always white.
- The theme properties on `:root` are output with `:where(:root)`, so any selector that sets them, even `html`, wins.

## [0.4.0] - 2026-11-19

> **Upgrading from 0.3.0.** Sassy now needs Dart Sass 1.108 or later, and outputs everything in cascade layers. Your own unlayered CSS now beats Sassy's whatever its specificity, so to keep Sassy's rules on top, put your CSS in a layer after it, for example `@layer reset, sassy, app;`. Also check for these renames: `%bf-dialog-close` is now `%bf-close`, `%bf-text-wrap-hover` is now `%bf-text-truncate`, `make-passes()` is now `make-layers()`, and if you load files directly, the forms and components folders and some component files have moved. If your own CSS reads a `--sassy-*` property such as `var(--sassy-radius)`, read its Sass variable instead. Each change is listed under Changed.

### Changed

- **Breaking:** `%bf-dialog-close` is gone. Use `%bf-close` in the dialog header, on an empty button.
- **Breaking:** everything Sassy outputs is now in cascade layers - `sassy.base.core` to `sassy.3xl.theme`, one per breakpoint and folder, declared in one `@layer` statement at the top. Breakpoint variants and utilities now win whatever the specificity of the selectors that extend them: `nav .link` extending `%bf-nav-link` no longer beats `.link-alert` extending `%bf-c-error`.
- **Breaking:** your own unlayered CSS now always beats Sassy's, whatever its specificity. A plain `a { color: red }` overrides every link that extends `%bf-nav-link`. Put your CSS in a layer after Sassy's - `@layer reset, sassy, app;` - to keep Sassy's precedence over it.
- **Breaking:** `make-passes()` is now `make-layers()`, and outputs each pass in a layer - Sassy's by default, or your own with `$name`.
- **Breaking:** `src/1-forms` is now `src/2-forms` and `src/2-components` is now `src/1-components`, with their files renumbered to match. Components come before forms because input groups style the buttons inside them.
- **Breaking:** if you `@use` component files directly, `_140-tabs` is now `_123-tabs` and `_160-dialog` is now `_153-dialog`, with their `-variables` files. Tabs are output after pagination rather than after tables.
- **Breaking:** `%bf-text-wrap-hover` is now `%bf-text-truncate`, which says what it does. It still expands on hover.
- **Breaking:** Sassy now needs Dart Sass 1.108 or later, so it can use current Sass syntax.
- **Breaking:** if your own CSS reads a Sassy custom property other than the font, body and theme ones, such as `var(--sassy-radius)`, it now has no value unless you set it, as its default is no longer on `:root` (see below). Read it through its Sass variable instead, which includes the default: `border-radius: sassy.$sassy-radius`.
- `%bf-body` is output with the element defaults, below every other placeholder, and sets its heading and paragraph margins itself rather than extending the margin utilities. A margin utility on a heading inside it now always wins.
- Grid columns set `margin-block: 0` and their start margin from `--sassy-col-offset`, rather than `margin: 0`, so offsets work. Rows set `--sassy-col-offset: 0`.
- Smaller output: only the font, body and theme custom properties are defined on `:root`. Every other default is now the fallback in the `var()` that reads it - `var(--sassy-card-bg, #fff)` - so it is only in your CSS when you extend a placeholder that uses it. Setting any of them, on `:root` or anywhere else, works as before.
- A default that points to another property now follows that property where it is set, not only on `:root`. For example, `--sassy-radius` set on a section now also changes the corners of cards, inputs and dialogs inside it.

### Added

- Skeletons: `%bf-skeleton`, a faded block one line high that stands in for content while it loads, drawn in the text colour and sized with `%bf-width-{5-100}`. A shimmer crosses it, except for people who prefer reduced motion.
- Accordions: `%bf-accordion` on a `<div>` styles its native `<details>` as sections that open and close, with a chevron that turns and an open header tinted with primary. They open and close smoothly where browsers support `::details-content`. `%bf-accordion-flush` removes the outer border.
- Spinners: `%bf-spinner`, a ring that turns, and `%bf-spinner-grow`, a dot that grows and fades, drawn in the text colour and sized in `em`. `%bf-spinner-{theme colour}` and `%bf-spinner-small` combine with either. They slow down for people who prefer reduced motion.
- Progress bars: `%bf-progress` styles a native `<progress>`, with a bar that slides along the track when it has no value. `%bf-progress-{theme colour}` colours the bar, `%bf-progress-animated` adds moving stripes, and `%bf-progress-stacked` shows several bars in one track. Moving parts slow down for people who prefer reduced motion.
- Pagination: `%bf-pagination` on the `<ul>` of a `<nav>` joins its page links into a row of boxes that share their borders, with the current page marked by `aria-current="page"` and links that can't be used as a `<span>` or with `aria-disabled`. `%bf-pagination-small` and `-large` match the form control sizes.
- Button groups: `%bf-btn-group` joins buttons into a row that shares borders, `%bf-btn-group-vertical` stacks them, and `%bf-btn-group-small` and `-large` size every button in a group. `%bf-btn-toolbar` lays groups out in a row.
- `sassy.js` makes a `role="toolbar"` one stop in the tab order, and moves between its controls with the arrow keys, Home and End.
- A `%bf-btn` with `aria-pressed="true"` looks pressed, for toggle buttons.
- List groups: `%bf-list-group` styles its direct children as items - `<li>`, or `<a>` and `<button>` that shade under the pointer - with the current item marked by `aria-current` and disabled ones by `disabled` or `aria-disabled`. Combine `-flush` for inside a card, `-numbered` for an `<ol>`, and `-horizontal` or `-horizontal-{breakpoint}` for a row.
- Breadcrumbs: `%bf-breadcrumb` on the `<ol>` of a `<nav>` styles its items, with a divider screen readers skip, set by `--sassy-breadcrumb-divider`. The current page is marked with `aria-current="page"`.
- Badges: `%bf-badge`, a small label sized from the text around it, coloured with `%bf-text-bg-*` and made a pill with `%bf-rounded-pill`. `%bf-badge-count` puts one on the corner of a button or other parent, which it makes `position: relative` itself. An empty badge is hidden.
- Alerts: `%bf-alert`, tinted with `%bf-alert-{theme colour}`, with `%bf-alert-title` for a heading. Links inside an alert take its text colour, in bold. `%bf-alert-dismissible` makes room for a close button with `command="--dismiss"`, which `sassy.js` turns into hiding the alert.
- `sassy.js` hides the element named by any `commandfor` button with `command="--dismiss"`.
- `%bf-close`: a close button, an empty `<button>` with `aria-label="Close"` whose × is drawn in the text colour, so it shows on any background. Its size and opacity are set by `--sassy-close-size`, `--sassy-close-opacity` and `--sassy-close-hover-opacity`.
- `$sassy-layer`, the layer everything is output in, so Sassy can sit inside a stack of your own, such as `"vendor.sassy"`.
- `node tools/site.mjs check` also checks the full build's layer order, that nothing is outside a layer, and that only `%bf-visually-hidden` uses `!important`.
- Grid: `%bf-col` and `%bf-col-auto` columns, `%bf-col-offset-{0-11}`, `%bf-row-cols-{1-6}` and `-auto` for a row whose children are columns, `%bf-gutter-{0-5}` to change a row's gutter, and an opt-in CSS grid with `%bf-grid`, `%bf-grid-col-{1-12}` and `%bf-grid-start-{1-11}`.
- Tables: `%bf-table`, with `-striped`, `-striped-columns`, `-hover`, `-bordered`, `-borderless`, `-small`, `-caption-top`, a tint in each theme colour, and `-responsive` wrappers. A row with `aria-current="true"` is shaded. Without them, tables get joined borders and a grey caption below.
- Content styles in `0-core`: `h1` to `h6` get sizes, weight, line height and margins, `blockquote` and `figure` get a bottom margin and no side margins, and `img` and `svg` line up with text. Placeholders for the rest: `%bf-h{1-6}`, `%bf-lead`, `%bf-display-{1-6}`, `%bf-initialism`, `%bf-list-unstyled`, `%bf-list-inline`, `%bf-img-fluid`, `%bf-figure`, `%bf-blockquote` and `%bf-blockquote-caption`. Headings and large headings above `1.25rem` shrink on screens narrower than the `xl` breakpoint.
- `%bf-text-bg-{colour}-{shade}` and `%bf-text-bg-{theme}`: a background with text that contrasts with it, chosen by WCAG contrast ratio. Each theme colour has a `--sassy-theme-{name}-contrast` property for its text, and `sassy.contrast-colour()` works one out for any Sass colour.
- `%bf-focus-ring`: the focus outline components use, for anything else that takes focus.
- Link utilities: `%bf-stretched-link`, `%bf-icon-link`, `%bf-text-underline-offset-…` and `%bf-text-decoration-opacity-{0-100}`.
- Layout utilities: `%bf-float-…`, `%bf-vertical-align-…`, `%bf-object-fit-…`, `%bf-aspect-ratio-{1x1, 4x3, 16x9, 21x9}` (set by `$sassy-aspect-ratio`), `%bf-pointer-events-…` and `%bf-user-select-…`.
- `%bf-text-break`: long words and URLs break anywhere rather than overflow their box.
- A navbar: `%bf-navbar-expand-{breakpoint}` with `%bf-navbar-brand`, `%bf-navbar-toggle` and `%bf-navbar-menu`. The breakpoint is set once, and the menu does not flash open before `sassy.js` runs.
- `%bf-navbar-push`: below the breakpoint, the open menu pushes the page down rather than covering it.
- `%bf-nav-fill` and `%bf-nav-justified`: links that share the width of the row. In a navbar, the menu grows to make room for them.
- The bars on a nav toggle turn into a cross while its menu is open.
- A collapsed nav's panel stops at the bottom of the screen and scrolls, set by `--sassy-nav-collapse-max-height`.
- `node tools/site.mjs check` also fails if Sassy reads a custom property with a bare `var()` that has no default.

### Fixed

- The toggle button that opens a collapsed nav is now as tall as a link, so its hover background has space above and below the bars.

### Removed

- `dist/full.css.gz`. Nothing read it, and gzip on macOS and Linux compress differently, so it could not be checked. Servers and CDNs compress `full.css` themselves.

## [0.3.0] - 2026-10-26

> **Breaking: the `@use` path has changed.** `src/base` is gone. Load Sassy from `src` instead:
>
> ```sass
> // before (0.2.0)
> @use "sassy/src/base" as sassy
>
> // now
> @use "sassy/src" as sassy
> ```
>
> Configuration with `with (...)` works as before, except that `$sassy-debug` is gone. It did nothing, so remove it. If you load individual files inside `src/base`, they have moved to the numbered folders (`0-core` to `5-theme`), for example `src/base/_22-display.sass` is now `src/4-utilities/_430-display.sass`.

### Added

- Components (`src/2-components`): buttons (`%bf-btn`, with colour, outline and size variants), navigation (base, pills, underline and vertical), cards, tabs, tooltips and modal dialogs.
- Collapsible navigation. `%bf-nav-toggle` is the menu button and `%bf-nav-collapse-{breakpoint}` is the menu it opens. Below the breakpoint the open menu is a panel over the content that wipes down and up in CSS; from the breakpoint it is an ordinary part of the page. Panel colours, shadow and speed are set with `--sassy-nav-collapse-*`.
- `sassy.js`, an optional script for tabs, tooltips (with a positioning fallback where CSS anchor positioning is missing), `command` / `commandfor` buttons in older browsers, and collapsible navigation. It finds elements by ARIA role and standard attributes, never by class name.
- Forms (`src/1-forms`): validation states, input groups, floating labels, range and file inputs, and selects.
- A samples site, published to GitHub Pages, with a page for each layer. Every example shows its Sass, HTML and compiled CSS.
- Worked examples for each layer in `docs/`, and an "Is it for you?" section in the README.
- The project logo, in `logo/` (light and dark, SVG and PNG).
- A `Check` workflow that compiles Sassy, checks that the CSS shown in the README and docs is what Sassy outputs, and builds the samples site.

### Changed

- Modal dialogs stop the page behind them scrolling, and opening one no longer scrolls the page to the top.
- **Breaking:** colour custom properties take any CSS colour (hex, `rgb()`, `oklch()`, a named colour or another custom property) instead of space-separated R G B values, and `sassy.colour()` returns an `oklch()` colour. A value such as `--sassy-theme-primary: 13 148 136` must become `rgb(13 148 136)` or `#0d9488`.
- The colour palette is updated to Tailwind 4.3, in `oklch()`, so shade values differ. It adds the neutrals `mauve`, `olive`, `mist` and `taupe`, and shade `950`. Sassy now needs Dart Sass 1.79 or later.
- The source is reorganised into numbered folders (`0-core` to `5-theme`) and files (`_NNN-name`). The numbers are the output order.
- Components are rendered after forms, with buttons first among them.
- The Check and Pages workflows use the native Dart Sass release, which is faster than the npm package.

### Removed

- Coloured shadow placeholders: `%bf-shadow-{colour}-{shade}-{0-3}` and `%bf-shadow-{theme}-{0-3}`. Use `%bf-shadow-{0-3}` and set `--sassy-shadow-colour` for a site, a section or one element, for example `--sassy-shadow-colour: var(--sassy-theme-primary)`.
- `src/base`, replaced by `src` and its numbered folders. See the note at the top of this release for the new `@use` path.

## [0.2.0] - 2026-10-24

### Added

- Form styles (`src/base`): labels and help text (`%bf-form-label`, `%bf-form-text`), text inputs and textareas (`%bf-form-control`, with sizes and plain text), selects, checkboxes and radios, switches, and validation states and feedback. They style native `:user-invalid` and `[aria-invalid="true"]`, and are controlled by `--sassy-input-*` and `--sassy-check-*` custom properties.
- Layout utilities: `fixed` and `sticky` positions; offsets (`%bf-top-0` and so on); `z-index`; `overflow`, `overflow-x` and `overflow-y`; and `min-` and `max-` height and width, in `%` and `vh` / `vw`.
- Display utilities: `%bf-visually-hidden` and `%bf-visually-hidden-focusable`, flex `fill`, `order` and `wrap`, and `gap`, `gap-x` and `gap-y` (`$sassy-gap-unit`).
- `make.name()`, which builds a prefixed placeholder name from `$sassy-prefix` and `$sassy-separator`. An empty `$sassy-prefix` now works.
- VS Code code snippets (`dist/sassy.code-snippets`), generated from the full build by `snippets.sh`.
- A gzipped copy of `dist/full.css`.
- Colour palette and theme images (`docs/palette.svg`, `docs/theme.svg`), generated by `palette.sh`.
- A README with usage instructions, naming conventions, the colour palette, responsive breakpoints and theming.

### Changed

- **Breaking:** every variable and function now starts with `sassy` (`$bf-prefix` is now `$sassy-prefix`, `$bf-breakpoints` is `$sassy-breakpoints`, and so on). The CSS custom properties are renamed in the same way, for example `--bf-theme-primary` is now `--sassy-theme-primary`.
- **Breaking:** Sassy now uses the Sass module system throughout (`@use`, `@forward`, `sass:map` and the other built-in modules) instead of `@import` and global functions. This fixes the Sass deprecation warnings and means `@use "sassy/src/base" as sassy with ($sassy-full: true)` configures Sassy correctly.
- **Breaking:** `%bf-p-auto` and `%bf-border-auto` are gone, as they are not valid CSS.
- Output is ordered correctly. Every module is rendered once for base rules and then once per breakpoint, so a larger breakpoint always overrides a smaller one, and composite placeholders (`%bf-form-*`, `%bf-col-*`, `%bf-body`) lose to single-purpose utilities such as `%bf-p-0`, whichever file defines them.
- `$sassy-prefix` now works with any length. Previously the prefix check only compared the first two characters, so a prefix other than `bf` could produce wrong names.
- `%bf-border-x-*` and `%bf-border-y-*` now set the width on the correct sides. They were swapped or uneven.
- Grid columns use `box-sizing: border-box` with the gutter as padding, so column widths add up to 100% whatever `box-sizing` the page uses.
- Heading, paragraph and list margins in `%bf-body` use the spacing placeholders, so they follow your prefix.
- Normalize is updated, and its licence header is simplified.
- The serif font stack no longer has a stray trailing comma.
- `compile-full.sh` now builds `dist/full.css` with `--no-source-map`, gzips it, and then runs `snippets.sh` and `palette.sh`. `watch.sh` and `compile-full.sh` have a proper `#!/bin/sh` line.
- The version is a full semantic version (`0.2.0`), and the copyright year is updated.

### Removed

- `dist/form.css` and `src/form`. The form styles are part of `src/base` and `dist/full.css`.

## [0.1.0] - 2024-10-17

Initial release.

[0.4.0]: https://github.com/bfren/sassy/releases/tag/v0.4.0
[0.3.0]: https://github.com/bfren/sassy/releases/tag/v0.3.0
[0.2.0]: https://github.com/bfren/sassy/releases/tag/v0.2.0
[0.1.0]: https://github.com/bfren/sassy/releases/tag/v0.1.0
