import '../models/event_model.dart';
import 'api_client.dart';

class EventService {
  final ApiClient _apiClient = ApiClient();

  Future<List<Event>> getAllEvents({
    int page = 1,
    int pageSize = 10,
    String? search,
    DateTime? from,
    DateTime? to,
    bool? published,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, String>{
        'page': page.toString(),
        'pageSize': pageSize.toString(),
        if (search != null && search.isNotEmpty) 'q': search,
        if (from != null) 'from': from.toIso8601String(),
        if (to != null) 'to': to.toIso8601String(),
        if (published != null) 'published': published.toString(),
        if (sortBy != null) 'sortBy': sortBy,
        if (sortOrder != null) 'sortOrder': sortOrder,
      };

      final response = await _apiClient.get(
        '/events',
        queryParams: queryParams,
      );

      // Backend returns paginated response with 'data.items'
      if (response['ok'] == true && response['data'] != null) {
        final List<dynamic> eventsJson = response['data']['items'] ?? [];
        return eventsJson.map((json) => Event.fromJson(json)).toList();
      }

      return [];
    } catch (e) {
      throw Exception('Failed to load events: $e');
    }
  }

  Future<Event> getEventById(String eventId) async {
    try {
      final response = await _apiClient.get('/events/$eventId');

      if (response['ok'] == true && response['data'] != null) {
        return Event.fromJson(response['data']);
      }

      throw Exception('Event not found');
    } catch (e) {
      throw Exception('Failed to load event: $e');
    }
  }

  Future<Event> createEvent(Event event) async {
    try {
      final response = await _apiClient.post(
        '/events',
        body: event.toJson(),
        requiresAuth: true,
      );

      if (response['ok'] == true && response['data'] != null) {
        return Event.fromJson(response['data']);
      }

      throw Exception('Failed to create event');
    } catch (e) {
      throw Exception('Failed to create event: $e');
    }
  }

  Future<Event> updateEvent(String eventId, Event event) async {
    try {
      final response = await _apiClient.put(
        '/events/$eventId',
        body: event.toJson(),
        requiresAuth: true,
      );

      if (response['ok'] == true && response['data'] != null) {
        return Event.fromJson(response['data']);
      }

      throw Exception('Failed to update event');
    } catch (e) {
      throw Exception('Failed to update event: $e');
    }
  }

  Future<void> deleteEvent(String eventId) async {
    try {
      await _apiClient.delete('/events/$eventId', requiresAuth: true);
    } catch (e) {
      throw Exception('Failed to delete event: $e');
    }
  }

  Future<void> togglePublish(String eventId) async {
    try {
      await _apiClient.put(
        '/events/$eventId/publish',
        body: {},
        requiresAuth: true,
      );
    } catch (e) {
      throw Exception('Failed to toggle publish status: $e');
    }
  }
}
