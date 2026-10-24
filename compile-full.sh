#!/bin/sh
set -e

sass --no-source-map src/full.sass dist/full.css

# -n leaves the file name and timestamp out, so an unchanged build gives an identical .gz
gzip -9 -n -k -f dist/full.css
echo "dist/full.css: $(wc -c < dist/full.css | tr -d ' ') bytes, gzipped $(wc -c < dist/full.css.gz | tr -d ' ')"

./snippets.sh
