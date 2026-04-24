const router = require("express").Router();
const axios = require("axios");

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.choices[0].message.content;

    res.json({ result });
  } catch (err) {
    console.error("❌ OPENROUTER ERROR:", err.response?.data || err.message);

    res.status(500).json({ error: "Compare failed" });
  }
});

module.exports = router;