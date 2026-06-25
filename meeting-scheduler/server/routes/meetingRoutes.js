const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// POST /api/meetings/create
// Schedules a new meeting inside a Meeting Space.
// Because the meeting is tied to a space (not individual users),
// every member of that space will see it on their calendar.
router.post('/create', async (req, res) => {
  try {
    const { title, description, spaceId, scheduledBy, dateTime, duration } = req.body;

    if (!title || !spaceId || !scheduledBy || !dateTime) {
      return res.status(400).json({ message: 'Missing required meeting fields' });
    }

    const meeting = await Meeting.create({
      title: title.trim(),
      description: description || '',
      space: spaceId,
      scheduledBy,
      dateTime: new Date(dateTime),
      duration: duration || 30,
    });

    res.json({ meeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating meeting' });
  }
});

// GET /api/meetings/space/:spaceId
// Returns all meetings scheduled within one Meeting Space.
router.get('/space/:spaceId', async (req, res) => {
  try {
    const meetings = await Meeting.find({ space: req.params.spaceId })
      .populate('scheduledBy', 'name')
      .sort({ dateTime: 1 });

    res.json({ meetings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching meetings' });
  }
});

// GET /api/meetings/user/:userId
// Returns ALL meetings across every space the user belongs to.
// This powers the user's personal calendar view.
router.get('/user/:userId', async (req, res) => {
  try {
    const MeetingSpace = require('../models/MeetingSpace');

    // Find every space this user is a member of
    const spaces = await MeetingSpace.find({ members: req.params.userId });
    const spaceIds = spaces.map((s) => s._id);

    // Then find every meeting belonging to those spaces
    const meetings = await Meeting.find({ space: { $in: spaceIds } })
      .populate('scheduledBy', 'name')
      .populate('space', 'name')
      .sort({ dateTime: 1 });

    res.json({ meetings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching user meetings' });
  }
});

// DELETE /api/meetings/:meetingId
// Cancels / deletes a scheduled meeting.
router.delete('/:meetingId', async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.meetingId);
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting meeting' });
  }
});

module.exports = router;
