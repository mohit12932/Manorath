class ApiConfig {
  // Backend API URL - EventHub Backend (Node.js + Express + PostgreSQL)
  // Android emulator: 10.0.2.2 is the host machine's localhost
  // iOS simulator: Use localhost
  // Physical device: Use your computer's IP address
  static const String baseUrl = 'http://10.0.2.2:3002';

  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000;
}
