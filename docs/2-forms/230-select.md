# Selects

[2-forms](README.md) - live examples: [2-forms.html](https://bfren.github.io/sassy/2-forms.html)

Selects draw their chevron as an SVG image, which cannot read custom properties. `%bf-theme-light`, `-dark` and `-auto` set it for their text colour. If you change `--sassy-input-colour` yourself, set `--sassy-select-chevron` to match with `chevron()`, which takes a Sass colour, not `var()`:

```sass
@use "sassy/src" as sassy

@media (prefers-color-scheme: dark)
    :root
        --sassy-input-colour: #{sassy.colour("grey", 100)}
        --sassy-select-chevron: #{sassy.chevron(sassy.colour("grey", 100))}
```
