#!/bin/sh
# for previewing the samples as you work: the pages load sassy.js from samples/js
# (node tools/site.mjs build makes the finished site in _site, with each example's CSS)
mkdir -p samples/js
cp src/sassy.js samples/js/sassy.js
sass --load-path=src --watch samples/sass:samples/css
