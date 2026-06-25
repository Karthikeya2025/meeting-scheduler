const mongoose = require('mongoose');

// A "Meeting Space" is like a team/group/workspace.
// People join it using a unique code, and meetings are
// scheduled inside a space for all its members to see.
const meetingSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true, // the join code must be unique across all spaces
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MeetingSpace', meetingSpaceSchema);
