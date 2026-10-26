if not exist samples\js mkdir samples\js
copy /y src\sassy.js samples\js\sassy.js >nul
if not exist samples\images mkdir samples\images
copy /y logo\logo-light.svg samples\images\logo.svg >nul
sass --load-path=src --watch samples/sass:samples/css
