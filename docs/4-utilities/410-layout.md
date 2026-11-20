# Layout

[4-utilities](README.md) - live examples: [4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

| Placeholder                                                                                                  | Sets                                                                                          |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `%bf-wrap`                                                                                                   | A centred container whose width steps up at each breakpoint. Also output as the `.wrap` class |
| `%bf-position-{absolute, fixed, relative, static, sticky, inherit}`                                          | `position`                                                                                    |
| `%bf-top-{0, 50, 100, auto}`, `%bf-bottom-…`, `%bf-left-…`, `%bf-right-…`                                    | Offsets from the edge, as a percentage or `auto`                                              |
| `%bf-z-index-{3, 4, 5}`                                                                                      | `z-index`                                                                                     |
| `%bf-overflow-{auto, hidden, scroll, visible}`, `%bf-overflow-x-…`, `%bf-overflow-y-…`                       | `overflow`, or by axis                                                                        |
| `%bf-float-{start, end, none}`                                                                               | `float`, using the logical `inline-start` and `inline-end`                                    |
| `%bf-vertical-align-{baseline, top, middle, bottom, text-top, text-bottom}`                                  | `vertical-align`                                                                              |
| `%bf-object-fit-{contain, cover, fill, scale, none}`                                                         | How an image or video fills its box. `scale` is `scale-down`                                  |
| `%bf-aspect-ratio-{1x1, 4x3, 16x9, 21x9}`                                                                    | `aspect-ratio`. Add or change ratios with `$sassy-aspect-ratio`                               |
| `%bf-pointer-events-{auto, none}`, `%bf-user-select-{all, auto, none}`                                       | Whether an element takes clicks, and how its text is selected                                 |
| `%bf-height-{5-100}`, `%bf-viewheight-{5-100}`                                                               | Height as a percentage of the parent, or of the viewport                                      |
| `%bf-min-width-…`, `%bf-min-height-…`, `%bf-min-viewwidth-…`, `%bf-min-viewheight-…`                         | Minimum sizes, as a percentage or of the viewport                                             |
| `%bf-width-{5-100}`, `%bf-viewwidth-{5-100}`                                                                 | Width, as a percentage of the parent, or of the viewport                                      |
| `%bf-max-width-{5-100, none}`, `%bf-max-height-{5-100, none}`, `%bf-max-viewwidth-…`, `%bf-max-viewheight-…` | Maximum width and height                                                                      |
| `%bf-max-width-text`                                                                                         | A readable line length, `--sassy-text-max-width` (`65ch`)                                     |
| `%bf-m-{centre}`, `%bf-mt-…`, `%bf-me-…`, `%bf-mb-…`, `%bf-ms-…`, `%bf-mx-…`, `%bf-my-…`                     | Margin, from `auto` or `0` to `20`. `t`, `e`, `b`, `s` are top, end, bottom and start         |
| `%bf-p-…`, `%bf-pt-…`, `%bf-pe-…`, `%bf-pb-…`, `%bf-ps-…`, `%bf-px-…`, `%bf-py-…`                            | Padding, from `inherit` or `0` to `20`                                                        |

Margin and padding steps are in multiples of `$sassy-margin-unit` and `$sassy-padding-unit`, so `%bf-p-4` is `4 × 0.25rem`, or `1rem`. Sides use `t`, `e`, `b` and `s`, but offsets, which name the edge, use `top`, `right`, `bottom` and `left`.

## Example: a centred page with sticky header

```sass
@use "sassy/src" as sassy

.page
    @extend %bf-wrap
    @extend %bf-py-4

.header
    @extend %bf-position-sticky
    @extend %bf-top-0
    @extend %bf-z-index-3
    @extend %bf-bg-grey-50
    @extend %bf-shadow-1
    @extend %bf-p-3
```

```html
<body>
    <header class="header">…</header>
    <main class="page">…</main>
</body>
```

The sticky header stays at the top of the viewport while the page scrolls. `z-index` keeps it above the content, and the shadow separates it from the page.

## Example: a 16:9 frame

```sass
.frame
    @extend %bf-aspect-ratio-16x9
    @extend %bf-width-100
    @extend %bf-object-fit-cover
```

```css
@layer sassy.base.utilities {
  .frame {
    aspect-ratio: 16 / 9;
  }
  .frame {
    object-fit: cover;
  }
}
```

```html
<img class="frame" src="photo.jpg" alt="…">
```

The image keeps a 16:9 shape at any width, and `cover` crops it to fill the frame rather than stretching it.

## Example: responsive spacing

```sass
.section
    @extend %bf-py-4
    @extend %bf-py-6-md
    @extend %bf-mx-auto
```

Vertical padding is 1rem on small screens and 1.5rem from `md`. `%bf-mx-auto` centres the section horizontally.
