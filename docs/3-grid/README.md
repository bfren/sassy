# 3-grid: rows and columns

Live examples: [https://bfren.github.io/sassy/3-grid.html](https://bfren.github.io/sassy/3-grid.html)

`src/3-grid` provides a 12-column flex grid. A row extends `%bf-d-flex-row`, and each column extends `%bf-col-{1-12}`, with a breakpoint variant for each width you want to change. Columns are composites, so they output before the utilities and a utility such as `%bf-p-0` can override them. For layouts where items span and start at set columns, there is also an opt-in CSS grid.

The grid always has 12 columns.

## Pages

- [Rows and columns](300-grid.md)

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

The `.wrap` container, which centres a page's content, is in [4-utilities](../4-utilities/410-layout.md).

## Settings and custom properties

| Name                  | Default  | Description                                                                  |
| --------------------- | -------- | ---------------------------------------------------------------------------- |
| `--sassy-grid-gutter` | `0.5rem` | Padding on each side of a column, which is the space between columns         |
| `--sassy-col-offset`  | `0`      | A column's start margin - set by `%bf-col-offset-{n}`, and reset by each row |
| `--sassy-grid-gap`    | `1rem`   | The space between the cells of a `%bf-grid`                                  |

The grid's columns and breakpoints are set in [`src/3-grid/_300-grid-variables.scss`](../../src/3-grid/_300-grid-variables.scss) and the breakpoints in [0-core](../0-core/README.md#configuring-sassy).
