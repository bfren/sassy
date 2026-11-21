# Checkboxes and radios

[2-forms](README.md) - live examples: [Checkboxes and radios](https://bfren.github.io/sassy/2-forms.html#checks)

Put the input first, then the label, and any help text after them, inside the element that extends `%bf-form-check`. Long labels wrap beside the input, and help text lines up under the label:

```sass
.check
    @extend %bf-form-check

    input
        @extend %bf-form-check-input

    label
        @extend %bf-form-check-label
```

```html
<div class="check">
    <input type="checkbox" id="news" />
    <label for="news">Send me the newsletter</label>
    <div class="field-text">About once a month.</div>
</div>
```

For checks that sit side by side, extend `%bf-form-check-inline` on the wrapper instead.
