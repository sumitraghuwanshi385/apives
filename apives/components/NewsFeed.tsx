import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Newspaper, Maximize2, X } from "lucide-react" // ✅ added icons

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

// ✅ NEW truncate function
const truncate=(text:string,limit:number=120)=>{
if(!text) return ""
return text.length>limit ? text.slice(0,limit)+"..." : text
}

const NewsFeed=()=>{

const [news,setNews]=useState<any[]>([])

// ✅ modal state
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

fetchNews(20).then(initial=>{
setNews(shuffle(initial))
})

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

return(

<section
id="news-feed"
className="py-16 bg-black border-t border-white/5 scroll-mt-32"
>

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

<div
className="
group
relative
block
h-[570px]
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

{/* ✅ EXPAND BUTTON */}

<button
onClick={()=>setSelected(item)}
className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black p-2 rounded-full"
>
<Maximize2 size={16} className="text-white"/>
</button>

<a
href={item.url}
target="_blank"
rel="noopener noreferrer"
className="block h-full"
>

{/* IMAGE */}

<div className="relative h-48 md:h-52 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>

</div>

{/* CONTENT */}

<div className="p-6 flex flex-col justify-between h-[370px]">

<div>

<h3 className="text-white font-bold text-sm leading-snug mb-3">
{item.title}
</h3>

{/* ✅ TRUNCATED TEXT */}
<p className="text-slate-400 text-[11px] leading-relaxed">
{truncate(item.description,120)}
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

{item.source?.name || "Source"}

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

</div>

</SwiperSlide>

)

})}

</Swiper>

</div>

{/* ✅ FULLSCREEN MODAL */}

{selected && (
<div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

<div className="bg-[#0a0a0a] max-w-2xl w-full rounded-2xl overflow-hidden animate-[fadeIn_0.3s_ease]">

{/* CLOSE */}

<div className="flex justify-end p-3">
<button onClick={()=>setSelected(null)}>
<X className="text-white"/>
</button>
</div>

<img
src={selected.image}
className="w-full h-60 object-cover"
/>

<div className="p-6">

<h2 className="text-white text-lg font-bold mb-3">
{selected.title}
</h2>

{/* ✅ FULL DESCRIPTION */}
<p className="text-slate-300 text-sm leading-relaxed">
{selected.description}
</p>

<a
href={selected.url}
target="_blank"
className="inline-block mt-5 text-green-400 text-sm font-semibold"
>
Read Full Article →
</a>

</div>

</div>

</div>
)}

</section>

)

}

export default NewsFeed