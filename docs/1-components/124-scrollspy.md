# Scrollspy

[1-components](README.md) - live examples: [Scrollspy](https://bfren.github.io/sassy/1-components.html#scrollspy)

A nav of links to sections of the page can follow the reading position. Give one of its links `aria-current="location"`, usually the first, and `sassy.js` then moves it to the link of the section in view as the page scrolls. Any nav, [list group](131-list-group.md) or [dropdown](152-dropdown.md) shows that link as current, so scrollspy needs no Sass of its own:

```html
<nav class="menu menu-vertical" aria-label="On this page">
    <a href="#install" aria-current="location">Install</a>
    <a href="#use">Use</a>
    <a href="#help">Help</a>
</nav>
```

- **The section in view** is the last one whose top has scrolled past a line a quarter of the way down the window. Move the line with `--sassy-scrollspy-offset` on the nav, as a percentage of the height, or in `px` or `rem`. At the very bottom of the page, the last section is in view, even if it is short.
- **The links are found** in the nearest `<nav>`, `<ul>` or `<ol>` around the marked link, and each must point to an `id` on the page. If the sections are in a box that scrolls rather than the page, `sassy.js` follows that box, and its links scroll only the box rather than moving the page as well.
- **To keep the nav in sight** while the page scrolls, extend `%bf-position-sticky` with an offset such as `%bf-top-4`, or put it beside a box that scrolls.
- **Add it to the page later?** Call `Sassy.init(element)` on the element that contains it.

## Settings and custom properties

| Property                   | Controls                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `--sassy-scrollspy-offset` | How far down the window a section must scroll to be current (25%) - read by `sassy.js` |
