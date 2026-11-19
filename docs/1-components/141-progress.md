# Progress bars

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

A progress bar is a native `<progress>`, so browsers and screen readers already know its value. Give it a `<label for>` or `aria-label`. A theme colour changes the bar, and a bar with no `value` is indeterminate: a shorter bar slides along the track until you set one:

```sass
.progress
    @extend %bf-progress

.progress-ok
    @extend %bf-progress-ok

.progress-animated
    @extend %bf-progress-animated
```

```css
@layer sassy.base.components {
  .progress {
    appearance: none;
    background-color: var(--sassy-progress-bg, var(--sassy-line));
    block-size: var(--sassy-progress-height, 1rem);
    border-radius: var(--sassy-progress-radius, var(--sassy-radius, 0.375rem));
  }
  .progress::-webkit-progress-value {
    background-color: var(--sassy-progress-bar-colour, var(--sassy-theme-primary));
  }
  .progress::-moz-progress-bar {
    background-color: var(--sassy-progress-bar-colour, var(--sassy-theme-primary));
  }
  .progress-ok {
    --sassy-progress-bar-colour: var(--sassy-theme-ok);
  }
}
```

```html
<label for="upload">Uploading</label>
<progress class="progress progress-ok progress-animated" id="upload" value="30" max="100">30%</progress>
<progress class="progress" aria-label="Loading"></progress>
```

To show several parts of a whole in one track, put a `<progress>` for each in a `<div>` that extends `%bf-progress-stacked`. Each one is full (`value="1" max="1"`) and its width is its share:

```html
<div class="progress-stacked" role="group" aria-label="Storage">
    <progress class="progress" value="1" max="1" style="width: 15%" aria-label="Photos, 15%"></progress>
    <progress class="progress progress-ok" value="1" max="1" style="width: 30%" aria-label="Music, 30%"></progress>
</div>
```

- **The text inside `<progress>` is a fallback**, shown only by browsers that don't support it, so put the value in its label too if people need the number.
- **Light theme colours are hard to see on the track.** `info`, `warn`, `grey-light` and `ok` have less than 3:1 contrast with the default grey track, so show the value as text beside those bars, or set a darker `--sassy-progress-bg`.
- **The moving parts slow down, rather than stop, for people who prefer reduced motion**, so the bar still shows that something is happening.
- **Browsers draw the bar with their own pseudo-elements**, `::-webkit-progress-value` in Chrome and Safari and `::-moz-progress-bar` in Firefox, so to restyle it, set the `--sassy-progress-*` properties rather than writing your own rules.

## Settings and custom properties

| Property                                                                                                   | Controls                                                  |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `--sassy-progress-height`, `--sassy-progress-bg`, `--sassy-progress-bar-colour`, `--sassy-progress-radius` | Progress track height, track and bar colours, and corners |
| `--sassy-progress-margin-bottom`                                                                           | Space below a progress bar or stacked bars                |
