const express = require("express");
const Usecase = require("../models/Usecase");

const router = express.Router();

/**
 * GET usecase by slug
 * /api/usecases/:slug
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const usecase = await Usecase.findOne({
      slug,
      published: true
    }).populate("curatedApiIds");

    if (!usecase) {
      return res.status(404).json({ message: "Usecase not found" });
    }

    res.json(usecase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT update usecase
 * /api/usecases/:slug
 */
router.put("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { operationalInsight, curatedApiIds } = req.body;

    const updated = await Usecase.findOneAndUpdate(
      { slug },
      { operationalInsight, curatedApiIds },
      { new: true }
    ).populate("curatedApiIds");

    if (!updated) {
      return res.status(404).json({ message: "Usecase not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;