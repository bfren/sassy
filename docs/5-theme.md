# 5-theme: theme colours and runtime theming

`src/5-theme` provides a small set of named theme colours - `primary`, `secondary`, `ok`, `info`, `warn`, `error`, `grey-light` and `grey-dark` - for text, backgrounds, borders and shadows. Each one is a custom property on `:root`, so a theme can change them per site, per section or at runtime.

Theme colours are output last, so a theme utility such as `%bf-bg-primary` always wins over any composite or single-purpose utility that sets the same property.

## Placeholders

| Placeholder pattern                                    | Sets                                             | Example                    |
| ------------------------------------------------------ | ------------------------------------------------ | -------------------------- |
| `%bf-c-{name}`                                          | Text colour                                       | `%bf-c-primary`            |
| `%bf-bg-{name}`                                         | Background colour                                 | `%bf-bg-error`             |
| `%bf-border-{name}`                                     | Border colour                                     | `%bf-border-ok`            |
| `%bf-shadow-{name}-{0-3}`                               | Box shadow in the theme colour, at a size         | `%bf-shadow-primary-2`     |

`{name}` is one of the theme colours. Each has breakpoint variants too, such as `%bf-c-primary-md`, for a theme that changes at a breakpoint.

## Default theme

| Name          | Default colour   | Custom property            |
| ------------- | ---------------- | -------------------------- |
| `primary`     | `sky-600`        | `--sassy-theme-primary`    |
| `secondary`   | `orange-700`     | `--sassy-theme-secondary`  |
| `ok`          | `green-600`      | `--sassy-theme-ok`         |
| `info`        | `sky-200`        | `--sassy-theme-info`       |
| `warn`        | `amber-400`      | `--sassy-theme-warn`       |
| `error`       | `red-600`        | `--sassy-theme-error`      |
| `grey-light`  | `grey-300`       | `--sassy-theme-grey-light` |
| `grey-dark`   | `grey-600`       | `--sassy-theme-grey-dark`  |

The defaults come from the palette, so `sassy.colour()` gives you the same colours to use elsewhere. The [README](../README.md#naming) shows them.

## Worked examples

### Using theme colours

```sass
@use "sassy/src" as sassy

.alert-error
    @extend %bf-bg-error
    @extend %bf-c-grey-50
    @extend %bf-rounded-2
    @extend %bf-p-3
```

```html
<div class="alert-error">Something went wrong. Please try again.</div>
```

```css
.alert-error {
  background-color: var(--sassy-theme-error);
  color: oklch(…);
  border-radius: 0.5rem;
  padding: 0.75rem;
}
```

For text and a border, extend `%bf-c-primary` and `%bf-border-primary`. For a card that lifts from the page, extend `%bf-shadow-primary-1`.

### Theming a whole site

Set the theme once on `:root` in your main stylesheet. Use `sassy.colour()` for a palette colour, or write any CSS colour directly:

```sass
@use "sassy/src" as sassy

:root
    --sassy-theme-primary: #{sassy.colour("teal", 600)}
    --sassy-theme-secondary: #0d9488
```

Theme colours accept any CSS colour: hex, `rgb()`, `oklch()`, a named colour or another custom property. Sassy adds transparency where it needs it with `color-mix()`, so you do not need separate values for shadows.

### A section with its own theme

A custom property set on a section applies to everything inside it. Buttons, form controls and utilities in the section all pick up the new colour:

```sass
.promo
    --sassy-theme-primary: #{sassy.colour("orange", 600)}
    --sassy-theme-secondary: #{sassy.colour("sky", 700)}
```

```html
<section class="promo">
    <p class="promo-text">Spring offer</p>
</section>
```

```sass
.promo-text
    @extend %bf-c-primary
```

### Dark mode

Change the theme in a media query, or in a `data-theme` selector if your site has a toggle. Lighter shades keep contrast on dark backgrounds:

```sass
@use "sassy/src" as sassy

:root
    --sassy-theme-primary: #{sassy.colour("sky", 600)}

@media (prefers-color-scheme: dark)
    :root:not([data-theme="light"])
        --sassy-theme-primary: #{sassy.colour("sky", 400)}
        --sassy-body-colour: #{sassy.colour("grey", 100)}
        --sassy-input-bg: #{sassy.colour("grey", 800)}
        --sassy-input-colour: #{sassy.colour("grey", 100)}
        --sassy-input-border-colour: #{sassy.colour("grey", 600)}
        --sassy-select-chevron: #{sassy.chevron(sassy.colour("grey", 100))}

:root[data-theme="dark"]
    --sassy-theme-primary: #{sassy.colour("sky", 400)}
```

The `data-theme="light"` check stops the media query from overriding a light theme a visitor has chosen. The select chevron has to be set with `chevron()`, as it is an image - see [1-forms](1-forms.md#select-chevron-in-a-dark-theme).

### Changing a theme colour at runtime

Because the theme is in custom properties, a script can change it without a new stylesheet:

```html
<script>
    document.documentElement.style.setProperty("--sassy-theme-primary", "#0d9488");
</script>
```

## Settings and custom properties

| Property                                                                 | Controls                                             |
| ------------------------------------------------------------------------ | ---------------------------------------------------- |
| `--sassy-theme-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark` | The eight theme colours |

Theme colours are defined in [`src/5-theme/_500-theme-variables.scss`](../src/5-theme/_500-theme-variables.scss). To add a theme colour, add an entry to the `$sassy-theme` map and a matching `--sassy-theme-*` custom property in `:root` in the same file. The `%bf-c`, `%bf-bg`, `%bf-border` and `%bf-shadow` placeholders are then generated for it.
