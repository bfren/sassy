# Tabs

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

Tabs follow the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), as Bootstrap's do: `role="tablist"` on the list, `role="tab"` on each button with `aria-controls` naming its panel, and `role="tabpanel"` on each panel with `aria-labelledby` naming its tab:

```sass
.tab-list
    @extend %bf-tabs

    [role="tab"]
        @extend %bf-tab

.tab-panel
    @extend %bf-tab-panel
```

```html
<div class="tab-list" role="tablist" aria-label="Delivery options">
    <button type="button" role="tab" id="tab-standard" aria-controls="panel-standard" aria-selected="true">Standard</button>
    <button type="button" role="tab" id="tab-express" aria-controls="panel-express">Express</button>
</div>
<div class="tab-panel" role="tabpanel" id="panel-standard" aria-labelledby="tab-standard" tabindex="0">
    <p>Delivered in three to five working days.</p>
</div>
<div class="tab-panel" role="tabpanel" id="panel-express" aria-labelledby="tab-express" tabindex="0">
    <p>Delivered the next working day.</p>
</div>
```

When the page loads, `sassy.js` selects the tab with `aria-selected="true"`, or the first, and hides the other panels with the `hidden` attribute. So without the script every panel stays visible, and nothing is lost. Then:

- clicking a tab selects it
- Left and Right move to the previous and next tab, wrapping round, and Home and End move to the first and last
- only the selected tab is in the tab order, so Tab moves from it into its panel

For a vertical list, add `aria-orientation="vertical"` to the tab list, and Up and Down move between the tabs instead. A tab with `disabled` or `aria-disabled="true"` is skipped.

`tabindex="0"` on each panel lets keyboard users reach it when it contains nothing else that can be focused.

## Settings and custom properties

| Property                                                                                  | Controls                                                  |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `--sassy-tabs-border-width`, `--sassy-tabs-border-colour`, `--sassy-tabs-underline-width` | The line under the tabs, and the selected tab's underline |
| `--sassy-tab-panel-padding-y`                                                             | Space above and below a panel's content                   |
