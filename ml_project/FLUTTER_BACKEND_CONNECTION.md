# Flutter Backend Connection Guide

## ✅ Configuration Complete!

Your Flutter app is now configured to connect to the Node.js backend.

### API Configuration

**File**: `lib/config/api_config.dart`

```dart
static const String baseUrl = 'http://10.0.2.2:3000';
```

- ✅ **Android Emulator**: `http://10.0.2.2:3000` (configured)
- 📱 **iOS Simulator**: Use `http://localhost:3000`
- 🌐 **Physical Device**: Use your computer's IP (e.g., `http://192.168.1.100:3000`)

---

## 🚀 How to Run

### Step 1: Start Backend Server

```powershell
cd "d:\ML project\ml_project\backend-otp"
node node_modules/tsx/dist/cli.mjs src/server.ts
```

**Expected Output**:
```
✓ Database connected
✓ Server running on http://localhost:3000
✓ SMS Provider: console
✓ Upload Storage: local
```

### Step 2: Run Flutter App

**Android Emulator**:
```powershell
cd "d:\ML project\ml_project"
flutter run
```

**Specific Device**:
```powershell
flutter run -d <device-id>
```

---

## 📱 Testing the Connection

### 1. **Login Screen** (`LoginMobileScreen`)
- Enter mobile number (e.g., `+919876543210`)
- Click "Send OTP"
- Backend will log OTP in terminal (console mode)

### 2. **OTP Screen** (`OtpScreen`)
- Check backend terminal for OTP code
- Enter the 6-digit code
- Click "Verify OTP"

### 3. **Signup Screen** (`SignupScreen`)
- Fill in all 16 fields:
  - Name, DOB, Gender, Email
  - Mobile, Designation Level, Designation
  - State, District, Organisation Type
  - WhatsApp No, Full Address, Pin Code
  - Profile Photo
- Click "Complete Signup"

---

## 🔍 Monitoring API Calls

### Backend Terminal Output
When Flutter makes API calls, you'll see logs like:

```
[INFO] POST /auth/request-otp
[INFO] 📱 OTP Code: 123456 (Valid for 5 minutes)
[INFO] POST /auth/verify-otp - Success
[INFO] POST /auth/signup - User created
```

### Flutter Debug Console
You'll see API responses in the Flutter console:

```
{success: true, message: "OTP sent successfully"}
{success: true, data: {token: "eyJhbGc...", user: {...}}}
```

---

## 🛠️ Troubleshooting

### Issue: Connection Refused

**For Android Emulator**:
- ✅ Verify baseUrl is `http://10.0.2.2:3000`
- ✅ Backend server is running on port 3000
- ✅ Check backend CORS includes `http://10.0.2.2:3000`

**For iOS Simulator**:
- Change baseUrl to `http://localhost:3000`

**For Physical Device**:
- Get your computer's IP: `ipconfig` (Windows)
- Use: `http://YOUR_IP:3000`
- Ensure device is on same WiFi network
- Check firewall allows port 3000

### Issue: OTP Not Appearing

**Backend logs show**:
```
[INFO] 📱 OTP Code: 123456 (Valid for 5 minutes)
```

If not visible:
- Backend terminal might be scrolled up
- Check SMS_PROVIDER=console in .env file

### Issue: API Errors

**Check Backend Terminal** for detailed error messages:
```
[ERROR] ValidationError: Invalid mobile number format
[ERROR] RateLimitError: Too many requests
```

**Check Flutter Console** for network errors:
```
ApiException: Invalid mobile number format
```

---

## 🧪 API Endpoints

All endpoints are available at `http://10.0.2.2:3000` (Android emulator):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/request-otp` | Request OTP for mobile number |
| POST | `/auth/verify-otp` | Verify OTP and get temporary token |
| POST | `/auth/signup` | Complete signup with all fields |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and invalidate session |
| GET | `/me` | Get current user profile (requires auth) |
| PUT | `/me` | Update user profile (requires auth) |
| POST | `/upload/profile-photo` | Upload profile photo |

---

## 📝 API Request Examples

### Request OTP
```json
POST /auth/request-otp
{
  "mobile": "+919876543210"
}
```

### Verify OTP
```json
POST /auth/verify-otp
{
  "mobile": "+919876543210",
  "otp": "123456"
}
```

### Signup
```json
POST /auth/signup
{
  "name": "John Doe",
  "dob": "1990-01-01",
  "gender": "male",
  "email": "john@example.com",
  "mobile": "+919876543210",
  "designationLevel": "Senior",
  "designation": "Software Engineer",
  "state": "Maharashtra",
  "district": "Mumbai",
  "organisationType": "Private",
  "whatsappNo": "+919876543210",
  "address": "123 Main St",
  "pinCode": "400001"
}
```

---

## ✨ Next Steps

1. ✅ Backend server is running
2. ✅ Flutter app is configured
3. 🚀 **Run Flutter app and test the authentication flow!**

```powershell
# Terminal 1: Backend (keep running)
cd "d:\ML project\ml_project\backend-otp"
node node_modules/tsx/dist/cli.mjs src/server.ts

# Terminal 2: Flutter
cd "d:\ML project\ml_project"
flutter run
```

---

## 📚 Additional Resources

- **Backend API Tests**: `backend-otp/api-tests.http`
- **Backend README**: `backend-otp/README.md`
- **Backend Quickstart**: `backend-otp/QUICKSTART.md`
- **Flutter API Client**: `lib/services/api_client.dart`
- **Auth Screens**: `lib/screens/auth/`
