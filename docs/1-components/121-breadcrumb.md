# Breadcrumbs

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

A breadcrumb shows where the current page sits, as a trail of links. Extend `%bf-breadcrumb` on the `<ol>`, and it styles the items:

```sass
.crumbs
    @extend %bf-breadcrumb
```

```css
@layer sassy.base.components {
  .crumbs {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
  }
  .crumbs a {
    color: var(--sassy-breadcrumb-link-colour, var(--sassy-theme-primary));
  }
  .crumbs > li + li::before {
    content: var(--sassy-breadcrumb-divider, "/")/"";
    padding-inline: var(--sassy-breadcrumb-gap, 0.5rem);
  }
  .crumbs > [aria-current=page], .crumbs > li > [aria-current=page] {
    color: var(--sassy-breadcrumb-current-colour, var(--sassy-muted));
  }
}
```

```html
<nav aria-label="Breadcrumb">
    <ol class="crumbs">
        <li><a href="/">Home</a></li>
        <li><a href="/docs">Docs</a></li>
        <li aria-current="page">Breadcrumbs</li>
    </ol>
</nav>
```

- **Put it in a `<nav>` with `aria-label`**, so it is listed as a landmark, and use an `<ol>`, as the order of the items matters.
- **Mark the current page with `aria-current="page"`**, on the last item or on a link in it, and it is shown in grey.
- **The divider is decoration.** Its alternative text is empty, so screen readers read the links, not the slashes.
- **Change the divider with `--sassy-breadcrumb-divider`**, to any CSS `content` value: a string such as `"›"`, or an image with `url()`.

## Settings and custom properties

| Property                                                                                                  | Controls                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `--sassy-breadcrumb-divider`, `--sassy-breadcrumb-divider-colour`, `--sassy-breadcrumb-gap`               | The divider between breadcrumb items - any CSS `content` value - its colour, and the space either side |
| `--sassy-breadcrumb-link-colour`, `--sassy-breadcrumb-current-colour`, `--sassy-breadcrumb-margin-bottom` | Breadcrumb link and current page colours, and the space below                                          |
