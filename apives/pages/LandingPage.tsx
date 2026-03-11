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
LayoutGrid,
Image,
Copy,
Check,
Play
} from 'lucide-react';
import { ApiListing } from '../types';
import { apiService } from '../services/apiClient';
import ApiCard from '../components/ApiCard';
let LANDING_API_CACHE:
  | {
      universal: ApiListing[];
      fresh: ApiListing[];
      community: ApiListing[];
    }
  | null = null;

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

const lightShuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const RANK_BADGE_STYLES = [
{ label: 'Apex', color: 'from-amber-400 to-yellow-600', text: 'text-black' },
{ label: 'Prime', color: 'from-slate-200 to-slate-400', text: 'text-black' },
{ label: 'Zenith', color: 'from-orange-400 to-amber-700', text: 'text-white' }
];

const QuickStartPlayground = () => {

const [lang,setLang] = useState("python");
const [copied,setCopied] = useState(false);
const [code,setCode] = useState("");

const snippets:any = {

python:`import apives

client = apives.Client(api_key="YOUR_API_KEY")

res = client.chat.create(
  model="apives-gpt",
  message="Hello"
)

print(res.output)`,

node:`import Apives from "apives"

const client = new Apives({apiKey:"YOUR_API_KEY"})

const res = await client.chat.create({
 model:"apives-gpt",
 message:"Hello"
})

console.log(res.output)`,

curl:`curl https://api.apives.com/v1/chat
-H "Authorization: Bearer YOUR_API_KEY"
-d '{"message":"Hello"}'`,

go:`package main
import "fmt"

func main(){
fmt.Println("Hello from Apives")
}`
};

const generateCode=()=>setCode(snippets[lang]);

const copyCode=async()=>{
await navigator.clipboard.writeText(code);
setCopied(true);
setTimeout(()=>setCopied(false),1500);
};

return(

<section className="py-16 bg-black border-t border-white/5">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-3xl text-white font-bold text-center mb-8">
Quick Start Integration
</h2>

<div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden">

<div className="flex justify-between items-center px-4 py-3 border-b border-white/10">

<button
onClick={generateCode}
className="flex items-center gap-2 bg-mora-500 text-black px-4 py-1 rounded-full text-xs font-bold"
>
<Zap size={14}/>
Generate
</button>

<button
onClick={copyCode}
className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
>
{copied ? <Check size={16}/> : <Copy size={16}/>}
</button>

</div>

<div className="flex gap-2 px-4 py-2 border-b border-white/10">

{["python","node","curl","go"].map(l=>(
<button
key={l}
onClick={()=>setLang(l)}
className={`px-3 py-1 rounded-full text-xs font-bold ${
lang===l ? "bg-mora-500 text-black" : "bg-white/5 text-slate-300"
}`}
>
{l}
</button>
))}

</div>

<div className="p-6 font-mono text-sm text-slate-300">
<pre>{code || "Click Generate to create integration code"}</pre>
</div>

</div>

</div>

</section>

);

};

const LiveApiRunner = () => {

const [endpoint,setEndpoint]=useState("");
const [response,setResponse]=useState("");
const [loading,setLoading]=useState(false);

const sendRequest=async()=>{

if(!endpoint)return;

setLoading(true);

try{

const res=await fetch(endpoint);

const data=await res.json();

setResponse(JSON.stringify(data,null,2));

}catch{

setResponse("Request failed");

}

setLoading(false);

};

return(

<section className="py-16 bg-black border-t border-white/5">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-3xl text-white font-bold text-center mb-8">
Live API Request Runner
</h2>

<div className="bg-[#070707] border border-white/10 rounded-2xl p-6">

<div className="flex gap-3 mb-4">

<input
value={endpoint}
onChange={(e)=>setEndpoint(e.target.value)}
placeholder="https://api.apives.com/endpoint"
className="flex-1 bg-black border border-white/10 px-4 py-2 rounded-xl text-white"
/>

<button
onClick={sendRequest}
className="flex items-center gap-2 bg-mora-500 text-black px-5 py-2 rounded-xl font-bold"
>

<Play size={16}/>
Send

</button>

</div>

<pre className="text-green-400 font-mono text-xs bg-black p-4 rounded-xl overflow-x-auto">

{loading ? "Loading..." : response || "Response will appear here"}

</pre>

</div>

</div>

</section>

);

};

export const LandingPage: React.FC = () => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userName, setUserName] = useState('');
const [universalApis, setUniversalApis] = useState<ApiListing[]>([]);
const [freshApis, setFreshApis] = useState<ApiListing[]>([]);
const [communityApis, setCommunityApis] = useState<ApiListing[]>([]);
const [top3Ids, setTop3Ids] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [isMobile, setIsMobile] = useState(
  typeof window !== 'undefined' && window.innerWidth < 768
);

useEffect(() => {
  trackSponsor("serpapi", "impression");
  trackSponsor("scoutpanels", "impression");

  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener("resize", handleResize);

  const user = localStorage.getItem("mora_user");
  if (user) {
    setIsAuthenticated(true);
    setUserName(JSON.parse(user).name || "Builder");
  }

  (async () => {
    try {

      // ✅ CACHE FIRST
      if (LANDING_API_CACHE) {
        setUniversalApis(LANDING_API_CACHE.universal);
        setFreshApis(LANDING_API_CACHE.fresh);
        setCommunityApis(LANDING_API_CACHE.community);
        setIsLoading(false);
        return;
      }

      // ✅ FETCH
      const res = await fetch("https://apives.onrender.com/api/landing");
      const data = await res.json();

      const normalize = (arr: any[]) =>
        arr.map((a: any) => ({
          ...a,
          id: a._id,
          publishedAt: a.createdAt,
          tags: Array.isArray(a.tags) ? a.tags : [],
          features: Array.isArray(a.features) ? a.features : [],
        }));

      const universal = normalize(data.universal || []);
      const fresh = normalize(data.fresh || []);
      const community = normalize(data.community || []);

      LANDING_API_CACHE = {
        universal,
        fresh,
        community
      };

      setUniversalApis(universal);
      setFreshApis(fresh);
      setCommunityApis(community);

      setTop3Ids(
        [...community]
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
          .slice(0, 3)
          .map(a => a.id)
      );

      setIsLoading(false);

    } catch (e) {
      console.error("LandingPage fetch failed", e);
      setIsLoading(false);
    }
  })();

  return () => window.removeEventListener("resize", handleResize);

}, []);

const updateLandingUpvotes = (apiId: string, delta: number) => {
  const update = (list: ApiListing[]) =>
    list.map(api =>
      api.id === apiId
        ? { ...api, upvotes: Math.max((api.upvotes || 0) + delta, 0) }
        : api
    );

  setUniversalApis(prev => update(prev));
  setFreshApis(prev => update(prev));
  setCommunityApis(prev => update(prev));
};

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
 APIVES QUICK START PLAYGROUND
================================ */}

<QuickStartPlayground />

<LiveApiRunner />

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
    {universalApis.map((api, idx) => (
      <ApiCard
        key={`${api.id}-${idx}`}
        api={api}
        topIds={top3Ids}
        onLikeChange={updateLandingUpvotes}
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
    {communityApis.map((api, idx) => (
      <ApiCard
  key={`loved-${api.id}`}
  api={api}
  topIds={top3Ids}
  rankIndex={top3Ids.indexOf(api.id)}
  onLikeChange={updateLandingUpvotes}
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