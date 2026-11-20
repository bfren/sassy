# Border

[4-utilities](README.md) - live examples: [4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

| Placeholder                                              | Sets                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| `%bf-border-{0-20}`, `%bf-border-x-…`, `%bf-border-y-…`  | Border width, in multiples of `$sassy-border-width-unit` (1px) |
| `%bf-border-{top, right, bottom, left}-{0-20}`           | Border width on one side                                       |
| `%bf-border-style-{solid, dashed, dotted, double, none}` | Border style. The widths set `solid`, and this wins over them  |

Border sides are spelled out in full, unlike margin and padding.
