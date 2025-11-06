class User {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? profileImage;
  final String role;
  final List<String> createdEvents;
  final List<String> registeredEvents;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.profileImage,
    this.role = 'user',
    this.createdEvents = const [],
    this.registeredEvents = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      profileImage: json['profileImage'],
      role: json['role'] ?? 'user',
      createdEvents: List<String>.from(json['createdEvents'] ?? []),
      registeredEvents: List<String>.from(json['registeredEvents'] ?? []),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'profileImage': profileImage,
    };
  }

  bool get isOrganizer => role == 'organizer' || role == 'admin';
  bool get isAdmin => role == 'admin';
}

class AuthResponse {
  final User user;
  final String token;

  AuthResponse({required this.user, required this.token});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      user: User.fromJson(json['user']),
      token: json['token'],
    );
  }
}
