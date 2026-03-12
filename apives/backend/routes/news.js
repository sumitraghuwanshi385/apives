const express = require("express");
const router = express.Router();
const axios = require("axios");

let CACHE = {
  data: [],
  time: 0
};

const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// -------- TEXT HELPERS --------

// clean title → max 10 words
function cleanTitle(text = "") {
  const words = text
    .replace(/[\n\r]/g, " ")
    .split(" ")
    .filter(Boolean);

  return words.slice(0, 10).join(" ");
}

// clean description → 70 words
function cleanDescription(text = "") {
  const words = text
    .replace(/[\n\r]/g, " ")
    .split(" ")
    .filter(Boolean);

  let result = words.slice(0, 70).join(" ");

  if (!result.endsWith(".")) {
    result += ".";
  }

  return result;
}

// -------- ROUTE --------

router.get("/", async (req, res) => {
  try {

    // CACHE
    if (Date.now() - CACHE.time < CACHE_TIME) {
      return res.json({
        success: true,
        cached: true,
        data: CACHE.data
      });
    }

    // FETCH APIS
    const gnews = axios.get(
      `https://gnews.io/api/v4/search?q=AI OR API OR developer tools&lang=en&max=20&token=${process.env.GNEWS_KEY}`
    );

    const newsapi = axios.get(
      `https://newsapi.org/v2/everything?q=AI OR API OR developer tools&language=en&pageSize=20&apiKey=${process.env.NEWSAPI_KEY}`
    );

    const newsdata = axios.get(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_KEY}&q=AI OR API OR developer tools&language=en`
    );

    const [gnewsRes, newsapiRes, newsdataRes] = await Promise.all([
      gnews,
      newsapi,
      newsdata
    ]);

    // -------- NORMALIZE --------

    const gnewsData = (gnewsRes.data.articles || []).map(a => ({
      title: cleanTitle(a.title),
      description: cleanDescription(a.description || ""),
      url: a.url,
      image: a.image,
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || "GNews" }
    }));

    const newsapiData = (newsapiRes.data.articles || []).map(a => ({
      title: cleanTitle(a.title),
      description: cleanDescription(a.description || ""),
      url: a.url,
      image: a.urlToImage,
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || "NewsAPI" }
    }));

    const newsdataData = (newsdataRes.data.results || []).map(a => ({
      title: cleanTitle(a.title),
      description: cleanDescription(a.description || ""),
      url: a.link,
      image: a.image_url,
      publishedAt: a.pubDate,
      source: { name: a.source_id || "NewsData" }
    }));

    // -------- MERGE --------

    let all = [
      ...gnewsData,
      ...newsapiData,
      ...newsdataData
    ];

    // -------- BASIC FILTER --------

    all = all.filter(n =>
      n.title &&
      n.url &&
      n.description &&
      n.title.length > 10
    );

    // -------- AI / DEV FILTER --------

    const keywords = [
      "ai",
      "artificial intelligence",
      "api",
      "developer",
      "openai",
      "machine learning",
      "llm",
      "startup",
      "software",
      "tech"
    ];

    all = all.filter(n =>
      keywords.some(k =>
        (n.title + " " + n.description)
          .toLowerCase()
          .includes(k)
      )
    );

    // -------- REMOVE DUPLICATES --------

    const map = new Map();

    all.forEach(n => {
      const key = n.title.toLowerCase().slice(0, 60);

      if (!map.has(key)) {
        map.set(key, n);
      }
    });

    const unique = [...map.values()];

    // -------- SORT --------

    unique.sort(
      (a, b) =>
        new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // -------- LIMIT --------

    const finalNews = unique.slice(0, 50);

    // -------- CACHE --------

    CACHE.data = finalNews;
    CACHE.time = Date.now();

    res.json({
      success: true,
      cached: false,
      total: finalNews.length,
      data: finalNews
    });

  } catch (err) {

    console.error("NEWS ERROR:", err.message);

    res.json({
      success: false,
      error: err.message
    });

  }
});

module.exports = router;