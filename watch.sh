#!/bin/sh
# the sample pages load sassy.js from samples/js - copied here, as only samples is published
mkdir -p samples/js
cp src/sassy.js samples/js/sassy.js
sass --load-path=src --watch samples/sass:samples/css
