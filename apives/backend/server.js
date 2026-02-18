const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Ye line add ki hai
const Api = require('./models/api');
// 🔥 Lightweight Landing APIs (only 18)
app.get("/api/landing", async (req, res) => {
  try {
    const apis = await Api.find({})
      .sort({ upvotes: -1 })
      .limit(18)
      .select("name category pricing provider upvotes latency gallery verified createdAt");

    res.json(apis);
  } catch (err) {
    console.error("Landing fetch error:", err);
    res.status(500).json({ error: "Failed to fetch landing APIs" });
  }
});

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
const sponsorRoutes = require('./routes/sponsor');
const usecaseRoutes = require('./routes/usecase');

// Routes Use
app.use('/api/auth', authRoutes);
app.use('/api/apis', apiRoutes);
app.use('/api/sponsor', sponsorRoutes);
app.use('/api/usecases', usecaseRoutes);
// 🔥 Ping route (server wake check)
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});
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