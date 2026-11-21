# Tables

[1-components](README.md) - live examples: [A table](https://bfren.github.io/sassy/1-components.html#tables)

```sass
.prices
    @extend %bf-table
    @extend %bf-table-striped
    @extend %bf-table-hover

.prices-wrap
    @extend %bf-table-responsive-md

.price-sale
    @extend %bf-table-ok
```

```css
@layer sassy.base.components {
  .prices > :not(caption) > tr > * {
    --sassy-table-accent: transparent;
    background-color: var(--sassy-table-bg, transparent);
    background-image: linear-gradient(var(--sassy-table-accent), var(--sassy-table-accent));
  }
  .prices > tbody > tr:nth-of-type(odd) > * {
    --sassy-table-accent: var(--sassy-table-striped-bg, color-mix(in oklab, currentColor 5%, transparent));
  }
}
```

```html
<div class="prices-wrap">
    <table class="prices">
        <caption>Prices from 1 March</caption>
        <thead>
            <tr><th scope="col">Plan</th><th scope="col">Monthly</th></tr>
        </thead>
        <tbody>
            <tr><td>Basic</td><td>£5</td></tr>
            <tr aria-current="true"><td>Standard</td><td>£10</td></tr>
            <tr class="price-sale"><td>Premium</td><td>£15</td></tr>
        </tbody>
    </table>
</div>
```

| Placeholder                                        | Does                                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `%bf-table`                                        | Full width, with padding and a line under every row. Mark a row with `aria-current="true"` to shade it |
| `%bf-table-striped`, `%bf-table-striped-columns`   | Shades every other row, or every other column                                                          |
| `%bf-table-hover`                                  | Shades the row under the pointer                                                                       |
| `%bf-table-bordered`, `%bf-table-borderless`       | Borders on every side of every cell, or none                                                           |
| `%bf-table-small`                                  | Half the padding                                                                                       |
| `%bf-table-caption-top`                            | Puts the caption above the table                                                                       |
| `%bf-table-{theme colour}`                         | Tints a table, row or cell with a theme colour, for example `%bf-table-warn`                           |
| `%bf-table-responsive`, `-responsive-{breakpoint}` | On a wrapper: scrolls a wide table sideways, always or below the breakpoint                            |

Each cell paints the table background, then shades it for stripes, hover and the current row. The shades mix the text colour with transparency, so they work over a theme tint and in a dark theme. Without `%bf-table`, a table still has joined borders and its caption below it - see [0-core](../0-core/060-content.md).

## Settings and custom properties

| Property                                                                                                | Controls                                                                                          |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `--sassy-table-bg`, `--sassy-table-colour`, `--sassy-table-border-width`, `--sassy-table-border-colour` | Table background, text and lines - `%bf-table-{theme colour}` sets the background and line colour |
| `--sassy-table-padding-y`, `--sassy-table-padding-x`, `--sassy-table-small-padding`                     | Cell padding, and the padding of a small table                                                    |
| `--sassy-table-striped-bg`, `--sassy-table-hover-bg`, `--sassy-table-current-bg`                        | The shades laid over a striped row or column, the row under the pointer, and the current row      |
