# 2-forms: form controls and validation

Live examples: [https://bfren.github.io/sassy/2-forms.html](https://bfren.github.io/sassy/2-forms.html)

`src/2-forms` styles form controls: labels, text inputs, selects, checks, radios, switches, input groups, floating labels, range sliders, file and colour inputs, and validation. Each control reads its colours, sizes and spacing from custom properties, so a theme can change them at runtime.

Forms are composites, so they output before the grid and utilities, and after components, as an input group styles the buttons inside it. A single-purpose utility such as `%bf-mb-3` always overrides a form placeholder's margin.

## Pages

- [Labels and help text](210-label.md)
- [Text inputs](220-control.md)
- [Selects](230-select.md)
- [Checkboxes and radios](240-check.md)
- [Switches](250-switch.md)
- [Input groups](260-input-group.md)
- [Floating labels](270-floating.md)
- [Range, file and colour inputs](280-inputs.md)
- [Validation](290-validation.md)

## Placeholders

| Placeholder                                            | For                                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `%bf-form-label`                                       | A label above a control                                                |
| `%bf-form-text`                                        | Help text under a control                                              |
| `%bf-form-control`, `-small`, `-large`, `-plaintext`   | Text inputs and textareas. `-plaintext` shows a value without a border |
| `%bf-form-select`, `-small`, `-large`                  | Selects                                                                |
| `%bf-form-check`, `%bf-form-check-inline`              | A checkbox or radio and its label, as a block or inline                |
| `%bf-form-check-input`                                 | The checkbox or radio itself                                           |
| `%bf-form-check-label`                                 | The label beside a checkbox or radio                                   |
| `%bf-form-switch`                                      | A checkbox shown as a switch                                           |
| `%bf-input-group`, `-small`, `-large`                  | A group of controls and add-ons, joined side by side                   |
| `%bf-input-group-text`                                 | Add-on text inside an input group                                      |
| `%bf-form-floating`                                    | A control with its label floating inside it                            |
| `%bf-form-range`                                       | A range slider (`type="range"`)                                        |
| `%bf-form-file`                                        | A file input (`type="file"`)                                           |
| `%bf-form-colour`                                      | A colour picker (`type="color"`)                                       |
| `%bf-form-control-valid`, `%bf-form-control-invalid`   | A validation state set explicitly                                      |
| `%bf-form-feedback-valid`, `%bf-form-feedback-invalid` | Validation messages                                                    |

Form placeholders have no breakpoint variants.

Sizes are `small` and `large`, not `sm` and `lg`, which are breakpoints. A size only changes custom properties, so extend it alongside the base placeholder: `%bf-form-control` and `%bf-form-control-small`. A size also works on any control, and on an input group, where everything inside follows it.

## Settings and custom properties

Every form value is a custom property, so you can change it per site, per section or at runtime. Its default is the fallback in the `var()` that reads it, so it is only in your CSS when you extend a control that uses it. The main groups:

| Property                                                                                                                                              | Controls                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `--sassy-input-font-size`, `--sassy-input-line-height`                                                                                                | Text size and line height in controls        |
| `--sassy-input-padding-x`, `--sassy-input-padding-y`, `--sassy-input-radius`                                                                          | Spacing and corner radius                    |
| `--sassy-input-bg`, `--sassy-input-colour`                                                                                                            | Background and text colour                   |
| `--sassy-input-border-width`, `--sassy-input-border-colour`                                                                                           | Borders                                      |
| `--sassy-input-placeholder-colour`, `--sassy-form-text-colour`                                                                                        | Placeholder and help text                    |
| `--sassy-input-disabled-bg`, `--sassy-input-readonly-bg`                                                                                              | Disabled and read-only backgrounds           |
| `--sassy-input-focus-colour`, `--sassy-input-focus-ring`                                                                                              | Focus ring                                   |
| `--sassy-input-valid-colour`, `--sassy-input-invalid-colour`                                                                                          | Validation colours                           |
| `--sassy-input-addon-bg`, `--sassy-input-addon-hover-bg`                                                                                              | Input group add-ons                          |
| `--sassy-check-checked-colour`, `--sassy-check-mark-colour`, `--sassy-check-radius`                                                                   | Checks and radios                            |
| `--sassy-switch-knob-colour`                                                                                                                          | Switch knob                                  |
| `--sassy-floating-height`, `--sassy-floating-padding-y`                                                                                               | Floating labels                              |
| `--sassy-range-track-colour`, `--sassy-range-track-height`, `--sassy-range-thumb-colour`, `--sassy-range-thumb-size`, `--sassy-range-disabled-colour` | Range sliders                                |
| `--sassy-select-chevron`                                                                                                                              | The select's chevron image (use `chevron()`) |

The sizes `small` and `large` are defined in `$sassy-input-sizes` in [`src/2-forms/_200-variables.scss`](../../src/2-forms/_200-variables.scss), and the check and switch shapes in `$sassy-check-tick`, `$sassy-check-dash` and `$sassy-check-dot`.

Colours accept any CSS colour, including `oklch()`, `rgb()` and another custom property. The exception is the chevron, which must be an SVG built with `chevron()`.

## Limitations

- **Customisable selects are not yet supported.** `appearance: base-select` gives full control over the open list, but it is not yet in Firefox or Safari.
- **Open select lists** can use a different font in some browsers. Firefox on desktop is one under review. Browsers that draw the list with their native menu ignore the option font.
- The [README](../../README.md#limitations) lists the browser features Sassy relies on.
