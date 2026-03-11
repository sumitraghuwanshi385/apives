import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Newspaper } from "lucide-react"

import "swiper/css"

const TARGET_WORDS = 50
const TITLE_WORDS = 10

const AI_KEYWORDS=[
"ai",
"artificial intelligence",
"api",
"model",
"chatbot",
"agent",
"llm",
"startup",
"machine learning",
"openai",
"anthropic",
"gemini"
]

const isRelevant=(text:string)=>{
if(!text) return false
const lower=text.toLowerCase()
return AI_KEYWORDS.some(k=>lower.includes(k))
}

/* TITLE → MAX 10 WORDS */

const summarizeTitle=(title:string)=>{

if(!title) return ""

let cleaned=title
.replace(/\s+/g," ")
.replace(/[\r\n]+/g," ")
.trim()

const words=cleaned.split(" ")

if(words.length<=TITLE_WORDS){
return cleaned
}

return words.slice(0,TITLE_WORDS).join(" ")
}

/* DESCRIPTION → MAX 50 WORDS */

const summarizeTo50=(title:string,desc:string)=>{

let text=(title+" "+(desc||""))
.replace(/\s+/g," ")
.replace(/[\r\n]+/g," ")
.trim()

let words=text.split(" ")

if(words.length<=TARGET_WORDS){
return text
}

return words.slice(0,TARGET_WORDS).join(" ")
}

const shuffle=(arr:any[])=>{
return [...arr].sort(()=>Math.random()-0.5)
}

const getFavicon=(url:string)=>{
try{
const domain=new URL(url).hostname
return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}catch{
return ""
}
}

const NewsFeed=()=>{

const [news,setNews]=useState<any[]>([])

const fetchNews=async(limit:number)=>{

const res=await fetch("https://apives.onrender.com/api/news")
const data=await res.json()

if(!data.success) return []

let articles=data.data||[]

const unique=[...new Map(articles.map((i:any)=>[i.url,i])).values()]

const filtered=unique.filter((i:any)=>(
isRelevant(i.title)||isRelevant(i.description)
))

return filtered.slice(0,limit)

}

useEffect(()=>{

fetchNews(20).then(initial=>{
setNews(shuffle(initial))
})

const interval=setInterval(()=>{

fetchNews(7).then(newItems=>{

setNews(prev=>{

const merged=[...newItems,...prev]

const unique=[...new Map(merged.map(i=>[i.url,i])).values()]

return shuffle(unique).slice(0,60)

})

})

},4*60*60*1000)

return()=>clearInterval(interval)

},[])

return(

<section className="py-16 bg-black border-t border-white/5">

<div className="max-w-7xl mx-auto px-4 md:px-6">

{/* HEADER */}

<div className="text-center mb-12">

<div className="flex items-center justify-center gap-2 text-mora-400 mb-3">
<Newspaper size={18}/>
<span className="uppercase text-xs font-black tracking-[0.35em]">
Apives Feed
</span>
</div>

<h2 className="text-3xl md:text-5xl font-bold text-white">
AI & API Radar
</h2>

<p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
Latest launches in AI models, APIs, AI agents, chatbots and AI startups.
</p>

</div>

{/* SWIPER */}

<Swiper
modules={[Autoplay]}
spaceBetween={24}
slidesPerView={1.1}
grabCursor={true}
autoplay={{
delay:4000,
disableOnInteraction:false
}}
breakpoints={{
480:{slidesPerView:1.2},
640:{slidesPerView:1.6},
768:{slidesPerView:2},
1024:{slidesPerView:2.6}
}}
>

{news.map((item,i)=>{

const favicon=getFavicon(item.url)

return(

<SwiperSlide key={i}>

<a
href={item.url}
target="_blank"
className="
group
block
h-[480px]
rounded-2xl
overflow-hidden
border border-white/10
bg-[#0a0a0a]
transition-transform
duration-300
hover:scale-[1.02]
active:scale-[0.98]
"
>

{/* IMAGE */}

<div className="relative h-44 md:h-48 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>

</div>

{/* CONTENT */}

<div className="p-6 flex flex-col justify-between h-[320px]">

<div>

<h3 className="text-white font-bold text-base leading-snug mb-3">
{summarizeTitle(item.title)}
</h3>

<p className="text-slate-400 text-xs leading-relaxed">
{summarizeTo50(item.title,item.description)}
</p>

</div>

{/* SOURCE */}

<div className="flex items-center justify-between mt-6">

<div className="
flex items-center gap-2
bg-green-500/15
border border-green-500/30
text-green-400
px-3 py-1
rounded-full
text-[10px]
font-semibold
">

<img
src={favicon}
className="w-4 h-4 rounded-full"
/>

{item.source?.name||"Source"}

</div>

<span className="
text-[10px]
font-black
tracking-widest
uppercase
text-mora-400
">
OPEN →
</span>

</div>

</div>

</a>

</SwiperSlide>

)

})}

</Swiper>

</div>

</section>

)

}

export default NewsFeed