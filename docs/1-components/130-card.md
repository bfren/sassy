# Cards

[1-components](README.md) - live examples: [1-components.html](https://bfren.github.io/sassy/1-components.html)

```sass
.card
    @extend %bf-card

    h3
        @extend %bf-card-title

.card-body
    @extend %bf-card-body
```

```html
<article class="card">
    <img src="photo.jpg" alt="" />
    <div class="card-body">
        <h3>Title</h3>
        <p>Some text about the card.</p>
    </div>
    <footer>Updated today</footer>
</article>
```

`%bf-card` styles a `<header>` and `<footer>` it holds as its top and bottom caps, and an `<img>`, `<picture>` or `<video>` as a full-width image. The body and title have placeholders of their own, `%bf-card-body` and `%bf-card-title`, as a card can hold anything - a flush [list group](131-list-group.md) or a table, say - that shouldn't be padded like a body. For a header, footer or image that isn't one of those elements, extend `%bf-card-header`, `-footer` or `-image` on it.

A card is a flex column. The body grows to fill it, so in a row of cards of different heights, such as a flex row with `%bf-d-flex` and `%bf-gap-4`, the footers line up. The card clips its content to its rounded corners, so an image needs no radius of its own.

## Settings and custom properties

| Property                                                                                            | Controls                                           |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `--sassy-card-bg`, `--sassy-card-border-width`, `--sassy-card-border-colour`, `--sassy-card-radius` | Card background, border and corners                |
| `--sassy-card-padding-y`, `--sassy-card-padding-x`, `--sassy-card-cap-bg`                           | Card spacing, and the header and footer background |
