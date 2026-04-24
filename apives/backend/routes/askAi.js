const router = require("express").Router();
const axios = require("axios");

// 🔑 ENV KEYS
const GROQ_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// 🔥 AXIOS CONFIG
const AXIOS_CONFIG = {
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
};

// ==============================
// ⚡ GROQ (ASK APIVES AI)
// ==============================
const callGroq = async (messages, apiData) => {
  return axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-8b-8192",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are Apives AI — expert API assistant.

Explain APIs with:
- Endpoints
- Params
- Example
- Use cases
- Mistakes

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
        Authorization: `Bearer ${GROQ_KEY}`,
      },
    }
  );
};

// ==============================
// 🔥 OPENROUTER (COMPARE MODE)
// ==============================
const callOpenRouter = async (messages) => {
  return axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      messages,
    },
    {
      ...AXIOS_CONFIG,
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
      },
    }
  );
};

// ==============================
// 🧠 GEMINI (SONI MODE / FALLBACK)
// ==============================
const callGemini = async (messages) => {
  const prompt = messages.map(m => m.content).join("\n");

  return axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    AXIOS_CONFIG
  );
};

// ==============================
// 🚀 MAIN ROUTE
// ==============================
router.post("/", async (req, res) => {
  const { messages, apiData, mode } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    let response;
    let content;

    console.log(`⚡ MODE: ${mode}`);

    // ==========================
    // 🔥 MODE SWITCH
    // ==========================
    if (mode === "compare") {
      response = await callOpenRouter(messages);
      content = response?.data?.choices?.[0]?.message?.content;
    }

    else if (mode === "soni") {
      response = await callGemini(messages);
      content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    else {
      // default → ASK APIVES AI
      response = await callGroq(messages, apiData);
      content = response?.data?.choices?.[0]?.message?.content;
    }

    if (!content) {
      throw new Error("Empty AI response");
    }

    console.log("✅ RESPONSE SUCCESS");

    return res.json({ answer: content });

  } catch (err) {
    console.error("🔥 ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      error: "AI failed",
      detail: err.message,
    });
  }
});

module.exports = router;