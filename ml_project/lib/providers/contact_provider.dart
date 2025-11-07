import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/contact_model.dart';

class ContactProvider with ChangeNotifier {
  List<Contact> _contacts = [];
  bool _isLoading = false;

  List<Contact> get contacts => [..._contacts];
  bool get isLoading => _isLoading;

  ContactProvider() {
    loadContacts();
  }

  Future<void> loadContacts() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final contactsJson = prefs.getString('contacts');

      if (contactsJson != null) {
        final List<dynamic> decoded = json.decode(contactsJson);
        _contacts = decoded.map((c) => Contact.fromJson(c)).toList();
      }
    } catch (e) {
      print('Error loading contacts: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addContact(Contact contact) async {
    _contacts.add(contact);
    await _saveContacts();
    notifyListeners();
  }

  Future<void> updateContact(String id, Contact updatedContact) async {
    final index = _contacts.indexWhere((c) => c.id == id);
    if (index != -1) {
      _contacts[index] = updatedContact;
      await _saveContacts();
      notifyListeners();
    }
  }

  Future<void> deleteContact(String id) async {
    _contacts.removeWhere((c) => c.id == id);
    await _saveContacts();
    notifyListeners();
  }

  Future<void> _saveContacts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final contactsJson = json.encode(
        _contacts.map((c) => c.toJson()).toList(),
      );
      await prefs.setString('contacts', contactsJson);
    } catch (e) {
      print('Error saving contacts: $e');
    }
  }
}
