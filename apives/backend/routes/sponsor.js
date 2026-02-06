const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Schema
const SponsorEventSchema = new mongoose.Schema({
  sponsor: String,
  type: String, // "impression" | "click"
  page: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model (collection fix)
const SponsorEvent =
  mongoose.models.SponsorEvent ||
  mongoose.model("SponsorEvent", SponsorEventSchema, "sponsor_events");

// Route
router.post("/track", async (req, res) => {
  console.log("🔥 SPONSOR HIT:", req.body);

  try {
    const { sponsor, type, page } = req.body;

    await SponsorEvent.create({
      sponsor: sponsor,
      type: type,
      page: page,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Sponsor track error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;