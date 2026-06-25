const mongoose = require('mongoose');

// A "User" here is just a name-based identity (no password)
// Each time someone logs in with a name, we either find their
// existing record or create a new one.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
