# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Dart Sass 1.108+ on the path (`sass`), plus bash and `awk`. The site and checks also need Node.js 20+, and the `sassy.js` tests Node.js 22.22.2+ or 24.15+. There is no `package.json` and no lint config.

- Full build (regenerates the committed `dist/` files, then runs `snippets.sh` and `palette.sh`): `./compile-full.sh`
- Compile the sample stylesheets while editing: `./watch.sh` (or `watch.bat`), then open the `samples/*.html` pages
- Build the samples site: `node tools/site.mjs build` - writes `_site`, adds each example's compiled CSS, and fails if an example does not compile or its page's stylesheet does not use it. The Pages workflow runs this and publishes `_site` on merge to `main`.
- Check the docs: `node tools/site.mjs check` - fails if the CSS shown after a Sass example in `README.md` or the `docs` folders is not what Sassy outputs, or if `src` reads a custom property with a bare `var()` that nothing defines. It also checks `dist/full.css`: the `@layer` order statement must match `layerStack` in `site.mjs` (update it with `_render.sass` or the breakpoints), nothing may be outside a layer, and only visually-hidden may use `!important`
- Test `src/sassy.js`: `npm install --no-save jsdom@31.0.1 && node --test tools/sassy.test.mjs` - the version CI pins in `.github/workflows/check.yml`; change both together
- Verify a change: run both `tools/site.mjs` commands, and open the matching page in `_site`. The `Check` workflow runs them on every pull request, after `./compile-full.sh` (it fails if `dist/` or `docs/*.svg` differ from what is committed) and the `sassy.js` tests. CI uses the Dart Sass version pinned in `.github/actions/setup-sass/action.yml`; bump it there.

## Architecture

**Sassy is a Sass library that outputs placeholder selectors (`%bf-…`), not classes.** Consumers `@extend` them. The one exception is `dist/full.css`, which is produced by setting `$sassy-full: true`; that flag makes every `make.*` mixin also emit a `.bf-…` class.

**Output order is the core design.** Each module has a `utilities` mixin, and `src/_render.sass` includes them all inside `make.layers`, grouped by folder with `make.layer`. `make.layers` renders the whole module list once for base rules, then once per breakpoint (smallest first), each pass in its own cascade layer (`sassy.base.core` … `sassy.3xl.theme`, declared by one `@layer` statement at the top), so breakpoint overrides always beat base rules and any composite beats single-purpose utilities regardless of which file defines them. Changing the order in `_render.sass` changes which placeholder wins, so treat it as load-bearing.

**Module layout.** Folders and files are numbered by their output order (`0-core` → `5-theme`, file `_NNN-name.sass`). Each module's settings live in a sibling `-variables.scss` with `!default`, forwarded through `src/0-core/_030-variables.scss` so `@use … with (…)` configuration reaches them. Only the font/body (`400-text`) and theme custom properties (the theme colours and the colour roles such as `--sassy-surface` and `--sassy-line`, in `500-theme`) are defined on `:root`; every other one is a Sass variable such as `$sassy-card-bg: var(--sassy-card-bg, #fff)`, and modules read it through that variable, so its default is only output by the rules that use it. Never write a bare `var(--sassy-…)` for one of those, as it has no value unless the consumer sets it. `src/_index.sass` forwards the folders, and `src/full.sass` is the full-build entry point. Placeholder and class names are built with `make.name()` / `make.single` / `make.responsive`, never by hand-writing the `bf` prefix. In `1-components`, `_100-shared.sass` holds private mixins and the components start at 110 (button first, as other components contain buttons). Components come before forms because input groups style the buttons inside them.

**Generated output is committed.** `dist/` (CSS, `sassy.js` copy, snippets) changes whenever `src` changes, and `docs/*.svg` changes when the colour or theme variables do. Rebuild with `./compile-full.sh` and include the results in the same change. `_site/` is built, not committed.

**Version string appears in several places.** `VERSION`, the header comments in `src/0-core/_000-sassy.scss` and `src/sassy.js`, and the CDN URLs in `README.md` and `docs/1-components/README.md` should all move together.

**`src/sassy.js` is an optional progressive-enhancement script** for tabs (ARIA tabs pattern), tooltips (Popover API, with JS positioning fallback when CSS anchor positioning is missing) and `command`/`commandfor` buttons in older browsers. It finds elements by ARIA role and standard attributes, never by class name.

**Docs have three homes.** `README.md` is the reference; `docs/0-core/` … `docs/5-theme/` hold longer worked examples, a folder per layer with a `README.md` for the layer and a page per source file named after it (`docs/1-components/123-tabs.md` for `_123-tabs.sass`) - a new module gets a page there, and a link in its folder's `README.md`; the `samples` site shows each layer working. Keep them consistent when behaviour changes. A ```css block after a ```sass block in the docs is checked against the compiled output, so it must be real output (it may leave rules or declarations out).

**The samples site.** Each `samples/*.html` page has its own `samples/sass/*.sass`, which `@use`s `_site.sass` for the page around the demos. An example is a `.demo` followed by a `<div class="code">` holding `<pre data-lang="sass">` and `<pre data-lang="html">` blocks (HTML-escaped); `tools/site.mjs build` turns these into tabs and adds the CSS, wraps each `.demo` and its code in an `.example-card`, writes each page's section nav from its `<section class="example" id>` and `<h2>`, and adds a link to the docs pages each section names in `data-docs` (`data-docs="131-list-group"`, files in the page's docs folder). The build also adds a search box to each page's header (`tools/site-search.js`, Ctrl K or ⌘K) over `search.json`: the sections, the placeholders each one's Sass uses, and every other placeholder with the docs page of the source file that outputs it, found by compiling each module on its own. Every section on a layer page needs `data-docs`, and `check` fails unless the line under each docs page's title links to the sections that name it - its message gives the line. `_site.sass` styles the site from Sassy's placeholders; mark any plain declaration it still needs with a `gap:` comment. The page's Sass file must contain each example's Sass, unless the block is marked `data-shown-only`.

## Conventions

- British spelling in all names and docs: `centre`, `colour`, `grey`.
- Shell scripts must keep LF line endings and `.bat` files CRLF (enforced by `.gitattributes`).
- Commits must be signed, per the README.
- `samples/js/`, `samples/images/` and `samples/css/` are build copies and are gitignored; `test/` contains only untracked local leftovers and is not part of the project.
- Placeholder values: a bare number is always a step on a scale (`%bf-p-4`, `%bf-top-22`); every percentage ends in `pc` (`%bf-width-50pc`, `%bf-opacity-50pc`) and every viewport size in `vh` or `vw` (`%bf-height-100vh`). Keep new scales to this.
- A new component gets a numbered file `_1NN-name.sass` with its `-variables.scss`, registered in `src/1-components/_index.sass` (`@forward … hide utilities`), `src/_render.sass` (in file order) and `src/0-core/_030-variables.scss`; a page in `docs/1-components/` listed in that folder's `README.md`; a README table row; a samples demo; and a CHANGELOG entry under `[Unreleased]`, marked **Breaking:** where it applies.

## Pitfalls

- **Layers decide before specificity.** A placeholder that styles what is inside it must be in a layer at or above what it styles: components are folder 1 and forms folder 2 because input groups style the buttons inside them, and `%bf-body` is in `core`. A component that styles form controls inside it would lose to the forms layer.
- **Sass 1.108 crashes** extending into `:where(:has(> &))` ("components may not be empty"). Write `:where(*:has(> &))`, which means the same with zero specificity.
- **Sass's `if()` function is deprecated**: use `@if` blocks.
- **Buttons don't inherit the text size**, so anything sized in `em` on a `<button>` needs `font: inherit`.
- **Hover against a current state**: `a:hover` out-ranks `[aria-current]`. Wrap the element in `:where(a, button)` so the current and disabled rules, written later, win.
- **Theme colours mixed into text fail contrast** easily. Alerts mix 40% of the theme colour with `currentColor`, which keeps all eight defaults at 5:1 or more; measure any new mix in the browser.
- **`[hidden]` loses to any author `display`**, layered or not, so a component hidden by script must not get a display placeholder.
- **Custom properties inherit.** A setting such as `--sassy-grid-gap: 0` on a grid also reaches every grid inside it; prefer a placeholder (`%bf-gap-0`) when only that element should change.
- **Shared component code** is in `src/1-components/_100-shared.sass`: `focus-outline()`, `joined($axis, $inner)` (the shared borders of button groups and pagination), `link()` and the part helpers.
- **Tests and `window.CSS`**: jsdom has no `window.CSS` before 31, so run the tests with the version CI pins, and have tests create `window.CSS` rather than change it.
- **The samples stylesheet is cached** by the browser: reload it with a query string (`?v=2`) after a rebuild before checking a change.
- **Docs tables**: a new row wider than its column means re-padding the whole Markdown table, or it looks broken in plain text.
