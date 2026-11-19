# Switches

[2-forms](README.md) - live examples: [2-forms.html](https://bfren.github.io/sassy/2-forms.html)

Extend `%bf-form-switch` on a checkbox with `role="switch"`, so assistive technology announces it as a switch:

```sass
.toggle
    @extend %bf-form-switch
```

```html
<input type="checkbox" role="switch" id="notify" class="toggle" />
<label for="notify">Notifications</label>
```
