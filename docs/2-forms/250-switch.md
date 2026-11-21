# Switches

[2-forms](README.md) - live examples: [A switch](https://bfren.github.io/sassy/2-forms.html#switch)

Extend `%bf-form-switch` on a checkbox with `role="switch"`, so assistive technology announces it as a switch:

```sass
.toggle
    @extend %bf-form-switch
```

```html
<input type="checkbox" role="switch" id="notify" class="toggle" />
<label for="notify">Notifications</label>
```
