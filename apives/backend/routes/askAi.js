const router = require("express").Router();
const axios = require("axios");

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

const callOpenAI = async (messages, apiData) => {
  return axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Apives AI. Explain APIs clearly.\nAPI:\n${JSON.stringify(apiData)}`,
        },
        ...messages,
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const callGroq = async (messages, apiData) => {
  return axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `Explain APIs clearly.\nAPI:\n${JSON.stringify(apiData)}`,
        },
        ...messages,
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};

router.post("/", async (req, res) => {
  const { messages, apiData } = req.body;

  try {
    let response;

    try {
      response = await callOpenAI(messages, apiData);
    } catch (err) {
      console.log("OpenAI failed → switching to GROQ");
      response = await callGroq(messages, apiData);
    }

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    res.json({ answer: content });

  } catch (err) {
    console.error("❌ AI ERROR:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;