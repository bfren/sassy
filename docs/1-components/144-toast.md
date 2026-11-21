# Toasts

[1-components](README.md) - live examples: [Toasts](https://bfren.github.io/sassy/1-components.html#toasts)

A toast is a short message that appears over the page, such as "Saved" or "Link copied". Toasts sit in a `%bf-toast-container`, which is fixed to the bottom end corner of the window and stacks them:

```sass
.toast-container
    @extend %bf-toast-container

.toast
    @extend %bf-toast

.toast-autohide
    @extend %bf-toast-autohide
```

```css
@layer sassy.base.components {
  .toast-container {
    align-items: var(--sassy-toast-container-inline, flex-end);
    justify-content: var(--sassy-toast-container-block, flex-end);
    pointer-events: none;
    position: fixed;
  }
  .toast-autohide {
    animation: bf-toast-hide var(--sassy-toast-fade, 0.5s) ease-in var(--sassy-toast-delay, 5s) forwards;
  }
}
```

```html
<div class="toast-container" aria-live="polite">
    <div class="toast toast-autohide" id="saved">
        <header>
            <strong>Saved</strong>
            <small>just now</small>
            <button type="button" class="close" commandfor="saved" command="--dismiss" aria-label="Close"></button>
        </header>
        <p>Your changes are saved to this device.</p>
    </div>
</div>
```

- **Put the container in the page, empty, with `aria-live="polite"`**, and add toasts to it from your script: screen readers then read each toast as it arrives. For an urgent message, give the toast `role="alert"` instead.
- **A `<header>` the toast starts with is its title row.** Its first child takes the room, so anything after it, such as a time or a close button, sits at the end. A toast without a header is just its content.
- **Close a toast** with a [close button](112-close.md) that has `commandfor` naming the toast and `command="--dismiss"`: `sassy.js` sets `hidden` on it. A close button outside the header sits in the top corner.
- **Extend `%bf-toast-autohide`** to hide the toast after `--sassy-toast-delay` (5 seconds), fading over `--sassy-toast-fade`. It waits while the pointer is over the toast or something in it has focus, so people have time to read and use it, and it hides without fading for reduced motion. This is CSS only: the hidden toast stays in the page, out of sight and out of the accessibility tree, so remove old toasts from your script if many build up. Don't auto-hide a toast that people need to act on.
- **Extend `%bf-toast-container-top`** to stack toasts at the top, and **`%bf-toast-container-start`** or **`-centre`** to move them across. They combine.
- **For a coloured toast**, extend a `%bf-text-bg-{theme colour}` utility with the toast.

## Settings and custom properties

| Property                                                                                               | Controls                                                                                |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `--sassy-toast-bg`, `--sassy-toast-colour`, `--sassy-toast-radius`, `--sassy-toast-shadow`             | Toast background, text, corners and shadow                                              |
| `--sassy-toast-border-width`, `--sassy-toast-border-colour`                                            | The border, and the line under the title row                                            |
| `--sassy-toast-font-size`, `--sassy-toast-width`, `--sassy-toast-padding-y`, `--sassy-toast-padding-x` | Toast text size, width and padding                                                      |
| `--sassy-toast-delay`, `--sassy-toast-fade`                                                            | How long `%bf-toast-autohide` waits, and how long it takes to fade                      |
| `--sassy-toast-container-offset`, `--sassy-toast-container-gap`, `--sassy-toast-container-z-index`     | The stack's gap from the window's edges, the gap between toasts, and what it sits above |
| `--sassy-toast-container-block`, `--sassy-toast-container-inline`                                      | Where the stack sits - `-top`, `-start` and `-centre` set them                          |
