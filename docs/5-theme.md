# 5-theme: theme colours and runtime theming

Live examples: [https://bfren.github.io/sassy/5-theme.html](https://bfren.github.io/sassy/5-theme.html)

`src/5-theme` provides a small set of named theme colours - `primary`, `secondary`, `ok`, `info`, `warn`, `error`, `grey-light` and `grey-dark` - for text, backgrounds and borders, and to colour shadows. Each one is a custom property on `:root`, so a theme can change them per site, per section or at runtime, and a dark set switches them with the colour roles that components use.

Theme colours are output last, so a theme utility such as `%bf-bg-primary` always wins over any composite or single-purpose utility that sets the same property.

## Placeholders

| Placeholder pattern  | Sets                                     | Example             |
| -------------------- | ---------------------------------------- | ------------------- |
| `%bf-c-{name}`       | Text colour                              | `%bf-c-primary`     |
| `%bf-bg-{name}`      | Background colour                        | `%bf-bg-error`      |
| `%bf-text-bg-{name}` | Background colour, with contrasting text | `%bf-text-bg-error` |
| `%bf-border-{name}`  | Border colour                            | `%bf-border-ok`     |
| `%bf-theme-light`    | The light colour roles and theme colours | -                   |
| `%bf-theme-dark`     | The dark colour roles and theme colours  | -                   |
| `%bf-theme-auto`     | Dark when the system is set to dark      | -                   |

`{name}` is one of the theme colours. The `%bf-theme-*` placeholders are described under [Light and dark](#light-and-dark). Each has breakpoint variants too, such as `%bf-c-primary-md`, for a theme that changes at a breakpoint.

## Default theme

| Name         | Default colour | Custom property            |
| ------------ | -------------- | -------------------------- |
| `primary`    | `sky-600`      | `--sassy-theme-primary`    |
| `secondary`  | `orange-700`   | `--sassy-theme-secondary`  |
| `ok`         | `green-600`    | `--sassy-theme-ok`         |
| `info`       | `sky-200`      | `--sassy-theme-info`       |
| `warn`       | `amber-400`    | `--sassy-theme-warn`       |
| `error`      | `red-600`      | `--sassy-theme-error`      |
| `grey-light` | `grey-300`     | `--sassy-theme-grey-light` |
| `grey-dark`  | `grey-600`     | `--sassy-theme-grey-dark`  |

The defaults come from the palette, so `sassy.colour()` gives you the same colours to use elsewhere. The [README](../README.md#naming) shows them.

Each theme colour also has a `-contrast` property, such as `--sassy-theme-primary-contrast`, for the text on it. Its default is whichever of `grey-950` and white has the higher WCAG contrast ratio with the default colour. `primary` (`sky-600`) gets dark text, as white text on it is below the 4.5:1 that WCAG AA asks for.

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
@layer sassy.base.utilities {
  .alert-error {
    padding: 0.75rem;
  }
  .alert-error {
    color: oklch(98.5% 0.002 247.839deg);
  }
  .alert-error {
    border-radius: 0.25rem;
  }
}

@layer sassy.base.theme {
  .alert-error {
    background-color: var(--sassy-theme-error);
  }
}
```

Each placeholder is its own rule, output in Sassy's order: spacing, palette colours, corners, and theme colours last. That order is what lets a theme colour win over a palette colour that sets the same property.

For text and a border, extend `%bf-c-primary` and `%bf-border-primary`. For a shadow in a theme colour, extend a shadow and set its colour:

```sass
.card
    @extend %bf-shadow-2
    --sassy-shadow-colour: var(--sassy-theme-primary)
```

Shadows have one colour, `--sassy-shadow-colour`, so this works with any colour, and setting it on a section colours every shadow inside it.

### Text that contrasts with a theme colour

```sass
.alert-warn
    @extend %bf-text-bg-warn
    @extend %bf-rounded-2
    @extend %bf-p-3
```

```css
@layer sassy.base.theme {
  .alert-warn {
    background-color: var(--sassy-theme-warn);
    color: var(--sassy-theme-warn-contrast);
  }
}
```

The text colour comes from `--sassy-theme-warn-contrast`, so it changes with the theme rather than being fixed in the rule.

### Theming a whole site

Set the theme once on `:root` in your main stylesheet. Use `sassy.colour()` for a palette colour, or write any CSS colour directly:

```sass
@use "sassy/src" as sassy

:root
    --sassy-theme-primary: #{sassy.colour("teal", 600)}
    --sassy-theme-secondary: #0d9488
```

When you change a theme colour, set its `-contrast` property too if `%bf-text-bg-{name}` is used. `sassy.contrast-colour()` works it out for a Sass colour:

```sass
:root
    --sassy-theme-primary: #{sassy.colour("teal", 600)}
    --sassy-theme-primary-contrast: #{sassy.contrast-colour(sassy.colour("teal", 600))}
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

### Light and dark

Components and forms take their neutral colours from a few **colour roles** on `:root`, so one set of values changes them all:

| Role                     | Used for                                                      | Light      | Dark       |
| ------------------------ | ------------------------------------------------------------- | ---------- | ---------- |
| `--sassy-body-bg`        | The page                                                      | white      | `grey-950` |
| `--sassy-body-colour`    | Text                                                          | `grey-800` | `grey-200` |
| `--sassy-surface`        | Cards, dialogs, menus, buttons and form controls              | white      | `grey-900` |
| `--sassy-surface-subtle` | Card caps, alerts, hovered nav links, disabled and add-ons    | `grey-100` | `grey-800` |
| `--sassy-line`           | Borders and dividers                                          | `grey-200` | `grey-700` |
| `--sassy-line-strong`    | The edges of form controls, buttons and pagination            | `grey-300` | `grey-500` |
| `--sassy-muted`          | Help text, captions, placeholders and menu headers            | `grey-600` | `grey-400` |
| `--sassy-disabled`       | Text of items that can't be used                              | `grey-400` | `grey-500` |

Extend `%bf-theme-dark` to switch an element and everything in it to the dark roles, and `%bf-theme-light` to switch back. Each also sets the element's background, text colour and `color-scheme`, so scrollbars and the browser's own controls match. Extend `%bf-theme-auto` to follow the visitor's system setting:

```sass
html
    @extend %bf-theme-auto

.dark-panel
    @extend %bf-theme-dark
```

```css
@layer sassy.base.theme {
  html {
    background-color: var(--sassy-body-bg);
    color-scheme: light dark;
  }
  .dark-panel {
    --sassy-surface: oklch(21% 0.034 264.665deg);
    color-scheme: dark;
  }
}
```

- **The dark set lifts four theme colours** that are used as text - `primary` to `sky-400`, `secondary` to `orange-400`, `ok` to `green-400` and `error` to `red-400` - and works out each `-contrast` again, so links, buttons and checked boxes stay readable on a dark page. Button text and the check mark follow the `-contrast` colours in dark areas.
- **For a toggle**, extend `%bf-theme-light` and `%bf-theme-dark` on `html` with an attribute, such as `html[data-theme="dark"]`, and `%bf-theme-auto` on `html` for visitors who haven't chosen.
- **Change the sets** with `$sassy-roles-light`, `$sassy-roles-dark`, `$sassy-theme-light` and `$sassy-theme-dark` in [`src/5-theme/_500-theme-variables.scss`](../src/5-theme/_500-theme-variables.scss), configured with `with (...)`. Any one property can still be set on its own, as before.
- **The select chevron** is an image, so each mode sets `--sassy-select-chevron` for its text colour - see [2-forms](2-forms.md#select-chevron-in-a-dark-theme).

### Changing a theme colour at runtime

Because the theme is in custom properties, a script can change it without a new stylesheet:

```html
<script>
    document.documentElement.style.setProperty("--sassy-theme-primary", "#0d9488");
</script>
```

## Settings and custom properties

| Property                                                                                              | Controls                |
| ----------------------------------------------------------------------------------------------------- | ----------------------- |
| `--sassy-theme-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark` | The eight theme colours |
| `--sassy-theme-{name}-contrast`                                                                       | Text on each one        |
| `--sassy-body-bg`, `--sassy-surface`, `-surface-subtle`, `-line`, `-line-strong`, `-muted`, `-disabled` | The colour roles        |

Theme colours are defined in [`src/5-theme/_500-theme-variables.scss`](../src/5-theme/_500-theme-variables.scss). To add a theme colour, add an entry to the `$sassy-theme` map and to `$sassy-theme-light` and `$sassy-theme-dark` in the same file: its `--sassy-theme-*` and `--sassy-theme-*-contrast` custom properties are then output on `:root` and by the colour modes. The `%bf-c`, `%bf-bg`, `%bf-text-bg` and `%bf-border` placeholders are then generated for it.
