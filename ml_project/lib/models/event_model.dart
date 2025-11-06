class Event {
  final String id;
  final String title;
  final String description;
  final String category;
  final DateTime startDate;
  final DateTime endDate;
  final EventLocation location;
  final bool isOnline;
  final String? meetingLink;
  final String organizerId;
  final String? organizerName;
  final int? maxAttendees;
  final int currentAttendees;
  final List<String> attendees;
  final double ticketPrice;
  final List<String> images;
  final List<String> tags;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Event({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.startDate,
    required this.endDate,
    required this.location,
    this.isOnline = false,
    this.meetingLink,
    required this.organizerId,
    this.organizerName,
    this.maxAttendees,
    this.currentAttendees = 0,
    this.attendees = const [],
    this.ticketPrice = 0.0,
    this.images = const [],
    this.tags = const [],
    this.status = 'draft',
    required this.createdAt,
    required this.updatedAt,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['_id'] ?? json['id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      location: EventLocation.fromJson(json['location']),
      isOnline: json['isOnline'] ?? false,
      meetingLink: json['meetingLink'],
      organizerId: json['organizer'] is String
          ? json['organizer']
          : json['organizer']['_id'],
      organizerName: json['organizer'] is Map
          ? json['organizer']['name']
          : null,
      maxAttendees: json['maxAttendees'],
      currentAttendees: json['currentAttendees'] ?? 0,
      attendees: List<String>.from(json['attendees'] ?? []),
      ticketPrice: (json['ticketPrice'] ?? 0).toDouble(),
      images: List<String>.from(json['images'] ?? []),
      tags: List<String>.from(json['tags'] ?? []),
      status: json['status'] ?? 'draft',
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'category': category,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'location': location.toJson(),
      'isOnline': isOnline,
      'meetingLink': meetingLink,
      'maxAttendees': maxAttendees,
      'ticketPrice': ticketPrice,
      'images': images,
      'tags': tags,
      'status': status,
    };
  }

  bool get isFull => maxAttendees != null && currentAttendees >= maxAttendees!;
  bool get isUpcoming => startDate.isAfter(DateTime.now());
  bool get isOngoing =>
      DateTime.now().isAfter(startDate) && DateTime.now().isBefore(endDate);
  bool get isCompleted => DateTime.now().isAfter(endDate);
}

class EventLocation {
  final String address;
  final String city;
  final String state;
  final String country;
  final double? latitude;
  final double? longitude;

  EventLocation({
    required this.address,
    required this.city,
    required this.state,
    required this.country,
    this.latitude,
    this.longitude,
  });

  factory EventLocation.fromJson(Map<String, dynamic> json) {
    return EventLocation(
      address: json['address'],
      city: json['city'],
      state: json['state'],
      country: json['country'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'city': city,
      'state': state,
      'country': country,
      'latitude': latitude,
      'longitude': longitude,
    };
  }

  String get fullAddress => '$address, $city, $state, $country';
}
