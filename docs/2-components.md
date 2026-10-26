# 2-components: buttons, navigation, cards, tabs, tooltips and dialogs

Live examples: [https://bfren.github.io/sassy/2-components.html](https://bfren.github.io/sassy/2-components.html)

`src/2-components` styles whole interface elements: buttons, navigation, cards, tabs, tooltips and dialogs. Like forms, components are composites, so they output before the grid and utilities, and a utility such as `%bf-p-0` can override any part of one.

Every component reads its colours, spacing and sizes from custom properties, so a theme can change them at runtime. Components have no breakpoint variants.

## Behaviour and browser support

Buttons, navigation, cards and dialogs need no script. Tabs and tooltips need `sassy.js`, which you load once:

```html
<script src="https://cdn.jsdelivr.net/gh/bfren/sassy@0.3.0/dist/sassy.min.js" defer></script>
```

`sassy.js` finds everything by ARIA role and standard attributes, never by class name, so it works whatever selectors you extend the placeholders onto. It does three things:

| Feature  | What `sassy.js` does                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| Tabs     | Switches panels when a tab is clicked, and moves between tabs with the arrow keys, Home and End                           |
| Tooltips | Shows a tooltip on hover and keyboard focus, hides it on Escape, and places it in browsers without CSS anchor positioning |
| Commands | Makes `command` / `commandfor` buttons work in browsers that do not support them yet                                      |

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
.button {
  align-items: center;
  background-color: var(--sassy-btn-bg);
  border: var(--sassy-input-border-width) solid var(--sassy-btn-border-colour);
  border-radius: var(--sassy-input-radius);
  color: var(--sassy-btn-colour);
  display: inline-flex;
  padding: var(--sassy-input-padding-y) var(--sassy-input-padding-x);
}
.button:hover {
  background-color: color-mix(in oklab, var(--sassy-btn-bg) 88%, var(--sassy-btn-shade));
}
.button-save {
  --sassy-btn-bg: var(--sassy-theme-primary);
  --sassy-btn-border-colour: var(--sassy-theme-primary);
  --sassy-btn-colour: var(--sassy-btn-primary-colour);
  --sassy-btn-focus-colour: var(--sassy-theme-primary);
  --sassy-btn-outline-colour: var(--sassy-theme-primary);
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
:root:has(.dialog:modal) {
  overflow: hidden;
}
```

The dialog is a column with a maximum height, so when its content is taller than the window, the body scrolls between the header and footer. Extend `%bf-dialog-small` or `%bf-dialog-large` with `%bf-dialog` for a narrower or wider dialog.

`dialog.show()` opens a dialog without a backdrop, as part of the page. It uses the same styles.

## Settings and custom properties

| Property                                                                                                                             | Controls                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `--sassy-btn-bg`, `--sassy-btn-colour`, `--sassy-btn-border-colour`                                                                  | The default button's background, text and border - the theme colours set their own |
| `--sassy-btn-<name>-colour`                                                                                                          | Text on each theme colour's button, for example `--sassy-btn-warn-colour`          |
| `--sassy-btn-outline-colour`, `--sassy-btn-focus-colour`                                                                             | The outline style's colour, and the focus ring                                     |
| `--sassy-btn-font-weight`, `--sassy-btn-shade`                                                                                       | Text weight, and the colour mixed in on hover and press                            |
| `--sassy-nav-gap`                                                                                                                    | Space between links and between tabs                                               |
| `--sassy-nav-link-padding-y`, `--sassy-nav-link-padding-x`                                                                           | Padding of links and tabs                                                          |
| `--sassy-nav-link-colour`, `--sassy-nav-link-hover-bg`                                                                               | Link colour, and background on hover                                               |
| `--sassy-nav-link-radius`, `--sassy-nav-link-underline-width`                                                                        | Link corners and underline width - set by the pill and underline styles            |
| `--sassy-nav-current-colour`, `--sassy-nav-current-bg`, `--sassy-nav-current-border-colour`                                          | The current link or selected tab                                                   |
| `--sassy-focus-outline-colour`, `-width`, `-offset`                                                                                  | The focus outline on links, tabs, panels and close buttons                         |
| `--sassy-card-bg`, `--sassy-card-border-width`, `--sassy-card-border-colour`, `--sassy-card-radius`                                  | Card background, border and corners                                                |
| `--sassy-card-padding-y`, `--sassy-card-padding-x`, `--sassy-card-cap-bg`                                                            | Card spacing, and the header and footer background                                 |
| `--sassy-tabs-border-width`, `--sassy-tabs-border-colour`, `--sassy-tabs-underline-width`                                            | The line under the tabs, and the selected tab's underline                          |
| `--sassy-tab-panel-padding-y`                                                                                                        | Space above and below a panel's content                                            |
| `--sassy-tooltip-bg`, `--sassy-tooltip-colour`, `--sassy-tooltip-font-size`                                                          | Tooltip colours and text size                                                      |
| `--sassy-tooltip-padding-y`, `--sassy-tooltip-padding-x`, `--sassy-tooltip-radius`, `--sassy-tooltip-max-width`                      | Tooltip shape and size                                                             |
| `--sassy-tooltip-offset`                                                                                                             | Gap between a tooltip and its trigger                                              |
| `--sassy-dialog-bg`, `--sassy-dialog-border-width`, `--sassy-dialog-border-colour`, `--sassy-dialog-radius`, `--sassy-dialog-shadow` | Dialog background, border, corners and shadow                                      |
| `--sassy-dialog-width`, `--sassy-dialog-padding-y`, `--sassy-dialog-padding-x`                                                       | Dialog width and spacing                                                           |
| `--sassy-dialog-backdrop`                                                                                                            | The backdrop behind a modal dialog                                                 |

Buttons also read the form controls' `--sassy-input-*` properties for their padding, text size, border width and radius, and `$sassy-btn-text-colours` sets which theme colours have dark text. The dialog sizes are set in `$sassy-dialog-sizes` in [`src/2-components/_260-dialog-variables.scss`](../src/2-components/_260-dialog-variables.scss), which you can configure with `with (...)`. Colours accept any CSS colour.

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
