# Sassy documentation

Sassy is a Sass utility framework built from [placeholder selectors](https://sass-lang.com/documentation/style-rules/placeholder-selectors/) (`%`). You `@extend` the utilities you need onto your own selectors, so your markup stays semantic and your CSS contains only the rules you use. The [README](../README.md) covers installation, naming and the basics; these pages cover each layer in more depth, with worked examples.

## Where to start

| Page                                   | Covers                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [0-core](0-core/README.md)             | Loading and configuring Sassy, the functions and mixins it provides, and writing your own placeholders |
| [1-components](1-components/README.md) | Every component, the markup each one expects, and what `sassy.js` adds                                 |
| [2-forms](2-forms/README.md)           | Every form placeholder, the markup each expects, and validation                                        |
| [3-grid](3-grid/README.md)             | Rows and columns                                                                                       |
| [4-utilities](4-utilities/README.md)   | Text, layout, colour, display, border, corners and shadow                                              |
| [5-theme](5-theme/README.md)           | Theme colours, and changing them at runtime                                                            |
| [Coming from Bootstrap](bootstrap.md)  | What Sassy does differently, and the placeholder for each Bootstrap class                              |

## How the pages are laid out

Each layer has a folder, named like its folder in `src`. Its `README.md` says what the layer is for, lists its placeholders and links to a page for each part, and holds anything the whole layer shares, such as the script and browser support of components or the settings of forms. Each part's page is named after its source file - `1-components/123-tabs.md` documents `src/1-components/_123-tabs.sass` - and has:

1. Worked examples: the Sass, the HTML it expects and the CSS it produces.
2. The settings and custom properties it reads, where it has its own, so you know what you can change.

CSS output in these pages comes from compiling the example with Dart Sass, abridged to the rules that matter for the example.

## Output order

Sassy outputs its placeholders in a fixed order, and that order decides which rule wins when two set the same property:

- **Breakpoints come after base rules.** A variant such as `%bf-d-block-lg` always overrides the base utility and any smaller breakpoint.
- **Composites come before single-purpose utilities.** Forms, components and the grid are output first, so `%bf-col-4` + `%bf-p-0` removes a column's gutter.
- **Theme colours come last.**

You do not need to order your `@extend` lines for this to work.

## Naming

Every placeholder follows the pattern `%bf-{utility}-{value}-{breakpoint}`. The prefix (`bf`) is configurable, and the breakpoint is optional. Names use British spelling: `centre`, `colour`, `capitalise`, `grey`. See [0-core](0-core/README.md#configuring-sassy) for how to change the prefix.

## Examples site

The live examples site is at [bfren.github.io/sassy](https://bfren.github.io/sassy/). It has a page per layer, each with its own Sass file compiled to its own stylesheet. Under each demo are its Sass, the CSS that Sassy outputs for it, and its HTML.
