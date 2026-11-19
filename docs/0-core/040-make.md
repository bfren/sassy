# Mixins

[0-core](README.md) - live examples: [0-core.html](https://bfren.github.io/sassy/0-core.html)

These are available as `sassy.name()` too.

| Mixin                           | Use                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `up($breakpoint)`               | A `@media` block from a breakpoint name, for your own styles                           |
| `up-prop($property-map...)`     | Property values by breakpoint, inside a rule                                           |
| `make-single($class)`           | A placeholder for the base definition only                                             |
| `make-responsive($class, $map)` | A placeholder for the base definition and each breakpoint                              |
| `make-layers()`                 | Wraps your own `make-*` calls in cascade layers, so they are ordered like Sassy's      |
| `make-name($parts...)`          | A placeholder or class name built from the prefix and separator, for example `"mt", 0` |

## Your own breakpoint styles

Sass cannot `@extend` inside a media query, so for styles that belong to one rule, use `up()` directly:

```sass
.hero
    font-size: 1rem

    @include sassy.up(md)
        font-size: 1.5rem
```

```css
.hero {
  font-size: 1rem;
}
@media (width >= 768px) {
  .hero {
    font-size: 1.5rem;
  }
}
```

## Different values at different breakpoints

`up-prop()` sets a property at each breakpoint. Give it the property name, then a map of breakpoint values. A breakpoint missing from the map is left alone:

```sass
.sidebar
    background-color: sassy.colour("grey", 200)
    @include sassy.up-prop(width (sm: 50%, lg: 25%))
```

```css
.sidebar {
  background-color: oklch(92.8% 0.006 264.531deg);
}
@media (width >= 576px) {
  .sidebar {
    width: 50%;
  }
}
@media (width >= 992px) {
  .sidebar {
    width: 25%;
  }
}
```

## Your own placeholders, in Sassy's style

Use `make-layers()` around any `make-*` call so that your breakpoint variants beat your base rules, as Sassy's own do. It outputs each pass in a [cascade layer](../../README.md#cascade-layers) - by default Sassy's own, `sassy.base`, `sassy.sm` and so on, where your placeholders beat Sassy's at the same breakpoint. Pass `$name: "app"` to use layers of your own instead:

```sass
@use "sassy/src" as sassy

@include sassy.make-layers
    @include sassy.make-responsive("stack", (1: 0.25rem, 2: 0.5rem)) using ($value)
        display: flex
        flex-direction: column
        gap: $value
```

This makes `%bf-stack-1`, `%bf-stack-2`, and a variant for each breakpoint, such as `%bf-stack-2-md`:

```sass
.menu
    @extend %bf-stack-1
    @extend %bf-stack-2-md
```

To build a name yourself - for example in a placeholder inside a loop, or a name that must follow the prefix - use `make-name()`:

```sass
.menu
    @extend %#{sassy.make-name("stack", 2)}
```

Without `make-layers()`, a breakpoint variant could be output before a base rule and lose to it. Use `make-single()` on its own when you do not need breakpoint variants.
