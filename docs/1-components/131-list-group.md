# List groups

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

A list group is a bordered list. Its direct children are its items, so extend one placeholder on the list:

```sass
.inbox
    @extend %bf-list-group
```

```css
@layer sassy.base.components {
  .inbox {
    border-radius: var(--sassy-list-group-radius, var(--sassy-radius, 0.375rem));
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .inbox > * + * {
    border-block-start: var(--sassy-list-group-border-width, 1px) solid var(--sassy-list-group-border-colour, var(--sassy-line));
  }
  .inbox > :where(a, button):hover {
    background-color: var(--sassy-list-group-hover-bg, color-mix(in oklab, currentColor 6%, var(--sassy-list-group-bg, var(--sassy-surface))));
  }
  .inbox > [aria-current]:not([aria-current=false]) {
    background-color: var(--sassy-list-group-current-bg, var(--sassy-theme-primary));
    color: var(--sassy-list-group-current-colour, var(--sassy-theme-primary-contrast));
  }
}
```

```html
<nav class="inbox" aria-label="Folders">
    <a href="/inbox" aria-current="page">Inbox</a>
    <a href="/sent">Sent</a>
    <a href="/drafts">Drafts</a>
    <a href="/archive" aria-disabled="true">Archive</a>
</nav>
```

- **Items are `<li>` in a `<ul>` or `<ol>`**, for a list of things, or `<a>` and `<button>` in a `<div>` or `<nav>`, for a list of things to do. Links and buttons fill the width, shade under the pointer, and show the focus outline inside the item.
- **Mark the current item with `aria-current`** - `"page"` for a link to the current page, `"true"` otherwise - and it takes the primary colour, with text that contrasts.
- **Disable an item with `disabled`**, or `aria-disabled="true"` on a link, and it fades and ignores clicks.
- **The list clips its items to its corners**, so a current item's background follows them. Something that pops out of an item, such as a menu, must use a popover, which is drawn above the page.
- **Combine `%bf-list-group-flush`** for a list with no outer border or corners, such as one that fills a card, **`%bf-list-group-numbered`** to number the items of an `<ol>`, and **`%bf-list-group-horizontal`** or **`-horizontal-{breakpoint}`** to set the items side by side.

## Settings and custom properties

| Property                                                                                                                                                 | Controls                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `--sassy-list-group-bg`, `--sassy-list-group-colour`, `--sassy-list-group-border-width`, `--sassy-list-group-border-colour`, `--sassy-list-group-radius` | List group background, text, border and corners                             |
| `--sassy-list-group-padding-y`, `--sassy-list-group-padding-x`                                                                                           | List group item padding                                                     |
| `--sassy-list-group-hover-bg`, `--sassy-list-group-current-bg`, `--sassy-list-group-current-colour`, `--sassy-list-group-disabled-colour`                | An actionable item under the pointer, the current item, and a disabled item |
