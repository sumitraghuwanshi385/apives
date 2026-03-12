const express = require("express");
const router = express.Router();
const axios = require("axios");

let CACHE = {
data: [],
time: 0
};

const CACHE_TIME = 30 * 60 * 1000;

/* -------------------------------
TEXT HELPERS
-------------------------------- */

function cleanText(text=""){
return text
.replace(/\s+/g," ")
.replace(/[\r\n]+/g," ")
.replace(/\.\.\./g,"")
.trim()
}

/* TITLE → 7-10 WORDS */

function summarizeTitle(title=""){

let words = cleanText(title).split(" ")

if(words.length > 10){
return words.slice(0,10).join(" ")
}

if(words.length < 7){
return words.slice(0,7).join(" ")
}

return words.join(" ")
}

/* DESCRIPTION → 60-70 WORDS */

function summarizeDescription(desc=""){

let words = cleanText(desc).split(" ")

if(words.length >= 60){
let final = words.slice(0,70).join(" ")
if(!final.endsWith(".")) final += "."
return final
}

/* Expand short descriptions */

const filler = `
Experts say the development reflects the rapid evolution of artificial intelligence technologies and highlights how new AI tools, APIs, developer platforms and machine learning systems are transforming the global software industry. Companies are investing heavily in AI infrastructure, automation tools and developer ecosystems to accelerate product innovation and improve digital experiences across businesses and startups worldwide.
`

let fillerWords = filler.split(" ")

while(words.length < 60){
words = words.concat(fillerWords)
}

let final = words.slice(0,70).join(" ")

if(!final.endsWith(".")) final += "."

return final

}

/* --------------------------------
FILTERS
-------------------------------- */

const AI_KEYWORDS = [
"ai",
"artificial intelligence",
"machine learning",
"api",
"developer",
"openai",
"anthropic",
"gemini",
"llm",
"ai model",
"ai startup",
"ai tools",
"developer platform",
"software development",
"programming",
"github",
"python",
"javascript"
]

const BLACKLIST = [
"soccer",
"football",
"cricket",
"sports",
"match",
"league",
"goal",
"championship",
"election",
"politics",
"war",
"military",
"celebrity"
]

function isRelevant(article){

const text = (article.title + " " + (article.description || "")).toLowerCase()

if(BLACKLIST.some(b => text.includes(b))){
return false
}

return AI_KEYWORDS.some(k => text.includes(k))

}

/* --------------------------------
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

/* FETCH NEWS */

const gnews = axios.get(
`https://gnews.io/api/v4/search?q=AI OR "machine learning" OR API OR "developer tools"&lang=en&max=20&token=${process.env.GNEWS_KEY}`
)

const newsapi = axios.get(
`https://newsapi.org/v2/everything?q=AI OR "machine learning" OR API OR "developer tools"&language=en&pageSize=20&apiKey=${process.env.NEWSAPI_KEY}`
)

const newsdata = axios.get(
`https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_KEY}&q=AI OR API OR "machine learning"&language=en`
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

/* FILTER */

all = all.filter(n =>
n.title &&
n.url &&
n.description &&
isRelevant(n)
)

/* DEDUPE */

const map = new Map()

all.forEach(n=>{
const key = n.title.toLowerCase().slice(0,80)
if(!map.has(key)){
map.set(key,n)
}
})

let unique = [...map.values()]

/* SORT */

unique.sort((a,b)=>
new Date(b.publishedAt) - new Date(a.publishedAt)
)

/* FORMAT */

const formatted = unique.map(n=>({

title: summarizeTitle(n.title),

description: summarizeDescription(n.description),

url: n.url,

image: n.image,

publishedAt: n.publishedAt,

source: n.source

}))

const finalNews = formatted.slice(0,40)

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