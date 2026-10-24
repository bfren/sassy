# 0-core: loading and configuring Sassy

`src/0-core` is the foundation of Sassy. It holds the copyright notice, Normalize, the settings, the `make` mixins that generate placeholders, and a few helper mixins and functions. Nothing in it outputs utilities directly, but everything else depends on it.

## Loading Sassy

Load Sassy once per site, in your main stylesheet:

```sass
@use "sassy/src" as sassy
```

Every stylesheet that loads Sassy outputs Normalize and the `:root` custom properties again, so use a single entry stylesheet per site. Every file that extends a placeholder needs its own `@use` as well: `@extend` only reaches placeholders from modules the file loads.

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

| Setting                                                        | Default                 | Description                                                                              |
| -------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `$sassy-breakpoints`                                           | `sm` to `3xl`, see below | Names and minimum widths. Every responsive variant is generated from this map            |
| `$sassy-margin-unit`, `$sassy-padding-unit`, `$sassy-gap-unit` | `0.25rem`               | Size of one spacing step                                                                  |
| `$sassy-radius-unit`                                           | `0.25rem`               | Size of one step for `%bf-rounded-{0-6}`                                                  |
| `$sassy-shadow-unit`                                           | `0.125rem`              | Size of one step for `%bf-shadow-{0-3}`                                                   |
| `$sassy-loop-max`                                              | `20`                    | Highest spacing, border width and flex grow / shrink step                                 |
| `$sassy-prefix`                                                | `"bf"`                  | Prefix for every placeholder and class. `""` for none                                      |
| `$sassy-separator`                                             | `"-"`                   | Joins the prefix, utility, value and breakpoint                                           |
| `$sassy-full`                                                  | `false`                 | Also output every utility as a class, as in `dist/full.css`                               |

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

| Function                            | Returns                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `colour($name, $shade)`             | A palette colour in `oklch()`, for example `colour("sky", 600)`. Unknown names or shades warn and return black |
| `with-alpha($colour, $alpha)`       | Any colour with transparency (`$alpha` from 0 to 1), as `color-mix()`                                   |
| `chevron($colour)`                  | An SVG select chevron as a `url()`, for `--sassy-select-chevron`. See [1-forms](1-forms.md#select-chevron-in-a-dark-theme) |
| `decimal-floor($number)`            | `$number` rounded down to three decimal places                                                          |

`colour()` takes a shade of `50`, `100` to `900`, or `950`. The full list of colours is in the [README](../README.md#naming).

## Mixins

These are available as `sassy.name()` too.

| Mixin                              | Use                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `up($breakpoint)`                  | A `@media` block from a breakpoint name, for your own styles                               |
| `up-prop($property-map...)`        | Property values by breakpoint, inside a rule                                               |
| `make-single($class)`              | A placeholder for the base definition only                                                 |
| `make-responsive($class, $map)`    | A placeholder for the base definition and each breakpoint                                  |
| `make-passes()`                    | Wraps your own `make-*` calls so their output is ordered like Sassy's                      |
| `make-name($parts...)`             | A placeholder or class name built from the prefix and separator, for example `"mt", 0`      |

## Worked examples

### Palette colours and transparency

```sass
@use "sassy/src" as sassy

.tooltip
    background-color: sassy.with-alpha(sassy.colour("grey", 900), 0.9)
    color: sassy.colour("grey", 50)
```

```css
.tooltip {
  background-color: color-mix(in oklab, oklch(…) 90%, transparent);
  color: oklch(…);
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
@media (min-width: 768px) {
  .hero {
    font-size: 1.5rem;
  }
}
```

### Different values at different breakpoints

`up-prop()` sets a property at each breakpoint in one map. A breakpoint missing from the map is left alone:

```sass
.sidebar
    @include sassy.up-prop((width: (sm: 50%, lg: 25%)))
```

```css
@media (min-width: 576px) {
  .sidebar {
    width: 50%;
  }
}
@media (min-width: 992px) {
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
