# Dropdowns

[1-components](README.md) - live examples: [Dropdowns](https://bfren.github.io/sassy/1-components.html#dropdowns)

A dropdown is a menu in a popover, opened by a button's `popovertarget`. The browser opens and closes it, on Escape or a click outside too, and returns focus to the button, so it works without `sassy.js`. CSS anchor positioning places it below the button, lined up with its start, and moves it when there is no room:

```sass
.dropdown
    @extend %bf-dropdown

.dropdown-toggle
    @extend %bf-dropdown-toggle
```

```css
@layer sassy.base.components {
  .dropdown {
    inset: auto;
    margin: var(--sassy-dropdown-offset, 0.125rem) 0;
    position-area: var(--sassy-dropdown-side, block-end) var(--sassy-dropdown-align, span-inline-end);
    position-try-fallbacks: flip-block, flip-inline;
  }
  [aria-expanded=true].dropdown-toggle::after {
    transform: rotate(180deg);
  }
}
```

```html
<button type="button" class="button dropdown-toggle" popovertarget="file-menu" aria-haspopup="menu">File</button>
<div class="dropdown" id="file-menu" popover role="menu" aria-label="File">
    <button type="button" role="menuitem">New</button>
    <button type="button" role="menuitem">Open…</button>
    <hr />
    <button type="button" role="menuitem">Print…</button>
</div>
```

- **Choose the pattern by what the items do.** For actions, give the popover `role="menu"`, its items `role="menuitem"` and the button `aria-haspopup="menu"`: `sassy.js` then focuses the first item when the menu opens, and moves between items with the arrow keys, Home and End. For links to other pages, leave the roles out: people reach the links with Tab, as in any list, and the popover can be a `<ul>`.
- **`sassy.js` also** keeps the button's `aria-expanded` up to date, which turns the chevron of `%bf-dropdown-toggle`, closes the menu when an item is chosen or Tab leaves it, and places the menu in browsers without CSS anchor positioning.
- **Extend `%bf-dropdown-up` to open above the button, and `%bf-dropdown-end` to line the menu up with its end.** They combine.
- **Group items** with a heading, a label that can't be chosen, and an `<hr>` or `role="separator"` between groups: the dropdown styles them itself. `%bf-dropdown-header` and `%bf-dropdown-divider` are for labels and lines that are other elements. Mark the current page with `aria-current="page"`, and items that can't be used with `disabled` or `aria-disabled="true"`.
- **For a split button**, put an action button and a chevron-only button that extends `%bf-dropdown-toggle` and `%bf-dropdown-split` in a [button group](111-button-group.md). Give the chevron button an `aria-label`, such as "More ways to publish".
- **In a navbar**, a link-styled button can open a dropdown in the same way. The menu floats below it even while the navbar is collapsed.

## Settings and custom properties

| Property                                                                                               | Controls                                                        |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `--sassy-dropdown-bg`, `--sassy-dropdown-colour`, `--sassy-dropdown-radius`, `--sassy-dropdown-shadow` | Dropdown background, text, corners and shadow                   |
| `--sassy-dropdown-border-width`, `--sassy-dropdown-border-colour`                                      | The border, and the line of a divider                           |
| `--sassy-dropdown-min-width`, `--sassy-dropdown-offset`, `--sassy-dropdown-padding-y`                  | Width, gap from the button, and space above and below the items |
| `--sassy-dropdown-item-padding-y`, `--sassy-dropdown-item-padding-x`                                   | Item padding                                                    |
| `--sassy-dropdown-hover-bg`, `--sassy-dropdown-current-bg`, `--sassy-dropdown-current-colour`          | An item under the pointer or with focus, and the current item   |
| `--sassy-dropdown-disabled-colour`, `--sassy-dropdown-header-colour`                                   | Items that can't be used, and headers                           |
| `--sassy-dropdown-side`, `--sassy-dropdown-align`                                                      | Where the menu opens - `%bf-dropdown-up` and `-end` set them    |
