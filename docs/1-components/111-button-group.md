# Button groups

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

A button group joins buttons into one row: they share their borders, and only the group's outer corners are rounded. A toolbar holds groups, with a gap between them:

```sass
.group
    @extend %bf-btn-group

.toolbar
    @extend %bf-btn-toolbar

.button
    @extend %bf-btn
```

```css
@layer sassy.base.components {
  .group {
    display: inline-flex;
    flex-direction: row;
  }
  .group > :not(:first-child) {
    margin-inline-start: calc(var(--sassy-input-border-width, 1px) * -1);
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
  .group > :not(:last-child) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sassy-btn-toolbar-gap, 0.5rem);
  }
}
```

```html
<div class="toolbar" role="toolbar" aria-label="Formatting">
    <div class="group" role="group" aria-label="Style">
        <button type="button" class="button" aria-pressed="true">Bold</button>
        <button type="button" class="button" aria-pressed="false">Italic</button>
    </div>
    <div class="group" role="group" aria-label="History">
        <button type="button" class="button">Undo</button>
        <button type="button" class="button">Redo</button>
    </div>
</div>
```

- **Give a group `role="group"` and an `aria-label`**, so screen readers announce what its buttons are for.
- **A toolbar is one stop in the tab order.** With `sassy.js`, Tab moves into a toolbar and out again in one step, and the arrow keys, Home and End move between its controls. Set `aria-orientation="vertical"` on a vertical toolbar, so the up and down keys move instead. Arrow keys in a text field or list still move its caret or choice.
- **Size every button in a group at once** with `%bf-btn-group-small` or `%bf-btn-group-large`, and **stack them** with `%bf-btn-group-vertical` instead of `%bf-btn-group`.
- **The button being used sits above its neighbours**, so its border and focus ring show in full.

## Settings and custom properties

| Property                  | Controls                              |
| ------------------------- | ------------------------------------- |
| `--sassy-btn-toolbar-gap` | Space between the groups in a toolbar |
