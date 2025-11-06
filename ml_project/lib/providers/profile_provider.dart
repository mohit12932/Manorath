import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileProvider with ChangeNotifier {
  String _name = '';
  String _email = '';
  String _phone = '';
  String _photoPath = '';

  String get name => _name;
  String get email => _email;
  String get phone => _phone;
  String get photoPath => _photoPath;

  ProfileProvider() {
    loadProfile();
  }

  Future<void> loadProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _name = prefs.getString('profile_name') ?? '';
      _email = prefs.getString('profile_email') ?? '';
      _phone = prefs.getString('profile_phone') ?? '';
      _photoPath = prefs.getString('profile_photo') ?? '';
      notifyListeners();
    } catch (e) {
      print('Error loading profile: $e');
    }
  }

  Future<void> updateProfile({
    String? name,
    String? email,
    String? phone,
    String? photoPath,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      if (name != null) {
        _name = name;
        await prefs.setString('profile_name', name);
      }

      if (email != null) {
        _email = email;
        await prefs.setString('profile_email', email);
      }

      if (phone != null) {
        _phone = phone;
        await prefs.setString('profile_phone', phone);
      }

      if (photoPath != null) {
        _photoPath = photoPath;
        await prefs.setString('profile_photo', photoPath);
      }

      notifyListeners();
    } catch (e) {
      print('Error updating profile: $e');
    }
  }
}
