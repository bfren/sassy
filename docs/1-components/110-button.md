# Buttons

[1-components](README.md) - live examples: [Buttons](https://bfren.github.io/sassy/1-components.html#buttons)

A button uses the form controls' padding, font size, line height, border and corners, so it lines up with the inputs beside it. Theme colours, outline and size only change custom properties, so extend them alongside `%bf-btn`:

```sass
@use "sassy/src" as sassy

.button
    @extend %bf-btn

.button-save
    @extend %bf-btn-primary

.button-cancel
    @extend %bf-btn-error
    @extend %bf-btn-outline
```

```html
<button type="submit" class="button button-save">Save changes</button>
<button type="button" class="button button-cancel">Discard</button>
<a href="/help" class="button">Help</a>
```

```css
@layer sassy.base.components {
  .button {
    align-items: center;
    background-color: var(--sassy-btn-bg, var(--sassy-surface));
    border: var(--sassy-input-border-width, 1px) solid var(--sassy-btn-border-colour, var(--sassy-line-strong));
    border-radius: var(--sassy-input-radius, var(--sassy-radius, 0.375rem));
    color: var(--sassy-btn-colour, var(--sassy-body-colour));
    display: inline-flex;
    padding: var(--sassy-input-padding-y, 0.375rem) var(--sassy-input-padding-x, 0.75rem);
  }
  .button:hover {
    background-color: color-mix(in oklab, var(--sassy-btn-bg, var(--sassy-surface)) 88%, var(--sassy-btn-shade, #000));
  }
  .button-save {
    --sassy-btn-bg: var(--sassy-theme-primary);
    --sassy-btn-border-colour: var(--sassy-theme-primary);
    --sassy-btn-colour: var(--sassy-btn-primary-colour, #fff);
    --sassy-btn-focus-colour: var(--sassy-theme-primary);
    --sassy-btn-outline-colour: var(--sassy-theme-primary);
  }
}
```

Hover and press darken whatever colour the button is, by mixing `--sassy-btn-shade` into it, so a theme colour changed at runtime keeps its hover state. Outlined buttons in the light theme colours mix their colour with the dark text colour, so the text stays readable.

- **Use `<button>` for actions and `<a>` for links to other pages**, even when they look the same, so keyboards and screen readers treat them correctly. Give a `<button>` a `type`: inside a form it submits by default.
- **Disable with the `disabled` attribute**, or `aria-disabled="true"` on a link, and the button fades and ignores clicks.
- **A toggle button that is on has `aria-pressed="true"`**, and looks pressed. Set it to `"false"` when it is off.
- **In an input group**, a button joins the controls beside it, as an add-on does, and follows the group's size.

The text colour on each theme colour is chosen for contrast with the default theme: dark text on `info`, `warn` and `grey-light`, white on the rest. If you change a theme colour, check its text still contrasts, and change it with `--sassy-btn-<name>-colour` if not - for example `--sassy-btn-primary-colour`.

## Settings and custom properties

| Property                                                            | Controls                                                                           |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `--sassy-btn-bg`, `--sassy-btn-colour`, `--sassy-btn-border-colour` | The default button's background, text and border - the theme colours set their own |
| `--sassy-btn-<name>-colour`                                         | Text on each theme colour's button, for example `--sassy-btn-warn-colour`          |
| `--sassy-btn-outline-colour`, `--sassy-btn-focus-colour`            | The outline style's colour, and the focus ring                                     |
| `--sassy-btn-font-weight`, `--sassy-btn-shade`                      | Text weight, and the colour mixed in on hover and press                            |
