# Pagination

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

Pagination links to numbered pages. Extend `%bf-pagination` on the `<ul>`: each item's link is a box, and the boxes share their borders, like the buttons in a [button group](111-button-group.md):

```sass
.pages
    @extend %bf-pagination
```

```css
@layer sassy.base.components {
  .pages > :not(:first-child) > * {
    margin-inline-start: calc(var(--sassy-input-border-width, 1px) * -1);
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
  .pages > * > * {
    color: var(--sassy-pagination-colour, var(--sassy-theme-primary));
    padding: var(--sassy-input-padding-y, 0.375rem) var(--sassy-input-padding-x, 0.75rem);
  }
  .pages > * > span, .pages > * > [aria-disabled=true] {
    pointer-events: none;
  }
  .pages > * > [aria-current=page] {
    background-color: var(--sassy-pagination-current-bg, var(--sassy-theme-primary));
    color: var(--sassy-pagination-current-colour, var(--sassy-theme-primary-contrast));
  }
}
```

```html
<nav aria-label="Pages">
    <ul class="pages">
        <li><a href="?page=1" aria-label="Previous page">‹</a></li>
        <li><a href="?page=1">1</a></li>
        <li><a href="?page=2" aria-current="page">2</a></li>
        <li><a href="?page=3">3</a></li>
        <li><span aria-hidden="true">…</span></li>
        <li><a href="?page=9">9</a></li>
        <li><a href="?page=3" aria-label="Next page">›</a></li>
    </ul>
</nav>
```

- **Put it in a `<nav>` with `aria-label`**, such as "Pages", so it is listed as a landmark.
- **Mark the current page with `aria-current="page"`**, and it takes the primary colour.
- **A link that can't be used** - Previous on the first page - is a `<span>`, or a link with `aria-disabled="true"` and no `href`. It is grey and ignores clicks. Use a `<span>` for an ellipsis too, with `aria-hidden="true"`.
- **Label arrows**, such as `‹` and `›`, with `aria-label`, as screen readers would read them as symbols.
- **The boxes take the form control sizes**, as buttons do, so `%bf-pagination-small` and `%bf-pagination-large` match buttons and controls of the same size.

## Settings and custom properties

| Property                                                                                                                | Controls                                                             |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `--sassy-pagination-bg`, `--sassy-pagination-colour`, `--sassy-pagination-border-colour`, `--sassy-pagination-hover-bg` | Page link background, text, border, and background under the pointer |
| `--sassy-pagination-current-bg`, `--sassy-pagination-current-colour`, `--sassy-pagination-disabled-colour`              | The current page, and an ellipsis or a link that can't be used       |
