#!/bin/sh
# for previewing the samples as you work: the pages load sassy.js from samples/js and the logo from samples/images
# (node tools/site.mjs build makes the finished site in _site, with each example's CSS)
mkdir -p samples/js
cp src/sassy.js samples/js/sassy.js
mkdir -p samples/images
cp logo/logo-light.svg samples/images/logo.svg
sass --load-path=src --watch samples/sass:samples/css
