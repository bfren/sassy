# Display

[4-utilities](README.md) - live examples: [4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

| Placeholder                                                             | Sets                                                                                                           |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `%bf-d-{block, inline, inline-block, flex, inline-flex, grid, none, …}` | `display`. Responsive                                                                                          |
| `%bf-visually-hidden`                                                   | Hides content visually, but not from screen readers. Not responsive                                            |
| `%bf-visually-hidden-focusable`                                         | Hidden like `%bf-visually-hidden` until focused, for skip links                                                |
| `%bf-opacity-{0pc-100pc}`                                               | `opacity`, in steps of 10                                                                                      |
| `%bf-backdrop-blur-{none, 1, 2, 3}`                                     | Blurs what is behind a see-through background: 0.25 to 1rem                                                    |
| `%bf-flex-{column, column-reverse, row, row-reverse}`                   | `flex-direction`                                                                                               |
| `%bf-flex-wrap-{nowrap, wrap, wrap-reverse}`                            | `flex-wrap`                                                                                                    |
| `%bf-flex-justify-{start, centre, end, between, around, evenly}`        | `justify-content`                                                                                              |
| `%bf-flex-align-items-{baseline, centre, end, start, stretch}`          | `align-items`                                                                                                  |
| `%bf-flex-align-content-{…}`, `%bf-flex-align-self-{…}`                 | `align-content` and `align-self`, with the same values                                                         |
| `%bf-flex-order-{first, 0-5, last}`                                     | `order`                                                                                                        |
| `%bf-flex-grow-{0-20}`, `%bf-flex-shrink-{0-20}`                        | `flex-grow` and `flex-shrink`                                                                                  |
| `%bf-flex-fill`                                                         | `flex: 1 1 auto`                                                                                               |
| `%bf-gap-{0-32}`, `%bf-gap-x-…`, `%bf-gap-y-…`                          | `gap` between flex or grid items                                                                               |
| `%bf-vstack`                                                            | A flex column that fills its parent, spaced by `--sassy-stack-gap` (`0`) or a `%bf-gap-…`                      |
| `%bf-hstack`                                                            | A flex row, its items centred top to bottom, spaced the same way                                               |
| `%bf-vr`                                                                | A vertical line between the items of a row, `--sassy-vr-width` (`1px`) in `--sassy-vr-colour` (`--sassy-line`) |

## Example: a navigation bar that changes at a breakpoint

```sass
.nav
    @extend %bf-d-flex
    @extend %bf-flex-column
    @extend %bf-gap-2
    @extend %bf-flex-row-md
    @extend %bf-flex-justify-between
    @extend %bf-flex-align-items-centre
    @extend %bf-gap-4-md
```

```html
<nav class="nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</nav>
```

The items stack in a column on small screens, and sit in a row, spread out, from `md` upwards.

## Example: showing a menu on large screens only

```sass
.menu-toggle
    @extend %bf-d-block
    @extend %bf-d-none-lg
```

`%bf-d-none-lg` hides the toggle from `lg` upwards, and the base `%bf-d-block` shows it below that.

## Example: a label for screen readers only

```sass
.skip-link
    @extend %bf-visually-hidden-focusable
```

```html
<a class="skip-link" href="#main">Skip to main content</a>
```

The link is hidden until a keyboard user focuses it, then appears so they can use it.

## Example: a toolbar with a divider

```sass
.toolbar
    @extend %bf-hstack
    @extend %bf-gap-2

.toolbar-divider
    @extend %bf-vr
```

```css
@layer sassy.base.utilities {
  .toolbar {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: row;
    gap: var(--sassy-stack-gap, 0);
  }
  .toolbar-divider {
    align-self: stretch;
    background-color: var(--sassy-vr-colour, var(--sassy-line));
    display: inline-block;
    min-height: 1em;
    width: var(--sassy-vr-width, 1px);
  }
  .toolbar {
    gap: 0.5rem;
  }
}
```

```html
<div class="toolbar">
    <button type="button">Bold</button>
    <button type="button">Italic</button>
    <span class="toolbar-divider"></span>
    <button type="button">Link</button>
</div>
```

`%bf-gap-2` comes after the stacks, so it wins over `--sassy-stack-gap`. The rule is as tall as the row.
