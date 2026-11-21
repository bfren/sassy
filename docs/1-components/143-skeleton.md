# Skeletons

[1-components](README.md) - live examples: [Skeletons](https://bfren.github.io/sassy/1-components.html#skeletons)

A skeleton is a faded block that stands in for content while it loads. It is one line of text high and drawn in the text colour, so it fits any text size and shows on any background. Give it a width with `%bf-width-{5pc-100pc}`, as an empty block has none:

```sass
.skeleton
    @extend %bf-skeleton

.width-75
    @extend %bf-width-75pc
```

```css
@layer sassy.base.components {
  .skeleton {
    background-color: var(--sassy-skeleton-colour, currentColor);
    display: inline-block;
    min-block-size: 1em;
    opacity: var(--sassy-skeleton-opacity, 0.25);
  }
}
@layer sassy.base.utilities {
  .width-75 {
    width: 75%;
  }
}
```

```html
<article class="card" aria-busy="true">
    <span class="visually-hidden">Loading…</span>
    <h3 aria-hidden="true"><span class="skeleton width-50"></span></h3>
    <p aria-hidden="true">
        <span class="skeleton width-100"></span>
        <span class="skeleton width-75"></span>
    </p>
</article>
```

- **Tell screen readers what is happening.** Put `aria-busy="true"` on the area that is loading, hide the skeletons with `aria-hidden="true"`, and add text such as "Loading…" in an element that extends `%bf-visually-hidden`. Remove `aria-busy` when the content arrives.
- **Skeletons in a line wrap like words**, so a 100% block followed by a 75% one makes two lines.
- **A shimmer crosses each skeleton**, through a mask, so it works in any colour. It does not run for people who prefer reduced motion: the blocks stay a plain shade, which still reads as loading.

## Settings and custom properties

| Property                                                                         | Controls                                          |
| -------------------------------------------------------------------------------- | ------------------------------------------------- |
| `--sassy-skeleton-colour`, `--sassy-skeleton-opacity`, `--sassy-skeleton-radius` | Skeleton colour, how faded it is, and its corners |
