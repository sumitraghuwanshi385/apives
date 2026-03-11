import React,{useEffect,useState} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Newspaper, Zap } from "lucide-react"

import "swiper/css"

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

<section className="py-16 bg-black border-t border-white/5 relative overflow-hidden">

{/* ambient glow */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_65%)]"/>

<div className="max-w-7xl mx-auto px-6 relative z-10">

{/* HEADER */}

<div className="text-center mb-12">

<div className="flex items-center justify-center gap-2 text-mora-400 mb-3">
<Newspaper size={18}/>
<span className="uppercase text-xs font-black tracking-[0.35em]">
Apives Feed
</span>
</div>

<h2 className="text-3xl md:text-4xl font-bold text-white">
AI & API Daily Radar
</h2>

<p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
Daily signals from AI models, APIs, developer tools and ecosystem launches.
</p>

</div>


{/* TINDER STYLE SWIPE */}

<Swiper
modules={[Autoplay]}
spaceBetween={28}
slidesPerView={1.15}
grabCursor={true}
centeredSlides={true}
breakpoints={{
640:{slidesPerView:1.4},
768:{slidesPerView:1.9},
1024:{slidesPerView:2.5}
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
block
rounded-3xl
overflow-hidden
border border-white/10
bg-[#0b0b0b]
transition-all
duration-500
hover:-translate-y-2
shadow-[0_10px_60px_rgba(0,0,0,0.6)]
hover:shadow-[0_0_60px_rgba(34,197,94,0.25)]
"
>

{/* IMAGE */}

<div className="relative h-56 overflow-hidden">

<img
src={item.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
alt="news"
className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"/>

{/* category badge */}

<div className="
absolute top-4 left-4
flex items-center gap-1
px-3 py-1
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
Feed

</div>

</div>


{/* CONTENT */}

<div className="p-6">

<h3 className="text-white font-bold text-base leading-snug line-clamp-2">
{item.title}
</h3>

<p className="text-slate-400 text-xs mt-3 line-clamp-2 leading-relaxed">
{item.description}
</p>

<div className="flex items-center justify-between mt-5">

<span className="text-[11px] text-slate-500">
{item.source.name}
</span>

<span className="
text-[11px]
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

))}

</Swiper>

</div>

</section>

)

}

export default NewsFeed