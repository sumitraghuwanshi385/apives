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

// 📊 Sponsor Analytics
router.get("/stats", async (req, res) => {
  try {
    const stats = await SponsorEvent.aggregate([
      {
        $group: {
          _id: {
            sponsor: "$sponsor",
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // format data
    const result = {};

    stats.forEach((item) => {
      const sponsor = item._id.sponsor;
      const type = item._id.type;

      if (!result[sponsor]) {
        result[sponsor] = { impressions: 0, clicks: 0 };
      }

      if (type === "impression") result[sponsor].impressions = item.count;
      if (type === "click") result[sponsor].clicks = item.count;
    });

    // CTR add
    const final = Object.keys(result).map((sponsor) => {
      const { impressions, clicks } = result[sponsor];
      return {
        sponsor,
        impressions,
        clicks,
        ctr: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00",
      };
    });

    res.json(final);
  } catch (err) {
    console.error("Sponsor stats error", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;