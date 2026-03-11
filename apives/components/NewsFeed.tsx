import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Newspaper } from "lucide-react"

import "swiper/css"

const CACHE_KEY="apives_news_cache"
const CACHE_TIME=24*60*60*1000

const summarize=(text:string)=>{

if(!text) return ""

let cleaned=text
.replace(/\s+/g," ")
.replace(/[\r\n]+/g," ")

if(cleaned.length>300){
cleaned=cleaned.substring(0,300)
}

return cleaned
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

useEffect(()=>{

const cached=localStorage.getItem(CACHE_KEY)

if(cached){

const parsed=JSON.parse(cached)

if(Date.now()-parsed.time<CACHE_TIME){
setNews(parsed.data)
return
}

}

fetch("https://apives.onrender.com/api/news")
.then(res=>res.json())
.then(data=>{

if(data.success){

let articles=data.data || []

// remove duplicates
const unique=[...new Map(articles.map(item=>[item.url,item])).values()]

// limit 30
const limited=unique.slice(0,30)

setNews(limited)

localStorage.setItem(
CACHE_KEY,
JSON.stringify({
time:Date.now(),
data:limited
})
)

}

})

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
Daily signals from AI models and developer APIs shaping the future of software.
</p>

</div>


{/* SWIPER */}

<Swiper
modules={[Autoplay]}
spaceBetween={18}
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
h-[360px]
rounded-2xl
overflow-hidden
border border-white/10
bg-[#0a0a0a]
transition-all
duration-300
hover:scale-[1.02]
active:scale-[0.98]
"
>

{/* IMAGE */}

<div className="relative h-32 md:h-36 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>

</div>


{/* CONTENT */}

<div className="p-5 flex flex-col justify-between h-[220px]">

<div>

<h3 className="text-white font-bold text-base md:text-lg leading-snug line-clamp-2">
{item.title}
</h3>

<p className="text-slate-400 text-sm mt-3 leading-relaxed line-clamp-5">
{summarize(item.description)}
</p>

</div>


{/* SOURCE */}

<div className="flex items-center justify-between mt-4">

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

{item.source?.name || "Source"}

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