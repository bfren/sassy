# 1-forms: form controls and validation

Live examples: [https://bfren.github.io/sassy/1-forms.html](https://bfren.github.io/sassy/1-forms.html)

`src/1-forms` styles form controls: labels, text inputs, selects, checks, radios, switches, input groups, floating labels, range sliders, file and colour inputs, and validation. Each control reads its colours, sizes and spacing from custom properties, so a theme can change them at runtime.

Forms are composites, so they output before the grid and utilities. A single-purpose utility such as `%bf-mb-3` always overrides a form placeholder's margin.

## Placeholders

| Placeholder                                                  | For                                                                    |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `%bf-form-label`                                             | A label above a control                                                |
| `%bf-form-text`                                              | Help text under a control                                              |
| `%bf-form-control`, `-small`, `-large`, `-plaintext`         | Text inputs and textareas. `-plaintext` shows a value without a border |
| `%bf-form-select`, `-small`, `-large`                        | Selects                                                                |
| `%bf-form-check`, `%bf-form-check-inline`                    | A checkbox or radio and its label, as a block or inline                |
| `%bf-form-check-input`                                       | The checkbox or radio itself                                           |
| `%bf-form-check-label`                                       | The label beside a checkbox or radio                                   |
| `%bf-form-switch`                                            | A checkbox shown as a switch                                           |
| `%bf-input-group`, `-small`, `-large`                        | A group of controls and add-ons, joined side by side                   |
| `%bf-input-group-text`                                       | Add-on text inside an input group                                      |
| `%bf-form-floating`                                          | A control with its label floating inside it                            |
| `%bf-form-range`                                             | A range slider (`type="range"`)                                        |
| `%bf-form-file`                                              | A file input (`type="file"`)                                           |
| `%bf-form-colour`                                            | A colour picker (`type="color"`)                                       |
| `%bf-form-control-valid`, `%bf-form-control-invalid`         | A validation state set explicitly                                      |
| `%bf-form-feedback-valid`, `%bf-form-feedback-invalid`       | Validation messages                                                    |

Form placeholders have no breakpoint variants.

Sizes are `small` and `large`, not `sm` and `lg`, which are breakpoints. A size only changes custom properties, so extend it alongside the base placeholder: `%bf-form-control` and `%bf-form-control-small`. A size also works on any control, and on an input group, where everything inside follows it.

## Worked examples

### A labelled text field with help text

```sass
@use "sassy/src" as sassy

.field
    @extend %bf-mb-3

    label
        @extend %bf-form-label

    input
        @extend %bf-form-control

    .field-text
        @extend %bf-form-text
```

```html
<div class="field">
    <label for="name">Name</label>
    <input type="text" id="name" />
    <div class="field-text">Your full name, as it appears on your passport.</div>
</div>
```

```css
.field {
  margin-bottom: 0.75rem;
}
.field label {
  display: inline-block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.field input {
  display: block;
  width: 100%;
  /* …other control rules */
}
```

### A small control

Extend the size placeholder as well as the base placeholder, on any control:

```sass
.compact
    input
        @extend %bf-form-control
        @extend %bf-form-control-small

    select
        @extend %bf-form-select
        @extend %bf-form-select-small
```

### Checkboxes and radios

Put the input first, then the label, and any help text after them, inside the element that extends `%bf-form-check`. Long labels wrap beside the input, and help text lines up under the label:

```sass
.check
    @extend %bf-form-check

    input
        @extend %bf-form-check-input

    label
        @extend %bf-form-check-label
```

```html
<div class="check">
    <input type="checkbox" id="news" />
    <label for="news">Send me the newsletter</label>
    <div class="field-text">About once a month.</div>
</div>
```

For checks that sit side by side, extend `%bf-form-check-inline` on the wrapper instead.

### A switch

Extend `%bf-form-switch` on a checkbox with `role="switch"`, so assistive technology announces it as a switch:

```sass
.toggle
    @extend %bf-form-switch
```

```html
<input type="checkbox" role="switch" id="notify" class="toggle" />
<label for="notify">Notifications</label>
```

### Input groups

The group holds the controls and add-ons directly. Put feedback after the group, not inside it, so it shows when any control in the group is invalid:

```sass
.search
    @extend %bf-input-group

    input
        @extend %bf-form-control

    span
        @extend %bf-input-group-text
```

```sass
.search-feedback
    @extend %bf-form-feedback-invalid
```

```html
<div class="search">
    <span>£</span>
    <input type="number" id="amount" required aria-invalid="true" />
    <button type="button">Add</button>
</div>
<div class="search-feedback">Enter an amount in pounds.</div>
```

### Floating labels

The control comes first and the label after it, and the control needs `placeholder=" "`. An empty placeholder is how CSS tells that the control has no value:

```sass
.floating
    @extend %bf-form-floating

    input
        @extend %bf-form-control
```

```html
<div class="floating">
    <input type="email" id="email" placeholder=" " />
    <label for="email">Email address</label>
</div>
```

### Range, file and colour inputs

```sass
.slider
    @extend %bf-form-range

.upload
    @extend %bf-form-file

.swatch
    @extend %bf-form-colour
```

Their colours come from `--sassy-range-*`, `--sassy-input-*` and `--sassy-theme-primary`. Each browser has its own pseudo-elements for these controls, which Sassy sets separately for each one.

### Validation

There are three ways to show that a control is invalid:

1. **The browser's own check.** `:user-invalid` applies once someone has interacted with the field. Nothing to add in markup beyond `required`, `type` and so on.
2. **The server's result.** Set `aria-invalid="true"` on the control. Screen readers announce it too, so use this for errors found on the server.
3. **An explicit state.** Extend `%bf-form-control-invalid` or `%bf-form-control-valid`, for example from a script that knows the result.

Feedback follows the control as a sibling. Invalid feedback is hidden until the control before it is invalid, so you can render it up front. Valid feedback always shows, so render it only when the field is valid:

```sass
.field
    input
        @extend %bf-form-control

    .error
        @extend %bf-form-feedback-invalid

    .ok
        @extend %bf-form-feedback-valid
```

```html
<div class="field">
    <input type="email" id="email" required aria-invalid="true" />
    <div class="error">Please enter a valid email address.</div>
</div>
```

The same placeholder works after an input group, because the feedback looks for an invalid control inside the element before it.

### Select chevron in a dark theme

Selects draw their chevron as an SVG image, which cannot read custom properties. If you change `--sassy-input-colour`, set `--sassy-select-chevron` to match with `chevron()`, which takes a Sass colour, not `var()`:

```sass
@use "sassy/src" as sassy

@media (prefers-color-scheme: dark)
    :root
        --sassy-input-colour: #{sassy.colour("grey", 100)}
        --sassy-select-chevron: #{sassy.chevron(sassy.colour("grey", 100))}
```

## Settings and custom properties

Every form value is a custom property on `:root`, so you can change it per site, per section or at runtime. The main groups:

| Property                                                                  | Controls                                                  |
| ------------------------------------------------------------------------- | --------------------------------------------------------- |
| `--sassy-input-font-size`, `--sassy-input-line-height`                    | Text size and line height in controls                     |
| `--sassy-input-padding-x`, `--sassy-input-padding-y`, `--sassy-input-radius` | Spacing and corner radius                              |
| `--sassy-input-bg`, `--sassy-input-colour`                                | Background and text colour                                |
| `--sassy-input-border-width`, `--sassy-input-border-colour`               | Borders                                                   |
| `--sassy-input-placeholder-colour`, `--sassy-form-text-colour`            | Placeholder and help text                                 |
| `--sassy-input-disabled-bg`, `--sassy-input-readonly-bg`                  | Disabled and read-only backgrounds                        |
| `--sassy-input-focus-colour`, `--sassy-input-focus-ring`                  | Focus ring                                                |
| `--sassy-input-valid-colour`, `--sassy-input-invalid-colour`              | Validation colours                                        |
| `--sassy-input-addon-bg`, `--sassy-input-addon-hover-bg`                  | Input group add-ons                                       |
| `--sassy-check-checked-colour`, `--sassy-check-mark-colour`, `--sassy-check-radius` | Checks and radios                                |
| `--sassy-switch-knob-colour`                                              | Switch knob                                               |
| `--sassy-floating-height`, `--sassy-floating-padding-y`                   | Floating labels                                           |
| `--sassy-range-track-colour`, `--sassy-range-track-height`, `--sassy-range-thumb-colour`, `--sassy-range-thumb-size`, `--sassy-range-disabled-colour` | Range sliders |
| `--sassy-select-chevron`                                                  | The select's chevron image (use `chevron()`)              |

The sizes `small` and `large` are defined in `$sassy-input-sizes` in [`src/1-forms/_100-variables.scss`](../src/1-forms/_100-variables.scss), and the check and switch shapes in `$sassy-check-tick`, `$sassy-check-dash` and `$sassy-check-dot`.

Colours accept any CSS colour, including `oklch()`, `rgb()` and another custom property. The exception is the chevron, which must be an SVG built with `chevron()`.

## Limitations

- **Customisable selects are not yet supported.** `appearance: base-select` gives full control over the open list, but it is not yet in Firefox or Safari.
- **Open select lists** can use a different font in some browsers. Firefox on desktop is one under review. Browsers that draw the list with their native menu ignore the option font.
- The [README](../README.md#limitations) lists the browser features Sassy relies on.
