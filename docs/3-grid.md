# 3-grid: rows and columns

Live examples: [https://bfren.github.io/sassy/3-grid.html](https://bfren.github.io/sassy/3-grid.html)

`src/3-grid` provides a 12-column flex grid. A row extends `%bf-d-flex-row`, and each column extends `%bf-col-{1-12}`, with a breakpoint variant for each width you want to change. Columns are composites, so they output before the utilities and a utility such as `%bf-p-0` can override them.

The grid always has 12 columns.

## Placeholders

| Placeholder               | For                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `%bf-d-flex-row`          | A row. Flex, wrapping, with no margin or padding                                                 |
| `%bf-col-{1-12}`          | A column of that many twelfths of the row. Add a breakpoint, such as `%bf-col-6-md`, for a width from that breakpoint |
| `%bf-col-{1-12}-{breakpoint}` | The same, from a breakpoint: `sm`, `md`, `lg`, `xl`, `2xl` or `3xl`                       |

Columns have `box-sizing: border-box`, so their gutter sits inside their width and the widths add up to 100% whatever `box-sizing` the rest of the page uses.

The `.wrap` container, which centres a page's content, is in [4-utilities](4-utilities.md#layout).

## Worked examples

### Two equal columns that stack on small screens

```sass
@use "sassy/src" as sassy

.row
    @extend %bf-d-flex-row

.half
    @extend %bf-col-12
    @extend %bf-col-6-md
```

```html
<div class="row">
    <div class="half">Left</div>
    <div class="half">Right</div>
</div>
```

```css
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.half {
  box-sizing: border-box;
  flex: 0 0 auto;
  margin: 0;
  padding: var(--sassy-grid-gutter);
  width: 100%;
}
@media (min-width: 768px) {
  .half {
    width: 50%;
  }
}
```

Each column stacks at full width below `md`, then sits side by side from `md` upwards.

### A sidebar and main content

```sass
.row
    @extend %bf-d-flex-row

.main
    @extend %bf-col-12
    @extend %bf-col-8-lg

.side
    @extend %bf-col-12
    @extend %bf-col-4-lg
```

```html
<div class="row">
    <main class="main">…</main>
    <aside class="side">…</aside>
</div>
```

### Removing a column's gutter

A column's gutter is its padding. To remove it, extend `%bf-p-0` after the column. Single-purpose utilities always override the grid, so the order of your `@extend` lines does not matter:

```sass
.edge
    @extend %bf-col-4
    @extend %bf-p-0
```

### Changing the gutter

The gutter is a custom property, so you can change it per site or at a breakpoint:

```sass
:root
    --sassy-grid-gutter: 0.5rem

@media (min-width: 768px)
    :root
        --sassy-grid-gutter: 1.5rem
```

Because the row has no padding, the gutter only sits around columns. Spacing between rows is set on the row or the columns, with a margin or padding utility.

## Settings and custom properties

| Name                    | Default | Description                                                                     |
| ----------------------- | ------- | ------------------------------------------------------------------------------- |
| `--sassy-grid-gutter`   | `0.5rem`| Padding on each side of a column, which is the space between columns            |

The grid's columns and breakpoints are set in [`src/3-grid/_300-grid-variables.scss`](../src/3-grid/_300-grid-variables.scss) and the breakpoints in [0-core](0-core.md#configuring-sassy).
