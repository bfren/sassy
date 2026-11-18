# 1-components: buttons, navigation, cards, tables, tabs, tooltips and dialogs

Live examples: [https://bfren.github.io/sassy/1-components.html](https://bfren.github.io/sassy/1-components.html)

`src/1-components` styles whole interface elements: buttons, navigation, cards, tables, tabs, tooltips and dialogs. Like forms, components are composites, so they output before the grid and utilities, and a utility such as `%bf-p-0` can override any part of one.

Every component reads its colours, spacing and sizes from custom properties, so a theme can change them at runtime. Components have no breakpoint variants.

## Behaviour and browser support

Buttons, navigation, cards and dialogs need no script - except for navigation that collapses. Tabs, tooltips and collapsible navigation need `sassy.js`, which you load once:

```html
<script src="https://cdn.jsdelivr.net/gh/bfren/sassy@0.3.0/dist/sassy.min.js" defer></script>
```

`sassy.js` finds everything by ARIA role and standard attributes, never by class name, so it works whatever selectors you extend the placeholders onto. It does four things:

| Feature          | What `sassy.js` does                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Collapsible navs | Opens and closes what a button with `aria-expanded` and `aria-controls` controls                                          |
| Tabs             | Switches panels when a tab is clicked, and moves between tabs with the arrow keys, Home and End                           |
| Tooltips         | Shows a tooltip on hover and keyboard focus, hides it on Escape, and places it in browsers without CSS anchor positioning |
| Commands         | Makes `command` / `commandfor` buttons work in browsers that do not support them yet                                      |

The components rely on these browser features:

| Feature                                  | Used by  | Baseline                                              | Without it                    |
| ---------------------------------------- | -------- | ----------------------------------------------------- | ----------------------------- |
| Popover API (`popover`)                  | Tooltips | Widely available, since April 2024                    | -                             |
| `command` and `commandfor`               | Dialogs  | Newly available: Chrome 135, Firefox 144, Safari 26.2 | `sassy.js` adds the behaviour |
| CSS anchor positioning (`position-area`) | Tooltips | Newly available, since January 2026                   | `sassy.js` places the tooltip |

With `sassy.js`, everything works in every browser that supports popovers, which all major browsers have since April 2024.

If you add tabs to the page after it has loaded, call `Sassy.init(element)` on the element that contains them. Tooltips and commands need no setup.

## Placeholders

| Placeholder                                                                                     | For                                                                                     |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `%bf-btn`                                                                                       | A button - on a `<button>`, or on a link that looks like one                            |
| `%bf-btn-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark` | A button in a theme colour, combined with `%bf-btn`                                     |
| `%bf-btn-outline`                                                                               | The colour on the border and text only, combined with `%bf-btn` and a colour            |
| `%bf-btn-small`, `%bf-btn-large`                                                                | Smaller or larger, the same as the form control sizes                                   |
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
| `%bf-card`                                                                                      | A bordered container                                                                    |
| `%bf-card-header`, `%bf-card-body`, `%bf-card-footer`                                           | The parts of a card                                                                     |
| `%bf-card-title`, `%bf-card-image`                                                              | A title in the body, and an image that fills the card's width                           |
| `%bf-tabs`                                                                                      | The list of tabs (`role="tablist"`)                                                     |
| `%bf-tab`                                                                                       | Each tab (`role="tab"`)                                                                 |
| `%bf-tab-panel`                                                                                 | Each panel (`role="tabpanel"`)                                                          |
| `%bf-tooltip`                                                                                   | A tooltip (`role="tooltip"` with `popover="manual"`)                                    |
| `%bf-dialog`, `-small`, `-large`                                                                | A `<dialog>`, at the default width or smaller or larger                                 |
| `%bf-dialog-header`, `%bf-dialog-body`, `%bf-dialog-footer`                                     | The parts of a dialog                                                                   |
| `%bf-dialog-title`                                                                              | The dialog's heading                                                                    |
| `%bf-dialog-close`                                                                              | A close button for the header. Give it `aria-label="Close"`                             |

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
- **In an input group**, a button joins the controls beside it, as an add-on does, and follows the group's size.

The text colour on each theme colour is chosen for contrast with the default theme: dark text on `info`, `warn`, `grey-light` and `ok`, white on the rest. If you change a theme colour, check its text still contrasts, and change it with `--sassy-btn-<name>-colour` if not - for example `--sassy-btn-primary-colour`.

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

## Dialogs

Dialogs style the native `<dialog>` element. Buttons open and close them with `command` and `commandfor`, so no script is needed in current browsers:

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

.dialog-close
    @extend %bf-dialog-close
```

```html
<button type="button" commandfor="confirm" command="show-modal">Delete file…</button>

<dialog class="dialog" id="confirm" aria-labelledby="confirm-title">
    <header>
        <h2 id="confirm-title">Delete this file?</h2>
        <button type="button" class="dialog-close" commandfor="confirm" command="close" aria-label="Close">×</button>
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

## Settings and custom properties

| Property                                                                                                                             | Controls                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `--sassy-btn-bg`, `--sassy-btn-colour`, `--sassy-btn-border-colour`                                                                  | The default button's background, text and border - the theme colours set their own                |
| `--sassy-btn-<name>-colour`                                                                                                          | Text on each theme colour's button, for example `--sassy-btn-warn-colour`                         |
| `--sassy-btn-outline-colour`, `--sassy-btn-focus-colour`                                                                             | The outline style's colour, and the focus ring                                                    |
| `--sassy-btn-font-weight`, `--sassy-btn-shade`                                                                                       | Text weight, and the colour mixed in on hover and press                                           |
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
| `--sassy-card-bg`, `--sassy-card-border-width`, `--sassy-card-border-colour`, `--sassy-card-radius`                                  | Card background, border and corners                                                               |
| `--sassy-card-padding-y`, `--sassy-card-padding-x`, `--sassy-card-cap-bg`                                                            | Card spacing, and the header and footer background                                                |
| `--sassy-table-bg`, `--sassy-table-colour`, `--sassy-table-border-width`, `--sassy-table-border-colour`                              | Table background, text and lines - `%bf-table-{theme colour}` sets the background and line colour |
| `--sassy-table-padding-y`, `--sassy-table-padding-x`, `--sassy-table-small-padding`                                                  | Cell padding, and the padding of a small table                                                    |
| `--sassy-table-striped-bg`, `--sassy-table-hover-bg`, `--sassy-table-current-bg`                                                     | The shades laid over a striped row or column, the row under the pointer, and the current row      |
| `--sassy-tabs-border-width`, `--sassy-tabs-border-colour`, `--sassy-tabs-underline-width`                                            | The line under the tabs, and the selected tab's underline                                         |
| `--sassy-tab-panel-padding-y`                                                                                                        | Space above and below a panel's content                                                           |
| `--sassy-tooltip-bg`, `--sassy-tooltip-colour`, `--sassy-tooltip-font-size`                                                          | Tooltip colours and text size                                                                     |
| `--sassy-tooltip-padding-y`, `--sassy-tooltip-padding-x`, `--sassy-tooltip-radius`, `--sassy-tooltip-max-width`                      | Tooltip shape and size                                                                            |
| `--sassy-tooltip-offset`                                                                                                             | Gap between a tooltip and its trigger                                                             |
| `--sassy-dialog-bg`, `--sassy-dialog-border-width`, `--sassy-dialog-border-colour`, `--sassy-dialog-radius`, `--sassy-dialog-shadow` | Dialog background, border, corners and shadow                                                     |
| `--sassy-dialog-width`, `--sassy-dialog-padding-y`, `--sassy-dialog-padding-x`                                                       | Dialog width and spacing                                                                          |
| `--sassy-dialog-backdrop`                                                                                                            | The backdrop behind a modal dialog                                                                |

Buttons also read the form controls' `--sassy-input-*` properties for their padding, text size, border width and radius, and `$sassy-btn-text-colours` sets which theme colours have dark text. The dialog sizes are set in `$sassy-dialog-sizes` in [`src/1-components/_160-dialog-variables.scss`](../src/1-components/_160-dialog-variables.scss), which you can configure with `with (...)`. Colours accept any CSS colour.

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
