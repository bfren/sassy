# Accordions

[1-components](README.md) - live examples: [Accordions](https://bfren.github.io/sassy/1-components.html#accordions)

An accordion is a `<div>` of native `<details>`, so the browser opens and closes each section, from the keyboard too, with no script. Each `<details>` holds a `<summary>`, the header, and one element with its content. Give them the same `name` and opening one closes the others:

```sass
.accordion
    @extend %bf-accordion
```

```css
@layer sassy.base.components {
  .accordion {
    border: var(--sassy-accordion-border-width, 1px) solid var(--sassy-accordion-border-colour, var(--sassy-line));
    interpolate-size: allow-keywords;
  }
  .accordion > details[open] > summary {
    background-color: var(--sassy-accordion-open-bg, color-mix(in oklab, var(--sassy-theme-primary) 10%, var(--sassy-accordion-bg, var(--sassy-surface))));
    color: var(--sassy-accordion-open-colour, color-mix(in oklab, var(--sassy-theme-primary) 60%, currentColor));
  }
  .accordion > details::details-content {
    block-size: 0;
    overflow: clip;
  }
}
```

```html
<div class="accordion">
    <details name="faq" open>
        <summary>What is an accordion?</summary>
        <div>A stack of sections, each with a header that opens and closes it.</div>
    </details>
    <details name="faq">
        <summary>Does it need a script?</summary>
        <div>No.</div>
    </details>
</div>
```

- **Put each section's content in one element** after the `<summary>`, which gets the padding. Several elements would each be padded.
- **Leave out `name`** to let several sections be open at once, and add `open` to one that should start open.
- **Opening and closing are animated where browsers support `::details-content`**, and instant elsewhere and for people who prefer reduced motion.
- **An open header is tinted with primary**, its text mixed with the text colour so it keeps its contrast. Change it with `--sassy-accordion-open-bg` and `--sassy-accordion-open-colour`.
- **Extend `%bf-accordion-flush` as well** for an accordion inside a card, or anywhere it should have no outer border.

## Settings and custom properties

| Property                                                                                   | Controls                                                 |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `--sassy-accordion-bg`, `--sassy-accordion-colour`, `--sassy-accordion-radius`             | Accordion background, text and corners                   |
| `--sassy-accordion-border-width`, `--sassy-accordion-border-colour`                        | The lines around and between the sections                |
| `--sassy-accordion-padding-y`, `--sassy-accordion-padding-x`                               | Header and content padding                               |
| `--sassy-accordion-hover-bg`, `--sassy-accordion-open-bg`, `--sassy-accordion-open-colour` | A header under the pointer, and an open section's header |
