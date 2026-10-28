@echo off
setlocal
if exist "%~dp0ui\creator\out\Kivou-win32-x64\Kivou.exe" (
  start "Kivou" "%~dp0ui\creator\out\Kivou-win32-x64\Kivou.exe"
) else (
  echo Build or extract the Windows package first. See docs\kivou\WINDOWS.md.
  pause
)
