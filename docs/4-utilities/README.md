# 4-utilities: text, layout, colour, display, border, corners and shadow

Live examples: [https://bfren.github.io/sassy/4-utilities.html](https://bfren.github.io/sassy/4-utilities.html)

`src/4-utilities` holds the single-purpose utilities: each sets one property, or one family of related properties, to one value. They output after the composites, so they can override them. Each section below has its placeholders, examples where they combine, and the settings it reads.

Most utilities have a breakpoint variant. Add the breakpoint to the end of the name, such as `%bf-d-none` and `%bf-d-block-lg`. Breakpoint variants are not available for `%bf-body`, `%bf-wrap`, the form placeholders and `%bf-visually-hidden`. `%bf-wrap` changes its own width at each breakpoint already.

## Pages

- [Text](400-text.md)
- [Layout](410-layout.md)
- [Colour](420-colour.md)
- [Display](430-display.md)
- [Border](440-border.md)
- [Corners](450-rounded.md)
- [Shadow](460-shadow.md)

## Settings and custom properties

| Name                  | Default       | Description                                                |
| --------------------- | ------------- | ---------------------------------------------------------- |
| `$sassy-margin-unit`  | `0.25rem`     | Size of one margin step                                    |
| `$sassy-padding-unit` | `0.25rem`     | Size of one padding step                                   |
| `$sassy-gap-unit`     | `0.25rem`     | Size of one gap step                                       |
| `$sassy-radius-unit`  | `0.25rem`     | Size of one step for `%bf-rounded-{0-6}`                   |
| `$sassy-shadow-unit`  | `0.125rem`    | Size of one step for `%bf-shadow-{0-3}`                    |
| `$sassy-loop-max`     | `20`          | Highest spacing, border width and flex grow / shrink step  |
| `$sassy-breakpoints`  | `sm` to `3xl` | Breakpoints that every responsive utility is generated for |

The settings are set in [0-core](../0-core/README.md#configuring-sassy). The utility values themselves are maps in each module's `-variables.scss` file, in `src/4-utilities`.

| Custom property                                                                                                                     | Used by                         |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `--sassy-font-family-mono`, `-sans`, `-serif`                                                                                       | Font families                   |
| `--sassy-font-size-base`, `--sassy-font-weight-base`, `--sassy-line-height-base`                                                    | Text defaults                   |
| `--sassy-body-colour`, `--sassy-body-font-family`, `--sassy-body-font-size`, `--sassy-body-font-weight`, `--sassy-body-line-height` | `%bf-body`                      |
| `--sassy-radius`                                                                                                                    | `%bf-rounded` and form controls |
| `--sassy-shadow-colour`                                                                                                             | `%bf-shadow-{0-3}`              |
