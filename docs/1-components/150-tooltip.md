# Tooltips

[1-components](README.md) - live examples: [Tooltips](https://bfren.github.io/sassy/1-components.html#tooltips)

A tooltip is a popover with `role="tooltip"`, linked to its trigger by `aria-describedby`:

```sass
.tip
    @extend %bf-tooltip
```

```html
<button type="button" aria-describedby="tip-save">Save</button>
<div class="tip" role="tooltip" popover="manual" id="tip-save">Saves your changes to this device</div>
```

`sassy.js` shows the tooltip when the pointer is over the trigger or the trigger has keyboard focus, and hides it when they leave or when Escape is pressed. The pointer can move from the trigger onto the tooltip without it closing, so its text can be selected. One tooltip can describe several triggers.

CSS anchor positioning places the tooltip above its trigger, or below if there is no room above. In browsers without anchor positioning, `sassy.js` places it instead.

Use `popover="manual"` rather than `popover`, so that showing a tooltip does not close another popover that is open, such as a menu.

A tooltip should be a short description of something that already has a name. Touch screens have no hover, so do not put anything people need only in a tooltip.

## Settings and custom properties

| Property                                                                                                        | Controls                              |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `--sassy-tooltip-bg`, `--sassy-tooltip-colour`, `--sassy-tooltip-font-size`                                     | Tooltip colours and text size         |
| `--sassy-tooltip-padding-y`, `--sassy-tooltip-padding-x`, `--sassy-tooltip-radius`, `--sassy-tooltip-max-width` | Tooltip shape and size                |
| `--sassy-tooltip-offset`                                                                                        | Gap between a tooltip and its trigger |
