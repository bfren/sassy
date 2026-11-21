# Range, file and colour inputs

[2-forms](README.md) - live examples: [Range, file and colour inputs](https://bfren.github.io/sassy/2-forms.html#inputs)

```sass
.slider
    @extend %bf-form-range

.upload
    @extend %bf-form-file

.swatch
    @extend %bf-form-colour
```

Their colours come from `--sassy-range-*`, `--sassy-input-*` and `--sassy-theme-primary`. Each browser has its own pseudo-elements for these controls, which Sassy sets separately for each one.
