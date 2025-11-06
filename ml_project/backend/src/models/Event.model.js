const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'seminar', 'webinar', 'meetup', 'concert', 'sports', 'other']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: {
      address: String,
      city: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number
    },
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String,
    default: null
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxAttendees: {
    type: Number,
    default: null
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ticketPrice: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for searching
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);
