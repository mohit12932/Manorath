# EventHub Dashboard - Complete Flutter UI

A modern, clean event management dashboard built with Flutter and Material 3 design principles.

## 📱 Features

### ✨ Core Functionality

- **Event Management**
  - Create, view, and delete events
  - Event cards with image, title, date, and description
  - Direct links to event websites
  - Pull-to-refresh functionality
  - Empty state with helpful prompts

- **Contact Management**
  - Add, view, and delete contacts
  - Contact list with name, phone, and email
  - Detailed bottom sheet view
  - Form validation for all fields

- **Profile Management**
  - Update personal information (name, email, phone)
  - Profile photo upload (camera or gallery)
  - Local data persistence

- **Navigation**
  - Beautiful drawer navigation with icons
  - Named routes for smooth transitions
  - Profile access from app bar
  - Floating action buttons for quick access

### 🎨 Design Features

- **Material 3 Design**
  - Modern card layouts with rounded corners
  - Consistent color scheme
  - Elevated buttons and outlined variants
  - Smooth animations and transitions

- **Dark Mode Support**
  - Automatic system theme detection
  - Optimized colors for both themes
  - Consistent UI across modes

- **Responsive Layout**
  - Adapts to different screen sizes
  - Mobile and tablet friendly
  - Proper padding and spacing

- **Animations**
  - Fade-in animations for event cards
  - Slide transitions
  - Loading states with progress indicators

## 📂 Project Structure

```
lib/
├── main.dart                           # App entry point with routing
├── models/
│   ├── simple_event_model.dart        # Event data model
│   └── contact_model.dart             # Contact data model
├── providers/
│   ├── simple_event_provider.dart     # Event state management
│   ├── contact_provider.dart          # Contact state management
│   └── profile_provider.dart          # Profile state management
└── screens/
    └── dashboard/
        ├── dashboard_screen.dart       # Main dashboard with drawer
        ├── home_screen.dart           # Events list screen
        ├── add_event_screen.dart      # Add new event form
        ├── contacts_screen.dart       # Contacts list & management
        ├── about_screen.dart          # App info & features
        └── profile_screen.dart        # User profile editor
```

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (>=3.8.1)
- Dart SDK
- Android Studio / VS Code
- Android/iOS Emulator or Physical Device

### Required Dependencies

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1              # State management
  shared_preferences: ^2.2.2    # Local storage
  image_picker: ^1.0.7          # Photo upload
  intl: ^0.19.0                 # Date formatting
  url_launcher: ^6.2.4          # Open external links
```

### Installation

1. **Clone or create the project**
   ```bash
   cd your_project_directory
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

## 📱 Screens Overview

### 1. Dashboard Screen
- **Left Drawer Navigation**
  - Home
  - Add Events
  - Contacts
  - About
- **Profile Avatar** (top-right corner)
- **App Header** with gradient background

### 2. Home Screen (Events List)
- Scrollable event cards
- Each card shows:
  - Event banner image
  - Title and date
  - Short description
  - "View More" button (opens external website)
  - Delete button
- **Floating Action Button** for quick event creation
- **Pull-to-Refresh** gesture
- **Empty State** with illustration when no events

### 3. Add Event Screen
- Form fields:
  - Event Title (required, min 3 chars)
  - Description (required, min 10 chars)
  - Image URL (validated URL)
  - Website Link (validated URL)
  - Date Picker (future dates only)
- Full form validation
- Success snackbar on submission
- Auto-navigation back to home

### 4. Contacts Screen
- Contact list with ListTiles
- Each contact shows:
  - Avatar with initial
  - Name
  - Phone number
  - Email address
- **Floating Action Button** to add new contact
- **Bottom Sheet** for detailed view
- Delete confirmation dialog

### 5. About Screen
- App logo and tagline
- App description
- Key features list
- Quick tips
- Developer information
- Version number
- "Send Feedback" button

### 6. Profile Screen
- Circular profile photo
- "Change Photo" button (camera/gallery picker)
- Editable fields:
  - Name
  - Email
  - Phone
- "Save Changes" button
- Local data persistence

## 🛠️ State Management

Uses **Provider** pattern for global state:

```dart
// Event state
SimpleEventProvider
  - loadEvents()
  - addEvent(event)
  - deleteEvent(id)

// Contact state
ContactProvider
  - loadContacts()
  - addContact(contact)
  - deleteContact(id)

// Profile state
ProfileProvider
  - loadProfile()
  - updateProfile(name, email, phone, photoPath)
```

## 💾 Data Persistence

All data is stored locally using `shared_preferences`:

- **Events**: `dashboard_events` key
- **Contacts**: `contacts` key
- **Profile**: Individual keys (`profile_name`, `profile_email`, etc.)
- **Profile Photo**: File path stored

## 🎨 Theming

### Light Theme
- Primary Color: Blue
- Card elevation: 2
- Rounded corners: 16px
- Filled input fields

### Dark Theme
- Auto-adjusts colors for dark mode
- Maintains consistency with light theme
- Optimized contrast ratios

## 🔗 Named Routes

```dart
routes: {
  '/dashboard': DashboardScreen(),
  '/home': HomeScreen(),
  '/add-event': AddEventScreen(),
  '/contacts': ContactsScreen(),
  '/about': AboutScreen(),
  '/profile': ProfileScreen(),
}
```

## ✅ Form Validation

### Add Event Form
- Title: 3+ characters
- Description: 10+ characters
- Image URL: Valid HTTP(S) URL
- Website Link: Valid HTTP(S) URL
- Date: Required selection

### Add Contact Form
- Name: Required, 2+ characters
- Phone: Required, 10+ digits
- Email: Valid email format

### Profile Form
- Name: Required, 2+ characters
- Email: Valid email format
- Phone: 10+ digits

## 📸 Image Handling

Using `image_picker` package:
- Camera capture
- Gallery selection
- Auto-resize to 800x800
- Quality compression (85%)
- File path storage

## 🌐 External Links

Using `url_launcher` package:
- Opens event websites in external browser
- LaunchMode: `externalApplication`
- Error handling with snackbar

## 🎭 Animations

- **Fade In**: Event cards with staggered delay
- **Slide Up**: Smooth card entrance
- **CurvedAnimation**: Easing curves for natural feel
- **Loading States**: Circular progress indicators

## 📝 User Experience Enhancements

1. **Empty States**: Helpful prompts when no data
2. **Loading Indicators**: Visual feedback during operations
3. **Success Messages**: Green snackbars for confirmations
4. **Error Handling**: Try-catch with user-friendly messages
5. **Confirmation Dialogs**: Prevent accidental deletions
6. **Bottom Sheets**: Non-intrusive detail views
7. **Pull-to-Refresh**: Intuitive data refresh

## 🎯 Best Practices

- ✅ Material 3 design guidelines
- ✅ Proper state management with Provider
- ✅ Form validation on all inputs
- ✅ Error boundary handling
- ✅ Responsive layouts
- ✅ Accessibility considerations
- ✅ Clean code structure
- ✅ Proper widget disposal
- ✅ Efficient rebuilds with Consumer

## 🚦 Usage Tips

1. **Adding Events**: Use the + FAB or drawer menu
2. **Viewing Event Details**: Tap "View More" to visit website
3. **Managing Contacts**: Tap contact for full details
4. **Updating Profile**: Tap avatar in top-right corner
5. **Theme Toggle**: Follows system dark mode setting
6. **Refreshing Data**: Pull down on events list

## 🔧 Customization

### Change Primary Color
Edit `main.dart`:
```dart
colorScheme: ColorScheme.fromSeed(
  seedColor: Colors.blue, // Change this
  brightness: Brightness.light,
),
```

### Modify Card Radius
Edit theme in `main.dart`:
```dart
cardTheme: CardThemeData(
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.all(Radius.circular(16)), // Adjust this
  ),
),
```

## 📱 Platform Support

- ✅ Android
- ✅ iOS
- ✅ Web (limited - image picker not fully supported)
- ✅ Windows (partial)
- ✅ macOS (partial)
- ✅ Linux (partial)

## 🎉 Key Highlights

- **Zero Backend**: All data stored locally
- **Offline First**: Works without internet
- **Fast & Responsive**: Optimized performance
- **Modern UI**: Latest Material 3 design
- **Easy to Extend**: Clean architecture
- **Well Documented**: Comprehensive comments

## 📄 License

This project is open source and available for use in your applications.

## 👨‍💻 Developer

Built with ❤️ using Flutter & Material 3

---

**Version**: 1.0.0  
**Last Updated**: November 5, 2025  
**Tagline**: *Plan. Connect. Manage Events Better.*
