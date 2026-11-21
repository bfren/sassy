# Colour

[4-utilities](README.md) - live examples: [4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

| Placeholder                      | Sets                                                            |
| -------------------------------- | --------------------------------------------------------------- |
| `%bf-c-{colour}-{shade}`         | Text colour, from the palette                                   |
| `%bf-text-opacity-{0pc-100pc}`   | Makes a `%bf-c-…` see-through, in steps of 10                   |
| `%bf-bg-{colour}-{shade}`        | Background colour                                               |
| `%bf-bg-opacity-{0pc-100pc}`     | Makes a `%bf-bg-…` see-through, in steps of 10                  |
| `%bf-bg-gradient`                | A light sheen over the background colour, `--sassy-bg-gradient` |
| `%bf-text-bg-{colour}-{shade}`   | Background colour, with text that contrasts with it             |
| `%bf-border-{colour}-{shade}`    | Border colour                                                   |
| `%bf-border-opacity-{0pc-100pc}` | Makes a `%bf-border-{colour}-…` see-through, in steps of 10     |

`{colour}` is one of the 26 palette colours and `{shade}` is `50`, `100` to `900`, or `950`. See the [README](../../README.md#naming) for the list, and the [theme](../5-theme/README.md) for the colours with their own names.

`%bf-text-bg-…` picks the text colour when Sass compiles, using the WCAG contrast ratio: `$sassy-contrast-dark` (`grey-950`) or `$sassy-contrast-light` (white), whichever contrasts more with the background. `sassy.contrast-colour()` gives the same choice for any colour.

`%bf-bg-opacity-…` sets `--sassy-bg-opacity`, which the palette and theme backgrounds mix with transparent. It isn't inherited, so a background inside a see-through one is solid. It doesn't change `%bf-text-bg-…`, whose text colour is chosen for the solid background.

`%bf-text-opacity-…` and `%bf-border-opacity-…` do the same for text and border colours, with `--sassy-text-opacity` and `--sassy-border-opacity`, for the palette and the theme. They aren't inherited either, so extend one on the element that has the colour.

## Example: a frosted header

```sass
.header
    @extend %bf-position-sticky
    @extend %bf-top-0
    @extend %bf-bg-grey-50
    @extend %bf-bg-opacity-80pc
    @extend %bf-backdrop-blur-2
```

```css
@layer sassy.base.utilities {
  .header {
    --sassy-bg-opacity: 80%;
  }
  .header {
    backdrop-filter: blur(0.5rem);
  }
}
```

What scrolls under the header shows through, blurred.

## Example: a coloured tag

```sass
.tag
    @extend %bf-text-bg-violet-700
    @extend %bf-rounded-pill
    @extend %bf-px-2
```

```css
@layer sassy.base.utilities {
  .tag {
    background-color: oklch(49.1% 0.27 292.581deg);
    color: #fff;
  }
}
```

## Example: a status badge

```sass
.badge
    @extend %bf-c-green-800
    @extend %bf-bg-green-100
    @extend %bf-rounded-pill
    @extend %bf-px-2
    @extend %bf-py-1
```
