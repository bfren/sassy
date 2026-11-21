# Content

[0-core](README.md) - live examples: [Content](https://bfren.github.io/sassy/0-core.html#content)

Sassy is meant to style the whole site, so `0-core` sets a few defaults on elements, after Normalize:

| Element                                     | Default                                                                                                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Everything, with `::before` and `::after`   | `box-sizing: border-box`, so padding and borders are inside an element's width and height                                                                                            |
| `h1` to `h6`                                | Weight 500, line height 1.2, no top margin and `0.5rem` below, and sizes from `2.5rem` to `1rem`                                                                                     |
| `blockquote`, `figure`                      | No side margins, and `$sassy-content-margin` (`1rem`) below                                                                                                                          |
| `table`                                     | Borders that join, and the caption below the table                                                                                                                                   |
| `caption`                                   | Grey, aligned to the start, with `0.5rem` above and below                                                                                                                            |
| `th`                                        | Aligned like the rest of its row, not centred                                                                                                                                        |
| `thead`, `tbody`, `tfoot`, `tr`, `td`, `th` | Solid borders of no width, so `%bf-table` only has to set a width                                                                                                                    |
| `img`, `svg`                                | `vertical-align: middle`, so they line up with text beside them                                                                                                                      |
| `p`, `ul`, `ol`, `dl`, `pre`                | No top margin, and `$sassy-content-margin` (`1rem`) below                                                                                                                            |
| `ul`, `ol`                                  | Indented by `$sassy-list-indent` (`2rem`); a list inside another has no margins                                                                                                      |
| `dt`, `dd`                                  | Bold terms; descriptions not indented, with `0.5rem` below                                                                                                                           |
| `a`                                         | `--sassy-link-colour` (the primary colour), underlined, moving towards the body text colour on hover (`--sassy-link-hover-colour`). Without `href`, it looks like the text around it |
| `code`, `kbd`, `pre`                        | `--sassy-code-font-size` (`0.875em`); code in a `pre` keeps the `pre`'s size                                                                                                         |
| `pre`                                       | Scrolls when its lines are too long, with tabs `--sassy-pre-tab-size` (`4`) wide                                                                                                     |
| `code`, `kbd`, `pre`, `samp`                | Left to right, in right-to-left text too, kept apart from the text around it (`unicode-bidi: isolate`)                                                                               |
| `kbd`                                       | A key: the body text and background colours swapped, with rounded corners                                                                                                            |
| `label`                                     | `inline-block`, so margins and widths work                                                                                                                                           |
| `fieldset`, `legend`                        | No border, margin or padding; `0.5rem` below the legend                                                                                                                              |
| `iframe`                                    | No border                                                                                                                                                                            |
| `summary`, `[role="button"]`                | A pointer cursor                                                                                                                                                                     |

They use `:where()`, so they have no specificity and any placeholder or class overrides them. The body text is still opt-in: extend `%bf-body` on `body` for its font, size, colour and heading sizes.

Heading sizes are set by `$sassy-heading`, and the large heading sizes by `$sassy-display-heading`. Any size larger than `$sassy-fluid-min` (`1.25rem`) shrinks on screens narrower than the `xl` breakpoint, down to `1.25rem` plus a tenth of the difference, so `h1` runs from `1.375rem` to `2.5rem`. From `xl` up each heading is its full size.

The rest are placeholders. They are output before components and forms, so a utility such as `%bf-font-size-4` overrides `%bf-display-1`:

| Placeholder              | Use it on                       | Does                                                                               |
| ------------------------ | ------------------------------- | ---------------------------------------------------------------------------------- |
| `%bf-h{1-6}`             | Any element                     | The same as `h1` to `h6`, for text that should look like a heading but is not one  |
| `%bf-lead`               | An introductory paragraph       | Larger, lighter text                                                               |
| `%bf-display-{1-6}`      | A large heading                 | From `5rem` to `2.5rem`, shrinking on small screens like the headings, and lighter |
| `%bf-initialism`         | An `abbr` said letter by letter | Upper case, a little smaller                                                       |
| `%bf-list-unstyled`      | A `ul` or `ol`                  | Removes the markers and indent                                                     |
| `%bf-list-inline`        | A `ul` or `ol`                  | Puts its `li` items in a row, with `--sassy-list-inline-gap` between them          |
| `%bf-img-fluid`          | An `img`                        | Shrinks to fit its container, keeping its shape                                    |
| `%bf-figure`             | A `figure`                      | Space under the image, and a smaller, grey `figcaption`                            |
| `%bf-blockquote`         | A `blockquote`                  | Larger text                                                                        |
| `%bf-blockquote-caption` | The `figcaption` after a quote  | Smaller, grey, starting with an em dash                                            |

`%bf-h{1-6}` and `%bf-display-{1-6}` have breakpoint variants, such as `%bf-display-4-md`.

## A large heading

```sass
.hero-title
    @extend %bf-display-1
```

```css
@layer sassy.base.core {
  .hero-title {
    font-size: min(5rem, 1.625rem + 4.5vw);
    font-weight: var(--sassy-display-heading-font-weight, 300);
    line-height: var(--sassy-display-heading-line-height, 1.2);
  }
}
```

At 1200px, the `xl` breakpoint, `1.625rem + 4.5vw` reaches `5rem`, and `min()` keeps it there on wider screens. On a 375px phone it is about `2.68rem`.

## A quote with its source

```sass
.quote
    @extend %bf-blockquote

.quote-source
    @extend %bf-blockquote-caption
```

```css
@layer sassy.base.core {
  .quote {
    font-size: var(--sassy-blockquote-font-size, calc(var(--sassy-font-size-base) * 1.25));
  }
  .quote-source {
    color: var(--sassy-blockquote-caption-colour, var(--sassy-muted));
    font-size: var(--sassy-blockquote-caption-font-size, 0.875em);
    margin-block: -1rem 1rem;
  }
  .quote-source::before {
    content: "— ";
  }
}
```

```html
<figure>
    <blockquote class="quote">
        <p>Simplicity is prerequisite for reliability.</p>
    </blockquote>
    <figcaption class="quote-source">Edsger W. Dijkstra</figcaption>
</figure>
```

The source goes in a `figcaption` outside the `blockquote`, because it is not part of the quote. Its negative top margin pulls it up under the quote, over the quote's bottom margin.
