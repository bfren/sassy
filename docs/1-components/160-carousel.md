# Carousels

[1-components](README.md) - live examples: [Carousels](https://bfren.github.io/sassy/1-components.html#carousels)

A carousel is a row of slides that scrolls sideways and snaps to each one. Extend `%bf-carousel` on the element that scrolls: its children are the slides. In browsers that support `::scroll-button` and `::scroll-marker`, CSS adds previous and next buttons on its edges and a row of dots under it; in others, people swipe or scroll it:

```sass
.carousel
    @extend %bf-carousel
```

```css
@layer sassy.base.components {
  .carousel {
    display: grid;
    grid-auto-flow: column;
    overflow-x: auto;
    scroll-marker-group: after;
    scroll-snap-type: x mandatory;
  }
  .carousel > * {
    scroll-snap-align: start;
  }
}
```

```html
<section aria-roledescription="carousel" aria-label="Features">
    <div class="carousel" tabindex="0">
        <div role="group" aria-roledescription="slide" aria-label="1 of 3">…</div>
        <div role="group" aria-roledescription="slide" aria-label="2 of 3">…</div>
        <div role="group" aria-roledescription="slide" aria-label="3 of 3">…</div>
    </div>
</section>
```

- **Follow the ARIA carousel pattern:** wrap it in an element with `aria-roledescription="carousel"` and an `aria-label`, and give each slide `role="group"`, `aria-roledescription="slide"` and an `aria-label` saying where it is, such as "2 of 3". The dots are named after the slides' labels.
- **`tabindex="0"`** lets people scroll it with the arrow keys in every browser; Chromium makes it focusable without it.
- **`--sassy-carousel-per-view`** sets how many slides show at once (1 by default), with `--sassy-carousel-gap` between them. Set it in a media query to show more on wider screens.
- **The previous and next buttons** are greyed out at the first and last slide, and the current dot is solid and longer than the others. The arrows are the text in `$sassy-carousel-previous` and `$sassy-carousel-next`, mirrored in right-to-left text.

## Playing by itself

Give the slides element `aria-live="off"` and an `id`, and a button with `aria-controls` naming it and `aria-pressed="false"`, and `sassy.js` moves the carousel on every `--sassy-carousel-interval` (5 seconds), back to the first slide from the last:

```html
<section aria-roledescription="carousel" aria-label="News">
    <button type="button" aria-controls="news" aria-pressed="false">Pause</button>
    <div class="carousel" id="news" aria-live="off" tabindex="0">
        …
    </div>
</section>
```

- **The button pauses it** (`aria-pressed="true"`) and starts it again. Put it first in the carousel, so keyboard users reach it before the slides. While it is paused, `sassy.js` sets `aria-live="polite"`, so screen readers read each slide people move to; while it plays they don't, so they aren't interrupted.
- **It waits** while the pointer is over the carousel, something in it has focus, or the page is hidden. With reduced motion it starts paused, and plays only if the button is pressed.
- **Add it to the page later?** Call `Sassy.init(element)` on the element that contains it.

## Settings and custom properties

| Property                                                                                         | Controls                                                           |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `--sassy-carousel-per-view`, `--sassy-carousel-gap`                                              | How many slides show at once, and the gap between them             |
| `--sassy-carousel-interval`                                                                      | How often a carousel that plays moves on (5s) - read by `sassy.js` |
| `--sassy-carousel-button-size`, `--sassy-carousel-button-offset`                                 | Size of the previous and next buttons, and their gap from the edge |
| `--sassy-carousel-button-bg`, `--sassy-carousel-button-colour`, `--sassy-carousel-button-shadow` | The buttons' background, arrow and shadow                          |
| `--sassy-carousel-marker-size`, `--sassy-carousel-marker-colour`                                 | The dots under the slides                                          |
