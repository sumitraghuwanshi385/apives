import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"

const NewsFeed = () => {

const [news,setNews]=useState([])

useEffect(()=>{

fetch("https://apives.onrender.com/api/news")
.then(res=>res.json())
.then(data=>{
if(data.success){
setNews(data.data)
}
})

},[])

return(

<section className="py-14 bg-black border-t border-white/5 relative overflow-hidden">

{/* background glow */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]"/>

<div className="max-w-7xl mx-auto px-6 relative z-10">

{/* HEADER */}

<div className="flex items-center justify-between mb-8">

<h2 className="text-3xl md:text-4xl font-bold text-white">
🔥 AI / API Daily Feed
</h2>

<p className="text-slate-400 text-sm">
Latest updates in AI & developer APIs
</p>

</div>

{/* SLIDER */}

<Swiper
modules={[Navigation,Autoplay]}
spaceBetween={20}
slidesPerView={1.2}
navigation
autoplay={{
delay:3500,
disableOnInteraction:false
}}
breakpoints={{
640:{slidesPerView:1.5},
768:{slidesPerView:2.2},
1024:{slidesPerView:3}
}}
>

{news.map((item:any,i:number)=>(

<SwiperSlide key={i}>

<a
href={item.url}
target="_blank"
className="
group
relative
rounded-2xl
overflow-hidden
border border-white/10
bg-dark-900
hover:border-mora-500/40
transition-all
duration-500
hover:-translate-y-1
shadow-[0_0_40px_rgba(0,0,0,0.5)]
"
>

{/* IMAGE */}

<div className="relative h-44 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
alt="news"
className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
/>

{/* overlay */}

<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>

<p className="
absolute top-3 left-3
text-[10px]
uppercase
font-black
tracking-widest
px-2 py-1
rounded-full
bg-mora-500/20
text-mora-400
border border-mora-500/40
">
AI / API
</p>

</div>

{/* CONTENT */}

<div className="p-5">

<h3 className="text-white font-bold text-sm leading-snug line-clamp-2">
{item.title}
</h3>

<p className="text-slate-400 text-xs mt-2 line-clamp-3">
{item.description}
</p>

<div className="flex items-center justify-between mt-4">

<p className="text-xs text-slate-500">
{item.source.name}
</p>

<span className="text-mora-400 text-xs font-bold">
Read →
</span>

</div>

</div>

</a>

</SwiperSlide>

))}

</Swiper>

</div>

</section>

)

}

export default NewsFeed