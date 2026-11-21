# Rows and columns

[3-grid](README.md) - live examples: [Two columns that stack on small screens](https://bfren.github.io/sassy/3-grid.html#halves), [Main content and a sidebar](https://bfren.github.io/sassy/3-grid.html#sidebar), [A centred column](https://bfren.github.io/sassy/3-grid.html#offset), [Cards in a row](https://bfren.github.io/sassy/3-grid.html#row-cols), [A CSS grid](https://bfren.github.io/sassy/3-grid.html#css-grid), [Removing a column's gutter](https://bfren.github.io/sassy/3-grid.html#gutter)

## Two equal columns that stack on small screens

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
@layer sassy.base.grid {
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
}

@layer sassy.md.grid {
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
}
```

Each column stacks at full width below `md`, then sits side by side from `md` upwards. Every column placeholder is complete in itself, which is why the `md` rule repeats the column's other declarations.

## A sidebar and main content

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

## A centred column

```sass
.narrow
    @extend %bf-col-8
    @extend %bf-col-offset-2
    @extend %bf-col-6-lg
    @extend %bf-col-offset-3-lg
```

```css
@layer sassy.base.grid {
  .narrow {
    --sassy-col-offset: 16.666%;
  }
}
```

The column is two thirds wide with a sixth either side, then half wide with a quarter either side from `lg`.

## Cards in a row

```sass
.cards
    @extend %bf-d-flex-row
    @extend %bf-row-cols-1
    @extend %bf-row-cols-3-md
    @extend %bf-gutter-4
```

```css
@layer sassy.base.grid {
  .cards {
    --sassy-grid-gutter: 0.75rem;
  }
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

## A CSS grid

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
@layer sassy.base.grid {
  .layout {
    display: grid;
    gap: var(--sassy-grid-gap, 1rem);
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}
```

A grid's gap is between cells only, so there is none at the edges, and cells in a row are as tall as each other. Use the flex grid when columns should wrap by their content, and the CSS grid when items should line up in both directions.

## Removing a column's gutter

A column's gutter is its padding. To remove it, extend `%bf-p-0` after the column. Single-purpose utilities always override the grid, so the order of your `@extend` lines does not matter:

```sass
.edge
    @extend %bf-col-4
    @extend %bf-p-0
```

## Changing the gutter

The gutter is a custom property, so you can change it per site or at a breakpoint:

```sass
:root
    --sassy-grid-gutter: 0.5rem

@media (width >= 768px)
    :root
        --sassy-grid-gutter: 1.5rem
```

Because the row has no padding, the gutter only sits around columns. Spacing between rows is set on the row or the columns, with a margin or padding utility.
