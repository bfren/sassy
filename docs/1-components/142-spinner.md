# Spinners

[1-components](README.md) - live examples: [Spinners](https://bfren.github.io/sassy/1-components.html#spinners)

A spinner shows that something is loading: a ring that turns, or a dot that grows and fades. Put it on an element with `role="status"`, holding text for screen readers in a child that extends `%bf-visually-hidden`. Spinners are drawn in the text colour and sized in `em`, so they follow the text around them:

```sass
.spinner
    @extend %bf-spinner

.spinner-grow
    @extend %bf-spinner-grow

.spinner-small
    @extend %bf-spinner-small
```

```css
@layer sassy.base.components {
  .spinner {
    border: var(--sassy-spinner-width, 0.25em) solid var(--sassy-spinner-colour, currentColor);
    border-inline-end-color: transparent;
    animation: bf-spinner-turn 0.75s linear infinite;
    block-size: var(--sassy-spinner-size, 2em);
    border-radius: 50%;
    inline-size: var(--sassy-spinner-size, 2em);
  }
  .spinner-small {
    --sassy-spinner-size: 1em;
    --sassy-spinner-width: 0.2em;
  }
}
```

```html
<div class="spinner" role="status"><span class="visually-hidden">Loading…</span></div>
<button type="button" class="button" disabled>
    <span class="spinner spinner-small" aria-hidden="true"></span>
    Saving…
</button>
```

- **Inside a button whose text says what is happening, hide the spinner** with `aria-hidden="true"` instead of giving it `role="status"`, so screen readers don't hear it twice.
- **Colour a spinner** with `%bf-spinner-{theme colour}`, or with a text colour utility such as `%bf-c-{colour}`, as it uses the text colour.
- **Spinners slow down, rather than stop, for people who prefer reduced motion**, so they still show that something is happening.

## Settings and custom properties

| Property                                                                  | Controls                                                                      |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `--sassy-spinner-size`, `--sassy-spinner-width`, `--sassy-spinner-colour` | Spinner size, ring width and colour - the theme colours and `-small` set them |
