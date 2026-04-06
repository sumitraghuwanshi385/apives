const express = require("express");
const router = express.Router();
const axios = require("axios");

let CACHE = {
data: [],
time: 0
};

const CACHE_TIME = 30 * 60 * 1000;

/* -------------------------------
TEXT CLEANER
-------------------------------- */

function cleanText(text=""){
return text
.replace(/\s+/g," ")
.replace(/[\r\n]+/g," ")
.replace(/\.\.\./g,"")
.trim()
}

/* -------------------------------
DESCRIPTION (FULL REAL TEXT)
NO LIMIT ❌
-------------------------------- */

function formatDescription(desc=""){

// ✅ CLEAN ONLY (NO TRIM, NO LIMIT)
let final = cleanText(desc)

return final
}

/* -------------------------------
STRICT FILTER (ONLY CORE TECH)
-------------------------------- */

const ALLOWED_KEYWORDS = [
"ai","artificial intelligence","machine learning","ml",
"api","apis",
"saas","software as a service",
"startup","startups","funding",
"data science","data","analytics",
"developer","platform","automation",
"cloud","llm","openai","anthropic","gemini"
]

const BLOCKED = [
"sports","cricket","football","match","league",
"politics","election","war","military",
"celebrity","movie","film","bollywood",
"crime","murder","attack"
]

function isRelevant(article){

const text = (article.title + " " + article.description).toLowerCase()

/* block garbage */

if(BLOCKED.some(b => text.includes(b))){
return false
}

/* must match strong tech keywords */

return ALLOWED_KEYWORDS.some(k => text.includes(k))
}

/* -------------------------------
ROUTE
-------------------------------- */

router.get("/", async (req,res)=>{

try{

/* CACHE */

if(Date.now() - CACHE.time < CACHE_TIME){
return res.json({
success:true,
cached:true,
data:CACHE.data
})
}

/* FETCH */

const gnews = axios.get(
`https://gnews.io/api/v4/search?q=AI OR API OR SaaS OR "machine learning" OR startup OR "data science"&lang=en&max=20&token=${process.env.GNEWS_KEY}`
)

const newsapi = axios.get(
`https://newsapi.org/v2/everything?q=AI OR API OR SaaS OR "machine learning" OR startup OR "data science"&language=en&pageSize=20&apiKey=${process.env.NEWSAPI_KEY}`
)

const newsdata = axios.get(
`https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_KEY}&q=AI OR API OR SaaS OR "machine learning" OR startup OR "data science"&language=en`
)

const [gnewsRes,newsapiRes,newsdataRes] = await Promise.all([
gnews,
newsapi,
newsdata
])

/* NORMALIZE */

const gnewsData = (gnewsRes.data.articles || []).map(a=>({
title:a.title,
description:a.description,
url:a.url,
image:a.image,
publishedAt:a.publishedAt,
source:{name:a.source?.name || "GNews"}
}))

const newsapiData = (newsapiRes.data.articles || []).map(a=>({
title:a.title,
description:a.description,
url:a.url,
image:a.urlToImage,
publishedAt:a.publishedAt,
source:{name:a.source?.name || "NewsAPI"}
}))

const newsdataData = (newsdataRes.data.results || []).map(a=>({
title:a.title,
description:a.description,
url:a.link,
image:a.image_url,
publishedAt:a.pubDate,
source:{name:a.source_id || "NewsData"}
}))

let all = [
...gnewsData,
...newsapiData,
...newsdataData
]

/* FILTER STRICT */

all = all.filter(n =>
n.title &&
n.description &&
n.url &&
isRelevant(n)
)

/* DEDUPE */

const map = new Map()

all.forEach(n=>{
const key = cleanText(n.title).toLowerCase().slice(0,80)
if(!map.has(key)){
map.set(key,n)
}
})

let unique = [...map.values()]

/* SORT */

unique.sort((a,b)=>
new Date(b.publishedAt) - new Date(a.publishedAt)
)

/* FINAL FORMAT */

const finalNews = unique.slice(0,40).map(n=>({

title: cleanText(n.title),

// ✅ FULL DESCRIPTION (NO LIMIT)
description: formatDescription(n.description),

url: n.url,

image: n.image,

publishedAt: n.publishedAt,

source: n.source

}))

/* CACHE */

CACHE.data = finalNews
CACHE.time = Date.now()

res.json({
success:true,
cached:false,
total:finalNews.length,
data:finalNews
})

}catch(err){

console.error("NEWS ERROR:",err.message)

res.json({
success:false,
error:err.message
})

}

})

module.exports = router