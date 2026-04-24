const router = require("express").Router();
const axios = require("axios");

// 🔑 ENV KEYS
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

// ⚠️ BASIC VALIDATION
if (!OPENAI_KEY && !GROQ_KEY) {
  console.warn("⚠️ No AI keys found (OpenAI/Groq)");
}

// 🔥 COMMON CONFIG
const AXIOS_CONFIG = {
  timeout: 20000, // 20 sec
  headers: {
    "Content-Type": "application/json",
  },
};

// ==============================
// 🤖 OPENAI CALL
// ==============================
const callOpenAI = async (messages, apiData) => {
  return axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are Apives AI.

Explain APIs clearly for developers.

Include:
- endpoints
- parameters
- example request
- use cases
- common mistakes

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
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
    }
  );
};

// ==============================
// ⚡ GROQ FALLBACK
// ==============================
const callGroq = async (messages, apiData) => {
  return axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are Apives AI fallback.

Explain APIs clearly.

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
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    let response;

    // 🔥 TRY OPENAI FIRST
    if (OPENAI_KEY) {
      try {
        console.log("⚡ Using OpenAI...");
        response = await callOpenAI(messages, apiData);
      } catch (err) {
        console.error("❌ OpenAI failed:", err.response?.data || err.message);

        if (!GROQ_KEY) throw err;

        console.log("🔁 Switching to GROQ...");
        response = await callGroq(messages, apiData);
      }
    } else if (GROQ_KEY) {
      console.log("⚡ Using GROQ...");
      response = await callGroq(messages, apiData);
    } else {
      throw new Error("No AI provider available");
    }

    // ✅ SAFE RESPONSE EXTRACTION
    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("❌ Empty AI response:", response?.data);
      throw new Error("Empty AI response");
    }

    return res.json({ answer: content });

  } catch (err) {
    console.error("🔥 FINAL AI ERROR:", err.message);

    return res.status(500).json({
      error: "AI failed",
      debug: err.message, // remove later in prod if needed
    });
  }
});

module.exports = router;