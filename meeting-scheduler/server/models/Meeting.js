const mongoose = require('mongoose');

// A "Meeting" belongs to a Meeting Space, and is scheduled
// at a specific date/time. All members of the space can see it
// on their calendar.
const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingSpace',
    required: true,
  },
  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Stored as a single combined Date object (date + time)
  dateTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // duration in minutes
    default: 30,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Meeting', meetingSchema);
