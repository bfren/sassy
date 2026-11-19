# Close buttons

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

A close button is an empty `<button>`. The × is drawn in the text colour, so it shows on any background without a light or dark version:

```sass
.close
    @extend %bf-close
```

```css
@layer sassy.base.components {
  .close {
    background: none;
    border: 0;
    box-sizing: content-box;
    color: inherit;
    height: var(--sassy-close-size, 1em);
    opacity: var(--sassy-close-opacity, 0.5);
    padding: 0.25em;
    width: var(--sassy-close-size, 1em);
  }
  .close::before {
    background-color: currentColor;
    content: "";
    display: block;
    height: 100%;
  }
  .close:hover {
    opacity: var(--sassy-close-hover-opacity, 0.75);
  }
}
```

```html
<button type="button" class="close" aria-label="Close"></button>
```

- **Give it `aria-label="Close"`**, or a label that says what it closes, as the button has no text.
- **It is `1em` square**, so it follows the text size around it. Set `--sassy-close-size` to change it.
- **It fades until the pointer is over it**, and shows in full with the focus outline when it has keyboard focus. Disable it with `disabled`, or `aria-disabled="true"`.
- **A close button does nothing by itself.** Give it `command="close"` and `commandfor` to close a [dialog](153-dialog.md), or `command="--dismiss"` to dismiss an [alert](140-alert.md).

## Settings and custom properties

| Property                                                                     | Controls                                                               |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `--sassy-close-size`, `--sassy-close-opacity`, `--sassy-close-hover-opacity` | Close button size, and how faint it is, normally and under the pointer |
