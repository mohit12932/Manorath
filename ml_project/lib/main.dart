import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/event_provider.dart';
import 'providers/simple_event_provider.dart';
import 'providers/contact_provider.dart';
import 'providers/profile_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/dashboard/add_event_screen.dart';
import 'screens/dashboard/contacts_screen.dart';
import 'screens/dashboard/about_screen.dart';
import 'screens/dashboard/profile_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => EventProvider()),
        ChangeNotifierProvider(create: (_) => SimpleEventProvider()),
        ChangeNotifierProvider(create: (_) => ContactProvider()),
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
      ],
      child: MaterialApp(
        title: 'Campus Hub',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          scaffoldBackgroundColor: const Color(0xFF1A1D2E),
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFF5B86E5),
            secondary: Color(0xFF36D1DC),
            surface: Color(0xFF252836),
            background: Color(0xFF1A1D2E),
          ),
          useMaterial3: true,
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF1A1D2E),
            elevation: 0,
            centerTitle: false,
          ),
          cardTheme: CardThemeData(
            color: const Color(0xFF252836),
            elevation: 4,
            shadowColor: Colors.black.withOpacity(0.3),
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(16)),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: const Color(0xFF252836),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF3A3F50)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF3A3F50)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF5B86E5), width: 2),
            ),
            hintStyle: const TextStyle(color: Colors.white38),
            labelStyle: const TextStyle(color: Colors.white70),
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF5B86E5),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 4,
            ),
          ),
          textButtonTheme: TextButtonThemeData(
            style: TextButton.styleFrom(
              foregroundColor: const Color(0xFF5B86E5),
            ),
          ),
          textTheme: const TextTheme(
            displayLarge: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            displayMedium: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            displaySmall: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            headlineLarge: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            headlineMedium: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            headlineSmall: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            titleLarge: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
            titleMedium: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
            titleSmall: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
            bodyLarge: TextStyle(color: Colors.white70),
            bodyMedium: TextStyle(color: Colors.white70),
            bodySmall: TextStyle(color: Colors.white70),
            labelLarge: TextStyle(color: Colors.white),
            labelMedium: TextStyle(color: Colors.white70),
            labelSmall: TextStyle(color: Colors.white60),
          ),
        ),
        themeMode: ThemeMode.light,
        home: const SplashScreen(),
        routes: {
          '/dashboard': (context) => const DashboardScreen(),
          '/add-event': (context) => const AddEventScreen(),
          '/contacts': (context) => const ContactsScreen(),
          '/about': (context) => const AboutScreen(),
          '/profile': (context) => const ProfileScreen(),
        },
      ),
    );
  }
}
