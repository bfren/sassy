# Floating labels

[2-forms](README.md) - live examples: [2-forms.html](https://bfren.github.io/sassy/2-forms.html)

The control comes first and the label after it, and the control needs `placeholder=" "`. An empty placeholder is how CSS tells that the control has no value:

```sass
.floating
    @extend %bf-form-floating

    input
        @extend %bf-form-control
```

```html
<div class="floating">
    <input type="email" id="email" placeholder=" " />
    <label for="email">Email address</label>
</div>
```
