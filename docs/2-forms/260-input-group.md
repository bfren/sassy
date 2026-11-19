# Input groups

[2-forms](README.md) - live examples: [2-forms.html](https://bfren.github.io/sassy/2-forms.html)

The group holds the controls and add-ons directly. Put feedback after the group, not inside it, so it shows when any control in the group is invalid:

```sass
.search
    @extend %bf-input-group

    input
        @extend %bf-form-control

    span
        @extend %bf-input-group-text
```

```sass
.search-feedback
    @extend %bf-form-feedback-invalid
```

```html
<div class="search">
    <span>£</span>
    <input type="number" id="amount" required aria-invalid="true" />
    <button type="button">Add</button>
</div>
<div class="search-feedback">Enter an amount in pounds.</div>
```
