# 🚀 Running Flutter App - Quick Guide

## Current Status

Your Flutter app is ready to run! However, there are different options depending on your setup.

---

## ⚠️ Windows Desktop App Issue

**Error:** "Building with plugins requires symlink support"

**Solution:** Enable Developer Mode

### Steps to Enable Developer Mode:
1. I've opened the Developer Mode settings for you (or run: `start ms-settings:developers`)
2. In the Settings window, toggle **"Developer Mode"** to **ON**
3. Restart your terminal
4. Run: `flutter run -d windows`

---

## ✅ Alternative: Run on Web Browser (NO Developer Mode Required)

You can run the Flutter app on Chrome or Edge without needing Developer Mode:

### Option 1: Chrome
```bash
cd "D:\ML project\ml_project"
flutter run -d chrome
```

### Option 2: Edge
```bash
cd "D:\ML project\ml_project"
flutter run -d edge
```

---

## 📱 Android Emulator Setup

Currently, no Android emulator is detected. To set up an Android emulator:

### Using Android Studio:
1. Open Android Studio
2. Go to: Tools → Device Manager
3. Click "Create Device"
4. Select a device (e.g., Pixel 6)
5. Download a system image (recommended: Android 13/14)
6. Create and start the emulator

### Using Command Line:
```bash
# List available emulators
flutter emulators

# Launch an emulator (replace with your emulator name)
flutter emulators --launch <emulator_name>

# Then run Flutter
flutter run
```

---

## 🎯 Quick Start Options

### Option A: Web Browser (Easiest - No Setup Required)
```bash
cd "D:\ML project\ml_project"
flutter run -d chrome
```

### Option B: Windows Desktop (After Enabling Developer Mode)
```bash
cd "D:\ML project\ml_project"
flutter run -d windows
```

### Option C: Android Emulator (After Setup)
```bash
cd "D:\ML project\ml_project"
flutter run
# Select Android emulator from the list
```

---

## 🔍 Available Devices

Currently detected:
- ✅ **Windows (desktop)** - Requires Developer Mode
- ✅ **Chrome (web)** - Ready to use
- ✅ **Edge (web)** - Ready to use
- ❌ **Android Emulator** - Not set up

---

## 📝 Helper Scripts Created

### run-flutter.bat
Runs Flutter and shows available devices:
```bash
.\run-flutter.bat
```

### run-flutter-chrome.bat
Quick launch on Chrome:
```bash
.\run-flutter-chrome.bat
```

---

## 🐛 Troubleshooting

### "Building with plugins requires symlink support"
- **Solution:** Enable Developer Mode (instructions above)
- **Alternative:** Use web version (Chrome/Edge)

### "No devices found"
- **Solution:** 
  - For Android: Start an Android emulator first
  - For Web: Make sure Chrome or Edge is installed
  - For Windows: Enable Developer Mode

### Build Errors
```bash
flutter clean
flutter pub get
flutter run
```

---

## 💡 Recommendation

**For immediate testing:** Use Chrome or Edge browser
```bash
flutter run -d chrome
```

**For full mobile experience:** Set up Android emulator or enable Developer Mode for Windows desktop.

---

**Next Steps:**
1. Choose your preferred platform from above
2. Follow the specific instructions
3. The app will launch automatically

**I'm opening the Developer Mode settings now. Please enable it if you want to run on Windows desktop!**

