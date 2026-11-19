# Text

[4-utilities](README.md) - live examples: [4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

`%bf-body` sets the text defaults on a `body` element: colour, font family, size, weight and line height, all from custom properties. It also sets the size, margins and spacing of `h1` to `h5`, so extend it once, on the page's body, and leave the headings to it.

| Placeholder                                                | Sets                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| `%bf-body`                                                 | Text defaults and heading sizes, on the body                             |
| `%bf-font-family-{mono, sans, serif}`                      | Font family                                                              |
| `%bf-font-size-{1-6, base, small, smaller, smallest}`      | Font size. `1` is largest, `6` is smallest of the numbered sizes         |
| `%bf-font-style-{italic, oblique, normal}`                 | Font style                                                               |
| `%bf-font-weight-{100-900, bold, bolder, lighter, normal}` | Font weight, as a number or keyword                                      |
| `%bf-line-height-{single, double, triple, base}`           | Line height                                                              |
| `%bf-text-align-{start, centre, end, justify}`             | Text alignment                                                           |
| `%bf-text-decoration-{under, over, through, none}`         | Underline, overline, line-through or none                                |
| `%bf-text-transform-{upper, lower, capitalise, none}`      | Upper or lower case, capitalised or none                                 |
| `%bf-text-wrap`                                            | Text wraps as normal                                                     |
| `%bf-text-wrap-overflow`                                   | Text stays on one line and overflows                                     |
| `%bf-text-truncate`                                        | Text stays on one line, truncated with an ellipsis, and expands on hover |
| `%bf-text-break`                                           | Long words and URLs break anywhere rather than overflow                  |
| `%bf-text-underline-offset-{auto, 1, 2, 3}`                | Gap between text and its underline, from `0.125em` to `0.375em`          |
| `%bf-text-decoration-opacity-{0-100}`                      | Fades the underline in steps of 10, without fading the text              |
| `%bf-stretched-link`                                       | Makes the nearest positioned ancestor clickable as the link              |
| `%bf-icon-link`                                            | A link with an icon: in a row, centred, with a `1em` square `svg`        |
| `%bf-outline-none`                                         | Removes the outline. Use with care, as it removes the focus indicator    |
| `%bf-focus-ring`                                           | The focus outline that links, tabs and buttons in components use         |

## Example: a page heading and a caption

```sass
@use "sassy/src" as sassy

body
    @extend %bf-body

.caption
    @extend %bf-font-size-smaller
    @extend %bf-font-style-italic
    @extend %bf-text-align-centre
    @extend %bf-c-grey-500
```

```html
<body>
    <h1>Our story</h1>
    <p class="caption">Photographed in the studio, spring 2026.</p>
</body>
```

## Example: long titles that stay on one line

```sass
.card-title
    @extend %bf-text-truncate
    @extend %bf-font-weight-700
```

## Example: a focus ring

```sass
.result
    @extend %bf-focus-ring
    --sassy-focus-outline-offset: 4px
```

```css
@layer sassy.base.utilities {
  .result:focus-visible {
    outline: var(--sassy-focus-outline-width, 2px) solid var(--sassy-focus-outline-colour, var(--sassy-theme-primary));
    outline-offset: var(--sassy-focus-outline-offset, 2px);
  }
}
```

```html
<a class="result" href="/post">A search result</a>
```

The ring only shows when the keyboard moves focus, not on a click. It reads the same `--sassy-focus-outline-*` properties as the components, so a site that changes them gets the same ring everywhere, and one element can change them for itself.

## Example: a clickable card

```sass
.teaser
    @extend %bf-position-relative

.teaser-link
    @extend %bf-stretched-link
    @extend %bf-text-underline-offset-2
    @extend %bf-text-decoration-opacity-50
```

```css
@layer sassy.base.utilities {
  .teaser-link::after {
    content: "";
    inset: 0;
    position: absolute;
    z-index: 1;
  }
  .teaser-link {
    text-decoration-color: color-mix(in srgb, currentColor 50%, transparent);
  }
}
```

```html
<article class="teaser">
    <h3><a class="teaser-link" href="/post">A post title</a></h3>
    <p>Clicking anywhere on the card follows the link.</p>
</article>
```

The link's `::after` covers the card, because the card is the nearest positioned ancestor. Keep other links and buttons out of the card, as the cover sits over them.
