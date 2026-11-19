# Cards

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

```sass
.card
    @extend %bf-card

    img
        @extend %bf-card-image

    h3
        @extend %bf-card-title

.card-body
    @extend %bf-card-body

.card-foot
    @extend %bf-card-footer
```

```html
<article class="card">
    <img src="photo.jpg" alt="" />
    <div class="card-body">
        <h3>Title</h3>
        <p>Some text about the card.</p>
    </div>
    <footer class="card-foot">Updated today</footer>
</article>
```

A card is a flex column. The body grows to fill it, so in a row of cards of different heights, such as a flex row with `%bf-d-flex` and `%bf-gap-4`, the footers line up. The card clips its content to its rounded corners, so an image needs no radius of its own.

## Settings and custom properties

| Property                                                                                            | Controls                                           |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `--sassy-card-bg`, `--sassy-card-border-width`, `--sassy-card-border-colour`, `--sassy-card-radius` | Card background, border and corners                |
| `--sassy-card-padding-y`, `--sassy-card-padding-x`, `--sassy-card-cap-bg`                           | Card spacing, and the header and footer background |
