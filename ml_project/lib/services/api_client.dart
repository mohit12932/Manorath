import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  final _storage = const FlutterSecureStorage();
  String? _token;

  Future<void> setToken(String token) async {
    _token = token;
    await _storage.write(key: 'auth_token', value: token);
  }

  Future<String?> getToken() async {
    _token ??= await _storage.read(key: 'auth_token');
    return _token;
  }

  Future<void> clearToken() async {
    _token = null;
    await _storage.delete(key: 'auth_token');
  }

  Map<String, String> _getHeaders({bool requiresAuth = false}) {
    final headers = {'Content-Type': 'application/json'};

    if (requiresAuth && _token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }

    return headers;
  }

  Future<Map<String, dynamic>> get(
    String endpoint, {
    bool requiresAuth = false,
    Map<String, String>? queryParams,
  }) async {
    try {
      var uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
      if (queryParams != null) {
        uri = uri.replace(queryParameters: queryParams);
      }

      final response = await http
          .get(uri, headers: _getHeaders(requiresAuth: requiresAuth))
          .timeout(const Duration(milliseconds: ApiConfig.connectionTimeout));

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> post(
    String endpoint, {
    required Map<String, dynamic> body,
    bool requiresAuth = false,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiConfig.baseUrl}$endpoint'),
            headers: _getHeaders(requiresAuth: requiresAuth),
            body: json.encode(body),
          )
          .timeout(const Duration(milliseconds: ApiConfig.connectionTimeout));

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> put(
    String endpoint, {
    required Map<String, dynamic> body,
    bool requiresAuth = true,
  }) async {
    try {
      final response = await http
          .put(
            Uri.parse('${ApiConfig.baseUrl}$endpoint'),
            headers: _getHeaders(requiresAuth: requiresAuth),
            body: json.encode(body),
          )
          .timeout(const Duration(milliseconds: ApiConfig.connectionTimeout));

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> delete(
    String endpoint, {
    bool requiresAuth = true,
  }) async {
    try {
      final response = await http
          .delete(
            Uri.parse('${ApiConfig.baseUrl}$endpoint'),
            headers: _getHeaders(requiresAuth: requiresAuth),
          )
          .timeout(const Duration(milliseconds: ApiConfig.connectionTimeout));

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    final data = json.decode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    } else {
      throw ApiException(
        message: data['message'] ?? 'An error occurred',
        statusCode: response.statusCode,
      );
    }
  }

  String _handleError(dynamic error) {
    if (error is ApiException) {
      return error.message;
    }
    return 'Network error. Please check your connection.';
  }

  // ==================== Auth Methods ====================

  /// Request OTP for mobile number
  /// @param fullMobile - Full mobile number with country code (e.g., "+919876543210")
  Future<Map<String, dynamic>> requestOtp(String fullMobile) async {
    try {
      // Parse country code and mobile number
      // Extract country code (e.g., "+91") and mobile (e.g., "9876543210")
      final RegExp regex = RegExp(r'^(\+\d{1,4})(\d{10,15})$');
      final match = regex.firstMatch(fullMobile);

      if (match == null) {
        throw ApiException(
          message: 'Invalid mobile number format',
          statusCode: 400,
        );
      }

      final countryCode = match.group(1)!;
      final mobile = match.group(2)!;

      final response = await post(
        '/auth/request-otp',
        body: {'countryCode': countryCode, 'mobile': mobile},
      );
      return response;
    } catch (e) {
      rethrow;
    }
  }

  /// Verify OTP
  /// @param fullMobile - Full mobile number with country code (e.g., "+919876543210")
  /// @param code - 6-digit OTP code
  Future<Map<String, dynamic>> verifyOtp(String fullMobile, String code) async {
    try {
      // Parse country code and mobile number
      final RegExp regex = RegExp(r'^(\+\d{1,4})(\d{10,15})$');
      final match = regex.firstMatch(fullMobile);

      if (match == null) {
        throw ApiException(
          message: 'Invalid mobile number format',
          statusCode: 400,
        );
      }

      final countryCode = match.group(1)!;
      final mobile = match.group(2)!;

      final response = await post(
        '/auth/verify-otp',
        body: {'countryCode': countryCode, 'mobile': mobile, 'code': code},
      );

      // Store token if verification successful
      if (response['ok'] == true &&
          response['data']?['tokens']?['accessToken'] != null) {
        await setToken(response['data']['tokens']['accessToken']);
      }

      return response;
    } catch (e) {
      rethrow;
    }
  }

  /// Sign up new user
  Future<Map<String, dynamic>> signup(Map<String, dynamic> payload) async {
    try {
      final response = await post('/auth/signup', body: payload);

      // Store token if signup successful
      if (response['success'] == true && response['data']?['token'] != null) {
        await setToken(response['data']['token']);
      }

      return response;
    } catch (e) {
      rethrow;
    }
  }

  /// Upload photo (multipart) - Profile photo
  Future<Map<String, dynamic>> uploadProfilePhoto(String filePath) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.baseUrl}/upload/photo'),
      );

      // Get token for authentication
      final token = await getToken();
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      request.files.add(await http.MultipartFile.fromPath('file', filePath));

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Upload event banner image
  Future<Map<String, dynamic>> uploadEventBanner(String filePath) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.baseUrl}/upload/banner'),
      );

      // Get token for authentication
      final token = await getToken();
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      request.files.add(await http.MultipartFile.fromPath('file', filePath));

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException({required this.message, required this.statusCode});

  @override
  String toString() => message;
}
