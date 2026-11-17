#!/usr/bin/env bash
# Generates a VS Code snippets file listing Sassy's placeholders, so that
# `@extend %bf-…` autocompletes. Names come from the full build, where every
# %bf-* placeholder has a matching .bf-* class.
#
# Breakpoint variants (%bf-p-2-md and so on) are left out: they would be most of the
# file and clutter the suggestions, and they follow the same pattern everywhere.
# A variant is a name with a breakpoint suffix whose base name (%bf-p-2) is listed,
# so placeholders that only have rules inside media queries, such as
# %bf-nav-collapse-md and %bf-navbar-menu, are still listed.
#
# Each description is the CSS the placeholder outputs. When that is longer than 200
# characters - mostly components - the description comes from the placeholder's row in a
# "Placeholder | For" table in docs/*.md or README.md instead, or failing that the CSS is
# cut short at a declaration.
#
# Usage: ./snippets.sh [input.css] [output.code-snippets]
#   defaults: dist/full.css -> dist/sassy.code-snippets
#   set SASSY_PREFIX if you have changed $sassy-prefix (default: bf)

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
awk -v prefix="$prefix" -v max=200 '
function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t]+$/, "", s); return s }
function esc(s)  { gsub(/\\/, "\\\\", s); gsub(/"/, "\\\"", s); return s }

# record the declarations of every selector in the rule whose last part is .prefix-name,
# optionally followed by pseudo-classes or attributes (e.g. :hover, [readonly]).
# Anything else in the selector is kept in the description, with & standing for the class,
# e.g. ":disabled ~ & { opacity: 0.5; }".
# Classes elsewhere in the selector are recorded too, for placeholders that are only ever
# combined with another one, such as %bf-navbar-push in ".bf-navbar-expand-md&".
function flush(   parts, count, i, s, name, t, offset, other, cd) {
    count = split(selector, parts, ",")
    for (i = 1; i <= count; i++) {
        s = trim(parts[i])
        name = ""
        if (match(s, class_re)) name = record_subject(s)
        # every other class in the selector, with & standing for it
        t = s; offset = 0
        while (match(t, any_re)) {
            other = substr(t, RSTART + 1, RLENGTH - 1)
            if (other != name) {
                cd = substr(s, 1, offset + RSTART - 1) "&" substr(s, offset + RSTART + RLENGTH) " { " decls " }"
                if (media != "") cd = "@media " media " { " cd " }"
                if (!(other in seen)) { order[++n] = other; seen[other] = 1 }
                if (media == "") has_base[other] = 1
                context_desc[other] = trim(context_desc[other] " " cd)
            }
            offset += RSTART + RLENGTH - 1
            t = substr(t, RSTART + RLENGTH)
        }
    }
}

# record a selector whose last part is the class matched by class_re (see flush),
# and return the class name, or "" if the class is joined to something before it
function record_subject(s,   start, context, rest, name, suffix, d) {
    start = RSTART
    if (start > 1 && substr(s, start - 1, 1) != " ") return ""
    context = substr(s, 1, start - 1)
    rest = substr(s, start)
    match(rest, name_re)
    name = substr(rest, 2, RLENGTH - 1)
    suffix = substr(rest, RLENGTH + 1)
    d = (context == "" && suffix == "" ? decls : context "&" suffix " { " decls " }")
    if (!(name in seen)) { order[++n] = name; seen[name] = 1 }
    if (!(name in desc)) desc[name] = ""
    if (media == "") has_base[name] = 1
    # a breakpoint variant only exists inside its media query, so label the whole
    # placeholder with it; otherwise show the media block inline (e.g. reduced motion)
    if (media != "" && (name in has_base || !is_variant(name))) d = "@media " media " { " d " }"
    desc[name] = trim(desc[name] " " d)
    return name
}

# a breakpoint variant: no rules outside media queries, and its name less its last part
# (e.g. p-2 for p-2-md) is a placeholder that has some
function is_variant(name,   stem) {
    if (name in has_base) return 0
    stem = name; sub(/-[^-]+$/, "", stem)
    return stem != name && (stem in has_base)
}

# the docs tables: remember the placeholder names in each row (in backticks) and its description
function read_doc_row(line,   cells, names, r) {
    split(line, cells, "|")
    r = ++rows
    row_desc[r] = plain(trim(cells[3]))
    names = cells[2]
    while (match(names, /`[^`]+`/)) {
        row_name[r, ++row_names[r]] = substr(names, RSTART + 1, RLENGTH - 2)
        names = substr(names, RSTART + RLENGTH)
    }
}

# markdown to plain text: no backticks, and [text](link) as text
function plain(s,   out) {
    gsub(/`/, "", s)
    out = ""
    while (match(s, /\[[^]]*\]\([^)]*\)/)) {
        out = out substr(s, 1, RSTART - 1) substr(s, RSTART + 1, index(substr(s, RSTART), "]") - 2)
        s = substr(s, RSTART + RLENGTH)
    }
    return out s
}

# the docs write the bf prefix; use the one these placeholders have
function doc_name(t) {
    sub(/^%/, "", t)
    if (prefix != "bf") sub(/^bf-/, prefix "-", t)
    return t
}

function set_doc(name, r) { if ((name in seen) && !(name in doc)) doc[name] = row_desc[r] }

# matches each docs table name to placeholders: exact names first, then the short forms in a
# row, which add to the first name in the row (-small after %bf-form-control) or replace its
# last part (-grey-dark after %bf-btn-primary), then names with a {placeholder} or …,
# so a more exact row always wins
function match_docs(   r, j, t, first, a, b, re, alts, count, k, i) {
    for (r = 1; r <= rows; r++) for (j = 1; j <= row_names[r]; j++) {
        t = row_name[r, j]
        if (t ~ /^%/ && t !~ /[{…]/) set_doc(doc_name(t), r)
    }
    for (r = 1; r <= rows; r++) {
        first = ""
        for (j = 1; j <= row_names[r]; j++) {
            t = row_name[r, j]
            if (t ~ /^%/ && t !~ /[{…]/) { if (first == "") first = doc_name(t) }
            else if (t ~ /^-/ && first != "") {
                a = first t
                b = first; sub(/-[^-]+$/, "", b); b = b t
                set_doc(a in seen ? a : b, r)
            }
        }
    }
    for (r = 1; r <= rows; r++) for (j = 1; j <= row_names[r]; j++) {
        t = row_name[r, j]
        if (t !~ /[{…]/) continue
        if (match(t, /\{[^}]*,[^}]*\}/)) {
            # a list of alternatives, e.g. %bf-text-transform-{upper, lower}
            count = split(substr(t, RSTART + 1, RLENGTH - 2), alts, ",")
            for (k = 1; k <= count; k++) set_doc(doc_name(substr(t, 1, RSTART - 1) trim(alts[k]) substr(t, RSTART + RLENGTH)), r)
            continue
        }
        re = doc_name(t)
        gsub(/\{[^}]*\}/, "[A-Za-z0-9-]+", re)
        gsub(/…/, "[A-Za-z0-9-]*", re)
        re = "^" re "$"
        for (i = 1; i <= n; i++) if (order[i] ~ re) set_doc(order[i], r)
    }
}

# CSS cut short at the last declaration or rule that fits in max characters
function shorten(d,   i, c) {
    for (i = max; i > 0; i--) { c = substr(d, i, 1); if (c == ";" || c == "}") break }
    return (i > 0 ? substr(d, 1, i) : substr(d, 1, max)) " …"
}

FILENAME ~ /\.md$/ { if ($0 ~ /^\| `%/) read_doc_row($0); next }

BEGIN {
    name_re = "^\\." prefix "-[A-Za-z0-9_-]+"
    any_re = "\\." prefix "-[A-Za-z0-9_-]+"
    class_re = "\\." prefix "-[A-Za-z0-9_-]+((:|\\[)[^ ]*)?$"
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
    match_docs()

    # leave out breakpoint variants; a placeholder only seen combined with others is
    # described by the rules it is combined in; long descriptions come from the docs
    for (i = 1; i <= n; i++) {
        name = order[i]
        if (is_variant(name)) continue
        if (!(name in desc)) desc[name] = context_desc[name]
        if (length(desc[name]) > max) {
            if (name in doc) { desc[name] = doc[name]; from_docs++ }
            else { desc[name] = shorten(desc[name]); shortened++ }
        }
        keep[++k] = name
    }

    print "{"
    for (i = 1; i <= k; i++) {
        name = keep[i]
        printf "  \"%%%s\": { \"scope\": \"sass,scss\", \"prefix\": \"%s\", \"body\": \"%s\", \"description\": \"%s\" }%s\n", \
            name, name, name, esc(desc[name]), (i < k ? "," : "")
    }
    print "}"
    printf "snippets.sh: %d placeholders written (%d breakpoint variants left out), %d described from the docs, %d shortened\n", \
        k, n - k, from_docs, shortened > "/dev/stderr"
}
' docs/*.md README.md "$in" > "$out"
