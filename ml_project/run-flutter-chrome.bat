@echo off
echo ========================================
echo Flutter App - Running on Chrome Browser
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Flutter app on Chrome...
echo This will open in your web browser.
echo.

flutter run -d chrome

pause

