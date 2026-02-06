import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// 1️⃣ Schema
const SponsorEventSchema = new mongoose.Schema({
  sponsor: String,   // "serpapi"
  type: String,      // "impression" | "click"
  page: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 2️⃣ Model (IMPORTANT: collection name same)
const SponsorEvent = mongoose.model(
  "SponsorEvent",
  SponsorEventSchema,
  "sponsor_events"
);

// 3️⃣ API
router.post("/track", async (req, res) => {
  try {
    const { sponsor, type, page } = req.body;

    await SponsorEvent.create({
      sponsor,
      type,
      page
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

export default router;