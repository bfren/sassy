#!/usr/bin/env bash
# Generates SVG charts of the Sassy colour palette and default theme colours,
# so the README can show them (Markdown itself cannot show colours).
#
# Usage: ./palette.sh
#   src/4-utilities/_420-colour-variables.scss -> docs/palette.svg
#   src/5-theme/_500-theme-variables.scss      -> docs/theme.svg
#
# Colours are oklch(). Each swatch is filled with the nearest sRGB hex colour, for any renderer,
# and styled with the exact oklch() colour, which wide-gamut screens show more vividly.

set -euo pipefail
cd "$(dirname "$0")"

colours="src/4-utilities/_420-colour-variables.scss"
theme="src/5-theme/_500-theme-variables.scss"
palette_out="docs/palette.svg"
theme_out="docs/theme.svg"
mkdir -p docs

# POSIX awk only, so it runs with the macOS, GNU and busybox versions.
awk -v palette_out="$palette_out" -v theme_out="$theme_out" '
function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t\r]+$/, "", s); return s }
function clamp(x) { return x < 0 ? 0 : (x > 1 ? 1 : x) }
function gamma(c) { return c <= 0.0031308 ? 12.92 * c : 1.055 * exp(log(c) / 2.4) - 0.055 }

# "oklch(58.8% 0.158 241.966)" -> "#0084d1", clipping to sRGB as browsers do on sRGB screens
function oklch_hex(v,    p, L, C, h, a, b, l, m, s, r, g, bl) {
    sub(/^oklch\(/, "", v); sub(/\).*$/, "", v)
    split(v, p, " ")
    L = p[1]; sub(/%$/, "", L); L = L / 100
    C = p[2] + 0
    h = p[3]; sub(/deg$/, "", h); if (h == "none") h = 0
    h = h * 3.141592653589793 / 180
    a = C * cos(h); b = C * sin(h)
    l = L + 0.3963377774 * a + 0.2158037573 * b; l = l * l * l
    m = L - 0.1055613458 * a - 0.0638541728 * b; m = m * m * m
    s = L - 0.0894841775 * a - 1.2914855480 * b; s = s * s * s
    r  = clamp(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
    g  = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
    bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
    return sprintf("#%02x%02x%02x", int(gamma(r) * 255 + 0.5), int(gamma(g) * 255 + 0.5), int(gamma(bl) * 255 + 0.5))
}

# fill attribute (works everywhere) for any CSS colour value
function fill_of(v) { return v ~ /^oklch\(/ ? oklch_hex(v) : v }

function font() { return "font-family=\"system-ui, -apple-system, Segoe UI, Roboto, sans-serif\" font-size=\"12\"" }

function svg_open(file, width, height, title) {
    printf "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"%d\" height=\"%d\" viewBox=\"0 0 %d %d\">\n", width, height, width, height > file
    printf "  <title>%s</title>\n", title > file
    printf "  <rect width=\"100%%\" height=\"100%%\" rx=\"8\" fill=\"#ffffff\"/>\n" > file
    printf "  <g %s fill=\"#374151\">\n", font() > file
}

function swatch(file, x, y, w, h, value, tip,    f) {
    f = fill_of(value)
    printf "    <rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" rx=\"4\" fill=\"%s\"%s stroke=\"#000000\" stroke-opacity=\"0.08\"><title>%s</title></rect>\n", \
        x, y, w, h, f, (f == value ? "" : " style=\"fill: " value "\""), tip > file
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

# shade, e.g.           50: oklch(98.4% 0.003 247.858),
FNR == NR && n > 0 && /^[ \t]*[0-9]+[ \t]*:[ \t]*oklch\(/ {
    line = $0
    s = line; sub(/^[ \t]*/, "", s); sub(/[ \t]*:.*$/, "", s)
    v = line; sub(/^[^:]*:[ \t]*/, "", v); sub(/\).*$/, ")", v)
    i = ++count[colours[n]]
    shade[colours[n], i] = s
    value[colours[n], s] = v
    if (i > shades) { shades = i; for (j = 1; j <= i; j++) header[j] = shade[colours[n], j] }
    next
}

FNR == NR { next }

# ---- second file: the theme -----------------------------------------------

# e.g.    --sassy-theme-primary: #{colour("sky", 600)};
# or      --sassy-theme-primary: #0d9488;   (any CSS colour)
/--sassy-theme-[a-z-]+:/ {
    line = $0
    name = line; sub(/^.*--sassy-theme-/, "", name); sub(/:.*$/, "", name)
    v = line; sub(/^[^:]*:[ \t]*/, "", v); sub(/;.*$/, "", v); v = trim(v)

    if (v ~ /colour\(/) {
        c = v; sub(/^.*colour\([ \t]*"/, "", c); sub(/".*$/, "", c)
        s = v; sub(/^.*,[ \t]*/, "", s); sub(/[^0-9].*$/, "", s)
        source[++t] = c "-" s
        theme_value[t] = value[c, s]
        if (theme_value[t] == "") { printf "palette.sh: unknown colour %s-%s for %s\n", c, s, name > "/dev/stderr"; exit 1 }
    }
    else {
        source[++t] = v
        theme_value[t] = v
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
            swatch(palette_out, pad + label + (j - 1) * (cell + gap), y, cell, h, value[c, s], c "-" s ": " value[c, s] " (sRGB " oklch_hex(value[c, s]) ")")
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
        swatch(theme_out, x, pad, cell, h, theme_value[i], theme_name[i] ": " source[i] " " theme_value[i])
        printf "    <text x=\"%d\" y=\"%d\" text-anchor=\"middle\" font-weight=\"600\">%s</text>\n", x + cell / 2, pad + h + 18, theme_name[i] > theme_out
        printf "    <text x=\"%d\" y=\"%d\" text-anchor=\"middle\" fill=\"#6b7280\" font-size=\"11\">%s</text>\n", x + cell / 2, pad + h + 33, source[i] > theme_out
    }
    svg_close(theme_out)

    printf "palette.sh: %d colours x %d shades, %d theme colours\n", n, shades, t > "/dev/stderr"
}
' "$colours" "$theme"
