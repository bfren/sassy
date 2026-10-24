@echo off
rem Runs compile-full.sh in Git Bash: the build also needs gzip and awk, which Git for Windows provides.
setlocal

set "GITBASH=%ProgramFiles%\Git\bin\bash.exe"
if not exist "%GITBASH%" set "GITBASH=%LOCALAPPDATA%\Programs\Git\bin\bash.exe"
if not exist "%GITBASH%" (
    echo Git Bash not found - install Git for Windows, or set GITBASH in this file to the path of bash.exe
    exit /b 1
)

pushd "%~dp0"
"%GITBASH%" compile-full.sh
set "RESULT=%ERRORLEVEL%"
popd
exit /b %RESULT%
