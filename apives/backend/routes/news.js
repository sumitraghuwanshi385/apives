const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req,res)=>{

try{

/* =========================
GNEWS
========================= */

const gnews = await axios.get(
`https://gnews.io/api/v4/search?q=AI OR API OR developer tools&lang=en&max=10&token=${process.env.GNEWS_KEY}`
)

const gnewsArticles = gnews.data.articles || []


/* =========================
NEWSAPI
========================= */

const newsapi = await axios.get(
`https://newsapi.org/v2/everything?q=AI OR API OR developer tools&language=en&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`
)

const newsapiArticles = (newsapi.data.articles || []).map(n=>({
title:n.title,
description:n.description,
url:n.url,
image:n.urlToImage,
source:{name:n.source?.name || "NewsAPI"}
}))



/* =========================
NEWSDATA.IO
========================= */

const newsdata = await axios.get(
`https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_KEY}&q=AI OR API OR developer tools&language=en`
)

const newsdataArticles = (newsdata.data.results || []).map(n=>({
title:n.title,
description:n.description,
url:n.link,
image:n.image_url,
source:{name:n.source_id || "NewsData"}
}))



/* =========================
MERGE ALL
========================= */

const merged = [
...gnewsArticles,
...newsapiArticles,
...newsdataArticles
]



/* =========================
REMOVE DUPLICATES
========================= */

const unique = [
...new Map(merged.map(i=>[i.url,i])).values()
]



/* =========================
LIMIT RESULTS
========================= */

const finalNews = unique.slice(0,30)



res.json({
success:true,
data:finalNews
})

}catch(err){

res.json({
success:false,
error:err.message
})

}

})

module.exports = router;