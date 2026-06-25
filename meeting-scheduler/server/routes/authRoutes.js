const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
// "Login" just means: give us your name.
// If a user with that name already exists, we reuse it.
// Otherwise, we create a brand new user record.
// This is intentionally simple — no passwords, no JWT tokens.
router.post('/login', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    let user = await User.findOne({ name: name.trim() });

    if (!user) {
      user = await User.create({ name: name.trim() });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
