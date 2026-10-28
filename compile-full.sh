#!/bin/sh
set -e

sass --no-source-map src/full.sass dist/full.css
cp src/sassy.js dist/sassy.js
echo "dist/full.css: $(wc -c < dist/full.css | tr -d ' ') bytes"

./snippets.sh
./palette.sh
