# Alerts

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

An alert is a message box. A theme colour tints its background, border and text, and links inside it take the alert's text colour, in bold:

```sass
.alert
    @extend %bf-alert

.alert-ok
    @extend %bf-alert-ok

.alert-dismissible
    @extend %bf-alert-dismissible

.close
    @extend %bf-close
```

```css
@layer sassy.base.components {
  .alert {
    background-color: var(--sassy-alert-bg, var(--sassy-surface-subtle));
    border: var(--sassy-alert-border-width, 1px) solid var(--sassy-alert-border-colour, var(--sassy-line));
    color: var(--sassy-alert-colour, currentColor);
    padding: var(--sassy-alert-padding-y, 1rem) var(--sassy-alert-padding-x, 1rem);
  }
  .alert a {
    color: inherit;
    font-weight: 700;
  }
  .alert-ok {
    --sassy-alert-bg: color-mix(in oklab, var(--sassy-theme-ok) 15%, transparent);
    --sassy-alert-colour: color-mix(in oklab, var(--sassy-theme-ok) 40%, currentColor);
  }
  .alert-dismissible > [command="--dismiss"] {
    position: absolute;
  }
}
```

```html
<div class="alert alert-ok alert-dismissible" id="saved" role="status">
    <p>Your changes are saved. <a href="/history">See the history</a>.</p>
    <button type="button" class="close" commandfor="saved" command="--dismiss" aria-label="Close"></button>
</div>
```

- **Choose the role by how urgent the message is.** `role="alert"` makes screen readers announce it at once, interrupting the user, so keep it for errors and warnings that need action. Use `role="status"` for a quieter update, such as a saved form, or no role for a message that is part of the page when it loads.
- **Alert text is the theme colour mixed with the text around it**, so it stays readable on the light theme colours, and follows a dark theme. Change how much colour is mixed in with `$sassy-alert-tint`, `$sassy-alert-border-tint` and `$sassy-alert-text-tint`.
- **To dismiss an alert**, put a [close button](112-close.md) in it with `commandfor` set to the alert's `id` and `command="--dismiss"`, and load `sassy.js`, which hides the alert. Extend `%bf-alert-dismissible` too, which makes room for the button in the top corner. The close button can come anywhere in the alert.
- **A dismissed alert is hidden with the `hidden` attribute**, so don't give it a `display` placeholder, which would override `hidden`.

## Settings and custom properties

| Property                                                                                                                        | Controls                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `--sassy-alert-bg`, `--sassy-alert-colour`, `--sassy-alert-border-width`, `--sassy-alert-border-colour`, `--sassy-alert-radius` | Alert background, text, border and corners - the theme colours set the colours |
| `--sassy-alert-padding-y`, `--sassy-alert-padding-x`, `--sassy-alert-margin-bottom`                                             | Alert spacing                                                                  |
