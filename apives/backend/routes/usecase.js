import express from "express";
import Usecase from "../models/Usecase.js";

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
    });

    if (!usecase) {
      return res.status(404).json({ message: "Usecase not found" });
    }

    res.json(usecase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;