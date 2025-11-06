@echo off
echo ========================================
echo ML Project - Quick Start Script
echo ========================================
echo.

echo Checking Flutter...
flutter --version
if errorlevel 1 (
    echo ERROR: Flutter is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo ========================================
echo Starting all services...
echo ========================================
echo.

echo Starting Backend (MongoDB) on port 3000...
start "Backend (MongoDB)" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul

echo Starting Backend-EventHub (PostgreSQL) on port 3002...
start "Backend-EventHub (PostgreSQL)" cmd /k "cd backend-eventhub && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Services started!
echo ========================================
echo.
echo Backend (MongoDB):     http://localhost:3000
echo Backend-EventHub:      http://localhost:3002
echo Swagger Docs:          http://localhost:3002/api-docs
echo.
echo To run the Flutter app, use:
echo   flutter run
echo.
echo Press any key to exit...
pause >nul

