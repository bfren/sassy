# Colour

[4-utilities](README.md) - live examples: [4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

| Placeholder                    | Sets                                                |
| ------------------------------ | --------------------------------------------------- |
| `%bf-c-{colour}-{shade}`       | Text colour, from the palette                       |
| `%bf-bg-{colour}-{shade}`      | Background colour                                   |
| `%bf-text-bg-{colour}-{shade}` | Background colour, with text that contrasts with it |
| `%bf-border-{colour}-{shade}`  | Border colour                                       |

`{colour}` is one of the 26 palette colours and `{shade}` is `50`, `100` to `900`, or `950`. See the [README](../../README.md#naming) for the list, and the [theme](../5-theme/README.md) for the colours with their own names.

`%bf-text-bg-…` picks the text colour when Sass compiles, using the WCAG contrast ratio: `$sassy-contrast-dark` (`grey-950`) or `$sassy-contrast-light` (white), whichever contrasts more with the background. `sassy.contrast-colour()` gives the same choice for any colour.

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
