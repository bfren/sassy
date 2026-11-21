# 5-theme: theme colours and runtime theming

Live examples: [https://bfren.github.io/sassy/5-theme.html](https://bfren.github.io/sassy/5-theme.html)

`src/5-theme` provides a small set of named theme colours - `primary`, `secondary`, `ok`, `info`, `warn`, `error`, `grey-light` and `grey-dark` - for text, backgrounds and borders, and to colour shadows. Each one is a custom property on `:root`, so a theme can change them per site, per section or at runtime, and a dark set switches them with the colour roles that components use.

Theme colours are output last, so a theme utility such as `%bf-bg-primary` always wins over any composite or single-purpose utility that sets the same property.

## Pages

- [Theme colours and colour modes](500-theme.md)

## Placeholders

| Placeholder pattern  | Sets                                                                                    | Example             |
| -------------------- | --------------------------------------------------------------------------------------- | ------------------- |
| `%bf-c-{name}`       | Text colour                                                                             | `%bf-c-primary`     |
| `%bf-bg-{name}`      | Background colour                                                                       | `%bf-bg-error`      |
| `%bf-text-bg-{name}` | Background colour, with contrasting text                                                | `%bf-text-bg-error` |
| `%bf-border-{name}`  | Border colour                                                                           | `%bf-border-ok`     |
| `%bf-link-{name}`    | Link colour, with the hover colour following it, on a link or anything with links in it | `%bf-link-error`    |
| `%bf-theme-light`    | The light colour roles and theme colours                                                | -                   |
| `%bf-theme-dark`     | The dark colour roles and theme colours                                                 | -                   |
| `%bf-theme-auto`     | Dark when the system is set to dark                                                     | -                   |

`{name}` is one of the theme colours. The `%bf-theme-*` placeholders are described under [Light and dark](500-theme.md#light-and-dark). Each has breakpoint variants too, such as `%bf-c-primary-md`, for a theme that changes at a breakpoint, apart from `%bf-link-{name}`. The light theme colours, such as `warn` and `info`, are too pale for links or text on a light background.

## Default theme

| Name         | Default colour | Custom property            |
| ------------ | -------------- | -------------------------- |
| `primary`    | `sky-700`      | `--sassy-theme-primary`    |
| `secondary`  | `orange-700`   | `--sassy-theme-secondary`  |
| `ok`         | `green-700`    | `--sassy-theme-ok`         |
| `info`       | `sky-200`      | `--sassy-theme-info`       |
| `warn`       | `amber-400`    | `--sassy-theme-warn`       |
| `error`      | `red-600`      | `--sassy-theme-error`      |
| `grey-light` | `grey-300`     | `--sassy-theme-grey-light` |
| `grey-dark`  | `grey-600`     | `--sassy-theme-grey-dark`  |

The defaults come from the palette, so `sassy.colour()` gives you the same colours to use elsewhere. The [README](../../README.md#naming) shows them.

Each theme colour also has a `-contrast` property, such as `--sassy-theme-primary-contrast`, for the text on it. Its default is whichever of `grey-950` and white has the higher WCAG contrast ratio with the default colour. `primary` and `ok` use the 700 shades so they get white text, as white on the 600 shades is below the 4.5:1 that WCAG AA asks for.

## Settings and custom properties

| Property                                                                                              | Controls                |
| ----------------------------------------------------------------------------------------------------- | ----------------------- |
| `--sassy-theme-primary`, `-secondary`, `-ok`, `-info`, `-warn`, `-error`, `-grey-light`, `-grey-dark` | The eight theme colours |
| `--sassy-theme-{name}-contrast`                                                                       | Text on each one        |
| `--sassy-body-bg`, `--sassy-surface`, `-surface-subtle`, `-line`, `-line-strong`, `-muted`, `-disabled` | The colour roles        |

Theme colours are defined in [`src/5-theme/_500-theme-variables.scss`](../../src/5-theme/_500-theme-variables.scss). To add a theme colour, add an entry to the `$sassy-theme` map and to `$sassy-theme-light` and `$sassy-theme-dark` in the same file: its `--sassy-theme-*` and `--sassy-theme-*-contrast` custom properties are then output on `:root` and by the colour modes. The `%bf-c`, `%bf-bg`, `%bf-text-bg` and `%bf-border` placeholders are then generated for it.
