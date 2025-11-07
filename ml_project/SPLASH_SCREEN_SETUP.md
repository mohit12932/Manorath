# Splash Screen Setup Guide

## ✅ What's Been Implemented

### 1. Animated Splash Screen (`lib/screens/splash_screen.dart`)

**Features:**
- ✅ Gradient background with brand colors
  - Light mode: #0F172A → #1E3A8A
  - Dark mode: #020617 → #0B1220
- ✅ Fade-in + scale animation (1.2 seconds duration)
- ✅ Centered app logo with circular container and shadow
- ✅ App name "Event Manager" in bold white text
- ✅ Tagline "Manage your events effortlessly" in white70
- ✅ Circular loading indicator at bottom
- ✅ Version text "v1.0.0 • Beta" with opacity
- ✅ Automatic dark/light mode detection
- ✅ Smooth fade transition to next screen (400ms)
- ✅ Safe area awareness
- ✅ Fully centered and responsive layout

### 2. Native Splash Screen Configuration

**Files Created:**
- `flutter_native_splash.yaml` - Configuration file
- `assets/images/` - Directory for logo
- `pubspec.yaml` - Updated with assets and dependency

## 🚀 Next Steps to Complete Setup

### Step 1: Install Dependencies

```powershell
flutter pub get
```

### Step 2: Create Your Logo (Optional - Currently uses Material Icon)

The app currently uses a Material Icons event icon. To add a custom logo:

1. **Create a logo image:**
   - Size: 512x512 pixels (recommended)
   - Format: PNG with transparent background
   - Name: `logo.png`

2. **Place the logo:**
   ```
   assets/images/logo.png
   ```

3. **Generate native splash screens:**
   ```powershell
   dart run flutter_native_splash:create
   ```

This command will automatically:
- Generate Android splash screens (including Android 12+)
- Generate iOS splash screens
- Use your brand colors (#0F172A for light, #020617 for dark)
- Center your logo on the splash screen

### Step 3: Test the Splash Screen

Run the app:

```powershell
# Windows
flutter run -d windows

# Android
flutter run -d <android-device-id>

# iOS
flutter run -d <ios-device-id>
```

## 🎨 Animation Timeline

The splash screen follows this smooth animation sequence:

```
0ms     : Screen appears with gradient background
0-800ms : Logo, name, and tagline fade in and scale up (ease-out cubic)
800ms   : Animation complete, all elements visible
2000ms  : Navigation begins (fade transition to next screen)
2400ms  : New screen fully visible
```

## 🌓 Dark Mode Support

The splash screen automatically detects system theme:

**Light Mode:**
- Background: Deep slate (#0F172A) → Royal blue (#1E3A8A)
- All text: White with appropriate opacity

**Dark Mode:**
- Background: Midnight (#020617) → Dark slate (#0B1220)
- All text: White with appropriate opacity

## 📱 Native Splash Screen Behavior

**Before Flutter loads (native splash):**
- Shows solid color background (#0F172A or #020617)
- Shows your logo centered
- No animation (native constraint)

**After Flutter loads (animated splash):**
- Beautiful gradient background
- Smooth fade-in + scale animation
- Loading indicator
- Version information

## 🔧 Customization Options

### Change Brand Colors

Edit `lib/screens/splash_screen.dart`:

```dart
final gradientColors = isDarkMode
    ? [const Color(0xFF020617), const Color(0xFF0B1220)]  // Dark mode
    : [const Color(0xFF0F172A), const Color(0xFF1E3A8A)]; // Light mode
```

Also update `flutter_native_splash.yaml`:

```yaml
color: "#YourLightColor"
color_dark: "#YourDarkColor"
```

### Change Tagline

Edit line ~149 in `splash_screen.dart`:

```dart
'Your new tagline here',
```

### Change Animation Duration

Edit line ~29:

```dart
duration: const Duration(milliseconds: 1200), // Change this
```

### Change Display Time

Edit line ~54:

```dart
await Future.delayed(const Duration(seconds: 2)); // Change this
```

## 🎯 Features Breakdown

### Gradient Background
- Uses `LinearGradient` from top-left to bottom-right
- Automatically switches based on system theme
- Smooth color transitions

### Logo Container
- Circular shape with semi-transparent white background
- Soft shadow for depth (blur: 20, offset: 10)
- 80px icon size, white color

### Typography
- **App Name:** 36px, bold, white, letter-spacing: 1.2
- **Tagline:** 16px, white70, letter-spacing: 0.5
- **Version:** 12px, white50, letter-spacing: 1.0

### Animations
- **Fade:** 0 → 1 over first 65% of duration
- **Scale:** 0.8 → 1 over first 65% of duration
- **Curves:** easeOut for fade, easeOutCubic for scale (smooth, not jarring)

### Layout Spacing
- Uses Spacer with flex for perfect vertical centering
- Safe area aware (respects notches, status bars)
- 32px padding at bottom for version text

## 🐛 Troubleshooting

### Issue: "Target of URI doesn't exist: 'assets/images/logo.png'"

**Solution:** Either:
1. Add a logo.png file to `assets/images/`
2. Comment out the native splash config in `flutter_native_splash.yaml`
3. Use the Material Icons (current default - no action needed)

### Issue: Native splash not updating

**Solution:**
```powershell
# Regenerate native splash screens
dart run flutter_native_splash:create

# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

### Issue: Dark mode not switching

**Solution:** The splash screen uses `Theme.of(context).brightness`. Ensure your app's theme is properly configured in `main.dart` with both light and dark themes.

## 📚 Resources

- [Flutter Native Splash Documentation](https://pub.dev/packages/flutter_native_splash)
- [Flutter Animations Guide](https://docs.flutter.dev/ui/animations)
- [Material Design - Dark Theme](https://m3.material.io/styles/color/dark-theme)

## ✨ Result

You now have a production-ready splash screen with:
- Professional gradient animations
- Perfect timing and easing
- Native splash screen support
- Dark/light mode compatibility
- Clean, minimal, startup-grade feel
- Zero jarring motion

The splash screen creates a premium first impression for your Event Manager app!
