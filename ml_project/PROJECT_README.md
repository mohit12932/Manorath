# Event Manager Project

A full-stack mobile application for event management.

## Quick Start

This repository contains both Flutter frontend and Node.js backend.

### 1. Start Backend
```powershell
cd backend
npm install
cp .env.example .env  # Configure MongoDB and JWT_SECRET
npm run dev
```

### 2. Start Frontend
```powershell
cd ml_project
flutter pub get
flutter run -d windows  # or your target device
```

See individual README files for detailed setup:
- `README.md` (this directory) - Main project overview
- `backend/README.md` - Backend API documentation

## Project Overview

- **Frontend**: Flutter mobile app (Android, iOS, Windows, Web)
- **Backend**: Node.js REST API with Express and MongoDB
- **Authentication**: JWT-based
- **State Management**: Provider pattern

For complete documentation, see the main `README.md` file.
