# Badges

[1-components](README.md) - live examples: [Badges](https://bfren.github.io/sassy/1-components.html#badges)

A badge is a small label, sized from the text around it, so it fits a heading or a button as well as a sentence. It is grey by default. Colour it with `%bf-text-bg-{theme}` or `%bf-text-bg-{colour}-{shade}`, which choose a text colour that contrasts, and round it into a pill with `%bf-rounded-pill`:

```sass
.badge
    @extend %bf-badge

.badge-new
    @extend %bf-badge
    @extend %bf-text-bg-primary
    @extend %bf-rounded-pill

.badge-count
    @extend %bf-badge
    @extend %bf-badge-count
    @extend %bf-text-bg-error
    @extend %bf-rounded-pill
```

```css
@layer sassy.base.components {
  .badge-count, .badge-new, .badge {
    background-color: var(--sassy-badge-bg, var(--sassy-theme-grey-dark));
    color: var(--sassy-badge-colour, var(--sassy-theme-grey-dark-contrast));
    display: inline-block;
    font-size: var(--sassy-badge-font-size, 0.75em);
    padding: var(--sassy-badge-padding-y, 0.35em) var(--sassy-badge-padding-x, 0.65em);
  }
  .badge-count:empty, .badge-new:empty, .badge:empty {
    display: none;
  }
  .badge-count {
    inset-block-start: 0;
    inset-inline-start: 100%;
    position: absolute;
    translate: -50% -50%;
  }
  :where(*:has(> .badge-count)) {
    position: relative;
  }
}
```

```html
<h2>Releases <span class="badge-new">New</span></h2>

<button type="button" class="button">
    Inbox
    <span class="badge-count">4 <span class="visually-hidden">unread messages</span></span>
</button>
```

- **`%bf-badge-count` places the badge on the top end corner** of its parent, half outside it, and makes the parent `position: relative` itself, with no specificity, so it needs nothing else.
- **A count needs words for screen readers.** "4" on its own means nothing when read aloud, so add the rest in a `%bf-visually-hidden` span, or put it in the parent's `aria-label`.
- **An empty badge is hidden**, so a count that drops to nothing disappears without any script.
- **A badge is text, not a control.** To make one a link or a button, put the badge inside the link or button.

## Settings and custom properties

| Property                                                                     | Controls                                                               |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `--sassy-badge-bg`, `--sassy-badge-colour`, `--sassy-badge-font-size`        | Badge colours and text size - `%bf-text-bg-*` sets the colours instead |
| `--sassy-badge-padding-y`, `--sassy-badge-padding-x`, `--sassy-badge-radius` | Badge spacing and corners - `%bf-rounded-pill` makes a pill            |
