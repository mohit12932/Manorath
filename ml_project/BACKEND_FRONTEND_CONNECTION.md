# Backend and Frontend Connection Summary

## ✅ Backend Configuration Complete

### Dependencies Installed:
- ✅ Express 4.18.2 (Web framework)
- ✅ TypeScript 5.3.3 (Type safety)
- ✅ Prisma 5.7.0 (ORM + Client)
- ✅ JWT (jsonwebtoken 9.0.2)
- ✅ bcryptjs 2.4.3 (Password hashing)
- ✅ Zod 3.22.4 (Validation)
- ✅ Multer (File uploads)
- ✅ Helmet + CORS (Security)
- ✅ Pino (Logging)
- ✅ All type definitions (@types/*)

### API Routes Created:

#### Authentication Routes (`/auth`)
- `POST /auth/request-otp` - Request OTP (rate limited: 5/min)
- `POST /auth/verify-otp` - Verify OTP and get temporary token
- `POST /auth/signup` - Complete signup (requires temp token from OTP verification)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate session

#### User Routes (`/`)
- `GET /me` - Get current user profile (requires auth)
- `PUT /me` - Update user profile (requires auth)

#### Upload Routes (`/upload`)
- `POST /upload/profile-photo` - Upload profile photo (multipart/form-data)
  - Accepts: JPEG, PNG, WebP
  - Max size: 5MB
  - Returns: File URL

#### Static Files
- `GET /uploads/*` - Serve uploaded images

#### Health Check
- `GET /healthz` - Server health status

---

## ✅ Frontend (Flutter) Configuration Complete

### API Configuration:
- **Base URL**: `http://10.0.2.2:3000` (Android emulator)
- **Backend CORS**: Configured to accept `http://10.0.2.2:3000`

### API Client Methods:
- `requestOtp(mobile)` → `POST /auth/request-otp`
- `verifyOtp(mobile, code)` → `POST /auth/verify-otp`
- `signup(payload)` → `POST /auth/signup`
- `uploadPhoto(filePath)` → `POST /upload/profile-photo`

### Authentication Flow:
1. **LoginMobileScreen**: User enters mobile number
2. **Request OTP**: Flutter calls `requestOtp()` → Backend sends OTP (console log)
3. **OtpScreen**: User enters OTP from backend console
4. **Verify OTP**: Flutter calls `verifyOtp()` → Backend returns temp token
5. **SignupScreen**: User fills 16 fields + uploads photo
6. **Upload Photo**: Flutter calls `uploadPhoto()` → Backend returns photo URL
7. **Complete Signup**: Flutter calls `signup()` with temp token → Backend creates user, returns access token

---

## 🔄 Request/Response Flow

### 1. Request OTP
**Flutter Request:**
```dart
await apiClient.requestOtp('+919876543210');
```

**Backend Endpoint:**
```
POST http://10.0.2.2:3000/auth/request-otp
Content-Type: application/json

{
  "mobile": "+919876543210"
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "expiresAt": "2025-11-05T14:15:00.000Z"
  }
}
```

**Backend Console Output:**
```
[INFO] POST /auth/request-otp
[INFO] 📱 OTP Code: 123456 (Valid for 5 minutes)
```

### 2. Verify OTP
**Flutter Request:**
```dart
await apiClient.verifyOtp('+919876543210', '123456');
```

**Backend Endpoint:**
```
POST http://10.0.2.2:3000/auth/verify-otp
Content-Type: application/json

{
  "mobile": "+919876543210",
  "otp": "123456"
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "requiresSignup": true
  }
}
```

### 3. Upload Photo
**Flutter Request:**
```dart
final result = await apiClient.uploadPhoto('/path/to/image.jpg');
String photoUrl = result['data']['url'];
```

**Backend Endpoint:**
```
POST http://10.0.2.2:3000/upload/profile-photo
Content-Type: multipart/form-data

photo: <binary file data>
```

**Backend Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "/uploads/profile-1699200000000-123456789.jpg",
    "filename": "profile-1699200000000-123456789.jpg",
    "size": 245678,
    "mimetype": "image/jpeg"
  }
}
```

### 4. Complete Signup
**Flutter Request:**
```dart
await apiClient.signup({
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
  "pinCode": "400001",
  "profilePhoto": "/uploads/profile-1699200000000-123456789.jpg"
});
```

**Backend Endpoint:**
```
POST http://10.0.2.2:3000/auth/signup
Authorization: Bearer <temp_token_from_otp_verification>
Content-Type: application/json

{
  "name": "John Doe",
  "dob": "1990-01-01",
  ...all 16 fields
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": {
      "id": "abc123",
      "name": "John Doe",
      "mobile": "+919876543210",
      ...all user fields
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

## 🔒 Security Features

### Backend:
- ✅ OTP hashed with bcrypt before storing
- ✅ JWT with access (15min) + refresh (30d) tokens
- ✅ Rate limiting (5 OTP requests/minute)
- ✅ CORS configured for Flutter app
- ✅ Helmet security headers
- ✅ Request validation with Zod
- ✅ File upload validation (type, size)

### Flutter:
- ✅ Secure storage for tokens (flutter_secure_storage)
- ✅ Automatic token refresh
- ✅ Form validation before submission
- ✅ Image compression before upload

---

## 🚀 How to Test

### 1. Start Backend Server
```powershell
cd "d:\ML project\ml_project\backend-otp"
node node_modules/tsx/dist/cli.mjs src/server.ts
```

Expected output:
```
✅ Database connected
🚀 Server running on http://localhost:3000
📱 SMS Provider: console
📦 Upload Storage: local
```

### 2. Run Flutter App
```powershell
cd "d:\ML project\ml_project"
flutter run -d emulator-5554
```

### 3. Test Flow
1. Open app on emulator
2. Enter mobile number → Click "Send OTP"
3. Check backend console for OTP code
4. Enter OTP → Click "Verify"
5. Fill all 16 signup fields
6. Upload photo → Click "Complete Signup"
7. Verify user is created in database

---

## 📊 Database Schema

### User Table (16 fields):
- id, name, dob, gender, email, mobile
- designationLevel, designation, state, district
- organisationType, whatsappNo, address, pinCode
- profilePhoto, createdAt, updatedAt

### Otp Table:
- id, mobile, code (hashed), expiresAt, attempts, createdAt

### Session Table:
- id, userId, refreshToken, userAgent, ipAddress, expiresAt, createdAt

---

## ✅ Connection Status

- ✅ Backend API running on `localhost:3000`
- ✅ Frontend configured to `http://10.0.2.2:3000`
- ✅ CORS enabled for Android emulator
- ✅ All routes created and tested
- ✅ File upload configured with multer
- ✅ Static file serving enabled
- ✅ Database connected with Prisma
- ✅ All dependencies installed
- ✅ No TypeScript compilation errors

**🎉 Backend and Frontend are precisely connected and ready to use!**
