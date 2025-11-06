@echo off
echo ========================================
echo Flutter App - Starting on Emulator
echo ========================================
echo.

cd /d "%~dp0"

echo Checking for available devices...
flutter devices

echo.
echo Starting Flutter app...
flutter run

pause

