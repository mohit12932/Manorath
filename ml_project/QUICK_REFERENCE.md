# Quick Reference - ML Project

## 🚀 Quick Start Commands

### Start Everything (Windows)
```bash
.\start-all.bat
```

### Start Individually
```bash
# Backend (Port 3000)
cd backend && npm run dev

# Backend-EventHub (Port 3002)
cd backend-eventhub && npm run dev

# Flutter App
flutter run
```

## 📦 Dependency Commands

### Flutter
```bash
flutter pub get           # Install dependencies
flutter pub upgrade       # Update dependencies
flutter pub outdated      # Check outdated packages
flutter clean             # Clean build
```

### Backend
```bash
npm install              # Install dependencies
npm update               # Update dependencies
npm outdated             # Check outdated packages
npm run dev              # Development mode
npm start                # Production mode
```

### Backend-EventHub
```bash
npm install              # Install dependencies
npm run dev              # Development mode
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Database GUI
```

## 🔧 Common Tasks

### Database Setup
```bash
# MongoDB
mongod

# PostgreSQL
createdb eventhub
cd backend-eventhub
npm run prisma:migrate
```

### Troubleshooting
```bash
# Flutter issues
flutter clean && flutter pub get
flutter doctor -v

# Backend issues
rm -rf node_modules && npm install

# Prisma issues
cd backend-eventhub
npm run prisma:generate
npm run prisma:migrate reset
```

## 🌐 URLs

- Backend: http://localhost:3000
- EventHub: http://localhost:3002
- Swagger: http://localhost:3002/api-docs

## 📄 Documentation Files

- `INSTALLATION_COMPLETE.md` - Full installation summary
- `SETUP_GUIDE.md` - Complete setup guide
- `DEPENDENCIES_LIST.md` - All dependencies listed
- `start-all.bat` - Quick start script

## ⚠️ Security Checklist

Before production:
- [ ] Change JWT secrets in `.env` files
- [ ] Update database passwords
- [ ] Set specific CORS origins
- [ ] Enable HTTPS
- [ ] Review security settings

## 🎯 Total Packages Installed

- **Flutter:** 67 packages
- **Backend:** 438 packages
- **Backend-EventHub:** 654 packages
- **Total:** 1,159 packages

---

**Status:** ✅ ALL DEPENDENCIES INSTALLED

**Ready to develop!** 🚀

