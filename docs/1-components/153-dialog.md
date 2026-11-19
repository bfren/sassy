# Dialogs

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

Dialogs style the native `<dialog>` element. Buttons open and close them with `command` and `commandfor`, so no script is needed in current browsers. The button in the header is a [close button](112-close.md):

```sass
.dialog
    @extend %bf-dialog

    header
        @extend %bf-dialog-header

    h2
        @extend %bf-dialog-title

    footer
        @extend %bf-dialog-footer

.dialog-body
    @extend %bf-dialog-body

.close
    @extend %bf-close
```

```html
<button type="button" commandfor="confirm" command="show-modal">Delete file…</button>

<dialog class="dialog" id="confirm" aria-labelledby="confirm-title">
    <header>
        <h2 id="confirm-title">Delete this file?</h2>
        <button type="button" class="close" commandfor="confirm" command="close" aria-label="Close"></button>
    </header>
    <div class="dialog-body">
        <p>You can't undo this.</p>
    </div>
    <footer>
        <button type="button" commandfor="confirm" command="close">Cancel</button>
        <button type="button" commandfor="confirm" command="close">Delete</button>
    </footer>
</dialog>
```

| `command`    | Does                                                              |
| ------------ | ----------------------------------------------------------------- |
| `show-modal` | Opens the dialog as a modal, over a backdrop, with the page inert |
| `close`      | Closes the dialog                                                 |

A modal dialog also closes when Escape is pressed, and returns focus to the button that opened it. To find out which button closed it, use a `<form method="dialog">` inside the dialog: the `value` of the button that submits it becomes the dialog's `returnValue`.

While a modal dialog is open the page behind it does not scroll. Sassy does this by hiding the overflow of `:root` (the `<html>` element), so it has no effect if your page scrolls inside another element instead. A dialog opened with `show` rather than `show-modal` does not lock the page.

```sass
.dialog
    @extend %bf-dialog
```

```css
@layer sassy.base.components {
  :root:has(.dialog:modal) {
    overflow: hidden;
  }
}
```

The dialog is a column with a maximum height, so when its content is taller than the window, the body scrolls between the header and footer. Extend `%bf-dialog-small` or `%bf-dialog-large` with `%bf-dialog` for a narrower or wider dialog.

`dialog.show()` opens a dialog without a backdrop, as part of the page. It uses the same styles.

## Settings and custom properties

| Property                                                                                                                             | Controls                                      |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `--sassy-dialog-bg`, `--sassy-dialog-border-width`, `--sassy-dialog-border-colour`, `--sassy-dialog-radius`, `--sassy-dialog-shadow` | Dialog background, border, corners and shadow |
| `--sassy-dialog-width`, `--sassy-dialog-padding-y`, `--sassy-dialog-padding-x`                                                       | Dialog width and spacing                      |
| `--sassy-dialog-backdrop`                                                                                                            | The backdrop behind a modal dialog            |
