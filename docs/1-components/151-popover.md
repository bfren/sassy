# Popovers

[1-components](README.md) - live examples: [Popovers](https://bfren.github.io/sassy/1-components.html#popovers)

A popover is a panel of content in a popover, opened by a button's `popovertarget`, like a [dropdown](152-dropdown.md). The browser opens and closes it, on Escape or a click outside too, and returns focus to the button, so it works without `sassy.js`. A heading it starts with is its title bar. CSS anchor positioning places it above the button, centred, and moves it when there is no room:

```sass
.popover
    @extend %bf-popover

.popover-end
    @extend %bf-popover-end
```

```css
@layer sassy.base.components {
  .popover {
    inset: auto;
    margin: var(--sassy-popover-offset, 0.5rem);
    position-area: var(--sassy-popover-side, block-start);
    position-try-fallbacks: flip-block, flip-inline;
  }
  .popover-end {
    --sassy-popover-side: inline-end;
  }
}
```

```html
<button type="button" class="button" popovertarget="hours">Opening hours</button>
<div class="popover" id="hours" popover role="dialog" aria-labelledby="hours-title">
    <h3 id="hours-title">Opening hours</h3>
    <p>Monday to Friday, 9am to 5pm.</p>
    <button type="button" class="close" popovertarget="hours" popovertargetaction="hide" aria-label="Close"></button>
</div>
```

- **Give the popover `role="dialog"`** and name it with `aria-labelledby` (its heading) or `aria-label`. `sassy.js` then leaves it open when a link or button in it is clicked, where it would close a dropdown menu. It also keeps the button's `aria-expanded` up to date, and places the popover in browsers without CSS anchor positioning.
- **Extend `%bf-popover-bottom` to open below the button, and `%bf-popover-start` or `%bf-popover-end` to open before or after it.** Each moves to the opposite side when there is no room.
- **A close button** is a button with `popovertarget` naming the popover and `popovertargetaction="hide"`, such as a [close button](112-close.md). It sits in the top corner, and the title leaves room for it.
- **For text shown on hover and focus**, use a [tooltip](150-tooltip.md). A popover only opens when its button is pressed, so it works on touch screens too.

## Settings and custom properties

| Property                                                                                           | Controls                                                        |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--sassy-popover-bg`, `--sassy-popover-colour`, `--sassy-popover-radius`, `--sassy-popover-shadow` | Popover background, text, corners and shadow                    |
| `--sassy-popover-border-width`, `--sassy-popover-border-colour`                                    | The border, and the line under the title                        |
| `--sassy-popover-font-size`, `--sassy-popover-max-width`, `--sassy-popover-offset`                 | Text size, width, and gap from the button                       |
| `--sassy-popover-padding-y`, `--sassy-popover-padding-x`                                           | Popover padding                                                 |
| `--sassy-popover-header-bg`, `--sassy-popover-header-font-size`                                    | The title bar: the heading a popover starts with                |
| `--sassy-popover-side`                                                                             | Where the popover opens - `-bottom`, `-start` and `-end` set it |
