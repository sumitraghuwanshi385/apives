const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const Api = require('./models/api');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express(); // ✅ APP PEHLE BANAO

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Debug
console.log("🔍 Mongo URI Status:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");

// ================= ROUTES =================

// 🔥 Lightweight Landing APIs (only 18)
app.get("/api/landing", async (req, res) => {
  try {
    const apis = await Api.find({})
      .sort({ upvotes: -1 })
      .limit(9) // 👈 18 se 9
      .select("name category pricing provider upvotes latency gallery verified createdAt externalUrl");

    res.json(apis);
  } catch (err) {
    console.error("Landing fetch error:", err);
    res.status(500).json({ error: "Failed to fetch landing APIs" });
  }
});

// 🔥 Ping route
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

// Other routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/apis');
const sponsorRoutes = require('./routes/sponsor');
const usecaseRoutes = require('./routes/usecase');

app.use('/api/auth', authRoutes);
app.use('/api/apis', apiRoutes);
app.use('/api/sponsor', sponsorRoutes);
app.use('/api/usecases', usecaseRoutes);

// ================= DATABASE =================

const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined");
  process.exit(1);
}

mongoose.connect(DB_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    await Api.collection.createIndex({ upvotes: -1 });
    await Api.collection.createIndex({ createdAt: -1 });

    console.log("🚀 Indexes ensured");
  })
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ================= SERVER =================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));