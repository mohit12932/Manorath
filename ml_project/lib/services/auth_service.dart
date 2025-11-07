import '../models/user_model.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _apiClient = ApiClient();

  /// Get current user profile (using /me endpoint from backend)
  Future<User> getCurrentUser() async {
    try {
      final response = await _apiClient.get('/me', requiresAuth: true);

      // Backend returns user in 'data' field
      if (response['ok'] == true && response['data'] != null) {
        return User.fromJson(response['data']);
      }

      throw Exception('Failed to get user profile');
    } catch (e) {
      throw Exception('Failed to get user: $e');
    }
  }

  /// Update user profile
  Future<User> updateProfile(Map<String, dynamic> profileData) async {
    try {
      final response = await _apiClient.put(
        '/me',
        body: profileData,
        requiresAuth: true,
      );

      if (response['ok'] == true && response['data'] != null) {
        return User.fromJson(response['data']);
      }

      throw Exception('Failed to update profile');
    } catch (e) {
      throw Exception('Profile update failed: $e');
    }
  }

  Future<void> logout() async {
    try {
      // Call backend logout endpoint
      await _apiClient.post('/auth/logout', body: {}, requiresAuth: true);
    } catch (e) {
      print('Logout API call failed: $e');
    } finally {
      // Always clear local token
      await _apiClient.clearToken();
    }
  }

  Future<bool> isLoggedIn() async {
    final token = await _apiClient.getToken();
    return token != null;
  }
}
