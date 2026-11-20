# 0-core: loading and configuring Sassy

Live examples: [https://bfren.github.io/sassy/0-core.html](https://bfren.github.io/sassy/0-core.html)

`src/0-core` is the foundation of Sassy. It holds the copyright notice, Normalize, the settings, the `make` mixins that generate placeholders, a few helper mixins and functions, and styles for content: quotes, figures, lists and large headings. Everything else depends on it.

## Pages

- [Mixins](040-make.md)
- [Functions](050-util.md)
- [Content](060-content.md)

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
| `$sassy-loop-max`                                              | `20`                     | Highest border width and flex grow / shrink step                              |
| `$sassy-spacing-max`                                           | `32`                     | Highest margin, padding, gap, offset and scroll padding step                  |
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

If you change the prefix, the placeholders in the [editor snippets](../../README.md#editor-snippets) change too: generate your own snippets from a full build made with your prefix.
