const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express(); // ✅ ALWAYS create app first

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

console.log(
  "🔍 Mongo URI Status:",
  process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌"
);

// ================= MODELS =================
const Api = require('./models/ApiListing');

// ================= BASIC ROUTES =================

// 🔥 Health check
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

// 🔥 Optimized Landing APIs (6 + 3 + 3 split)
app.get("/api/landing", async (req, res) => {
  try {

    const [universal, fresh, community] = await Promise.all([

      // 🔥 Universal (6 random)
      Api.aggregate([
        { $sample: { size: 6 } }
      ]),

      // 🔥 Fresh (latest 3)
      Api.find({})
        .sort({ createdAt: -1 })
        .limit(3),

      // 🔥 Community (most liked 3)
      Api.find({})
        .sort({ upvotes: -1 })
        .limit(3)
    ]);

    res.json({
      universal,
      fresh,
      community
    });

  } catch (err) {
    console.error("Landing fetch error:", err);
    res.status(500).json({ error: "Landing fetch failed" });
  }
});

// ================= FRESH PAGINATION =================
app.get("/api/fresh", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const [apis, total] = await Promise.all([
      Api.find({
        createdAt: { $gte: fifteenDaysAgo },
        status: { $ne: "paused" }
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Api.countDocuments({
        createdAt: { $gte: fifteenDaysAgo },
        status: { $ne: "paused" }
      })
    ]);

    res.json({
      apis,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error("Fresh fetch error:", err);
    res.status(500).json({ error: "Fresh fetch failed" });
  }
});


// ================= COMMUNITY PAGINATION =================
app.get("/api/community", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const [apis, total] = await Promise.all([
      Api.find({ status: { $ne: "paused" } })
        .sort({ upvotes: -1 })
        .skip(skip)
        .limit(limit),

      Api.countDocuments({ status: { $ne: "paused" } })
    ]);

    res.json({
      apis,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error("Community fetch error:", err);
    res.status(500).json({ error: "Community fetch failed" });
  }
});

// ================= OTHER ROUTES =================
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apis");
const sponsorRoutes = require("./routes/sponsor");
const usecaseRoutes = require("./routes/usecase");

app.use("/api/auth", authRoutes);
app.use("/api/apis", apiRoutes);
app.use("/api/sponsor", sponsorRoutes);
app.use("/api/usecases", usecaseRoutes);

// ================= DATABASE =================
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is missing");
  process.exit(1);
}

mongoose
  .connect(DB_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // 🔥 Ensure indexes (safe to run multiple times)
    await Api.collection.createIndex({ upvotes: -1 });
    await Api.collection.createIndex({ createdAt: -1 });

    console.log("🚀 Indexes ensured");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
    process.exit(1);
  });

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});