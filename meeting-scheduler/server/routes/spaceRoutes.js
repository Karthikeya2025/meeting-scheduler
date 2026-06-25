const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const MeetingSpace = require('../models/MeetingSpace');
const User = require('../models/User');

// POST /api/spaces/create
// Creates a new Meeting Space and generates a unique 6-character join code.
// The creator is automatically added as the first member.
router.post('/create', async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: 'Space name and userId are required' });
    }

    // Generate a short, easy-to-share join code, e.g. "A1B2C3"
    const code = nanoid(6).toUpperCase();

    const space = await MeetingSpace.create({
      name: name.trim(),
      code,
      createdBy: userId,
      members: [userId],
    });

    res.json({ space });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating space' });
  }
});

// POST /api/spaces/join
// Joins an existing Meeting Space using its join code.
router.post('/join', async (req, res) => {
  try {
    const { code, userId } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ message: 'Code and userId are required' });
    }

    const space = await MeetingSpace.findOne({ code: code.trim().toUpperCase() });

    if (!space) {
      return res.status(404).json({ message: 'No meeting space found with that code' });
    }

    // Add user to members list only if not already a member
    if (!space.members.includes(userId)) {
      space.members.push(userId);
      await space.save();
    }

    res.json({ space });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error joining space' });
  }
});

// GET /api/spaces/user/:userId
// Returns all the Meeting Spaces a particular user belongs to.
router.get('/user/:userId', async (req, res) => {
  try {
    const spaces = await MeetingSpace.find({ members: req.params.userId })
      .populate('members', 'name')
      .populate('createdBy', 'name');

    res.json({ spaces });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching spaces' });
  }
});

// GET /api/spaces/:spaceId
// Returns details of one specific space (used on the Space detail page).
router.get('/:spaceId', async (req, res) => {
  try {
    const space = await MeetingSpace.findById(req.params.spaceId)
      .populate('members', 'name')
      .populate('createdBy', 'name');

    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.json({ space });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching space' });
  }
});

module.exports = router;
