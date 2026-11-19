# 1-components: buttons, button groups, close buttons, badges, navigation, breadcrumbs, pagination, cards, list groups, accordions, tables, tabs, alerts, progress bars, spinners, skeletons, toasts, tooltips, popovers, dropdowns, dialogs, offcanvas and carousels

Live examples: [https://bfren.github.io/sassy/1-components.html](https://bfren.github.io/sassy/1-components.html)

`src/1-components` styles whole interface elements: buttons, button groups, close buttons, badges, navigation, breadcrumbs, pagination, cards, list groups, accordions, tables, tabs, alerts, progress bars, spinners, skeletons, toasts, tooltips, popovers, dropdowns, dialogs, offcanvas and carousels. Like forms, components are composites, so they output before the grid and utilities, and a utility such as `%bf-p-0` can override any part of one.

Every component reads its colours, spacing and sizes from custom properties, so a theme can change them at runtime. Components have no breakpoint variants.

## Behaviour and browser support

Buttons, button groups, close buttons, badges, navigation, breadcrumbs, pagination, cards, list groups, accordions, progress bars, spinners, skeletons, toasts, popovers, dropdowns, dialogs, offcanvas and carousels need no script - except for navigation that collapses. Tabs, toolbars, tooltips, collapsible navigation, dismissible alerts and toasts, carousels that play by themselves, scrollspy and the arrow keys of dropdown menus need `sassy.js`, which you load once:

```html
<script src="https://cdn.jsdelivr.net/gh/bfren/sassy@0.4.0/dist/sassy.min.js" defer></script>
```

`sassy.js` finds everything by ARIA role and standard attributes, never by class name, so it works whatever selectors you extend the placeholders onto. It does seven things:

| Feature          | What `sassy.js` does                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Collapsible navs | Opens and closes what a button with `aria-expanded` and `aria-controls` controls                                          |
| Scrollspy        | Moves `aria-current="location"` to the link of the section in view, in a nav where one link has it                        |
| Tabs             | Switches panels when a tab is clicked, and moves between tabs with the arrow keys, Home and End                           |
| Toolbars         | Makes a toolbar one stop in the tab order, and moves between its controls with the arrow keys, Home and End               |
| Tooltips         | Shows a tooltip on hover and keyboard focus, hides it on Escape, and places it in browsers without CSS anchor positioning |
| Dropdowns        | Updates `aria-expanded`, gives `role="menu"` its keys, and places menus in browsers without CSS anchor positioning        |
| Popovers         | Updates `aria-expanded`, and places popovers in browsers without CSS anchor positioning                                   |
| Offcanvas        | Closes a dialog with `closedby="any"` when its backdrop is clicked, in browsers without `closedby`                        |
| Carousels        | Plays a carousel whose slides have `aria-live="off"`, with a pause button, waiting on hover and focus                     |
| Commands         | Makes `command` / `commandfor` buttons work in browsers that do not support them yet                                      |
| Dismissing       | Hides the element named by a `commandfor` button with `command="--dismiss"`, such as an alert                             |

The components rely on these browser features:

| Feature                                  | Used by                       | Baseline                                              | Without it                                  |
| ---------------------------------------- | ----------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| Popover API (`popover`)                  | Tooltips, popovers, dropdowns | Widely available, since April 2024                    | -                                           |
| `command` and `commandfor`               | Dialogs                       | Newly available: Chrome 135, Firefox 144, Safari 26.2 | `sassy.js` adds the behaviour               |
| CSS anchor positioning (`position-area`) | Tooltips, popovers, dropdowns | Newly available, since January 2026                   | `sassy.js` places them                      |
| `closedby="any"`                         | Offcanvas                     | Chrome 134, Firefox 141, not yet Safari               | `sassy.js` adds the behaviour               |
| `::scroll-button`, `::scroll-marker`     | Carousels                     | Chrome 135; not yet Firefox or Safari                 | Swiped or scrolled, without buttons or dots |

With `sassy.js`, everything works in every browser that supports popovers, which all major browsers have since April 2024.

If you add tabs, a carousel that plays or a scrollspy nav to the page after it has loaded, call `Sassy.init(element)` on the element that contains them. Tooltips and commands need no setup.

## Placeholders

| Placeholder                                                                                     | For                                                                                     |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `%bf-btn`                                                                                       | A button - on a `<button>`, or on a link that looks like one                            |
| `%bf-btn-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark` | A button in a theme colour, combined with `%bf-btn`                                     |
| `%bf-btn-outline`                                                                               | The colour on the border and text only, combined with `%bf-btn` and a colour            |
| `%bf-btn-small`, `%bf-btn-large`                                                                | Smaller or larger, the same as the form control sizes                                   |
| `%bf-btn-group`                                                                                 | Buttons side by side that share their borders - on a `role="group"`                     |
| `%bf-btn-group-vertical`                                                                        | Buttons stacked one above the other, instead of `%bf-btn-group`                         |
| `%bf-btn-group-small`, `%bf-btn-group-large`                                                    | Every button in a group smaller or larger, combined with a group                        |
| `%bf-btn-toolbar`                                                                               | Groups in a wrapping row - on a `role="toolbar"`                                        |
| `%bf-close`                                                                                     | A close button: an empty `<button>` with `aria-label="Close"`                           |
| `%bf-badge`                                                                                     | A small label, sized from the text around it. Colour it with `%bf-text-bg-{theme}`      |
| `%bf-badge-count`                                                                               | A badge on the top end corner of its parent, such as a button                           |
| `%bf-nav`                                                                                       | A list of links, side by side - on a `<ul>`, or on a `<nav>` holding the links directly |
| `%bf-nav-link`                                                                                  | Each link. Mark the current page with `aria-current="page"`                             |
| `%bf-nav-pills`, `%bf-nav-underline`                                                            | Pill or underline style for the current link, combined with `%bf-nav`                   |
| `%bf-nav-vertical`                                                                              | Stacks the links, combined with `%bf-nav`                                               |
| `%bf-nav-fill`, `%bf-nav-justified`                                                             | Links that share the row's width, by their text or equally, combined with `%bf-nav`     |
| `%bf-nav-toggle`                                                                                | The button that opens and closes a collapsed nav                                        |
| `%bf-nav-collapse-{breakpoint}`                                                                 | What the button opens: a panel below the breakpoint, and part of the page from it       |
| `%bf-navbar-expand-{breakpoint}`                                                                | A row holding a brand, a toggle and a menu, which collapses below the breakpoint        |
| `%bf-navbar-brand`, `%bf-navbar-toggle`, `%bf-navbar-menu`                                      | The parts of a navbar: the site name or logo, the button, and what the button opens     |
| `%bf-navbar-push`                                                                               | The open menu pushes the page down, combined with `%bf-navbar-expand-{breakpoint}`      |
| `%bf-breadcrumb`                                                                                | A trail of links to the current page - on the `<ol>` in a `<nav>`                       |
| `%bf-pagination`                                                                                | Links to numbered pages in a joined row - on the `<ul>` in a `<nav>`                    |
| `%bf-pagination-small`, `%bf-pagination-large`                                                  | Smaller or larger, the same as the form control sizes                                   |
| `%bf-card`                                                                                      | A bordered container                                                                    |
| `%bf-card-header`, `%bf-card-body`, `%bf-card-footer`                                           | The parts of a card                                                                     |
| `%bf-card-title`, `%bf-card-image`                                                              | A title in the body, and an image that fills the card's width                           |
| `%bf-list-group`                                                                                | A bordered list whose direct children are its items - `<li>`, or `<a>` and `<button>`   |
| `%bf-list-group-flush`                                                                          | No outer border or corners, for a list that fills a card                                |
| `%bf-list-group-numbered`                                                                       | Numbers the items of an `<ol>`                                                          |
| `%bf-list-group-horizontal`, `-horizontal-{breakpoint}`                                         | Items side by side, always or from a breakpoint                                         |
| `%bf-accordion`                                                                                 | A `<div>` of `<details>`, each a header and content that open and close                 |
| `%bf-accordion-flush`                                                                           | No outer border or corners, for an accordion that fills a card                          |
| `%bf-tabs`                                                                                      | The list of tabs (`role="tablist"`)                                                     |
| `%bf-tab`                                                                                       | Each tab (`role="tab"`)                                                                 |
| `%bf-tab-panel`                                                                                 | Each panel (`role="tabpanel"`)                                                          |
| `%bf-alert`                                                                                     | A message box - see [Alerts](#alerts) for its `role`                                    |
| `%bf-alert-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark` | An alert tinted with a theme colour, combined with `%bf-alert`                          |
| `%bf-alert-title`                                                                               | A heading in an alert                                                                   |
| `%bf-alert-dismissible`                                                                         | Room for a close button, combined with `%bf-alert`                                      |
| `%bf-progress`                                                                                  | A native `<progress>` bar - without a value, a bar slides along it                      |
| `%bf-progress-{theme colour}`                                                                   | A bar in a theme colour, combined with `%bf-progress`                                   |
| `%bf-progress-animated`                                                                         | Moving stripes over the bar, combined with `%bf-progress`                               |
| `%bf-progress-stacked`                                                                          | Several bars in one track, on a `<div role="group">`                                    |
| `%bf-spinner`, `%bf-spinner-grow`                                                               | A ring that turns, or a dot that grows - see [Spinners](#spinners)                      |
| `%bf-spinner-{theme colour}`, `%bf-spinner-small`                                               | A spinner in a theme colour, or small, combined with either                             |
| `%bf-skeleton`                                                                                  | A faded block in place of content while it loads - see [Skeletons](#skeletons)          |
| `%bf-toast`                                                                                     | A short message over the page, with a `<header>` title row - see [Toasts](#toasts)      |
| `%bf-toast-autohide`                                                                            | Hides a toast after a delay, waiting while it is hovered or focused                     |
| `%bf-toast-container`                                                                           | The stack toasts sit in, fixed to the bottom end corner                                 |
| `%bf-toast-container-top`, `-start`, `-centre`                                                  | Moves the stack to the top, or to the start or centre                                   |
| `%bf-tooltip`                                                                                   | A tooltip (`role="tooltip"` with `popover="manual"`)                                    |
| `%bf-popover`                                                                                   | A panel of content in a popover (`role="dialog"`), opened by a `popovertarget` button   |
| `%bf-popover-bottom`, `%bf-popover-start`, `%bf-popover-end`                                    | Opens below the button, or before or after it, rather than above                        |
| `%bf-dropdown`                                                                                  | A menu in a popover (`popover`, opened by a `popovertarget` button)                     |
| `%bf-dropdown-up`, `%bf-dropdown-end`                                                           | Opens above the button, or lines up with its end                                        |
| `%bf-dropdown-header`, `%bf-dropdown-divider`                                                   | A label for a group of items, and a line between groups                                 |
| `%bf-dropdown-toggle`, `%bf-dropdown-split`                                                     | A chevron after a button's text, or a chevron-only split button                         |
| `%bf-dialog`, `-small`, `-large`                                                                | A `<dialog>`, at the default width or smaller or larger                                 |
| `%bf-dialog-header`, `%bf-dialog-body`, `%bf-dialog-footer`                                     | The parts of a dialog                                                                   |
| `%bf-dialog-title`                                                                              | The dialog's heading                                                                    |
| `%bf-offcanvas-start`, `-end`, `-top`, `-bottom`                                                | With `%bf-dialog`, a panel that slides in from that edge                                |
| `%bf-offcanvas-{breakpoint}`                                                                    | With a side, part of the page from that breakpoint up                                   |
| `%bf-carousel`                                                                                  | A row of slides that scrolls and snaps - see [Carousels](#carousels)                    |

## Buttons

A button uses the form controls' padding, font size, line height, border and corners, so it lines up with the inputs beside it. Theme colours, outline and size only change custom properties, so extend them alongside `%bf-btn`:

```sass
@use "sassy/src" as sassy

.button
    @extend %bf-btn

.button-save
    @extend %bf-btn-primary

.button-cancel
    @extend %bf-btn-error
    @extend %bf-btn-outline
```

```html
<button type="submit" class="button button-save">Save changes</button>
<button type="button" class="button button-cancel">Discard</button>
<a href="/help" class="button">Help</a>
```

```css
@layer sassy.base.components {
  .button {
    align-items: center;
    background-color: var(--sassy-btn-bg, #fff);
    border: var(--sassy-input-border-width, 1px) solid var(--sassy-btn-border-colour, oklch(87.2% 0.01 258.338deg));
    border-radius: var(--sassy-input-radius, var(--sassy-radius, 0.375rem));
    color: var(--sassy-btn-colour, var(--sassy-body-colour));
    display: inline-flex;
    padding: var(--sassy-input-padding-y, 0.375rem) var(--sassy-input-padding-x, 0.75rem);
  }
  .button:hover {
    background-color: color-mix(in oklab, var(--sassy-btn-bg, #fff) 88%, var(--sassy-btn-shade, #000));
  }
  .button-save {
    --sassy-btn-bg: var(--sassy-theme-primary);
    --sassy-btn-border-colour: var(--sassy-theme-primary);
    --sassy-btn-colour: var(--sassy-btn-primary-colour, #fff);
    --sassy-btn-focus-colour: var(--sassy-theme-primary);
    --sassy-btn-outline-colour: var(--sassy-theme-primary);
  }
}
```

Hover and press darken whatever colour the button is, by mixing `--sassy-btn-shade` into it, so a theme colour changed at runtime keeps its hover state. Outlined buttons in the light theme colours mix their colour with the dark text colour, so the text stays readable.

- **Use `<button>` for actions and `<a>` for links to other pages**, even when they look the same, so keyboards and screen readers treat them correctly. Give a `<button>` a `type`: inside a form it submits by default.
- **Disable with the `disabled` attribute**, or `aria-disabled="true"` on a link, and the button fades and ignores clicks.
- **A toggle button that is on has `aria-pressed="true"`**, and looks pressed. Set it to `"false"` when it is off.
- **In an input group**, a button joins the controls beside it, as an add-on does, and follows the group's size.

The text colour on each theme colour is chosen for contrast with the default theme: dark text on `info`, `warn`, `grey-light` and `ok`, white on the rest. If you change a theme colour, check its text still contrasts, and change it with `--sassy-btn-<name>-colour` if not - for example `--sassy-btn-primary-colour`.

## Button groups

A button group joins buttons into one row: they share their borders, and only the group's outer corners are rounded. A toolbar holds groups, with a gap between them:

```sass
.group
    @extend %bf-btn-group

.toolbar
    @extend %bf-btn-toolbar

.button
    @extend %bf-btn
```

```css
@layer sassy.base.components {
  .group {
    display: inline-flex;
    flex-direction: row;
  }
  .group > :not(:first-child) {
    margin-inline-start: calc(var(--sassy-input-border-width, 1px) * -1);
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
  .group > :not(:last-child) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sassy-btn-toolbar-gap, 0.5rem);
  }
}
```

```html
<div class="toolbar" role="toolbar" aria-label="Formatting">
    <div class="group" role="group" aria-label="Style">
        <button type="button" class="button" aria-pressed="true">Bold</button>
        <button type="button" class="button" aria-pressed="false">Italic</button>
    </div>
    <div class="group" role="group" aria-label="History">
        <button type="button" class="button">Undo</button>
        <button type="button" class="button">Redo</button>
    </div>
</div>
```

- **Give a group `role="group"` and an `aria-label`**, so screen readers announce what its buttons are for.
- **A toolbar is one stop in the tab order.** With `sassy.js`, Tab moves into a toolbar and out again in one step, and the arrow keys, Home and End move between its controls. Set `aria-orientation="vertical"` on a vertical toolbar, so the up and down keys move instead. Arrow keys in a text field or list still move its caret or choice.
- **Size every button in a group at once** with `%bf-btn-group-small` or `%bf-btn-group-large`, and **stack them** with `%bf-btn-group-vertical` instead of `%bf-btn-group`.
- **The button being used sits above its neighbours**, so its border and focus ring show in full.

## Close buttons

A close button is an empty `<button>`. The × is drawn in the text colour, so it shows on any background without a light or dark version:

```sass
.close
    @extend %bf-close
```

```css
@layer sassy.base.components {
  .close {
    background: none;
    border: 0;
    box-sizing: content-box;
    color: inherit;
    height: var(--sassy-close-size, 1em);
    opacity: var(--sassy-close-opacity, 0.5);
    padding: 0.25em;
    width: var(--sassy-close-size, 1em);
  }
  .close::before {
    background-color: currentColor;
    content: "";
    display: block;
    height: 100%;
  }
  .close:hover {
    opacity: var(--sassy-close-hover-opacity, 0.75);
  }
}
```

```html
<button type="button" class="close" aria-label="Close"></button>
```

- **Give it `aria-label="Close"`**, or a label that says what it closes, as the button has no text.
- **It is `1em` square**, so it follows the text size around it. Set `--sassy-close-size` to change it.
- **It fades until the pointer is over it**, and shows in full with the focus outline when it has keyboard focus. Disable it with `disabled`, or `aria-disabled="true"`.
- **A close button does nothing by itself.** Give it `command="close"` and `commandfor` to close a [dialog](#dialogs), or `command="--dismiss"` to dismiss an [alert](#alerts).

## Badges

A badge is a small label, sized from the text around it, so it fits a heading or a button as well as a sentence. It is grey by default. Colour it with `%bf-text-bg-{theme}` or `%bf-text-bg-{colour}-{shade}`, which choose a text colour that contrasts, and round it into a pill with `%bf-rounded-pill`:

```sass
.badge
    @extend %bf-badge

.badge-new
    @extend %bf-badge
    @extend %bf-text-bg-primary
    @extend %bf-rounded-pill

.badge-count
    @extend %bf-badge
    @extend %bf-badge-count
    @extend %bf-text-bg-error
    @extend %bf-rounded-pill
```

```css
@layer sassy.base.components {
  .badge-count, .badge-new, .badge {
    background-color: var(--sassy-badge-bg, var(--sassy-theme-grey-dark));
    color: var(--sassy-badge-colour, var(--sassy-theme-grey-dark-contrast));
    display: inline-block;
    font-size: var(--sassy-badge-font-size, 0.75em);
    padding: var(--sassy-badge-padding-y, 0.35em) var(--sassy-badge-padding-x, 0.65em);
  }
  .badge-count:empty, .badge-new:empty, .badge:empty {
    display: none;
  }
  .badge-count {
    inset-block-start: 0;
    inset-inline-start: 100%;
    position: absolute;
    translate: -50% -50%;
  }
  :where(*:has(> .badge-count)) {
    position: relative;
  }
}
```

```html
<h2>Releases <span class="badge-new">New</span></h2>

<button type="button" class="button">
    Inbox
    <span class="badge-count">4 <span class="visually-hidden">unread messages</span></span>
</button>
```

- **`%bf-badge-count` places the badge on the top end corner** of its parent, half outside it, and makes the parent `position: relative` itself, with no specificity, so it needs nothing else.
- **A count needs words for screen readers.** "4" on its own means nothing when read aloud, so add the rest in a `%bf-visually-hidden` span, or put it in the parent's `aria-label`.
- **An empty badge is hidden**, so a count that drops to nothing disappears without any script.
- **A badge is text, not a control.** To make one a link or a button, put the badge inside the link or button.

## Navigation

A navigation list is a flex row of links. Styles such as pills only change custom properties, so extend them alongside `%bf-nav` on the same element:

```sass
@use "sassy/src" as sassy

.menu
    @extend %bf-nav
    @extend %bf-nav-pills

    a
        @extend %bf-nav-link
```

```html
<nav aria-label="Main">
    <ul class="menu">
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

The current page is marked with `aria-current="page"` rather than a class, so screen readers announce it too. Extend `%bf-nav-underline` instead of `%bf-nav-pills` for an underline, or neither for the current link in the body text colour. Extend `%bf-nav-vertical` as well to stack the links.

To spread the links across the whole row, extend `%bf-nav-fill` or `%bf-nav-justified` as well. With fill, each item grows by the same amount, so longer links stay wider; with justified, every item is the same width. Either way the link text is centred in its item. In a [navbar](#navbar), a menu whose list fills or is justified takes the rest of the row, so the links spread across the space after the brand.

### Collapsible navigation

On a small screen a nav can sit behind a button. Extend `%bf-nav-toggle` on a `<button>` that has `aria-label`, `aria-expanded` and `aria-controls`, naming the `id` of what it opens, and `%bf-nav-collapse-{breakpoint}` on that element. The nav collapses below the breakpoint and stays open from it, so hide the button from the same breakpoint with `%bf-d-none-{breakpoint}`:

```sass
.menu-bar
    @extend %bf-position-relative

.menu-toggle
    @extend %bf-nav-toggle
    @extend %bf-d-none-md

.menu-collapse
    @extend %bf-nav-collapse-md
```

```html
<div class="menu-bar">
    <button type="button" class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="menu"></button>
    <nav id="menu" class="menu-collapse" aria-label="Main">
        <ul class="menu">
            <li><a href="/" aria-current="page">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</div>
```

`sassy.js` flips `aria-expanded` when the button is clicked and sets `hidden` on the element it controls, so the menu is closed when the page loads and open again after a second click. While `aria-expanded` is `"true"`, the button's three bars turn into a cross, so it shows that a second click closes the menu. Below the breakpoint the open menu is a panel on top of the content that follows, as wide as its nearest positioned ancestor - that is why `.menu-bar` is `position: relative` - and it wipes down when it opens and up when it closes. From the breakpoint the menu is a normal part of the page, shown whatever its `hidden` state.

The wipe is a transition of `clip-path`, which works in every current browser, and it is skipped for visitors who prefer reduced motion. A closed menu stays in the page with `visibility: hidden` rather than `display: none`, so it can wipe up before it disappears. It is still hidden from the keyboard and screen readers. A menu taller than the screen scrolls inside the panel, which stops at the bottom of the viewport: it is as tall as the viewport less the height of what it opens under, so that assumes the bar is at the top of the screen. `--sassy-nav-collapse-*` sets the panel's colours, shadow, duration and maximum height.

Without the script the menu stays open, so navigation still works. The menu may show briefly before the script closes it - a [navbar](#navbar) avoids that. The script ignores buttons with a `role`, `command` or `aria-haspopup`, so it does not interfere with tabs, dialogs or menus. If you add a collapsible nav after the page has loaded, call `Sassy.init(element)` on the element that contains it.

### Navbar

A navbar puts the pieces above together and sets the breakpoint once. Extend `%bf-navbar-expand-{breakpoint}` on the row, `%bf-navbar-brand` on the site name or logo, `%bf-navbar-toggle` on the button and `%bf-navbar-menu` on what it opens:

```sass
.site-header
    @extend %bf-navbar-expand-md

.site-brand
    @extend %bf-navbar-brand

.site-toggle
    @extend %bf-navbar-toggle

.site-menu
    @extend %bf-navbar-menu

    ul
        @extend %bf-nav

    a
        @extend %bf-nav-link
```

```html
<header class="site-header">
    <a class="site-brand" href="/">Example</a>
    <button type="button" class="site-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-menu"></button>
    <nav id="site-menu" class="site-menu" aria-label="Main">
        <ul>
            <li><a href="/" aria-current="page">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</header>
```

The navbar is a flex row with its parts spread to each end, and it is `position: relative`, so the collapsed menu is as wide as the navbar and opens just under it. Below the breakpoint the toggle shows and the menu behaves as a collapsible nav does, above; from the breakpoint the toggle is hidden and the menu sits at the end of the row. The toggle and menu only take on this behaviour inside a navbar. `sassy.js` opens and closes the menu in the same way, and the same notes on the wipe apply.

A navbar's menu does not flash open while the page loads. Until `sassy.js` runs, the menu is hidden below the breakpoint while its toggle has `aria-expanded="false"`, so start the toggle with that value. This only applies when the browser runs scripts (`@media (scripting: enabled)`), so with scripts turned off the menu stays open and the links still work. If scripts run but `sassy.js` does not load, the menu stays closed and the toggle does nothing. The toggle must be a direct child of the navbar, as the rule finds it with `:has()`.

By default the open menu is a panel over the page. Extend `%bf-navbar-push` as well, and below the breakpoint the menu is a row under the brand and toggle instead, which pushes the content that follows down as it grows, and moves it back up as it closes:

```sass
.site-header
    @extend %bf-navbar-expand-md
    @extend %bf-navbar-push
```

The menu grows by animating its one grid row from `0fr` to `1fr`, so it needs a single child, such as the `<ul>` above. As the menu is part of the page, a long one scrolls with the page rather than inside the menu. From the breakpoint it makes no difference. `--sassy-navbar-*` sets the space between the parts and the brand's colour and size.

Only use `role="tablist"` and the tab roles for tabs that switch panels on the page, not for navigation between pages.

### Scrollspy

A nav of links to sections of the page can follow the reading position. Give one of its links `aria-current="location"`, usually the first, and `sassy.js` then moves it to the link of the section in view as the page scrolls. Any nav, [list group](#list-groups) or [dropdown](#dropdowns) shows that link as current, so scrollspy needs no Sass of its own:

```html
<nav class="menu menu-vertical" aria-label="On this page">
    <a href="#install" aria-current="location">Install</a>
    <a href="#use">Use</a>
    <a href="#help">Help</a>
</nav>
```

- **The section in view** is the last one whose top has scrolled past a line a quarter of the way down the window. Move the line with `--sassy-scrollspy-offset` on the nav, as a percentage of the height, or in `px` or `rem`. At the very bottom of the page, the last section is in view, even if it is short.
- **The links are found** in the nearest `<nav>`, `<ul>` or `<ol>` around the marked link, and each must point to an `id` on the page. If the sections are in a box that scrolls rather than the page, `sassy.js` follows that box, and its links scroll only the box rather than moving the page as well.
- **To keep the nav in sight** while the page scrolls, extend `%bf-position-sticky` with a `top`, or put it beside a box that scrolls.
- **Add it to the page later?** Call `Sassy.init(element)` on the element that contains it.

## Breadcrumbs

A breadcrumb shows where the current page sits, as a trail of links. Extend `%bf-breadcrumb` on the `<ol>`, and it styles the items:

```sass
.crumbs
    @extend %bf-breadcrumb
```

```css
@layer sassy.base.components {
  .crumbs {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
  }
  .crumbs a {
    color: var(--sassy-breadcrumb-link-colour, var(--sassy-theme-primary));
  }
  .crumbs > li + li::before {
    content: var(--sassy-breadcrumb-divider, "/")/"";
    padding-inline: var(--sassy-breadcrumb-gap, 0.5rem);
  }
  .crumbs > [aria-current=page], .crumbs > li > [aria-current=page] {
    color: var(--sassy-breadcrumb-current-colour, oklch(55.1% 0.027 264.364deg));
  }
}
```

```html
<nav aria-label="Breadcrumb">
    <ol class="crumbs">
        <li><a href="/">Home</a></li>
        <li><a href="/docs">Docs</a></li>
        <li aria-current="page">Breadcrumbs</li>
    </ol>
</nav>
```

- **Put it in a `<nav>` with `aria-label`**, so it is listed as a landmark, and use an `<ol>`, as the order of the items matters.
- **Mark the current page with `aria-current="page"`**, on the last item or on a link in it, and it is shown in grey.
- **The divider is decoration.** Its alternative text is empty, so screen readers read the links, not the slashes.
- **Change the divider with `--sassy-breadcrumb-divider`**, to any CSS `content` value: a string such as `"›"`, or an image with `url()`.

## Pagination

Pagination links to numbered pages. Extend `%bf-pagination` on the `<ul>`: each item's link is a box, and the boxes share their borders, like the buttons in a [button group](#button-groups):

```sass
.pages
    @extend %bf-pagination
```

```css
@layer sassy.base.components {
  .pages > :not(:first-child) > * {
    margin-inline-start: calc(var(--sassy-input-border-width, 1px) * -1);
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
  .pages > * > * {
    color: var(--sassy-pagination-colour, var(--sassy-theme-primary));
    padding: var(--sassy-input-padding-y, 0.375rem) var(--sassy-input-padding-x, 0.75rem);
  }
  .pages > * > span, .pages > * > [aria-disabled=true] {
    pointer-events: none;
  }
  .pages > * > [aria-current=page] {
    background-color: var(--sassy-pagination-current-bg, var(--sassy-theme-primary));
    color: var(--sassy-pagination-current-colour, var(--sassy-theme-primary-contrast));
  }
}
```

```html
<nav aria-label="Pages">
    <ul class="pages">
        <li><a href="?page=1" aria-label="Previous page">‹</a></li>
        <li><a href="?page=1">1</a></li>
        <li><a href="?page=2" aria-current="page">2</a></li>
        <li><a href="?page=3">3</a></li>
        <li><span aria-hidden="true">…</span></li>
        <li><a href="?page=9">9</a></li>
        <li><a href="?page=3" aria-label="Next page">›</a></li>
    </ul>
</nav>
```

- **Put it in a `<nav>` with `aria-label`**, such as "Pages", so it is listed as a landmark.
- **Mark the current page with `aria-current="page"`**, and it takes the primary colour.
- **A link that can't be used** - Previous on the first page - is a `<span>`, or a link with `aria-disabled="true"` and no `href`. It is grey and ignores clicks. Use a `<span>` for an ellipsis too, with `aria-hidden="true"`.
- **Label arrows**, such as `‹` and `›`, with `aria-label`, as screen readers would read them as symbols.
- **The boxes take the form control sizes**, as buttons do, so `%bf-pagination-small` and `%bf-pagination-large` match buttons and controls of the same size.

## Cards

```sass
.card
    @extend %bf-card

    img
        @extend %bf-card-image

    h3
        @extend %bf-card-title

.card-body
    @extend %bf-card-body

.card-foot
    @extend %bf-card-footer
```

```html
<article class="card">
    <img src="photo.jpg" alt="" />
    <div class="card-body">
        <h3>Title</h3>
        <p>Some text about the card.</p>
    </div>
    <footer class="card-foot">Updated today</footer>
</article>
```

A card is a flex column. The body grows to fill it, so in a row of cards of different heights, such as a flex row with `%bf-d-flex` and `%bf-gap-4`, the footers line up. The card clips its content to its rounded corners, so an image needs no radius of its own.

## List groups

A list group is a bordered list. Its direct children are its items, so extend one placeholder on the list:

```sass
.inbox
    @extend %bf-list-group
```

```css
@layer sassy.base.components {
  .inbox {
    border-radius: var(--sassy-list-group-radius, var(--sassy-radius, 0.375rem));
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .inbox > * + * {
    border-block-start: var(--sassy-list-group-border-width, 1px) solid var(--sassy-list-group-border-colour, oklch(92.8% 0.006 264.531deg));
  }
  .inbox > :where(a, button):hover {
    background-color: var(--sassy-list-group-hover-bg, color-mix(in oklab, currentColor 6%, var(--sassy-list-group-bg, #fff)));
  }
  .inbox > [aria-current]:not([aria-current=false]) {
    background-color: var(--sassy-list-group-current-bg, var(--sassy-theme-primary));
    color: var(--sassy-list-group-current-colour, var(--sassy-theme-primary-contrast));
  }
}
```

```html
<nav class="inbox" aria-label="Folders">
    <a href="/inbox" aria-current="page">Inbox</a>
    <a href="/sent">Sent</a>
    <a href="/drafts">Drafts</a>
    <a href="/archive" aria-disabled="true">Archive</a>
</nav>
```

- **Items are `<li>` in a `<ul>` or `<ol>`**, for a list of things, or `<a>` and `<button>` in a `<div>` or `<nav>`, for a list of things to do. Links and buttons fill the width, shade under the pointer, and show the focus outline inside the item.
- **Mark the current item with `aria-current`** - `"page"` for a link to the current page, `"true"` otherwise - and it takes the primary colour, with text that contrasts.
- **Disable an item with `disabled`**, or `aria-disabled="true"` on a link, and it fades and ignores clicks.
- **The list clips its items to its corners**, so a current item's background follows them. Something that pops out of an item, such as a menu, must use a popover, which is drawn above the page.
- **Combine `%bf-list-group-flush`** for a list with no outer border or corners, such as one that fills a card, **`%bf-list-group-numbered`** to number the items of an `<ol>`, and **`%bf-list-group-horizontal`** or **`-horizontal-{breakpoint}`** to set the items side by side.

## Accordions

An accordion is a `<div>` of native `<details>`, so the browser opens and closes each section, from the keyboard too, with no script. Each `<details>` holds a `<summary>`, the header, and one element with its content. Give them the same `name` and opening one closes the others:

```sass
.accordion
    @extend %bf-accordion
```

```css
@layer sassy.base.components {
  .accordion {
    border: var(--sassy-accordion-border-width, 1px) solid var(--sassy-accordion-border-colour, oklch(92.8% 0.006 264.531deg));
    interpolate-size: allow-keywords;
  }
  .accordion > details[open] > summary {
    background-color: var(--sassy-accordion-open-bg, color-mix(in oklab, var(--sassy-theme-primary) 10%, var(--sassy-accordion-bg, #fff)));
    color: var(--sassy-accordion-open-colour, color-mix(in oklab, var(--sassy-theme-primary) 60%, currentColor));
  }
  .accordion > details::details-content {
    block-size: 0;
    overflow: clip;
  }
}
```

```html
<div class="accordion">
    <details name="faq" open>
        <summary>What is an accordion?</summary>
        <div>A stack of sections, each with a header that opens and closes it.</div>
    </details>
    <details name="faq">
        <summary>Does it need a script?</summary>
        <div>No.</div>
    </details>
</div>
```

- **Put each section's content in one element** after the `<summary>`, which gets the padding. Several elements would each be padded.
- **Leave out `name`** to let several sections be open at once, and add `open` to one that should start open.
- **Opening and closing are animated where browsers support `::details-content`**, and instant elsewhere and for people who prefer reduced motion.
- **An open header is tinted with primary**, its text mixed with the text colour so it keeps its contrast. Change it with `--sassy-accordion-open-bg` and `--sassy-accordion-open-colour`.
- **Extend `%bf-accordion-flush` as well** for an accordion inside a card, or anywhere it should have no outer border.

## Tables

```sass
.prices
    @extend %bf-table
    @extend %bf-table-striped
    @extend %bf-table-hover

.prices-wrap
    @extend %bf-table-responsive-md

.price-sale
    @extend %bf-table-ok
```

```css
@layer sassy.base.components {
  .prices > :not(caption) > tr > * {
    --sassy-table-accent: transparent;
    background-color: var(--sassy-table-bg, transparent);
    background-image: linear-gradient(var(--sassy-table-accent), var(--sassy-table-accent));
  }
  .prices > tbody > tr:nth-of-type(odd) > * {
    --sassy-table-accent: var(--sassy-table-striped-bg, color-mix(in oklab, currentColor 5%, transparent));
  }
}
```

```html
<div class="prices-wrap">
    <table class="prices">
        <caption>Prices from 1 March</caption>
        <thead>
            <tr><th scope="col">Plan</th><th scope="col">Monthly</th></tr>
        </thead>
        <tbody>
            <tr><td>Basic</td><td>£5</td></tr>
            <tr aria-current="true"><td>Standard</td><td>£10</td></tr>
            <tr class="price-sale"><td>Premium</td><td>£15</td></tr>
        </tbody>
    </table>
</div>
```

| Placeholder                                        | Does                                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `%bf-table`                                        | Full width, with padding and a line under every row. Mark a row with `aria-current="true"` to shade it |
| `%bf-table-striped`, `%bf-table-striped-columns`   | Shades every other row, or every other column                                                          |
| `%bf-table-hover`                                  | Shades the row under the pointer                                                                       |
| `%bf-table-bordered`, `%bf-table-borderless`       | Borders on every side of every cell, or none                                                           |
| `%bf-table-small`                                  | Half the padding                                                                                       |
| `%bf-table-caption-top`                            | Puts the caption above the table                                                                       |
| `%bf-table-{theme colour}`                         | Tints a table, row or cell with a theme colour, for example `%bf-table-warn`                           |
| `%bf-table-responsive`, `-responsive-{breakpoint}` | On a wrapper: scrolls a wide table sideways, always or below the breakpoint                            |

Each cell paints the table background, then shades it for stripes, hover and the current row. The shades mix the text colour with transparency, so they work over a theme tint and in a dark theme. Without `%bf-table`, a table still has joined borders and its caption below it - see [0-core](0-core.md#content).

## Tabs

Tabs follow the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), as Bootstrap's do: `role="tablist"` on the list, `role="tab"` on each button with `aria-controls` naming its panel, and `role="tabpanel"` on each panel with `aria-labelledby` naming its tab:

```sass
.tab-list
    @extend %bf-tabs

    [role="tab"]
        @extend %bf-tab

.tab-panel
    @extend %bf-tab-panel
```

```html
<div class="tab-list" role="tablist" aria-label="Delivery options">
    <button type="button" role="tab" id="tab-standard" aria-controls="panel-standard" aria-selected="true">Standard</button>
    <button type="button" role="tab" id="tab-express" aria-controls="panel-express">Express</button>
</div>
<div class="tab-panel" role="tabpanel" id="panel-standard" aria-labelledby="tab-standard" tabindex="0">
    <p>Delivered in three to five working days.</p>
</div>
<div class="tab-panel" role="tabpanel" id="panel-express" aria-labelledby="tab-express" tabindex="0">
    <p>Delivered the next working day.</p>
</div>
```

When the page loads, `sassy.js` selects the tab with `aria-selected="true"`, or the first, and hides the other panels with the `hidden` attribute. So without the script every panel stays visible, and nothing is lost. Then:

- clicking a tab selects it
- Left and Right move to the previous and next tab, wrapping round, and Home and End move to the first and last
- only the selected tab is in the tab order, so Tab moves from it into its panel

For a vertical list, add `aria-orientation="vertical"` to the tab list, and Up and Down move between the tabs instead. A tab with `disabled` or `aria-disabled="true"` is skipped.

`tabindex="0"` on each panel lets keyboard users reach it when it contains nothing else that can be focused.

## Alerts

An alert is a message box. A theme colour tints its background, border and text, and links inside it take the alert's text colour, in bold:

```sass
.alert
    @extend %bf-alert

.alert-ok
    @extend %bf-alert-ok

.alert-dismissible
    @extend %bf-alert-dismissible

.close
    @extend %bf-close
```

```css
@layer sassy.base.components {
  .alert {
    background-color: var(--sassy-alert-bg, oklch(96.7% 0.003 264.542deg));
    border: var(--sassy-alert-border-width, 1px) solid var(--sassy-alert-border-colour, oklch(92.8% 0.006 264.531deg));
    color: var(--sassy-alert-colour, currentColor);
    padding: var(--sassy-alert-padding-y, 1rem) var(--sassy-alert-padding-x, 1rem);
  }
  .alert a {
    color: inherit;
    font-weight: 700;
  }
  .alert-ok {
    --sassy-alert-bg: color-mix(in oklab, var(--sassy-theme-ok) 15%, transparent);
    --sassy-alert-colour: color-mix(in oklab, var(--sassy-theme-ok) 40%, currentColor);
  }
  .alert-dismissible > [command="--dismiss"] {
    position: absolute;
  }
}
```

```html
<div class="alert alert-ok alert-dismissible" id="saved" role="status">
    <p>Your changes are saved. <a href="/history">See the history</a>.</p>
    <button type="button" class="close" commandfor="saved" command="--dismiss" aria-label="Close"></button>
</div>
```

- **Choose the role by how urgent the message is.** `role="alert"` makes screen readers announce it at once, interrupting the user, so keep it for errors and warnings that need action. Use `role="status"` for a quieter update, such as a saved form, or no role for a message that is part of the page when it loads.
- **Alert text is the theme colour mixed with the text around it**, so it stays readable on the light theme colours, and follows a dark theme. Change how much colour is mixed in with `$sassy-alert-tint`, `$sassy-alert-border-tint` and `$sassy-alert-text-tint`.
- **To dismiss an alert**, put a [close button](#close-buttons) in it with `commandfor` set to the alert's `id` and `command="--dismiss"`, and load `sassy.js`, which hides the alert. Extend `%bf-alert-dismissible` too, which makes room for the button in the top corner. The close button can come anywhere in the alert.
- **A dismissed alert is hidden with the `hidden` attribute**, so don't give it a `display` placeholder, which would override `hidden`.

## Progress bars

A progress bar is a native `<progress>`, so browsers and screen readers already know its value. Give it a `<label for>` or `aria-label`. A theme colour changes the bar, and a bar with no `value` is indeterminate: a shorter bar slides along the track until you set one:

```sass
.progress
    @extend %bf-progress

.progress-ok
    @extend %bf-progress-ok

.progress-animated
    @extend %bf-progress-animated
```

```css
@layer sassy.base.components {
  .progress {
    appearance: none;
    background-color: var(--sassy-progress-bg, oklch(92.8% 0.006 264.531deg));
    block-size: var(--sassy-progress-height, 1rem);
    border-radius: var(--sassy-progress-radius, var(--sassy-radius, 0.375rem));
  }
  .progress::-webkit-progress-value {
    background-color: var(--sassy-progress-bar-colour, var(--sassy-theme-primary));
  }
  .progress::-moz-progress-bar {
    background-color: var(--sassy-progress-bar-colour, var(--sassy-theme-primary));
  }
  .progress-ok {
    --sassy-progress-bar-colour: var(--sassy-theme-ok);
  }
}
```

```html
<label for="upload">Uploading</label>
<progress class="progress progress-ok progress-animated" id="upload" value="30" max="100">30%</progress>
<progress class="progress" aria-label="Loading"></progress>
```

To show several parts of a whole in one track, put a `<progress>` for each in a `<div>` that extends `%bf-progress-stacked`. Each one is full (`value="1" max="1"`) and its width is its share:

```html
<div class="progress-stacked" role="group" aria-label="Storage">
    <progress class="progress" value="1" max="1" style="width: 15%" aria-label="Photos, 15%"></progress>
    <progress class="progress progress-ok" value="1" max="1" style="width: 30%" aria-label="Music, 30%"></progress>
</div>
```

- **The text inside `<progress>` is a fallback**, shown only by browsers that don't support it, so put the value in its label too if people need the number.
- **Light theme colours are hard to see on the track.** `info`, `warn`, `grey-light` and `ok` have less than 3:1 contrast with the default grey track, so show the value as text beside those bars, or set a darker `--sassy-progress-bg`.
- **The moving parts slow down, rather than stop, for people who prefer reduced motion**, so the bar still shows that something is happening.
- **Browsers draw the bar with their own pseudo-elements**, `::-webkit-progress-value` in Chrome and Safari and `::-moz-progress-bar` in Firefox, so to restyle it, set the `--sassy-progress-*` properties rather than writing your own rules.

## Spinners

A spinner shows that something is loading: a ring that turns, or a dot that grows and fades. Put it on an element with `role="status"`, holding text for screen readers in a child that extends `%bf-visually-hidden`. Spinners are drawn in the text colour and sized in `em`, so they follow the text around them:

```sass
.spinner
    @extend %bf-spinner

.spinner-grow
    @extend %bf-spinner-grow

.spinner-small
    @extend %bf-spinner-small
```

```css
@layer sassy.base.components {
  .spinner {
    border: var(--sassy-spinner-width, 0.25em) solid var(--sassy-spinner-colour, currentColor);
    border-inline-end-color: transparent;
    animation: bf-spinner-turn 0.75s linear infinite;
    block-size: var(--sassy-spinner-size, 2em);
    border-radius: 50%;
    inline-size: var(--sassy-spinner-size, 2em);
  }
  .spinner-small {
    --sassy-spinner-size: 1em;
    --sassy-spinner-width: 0.2em;
  }
}
```

```html
<div class="spinner" role="status"><span class="visually-hidden">Loading…</span></div>
<button type="button" class="button" disabled>
    <span class="spinner spinner-small" aria-hidden="true"></span>
    Saving…
</button>
```

- **Inside a button whose text says what is happening, hide the spinner** with `aria-hidden="true"` instead of giving it `role="status"`, so screen readers don't hear it twice.
- **Colour a spinner** with `%bf-spinner-{theme colour}`, or with a text colour utility such as `%bf-c-{colour}`, as it uses the text colour.
- **Spinners slow down, rather than stop, for people who prefer reduced motion**, so they still show that something is happening.

## Skeletons

A skeleton is a faded block that stands in for content while it loads. It is one line of text high and drawn in the text colour, so it fits any text size and shows on any background. Give it a width with `%bf-width-{5-100}`, as an empty block has none:

```sass
.skeleton
    @extend %bf-skeleton

.width-75
    @extend %bf-width-75
```

```css
@layer sassy.base.components {
  .skeleton {
    background-color: var(--sassy-skeleton-colour, currentColor);
    display: inline-block;
    min-block-size: 1em;
    opacity: var(--sassy-skeleton-opacity, 0.25);
  }
}
@layer sassy.base.utilities {
  .width-75 {
    width: 75%;
  }
}
```

```html
<article class="card" aria-busy="true">
    <span class="visually-hidden">Loading…</span>
    <h3 aria-hidden="true"><span class="skeleton width-50"></span></h3>
    <p aria-hidden="true">
        <span class="skeleton width-100"></span>
        <span class="skeleton width-75"></span>
    </p>
</article>
```

- **Tell screen readers what is happening.** Put `aria-busy="true"` on the area that is loading, hide the skeletons with `aria-hidden="true"`, and add text such as "Loading…" in an element that extends `%bf-visually-hidden`. Remove `aria-busy` when the content arrives.
- **Skeletons in a line wrap like words**, so a 100% block followed by a 75% one makes two lines.
- **A shimmer crosses each skeleton**, through a mask, so it works in any colour. It does not run for people who prefer reduced motion: the blocks stay a plain shade, which still reads as loading.

## Toasts

A toast is a short message that appears over the page, such as "Saved" or "Link copied". Toasts sit in a `%bf-toast-container`, which is fixed to the bottom end corner of the window and stacks them:

```sass
.toast-container
    @extend %bf-toast-container

.toast
    @extend %bf-toast

.toast-autohide
    @extend %bf-toast-autohide
```

```css
@layer sassy.base.components {
  .toast-container {
    align-items: var(--sassy-toast-container-inline, flex-end);
    justify-content: var(--sassy-toast-container-block, flex-end);
    pointer-events: none;
    position: fixed;
  }
  .toast-autohide {
    animation: bf-toast-hide var(--sassy-toast-fade, 0.5s) ease-in var(--sassy-toast-delay, 5s) forwards;
  }
}
```

```html
<div class="toast-container" aria-live="polite">
    <div class="toast toast-autohide" id="saved">
        <header>
            <strong>Saved</strong>
            <small>just now</small>
            <button type="button" class="close" commandfor="saved" command="--dismiss" aria-label="Close"></button>
        </header>
        <p>Your changes are saved to this device.</p>
    </div>
</div>
```

- **Put the container in the page, empty, with `aria-live="polite"`**, and add toasts to it from your script: screen readers then read each toast as it arrives. For an urgent message, give the toast `role="alert"` instead.
- **A `<header>` the toast starts with is its title row.** Its first child takes the room, so anything after it, such as a time or a close button, sits at the end. A toast without a header is just its content.
- **Close a toast** with a [close button](#close-buttons) that has `commandfor` naming the toast and `command="--dismiss"`: `sassy.js` sets `hidden` on it. A close button outside the header sits in the top corner.
- **Extend `%bf-toast-autohide`** to hide the toast after `--sassy-toast-delay` (5 seconds), fading over `--sassy-toast-fade`. It waits while the pointer is over the toast or something in it has focus, so people have time to read and use it, and it hides without fading for reduced motion. This is CSS only: the hidden toast stays in the page, out of sight and out of the accessibility tree, so remove old toasts from your script if many build up. Don't auto-hide a toast that people need to act on.
- **Extend `%bf-toast-container-top`** to stack toasts at the top, and **`%bf-toast-container-start`** or **`-centre`** to move them across. They combine.
- **For a coloured toast**, extend a `%bf-text-bg-{theme colour}` utility with the toast.

## Tooltips

A tooltip is a popover with `role="tooltip"`, linked to its trigger by `aria-describedby`:

```sass
.tip
    @extend %bf-tooltip
```

```html
<button type="button" aria-describedby="tip-save">Save</button>
<div class="tip" role="tooltip" popover="manual" id="tip-save">Saves your changes to this device</div>
```

`sassy.js` shows the tooltip when the pointer is over the trigger or the trigger has keyboard focus, and hides it when they leave or when Escape is pressed. The pointer can move from the trigger onto the tooltip without it closing, so its text can be selected. One tooltip can describe several triggers.

CSS anchor positioning places the tooltip above its trigger, or below if there is no room above. In browsers without anchor positioning, `sassy.js` places it instead.

Use `popover="manual"` rather than `popover`, so that showing a tooltip does not close another popover that is open, such as a menu.

A tooltip should be a short description of something that already has a name. Touch screens have no hover, so do not put anything people need only in a tooltip.

## Popovers

A popover is a panel of content in a popover, opened by a button's `popovertarget`, like a [dropdown](#dropdowns). The browser opens and closes it, on Escape or a click outside too, and returns focus to the button, so it works without `sassy.js`. A heading it starts with is its title bar. CSS anchor positioning places it above the button, centred, and moves it when there is no room:

```sass
.popover
    @extend %bf-popover

.popover-end
    @extend %bf-popover-end
```

```css
@layer sassy.base.components {
  .popover {
    inset: auto;
    margin: var(--sassy-popover-offset, 0.5rem);
    position-area: var(--sassy-popover-side, block-start);
    position-try-fallbacks: flip-block, flip-inline;
  }
  .popover-end {
    --sassy-popover-side: inline-end;
  }
}
```

```html
<button type="button" class="button" popovertarget="hours">Opening hours</button>
<div class="popover" id="hours" popover role="dialog" aria-labelledby="hours-title">
    <h3 id="hours-title">Opening hours</h3>
    <p>Monday to Friday, 9am to 5pm.</p>
    <button type="button" class="close" popovertarget="hours" popovertargetaction="hide" aria-label="Close"></button>
</div>
```

- **Give the popover `role="dialog"`** and name it with `aria-labelledby` (its heading) or `aria-label`. `sassy.js` then leaves it open when a link or button in it is clicked, where it would close a dropdown menu. It also keeps the button's `aria-expanded` up to date, and places the popover in browsers without CSS anchor positioning.
- **Extend `%bf-popover-bottom` to open below the button, and `%bf-popover-start` or `%bf-popover-end` to open before or after it.** Each moves to the opposite side when there is no room.
- **A close button** is a button with `popovertarget` naming the popover and `popovertargetaction="hide"`, such as a [close button](#close-buttons). It sits in the top corner, and the title leaves room for it.
- **For text shown on hover and focus**, use a [tooltip](#tooltips). A popover only opens when its button is pressed, so it works on touch screens too.

## Dropdowns

A dropdown is a menu in a popover, opened by a button's `popovertarget`. The browser opens and closes it, on Escape or a click outside too, and returns focus to the button, so it works without `sassy.js`. CSS anchor positioning places it below the button, lined up with its start, and moves it when there is no room:

```sass
.dropdown
    @extend %bf-dropdown

.dropdown-toggle
    @extend %bf-dropdown-toggle

.dropdown-divider
    @extend %bf-dropdown-divider
```

```css
@layer sassy.base.components {
  .dropdown {
    inset: auto;
    margin: var(--sassy-dropdown-offset, 0.125rem) 0;
    position-area: var(--sassy-dropdown-side, block-end) var(--sassy-dropdown-align, span-inline-end);
    position-try-fallbacks: flip-block, flip-inline;
  }
  [aria-expanded=true].dropdown-toggle::after {
    transform: rotate(180deg);
  }
}
```

```html
<button type="button" class="button dropdown-toggle" popovertarget="file-menu" aria-haspopup="menu">File</button>
<div class="dropdown" id="file-menu" popover role="menu" aria-label="File">
    <button type="button" role="menuitem">New</button>
    <button type="button" role="menuitem">Open…</button>
    <hr class="dropdown-divider" />
    <button type="button" role="menuitem">Print…</button>
</div>
```

- **Choose the pattern by what the items do.** For actions, give the popover `role="menu"`, its items `role="menuitem"` and the button `aria-haspopup="menu"`: `sassy.js` then focuses the first item when the menu opens, and moves between items with the arrow keys, Home and End. For links to other pages, leave the roles out: people reach the links with Tab, as in any list, and the popover can be a `<ul>`.
- **`sassy.js` also** keeps the button's `aria-expanded` up to date, which turns the chevron of `%bf-dropdown-toggle`, closes the menu when an item is chosen or Tab leaves it, and places the menu in browsers without CSS anchor positioning.
- **Extend `%bf-dropdown-up` to open above the button, and `%bf-dropdown-end` to line the menu up with its end.** They combine.
- **Group items** with `%bf-dropdown-header`, a label that can't be chosen, and `%bf-dropdown-divider`, on an `<hr>`. Mark the current page with `aria-current="page"`, and items that can't be used with `disabled` or `aria-disabled="true"`.
- **For a split button**, put an action button and a chevron-only button that extends `%bf-dropdown-toggle` and `%bf-dropdown-split` in a [button group](#button-groups). Give the chevron button an `aria-label`, such as "More ways to publish".
- **In a navbar**, a link-styled button can open a dropdown in the same way. The menu floats below it even while the navbar is collapsed.

## Dialogs

Dialogs style the native `<dialog>` element. Buttons open and close them with `command` and `commandfor`, so no script is needed in current browsers. The button in the header is a [close button](#close-buttons):

```sass
.dialog
    @extend %bf-dialog

    header
        @extend %bf-dialog-header

    h2
        @extend %bf-dialog-title

    footer
        @extend %bf-dialog-footer

.dialog-body
    @extend %bf-dialog-body

.close
    @extend %bf-close
```

```html
<button type="button" commandfor="confirm" command="show-modal">Delete file…</button>

<dialog class="dialog" id="confirm" aria-labelledby="confirm-title">
    <header>
        <h2 id="confirm-title">Delete this file?</h2>
        <button type="button" class="close" commandfor="confirm" command="close" aria-label="Close"></button>
    </header>
    <div class="dialog-body">
        <p>You can't undo this.</p>
    </div>
    <footer>
        <button type="button" commandfor="confirm" command="close">Cancel</button>
        <button type="button" commandfor="confirm" command="close">Delete</button>
    </footer>
</dialog>
```

| `command`    | Does                                                              |
| ------------ | ----------------------------------------------------------------- |
| `show-modal` | Opens the dialog as a modal, over a backdrop, with the page inert |
| `close`      | Closes the dialog                                                 |

A modal dialog also closes when Escape is pressed, and returns focus to the button that opened it. To find out which button closed it, use a `<form method="dialog">` inside the dialog: the `value` of the button that submits it becomes the dialog's `returnValue`.

While a modal dialog is open the page behind it does not scroll. Sassy does this by hiding the overflow of `:root` (the `<html>` element), so it has no effect if your page scrolls inside another element instead. A dialog opened with `show` rather than `show-modal` does not lock the page.

```sass
.dialog
    @extend %bf-dialog
```

```css
@layer sassy.base.components {
  :root:has(.dialog:modal) {
    overflow: hidden;
  }
}
```

The dialog is a column with a maximum height, so when its content is taller than the window, the body scrolls between the header and footer. Extend `%bf-dialog-small` or `%bf-dialog-large` with `%bf-dialog` for a narrower or wider dialog.

`dialog.show()` opens a dialog without a backdrop, as part of the page. It uses the same styles.

## Offcanvas

An offcanvas is a [dialog](#dialogs) that slides in from one edge of the window, full height or full width, such as a menu or a basket. Extend `%bf-offcanvas-start`, `-end`, `-top` or `-bottom` with `%bf-dialog`, and use the dialog's header, title, body and footer inside it:

```sass
.offcanvas-start
    @extend %bf-offcanvas-start
```

```css
@layer sassy.base.components {
  .offcanvas-start {
    --sassy-offcanvas-from: -100% 0;
    inset: auto;
    inset-inline-start: 0;
    translate: var(--sassy-offcanvas-from);
  }
  [open].offcanvas-start {
    animation: bf-offcanvas-slide var(--sassy-offcanvas-duration, 0.3s) ease-in-out;
    translate: none;
  }
}
```

```html
<button type="button" commandfor="menu" command="show-modal">Menu</button>

<dialog class="dialog offcanvas-start" id="menu" closedby="any" aria-labelledby="menu-title">
    <header>
        <h2 id="menu-title">Menu</h2>
        <button type="button" class="close" commandfor="menu" command="close" aria-label="Close"></button>
    </header>
    <div class="dialog-body">
        <p>…</p>
    </div>
</dialog>
```

- **It is a modal dialog**, so the browser puts it over a backdrop, makes the page behind it inert, closes it on Escape, and returns focus to the button that opened it. The page behind it does not scroll.
- **`closedby="any"` closes it when the backdrop is clicked.** `sassy.js` does this in browsers that don't support `closedby` yet.
- **It slides in and out**, and the backdrop fades. With reduced motion it appears at once. `--sassy-offcanvas-width` sets the width of a start or end offcanvas, and `--sassy-offcanvas-height` the height of a top or bottom one.
- **Start and end follow the text direction**, so in right-to-left text a start offcanvas comes in from the right.

### In the page from a breakpoint

With `%bf-offcanvas-{breakpoint}` as well, a closed offcanvas is part of the page from that breakpoint up - a sidebar on wide screens that is an offcanvas on narrow ones. It loses its backdrop styles, shadow and border, and its `command="close"` buttons are hidden. Hide the button that opens it at the same breakpoint, with `%bf-d-none-{breakpoint}`:

```sass
.offcanvas-md
    @extend %bf-offcanvas-md
```

```css
@layer sassy.base.components {
  @media (width >= 768px) {
    .offcanvas-md:not(:modal) {
      display: flex;
      position: static;
    }
    .offcanvas-md:not(:modal) button[command=close] {
      display: none;
    }
  }
}
```

```html
<button type="button" class="d-none-md" commandfor="filters" command="show-modal">Filters</button>

<dialog class="dialog offcanvas-start offcanvas-md" id="filters" closedby="any" aria-labelledby="filters-title">
    …
</dialog>
```

If the window is widened while the offcanvas is open, it stays a modal until it is closed.

## Carousels

A carousel is a row of slides that scrolls sideways and snaps to each one. Extend `%bf-carousel` on the element that scrolls: its children are the slides. In browsers that support `::scroll-button` and `::scroll-marker`, CSS adds previous and next buttons on its edges and a row of dots under it; in others, people swipe or scroll it:

```sass
.carousel
    @extend %bf-carousel
```

```css
@layer sassy.base.components {
  .carousel {
    display: grid;
    grid-auto-flow: column;
    overflow-x: auto;
    scroll-marker-group: after;
    scroll-snap-type: x mandatory;
  }
  .carousel > * {
    scroll-snap-align: start;
  }
}
```

```html
<section aria-roledescription="carousel" aria-label="Features">
    <div class="carousel" tabindex="0">
        <div role="group" aria-roledescription="slide" aria-label="1 of 3">…</div>
        <div role="group" aria-roledescription="slide" aria-label="2 of 3">…</div>
        <div role="group" aria-roledescription="slide" aria-label="3 of 3">…</div>
    </div>
</section>
```

- **Follow the ARIA carousel pattern:** wrap it in an element with `aria-roledescription="carousel"` and an `aria-label`, and give each slide `role="group"`, `aria-roledescription="slide"` and an `aria-label` saying where it is, such as "2 of 3". The dots are named after the slides' labels.
- **`tabindex="0"`** lets people scroll it with the arrow keys in every browser; Chromium makes it focusable without it.
- **`--sassy-carousel-per-view`** sets how many slides show at once (1 by default), with `--sassy-carousel-gap` between them. Set it in a media query to show more on wider screens.
- **The previous and next buttons** are greyed out at the first and last slide, and the current dot is solid and longer than the others. The arrows are the text in `$sassy-carousel-previous` and `$sassy-carousel-next`, mirrored in right-to-left text.

### Playing by itself

Give the slides element `aria-live="off"` and an `id`, and a button with `aria-controls` naming it and `aria-pressed="false"`, and `sassy.js` moves the carousel on every `--sassy-carousel-interval` (5 seconds), back to the first slide from the last:

```html
<section aria-roledescription="carousel" aria-label="News">
    <button type="button" aria-controls="news" aria-pressed="false">Pause</button>
    <div class="carousel" id="news" aria-live="off" tabindex="0">
        …
    </div>
</section>
```

- **The button pauses it** (`aria-pressed="true"`) and starts it again. Put it first in the carousel, so keyboard users reach it before the slides. While it is paused, `sassy.js` sets `aria-live="polite"`, so screen readers read each slide people move to; while it plays they don't, so they aren't interrupted.
- **It waits** while the pointer is over the carousel, something in it has focus, or the page is hidden. With reduced motion it starts paused, and plays only if the button is pressed.
- **Add it to the page later?** Call `Sassy.init(element)` on the element that contains it.

## Settings and custom properties

| Property                                                                                                                             | Controls                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `--sassy-btn-bg`, `--sassy-btn-colour`, `--sassy-btn-border-colour`                                                                  | The default button's background, text and border - the theme colours set their own                |
| `--sassy-btn-<name>-colour`                                                                                                          | Text on each theme colour's button, for example `--sassy-btn-warn-colour`                         |
| `--sassy-btn-outline-colour`, `--sassy-btn-focus-colour`                                                                             | The outline style's colour, and the focus ring                                                    |
| `--sassy-btn-font-weight`, `--sassy-btn-shade`                                                                                       | Text weight, and the colour mixed in on hover and press                                           |
| `--sassy-btn-toolbar-gap`                                                                                                            | Space between the groups in a toolbar                                                             |
| `--sassy-close-size`, `--sassy-close-opacity`, `--sassy-close-hover-opacity`                                                         | Close button size, and how faint it is, normally and under the pointer                            |
| `--sassy-badge-bg`, `--sassy-badge-colour`, `--sassy-badge-font-size`                                                                | Badge colours and text size - `%bf-text-bg-*` sets the colours instead                            |
| `--sassy-badge-padding-y`, `--sassy-badge-padding-x`, `--sassy-badge-radius`                                                         | Badge spacing and corners - `%bf-rounded-pill` makes a pill                                       |
| `--sassy-nav-gap`                                                                                                                    | Space between links and between tabs                                                              |
| `--sassy-nav-link-padding-y`, `--sassy-nav-link-padding-x`                                                                           | Padding of links and tabs                                                                         |
| `--sassy-nav-link-colour`, `--sassy-nav-link-hover-bg`                                                                               | Link colour, and background on hover                                                              |
| `--sassy-nav-link-justify`                                                                                                           | Where the text sits in a link - set to `center` by fill and justified                             |
| `--sassy-nav-link-radius`, `--sassy-nav-link-underline-width`                                                                        | Link corners and underline width - set by the pill and underline styles                           |
| `--sassy-nav-current-colour`, `--sassy-nav-current-bg`, `--sassy-nav-current-border-colour`                                          | The current link or selected tab                                                                  |
| `--sassy-nav-collapse-bg`, `--sassy-nav-collapse-border-colour`, `--sassy-nav-collapse-shadow`, `--sassy-nav-collapse-duration`      | The panel of a collapsed nav, and how long it takes to wipe                                       |
| `--sassy-nav-collapse-max-height`                                                                                                    | The tallest the panel grows before it scrolls                                                     |
| `--sassy-navbar-gap`, `--sassy-navbar-brand-colour`, `--sassy-navbar-brand-font-size`                                                | Space between a navbar's parts, and the brand's colour and size                                   |
| `--sassy-focus-outline-colour`, `-width`, `-offset`                                                                                  | The focus outline on links, tabs, panels, close buttons and `%bf-focus-ring`                      |
| `--sassy-breadcrumb-divider`, `--sassy-breadcrumb-divider-colour`, `--sassy-breadcrumb-gap`                                          | The divider between breadcrumb items - any CSS `content` value - its colour, and the space either side |
| `--sassy-breadcrumb-link-colour`, `--sassy-breadcrumb-current-colour`, `--sassy-breadcrumb-margin-bottom`                            | Breadcrumb link and current page colours, and the space below                                     |
| `--sassy-pagination-bg`, `--sassy-pagination-colour`, `--sassy-pagination-border-colour`, `--sassy-pagination-hover-bg`              | Page link background, text, border, and background under the pointer                              |
| `--sassy-pagination-current-bg`, `--sassy-pagination-current-colour`, `--sassy-pagination-disabled-colour`                           | The current page, and an ellipsis or a link that can't be used                                    |
| `--sassy-card-bg`, `--sassy-card-border-width`, `--sassy-card-border-colour`, `--sassy-card-radius`                                  | Card background, border and corners                                                               |
| `--sassy-card-padding-y`, `--sassy-card-padding-x`, `--sassy-card-cap-bg`                                                            | Card spacing, and the header and footer background                                                |
| `--sassy-list-group-bg`, `--sassy-list-group-colour`, `--sassy-list-group-border-width`, `--sassy-list-group-border-colour`, `--sassy-list-group-radius` | List group background, text, border and corners                                                   |
| `--sassy-list-group-padding-y`, `--sassy-list-group-padding-x`                                                                       | List group item padding                                                                           |
| `--sassy-list-group-hover-bg`, `--sassy-list-group-current-bg`, `--sassy-list-group-current-colour`, `--sassy-list-group-disabled-colour` | An actionable item under the pointer, the current item, and a disabled item                       |
| `--sassy-accordion-bg`, `--sassy-accordion-colour`, `--sassy-accordion-radius`                                                       | Accordion background, text and corners                                                            |
| `--sassy-accordion-border-width`, `--sassy-accordion-border-colour`                                                                  | The lines around and between the sections                                                         |
| `--sassy-accordion-padding-y`, `--sassy-accordion-padding-x`                                                                         | Header and content padding                                                                        |
| `--sassy-accordion-hover-bg`, `--sassy-accordion-open-bg`, `--sassy-accordion-open-colour`                                           | A header under the pointer, and an open section's header                                          |
| `--sassy-table-bg`, `--sassy-table-colour`, `--sassy-table-border-width`, `--sassy-table-border-colour`                              | Table background, text and lines - `%bf-table-{theme colour}` sets the background and line colour |
| `--sassy-table-padding-y`, `--sassy-table-padding-x`, `--sassy-table-small-padding`                                                  | Cell padding, and the padding of a small table                                                    |
| `--sassy-table-striped-bg`, `--sassy-table-hover-bg`, `--sassy-table-current-bg`                                                     | The shades laid over a striped row or column, the row under the pointer, and the current row      |
| `--sassy-tabs-border-width`, `--sassy-tabs-border-colour`, `--sassy-tabs-underline-width`                                            | The line under the tabs, and the selected tab's underline                                         |
| `--sassy-tab-panel-padding-y`                                                                                                        | Space above and below a panel's content                                                           |
| `--sassy-alert-bg`, `--sassy-alert-colour`, `--sassy-alert-border-width`, `--sassy-alert-border-colour`, `--sassy-alert-radius`      | Alert background, text, border and corners - the theme colours set the colours                    |
| `--sassy-alert-padding-y`, `--sassy-alert-padding-x`, `--sassy-alert-margin-bottom`                                                  | Alert spacing                                                                                     |
| `--sassy-progress-height`, `--sassy-progress-bg`, `--sassy-progress-bar-colour`, `--sassy-progress-radius`                           | Progress track height, track and bar colours, and corners                                         |
| `--sassy-progress-margin-bottom`                                                                                                     | Space below a progress bar or stacked bars                                                        |
| `--sassy-spinner-size`, `--sassy-spinner-width`, `--sassy-spinner-colour`                                                            | Spinner size, ring width and colour - the theme colours and `-small` set them                     |
| `--sassy-skeleton-colour`, `--sassy-skeleton-opacity`, `--sassy-skeleton-radius`                                                     | Skeleton colour, how faded it is, and its corners                                                 |
| `--sassy-toast-bg`, `--sassy-toast-colour`, `--sassy-toast-radius`, `--sassy-toast-shadow`                                           | Toast background, text, corners and shadow                                                        |
| `--sassy-toast-border-width`, `--sassy-toast-border-colour`                                                                          | The border, and the line under the title row                                                      |
| `--sassy-toast-font-size`, `--sassy-toast-width`, `--sassy-toast-padding-y`, `--sassy-toast-padding-x`                               | Toast text size, width and padding                                                                |
| `--sassy-toast-delay`, `--sassy-toast-fade`                                                                                          | How long `%bf-toast-autohide` waits, and how long it takes to fade                                |
| `--sassy-toast-container-offset`, `--sassy-toast-container-gap`, `--sassy-toast-container-z-index`                                   | The stack's gap from the window's edges, the gap between toasts, and what it sits above           |
| `--sassy-toast-container-block`, `--sassy-toast-container-inline`                                                                    | Where the stack sits - `-top`, `-start` and `-centre` set them                                    |
| `--sassy-tooltip-bg`, `--sassy-tooltip-colour`, `--sassy-tooltip-font-size`                                                          | Tooltip colours and text size                                                                     |
| `--sassy-tooltip-padding-y`, `--sassy-tooltip-padding-x`, `--sassy-tooltip-radius`, `--sassy-tooltip-max-width`                      | Tooltip shape and size                                                                            |
| `--sassy-tooltip-offset`                                                                                                             | Gap between a tooltip and its trigger                                                             |
| `--sassy-popover-bg`, `--sassy-popover-colour`, `--sassy-popover-radius`, `--sassy-popover-shadow`                                   | Popover background, text, corners and shadow                                                      |
| `--sassy-popover-border-width`, `--sassy-popover-border-colour`                                                                      | The border, and the line under the title                                                          |
| `--sassy-popover-font-size`, `--sassy-popover-max-width`, `--sassy-popover-offset`                                                   | Text size, width, and gap from the button                                                         |
| `--sassy-popover-padding-y`, `--sassy-popover-padding-x`                                                                             | Popover padding                                                                                   |
| `--sassy-popover-header-bg`, `--sassy-popover-header-font-size`                                                                      | The title bar: the heading a popover starts with                                                  |
| `--sassy-popover-side`                                                                                                               | Where the popover opens - `-bottom`, `-start` and `-end` set it                                   |
| `--sassy-dropdown-bg`, `--sassy-dropdown-colour`, `--sassy-dropdown-radius`, `--sassy-dropdown-shadow`                               | Dropdown background, text, corners and shadow                                                     |
| `--sassy-dropdown-border-width`, `--sassy-dropdown-border-colour`                                                                    | The border, and the line of a divider                                                             |
| `--sassy-dropdown-min-width`, `--sassy-dropdown-offset`, `--sassy-dropdown-padding-y`                                                | Width, gap from the button, and space above and below the items                                   |
| `--sassy-dropdown-item-padding-y`, `--sassy-dropdown-item-padding-x`                                                                 | Item padding                                                                                      |
| `--sassy-dropdown-hover-bg`, `--sassy-dropdown-current-bg`, `--sassy-dropdown-current-colour`                                        | An item under the pointer or with focus, and the current item                                     |
| `--sassy-dropdown-disabled-colour`, `--sassy-dropdown-header-colour`                                                                 | Items that can't be used, and headers                                                             |
| `--sassy-dropdown-side`, `--sassy-dropdown-align`                                                                                    | Where the menu opens - `%bf-dropdown-up` and `-end` set them                                      |
| `--sassy-dialog-bg`, `--sassy-dialog-border-width`, `--sassy-dialog-border-colour`, `--sassy-dialog-radius`, `--sassy-dialog-shadow` | Dialog background, border, corners and shadow                                                     |
| `--sassy-dialog-width`, `--sassy-dialog-padding-y`, `--sassy-dialog-padding-x`                                                       | Dialog width and spacing                                                                          |
| `--sassy-dialog-backdrop`                                                                                                            | The backdrop behind a modal dialog                                                                |
| `--sassy-offcanvas-width`, `--sassy-offcanvas-height`                                                                                | Width of a start or end offcanvas, and height of a top or bottom one                              |
| `--sassy-offcanvas-duration`                                                                                                         | How long it takes to slide in or out                                                              |
| `--sassy-carousel-per-view`, `--sassy-carousel-gap`                                                                                  | How many slides show at once, and the gap between them                                            |
| `--sassy-carousel-interval`                                                                                                          | How often a carousel that plays moves on (5s) - read by `sassy.js`                                |
| `--sassy-carousel-button-size`, `--sassy-carousel-button-offset`                                                                     | Size of the previous and next buttons, and their gap from the edge                                |
| `--sassy-carousel-button-bg`, `--sassy-carousel-button-colour`, `--sassy-carousel-button-shadow`                                     | The buttons' background, arrow and shadow                                                         |
| `--sassy-carousel-marker-size`, `--sassy-carousel-marker-colour`                                                                     | The dots under the slides                                                                         |
| `--sassy-scrollspy-offset`                                                                                                           | How far down the window a section must scroll to be current (25%) - read by `sassy.js`            |

Buttons also read the form controls' `--sassy-input-*` properties for their padding, text size, border width and radius, and `$sassy-btn-text-colours` sets which theme colours have dark text. The stripes and how fast the moving parts go are set by `$sassy-progress-stripe-colour`, `-stripe-size`, `-stripe-duration`, `-indeterminate-duration` and `-reduced-motion-factor`. `$sassy-accordion-duration` sets how long accordions take to open, and `$sassy-accordion-icon` their chevron. `$sassy-spinner-duration`, `$sassy-spinner-reduced-motion-factor` and `$sassy-spinner-small-size` / `-small-width` set how fast spinners move and the small size. `$sassy-skeleton-duration` sets how long the shimmer takes. The dialog sizes are set in `$sassy-dialog-sizes` in [`src/1-components/_153-dialog-variables.scss`](../src/1-components/_153-dialog-variables.scss), which you can configure with `with (...)`. Colours accept any CSS colour.

### A dark theme

```sass
@use "sassy/src" as sassy

@media (prefers-color-scheme: dark)
    :root
        --sassy-card-bg: #{sassy.colour("grey", 900)}
        --sassy-card-border-colour: #{sassy.colour("grey", 700)}
        --sassy-card-cap-bg: #{sassy.colour("grey", 800)}
        --sassy-dialog-bg: #{sassy.colour("grey", 900)}
        --sassy-dialog-border-colour: #{sassy.colour("grey", 700)}
        --sassy-nav-link-hover-bg: #{sassy.colour("grey", 800)}
        --sassy-tooltip-bg: #{sassy.colour("grey", 100)}
        --sassy-tooltip-colour: #{sassy.colour("grey", 900)}
```
