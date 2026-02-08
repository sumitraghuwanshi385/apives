import React, { useState, useEffect } from 'react';
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
LayoutGrid
} from 'lucide-react';
import { ApiListing } from '../types';
import { apiService } from '../services/apiClient';
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

const ApiCard: React.FC<{
api: ApiListing;
topIds: string[];
onLikeChange?: (id: string, delta: number) => void;
refetchLandingApis?: () => Promise<void>;
}> = ({ api, topIds, onLikeChange, refetchLandingApis }) => {
const navigate = useNavigate();
const [saved, setSaved] = useState(false);
const [isLiked, setIsLiked] = useState(false);
const [showArrows, setShowArrows] = useState(false);
const [galleryIndex, setGalleryIndex] = useState(0);
const [showVerifyInfo, setShowVerifyInfo] = useState(false);

const ADMIN_EMAIL = "beatslevelone@gmail.com";

const isAdminUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("mora_user") || "null");
    return user?.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
};

// 🔥 STEP 4 — auto hide arrows after 3 sec
useEffect(() => {
  if (!showArrows) return;

  const timer = setTimeout(() => {
    setShowArrows(false);
  }, 3000);

  return () => clearTimeout(timer);
}, [showArrows]);

const rankIndex = topIds.indexOf(api.id);
const isTopTier = rankIndex !== -1;
const rankStyle = isTopTier ? RANK_BADGE_STYLES[rankIndex] : null;

const getVerifiedApis = (): string[] => {
  try {
    return JSON.parse(
      localStorage.getItem("apives_verified_apis") || "[]"
    );
  } catch {
    return [];
  }
};

const verifiedApis = getVerifiedApis();

const isVerified = verifiedApis.includes(api.id);

useEffect(() => {

const likedApis = JSON.parse(
localStorage.getItem('mora_liked_apis') || '[]'
);
setIsLiked(likedApis.includes(api.id));

const savedApis = JSON.parse(
localStorage.getItem('mora_saved_apis') || '[]'
);
setSaved(savedApis.includes(api.id));
}, [api.id]);

const displayUpvotes = api.upvotes || 0;

// 🔥 STEP 2 – gallery scroll index tracker
useEffect(() => {
  const el = document.getElementById(`card-gallery-${api.id}`);
  if (!el) return;

  const onScroll = () => {
    const cardWidth = el.clientWidth * 0.9; // w-[90%]
    const index = Math.round(el.scrollLeft / cardWidth);
    setGalleryIndex(index);
  };

  el.addEventListener('scroll', onScroll);
  return () => el.removeEventListener('scroll', onScroll);
}, [api.id]);

const handleSave = (e: React.MouseEvent) => {
  e.preventDefault(); e.stopPropagation();
  const userStr = localStorage.getItem('mora_user');
  if (!userStr) {
    navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`);
    return;
  }

const savedApis = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');  
if (saved) {  
  setSaved(false);  
  localStorage.setItem('mora_saved_apis', JSON.stringify(savedApis.filter((aid: string) => aid !== api.id)));  
} else {  
  setSaved(true);  
  localStorage.setItem('mora_saved_apis', JSON.stringify([...savedApis, api.id]));  
}

};

const handleLike = async (e: React.MouseEvent) => {
e.preventDefault();
e.stopPropagation();

const userStr = localStorage.getItem('mora_user');
  if (!userStr) {
    navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`);
    return;
  }

const likedApis = JSON.parse(localStorage.getItem('mora_liked_apis') || '[]');

try {
if (isLiked) {
await apiService.unlikeApi(api.id);

setIsLiked(false);

await refetchLandingApis?.();
localStorage.setItem(
'mora_liked_apis',
JSON.stringify(likedApis.filter((id: string) => id !== api.id))
);
} else {
await apiService.likeApi(api.id);

setIsLiked(true);

await refetchLandingApis?.();
localStorage.setItem(
'mora_liked_apis',
JSON.stringify([...likedApis, api.id])
);
}

} catch (err) {
console.error('Like failed', err);
}
};

const tags = Array.isArray(api.tags) ? api.tags : [];

return (
<Link
to={`/api/${api.id}`}
className="group relative bg-dark-900/40 hover:bg-dark-900/80 backdrop-blur-sm
rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-mora-500/30
p-4 md:p-5 transition-all duration-500 hover:-translate-y-2 overflow-hidden
flex flex-col h-full"
>
<div className="absolute inset-0 bg-gradient-to-br from-mora-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div className="absolute top-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-mora-500/50 to-transparent opacity-70"></div>

<div className="flex justify-between items-center mb-3 relative z-20">  
    <div className="flex items-center gap-1.5 md:gap-2">  
      <span className="bg-mora-500/10 border border-mora-500/20 text-mora-400 text-[8px] md:text-[9px] font-black px-4 md:px-5 py-1 rounded-full uppercase tracking-widest h-5 md:h-6 flex items-center">  
        {api.category}  
      </span>  

      {isTopTier && rankStyle && (  
        <div className={`bg-gradient-to-r ${rankStyle.color} ${rankStyle.text} backdrop-blur-md border border-white/10 px-4 md:px-5 py-0.5 md:py-1 rounded-full flex items-center gap-1 shadow-md h-5 md:h-6`}>  
          <Trophy size={8} className="md:w-2.5 md:h-2.5 fill-current" />  
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">{rankStyle.label}</span>  
        </div>  
      )}  
    </div>  

    <button  
      onClick={handleSave}  
      className={`p-1.5 md:p-2 rounded-full transition-all duration-300 active:scale-75 ${saved ? 'bg-mora-500/20 text-mora-500' : 'bg-white/5 text-slate-500 hover:text-white'}`}  
    >  
      <Bookmark size={14} className={`md:w-4 md:h-4 transition-transform duration-300 ${saved ? 'fill-current scale-110' : 'scale-100'}`} />  
    </button>  
  </div>  

  <div className="relative z-10 flex flex-col h-full">  
    <div className="mb-2">  
      <h3 className="font-display font-bold text-white text-base md:text-lg leading-tight group-hover:text-mora-400 transition-colors">
 <span className="inline-flex items-center flex-wrap gap-0.5 leading-none">
   <span className="break-words leading-tight">
  {api.name}
</span>
    {isVerified && (
      <span className="inline-flex items-center shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowVerifyInfo(v => !v);
          }}
          title="Verified by Apives"
          className="h-5 w-5 md:h-6 md:w-6 flex items-center justify-center shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              fill="#22C55E"
              d="M22 12c0-1.2-.8-2.3-2-2.8.4-1.2.1-2.6-.8-3.4-.9-.9-2.2-1.2-3.4-.8C15.3 3.8 14.2 3 13 3s-2.3.8-2.8 2c-1.2-.4-2.6-.1-3.4.8-.9.9-1.2 2.2-.8 3.4C4.8 9.7 4 10.8 4 12s.8 2.3 2 2.8c-.4 1.2-.1 2.6.8 3.4.9.9 2.2 1.2 3.4.8.5 1.2 1.6 2 2.8 2s2.3-.8 2.8-2c1.2.4 2.6.1 3.4-.8.9-.9 1.2-2.2.8-3.4 1.2-.5 2-1.6 2-2.8z"
            />
            <path
              d="M9.2 12.3l2 2.1 4.6-4.8"
              stroke="#000"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </button>

        {showVerifyInfo && (
          <span
            className="
              absolute
              top-full
              left-1/2
              -translate-x-1/2
              mt-1.5
              bg-green-600
              border border-green-700
              rounded-full
              px-3 py-0.5
              text-[10px]
              text-white
              font-semibold
              whitespace-nowrap
              shadow-lg
              z-50
            "
          >
            Manually Verified by Apives
          </span>
        )}
      </span>
    )}

   {/* ✅ NEW BADGE — BASELINE ALIGNED (NICHE NAHI) */}
    {isNew(api.createdAt) && (
      <span className="
        ml-1
        inline-flex
        items-center
        text-[8px] md:text-[9px]
        bg-white
        text-black
        px-2
        py-0.5
        rounded-full
        font-bold
        uppercase
        tracking-wide
        leading-none
      ">
        New
      </span>
    )}

  </span>
</h3>

      <div className="flex items-center gap-2 mt-1">  
        <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 uppercase tracking-tighter">  
          <Server size={10} className="text-mora-500/50" /> {api.provider}  
        </p>  
      </div>  
    </div>  

{/* 🔥 API CARD IMAGE GALLERY */}
{api.gallery && api.gallery.length > 0 && (
  <div
    className="relative mb-3"
    onMouseEnter={() => setShowArrows(true)}
    onMouseLeave={() => setShowArrows(false)}
    onTouchStart={() => setShowArrows(true)}
  >
    {/* IMAGE STRIP */}
    <div
      id={`card-gallery-${api.id}`}
      className="flex overflow-x-auto gap-3 snap-x no-scrollbar"
    >
      {api.gallery.slice(0, 5).map((img: string, i: number) => (
        <div
          key={i}
          className="
  flex-none
  w-[90%]
  aspect-[16/9]
  md:aspect-[16/9]
  rounded-xl
  overflow-hidden
          border border-white/10 snap-center bg-black"
        >
          <img
            src={img}
            alt={`${api.name}-${i}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>

    {/* LEFT ARROW */}
{showArrows && galleryIndex > 0 && (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      const el = document.getElementById(`card-gallery-${api.id}`);
      if (!el) return;
      el.scrollBy({ left: -200, behavior: 'smooth' });
    }}
    className="absolute left-2 top-1/2 -translate-y-1/2
      h-8 w-8 rounded-full bg-black/60 border border-white/20
      text-white text-lg flex items-center justify-center backdrop-blur-sm"
  >
    ‹
  </button>
)}

{/* RIGHT ARROW */}
{showArrows && galleryIndex < api.gallery.length - 1 && (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      const el = document.getElementById(`card-gallery-${api.id}`);
      if (!el) return;
      el.scrollBy({ left: 200, behavior: 'smooth' });
    }}
    className="absolute right-2 top-1/2 -translate-y-1/2
      h-8 w-8 rounded-full bg-black/60 border border-white/20
      text-white text-lg flex items-center justify-center backdrop-blur-sm"
  >
    ›
  </button>
)}
  </div>
)}
    <p className="text-[13px] md:text-sm text-slate-400 mb-4 md:mb-6 line-clamp-4 leading-relaxed font-light">  
      {api.description}  
    </p>  

    <div className="flex flex-wrap gap-2 mb-6 md:mb-8 mt-auto">  
      {tags.slice(0, 5).map((tag: string) => (  
        <span  
          key={tag}  
          className="text-[9px] md:text-[10px] text-slate-500 bg-white/5 border border-white/10 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex items-center"  
        >  
          <Hash size={8} className="mr-1 text-mora-500/50" /> {tag}  
        </span>  
      ))}  
    </div>  

    <div className="pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between">  
      <div className="flex gap-4 md:gap-6">  
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold">  
          <Activity size={12} className="text-mora-500" />  
          <span className="text-slate-300 font-mono">{api.latency}</span>  
        </div>  

        <button onClick={handleLike} className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold group/like">  
       <Heart
  size={12}
  className={`${isLiked
    ? 'text-red-500 fill-current drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]'
    : 'text-red-500/50 group-hover/like:text-red-500'
  } transition-all`}
/>
          <span className="text-slate-300 font-mono">{displayUpvotes}</span>  
        </button>  
      </div>  

      <span className={`text-[8px] md:text-[10px] font-black px-4 md:px-5 py-1 rounded-full border ${  
        api.pricing.type === 'Free'  
          ? 'bg-green-500/10 text-green-400 border-green-500/20'  
          : api.pricing.type === 'Paid'  
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'  
            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'  
      } uppercase tracking-[0.2em]`}>  
        {api.pricing.type}  
      </span>  
    </div>  
  </div>  
</Link>

);
};

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
const featuredApis = shuffleArray(allApis).slice(0, itemsToShow);
const freshApis = allApis.filter(api => isNew(api.publishedAt)).slice(0, itemsToShow);
const communityLoved = [...allApis].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).slice(0, itemsToShow);

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
        <p className="text-4xl md:text-5xl font-display font-black text-white">
          {allApis.length}
        </p>

        {/* SUBTEXT */}
        <p className="mt-2 text-[11px] md:text-xs text-mora-400 tracking-wide">
          Live on Apives
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
        key={`new-${idx}`}
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
        key={`loved-${idx}`}
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