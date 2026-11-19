# Functions

[0-core](README.md) - live examples: [0-core.html](https://bfren.github.io/sassy/0-core.html)

These are available as `sassy.name()`.

| Function                      | Returns                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `colour($name, $shade)`       | A palette colour in `oklch()`, for example `colour("sky", 600)`. Unknown names or shades warn and return black             |
| `with-alpha($colour, $alpha)` | Any colour with transparency (`$alpha` from 0 to 1), as `color-mix()`                                                      |
| `chevron($colour)`            | An SVG select chevron as a `url()`, for `--sassy-select-chevron`. See [2-forms](../2-forms/230-select.md) |
| `decimal-floor($number)`      | `$number` rounded down to three decimal places                                                                             |

`colour()` takes a shade of `50`, `100` to `900`, or `950`. The full list of colours is in the [README](../../README.md#naming).

## Palette colours and transparency

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

`colour()` returns a value that Sass can mix, so `with-alpha()` can be used on any palette colour. The `oklch()` values are shown in full in the [colour variables](../../src/4-utilities/_420-colour-variables.scss).
