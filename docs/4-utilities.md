# 4-utilities: text, layout, colour, display, border, corners and shadow

Live examples: [https://bfren.github.io/sassy/4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

`src/4-utilities` holds the single-purpose utilities: each sets one property, or one family of related properties, to one value. They output after the composites, so they can override them. Each section below has its placeholders, examples where they combine, and the settings it reads.

Most utilities have a breakpoint variant. Add the breakpoint to the end of the name, such as `%bf-d-none` and `%bf-d-block-lg`. Breakpoint variants are not available for `%bf-body`, `%bf-wrap`, the form placeholders and `%bf-visually-hidden`. `%bf-wrap` changes its own width at each breakpoint already.

## Text

`%bf-body` sets the text defaults on a `body` element: colour, font family, size, weight and line height, all from custom properties. It also sets the size, margins and spacing of `h1` to `h5`, so extend it once, on the page's body, and leave the headings to it.

| Placeholder                                                | Sets                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| `%bf-body`                                                 | Text defaults and heading sizes, on the body                             |
| `%bf-font-family-{mono, sans, serif}`                      | Font family                                                              |
| `%bf-font-size-{1-6, base, small, smaller, smallest}`      | Font size. `1` is largest, `6` is smallest of the numbered sizes         |
| `%bf-font-style-{italic, oblique, normal}`                 | Font style                                                               |
| `%bf-font-weight-{100-900, bold, bolder, lighter, normal}` | Font weight, as a number or keyword                                      |
| `%bf-line-height-{single, double, triple, base}`           | Line height                                                              |
| `%bf-text-align-{start, centre, end, justify}`             | Text alignment                                                           |
| `%bf-text-decoration-{under, over, through, none}`         | Underline, overline, line-through or none                                |
| `%bf-text-transform-{upper, lower, capitalise, none}`      | Upper or lower case, capitalised or none                                 |
| `%bf-text-wrap`                                            | Text wraps as normal                                                     |
| `%bf-text-wrap-overflow`                                   | Text stays on one line and overflows                                     |
| `%bf-text-truncate`                                        | Text stays on one line, truncated with an ellipsis, and expands on hover |
| `%bf-text-break`                                           | Long words and URLs break anywhere rather than overflow                  |
| `%bf-text-underline-offset-{auto, 1, 2, 3}`                | Gap between text and its underline, from `0.125em` to `0.375em`          |
| `%bf-text-decoration-opacity-{0-100}`                      | Fades the underline in steps of 10, without fading the text              |
| `%bf-stretched-link`                                       | Makes the nearest positioned ancestor clickable as the link              |
| `%bf-icon-link`                                            | A link with an icon: in a row, centred, with a `1em` square `svg`        |
| `%bf-outline-none`                                         | Removes the outline. Use with care, as it removes the focus indicator    |
| `%bf-focus-ring`                                           | The focus outline that links, tabs and buttons in components use         |

### Example: a page heading and a caption

```sass
@use "sassy/src" as sassy

body
    @extend %bf-body

.caption
    @extend %bf-font-size-smaller
    @extend %bf-font-style-italic
    @extend %bf-text-align-centre
    @extend %bf-c-grey-500
```

```html
<body>
    <h1>Our story</h1>
    <p class="caption">Photographed in the studio, spring 2026.</p>
</body>
```

### Example: long titles that stay on one line

```sass
.card-title
    @extend %bf-text-truncate
    @extend %bf-font-weight-700
```

### Example: a focus ring

```sass
.result
    @extend %bf-focus-ring
    --sassy-focus-outline-offset: 4px
```

```css
.result:focus-visible {
  outline: var(--sassy-focus-outline-width, 2px) solid var(--sassy-focus-outline-colour, var(--sassy-theme-primary));
  outline-offset: var(--sassy-focus-outline-offset, 2px);
}
```

```html
<a class="result" href="/post">A search result</a>
```

The ring only shows when the keyboard moves focus, not on a click. It reads the same `--sassy-focus-outline-*` properties as the components, so a site that changes them gets the same ring everywhere, and one element can change them for itself.

### Example: a clickable card

```sass
.teaser
    @extend %bf-position-relative

.teaser-link
    @extend %bf-stretched-link
    @extend %bf-text-underline-offset-2
    @extend %bf-text-decoration-opacity-50
```

```css
.teaser-link::after {
  content: "";
  inset: 0;
  position: absolute;
  z-index: 1;
}
.teaser-link {
  text-decoration-color: color-mix(in srgb, currentColor 50%, transparent);
}
```

```html
<article class="teaser">
    <h3><a class="teaser-link" href="/post">A post title</a></h3>
    <p>Clicking anywhere on the card follows the link.</p>
</article>
```

The link's `::after` covers the card, because the card is the nearest positioned ancestor. Keep other links and buttons out of the card, as the cover sits over them.

## Layout

| Placeholder                                                                                                  | Sets                                                                                          |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `%bf-wrap`                                                                                                   | A centred container whose width steps up at each breakpoint. Also output as the `.wrap` class |
| `%bf-position-{absolute, fixed, relative, static, sticky, inherit}`                                          | `position`                                                                                    |
| `%bf-top-{0, 50, 100, auto}`, `%bf-bottom-…`, `%bf-left-…`, `%bf-right-…`                                    | Offsets from the edge, as a percentage or `auto`                                              |
| `%bf-z-index-{3, 4, 5}`                                                                                      | `z-index`                                                                                     |
| `%bf-overflow-{auto, hidden, scroll, visible}`, `%bf-overflow-x-…`, `%bf-overflow-y-…`                       | `overflow`, or by axis                                                                        |
| `%bf-float-{start, end, none}`                                                                               | `float`, using the logical `inline-start` and `inline-end`                                    |
| `%bf-vertical-align-{baseline, top, middle, bottom, text-top, text-bottom}`                                  | `vertical-align`                                                                              |
| `%bf-object-fit-{contain, cover, fill, scale, none}`                                                         | How an image or video fills its box. `scale` is `scale-down`                                  |
| `%bf-aspect-ratio-{1x1, 4x3, 16x9, 21x9}`                                                                    | `aspect-ratio`. Add or change ratios with `$sassy-aspect-ratio`                               |
| `%bf-pointer-events-{auto, none}`, `%bf-user-select-{all, auto, none}`                                       | Whether an element takes clicks, and how its text is selected                                 |
| `%bf-height-{5-100}`, `%bf-viewheight-{5-100}`                                                               | Height as a percentage of the parent, or of the viewport                                      |
| `%bf-min-width-…`, `%bf-min-height-…`, `%bf-min-viewwidth-…`, `%bf-min-viewheight-…`                         | Minimum sizes, as a percentage or of the viewport                                             |
| `%bf-width-{5-100}`, `%bf-viewwidth-{5-100}`                                                                 | Width, as a percentage of the parent, or of the viewport                                      |
| `%bf-max-width-{5-100, none}`, `%bf-max-height-{5-100, none}`, `%bf-max-viewwidth-…`, `%bf-max-viewheight-…` | Maximum width and height                                                                      |
| `%bf-m-{centre}`, `%bf-mt-…`, `%bf-me-…`, `%bf-mb-…`, `%bf-ms-…`, `%bf-mx-…`, `%bf-my-…`                     | Margin, from `auto` or `0` to `20`. `t`, `e`, `b`, `s` are top, end, bottom and start         |
| `%bf-p-…`, `%bf-pt-…`, `%bf-pe-…`, `%bf-pb-…`, `%bf-ps-…`, `%bf-px-…`, `%bf-py-…`                            | Padding, from `inherit` or `0` to `20`                                                        |

Margin and padding steps are in multiples of `$sassy-margin-unit` and `$sassy-padding-unit`, so `%bf-p-4` is `4 × 0.25rem`, or `1rem`. Sides use `t`, `e`, `b` and `s`, but offsets, which name the edge, use `top`, `right`, `bottom` and `left`.

### Example: a centred page with sticky header

```sass
@use "sassy/src" as sassy

.page
    @extend %bf-wrap
    @extend %bf-py-4

.header
    @extend %bf-position-sticky
    @extend %bf-top-0
    @extend %bf-z-index-3
    @extend %bf-bg-grey-50
    @extend %bf-shadow-1
    @extend %bf-p-3
```

```html
<body>
    <header class="header">…</header>
    <main class="page">…</main>
</body>
```

The sticky header stays at the top of the viewport while the page scrolls. `z-index` keeps it above the content, and the shadow separates it from the page.

### Example: a 16:9 frame

```sass
.frame
    @extend %bf-aspect-ratio-16x9
    @extend %bf-width-100
    @extend %bf-object-fit-cover
```

```css
.frame {
  aspect-ratio: 16 / 9;
}
.frame {
  object-fit: cover;
}
```

```html
<img class="frame" src="photo.jpg" alt="…">
```

The image keeps a 16:9 shape at any width, and `cover` crops it to fill the frame rather than stretching it.

### Example: responsive spacing

```sass
.section
    @extend %bf-py-4
    @extend %bf-py-6-md
    @extend %bf-mx-auto
```

Vertical padding is 1rem on small screens and 1.5rem from `md`. `%bf-mx-auto` centres the section horizontally.

## Colour

| Placeholder                    | Sets                                                |
| ------------------------------ | --------------------------------------------------- |
| `%bf-c-{colour}-{shade}`       | Text colour, from the palette                       |
| `%bf-bg-{colour}-{shade}`      | Background colour                                   |
| `%bf-text-bg-{colour}-{shade}` | Background colour, with text that contrasts with it |
| `%bf-border-{colour}-{shade}`  | Border colour                                       |

`{colour}` is one of the 26 palette colours and `{shade}` is `50`, `100` to `900`, or `950`. See the [README](../README.md#naming) for the list, and the [theme](5-theme.md) for the colours with their own names.

`%bf-text-bg-…` picks the text colour when Sass compiles, using the WCAG contrast ratio: `$sassy-contrast-dark` (`grey-950`) or `$sassy-contrast-light` (white), whichever contrasts more with the background. `sassy.contrast-colour()` gives the same choice for any colour.

### Example: a coloured tag

```sass
.tag
    @extend %bf-text-bg-violet-700
    @extend %bf-rounded-pill
    @extend %bf-px-2
```

```css
.tag {
  background-color: oklch(49.1% 0.27 292.581deg);
  color: #fff;
}
```

### Example: a status badge

```sass
.badge
    @extend %bf-c-green-800
    @extend %bf-bg-green-100
    @extend %bf-rounded-pill
    @extend %bf-px-2
    @extend %bf-py-1
```

## Display

| Placeholder                                                             | Sets                                                                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `%bf-d-{block, inline, inline-block, flex, inline-flex, grid, none, …}` | `display`. Responsive                                               |
| `%bf-visually-hidden`                                                   | Hides content visually, but not from screen readers. Not responsive |
| `%bf-visually-hidden-focusable`                                         | As above, but visible when focused, for skip links                  |
| `%bf-opacity-{0-100}`                                                   | `opacity`, in steps of 10                                           |
| `%bf-flex-{column, column-reverse, row, row-reverse}`                   | `flex-direction`                                                    |
| `%bf-flex-wrap-{nowrap, wrap, wrap-reverse}`                            | `flex-wrap`                                                         |
| `%bf-flex-justify-{start, centre, end, between, around, evenly}`        | `justify-content`                                                   |
| `%bf-flex-align-items-{baseline, centre, end, start, stretch}`          | `align-items`                                                       |
| `%bf-flex-align-content-{…}`, `%bf-flex-align-self-{…}`                 | `align-content` and `align-self`, with the same values              |
| `%bf-flex-order-{first, 0-5, last}`                                     | `order`                                                             |
| `%bf-flex-grow-{0-20}`, `%bf-flex-shrink-{0-20}`                        | `flex-grow` and `flex-shrink`                                       |
| `%bf-flex-fill`                                                         | `flex: 1 1 auto`                                                    |
| `%bf-gap-{0-20}`, `%bf-gap-x-…`, `%bf-gap-y-…`                          | `gap` between flex or grid items                                    |

### Example: a navigation bar that changes at a breakpoint

```sass
.nav
    @extend %bf-d-flex
    @extend %bf-flex-column
    @extend %bf-gap-2
    @extend %bf-flex-row-md
    @extend %bf-flex-justify-between
    @extend %bf-flex-align-items-centre
    @extend %bf-gap-4-md
```

```html
<nav class="nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</nav>
```

The items stack in a column on small screens, and sit in a row, spread out, from `md` upwards.

### Example: showing a menu on large screens only

```sass
.menu-toggle
    @extend %bf-d-block
    @extend %bf-d-none-lg
```

`%bf-d-none-lg` hides the toggle from `lg` upwards, and the base `%bf-d-block` shows it below that.

### Example: a label for screen readers only

```sass
.skip-link
    @extend %bf-visually-hidden-focusable
```

```html
<a class="skip-link" href="#main">Skip to main content</a>
```

The link is hidden until a keyboard user focuses it, then appears so they can use it.

## Border

| Placeholder                                             | Sets                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| `%bf-border-{0-20}`, `%bf-border-x-…`, `%bf-border-y-…` | Border width, in multiples of `$sassy-border-width-unit` (1px) |
| `%bf-border-{top, right, bottom, left}-{0-20}`          | Border width on one side                                       |

Border sides are spelled out in full, unlike margin and padding.

## Corners

| Placeholder                              | Sets                                          |
| ---------------------------------------- | --------------------------------------------- |
| `%bf-rounded`                            | The default radius, `--sassy-radius`          |
| `%bf-rounded-{0-6}`                      | A radius in multiples of `$sassy-radius-unit` |
| `%bf-rounded-{top, end, bottom, start}`  | Rounds two corners on one side                |
| `%bf-rounded-circle`, `%bf-rounded-pill` | A circle, or a pill shape                     |

### Example: a card with corners and a border

```sass
.card
    @extend %bf-border-1
    @extend %bf-border-grey-200
    @extend %bf-rounded-3
    @extend %bf-p-4
```

## Shadow

| Placeholder        | Sets                                                         |
| ------------------ | ------------------------------------------------------------ |
| `%bf-shadow-{0-3}` | A box shadow, from none to large, in `--sassy-shadow-colour` |

There is one set of shadows. They take their colour from `--sassy-shadow-colour`, which is black at low opacity by default. Set it for a whole site, a section or one element to colour every shadow there, including with a theme colour:

```sass
:root
    --sassy-shadow-colour: #{sassy.colour("slate", 900)}

.offer
    @extend %bf-shadow-2
    --sassy-shadow-colour: var(--sassy-theme-primary)
```

### Example: a lifted panel

```sass
.panel
    @extend %bf-shadow-2
    @extend %bf-rounded
    @extend %bf-p-4
```

## Settings and custom properties

| Name                  | Default       | Description                                                |
| --------------------- | ------------- | ---------------------------------------------------------- |
| `$sassy-margin-unit`  | `0.25rem`     | Size of one margin step                                    |
| `$sassy-padding-unit` | `0.25rem`     | Size of one padding step                                   |
| `$sassy-gap-unit`     | `0.25rem`     | Size of one gap step                                       |
| `$sassy-radius-unit`  | `0.25rem`     | Size of one step for `%bf-rounded-{0-6}`                   |
| `$sassy-shadow-unit`  | `0.125rem`    | Size of one step for `%bf-shadow-{0-3}`                    |
| `$sassy-loop-max`     | `20`          | Highest spacing, border width and flex grow / shrink step  |
| `$sassy-breakpoints`  | `sm` to `3xl` | Breakpoints that every responsive utility is generated for |

The settings are set in [0-core](0-core.md#configuring-sassy). The utility values themselves are maps in each module's `-variables.scss` file, in `src/4-utilities`.

| Custom property                                                                                                                     | Used by                         |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `--sassy-font-family-mono`, `-sans`, `-serif`                                                                                       | Font families                   |
| `--sassy-font-size-base`, `--sassy-font-weight-base`, `--sassy-line-height-base`                                                    | Text defaults                   |
| `--sassy-body-colour`, `--sassy-body-font-family`, `--sassy-body-font-size`, `--sassy-body-font-weight`, `--sassy-body-line-height` | `%bf-body`                      |
| `--sassy-radius`                                                                                                                    | `%bf-rounded` and form controls |
| `--sassy-shadow-colour`                                                                                                             | `%bf-shadow-{0-3}`              |
