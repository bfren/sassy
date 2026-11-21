# Layout

[4-utilities](README.md) - live examples: [A sticky header](https://bfren.github.io/sassy/4-utilities.html#sticky), [A 16:9 frame](https://bfren.github.io/sassy/4-utilities.html#frame), [Responsive spacing](https://bfren.github.io/sassy/4-utilities.html#spacing)

| Placeholder                                                                                    | Sets                                                                                          |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `%bf-wrap`                                                                                     | A centred container whose width steps up at each breakpoint. Also output as the `.wrap` class |
| `%bf-position-{absolute, fixed, relative, static, sticky, inherit}`                            | `position`                                                                                    |
| `%bf-top-{0-32, 50pc, 100pc, auto}`, `%bf-bottom-…`, `%bf-left-…`, `%bf-right-…`               | Offsets from the edge: steps on the padding scale, a percentage or `auto`                     |
| `%bf-translate-middle`, `-x`, `-y`                                                             | Moves an element back by half its size, both ways or on one axis, to centre it on its offset  |
| `%bf-z-index-{3, 4, 5}`                                                                        | `z-index`                                                                                     |
| `%bf-overflow-{auto, hidden, scroll, visible}`, `%bf-overflow-x-…`, `%bf-overflow-y-…`         | `overflow`, or by axis                                                                        |
| `%bf-float-{start, end, none}`                                                                 | `float`, using the logical `inline-start` and `inline-end`                                    |
| `%bf-clearfix`                                                                                 | Makes a container grow to hold the floats inside it                                           |
| `%bf-vertical-align-{baseline, top, middle, bottom, text-top, text-bottom}`                    | `vertical-align`                                                                              |
| `%bf-object-fit-{contain, cover, fill, scale, none}`                                           | How an image or video fills its box. `scale` is `scale-down`                                  |
| `%bf-aspect-ratio-{1x1, 4x3, 16x9, 21x9}`                                                      | `aspect-ratio`. Add or change ratios with `$sassy-aspect-ratio`                               |
| `%bf-pointer-events-{auto, none}`, `%bf-user-select-{all, auto, none}`                         | Whether an element takes clicks, and how its text is selected                                 |
| `%bf-height-{5pc-100pc, auto}`, `%bf-height-{5vh-100vh}`                                       | Height as a percentage of the parent, or of the viewport                                      |
| `%bf-min-width-{0, 5pc-100pc, 5vw-100vw, auto}`, `%bf-min-height-{5pc-100pc, 5vh-100vh, auto}` | Minimum sizes. `%bf-min-width-0` lets a flex or grid item shrink below its content            |
| `%bf-width-{5pc-100pc, auto}`, `%bf-width-{5vw-100vw}`                                         | Width, as a percentage of the parent, or of the viewport                                      |
| `%bf-max-width-{5pc-100pc, 5vw-100vw, none}`, `%bf-max-height-{5pc-100pc, 5vh-100vh, none}`    | Maximum width and height                                                                      |
| `%bf-max-width-{sm, md, lg, xl, 2xl, 3xl}`                                                     | Maximum width of a breakpoint, from `$sassy-breakpoints`                                      |
| `%bf-max-width-text`                                                                           | A readable line length, `--sassy-text-max-width` (`65ch`)                                     |
| `%bf-m-{centre}`, `%bf-mt-…`, `%bf-me-…`, `%bf-mb-…`, `%bf-ms-…`, `%bf-mx-…`, `%bf-my-…`       | Margin, from `auto` or `0` to `32`, or `n1` to `n32` for negative                             |
| `%bf-p-…`, `%bf-pt-…`, `%bf-pe-…`, `%bf-pb-…`, `%bf-ps-…`, `%bf-px-…`, `%bf-py-…`              | Padding, from `inherit` or `0` to `32`                                                        |
| `%bf-scroll-pt-{0-32}`                                                                         | Scroll padding at the top, on the padding scale up to `8rem`, for a sticky header             |

Margin, padding and offset steps go up to `$sassy-spacing-max` (`32`), in multiples of `$sassy-margin-unit` and `$sassy-padding-unit`, so `%bf-p-4` is `4 × 0.25rem`, or `1rem`; offsets use the padding unit. Sizes end in their unit, and every percentage ends in `pc`. Sides use `t`, `e`, `b` and `s`, but offsets, which name the edge, use `top`, `right`, `bottom` and `left`.

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
    @extend %bf-width-100pc
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
