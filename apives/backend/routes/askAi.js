const router = require("express").Router();
const axios = require("axios");

// 🔑 ENV KEY
const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
  console.warn("⚠️ GROQ API KEY missing");
}

// 🔥 AXIOS CONFIG
const AXIOS_CONFIG = {
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
};

// ==============================
// ⚡ GROQ CALL
// ==============================
const callGroq = async (messages, apiData) => {
  return axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are Apives AI — an expert API assistant.

Explain APIs clearly for developers in a structured way.

Always include:
- 🔗 Endpoints
- 📦 Parameters
- 📘 Example request
- ⚙️ Use cases
- ⚠️ Common mistakes

Keep it clean, practical, and developer-friendly.

API DATA:
${JSON.stringify(apiData)}
          `,
        },
        ...messages,
      ],
    },
    {
      ...AXIOS_CONFIG,
      headers: {
        ...AXIOS_CONFIG.headers,
        Authorization: `Bearer ${GROQ_KEY}`,
      },
    }
  );
};

// ==============================
// 🚀 MAIN ROUTE
// ==============================
router.post("/", async (req, res) => {
  const { messages, apiData } = req.body;

  // ❌ VALIDATION
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    console.log("⚡ GROQ REQUEST START");

    const response = await callGroq(messages, apiData);

    const content = response?.data?.choices?.[0]?.message?.content;

    // ❌ EMPTY CHECK
    if (!content) {
      console.error("❌ Empty response:", response?.data);
      throw new Error("Empty AI response");
    }

    console.log("✅ GROQ RESPONSE SUCCESS");

    return res.json({ answer: content });

  } catch (err) {
    console.error("🔥 GROQ ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      error: "AI failed",
      detail: err.message,
    });
  }
});

module.exports = router;