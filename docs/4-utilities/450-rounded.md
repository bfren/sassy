# Corners

[4-utilities](README.md) - live examples: [4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

| Placeholder                              | Sets                                          |
| ---------------------------------------- | --------------------------------------------- |
| `%bf-rounded`                            | The default radius, `--sassy-radius`          |
| `%bf-rounded-{0-6}`                      | A radius in multiples of `$sassy-radius-unit` |
| `%bf-rounded-{top, end, bottom, start}`  | Rounds two corners on one side                |
| `%bf-rounded-circle`, `%bf-rounded-pill` | A circle, or a pill shape                     |

## Example: a card with corners and a border

```sass
.card
    @extend %bf-border-1
    @extend %bf-border-grey-200
    @extend %bf-rounded-3
    @extend %bf-p-4
```
