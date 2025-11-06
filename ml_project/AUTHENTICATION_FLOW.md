# Authentication Flow Documentation

## Overview

This document describes the Mobile + OTP authentication flow implemented in the ML Project Event Manager app. The flow follows Material 3 design principles with beautiful animations and comprehensive form validation.

## Authentication Flow

```
┌─────────────────┐
│  Splash Screen  │
│  (2s animation) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Login (Mobile)  │
│  + Country Code │
└────────┬────────┘
         │ Send OTP
         ▼
┌─────────────────┐
│  OTP Verify     │
│  (6 digits)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
New User    Existing
    │         │
    ▼         │
┌─────────┐   │
│ Signup  │   │
│ Screen  │   │
└────┬────┘   │
     │        │
     └────┬───┘
          ▼
   ┌──────────────┐
   │ Home Screen  │
   └──────────────┘
```

## Screen Details

### 1. Splash Screen
**File:** `lib/screens/splash_screen.dart`

**Features:**
- Animated gradient background (light/dark mode)
- Fade and scale animations for logo/text
- 2-second display duration
- Smooth fade transition to login

**Behavior:**
- Checks authentication status from `AuthProvider`
- Navigates to Home if authenticated
- Navigates to Login Mobile Screen if not authenticated

---

### 2. Login Mobile Screen
**File:** `lib/screens/auth/login_mobile_screen.dart`

**Features:**
- Material 3 design with gradient header
- Country code picker (default: +91 India)
- Mobile number input with validation
- Fade and slide animations
- Real-time form validation
- Loading state with overlay
- Inline error messages

**Form Fields:**
- **Country Code:** Dropdown with flag icons
- **Mobile Number:** 
  - Numeric input only
  - Max 10 digits
  - Required field validation

**Validations:**
- Must be numeric
- Minimum 10 digits
- Maximum 10 digits for most countries

**User Actions:**
- **Send OTP Button:** Triggers OTP API call, navigates to OTP screen
- **Login with Email:** Link to old email/password login (backward compatibility)

**API Integration:**
```dart
// In production, this calls:
final response = await ApiClient().requestOtp(mobile);
```

---

### 3. OTP Verification Screen
**File:** `lib/screens/auth/otp_screen.dart`

**Dependencies:**
- `pinput: ^3.0.1` - For beautiful OTP input

**Features:**
- 6-digit OTP input with Pinput widget
- Auto-focus on mount
- Paste support from clipboard
- 30-second resend timer with countdown
- 3 attempt limit
- Change number option
- Material 3 gradient header
- Smooth animations

**Form Fields:**
- **OTP Input:** 6 boxes, numeric only, auto-advance

**Validations:**
- Must be exactly 6 digits
- Automatically validates on completion

**User Actions:**
- **Auto-verify:** When 6 digits entered
- **Resend OTP:** Available after 30 seconds
- **Change Number:** Go back to login screen

**Attempt Tracking:**
- 3 attempts allowed
- After 3 failed attempts, auto-redirect to login
- Timer resets on successful resend

**API Integration:**
```dart
// In production, this calls:
final response = await ApiClient().verifyOtp(mobile, otp);

// Response structure:
{
  'success': true,
  'data': {
    'isNewUser': true/false,
    'token': 'jwt_token_here'
  }
}
```

**Navigation Logic:**
- If `isNewUser = true`: Navigate to Signup Screen
- If `isNewUser = false`: Navigate to Home Screen

---

### 4. Signup Screen
**File:** `lib/screens/auth/signup_screen.dart`

**Dependencies:**
- `image_picker: ^1.0.4` - Camera/Gallery selection
- `flutter_image_compress: ^2.1.0` - Image compression
- `intl: ^0.18.1` - Date formatting
- `email_validator: ^2.1.17` - Email validation
- `country_code_picker: ^3.0.0` - Country code selection

**Features:**
- Material 3 design with gradient header
- Profile photo upload with compression
- Comprehensive form with validation
- Real-time error clearing
- Disabled button until form valid
- Loading overlay during submission
- Fade and slide animations

**Form Fields:**

1. **Profile Photo** (Optional)
   - Camera or Gallery picker
   - Image preview in circular avatar
   - Automatic compression to < 300 KB
   - Option to re-pick or remove
   - Formats: JPG/PNG

2. **Full Name** (Required)
   - Text input with capitalization
   - Minimum 2 words validation
   - Example: "John Doe"
   - Error: "Please enter at least first and last name"

3. **Date of Birth** (Required)
   - Date picker (only past dates allowed)
   - Format: dd-MM-yyyy
   - Range: 1900 to today
   - Age calculation possible

4. **Gender** (Required)
   - Dropdown with options:
     - Male
     - Female
     - Other
     - Prefer not to say
   - Default: "Prefer not to say"

5. **Email** (Optional)
   - Email format validation
   - Only validated if filled
   - Error: "Please enter a valid email"

6. **Mobile Number** (Pre-filled, Read-only)
   - Auto-filled from OTP verification
   - Includes country code picker
   - Disabled input (already verified)

**Validations:**
- Full Name: Required, min 2 words
- DOB: Required, must be past date
- Gender: Required (dropdown selection)
- Email: Optional, but must be valid format if filled
- Mobile: Required (pre-filled from previous screen)

**Form State:**
- Button disabled until all required fields valid
- Real-time validation on field change
- Clear inline errors on field focus

**Image Compression:**
```dart
// Compression settings:
- Quality: 70% (first pass), 50% (second pass if needed)
- Max dimensions: 800x800 (first pass), 600x600 (second pass)
- Target size: < 300 KB
- Output format: JPEG
```

**API Integration:**
```dart
// Profile photo upload
final photoResponse = await ApiClient().uploadPhoto(filePath);

// Signup API call
final response = await ApiClient().signup({
  'fullName': 'John Doe',
  'dob': '2000-01-01T00:00:00.000Z',
  'gender': 'Male',
  'email': 'john@example.com',
  'mobile': '+911234567890',
  'profilePhoto': 'https://cdn.example.com/photo.jpg'
});
```

**Navigation:**
- On success: Navigate to Home Screen with success snackbar
- On error: Show inline error message

---

## API Client Methods

**File:** `lib/services/api_client.dart`

### 1. Request OTP
```dart
Future<Map<String, dynamic>> requestOtp(String mobile) async {
  final response = await post('/auth/request-otp', {
    'mobile': mobile,
  });
  return response;
}
```

### 2. Verify OTP
```dart
Future<Map<String, dynamic>> verifyOtp(String mobile, String otp) async {
  final response = await post('/auth/verify-otp', {
    'mobile': mobile,
    'otp': otp,
  });
  
  // Save token if successful
  if (response['success'] == true) {
    final token = response['data']['token'];
    await _storage.write(key: 'auth_token', value: token);
  }
  
  return response;
}
```

### 3. Upload Photo
```dart
Future<Map<String, dynamic>> uploadPhoto(String filePath) async {
  final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/upload'));
  request.files.add(await http.MultipartFile.fromPath('photo', filePath));
  
  final streamedResponse = await request.send();
  final response = await http.Response.fromStream(streamedResponse);
  
  return jsonDecode(response.body);
}
```

### 4. Signup
```dart
Future<Map<String, dynamic>> signup(Map<String, dynamic> data) async {
  final response = await post('/auth/signup', data);
  return response;
}
```

---

## Design Specifications

### Material 3 Components Used
- **Elevated Button:** Primary CTA buttons
- **Text Form Field:** All input fields
- **Dropdown Button:** Gender selection
- **Icon Button:** Navigation and actions
- **Snackbar:** Success/error messages
- **Modal Bottom Sheet:** Image source picker
- **Date Picker:** DOB selection
- **Circular Progress Indicator:** Loading states

### Color Scheme

#### Light Mode
- Gradient Header: `#0F172A` → `#1E3A8A` (Slate to Blue)
- Background: System default
- Input fields: `Grey[100]`
- Text: System default

#### Dark Mode
- Gradient Header: `#020617` → `#0B1220` (Deep Slate)
- Background: System default
- Input fields: `Grey[850]`
- Text: System default

### Typography
- **Headers:** 28px, Bold, White
- **Subheaders:** 16px, Medium, White (90% opacity)
- **Labels:** 14px, SemiBold
- **Input Text:** 16px, Regular
- **Button Text:** 16px, SemiBold
- **Hint Text:** 16px, Regular, Grey

### Animations

#### Fade In
- Duration: 800ms
- Curve: `Curves.easeOut`
- Interval: 0.0 - 0.6

#### Slide Up
- Duration: 800ms
- Curve: `Curves.easeOutCubic`
- Interval: 0.2 - 1.0
- Offset: `(0, 0.1)` → `(0, 0)`

#### Scale
- Duration: 1000ms
- Curve: `Curves.elasticOut`
- Scale: `0.5` → `1.0`

### Spacing
- Screen padding: 24px
- Field spacing: 20px
- Button height: 56px
- Avatar size: 120px
- Border radius: 12px (inputs), 30px (containers)

---

## Accessibility Features

### 1. Keyboard Navigation
- Auto-focus on mount (OTP screen)
- Tab order follows visual flow
- Enter key submits forms

### 2. Visual Feedback
- Large tap targets (min 48x48)
- Clear focus states
- Loading indicators
- Error messages below fields

### 3. Screen Reader Support
- Semantic labels on all inputs
- Error announcements
- Button state descriptions

### 4. Error Handling
- Inline error messages
- Clear validation feedback
- Retry mechanisms

---

## Error States

### Network Errors
```dart
try {
  final response = await apiClient.requestOtp(mobile);
} catch (e) {
  // Show error: "Network error. Please check your connection."
}
```

### Validation Errors
- Empty required fields
- Invalid format (email, mobile)
- Minimum length not met
- Maximum attempts exceeded

### API Errors
- OTP expired
- Invalid OTP
- User already exists
- Server error

**Error Display:**
- Inline below fields (form errors)
- Snackbar at bottom (API errors)
- Alert dialog (critical errors)

---

## Testing Checklist

### Login Screen
- [ ] Country code picker opens
- [ ] Can select different countries
- [ ] Mobile validation works
- [ ] Send OTP button enables/disables
- [ ] Loading state shows
- [ ] Error messages display
- [ ] Can navigate back
- [ ] Animations play smoothly

### OTP Screen
- [ ] Auto-focus on OTP input
- [ ] Can type 6 digits
- [ ] Can paste OTP
- [ ] Timer counts down
- [ ] Resend button enables at 0
- [ ] Attempt tracking works
- [ ] Change number goes back
- [ ] Error messages display
- [ ] Navigates to signup/home

### Signup Screen
- [ ] Photo picker opens
- [ ] Camera works
- [ ] Gallery works
- [ ] Image preview shows
- [ ] Image compresses < 300KB
- [ ] Can remove photo
- [ ] Full name validates
- [ ] DOB picker opens
- [ ] Past dates only
- [ ] Gender dropdown works
- [ ] Email validates
- [ ] Mobile pre-filled
- [ ] Button disables/enables
- [ ] Loading overlay shows
- [ ] Success navigates to home

---

## Backend Requirements

### API Endpoints

#### 1. Request OTP
```
POST /auth/request-otp
Body: { "mobile": "+911234567890" }
Response: { 
  "success": true, 
  "message": "OTP sent successfully",
  "data": { "otpId": "uuid" }
}
```

#### 2. Verify OTP
```
POST /auth/verify-otp
Body: { "mobile": "+911234567890", "otp": "123456" }
Response: { 
  "success": true, 
  "message": "OTP verified",
  "data": { 
    "isNewUser": true,
    "token": "jwt_token",
    "user": { ... }
  }
}
```

#### 3. Upload Photo
```
POST /upload
Body: FormData with file
Response: { 
  "success": true, 
  "data": { 
    "url": "https://cdn.example.com/photo.jpg" 
  }
}
```

#### 4. Signup
```
POST /auth/signup
Body: {
  "fullName": "John Doe",
  "dob": "2000-01-01T00:00:00.000Z",
  "gender": "Male",
  "email": "john@example.com",
  "mobile": "+911234567890",
  "profilePhoto": "https://cdn.example.com/photo.jpg"
}
Response: { 
  "success": true, 
  "message": "Account created",
  "data": { 
    "token": "jwt_token",
    "user": { ... }
  }
}
```

---

## Future Enhancements

1. **Biometric Authentication**
   - Fingerprint/Face ID for quick login
   - Store encrypted credentials

2. **Social Login**
   - Google Sign In
   - Apple Sign In
   - Facebook Login

3. **Progressive Disclosure**
   - Skip optional fields initially
   - Complete profile later

4. **Enhanced Security**
   - OTP rate limiting
   - Device fingerprinting
   - Two-factor authentication

5. **UX Improvements**
   - Remember country code
   - Auto-detect country from SIM
   - Smart retry logic

---

## Dependencies Summary

```yaml
dependencies:
  flutter_secure_storage: ^9.0.0  # Token storage
  http: ^1.1.0                    # HTTP client
  dio: ^5.4.0                     # Advanced HTTP client
  provider: ^6.1.1                # State management
  country_code_picker: ^3.0.0     # Country selection
  pinput: ^3.0.1                  # OTP input
  image_picker: ^1.0.4            # Camera/Gallery
  flutter_image_compress: ^2.1.0  # Image compression
  intl: ^0.18.1                   # Date formatting
  email_validator: ^2.1.17        # Email validation
```

---

## Troubleshooting

### Common Issues

**1. Image compression fails**
- Check file permissions
- Ensure sufficient storage
- Try different image formats

**2. OTP not received**
- Check SMS permissions
- Verify phone number format
- Check network connection

**3. Date picker shows wrong format**
- Verify device locale settings
- Check intl package version

**4. Country code picker not showing flags**
- Ensure assets are included
- Check pubspec.yaml configuration

**5. Button stays disabled**
- Check all validations
- Verify form state updates
- Debug _validateForm() calls

---

## License

This authentication flow implementation is part of the ML Project Event Manager application.

---

**Last Updated:** 2024
**Version:** 1.0.0
