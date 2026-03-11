import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Newspaper } from "lucide-react"

import "swiper/css"

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

const summarize=(text:string)=>{

if(!text) return ""

let cleaned=text
.replace(/\s+/g," ")
.replace(/[\r\n]+/g," ")
.trim()

const words=cleaned.split(" ")

if(words.length>100){
return words.slice(0,100).join(" ")
}

return cleaned
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

// first load
fetchNews(20).then(initial=>{
setNews(shuffle(initial))
})

// refresh every 4h
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
spaceBetween={20}
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

<div className="relative h-36 md:h-40 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>

</div>

{/* CONTENT */}

<div className="p-5">

<h3 className="text-white font-bold text-base md:text-lg leading-snug mb-3">
{item.title}
</h3>

<p className="text-slate-400 text-sm leading-relaxed">
{summarize(item.description)}
</p>

{/* SOURCE */}

<div className="flex items-center justify-between mt-5">

<div className="
flex items-center gap-2
bg-green-500/15
border border-green-500/30
text-green-400
px-3 py-1
rounded-full
text-xs
font-semibold
">

<img
src={favicon}
className="w-4 h-4 rounded-full"
/>

{item.source?.name||"Source"}

</div>

<span className="
text-xs
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