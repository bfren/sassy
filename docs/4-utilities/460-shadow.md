# Shadow

[4-utilities](README.md) - live examples: [Colour, borders and corners](https://bfren.github.io/sassy/4-utilities.html#colour), [Coloured shadows](https://bfren.github.io/sassy/4-utilities.html#shadows)

| Placeholder        | Sets                                                         |
| ------------------ | ------------------------------------------------------------ |
| `%bf-shadow-{0-3}` | A box shadow, from none to large, in `--sassy-shadow-colour` |

There is one set of shadows. They take their colour from `--sassy-shadow-colour`, which is black at low opacity by default. Set it for a whole site, a section or one element to colour every shadow there, including with a theme colour:

```sass
:root
    --sassy-shadow-colour: #{sassy.colour("slate", 900)}

.offer
    @extend %bf-shadow-2
    --sassy-shadow-colour: var(--sassy-theme-primary)
```

## Example: a lifted panel

```sass
.panel
    @extend %bf-shadow-2
    @extend %bf-rounded
    @extend %bf-p-4
```
