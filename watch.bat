if not exist samples\js mkdir samples\js
copy /y src\sassy.js samples\js\sassy.js >nul
sass --load-path=src --watch samples/sass:samples/css
