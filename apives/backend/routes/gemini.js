const router = require("express").Router();
const axios = require("axios");

const GEMINI_KEY = process.env.GEMINI_API_KEY;

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ result: text });
  } catch (err) {
    console.error("❌ GEMINI ERROR:", err.response?.data || err.message);

    res.status(500).json({ error: "Gemini failed" });
  }
});

module.exports = router;