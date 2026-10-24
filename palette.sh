#!/usr/bin/env bash
# Generates SVG charts of the Sassy colour palette and default theme colours,
# so the README can show them (Markdown itself cannot show colours).
#
# Usage: ./palette.sh
#   src/base/_21-colour-variables.scss -> docs/palette.svg
#   src/base/_40-theme-variables.scss  -> docs/theme.svg

set -euo pipefail
cd "$(dirname "$0")"

colours="src/base/_21-colour-variables.scss"
theme="src/base/_40-theme-variables.scss"
palette_out="docs/palette.svg"
theme_out="docs/theme.svg"
mkdir -p docs

# POSIX awk only, so it runs with the macOS, GNU and busybox versions.
awk -v palette_out="$palette_out" -v theme_out="$theme_out" '
function hex(r, g, b) { return sprintf("#%02x%02x%02x", r, g, b) }
function font() { return "font-family=\"system-ui, -apple-system, Segoe UI, Roboto, sans-serif\" font-size=\"12\"" }

function svg_open(file, width, height, title) {
    printf "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"%d\" height=\"%d\" viewBox=\"0 0 %d %d\">\n", width, height, width, height > file
    printf "  <title>%s</title>\n", title > file
    printf "  <rect width=\"100%%\" height=\"100%%\" rx=\"8\" fill=\"#ffffff\"/>\n" > file
    printf "  <g %s fill=\"#374151\">\n", font() > file
}

function swatch(file, x, y, w, h, fill, tip) {
    printf "    <rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" rx=\"4\" fill=\"%s\" stroke=\"#000000\" stroke-opacity=\"0.08\"><title>%s</title></rect>\n", x, y, w, h, fill, tip > file
}

function svg_close(file) { printf "  </g>\n</svg>\n" > file }

# ---- first file: the palette ----------------------------------------------

# colour name, e.g.     "slate": (
FNR == NR && /^[ \t]*"[a-z]+"[ \t]*:[ \t]*\(/ {
    name = $0
    sub(/^[ \t]*"/, "", name); sub(/".*$/, "", name)
    colours[++n] = name
    count[name] = 0
    next
}

# shade, e.g.           50: 248 250 252,
FNR == NR && n > 0 && /^[ \t]*[0-9]+[ \t]*:[ \t]*[0-9]+[ \t]+[0-9]+[ \t]+[0-9]+/ {
    line = $0
    gsub(/[:,]/, " ", line)
    split(line, f, " ")
    i = ++count[colours[n]]
    shade[colours[n], i] = f[1]
    rgb[colours[n], f[1]] = f[2] " " f[3] " " f[4]
    if (i > shades) { shades = i; for (j = 1; j <= i; j++) header[j] = shade[colours[n], j] }
    next
}

FNR == NR { next }

# ---- second file: the theme -----------------------------------------------

# e.g.    --bf-theme-primary: #{colour("sky", 600)};
# or      --bf-theme-primary: 13 148 136;
/--bf-theme-[a-z-]+:/ {
    line = $0
    name = line; sub(/^.*--bf-theme-/, "", name); sub(/:.*$/, "", name)
    value = line; sub(/^[^:]*:[ \t]*/, "", value); sub(/;.*$/, "", value)

    if (value ~ /colour\(/) {
        c = value; sub(/^.*colour\([ \t]*"/, "", c); sub(/".*$/, "", c)
        s = value; sub(/^.*,[ \t]*/, "", s); sub(/[^0-9].*$/, "", s)
        source[++t] = c "-" s
        theme_rgb[t] = rgb[c, s]
        if (theme_rgb[t] == "") { printf "palette.sh: unknown colour %s-%s for %s\n", c, s, name > "/dev/stderr"; exit 1 }
    }
    else {
        source[++t] = value
        theme_rgb[t] = value
    }
    theme_name[t] = name
}

END {
    # palette: one row per colour, one column per shade
    label = 80; cell = 56; h = 32; gap = 4; top = 28; pad = 12
    width = pad * 2 + label + shades * (cell + gap) - gap
    height = pad * 2 + top + n * (h + gap) - gap
    svg_open(palette_out, width, height, "Sassy colour palette")

    for (j = 1; j <= shades; j++)
        printf "    <text x=\"%d\" y=\"%d\" text-anchor=\"middle\">%s</text>\n", pad + label + (j - 1) * (cell + gap) + cell / 2, pad + 14, header[j] > palette_out

    for (r = 1; r <= n; r++) {
        c = colours[r]
        y = pad + top + (r - 1) * (h + gap)
        printf "    <text x=\"%d\" y=\"%d\">%s</text>\n", pad, y + h / 2 + 4, c > palette_out
        for (j = 1; j <= count[c]; j++) {
            s = shade[c, j]
            split(rgb[c, s], v, " ")
            swatch(palette_out, pad + label + (j - 1) * (cell + gap), y, cell, h, hex(v[1], v[2], v[3]), c "-" s ": " hex(v[1], v[2], v[3]) " (" rgb[c, s] ")")
        }
    }
    svg_close(palette_out)

    # theme: one swatch per theme colour, with its name and source colour underneath
    cell = 76; h = 48; gap = 8
    width = pad * 2 + t * (cell + gap) - gap
    height = pad * 2 + h + 38
    svg_open(theme_out, width, height, "Sassy default theme colours")

    for (i = 1; i <= t; i++) {
        x = pad + (i - 1) * (cell + gap)
        split(theme_rgb[i], v, " ")
        swatch(theme_out, x, pad, cell, h, hex(v[1], v[2], v[3]), theme_name[i] ": " source[i] " " hex(v[1], v[2], v[3]) " (" theme_rgb[i] ")")
        printf "    <text x=\"%d\" y=\"%d\" text-anchor=\"middle\" font-weight=\"600\">%s</text>\n", x + cell / 2, pad + h + 18, theme_name[i] > theme_out
        printf "    <text x=\"%d\" y=\"%d\" text-anchor=\"middle\" fill=\"#6b7280\" font-size=\"11\">%s</text>\n", x + cell / 2, pad + h + 33, source[i] > theme_out
    }
    svg_close(theme_out)

    printf "palette.sh: %d colours x %d shades, %d theme colours\n", n, shades, t > "/dev/stderr"
}
' "$colours" "$theme"
