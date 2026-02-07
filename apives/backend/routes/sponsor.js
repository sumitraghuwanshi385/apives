console.log("✅ sponsor.js file loaded");

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

/* =======================
   SCHEMA
======================= */

const SponsorEventSchema = new mongoose.Schema({
  sponsor: String,
  type: String, // "impression" | "click"
  page: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* =======================
   MODEL (COLLECTION FIX)
======================= */

const SponsorEvent =
  mongoose.models.SponsorEvent ||
  mongoose.model(
    "SponsorEvent",
    SponsorEventSchema,
    "sponsor_events"
  );

/* =======================
   TRACK EVENT (POST)
======================= */

router.post("/track", async (req, res) => {
  console.log("🔥 SPONSOR HIT:", req.body);

  try {
    const { sponsor, type, page } = req.body;

    if (!sponsor || !type) {
      return res.status(400).json({ success: false });
    }

    await SponsorEvent.create({
      sponsor,
      type,
      page,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Sponsor track error:", err);
    res.status(500).json({ success: false });
  }
});

/* =======================
   ANALYTICS (GET)
   /api/sponsor/stats?range=24h|7d|30d
======================= */

router.get("/stats", async (req, res) => {
  console.log("📊 /api/sponsor/stats HIT");

  const range = req.query.range || "7d"; // default 7d

  // 🕒 Date filter
  let fromDate = new Date();

  if (range === "24h") {
    fromDate.setHours(fromDate.getHours() - 24);
  } else if (range === "30d") {
    fromDate.setDate(fromDate.getDate() - 30);
  } else {
    // default 7 days
    fromDate.setDate(fromDate.getDate() - 7);
  }

  try {
    const stats = await SponsorEvent.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
        },
      },
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

    // 🧠 Format result
    const result = {};

    stats.forEach((item) => {
      const sponsor = item._id.sponsor;
      const type = item._id.type;

      if (!result[sponsor]) {
        result[sponsor] = {
          impressions: 0,
          clicks: 0,
        };
      }

      if (type === "impression") {
        result[sponsor].impressions = item.count;
      }

      if (type === "click") {
        result[sponsor].clicks = item.count;
      }
    });

    // 📈 Add CTR
    const final = Object.keys(result).map((sponsor) => {
      const { impressions, clicks } = result[sponsor];

      return {
        sponsor,
        impressions,
        clicks,
        ctr:
          impressions > 0
            ? ((clicks / impressions) * 100).toFixed(2)
            : "0.00",
      };
    });

    res.json(final);
  } catch (err) {
    console.error("❌ Sponsor stats error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================= */

module.exports = router;