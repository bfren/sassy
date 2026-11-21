# Offcanvas

[1-components](README.md) - live examples: [Offcanvas](https://bfren.github.io/sassy/1-components.html#offcanvas)

An offcanvas is a [dialog](153-dialog.md) that slides in from one edge of the window, full height or full width, such as a menu or a basket. Extend `%bf-offcanvas-start`, `-end`, `-top` or `-bottom` with `%bf-dialog`, and use the dialog's header, title, body and footer inside it:

```sass
.offcanvas-start
    @extend %bf-offcanvas-start
```

```css
@layer sassy.base.components {
  .offcanvas-start {
    --sassy-offcanvas-from: -100% 0;
    inset: auto;
    inset-inline-start: 0;
    translate: var(--sassy-offcanvas-from);
  }
  [open].offcanvas-start {
    animation: bf-offcanvas-slide var(--sassy-offcanvas-duration, 0.3s) ease-in-out;
    translate: none;
  }
}
```

```html
<button type="button" commandfor="menu" command="show-modal">Menu</button>

<dialog class="dialog offcanvas-start" id="menu" closedby="any" aria-labelledby="menu-title">
    <header>
        <h2 id="menu-title">Menu</h2>
        <button type="button" class="close" commandfor="menu" command="close" aria-label="Close"></button>
    </header>
    <div class="dialog-body">
        <p>…</p>
    </div>
</dialog>
```

- **It is a modal dialog**, so the browser puts it over a backdrop, makes the page behind it inert, closes it on Escape, and returns focus to the button that opened it. The page behind it does not scroll.
- **`closedby="any"` closes it when the backdrop is clicked.** `sassy.js` does this in browsers that don't support `closedby` yet. It also closes the offcanvas when a link in it to a section of the page outside it is followed, so a nav in an offcanvas shows the section it goes to.
- **It slides in and out**, and the backdrop fades. With reduced motion it appears at once. `--sassy-offcanvas-width` sets the width of a start or end offcanvas, and `--sassy-offcanvas-height` the height of a top or bottom one.
- **Start and end follow the text direction**, so in right-to-left text a start offcanvas comes in from the right.

## In the page from a breakpoint

With `%bf-offcanvas-{breakpoint}` as well, a closed offcanvas is part of the page from that breakpoint up - a sidebar on wide screens that is an offcanvas on narrow ones. It loses its backdrop styles, shadow and border, and its `command="close"` buttons are hidden. Hide the button that opens it at the same breakpoint, with `%bf-d-none-{breakpoint}`:

```sass
.offcanvas-md
    @extend %bf-offcanvas-md
```

```css
@layer sassy.base.components {
  @media (width >= 768px) {
    .offcanvas-md:not(:modal) {
      display: flex;
      position: static;
    }
    .offcanvas-md:not(:modal) button[command=close] {
      display: none;
    }
  }
}
```

```html
<button type="button" class="d-none-md" commandfor="filters" command="show-modal">Filters</button>

<dialog class="dialog offcanvas-start offcanvas-md" id="filters" closedby="any" aria-labelledby="filters-title">
    …
</dialog>
```

If the window is widened while the offcanvas is open, it stays a modal until it is closed.

## Settings and custom properties

| Property                                              | Controls                                                             |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| `--sassy-offcanvas-width`, `--sassy-offcanvas-height` | Width of a start or end offcanvas, and height of a top or bottom one |
| `--sassy-offcanvas-duration`                          | How long it takes to slide in or out                                 |
