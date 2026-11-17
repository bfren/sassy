# 0-core: loading and configuring Sassy

Live examples: [https://bfren.github.io/sassy/0-core.html](https://bfren.github.io/sassy/0-core.html)

`src/0-core` is the foundation of Sassy. It holds the copyright notice, Normalize, the settings, the `make` mixins that generate placeholders, a few helper mixins and functions, and styles for content: quotes, figures, lists and large headings. Everything else depends on it.

## Loading Sassy

Load Sassy once per site, in your main stylesheet:

```sass
@use "sassy/src" as sassy
```

Every stylesheet that loads Sassy outputs Normalize and the font and theme custom properties again, so use a single entry stylesheet per site. Every file that extends a placeholder needs its own `@use` as well: `@extend` only reaches placeholders from modules the file loads.

## Configuring Sassy

Pass settings with `with (...)`. Settings are optional, and each has a default:

```sass
@use "sassy/src" as sassy with (
    $sassy-breakpoints: (sm: 600px, md: 900px, lg: 1200px),
    $sassy-padding-unit: 0.5rem,
    $sassy-prefix: "app"
)
```

With the breakpoints above, the placeholders for `xl`, `2xl` and `3xl` no longer exist, so your own styles must use only the names you defined.

| Setting                                                        | Default                  | Description                                                                   |
| -------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| `$sassy-breakpoints`                                           | `sm` to `3xl`, see below | Names and minimum widths. Every responsive variant is generated from this map |
| `$sassy-margin-unit`, `$sassy-padding-unit`, `$sassy-gap-unit` | `0.25rem`                | Size of one spacing step                                                      |
| `$sassy-radius-unit`                                           | `0.25rem`                | Size of one step for `%bf-rounded-{0-6}`                                      |
| `$sassy-shadow-unit`                                           | `0.125rem`               | Size of one step for `%bf-shadow-{0-3}`                                       |
| `$sassy-loop-max`                                              | `20`                     | Highest spacing, border width and flex grow / shrink step                     |
| `$sassy-prefix`                                                | `"bf"`                   | Prefix for every placeholder and class. `""` for none                         |
| `$sassy-separator`                                             | `"-"`                    | Joins the prefix, utility, value and breakpoint                               |
| `$sassy-full`                                                  | `false`                  | Also output every utility as a class, as in `dist/full.css`                   |

The default breakpoints are:

| Breakpoint | Applies from |
| ---------- | ------------ |
| `sm`       | 576px        |
| `md`       | 768px        |
| `lg`       | 992px        |
| `xl`       | 1200px       |
| `2xl`      | 1400px       |
| `3xl`      | 1600px       |

### Why a prefix

The prefix keeps Sassy's placeholders apart from yours and from other libraries. Placeholders with the same name are merged, so an unprefixed `%p-2` of your own would pick up Sassy's rules too. The prefix costs nothing in your compiled CSS.

If you change the prefix, the placeholders in the [editor snippets](../README.md#editor-snippets) change too: generate your own snippets from a full build made with your prefix.

## Functions

These are available as `sassy.name()`.

| Function                      | Returns                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `colour($name, $shade)`       | A palette colour in `oklch()`, for example `colour("sky", 600)`. Unknown names or shades warn and return black             |
| `with-alpha($colour, $alpha)` | Any colour with transparency (`$alpha` from 0 to 1), as `color-mix()`                                                      |
| `chevron($colour)`            | An SVG select chevron as a `url()`, for `--sassy-select-chevron`. See [1-forms](1-forms.md#select-chevron-in-a-dark-theme) |
| `decimal-floor($number)`      | `$number` rounded down to three decimal places                                                                             |

`colour()` takes a shade of `50`, `100` to `900`, or `950`. The full list of colours is in the [README](../README.md#naming).

## Mixins

These are available as `sassy.name()` too.

| Mixin                           | Use                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `up($breakpoint)`               | A `@media` block from a breakpoint name, for your own styles                           |
| `up-prop($property-map...)`     | Property values by breakpoint, inside a rule                                           |
| `make-single($class)`           | A placeholder for the base definition only                                             |
| `make-responsive($class, $map)` | A placeholder for the base definition and each breakpoint                              |
| `make-passes()`                 | Wraps your own `make-*` calls so their output is ordered like Sassy's                  |
| `make-name($parts...)`          | A placeholder or class name built from the prefix and separator, for example `"mt", 0` |

## Content

Sassy is meant to style the whole site, so `0-core` sets a few defaults on elements, after Normalize:

| Element                | Default                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `h1` to `h6`           | Weight 500, line height 1.2, no top margin and `0.5rem` below, and sizes from `2.5rem` to `1rem` |
| `blockquote`, `figure` | No side margins, and `$sassy-content-margin` (`1rem`) below                                      |
| `img`, `svg`           | `vertical-align: middle`, so they line up with text beside them                                  |

They use `:where()`, so they have no specificity and any placeholder or class overrides them.

Heading sizes are set by `$sassy-heading`, and the large heading sizes by `$sassy-display-heading`. Any size larger than `$sassy-fluid-min` (`1.25rem`) shrinks on screens narrower than the `xl` breakpoint, down to `1.25rem` plus a tenth of the difference, so `h1` runs from `1.375rem` to `2.5rem`. From `xl` up each heading is its full size.

The rest are placeholders. They are output before forms and components, so a utility such as `%bf-font-size-4` overrides `%bf-display-1`:

| Placeholder              | Use it on                       | Does                                                                               |
| ------------------------ | ------------------------------- | ---------------------------------------------------------------------------------- |
| `%bf-h{1-6}`             | Any element                     | The same as `h1` to `h6`, for text that should look like a heading but is not one  |
| `%bf-lead`               | An introductory paragraph       | Larger, lighter text                                                               |
| `%bf-display-{1-6}`      | A large heading                 | From `5rem` to `2.5rem`, shrinking on small screens like the headings, and lighter |
| `%bf-initialism`         | An `abbr` said letter by letter | Upper case, a little smaller                                                       |
| `%bf-list-unstyled`      | A `ul` or `ol`                  | Removes the markers and indent                                                     |
| `%bf-list-inline`        | A `ul` or `ol`                  | Puts its `li` items in a row, with `--sassy-list-inline-gap` between them          |
| `%bf-img-fluid`          | An `img`                        | Shrinks to fit its container, keeping its shape                                    |
| `%bf-figure`             | A `figure`                      | Space under the image, and a smaller, grey `figcaption`                            |
| `%bf-blockquote`         | A `blockquote`                  | Larger text                                                                        |
| `%bf-blockquote-caption` | The `figcaption` after a quote  | Smaller, grey, starting with an em dash                                            |

`%bf-h{1-6}` and `%bf-display-{1-6}` have breakpoint variants, such as `%bf-display-4-md`.

## Worked examples

### A large heading

```sass
.hero-title
    @extend %bf-display-1
```

```css
.hero-title {
  font-size: min(5rem, 1.625rem + 4.5vw);
  font-weight: var(--sassy-display-heading-font-weight, 300);
  line-height: var(--sassy-display-heading-line-height, 1.2);
}
```

At 1200px, the `xl` breakpoint, `1.625rem + 4.5vw` reaches `5rem`, and `min()` keeps it there on wider screens. On a 375px phone it is about `2.68rem`.

### A quote with its source

```sass
.quote
    @extend %bf-blockquote

.quote-source
    @extend %bf-blockquote-caption
```

```css
.quote {
  font-size: var(--sassy-blockquote-font-size, calc(var(--sassy-font-size-base) * 1.25));
}
.quote-source {
  color: var(--sassy-blockquote-caption-colour, oklch(44.6% 0.03 256.802deg));
  font-size: var(--sassy-blockquote-caption-font-size, 0.875em);
  margin-block: -1rem 1rem;
}
.quote-source::before {
  content: "— ";
}
```

```html
<figure>
    <blockquote class="quote">
        <p>Simplicity is prerequisite for reliability.</p>
    </blockquote>
    <figcaption class="quote-source">Edsger W. Dijkstra</figcaption>
</figure>
```

The source goes in a `figcaption` outside the `blockquote`, because it is not part of the quote. Its negative top margin pulls it up under the quote, over the quote's bottom margin.

### Palette colours and transparency

```sass
@use "sassy/src" as sassy

.tooltip
    background-color: sassy.with-alpha(sassy.colour("grey", 900), 0.6)
    color: sassy.colour("grey", 50)
```

```css
.tooltip {
  background-color: color-mix(in oklab, oklch(21% 0.034 264.665deg) 60%, transparent);
  color: oklch(98.5% 0.002 247.839deg);
}
```

`colour()` returns a value that Sass can mix, so `with-alpha()` can be used on any palette colour. The `oklch()` values are shown in full in the [colour variables](../src/4-utilities/_420-colour-variables.scss).

### Your own breakpoint styles

Sass cannot `@extend` inside a media query, so for styles that belong to one rule, use `up()` directly:

```sass
.hero
    font-size: 1rem

    @include sassy.up(md)
        font-size: 1.5rem
```

```css
.hero {
  font-size: 1rem;
}
@media (width >= 768px) {
  .hero {
    font-size: 1.5rem;
  }
}
```

### Different values at different breakpoints

`up-prop()` sets a property at each breakpoint. Give it the property name, then a map of breakpoint values. A breakpoint missing from the map is left alone:

```sass
.sidebar
    background-color: sassy.colour("grey", 200)
    @include sassy.up-prop(width (sm: 50%, lg: 25%))
```

```css
.sidebar {
  background-color: oklch(92.8% 0.006 264.531deg);
}
@media (width >= 576px) {
  .sidebar {
    width: 50%;
  }
}
@media (width >= 992px) {
  .sidebar {
    width: 25%;
  }
}
```

### Your own placeholders, in Sassy's style

Use `make-passes()` around any `make-*` call so that your breakpoint variants are ordered after your base rules, as Sassy's own are:

```sass
@use "sassy/src" as sassy

@include sassy.make-passes
    @include sassy.make-responsive("stack", (1: 0.25rem, 2: 0.5rem)) using ($value)
        display: flex
        flex-direction: column
        gap: $value
```

This makes `%bf-stack-1`, `%bf-stack-2`, and a variant for each breakpoint, such as `%bf-stack-2-md`:

```sass
.menu
    @extend %bf-stack-1
    @extend %bf-stack-2-md
```

To build a name yourself - for example in a placeholder inside a loop, or a name that must follow the prefix - use `make-name()`:

```sass
.menu
    @extend %#{sassy.make-name("stack", 2)}
```

Without `make-passes()`, a breakpoint variant could be output before a base rule and lose to it. Use `make-single()` on its own when you do not need breakpoint variants.
