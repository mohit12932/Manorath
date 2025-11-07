class SimpleEvent {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String websiteLink;
  final DateTime date;

  SimpleEvent({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.websiteLink,
    required this.date,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'websiteLink': websiteLink,
      'date': date.toIso8601String(),
    };
  }

  factory SimpleEvent.fromJson(Map<String, dynamic> json) {
    return SimpleEvent(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['imageUrl'],
      websiteLink: json['websiteLink'],
      date: DateTime.parse(json['date']),
    );
  }
}
