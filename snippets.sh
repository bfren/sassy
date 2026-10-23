#!/usr/bin/env bash
# Generates a VS Code snippets file listing every Sassy placeholder, so that
# `@extend %bf-…` autocompletes. Names come from the full build, where every
# %bf-* placeholder has a matching .bf-* class.
#
# Usage: ./snippets.sh [input.css] [output.code-snippets]
#   defaults: dist/full.css -> dist/sassy.code-snippets
#   set SASSY_PREFIX if you have changed $bf-prefix (default: bf)

set -euo pipefail
cd "$(dirname "$0")"

in="${1:-dist/full.css}"
out="${2:-dist/sassy.code-snippets}"
prefix="${SASSY_PREFIX:-bf}"

if [[ ! -f "$in" ]]; then
    echo "snippets.sh: $in not found - run compile-full.sh first" >&2
    exit 1
fi

# POSIX awk only, so it runs with the macOS, GNU and busybox versions.
awk -v prefix="$prefix" '
function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t]+$/, "", s); return s }
function esc(s)  { gsub(/\\/, "\\\\", s); gsub(/"/, "\\\"", s); return s }

# record the declarations of every selector in the rule that is .prefix-name,
# optionally followed by pseudo-classes (e.g. :hover), which are kept in the description
function flush(   parts, count, i, s, name, suffix, d) {
    count = split(selector, parts, ",")
    for (i = 1; i <= count; i++) {
        s = trim(parts[i])
        if (s !~ class_re) continue
        match(s, name_re)
        name = substr(s, 2, RLENGTH - 1)
        suffix = substr(s, RLENGTH + 1)
        d = (suffix == "" ? decls : suffix " { " decls " }")
        if (!(name in desc)) { order[++n] = name; desc[name] = "" }
        desc[name] = trim(desc[name] " " d)
        if (media != "") at[name] = media
    }
}

BEGIN {
    name_re = "^\\." prefix "-[A-Za-z0-9_-]+"
    class_re = name_re "(:[^ ]*)?$"
    media = ""; selector = ""; decls = ""; in_rule = 0; in_comment = 0; n = 0
}

{
    line = $0

    # strip comments, which may span several lines
    if (in_comment) {
        if (index(line, "*/") == 0) next
        line = substr(line, index(line, "*/") + 2); in_comment = 0
    }
    while (index(line, "/*") > 0) {
        start = index(line, "/*")
        rest = substr(line, start + 2)
        if (index(rest, "*/") == 0) { line = substr(line, 1, start - 1); in_comment = 1; break }
        line = substr(line, 1, start - 1) substr(rest, index(rest, "*/") + 2)
    }

    line = trim(line)
    if (line == "") next

    if (in_rule) {
        if (line == "}") { flush(); in_rule = 0; selector = ""; decls = ""; next }
        decls = (decls == "" ? line : decls " " line)
        next
    }

    if (line ~ /^@media/) {
        media = line; sub(/^@media[ ]*/, "", media); sub(/[ ]*\{$/, "", media); next
    }
    if (line ~ /^@/) next          # @charset and other at-rules
    if (line == "}") { media = ""; next }

    if (line ~ /\{$/) {
        sub(/[ ]*\{$/, "", line)
        selector = selector line; in_rule = 1; decls = ""
    }
    else selector = selector line   # selector list continues on the next line
}

END {
    print "{"
    for (i = 1; i <= n; i++) {
        name = order[i]
        d = desc[name]
        if (name in at) d = d " @media " at[name]
        printf "  \"%%%s\": { \"scope\": \"sass,scss\", \"prefix\": \"%s\", \"body\": \"%s\", \"description\": \"%s\" }%s\n", \
            name, name, name, esc(d), (i < n ? "," : "")
    }
    print "}"
    printf "snippets.sh: %d placeholders written\n", n > "/dev/stderr"
}
' "$in" > "$out"
