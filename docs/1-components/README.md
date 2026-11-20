# 1-components: buttons, button groups, close buttons, badges, navigation, breadcrumbs, pagination, cards, list groups, accordions, tables, tabs, alerts, progress bars, spinners, skeletons, toasts, tooltips, popovers, dropdowns, dialogs, offcanvas and carousels

Live examples: [https://bfren.github.io/sassy/1-components.html](https://bfren.github.io/sassy/1-components.html)

`src/1-components` styles whole interface elements: buttons, button groups, close buttons, badges, navigation, breadcrumbs, pagination, cards, list groups, accordions, tables, tabs, alerts, progress bars, spinners, skeletons, toasts, tooltips, popovers, dropdowns, dialogs, offcanvas and carousels. Like forms, components are composites, so they output before the grid and utilities, and a utility such as `%bf-p-0` can override any part of one.

Every component reads its colours, spacing and sizes from custom properties, so a theme can change them at runtime. Components have no breakpoint variants.

## Pages

- [Buttons](110-button.md)
- [Button groups](111-button-group.md)
- [Close buttons](112-close.md)
- [Badges](113-badge.md)
- [Navigation](120-nav.md)
- [Breadcrumbs](121-breadcrumb.md)
- [Pagination](122-pagination.md)
- [Tabs](123-tabs.md)
- [Scrollspy](124-scrollspy.md)
- [Cards](130-card.md)
- [List groups](131-list-group.md)
- [Accordions](132-accordion.md)
- [Tables](133-table.md)
- [Alerts](140-alert.md)
- [Progress bars](141-progress.md)
- [Spinners](142-spinner.md)
- [Skeletons](143-skeleton.md)
- [Toasts](144-toast.md)
- [Tooltips](150-tooltip.md)
- [Popovers](151-popover.md)
- [Dropdowns](152-dropdown.md)
- [Dialogs](153-dialog.md)
- [Offcanvas](154-offcanvas.md)
- [Carousels](160-carousel.md)

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
| Offcanvas        | Closes a modal from its backdrop with `closedby="any"` where browsers can't, and when an in-page link in it is followed   |
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

| Placeholder                                                                                       | For                                                                                           |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `%bf-btn`                                                                                         | A button - on a `<button>`, or on a link that looks like one                                  |
| `%bf-btn-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark`   | A button in a theme colour, combined with `%bf-btn`                                           |
| `%bf-btn-outline`                                                                                 | The colour on the border and text only, combined with `%bf-btn` and a colour                  |
| `%bf-btn-small`, `%bf-btn-large`                                                                  | Smaller or larger, the same as the form control sizes                                         |
| `%bf-btn-group`                                                                                   | Buttons side by side that share their borders - on a `role="group"`                           |
| `%bf-btn-group-vertical`                                                                          | Buttons stacked one above the other, instead of `%bf-btn-group`                               |
| `%bf-btn-group-small`, `%bf-btn-group-large`                                                      | Every button in a group smaller or larger, combined with a group                              |
| `%bf-btn-toolbar`                                                                                 | Groups in a wrapping row - on a `role="toolbar"`                                              |
| `%bf-close`                                                                                       | A close button: an empty `<button>` with `aria-label="Close"`                                 |
| `%bf-badge`                                                                                       | A small label, sized from the text around it. Colour it with `%bf-text-bg-{theme}`            |
| `%bf-badge-count`                                                                                 | A badge on the top end corner of its parent, such as a button                                 |
| `%bf-nav`                                                                                         | A list of links, side by side - on a `<ul>`, or on a `<nav>` holding the links directly       |
| `%bf-nav-link`                                                                                    | A link outside a nav - a nav styles its own. Mark the current page with `aria-current="page"` |
| `%bf-nav-pills`, `%bf-nav-underline`                                                              | Pill or underline style for the current link, combined with `%bf-nav`                         |
| `%bf-nav-vertical`                                                                                | Stacks the links, combined with `%bf-nav`                                                     |
| `%bf-nav-fill`, `%bf-nav-justified`                                                               | Links that share the row's width, by their text or equally, combined with `%bf-nav`           |
| `%bf-nav-toggle`                                                                                  | The button that opens and closes a collapsed nav                                              |
| `%bf-nav-collapse-{breakpoint}`                                                                   | What the button opens: a panel below the breakpoint, and part of the page from it             |
| `%bf-navbar-expand-{breakpoint}`                                                                  | A row holding a brand, a toggle and a menu, which collapses below the breakpoint              |
| `%bf-navbar-brand`, `%bf-navbar-toggle`, `%bf-navbar-menu`                                        | The parts of a navbar: the site name or logo, the button, and what the button opens           |
| `%bf-navbar-push`                                                                                 | The open menu pushes the page down, combined with `%bf-navbar-expand-{breakpoint}`            |
| `%bf-breadcrumb`                                                                                  | A trail of links to the current page - on the `<ol>` in a `<nav>`                             |
| `%bf-pagination`                                                                                  | Links to numbered pages in a joined row - on the `<ul>` in a `<nav>`                          |
| `%bf-pagination-small`, `%bf-pagination-large`                                                    | Smaller or larger, the same as the form control sizes                                         |
| `%bf-card`                                                                                        | A bordered container                                                                          |
| `%bf-card-header`, `%bf-card-body`, `%bf-card-footer`                                             | Parts that aren't a `<header>` or `<footer>`, and the body                                    |
| `%bf-card-title`, `%bf-card-image`                                                                | A title in the body, and an image that fills the card's width                                 |
| `%bf-list-group`                                                                                  | A bordered list whose direct children are its items - `<li>`, or `<a>` and `<button>`         |
| `%bf-list-group-flush`                                                                            | No outer border or corners, for a list that fills a card                                      |
| `%bf-list-group-numbered`                                                                         | Numbers the items of an `<ol>`                                                                |
| `%bf-list-group-horizontal`, `-horizontal-{breakpoint}`                                           | Items side by side, always or from a breakpoint                                               |
| `%bf-accordion`                                                                                   | A `<div>` of `<details>`, each a header and content that open and close                       |
| `%bf-accordion-flush`                                                                             | No outer border or corners, for an accordion that fills a card                                |
| `%bf-tabs`                                                                                        | The list of tabs (`role="tablist"`)                                                           |
| `%bf-tab`                                                                                         | A tab outside a tab list - the list styles its `role="tab"` children                          |
| `%bf-tab-panel`                                                                                   | Each panel (`role="tabpanel"`)                                                                |
| `%bf-alert`                                                                                       | A message box - see [Alerts](140-alert.md) for its `role`                                     |
| `%bf-alert-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark` | An alert tinted with a theme colour, combined with `%bf-alert`                                |
| `%bf-alert-title`                                                                                 | A title that isn't the heading the alert starts with                                          |
| `%bf-alert-dismissible`                                                                           | Room for a close button, combined with `%bf-alert`                                            |
| `%bf-progress`                                                                                    | A native `<progress>` bar - without a value, a bar slides along it                            |
| `%bf-progress-{theme colour}`                                                                     | A bar in a theme colour, combined with `%bf-progress`                                         |
| `%bf-progress-animated`                                                                           | Moving stripes over the bar, combined with `%bf-progress`                                     |
| `%bf-progress-stacked`                                                                            | Several bars in one track, on a `<div role="group">`                                          |
| `%bf-spinner`, `%bf-spinner-grow`                                                                 | A ring that turns, or a dot that grows - see [Spinners](142-spinner.md)                       |
| `%bf-spinner-{theme colour}`, `%bf-spinner-small`                                                 | A spinner in a theme colour, or small, combined with either                                   |
| `%bf-skeleton`                                                                                    | A faded block in place of content while it loads - see [Skeletons](143-skeleton.md)           |
| `%bf-toast`                                                                                       | A short message over the page, with a `<header>` title row - see [Toasts](144-toast.md)       |
| `%bf-toast-autohide`                                                                              | Hides a toast after a delay, waiting while it is hovered or focused                           |
| `%bf-toast-container`                                                                             | The stack toasts sit in, fixed to the bottom end corner                                       |
| `%bf-toast-container-top`, `-start`, `-centre`                                                    | Moves the stack to the top, or to the start or centre                                         |
| `%bf-tooltip`                                                                                     | A tooltip (`role="tooltip"` with `popover="manual"`)                                          |
| `%bf-popover`                                                                                     | A panel of content in a popover (`role="dialog"`), opened by a `popovertarget` button         |
| `%bf-popover-bottom`, `%bf-popover-start`, `%bf-popover-end`                                      | Opens below the button, or before or after it, rather than above                              |
| `%bf-dropdown`                                                                                    | A menu in a popover (`popover`, opened by a `popovertarget` button)                           |
| `%bf-dropdown-up`, `%bf-dropdown-end`                                                             | Opens above the button, or lines up with its end                                              |
| `%bf-dropdown-header`, `%bf-dropdown-divider`                                                     | A label or line that isn't a heading or `<hr>`                                                |
| `%bf-dropdown-toggle`, `%bf-dropdown-split`                                                       | A chevron after a button's text, or a chevron-only split button                               |
| `%bf-dialog`, `-small`, `-large`                                                                  | A `<dialog>`, at the default width or smaller or larger                                       |
| `%bf-dialog-header`, `%bf-dialog-body`, `%bf-dialog-footer`                                       | Parts that aren't a `<header>`, `<footer>` or the content between                             |
| `%bf-dialog-title`                                                                                | A title that isn't a heading in the header                                                    |
| `%bf-offcanvas-start`, `-end`, `-top`, `-bottom`                                                  | With `%bf-dialog`, a panel that slides in from that edge                                      |
| `%bf-offcanvas-{breakpoint}`                                                                      | With a side, part of the page from that breakpoint up                                         |
| `%bf-carousel`                                                                                    | A row of slides that scrolls and snaps - see [Carousels](160-carousel.md)                     |

## Settings and custom properties

| Property                                            | Controls                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| `--sassy-focus-outline-colour`, `-width`, `-offset` | The focus outline on links, tabs, panels, close buttons and `%bf-focus-ring` |

Buttons also read the form controls' `--sassy-input-*` properties for their padding, text size, border width and radius, and `$sassy-btn-text-colours` sets which theme colours have dark text. The stripes and how fast the moving parts go are set by `$sassy-progress-stripe-colour`, `-stripe-size`, `-stripe-duration`, `-indeterminate-duration` and `-reduced-motion-factor`. `$sassy-accordion-duration` sets how long accordions take to open, and `$sassy-accordion-icon` their chevron. `$sassy-spinner-duration`, `$sassy-spinner-reduced-motion-factor` and `$sassy-spinner-small-size` / `-small-width` set how fast spinners move and the small size. `$sassy-skeleton-duration` sets how long the shimmer takes. The dialog sizes are set in `$sassy-dialog-sizes` in [`src/1-components/_153-dialog-variables.scss`](../../src/1-components/_153-dialog-variables.scss), which you can configure with `with (...)`. Colours accept any CSS colour.

### A dark theme

Components take their neutral colours from Sassy's colour roles, so extending `%bf-theme-dark` (or `%bf-theme-auto`) on `html` or a section switches them all - see [5-theme](../5-theme/500-theme.md#light-and-dark). Set a component's own property to change just that component, as before.
