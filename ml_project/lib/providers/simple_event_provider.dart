import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/simple_event_model.dart';

class SimpleEventProvider with ChangeNotifier {
  List<SimpleEvent> _events = [];
  bool _isLoading = false;

  List<SimpleEvent> get events => [..._events];
  bool get isLoading => _isLoading;

  SimpleEventProvider() {
    loadEvents();
  }

  Future<void> loadEvents() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final eventsJson = prefs.getString('dashboard_events');

      if (eventsJson != null) {
        final List<dynamic> decoded = json.decode(eventsJson);
        _events = decoded.map((e) => SimpleEvent.fromJson(e)).toList();
      }
    } catch (e) {
      print('Error loading events: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addEvent(SimpleEvent event) async {
    _events.insert(0, event);
    await _saveEvents();
    notifyListeners();
  }

  Future<void> updateEvent(String id, SimpleEvent updatedEvent) async {
    final index = _events.indexWhere((e) => e.id == id);
    if (index != -1) {
      _events[index] = updatedEvent;
      await _saveEvents();
      notifyListeners();
    }
  }

  Future<void> deleteEvent(String id) async {
    _events.removeWhere((e) => e.id == id);
    await _saveEvents();
    notifyListeners();
  }

  Future<void> _saveEvents() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final eventsJson = json.encode(_events.map((e) => e.toJson()).toList());
      await prefs.setString('dashboard_events', eventsJson);
    } catch (e) {
      print('Error saving events: $e');
    }
  }
}
