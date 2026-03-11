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

if(articles.length>30){
articles=articles.slice(0,30)
}

setNews(articles)

localStorage.setItem(
CACHE_KEY,
JSON.stringify({
time:Date.now(),
data:articles
})
)

}

})

},[])

return(

<section className="py-20 bg-black border-t border-white/5 relative overflow-hidden">

{/* background glow */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_70%)]"/>

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
Daily signals from AI models and developer APIs shaping the future of software.
</p>

</div>


{/* SWIPER */}

<Swiper
modules={[Autoplay]}
spaceBetween={26}
slidesPerView={1.35}
centeredSlides={true}
grabCursor={true}
loop={true}
autoplay={{
delay:4000,
disableOnInteraction:false
}}
breakpoints={{
480:{slidesPerView:1.5},
640:{slidesPerView:1.8},
768:{slidesPerView:2.3},
1024:{slidesPerView:2.8}
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
rounded-[26px]
overflow-hidden
border border-white/10
bg-[#0a0a0a]
transition-all
duration-500
active:-translate-y-2
hover:-translate-y-2
shadow-[0_10px_40px_rgba(0,0,0,0.6)]
hover:shadow-[0_0_70px_rgba(34,197,94,0.35)]
"
>

{/* IMAGE */}

<div className="relative h-40 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>

</div>


{/* CONTENT */}

<div className="p-6">

<h3 className="text-white font-bold text-lg leading-snug">
{item.title}
</h3>

<p className="text-slate-400 text-sm mt-3 leading-relaxed">
{summarize(item.description)}
</p>


{/* SOURCE */}

<div className="flex items-center justify-between mt-5">

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

{item.source?.name || "Source"}

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