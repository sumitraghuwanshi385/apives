import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Newspaper, Zap } from "lucide-react"

import "swiper/css"

const CACHE_KEY="apives_news_cache"
const CACHE_TIME=24*60*60*1000

const summarize=(text:string)=>{

if(!text) return ""

let cleaned=text
.replace(/\s+/g," ")
.replace(/[\r\n]+/g," ")

if(cleaned.length>150){
cleaned=cleaned.substring(0,150)
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

const limited=data.data.slice(0,30)

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

<section className="py-20 bg-black border-t border-white/5 relative overflow-hidden">

<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_65%)]"/>

<div className="max-w-7xl mx-auto px-6 relative z-10">

{/* HEADER */}

<div className="text-center mb-14">

<div className="flex items-center justify-center gap-2 text-mora-400 mb-3">

<Newspaper size={18}/>

<span className="uppercase text-xs font-black tracking-[0.35em]">
Apives Feed
</span>

</div>

<h2 className="text-4xl md:text-5xl font-bold text-white">
AI & API Radar
</h2>

<p className="text-slate-400 text-sm mt-4 max-w-xl mx-auto">
Discover daily signals from AI models, developer APIs and tools shaping the future of software.
</p>

</div>


{/* SWIPER */}

<Swiper
modules={[Autoplay]}
spaceBetween={34}
slidesPerView={1.1}
grabCursor={true}
centeredSlides={true}
autoplay={{
delay:4000,
disableOnInteraction:false
}}
breakpoints={{
640:{slidesPerView:1.4},
768:{slidesPerView:1.8},
1024:{slidesPerView:2.4}
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
rounded-[28px]
overflow-hidden
border border-white/10
bg-[#0a0a0a]
transition-all
duration-500
hover:-translate-y-2
shadow-[0_20px_80px_rgba(0,0,0,0.65)]
hover:shadow-[0_0_70px_rgba(34,197,94,0.35)]
"
>

{/* IMAGE */}

<div className="relative h-64 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"/>

{/* FEED BADGE */}

<div className="
absolute top-5 left-5
flex items-center gap-2
px-4 py-1.5
rounded-full
text-[10px]
font-black
tracking-widest
uppercase
bg-mora-500/20
text-mora-400
border border-mora-500/40
">

<Zap size={12}/>
Feed Grade

</div>

</div>


{/* CONTENT */}

<div className="p-7">

<h3 className="text-white font-bold text-lg leading-snug">
{item.title}
</h3>

<p className="text-slate-400 text-sm mt-4 leading-relaxed">
{summarize(item.description)}
</p>


{/* SOURCE */}

<div className="flex items-center justify-between mt-6">

<div className="
flex items-center gap-2
bg-green-500/15
border border-green-500/30
text-green-400
px-3 py-1.5
rounded-full
text-xs
font-semibold
">

<img
src={favicon}
className="w-4 h-4 rounded-full"
/>

{item.source.name}

</div>

<span className="
text-xs
font-black
tracking-widest
uppercase
text-mora-400
group-hover:text-white
transition
">
Open →
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