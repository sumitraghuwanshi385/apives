import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/run", async (req, res) => {

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "No URL provided"
    });
  }

  try {

    const apiRes = await fetch(url);

    const text = await apiRes.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    res.json({
      success: true,
      status: apiRes.status,
      data: data
    });

  } catch (err) {

    res.status(500).json({
      error: "API request failed",
      message: err.message
    });

  }

});

export default router;