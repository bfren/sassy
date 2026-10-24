# Sassy documentation

Sassy is a Sass utility framework built from [placeholder selectors](https://sass-lang.com/documentation/style-rules/placeholder-selectors/) (`%`). You `@extend` the utilities you need onto your own selectors, so your markup stays semantic and your CSS contains only the rules you use. The [README](../README.md) covers installation, naming and the basics; these pages cover each layer in more depth, with worked examples.

## Where to start

| Page                           | Covers                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| [0-core](0-core.md)            | Loading and configuring Sassy, the functions and mixins it provides, and writing your own placeholders |
| [1-forms](1-forms.md)          | Every form placeholder, the markup each expects, and validation                                        |
| [2-components](2-components.md) | Components such as navigation and cards (to come)                                                     |
| [3-grid](3-grid.md)            | Rows and columns                                                                                      |
| [4-utilities](4-utilities.md)  | Text, layout, colour, display, border, corners and shadow                                              |
| [5-theme](5-theme.md)          | Theme colours, and changing them at runtime                                                            |

## How each page is laid out

Each layer page follows the same shape:

1. What the layer is for.
2. Its placeholders, with what each one does.
3. Worked examples: the Sass, the HTML it expects and the CSS it produces.
4. The settings and custom properties it reads, so you know what you can change.

CSS output in these pages is abridged to the rules that matter for the example.

## Output order

Sassy outputs its placeholders in a fixed order, and that order decides which rule wins when two set the same property:

- **Breakpoints come after base rules.** A variant such as `%bf-d-block-lg` always overrides the base utility and any smaller breakpoint.
- **Composites come before single-purpose utilities.** Forms, components and the grid are output first, so `%bf-col-4` + `%bf-p-0` removes a column's gutter.
- **Theme colours come last.**

You do not need to order your `@extend` lines for this to work.

## Naming

Every placeholder follows the pattern `%bf-{utility}-{value}-{breakpoint}`. The prefix (`bf`) is configurable, and the breakpoint is optional. Names use British spelling: `centre`, `colour`, `capitalise`, `grey`. See [0-core](0-core.md#configuring-sassy) for how to change the prefix.

## Examples site

The live examples site is at [bfren.github.io/sassy](https://bfren.github.io/sassy/). It has a page per layer, each with its own Sass file compiled to its own stylesheet, so you can see both the result and the source. The examples on those pages match the ones here.
