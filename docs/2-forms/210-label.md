# Labels and help text

[2-forms](README.md) - live examples: [2-forms.html](https://bfren.github.io/sassy/2-forms.html)

```sass
@use "sassy/src" as sassy

.field
    @extend %bf-mb-3

    label
        @extend %bf-form-label

    input
        @extend %bf-form-control

    .field-text
        @extend %bf-form-text
```

```html
<div class="field">
    <label for="name">Name</label>
    <input type="text" id="name" />
    <div class="field-text">Your full name, as it appears on your passport.</div>
</div>
```

```css
@layer sassy.base.forms {
  .field label {
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  .field input {
    display: block;
    width: 100%;
    /* …other control rules */
  }
}

@layer sassy.base.utilities {
  .field {
    margin-bottom: 0.75rem;
  }
}
```
