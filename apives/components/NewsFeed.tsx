import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Newspaper, Maximize2, X } from "lucide-react"

import "swiper/css"

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

// ✅ 60 words truncate
const truncateWords=(text:string,limit:number=60)=>{
if(!text) return ""
const words=text.split(" ")
if(words.length<=limit) return text
return words.slice(0,limit).join(" ")+"..."
}

const NewsFeed=()=>{

const [news,setNews]=useState<any[]>([])
const [selected,setSelected]=useState<any>(null)

const fetchNews=async(limit:number)=>{
try{
const res=await fetch("https://apives-3xrc.onrender.com/api/news")
const data=await res.json()
if(!data.success) return []
let articles=data.data||[]
const unique=[...new Map(articles.map((i:any)=>[i.url,i])).values()]
return unique.slice(0,limit)
}catch{
return []
}
}

useEffect(()=>{
fetchNews(20).then(initial=>setNews(shuffle(initial)))

const interval=setInterval(()=>{
fetchNews(10).then(newItems=>{
setNews(prev=>{
const merged=[...newItems,...prev]
const unique=[...new Map(merged.map(i=>[i.url,i])).values()]
return shuffle(unique).slice(0,60)
})
})
},30*60*1000)

return()=>clearInterval(interval)
},[])

// 🔥 STRONG SCROLL LOCK
useEffect(()=>{
if(selected){
document.body.style.overflow="hidden"
document.body.style.position="fixed"
document.body.style.width="100%"
}else{
document.body.style.overflow="auto"
document.body.style.position="static"
}
},[selected])

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
autoplay={{delay:4000,disableOnInteraction:false}}
breakpoints={{
480:{slidesPerView:1.2},
640:{slidesPerView:1.5},
768:{slidesPerView:2},
1024:{slidesPerView:2.5}
}}
>

{news.map((item,i)=>{

const favicon=getFavicon(item.url)

return(
<SwiperSlide key={i}>

<div className="group relative h-[550px] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]">

<button
onClick={()=>setSelected(item)}
className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-md border border-white/20 p-2 rounded-full"
>
<Maximize2 size={16} className="text-white"/>
</button>

<a href={item.url} target="_blank" className="block h-full">

<div className="h-48 overflow-hidden">
<img
src={item.image}
className="w-full h-full object-cover transition group-hover:scale-105"
/>
</div>

<div className="p-5 flex flex-col justify-between h-[360px]">

<div>
<h3 className="text-white font-bold text-sm mb-2">
{item.title}
</h3>

<p className="text-slate-400 text-[11px]">
{truncateWords(item.description,60)}
</p>
</div>

<div className="flex justify-between mt-3">

<div className="flex items-center gap-2 text-green-400 text-[10px]">
<img src={favicon} className="w-4 h-4"/>
{item.source?.name}
</div>

<span className="text-[10px] text-mora-400">OPEN →</span>

</div>

</div>

</a>

</div>

</SwiperSlide>
)
})}

</Swiper>

</div>

{/* 🔥 FINAL MODAL */}

{selected && (
<div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center">

<div className="
relative
w-[92%] sm:w-[420px]   /* 🔥 SMALL WIDTH */
max-h-[85vh]
bg-[#0a0a0a]
rounded-xl
border border-green-500/30
shadow-[0_0_30px_rgba(34,197,94,0.2)]
overflow-hidden
">

{/* CLOSE */}

<button
onClick={()=>setSelected(null)}
className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full z-50"
>
<X size={14} className="text-white"/>
</button>

{/* SCROLLABLE INNER */}

<div className="overflow-y-auto max-h-[85vh]">

<img src={selected.image} className="w-full h-48 object-cover"/>

<div className="p-4">

<h2 className="text-white text-sm font-bold mb-2">
{selected.title}
</h2>

<p className="text-slate-300 text-[12px] leading-relaxed">
{selected.description}
</p>

<a
href={selected.url}
target="_blank"
className="block mt-4 text-green-400 text-sm font-semibold"
>
Read Full Article →
</a>

</div>

</div>

</div>

</div>
)}

</section>

)

}

export default NewsFeed