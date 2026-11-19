# Coming from Bootstrap

Sassy was inspired by Bootstrap, and covers most of what Bootstrap 5.3 offers: content styles, the grid, utilities, forms and components. It isn't a drop-in replacement, though. The names, the markup and the way you use it are different. This page is for people who know Bootstrap: it lists what Sassy does differently, then maps Bootstrap's classes to the Sassy placeholders that do the same job.

## Different on purpose

- **Placeholders, not classes.** Sassy outputs `%bf-…` placeholders, and you `@extend` them onto your own selectors, so your HTML keeps names that mean something to you and your CSS has only the rules you use. `dist/full.css` has every placeholder as a `.bf-…` class too, for prototyping or a page without Sass.
- **Breakpoints go last.** Bootstrap's `.d-md-none` is `%bf-d-none-md`, and `.col-lg-4` is `%bf-col-4-lg`. The breakpoints have the same names and widths (`sm` 576px to `xl` 1200px), with `2xl` (1400px) where Bootstrap has `xxl`, and one more, `3xl` (1600px).
- **Sizes are words.** Bootstrap's `-sm` and `-lg` sizes are `-small` and `-large`, so they can't be mistaken for breakpoints: `.btn-sm` is `%bf-btn-small`.
- **A finer spacing scale.** Margin, padding and gap go from 0 to 20 in steps of 0.25rem, where Bootstrap has 0 to 5. Bootstrap's `3` (1rem) is Sassy's `4`, its `4` (1.5rem) is `6` and its `5` (3rem) is `12`; `1` and `2` are the same.
- **Native elements and ARIA, not `data-bs-*`.** Modals are `<dialog>` opened with `command="show-modal"`, accordions are `<details>`, dropdowns and popovers use `popovertarget`, progress bars are `<progress>`. Tabs, tooltips and carousels are found by their ARIA roles. Most components need no script at all.
- **A small script, not a plugin API.** The optional `sassy.js` adds what HTML and CSS can't do yet: tab and menu keys, tooltips, autoplay, scrollspy, and fallbacks for newer browser features. It has no JavaScript API to call and fires no events of its own.
- **Logical sides.** Start and end follow the text direction everywhere, so there is no separate right-to-left build: `%bf-ms-auto` is `margin-inline-start`.
- **Cascade layers.** Everything Sassy outputs is in layers, so breakpoint variants and utilities win over components whatever the selectors' specificity, and your own unlayered CSS beats all of Sassy. See [Cascade layers](../README.md#cascade-layers).
- **Theme colours have different names.** `primary` and `secondary` are as in Bootstrap; `success`, `danger` and `warning` are `ok`, `error` and `warn`; `info` is the same; `light` and `dark` are `grey-light` and `grey-dark`. Colour placeholders use `c` for text: `.text-danger` is `%bf-c-error`.
- **British spelling.** `centre`, `colour`, `grey`: `.text-center` is `%bf-text-align-centre`.

## Mapping

The tables give Bootstrap's class and the Sassy placeholder to extend instead. Where a Bootstrap component needs classes on its children, Sassy often styles them from the parent, so the children need none - the [components page](1-components/README.md) shows the markup each one expects.

### Layout and grid

| Bootstrap                     | Sassy                                                           |
| ----------------------------- | --------------------------------------------------------------- |
| `.container`                  | `%bf-wrap`                                                      |
| `.row`                        | `%bf-d-flex-row`                                                |
| `.col`, `.col-6`, `.col-auto` | `%bf-col`, `%bf-col-6`, `%bf-col-auto`                          |
| `.col-md-6`                   | `%bf-col-6-md`                                                  |
| `.offset-2`                   | `%bf-col-offset-2`                                              |
| `.row-cols-3`                 | `%bf-row-cols-3`                                                |
| `.g-{0-5}`                    | `%bf-gutter-{0-5}`, on the row, with the same sizes             |
| `.grid` (CSS grid)            | `%bf-grid`, with `%bf-grid-col-{1-12}` and `%bf-grid-start-{n}` |

### Content

| Bootstrap                           | Sassy                                                       |
| ----------------------------------- | ----------------------------------------------------------- |
| Reboot                              | Element defaults with no specificity, and `%bf-body` opt-in |
| `.h1` to `.h6`                      | `%bf-h1` to `%bf-h6`                                        |
| `.display-1` to `.display-6`        | `%bf-display-1` to `%bf-display-6`                          |
| `.lead`, `.initialism`              | `%bf-lead`, `%bf-initialism`                                |
| `.list-unstyled`, `.list-inline`    | `%bf-list-unstyled`, `%bf-list-inline` (items need nothing) |
| `.blockquote`, `.blockquote-footer` | `%bf-blockquote`, `%bf-blockquote-caption`                  |
| `.figure`                           | `%bf-figure`, which styles its `<img>` and `<figcaption>`   |
| `.img-fluid`                        | `%bf-img-fluid`                                             |

### Utilities

| Bootstrap                                         | Sassy                                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `.m-3`, `.mt-3`, `.mx-auto`, `.ms-auto`           | `%bf-m-4`, `%bf-mt-4`, `%bf-mx-auto`, `%bf-ms-auto` - see the scale above                         |
| `.p-2`, `.px-3`                                   | `%bf-p-2`, `%bf-px-4`                                                                             |
| `.gap-3`                                          | `%bf-gap-4`                                                                                       |
| `.d-none`, `.d-flex`, `.d-md-block`               | `%bf-d-none`, `%bf-d-flex`, `%bf-d-block-md`                                                      |
| `.flex-column`, `.flex-wrap`, `.flex-grow-1`      | `%bf-flex-column`, `%bf-flex-wrap-wrap`, `%bf-flex-grow-1`                                        |
| `.justify-content-between`, `.align-items-center` | `%bf-flex-justify-between`, `%bf-flex-align-items-centre`                                         |
| `.order-last`                                     | `%bf-flex-order-last`                                                                             |
| `.w-50`, `.h-100`, `.mw-100`, `.vh-100`           | `%bf-width-50`, `%bf-height-100`, `%bf-max-width-100`, `%bf-viewheight-100`                       |
| `.position-sticky`, `.top-0`                      | `%bf-position-sticky`, `%bf-top-0`                                                                |
| `.sticky-top`, `.fixed-top`                       | `%bf-position-sticky` or `%bf-position-fixed`, with `%bf-top-0`                                   |
| `.z-3`                                            | `%bf-z-index-3`                                                                                   |
| `.overflow-hidden`                                | `%bf-overflow-hidden`                                                                             |
| `.ratio .ratio-16x9`                              | `%bf-aspect-ratio-16x9`, on the element itself                                                    |
| `.object-fit-cover`                               | `%bf-object-fit-cover`                                                                            |
| `.float-start`                                    | `%bf-float-start`                                                                                 |
| `.align-middle`                                   | `%bf-vertical-align-middle`                                                                       |
| `.opacity-50`                                     | `%bf-opacity-50`                                                                                  |
| `.pe-none`, `.user-select-none`                   | `%bf-pointer-events-none`, `%bf-user-select-none`                                                 |
| `.visually-hidden`, `.visually-hidden-focusable`  | `%bf-visually-hidden`, `%bf-visually-hidden-focusable`                                            |
| `.text-start`, `.text-center`, `.text-end`        | `%bf-text-align-start`, `%bf-text-align-centre`, `%bf-text-align-end`                             |
| `.fs-1` to `.fs-6`, `.small`                      | `%bf-font-size-1` to `-6` (a smaller scale, 2 to 1.1 times the base), `%bf-font-size-small`       |
| `.fw-bold`, `.fst-italic`                         | `%bf-font-weight-700`, `%bf-font-style-italic`                                                    |
| `.lh-1`                                           | `%bf-line-height-single`                                                                          |
| `.text-uppercase`                                 | `%bf-text-transform-upper`                                                                        |
| `.text-decoration-none`                           | `%bf-text-decoration-none`                                                                        |
| `.text-nowrap`, `.text-truncate`, `.text-break`   | `%bf-text-wrap-overflow`, `%bf-text-truncate`, `%bf-text-break`                                   |
| `.link-offset-2`, `.link-underline-opacity-50`    | `%bf-text-underline-offset-2`, `%bf-text-decoration-opacity-50`                                   |
| `.stretched-link`, `.icon-link`, `.focus-ring`    | `%bf-stretched-link`, `%bf-icon-link`, `%bf-focus-ring`                                           |
| `.border`, `.border-0`, `.border-top`             | `%bf-border-1`, `%bf-border-0`, `%bf-border-top-1`                                                |
| `.rounded`, `.rounded-circle`, `.rounded-pill`    | `%bf-rounded`, `%bf-rounded-circle`, `%bf-rounded-pill`; the numbered sizes are a different scale |
| `.shadow-sm`, `.shadow`, `.shadow-lg`             | `%bf-shadow-1`, `%bf-shadow-2`, `%bf-shadow-3`                                                    |

### Colours

| Bootstrap              | Sassy                                                                       |
| ---------------------- | --------------------------------------------------------------------------- |
| `.text-primary`        | `%bf-c-primary`                                                             |
| `.bg-primary`          | `%bf-bg-primary`                                                            |
| `.text-bg-primary`     | `%bf-text-bg-primary`, with text chosen for contrast                        |
| `.border-primary`      | `%bf-border-primary`                                                        |
| Any palette colour     | `%bf-c-sky-600`, `%bf-bg-grey-100` and so on, from the Tailwind CSS palette |
| `data-bs-theme="dark"` | `%bf-theme-dark` on `html` or an element, or `%bf-theme-auto`               |

### Forms

Form placeholders keep Bootstrap's names, apart from the sizes.

| Bootstrap                                                                     | Sassy                                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `.form-label`, `.form-text`                                                   | `%bf-form-label`, `%bf-form-text`                                              |
| `.form-control`, `.form-control-sm`                                           | `%bf-form-control`, `%bf-form-control-small`                                   |
| `.form-control-plaintext`                                                     | `%bf-form-control-plaintext`                                                   |
| `.form-select`                                                                | `%bf-form-select`                                                              |
| `.form-check`, `.form-check-input`, `.form-check-label`, `.form-check-inline` | The same names, with `%bf-`                                                    |
| `.form-switch`                                                                | `%bf-form-switch`, on a checkbox with `role="switch"`                          |
| `.input-group`, `.input-group-text`                                           | `%bf-input-group`, `%bf-input-group-text`                                      |
| `.form-floating`                                                              | `%bf-form-floating`                                                            |
| `.form-range`, `.form-control-color`                                          | `%bf-form-range`, `%bf-form-colour`                                            |
| `.is-valid`, `.is-invalid`                                                    | `%bf-form-control-valid`, `%bf-form-control-invalid`, or `aria-invalid="true"` |
| `.was-validated`                                                              | Nothing: `:user-invalid` shows errors once someone has used a field            |
| `.valid-feedback`, `.invalid-feedback`                                        | `%bf-form-feedback-valid`, `%bf-form-feedback-invalid`                         |

### Components

| Bootstrap                                                                                    | Sassy                                                                                                                    |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `.btn .btn-primary`, `.btn-outline-primary`                                                  | `%bf-btn` + `%bf-btn-primary`, + `%bf-btn-outline`                                                                       |
| `.btn-sm`, `.btn-lg`                                                                         | `%bf-btn-small`, `%bf-btn-large`                                                                                         |
| `.btn-close`                                                                                 | `%bf-close`, on an empty `<button aria-label="Close">`                                                                   |
| `.btn-group`, `.btn-group-vertical`, `.btn-toolbar`                                          | `%bf-btn-group`, `%bf-btn-group-vertical`, `%bf-btn-toolbar`                                                             |
| `.badge`                                                                                     | `%bf-badge`, coloured with `%bf-text-bg-*` and rounded with `%bf-rounded-pill`                                           |
| A badge on a button's corner                                                                 | `%bf-badge-count`                                                                                                        |
| `.nav`, `.nav-link`, `.nav-pills`, `.nav-underline`                                          | `%bf-nav`, `%bf-nav-link`, `%bf-nav-pills`, `%bf-nav-underline`; the current link has `aria-current="page"`              |
| `.nav-fill`, `.nav-justified`, `.flex-column` on a nav                                       | `%bf-nav-fill`, `%bf-nav-justified`, `%bf-nav-vertical`                                                                  |
| `.nav-tabs` with the tab plugin                                                              | `%bf-tabs`, `%bf-tab`, `%bf-tab-panel`, with the ARIA tab roles                                                          |
| `.navbar .navbar-expand-lg`, `.navbar-brand`, `.navbar-toggler`, `.navbar-collapse`          | `%bf-navbar-expand-lg`, `%bf-navbar-brand`, `%bf-navbar-toggle`, `%bf-navbar-menu`                                       |
| `.breadcrumb`, `.breadcrumb-item`                                                            | `%bf-breadcrumb` on the `<ol>`; the items need nothing                                                                   |
| `.pagination`, `.page-item`, `.page-link`, `.pagination-sm`                                  | `%bf-pagination` on the `<ul>`, and `%bf-pagination-small`; the items need nothing                                       |
| `.card`, `.card-header`, `.card-body`, `.card-footer`, `.card-title`, `.card-img-top`        | `%bf-card`, `%bf-card-header`, `-body`, `-footer`, `-title`, `-image`                                                    |
| `.list-group`, `.list-group-flush`, `.list-group-numbered`, `.list-group-horizontal-md`      | `%bf-list-group`, `-flush`, `-numbered`, `-horizontal-md`; the items need nothing                                        |
| `.accordion`, `.accordion-flush`                                                             | `%bf-accordion`, `-flush`, on a `<div>` of `<details>`                                                                   |
| `.table`, `.table-striped`, `.table-hover`, `.table-bordered`, `.table-sm`, `.table-primary` | `%bf-table`, `-striped`, `-hover`, `-bordered`, `-small`, `-primary`                                                     |
| `.table-responsive-md`                                                                       | `%bf-table-responsive-md`, on the wrapper                                                                                |
| `.alert .alert-primary`, `.alert-heading`, `.alert-dismissible`                              | `%bf-alert`, `%bf-alert-primary`, `%bf-alert-title`, `%bf-alert-dismissible`; the close button has `command="--dismiss"` |
| `.progress`, `.progress-bar`                                                                 | `%bf-progress` on a native `<progress>`                                                                                  |
| `.progress-bar-striped .progress-bar-animated`, `.progress-stacked`                          | `%bf-progress-animated`, `%bf-progress-stacked`                                                                          |
| `.spinner-border`, `.spinner-grow`, `.spinner-border-sm`                                     | `%bf-spinner`, `%bf-spinner-grow`, `%bf-spinner-small`                                                                   |
| `.placeholder`, `.placeholder-glow`                                                          | `%bf-skeleton`, which shimmers by itself                                                                                 |
| `.toast`, `.toast-header`, `.toast-body`, `.toast-container`                                 | `%bf-toast`, styling a `<header>` it starts with, and `%bf-toast-container`                                              |
| `data-bs-autohide`                                                                           | `%bf-toast-autohide`, in CSS                                                                                             |
| Tooltips, `data-bs-toggle="tooltip"`                                                         | `%bf-tooltip`, on a `role="tooltip"` popover named by the trigger's `aria-describedby`                                   |
| Popovers, `data-bs-toggle="popover"`                                                         | `%bf-popover`, on a `popover` with `role="dialog"`, opened by `popovertarget`                                            |
| `.dropdown-menu`, `.dropdown-item`, `.dropdown-toggle`                                       | `%bf-dropdown` on the popover menu (items need nothing), and `%bf-dropdown-toggle`                                       |
| `.dropdown-divider`, `.dropdown-header`, `.dropup`, `.dropdown-menu-end`                     | `%bf-dropdown-divider`, `-header`, `-up`, `-end`                                                                         |
| `.modal`, `.modal-header`, `.modal-title`, `.modal-body`, `.modal-footer`                    | `%bf-dialog`, `-header`, `-title`, `-body`, `-footer`, on a `<dialog>`                                                   |
| `.modal-sm`, `.modal-lg`                                                                     | `%bf-dialog-small`, `%bf-dialog-large`                                                                                   |
| `.offcanvas .offcanvas-start`, `.offcanvas-lg`                                               | `%bf-dialog` + `%bf-offcanvas-start`, + `%bf-offcanvas-lg`                                                               |
| `.carousel`, `.carousel-item`                                                                | `%bf-carousel` on the scrolling element; the slides need nothing                                                         |
| `data-bs-ride="carousel"`                                                                    | `aria-live="off"` on the slides, with `sassy.js`                                                                         |
| Scrollspy, `data-bs-spy="scroll"`                                                            | `aria-current="location"` on a nav link, with `sassy.js`                                                                 |
| `.collapse`                                                                                  | `<details>`, or a button with `aria-expanded` and `aria-controls` and `sassy.js`                                         |

Opening and closing use HTML rather than `data-bs-*` attributes:

| Bootstrap                                    | HTML                                                               |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `data-bs-toggle="modal" data-bs-target="#x"` | `commandfor="x" command="show-modal"`                              |
| `data-bs-dismiss="modal"`                    | `commandfor="x" command="close"`                                   |
| Closing a modal from its backdrop            | `closedby="any"` on the `<dialog>` (a modal stays open by default) |
| `data-bs-toggle="dropdown"`                  | `popovertarget="x"`, with `popover` on the menu                    |
| `data-bs-dismiss="alert"`                    | `commandfor="x" command="--dismiss"`, with `sassy.js`              |

## Not in Sassy

- **Stacks** (`.vstack`, `.hstack`) and the vertical rule (`.vr`): use `%bf-d-flex`, `%bf-flex-column` and `%bf-gap-*`.
- **`.clearfix`** and **`.translate-middle`**.
- **Colour opacity utilities** such as `.bg-opacity-50` and `.text-opacity-75`, and `.bg-gradient`.
- **Theme colours on list group items** (`.list-group-item-primary`), and coloured links (`.link-primary`).
- **The rest of Reboot.** Sassy's element defaults cover headings, lists, quotes, figures, tables and more, but the body font is opt-in with `%bf-body`, and paragraph and link defaults are left to the browser.
- **The JavaScript plugin API**: no `new bootstrap.Modal()`, no `show.bs.modal` events. Use the elements' own methods and events, such as `dialog.showModal()` and the `toggle` event.
- **Bootstrap Icons.** Sassy draws its few icons (the close button and chevrons) as masks in the text colour.
