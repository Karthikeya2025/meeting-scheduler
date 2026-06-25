require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const spaceRoutes = require('./routes/spaceRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

const app = express();

// ---- Middleware ----
app.use(cors());            // allow the React frontend (different port) to call this API
app.use(express.json());   // parse JSON request bodies

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/meetings', meetingRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('Meeting Scheduler API is running ✅');
});

// ---- Connect to MongoDB, then start the server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
