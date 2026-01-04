const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Ye line add ki hai

// 1. Force dotenv to look in the current folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Debugging: Check if URI is loaded
console.log("🔍 Mongo URI Status:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");

// Routes Import
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/apis');

// Routes Use
app.use('/api/auth', authRoutes);
app.use('/api/apis', apiRoutes);

// Database Connection
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1); // Stop server if no DB
}

mongoose.connect(DB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));