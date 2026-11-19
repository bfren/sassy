# Validation

[2-forms](README.md) - live examples: [2-forms.html](https://bfren.github.io/sassy/2-forms.html)

There are three ways to show that a control is invalid:

1. **The browser's own check.** `:user-invalid` applies once someone has interacted with the field. Nothing to add in markup beyond `required`, `type` and so on.
2. **The server's result.** Set `aria-invalid="true"` on the control. Screen readers announce it too, so use this for errors found on the server.
3. **An explicit state.** Extend `%bf-form-control-invalid` or `%bf-form-control-valid`, for example from a script that knows the result.

Feedback follows the control as a sibling. Invalid feedback is hidden until the control before it is invalid, so you can render it up front. Valid feedback always shows, so render it only when the field is valid:

```sass
.field
    input
        @extend %bf-form-control

    .error
        @extend %bf-form-feedback-invalid

    .ok
        @extend %bf-form-feedback-valid
```

```html
<div class="field">
    <input type="email" id="email" required aria-invalid="true" />
    <div class="error">Please enter a valid email address.</div>
</div>
```

The same placeholder works after an input group, because the feedback looks for an invalid control inside the element before it.
