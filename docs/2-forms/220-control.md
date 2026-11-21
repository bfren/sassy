# Text inputs

[2-forms](README.md) - live examples: [A labelled text field with help text](https://bfren.github.io/sassy/2-forms.html#field), [Small and large controls](https://bfren.github.io/sassy/2-forms.html#sizes)

Extend the size placeholder as well as the base placeholder, on any control:

```sass
.compact
    input
        @extend %bf-form-control
        @extend %bf-form-control-small

    select
        @extend %bf-form-select
        @extend %bf-form-select-small
```
