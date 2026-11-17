# 3-grid: rows and columns

Live examples: [https://bfren.github.io/sassy/3-grid.html](https://bfren.github.io/sassy/3-grid.html)

`src/3-grid` provides a 12-column flex grid. A row extends `%bf-d-flex-row`, and each column extends `%bf-col-{1-12}`, with a breakpoint variant for each width you want to change. Columns are composites, so they output before the utilities and a utility such as `%bf-p-0` can override them. For layouts where items span and start at set columns, there is also an opt-in CSS grid.

The grid always has 12 columns.

## Placeholders

| Placeholder                                    | For                                                                                                                   |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `%bf-d-flex-row`                               | A row. Flex, wrapping, with no margin or padding                                                                      |
| `%bf-col-{1-12}`                               | A column of that many twelfths of the row. Add a breakpoint, such as `%bf-col-6-md`, for a width from that breakpoint |
| `%bf-col-{1-12}-{breakpoint}`                  | The same, from a breakpoint: `sm`, `md`, `lg`, `xl`, `2xl` or `3xl`                                                   |
| `%bf-col`                                      | A column that shares the row equally with the other `%bf-col` columns                                                 |
| `%bf-col-auto`                                 | A column as wide as its content                                                                                       |
| `%bf-col-offset-{0-11}`                        | Moves a column along by that many twelfths. It stays when the column's width changes at a breakpoint                  |
| `%bf-row-cols-{1-6}`, `%bf-row-cols-auto`      | On a row: every child is a column, that many to a row, or as wide as its content                                      |
| `%bf-gutter-{0-5}`                             | On a row: the gutter around its columns, from `0` to `1.5rem` on each side                                            |
| `%bf-grid`                                     | A CSS grid of 12 equal columns, with `--sassy-grid-gap` between them                                                  |
| `%bf-grid-col-{1-12}`, `%bf-grid-start-{1-11}` | In a `%bf-grid`: how many columns an item spans, and which column it starts in                                        |

Every placeholder except `%bf-col-offset-…` and `%bf-gutter-…` also has breakpoint variants, such as `%bf-row-cols-3-lg` or `%bf-grid-col-6-md`.

Columns have `box-sizing: border-box`, so their gutter sits inside their width and the widths add up to 100% whatever `box-sizing` the rest of the page uses.

An offset is the column's start margin, read from `--sassy-col-offset`. Each row sets it back to `0`, so a column inside an offset column is not offset too.

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
  --sassy-col-offset: 0;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.half {
  box-sizing: border-box;
  flex: 0 0 auto;
  margin-block: 0;
  margin-inline: var(--sassy-col-offset, 0) 0;
  padding: var(--sassy-grid-gutter, 0.5rem);
  width: 100%;
}
@media (width >= 768px) {
  .half {
    box-sizing: border-box;
    flex: 0 0 auto;
    margin-block: 0;
    margin-inline: var(--sassy-col-offset, 0) 0;
    padding: var(--sassy-grid-gutter, 0.5rem);
    width: 50%;
  }
}
```

Each column stacks at full width below `md`, then sits side by side from `md` upwards. Every column placeholder is complete in itself, which is why the `md` rule repeats the column's other declarations.

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

### A centred column

```sass
.narrow
    @extend %bf-col-8
    @extend %bf-col-offset-2
    @extend %bf-col-6-lg
    @extend %bf-col-offset-3-lg
```

```css
.narrow {
  --sassy-col-offset: 16.666%;
}
```

The column is two thirds wide with a sixth either side, then half wide with a quarter either side from `lg`.

### Cards in a row

```sass
.cards
    @extend %bf-d-flex-row
    @extend %bf-row-cols-1
    @extend %bf-row-cols-3-md
    @extend %bf-gutter-4
```

```css
.cards {
  --sassy-grid-gutter: 0.75rem;
}
```

```html
<div class="cards">
    <article>…</article>
    <article>…</article>
    <article>…</article>
</div>
```

The children need no placeholder of their own. They stack below `md`, then sit three to a row with `1.5rem` between them.

### A CSS grid

```sass
.layout
    @extend %bf-grid

.layout-main
    @extend %bf-grid-col-12
    @extend %bf-grid-col-8-lg

.layout-side
    @extend %bf-grid-col-12
    @extend %bf-grid-col-4-lg
```

```css
.layout {
  display: grid;
  gap: var(--sassy-grid-gap, 1rem);
  grid-template-columns: repeat(12, minmax(0, 1fr));
}
```

A grid's gap is between cells only, so there is none at the edges, and cells in a row are as tall as each other. Use the flex grid when columns should wrap by their content, and the CSS grid when items should line up in both directions.

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

@media (width >= 768px)
    :root
        --sassy-grid-gutter: 1.5rem
```

Because the row has no padding, the gutter only sits around columns. Spacing between rows is set on the row or the columns, with a margin or padding utility.

## Settings and custom properties

| Name                  | Default  | Description                                                                  |
| --------------------- | -------- | ---------------------------------------------------------------------------- |
| `--sassy-grid-gutter` | `0.5rem` | Padding on each side of a column, which is the space between columns         |
| `--sassy-col-offset`  | `0`      | A column's start margin - set by `%bf-col-offset-{n}`, and reset by each row |
| `--sassy-grid-gap`    | `1rem`   | The space between the cells of a `%bf-grid`                                  |

The grid's columns and breakpoints are set in [`src/3-grid/_300-grid-variables.scss`](../src/3-grid/_300-grid-variables.scss) and the breakpoints in [0-core](0-core.md#configuring-sassy).
