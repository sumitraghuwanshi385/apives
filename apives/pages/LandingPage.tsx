import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
TrendingUp,
Heart,
Bookmark,
Activity,
Zap,
Hash,
Server,
Trophy,
LayoutGrid,
Image
} from 'lucide-react';
import { ApiListing } from '../types';
import { apiService } from '../services/apiClient';
import ApiCard from '../components/ApiCard';
let LANDING_API_CACHE: ApiListing[] | null = null;

const trackSponsor = (sponsor: string, type: "impression" | "click") => {
 console.log("SPONSOR TRACK FIRED 👉", sponsor, type); fetch("https://apives.onrender.com/api/sponsor/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sponsor: sponsor,
      type: type,
      page: window.location.pathname
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Sponsor tracked:", data);
    })
    .catch(err => {
      console.error("❌ Sponsor track failed:", err);
    });
};

// AFTER ✅ ADD THIS
const handleSponsorClick = (
  sponsor: string,
  baseUrl: string
) => {
  // 1️⃣ click track
  trackSponsor(sponsor, "click");

  // 2️⃣ utm url
  const utmUrl =
    `${baseUrl}?utm_source=apives&utm_medium=sponsor&utm_campaign=apives_api_marketplace`;

  // 3️⃣ redirect
  window.open(utmUrl, "_blank", "noopener,noreferrer");
};

/* ===== SECTION LOADER ===== */
const SectionLoader: React.FC<{ text: string }> = ({ text }) => (
  <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border border-mora-500/20 animate-ping"></div>
      <div className="absolute inset-0 rounded-full border-2 border-mora-500 border-t-transparent animate-spin"></div>
    </div>

    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono">
      {text}
    </p>
  </div>
);
/* ========================== */

const isNew = (dateString: string) => {
if (!dateString) return false;
const publishedDate = new Date(dateString).getTime();
if (Number.isNaN(publishedDate)) return false;

const now = Date.now();
const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
return (now - publishedDate) < fifteenDaysInMs;
};

const shuffleArray = <T,>(arr: T[]): T[] => {
return [...arr].sort(() => Math.random() - 0.5);
};

const RANK_BADGE_STYLES = [
{ label: 'Apex', color: 'from-amber-400 to-yellow-600', text: 'text-black' },
{ label: 'Prime', color: 'from-slate-200 to-slate-400', text: 'text-black' },
{ label: 'Zenith', color: 'from-orange-400 to-amber-700', text: 'text-white' }
];

export const LandingPage: React.FC = () => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userName, setUserName] = useState('');
const [allApis, setAllApis] = useState<ApiListing[]>([]);
const [top3Ids, setTop3Ids] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [isMobile, setIsMobile] = useState(
  typeof window !== 'undefined' && window.innerWidth < 768
);

useEffect(() => {
// 🔥 Sponsor impressions
  trackSponsor("serpapi", "impression");
  trackSponsor("scoutpanels", "impression");
const handleResize = () => setIsMobile(window.innerWidth < 768);
window.addEventListener('resize', handleResize);

const user = localStorage.getItem('mora_user');
if (user) {
setIsAuthenticated(true);
setUserName(JSON.parse(user).name || 'Builder');
}

(async () => {
try {
// 🚀 STEP 1: cache se turant dikhao
if (LANDING_API_CACHE) {
setAllApis(LANDING_API_CACHE);
setTop3Ids(
[...LANDING_API_CACHE]
.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
.slice(0, 3)
.map(a => a.id)
);
setIsLoading(false);
return;
}

// 🌐 STEP 2: API call (sirf first time)  
  const res = await apiService.getAllApis();  
  const list = Array.isArray(res) ? res : res?.data || [];  

  const db: ApiListing[] = list.map((a: any) => ({  
    ...a,  
    id: a._id,  
    publishedAt: a.createdAt,  
    tags: Array.isArray(a.tags) ? a.tags : [],  
    features: Array.isArray(a.features) ? a.features : [],  
  }));  

  // ✅ STEP 3: cache me store  
  LANDING_API_CACHE = db;  

  setAllApis(db);  
  setTop3Ids(  
    [...db]  
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))  
      .slice(0, 3)  
      .map(a => a.id)  
  ); 
setIsLoading(false);  
} catch (e) {  
  console.error('LandingPage fetch failed', e);  
}

})();

return () => window.removeEventListener('resize', handleResize);
}, []);

const updateLandingUpvotes = (apiId: string, delta: number) => {
setAllApis(prev =>
prev.map(api =>
api.id === apiId
? { ...api, upvotes: Math.max((api.upvotes || 0) + delta, 0) }
: api
)
);
};
const refetchLandingApis = async () => {
try {
const res = await apiService.getAllApis();
const list = Array.isArray(res) ? res : res?.data || [];

const db: ApiListing[] = list.map((a: any) => ({  
  ...a,  
  id: a._id,  
  publishedAt: a.createdAt,  
  tags: Array.isArray(a.tags) ? a.tags : [],  
  features: Array.isArray(a.features) ? a.features : [],  
}));  

LANDING_API_CACHE = db; // ✅ sync cache  
setAllApis(db);  

setTop3Ids(  
  [...db]  
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))  
    .slice(0, 3)  
    .map(a => a.id)  
);

} catch (e) {
console.error('Refetch failed', e);
}
};

const itemsToShow = 6;

const featuredApis = useMemo(() => {
  return shuffleArray(allApis).slice(0, itemsToShow);
}, [allApis]);

const freshApis = useMemo(() => {
  return allApis
    .filter(api => isNew(api.publishedAt))
    .slice(0, itemsToShow);
}, [allApis]);

const communityLoved = useMemo(() => {
  return [...allApis]
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    .slice(0, itemsToShow);
}, [allApis]);

return (
<div className="flex flex-col min-h-screen overflow-hidden bg-black text-slate-100 selection:bg-mora-500/30">
<section className="relative pt-24 md:pt-36 pb-8 md:pb-12 overflow-hidden">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none"></div>
<div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
<h1 className="text-3xl md:text-8xl font-display font-bold text-white tracking-tighter mb-4 md:mb-8 leading-[1] animate-slide-up">
{isAuthenticated ? (
<>Welcome, <span className="text-mora-500">{userName}</span>.</>
) : (
<>Discover APIs. <br /><span className="text-mora-500">Deploy Potential.</span></>
)}
</h1>

<p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto mt-4 font-light leading-relaxed animate-fade-in opacity-80">  
        {isAuthenticated  
          ? 'The grid is operational. Discover and integrate verified endpoint protocols.'  
          : 'Apives curates APIs with clear pricing, stability, access types, and real endpoint examples. This helps developers avoid guesswork caused by incomplete docs or outdated GitHub repositories.'}  
      </p>  

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 md:mt-8">  
        <Link
  to="/browse"
  className="px-6 py-3 md:px-8 md:py-3.5 text-[11px] md:text-xs font-black text-black bg-mora-500 rounded-full transition-all hover:scale-105 hover:bg-white shadow-[0_0_25px_rgba(34,197,94,0.25)] active:scale-95 uppercase tracking-widest"
>
  Explore APIs
</Link>

<Link
  to="/submit"
  className="px-6 py-3 md:px-8 md:py-3.5 text-[11px] md:text-xs font-black text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
>
  Submit API
</Link>
      </div>  
    </div>  
  </section>  

<section className="pt-2 pb-3 md:pt-3 md:pb-4 bg-black border-t border-white/5">

{/* 🔥 TOTAL APIs STAT */}
<div className="py-4 md:py-6 bg-black">
  <div className="w-full max-w-none mx-auto px-4 md:px-10 lg:px-20">
<div
  className="
    relative
    rounded-xl md:rounded-2xl
    px-5 py-5 md:px-8 md:py-6
    bg-white/[0.03]
    border border-mora-500/30
shadow-[0_0_30px_rgba(34,197,94,0.15)]
    text-center
    overflow-hidden
  "
>
{/* animated green sweep */}
<div className="
  absolute -inset-[40%]
  bg-gradient-to-r from-transparent via-mora-500/15 to-transparent
  rotate-12
  animate-[spin_18s_linear_infinite]
  opacity-60
"></div>

{/* glow vignette */}
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none"></div>

{/* soft animated green background */}
<div className="
  absolute inset-0
  bg-[radial-gradient(circle_at_25%_20%,rgba(34,197,94,0.18),transparent_55%),
      radial-gradient(circle_at_75%_80%,rgba(34,197,94,0.12),transparent_60%)]
  animate-[pulse_8s_ease-in-out_infinite]
opacity-60
"></div>

      {/* subtle accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-mora-500 rounded-full opacity-80"></div>

      <div className="relative z-10">
        {/* TITLE */}
        <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">
          Total APIs Listed
        </p>

        {/* COUNT */}
        <p className="text-3xl md:text-5xl font-display font-black text-white">
  {isLoading ? "Counting..." : allApis.length}
</p>

<p className="mt-2 text-[11px] md:text-xs text-mora-400 tracking-wide">
  {isLoading ? "It takes a few seconds" : "Live on Apives"}
</p>

      </div>
    </div>
  </div>
</div>

{/* Community Sponsor */}

  <div className="pb-6 md:pb-8">  
    <div className="max-w-5xl mx-auto px-6 text-center">  
      <p className="
  text-[10px] md:text-xs
  uppercase tracking-[0.35em]
  font-black
  bg-gradient-to-r from-amber-400 to-yellow-600
  bg-clip-text text-transparent
  mb-4
">
  Apex Sponsor     </p>  <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    handleSponsorClick(
      "scoutpanels",
      "https://scoutpanels.com"
    );
  }}
  className="relative inline-flex items-center gap-4 px-6 py-4 rounded-2xl
  border border-amber-400/40
  bg-gradient-to-br from-amber-400/15 to-transparent
  hover:from-amber-400/25
  shadow-[0_0_40px_rgba(245,158,11,0.25)]
  hover:shadow-[0_0_60px_rgba(245,158,11,0.45)]"
>
<img  
src="https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg"  
alt="ScoutPanels"  
className="h-10 md:h-12 w-10 md:w-12 object-contain   
rounded-2xl bg-white/10 p-1"  
/>

  <div className="text-left">  
    <p className="text-white font-bold text-sm md:text-base">  
      ScoutPanels  
    </p>  
    <p className="text-slate-400 text-xs md:text-sm">  
      Turning B2B Feedback into Adoption Signals  
    </p>  
  </div>  
</a>  
    </div>  
  </div>  

{/* ===============================
 WHAT ARE YOU BUILDING TODAY
================================ */}
<section className="py-10 md:py-16 bg-black border-t border-white/5 relative overflow-hidden">

  {/* glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)] pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

    {/* Header */}
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
        What are you building today?
      </h2>
      <p className="mt-2 text-slate-400 text-sm md:text-base max-w-xl mx-auto">
        Choose a use-case and explore APIs curated specifically for that build.
      </p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

      {[
  {
    title: "AI Chatbots",
    desc: "LLMs, chat, assistants",
    icon: Zap,
    link: "/build/chatbots"
  },
  {
    title: "Voice to Text",
    desc: "Speech recognition APIs",
    icon: Activity,
    link: "/build/voice"
  },
  {
    title: "Image Generation",
    desc: "Text → Image models",
    icon: Image,
    link: "/build/image-generation"
  },
  {
    title: "Payments",
    desc: "Billing & subscriptions",
    icon: Server,
    link: "/build/payments"
  },
  {
    title: "Authentication",
    desc: "Login, OTP, identity",
    icon: Hash,
    link: "/build/authentication"
  },
  {
    title: "Analytics",
    desc: "Tracking & insights",
    icon: TrendingUp,
    link: "/build/analytics"
  }
      ].map((item, i) => (
        <Link
          key={i}
          to={item.link}
          className="
            group relative
            bg-dark-900/50 hover:bg-dark-900/80
            border border-white/10 hover:border-mora-500/40
            rounded-2xl
            p-4 md:p-6
            transition-all duration-500
            hover:-translate-y-1
            overflow-hidden
          "
        >
          {/* hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-mora-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex flex-col gap-3">

            {/* Icon */}
            <div className="
              w-10 h-10 md:w-12 md:h-12
              rounded-xl
              flex items-center justify-center
              bg-mora-500/10
              border border-mora-500/30
              text-mora-400
              shadow-[0_0_20px_rgba(34,197,94,0.25)]
            ">
              <item.icon size={22} />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-white font-bold text-sm md:text-base tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-400 text-[11px] md:text-sm mt-1">
                {item.desc}
              </p>
            </div>

            {/* CTA */}
            <span className="
              mt-auto
              inline-flex items-center gap-1
              text-[10px] md:text-xs
              font-black uppercase tracking-widest
              text-mora-400
            ">
              Explore APIs →
            </span>

          </div>
        </Link>
      ))}

    </div>
  </div>
</section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
          <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">  
            <LayoutGrid className="mr-3 text-mora-500" size={18} /> The Universal Grid  
          </h2> 
 {isLoading ? (
  <SectionLoader text="Loading the Universal Grid" />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
    {featuredApis.map((api, idx) => (
      <ApiCard
        key={`${api.id}-${idx}`}
        api={api}
        topIds={top3Ids}
        onLikeChange={updateLandingUpvotes}
        refetchLandingApis={refetchLandingApis}
      />
    ))}
  </div>
)}

<div className="flex justify-center">  
        <Link to="/browse" className="px-10 py-4 md:px-14 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95">  
          Browse All APIs 
        </Link>  
      </div>  
    </div>  
  </section>  
 
    <section className="py-16 md:py-24 bg-dark-950 border-t border-white/5">  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
        <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">  
          <Zap className="mr-3 text-white" size={18} /> Fresh APIs  
        </h2>  

        {isLoading ? (
  <SectionLoader text="Syncing fresh APIs" />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
    {freshApis.map((api, idx) => (
      <ApiCard
        key={`new-${api.id}`}
        api={api}
        topIds={top3Ids}
        onLikeChange={updateLandingUpvotes}
        refetchLandingApis={refetchLandingApis}
      />
    ))}
  </div>
)}

<div className="flex justify-center">  
          <Link to="/fresh" className="px-10 py-4 md:px-14 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95">  
            View New Arrivals  
          </Link>  
        </div>  
      </div>  
    </section>  

  <section className="py-16 md:py-24 bg-black border-t border-white/5">  
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
      <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">  
        <Heart className="mr-3 text-red-500" size={18} /> Community Favorites  
      </h2>  

      {isLoading ? (
  <SectionLoader text="Fetching community favorites" />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
    {communityLoved.map((api, idx) => (
      <ApiCard
        key={`loved-${api.id}`}
        api={api}
        topIds={top3Ids}
        onLikeChange={updateLandingUpvotes}
        refetchLandingApis={refetchLandingApis}
      />
    ))}
  </div>
)}

<div className="flex justify-center">  
        <Link to="/popular" className="px-10 py-4 md:px-14 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all hover:bg-white/10 active:scale-95">  
          View Top APIs  
        </Link>  
      </div>

{/* PRIME SPONSOR */}
<div className="pb-6 md:pb-8">
  <div className="max-w-5xl mx-auto px-6 text-center">

    <p
      className="
        mt-12 md:mt-16
        text-[10px] md:text-xs
        uppercase tracking-[0.35em]
        font-black
        bg-gradient-to-r from-slate-200 to-slate-400
        bg-clip-text text-transparent
        mb-4
      "
    >
      Prime Sponsor
    </p>

    <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    handleSponsorClick(
      "serpapi",
      "https://serpapi.com"
    );
  }}
      className="
  relative inline-flex items-center gap-3
  px-5 md:px-6 py-3 md:py-3.5
  max-w-[520px] w-full
  rounded-2xl

  border border-white/20
  bg-gradient-to-br from-white/10 to-transparent
  hover:from-white/20

  transition-all hover:scale-[1.02]
  shadow-[0_0_40px_rgba(255,255,255,0.12)]
  hover:shadow-[0_0_60px_rgba(255,255,255,0.22)]
"
    >
      <img
        src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"
        alt="SerpApi"
        className="
          h-10 md:h-12 w-10 md:w-12
          object-contain rounded-2xl
          bg-white p-1
        "
      />

      <div className="text-left">
        <p className="text-white font-bold text-sm md:text-base">
          SerpApi
</p>
     <p
  className="
    text-slate-400
    text-[11px] md:text-xs
    leading-snug
    max-w-[320px] md:max-w-[360px]
  "
>
  Real-time Google Search results via a fast, reliable API built for developers.
</p>
      </div>
    </a>
  </div>
</div>
    </div> 
  </section>  
</div>

);
};