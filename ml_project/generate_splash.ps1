#!/usr/bin/env pwsh
# Generate Native Splash Screen
# Run this after adding your logo to assets/images/logo.png

Write-Host "🎨 Generating Native Splash Screens..." -ForegroundColor Cyan
Write-Host ""

# Check if logo exists
if (-not (Test-Path "assets/images/logo.png")) {
    Write-Host "⚠️  Warning: assets/images/logo.png not found!" -ForegroundColor Yellow
    Write-Host "   The Material Icons event icon will be used instead." -ForegroundColor Yellow
    Write-Host "   To add a custom logo:" -ForegroundColor Yellow
    Write-Host "   1. Create a 512x512 PNG with transparent background" -ForegroundColor Yellow
    Write-Host "   2. Save it as assets/images/logo.png" -ForegroundColor Yellow
    Write-Host "   3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "📦 Running flutter pub get..." -ForegroundColor Green
flutter pub get

Write-Host ""
Write-Host "🎨 Generating native splash screens..." -ForegroundColor Green
dart run flutter_native_splash:create

Write-Host ""
Write-Host "✅ Native splash screens generated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: flutter clean" -ForegroundColor White
Write-Host "  2. Run: flutter run -d <device-id>" -ForegroundColor White
Write-Host ""
Write-Host "The native splash will show:" -ForegroundColor Cyan
Write-Host "  • Your brand colors (#0F172A or #020617)" -ForegroundColor White
Write-Host "  • Your logo centered" -ForegroundColor White
Write-Host "  • Then transition to the animated Flutter splash" -ForegroundColor White
Write-Host ""
