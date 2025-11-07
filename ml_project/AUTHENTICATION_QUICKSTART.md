# Quick Start - Authentication Setup

This guide will help you quickly set up and test the Mobile + OTP authentication flow.

## Prerequisites

Before you begin, ensure you have:
- ✅ Flutter SDK installed (>=3.8.1)
- ✅ An IDE (VS Code or Android Studio)
- ✅ An emulator or physical device
- ✅ Backend API running (or use mock mode)

## Step 1: Install Dependencies

Run the following command in the project root:

```powershell
flutter pub get
```

This will install all required packages including:
- `country_code_picker` - For mobile number country codes
- `pinput` - For OTP input
- `flutter_image_compress` - For profile photo compression
- `image_picker` - For camera/gallery access
- `intl` - For date formatting
- `email_validator` - For email validation

## Step 2: Configure API Endpoint

Update `lib/config/api_config.dart` with your backend URL:

```dart
class ApiConfig {
  static const String baseUrl = 'http://YOUR_IP:3000/api';
  
  // Common configurations:
  // Android Emulator: 'http://10.0.2.2:3000/api'
  // iOS Simulator: 'http://localhost:3000/api'
  // Physical Device: 'http://YOUR_LOCAL_IP:3000/api'
}
```

## Step 3: Run the App

```powershell
# List available devices
flutter devices

# Run on specific device
flutter run -d <device-id>

# Run on Windows
flutter run -d windows
```

## Step 4: Test Authentication Flow

### Test Scenario 1: New User Registration

1. **Launch App** → You'll see the animated splash screen (2 seconds)

2. **Login Screen** → Enter mobile number
   - Select country code (default: +91 India)
   - Enter 10-digit mobile number
   - Tap "Send OTP"

3. **OTP Screen** → Verify OTP
   - Enter the 6-digit OTP (check SMS or use mock: `123456`)
   - OTP auto-verifies on 6th digit
   - Timer shows 30 seconds countdown
   - Can resend OTP after timer expires
   - Maximum 3 attempts allowed

4. **Signup Screen** → Complete profile (New Users Only)
   - **Profile Photo**: Tap camera icon to select from camera/gallery
   - **Full Name**: Enter first and last name (min 2 words)
   - **Date of Birth**: Tap to open date picker
   - **Gender**: Select from dropdown
   - **Email**: Optional, but validated if filled
   - **Mobile**: Pre-filled and disabled
   - Tap "Create Account"

5. **Home Screen** → You're in! 🎉

### Test Scenario 2: Existing User Login

1. **Launch App** → Splash screen

2. **Login Screen** → Enter registered mobile number

3. **OTP Screen** → Verify OTP

4. **Home Screen** → Directly navigates (skips signup)

## Step 5: Test UI Features

### Dark Mode Toggle
- Go to device settings
- Toggle between light/dark mode
- App automatically adapts with gradient color schemes

### Form Validation
- Try submitting empty fields → See error messages
- Type invalid email → See validation error
- Enter single word name → See "min 2 words" error
- Try selecting future date → Only past dates allowed

### Image Upload
- Tap camera icon on signup
- Select "Camera" or "Gallery"
- Image auto-compresses to < 300KB
- Preview shows immediately
- Can remove and re-pick

### OTP Features
- Paste OTP from clipboard
- Auto-advance on digit entry
- Clear button resets all fields
- Change number goes back to login
- Resend timer countdown
- Attempt tracking (3 max)

## Mock Mode (No Backend)

The authentication screens work with mock API responses by default:

### Mock OTP
- Any mobile number works
- OTP: `123456` (hardcoded in mock)
- Automatically marks as new user

### Mock Responses
```dart
// Login - lib/screens/auth/login_mobile_screen.dart (line 95)
final response = {'success': true, 'message': 'OTP sent successfully'};

// OTP Verify - lib/screens/auth/otp_screen.dart (line 105)
final response = {
  'success': true,
  'data': {'isNewUser': true}
};

// Signup - lib/screens/auth/signup_screen.dart (line 352)
final response = {'success': true, 'message': 'Account created successfully'};
```

To enable real API calls, uncomment the actual API calls in each file:
```dart
// Uncomment this:
final response = await ApiClient().requestOtp(mobile);

// Comment out this:
// final response = {'success': true, ...};
```

## Troubleshooting

### Issue: "Package not found"
**Solution:** Run `flutter pub get`

### Issue: "No device available"
**Solution:** Start an emulator or connect a device, then run `flutter devices`

### Issue: Image picker not working
**Solution (Android):** Add permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

**Solution (iOS):** Add to `ios/Runner/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take profile photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select profile photos</string>
```

### Issue: Date picker shows wrong format
**Solution:** The app uses `dd-MM-yyyy` format. Check device locale settings.

### Issue: Gradient not showing
**Solution:** Ensure Material 3 theme is enabled in `main.dart`:
```dart
theme: ThemeData(
  useMaterial3: true,
  // ...
)
```

### Issue: Button stays disabled on signup
**Solution:** Fill all required fields:
- Full name (min 2 words)
- Date of birth (must select date)
- Mobile (should be pre-filled)
- Email (optional, but must be valid if filled)

## Testing Checklist

Before considering the feature complete, test:

- [ ] Splash animation plays smoothly
- [ ] Can select different country codes
- [ ] Mobile validation works (10 digits, numeric only)
- [ ] OTP input accepts 6 digits
- [ ] OTP paste from clipboard works
- [ ] Resend timer counts down from 30
- [ ] Attempt limit blocks after 3 tries
- [ ] Photo picker opens camera
- [ ] Photo picker opens gallery
- [ ] Image compresses < 300KB
- [ ] Date picker only allows past dates
- [ ] Gender dropdown shows all options
- [ ] Email validation works
- [ ] Full name requires 2+ words
- [ ] Create Account button enables/disables correctly
- [ ] Loading indicators show during API calls
- [ ] Error messages display inline
- [ ] Success navigates to home
- [ ] Dark mode works correctly
- [ ] Back navigation works on all screens

## Next Steps

1. **Connect Real Backend**
   - Implement OTP sending service (Twilio, AWS SNS, etc.)
   - Create backend endpoints (see `AUTHENTICATION_FLOW.md`)
   - Update ApiClient methods with real API calls

2. **Add Biometric Auth**
   - Install `local_auth` package
   - Implement fingerprint/face ID
   - Store encrypted credentials

3. **Enhance UX**
   - Add auto-detect country from SIM
   - Implement smart retry logic
   - Add progressive profile completion

4. **Security Enhancements**
   - Implement rate limiting
   - Add device fingerprinting
   - Enable two-factor authentication

## Resources

- 📖 **Full Documentation:** [AUTHENTICATION_FLOW.md](./AUTHENTICATION_FLOW.md)
- 🎨 **Design Specs:** Material 3 Design System
- 📦 **Dependencies:** [pubspec.yaml](./pubspec.yaml)
- 🔧 **API Client:** [lib/services/api_client.dart](./lib/services/api_client.dart)

## Support

If you encounter issues:
1. Check this guide first
2. Review `AUTHENTICATION_FLOW.md` for detailed info
3. Check error logs: `flutter logs`
4. Open an issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Device/emulator info

---

**Happy Coding! 🚀**
