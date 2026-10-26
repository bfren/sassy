# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Dart Sass 1.79+ on the path (`sass`), plus bash, `gzip` and `awk`. The site and checks also need Node.js 20+. There is no `package.json` and no lint config.

- Full build (regenerates the committed `dist/` files, then runs `snippets.sh` and `palette.sh`): `./compile-full.sh`
- Compile the sample stylesheets while editing: `./watch.sh` (or `watch.bat`), then open the `samples/*.html` pages
- Build the samples site: `node tools/site.mjs build` - writes `_site`, adds each example's compiled CSS, and fails if an example does not compile or its page's stylesheet does not use it. The Pages workflow runs this and publishes `_site` on merge to `main`.
- Check the docs: `node tools/site.mjs check` - fails if the CSS shown after a Sass example in `README.md` or `docs/*.md` is not what Sassy outputs
- Test `src/sassy.js`: `npm install --no-save jsdom && node --test tools/sassy.test.mjs`
- Verify a change: run both `tools/site.mjs` commands, and open the matching page in `_site`. The `Check` workflow runs them on every pull request, after `./compile-full.sh` (it fails if `dist/` or `docs/*.svg` differ from what is committed) and the `sassy.js` tests. CI uses the Dart Sass version pinned in `.github/actions/setup-sass/action.yml`; bump it there.

## Architecture

**Sassy is a Sass library that outputs placeholder selectors (`%bf-…`), not classes.** Consumers `@extend` them. The one exception is `dist/full.css`, which is produced by setting `$sassy-full: true`; that flag makes every `make.*` mixin also emit a `.bf-…` class.

**Output order is the core design.** Each module has a `utilities` mixin, and `src/_render.sass` includes them all inside `make.passes`. `make.passes` renders the whole module list once for base rules, then once per breakpoint (smallest first), so breakpoint overrides always beat base rules and any composite beats single-purpose utilities regardless of which file defines them. Changing the order in `_render.sass` changes which placeholder wins, so treat it as load-bearing.

**Module layout.** Folders and files are numbered by their output order (`0-core` → `5-theme`, file `_NNN-name.sass`). Each module's settings live in a sibling `-variables.scss` with `!default`, forwarded through `src/0-core/_030-variables.scss` so `@use … with (…)` configuration reaches them. `src/_index.sass` forwards the folders, and `src/full.sass` is the full-build entry point. Placeholder and class names are built with `make.name()` / `make.single` / `make.responsive`, never by hand-writing the `bf` prefix. In `2-components`, `_200-shared.sass` holds private mixins and the components start at 210 (button first, as other components contain buttons).

**Generated output is committed.** `dist/` (CSS, the `.gz`, `sassy.js` copy, snippets) changes whenever `src` changes, and `docs/*.svg` changes when the colour or theme variables do. Rebuild with `./compile-full.sh` and include the results in the same change. `_site/` is built, not committed.

**Version string appears in several places.** `VERSION`, the header comments in `src/0-core/_000-sassy.scss` and `src/sassy.js`, and the `@0.3.0` CDN URLs in `README.md` should all move together.

**`src/sassy.js` is an optional progressive-enhancement script** for tabs (ARIA tabs pattern), tooltips (Popover API, with JS positioning fallback when CSS anchor positioning is missing) and `command`/`commandfor` buttons in older browsers. It finds elements by ARIA role and standard attributes, never by class name.

**Docs have three homes.** `README.md` is the reference; `docs/0-core.md` … `docs/5-theme.md` hold longer worked examples per layer; the `samples` site shows each layer working. Keep them consistent when behaviour changes. A ```css block after a ```sass block in the docs is checked against the compiled output, so it must be real output (it may leave rules or declarations out).

**The samples site.** Each `samples/*.html` page has its own `samples/sass/*.sass`, which `@use`s `_site.sass` for the page around the demos. An example is a `.demo` followed by a `<div class="code">` holding `<pre data-lang="sass">` and `<pre data-lang="html">` blocks (HTML-escaped); `tools/site.mjs build` turns these into tabs and adds the CSS. The page's Sass file must contain each example's Sass, unless the block is marked `data-shown-only`.

## Conventions

- British spelling in all names and docs: `centre`, `colour`, `grey`.
- Shell scripts must keep LF line endings and `.bat` files CRLF (enforced by `.gitattributes`).
- Commits must be signed, per the README.
- `samples/js/`, `samples/images/` and `samples/css/` are build copies and are gitignored; `test/` contains only untracked local leftovers and is not part of the project.
