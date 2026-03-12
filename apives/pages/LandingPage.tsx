import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewsFeed from "../components/NewsFeed";
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
Play,
Info,
Key
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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

response = client.chat.create(
  model="apives-gpt",
  messages=[
    {"role":"user","content":"Hello"}
  ]
)

print(response.output)
`,

node:`import Apives from "apives"

const client = new Apives({
 apiKey:"YOUR_API_KEY"
})

const response = await client.chat.create({
 model:"apives-gpt",
 messages:[
  {role:"user",content:"Hello"}
 ]
})

console.log(response.output)
`,

curl:`curl https://api.example.com/v1/chat \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
 "message":"Hello"
}'
`,

go:`package main

import "fmt"

func main(){
 fmt.Println("Send request using YOUR_API_KEY")
}`,

java:`public class ApiExample{
 public static void main(String[] args){
  System.out.println("Use YOUR_API_KEY to call API");
 }
}`,

php:`<?php

$apiKey="YOUR_API_KEY";

$response=file_get_contents(
"https://api.example.com?key=".$apiKey
);

echo $response;

?>`
};

useEffect(()=>{
setCode(snippets[lang]);
},[lang]);

const copyCode = async () => {
await navigator.clipboard.writeText(code);
setCopied(true);
setTimeout(()=>setCopied(false),1500);
};

return(

<section className="py-14 bg-black border-t border-white/5 relative overflow-hidden">

{/* green glow */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_60%)] pointer-events-none"/>

<div className="max-w-6xl mx-auto px-6 relative z-10">

{/* HEADER */}

<div className="text-center mb-8">

<h2 className="text-3xl md:text-4xl font-bold text-white">
Quick Start Integration
</h2>

<p className="text-slate-400 text-sm mt-2">
Example snippets showing how APIs are typically integrated in apps.
</p>

</div>

{/* TERMINAL */}

<div className="rounded-2xl border border-white/10 bg-[#070707] overflow-hidden">

{/* TERMINAL HEADER */}

<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">

<div className="flex gap-2">
<div className="w-3 h-3 rounded-full bg-red-500"/>
<div className="w-3 h-3 rounded-full bg-yellow-400"/>
<div className="w-3 h-3 rounded-full bg-green-500"/>
</div>

<button
onClick={copyCode}
className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
>
{copied ? <Check size={16}/> : <Copy size={16}/>}
</button>

</div>

{/* LANGUAGE TABS */}

<div className="flex flex-wrap gap-2 px-4 py-3 border-b border-white/10">

{["python","node","curl","go","java","php"].map(l=>(
<button
key={l}
onClick={()=>setLang(l)}
className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
lang===l
? "bg-white text-black"
: "bg-white/5 text-slate-300 hover:bg-white/10"}
`}
>
{l}
</button>
))}

</div>

{/* CODE */}

<div className="p-5 text-xs md:text-sm overflow-x-auto">

<SyntaxHighlighter
language={lang === "node" ? "javascript" : lang}
style={oneDark}
customStyle={{
background:"transparent",
padding:0,
margin:0,
textShadow:"none"
}}
codeTagProps={{
style:{textShadow:"none"}
}}
>
{code}
</SyntaxHighlighter>

</div>

</div>

{/* DEVELOPER TIP */}

<div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300 flex items-center gap-3">

<div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
<Key className="w-4 h-4 text-green-400"/>
</div>

<p>

Store API keys securely using environment variables.
Never expose secret keys in frontend code.

</p>

</div>

</div>

</section>

);

};


const LiveApiRunner = () => {

const [endpoint,setEndpoint]=useState("https://api.ipify.org?format=json");
const [method,setMethod]=useState("GET");
const [showMethods,setShowMethods]=useState(false);

const [headers,setHeaders]=useState("");
const [body,setBody]=useState("");

const [response,setResponse]=useState("");
const [loading,setLoading]=useState(false);

const [status,setStatus]=useState("");
const [statusCode,setStatusCode]=useState(null);
const [time,setTime]=useState(null);

const [history,setHistory]=useState([]);

const user = localStorage.getItem("mora_user");

const methods=[
"GET",
"POST",
"PUT",
"DELETE"
];

const presets=[
{ name:"IP API", url:"https://api.ipify.org?format=json"},
{ name:"Random User", url:"https://randomuser.me/api/"},
{ name:"Bitcoin Price", url:"https://api.coinbase.com/v2/prices/spot?currency=USD"},
{ name:"Weather", url:"https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true"},
{ name:"GitHub User", url:"https://api.github.com/users/vercel"},
{ name:"Dog Image", url:"https://dog.ceo/api/breeds/image/random"}
];

const autoResize=(e)=>{
const el=e.target;
el.style.height="auto";
el.style.height=el.scrollHeight+"px";
};

const formatJSON=(data)=>{
try{
return JSON.stringify(JSON.parse(data),null,2);
}catch{
return data;
}
};

const getStatusColor=()=>{

if(!statusCode) return "bg-white/10";

if(statusCode>=200 && statusCode<300)
return "bg-green-500/20 text-green-400";

if(statusCode>=400 && statusCode<500)
return "bg-yellow-500/20 text-yellow-400";

return "bg-red-500/20 text-red-400";
};

const sendRequest=async()=>{

if(!endpoint) return;

let parsedHeaders={};

if(headers.trim()!==""){
try{
parsedHeaders=JSON.parse(headers);
}catch{
parsedHeaders={};
}
}

setLoading(true);
setStatus("Running request...");
setStatusCode(null);
setTime(null);

const start=Date.now();

try{

const res=await fetch(
"https://apives.onrender.com/api/runner/run",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
url:endpoint,
method,
headers:parsedHeaders,
body
})
}
);

const data=await res.json();

const duration=Date.now()-start;

setTime(duration);

if(data.success){

const json=formatJSON(JSON.stringify(data.data));

setResponse(json);
setStatusCode(data.status);
setStatus("Success");

if(user){

setHistory(prev=>[
{url:endpoint,method,time:duration},
...prev.slice(0,10)
]);

}

}else{

setResponse(JSON.stringify(data,null,2));
setStatus("Error");

}

}catch{

setResponse(`Request failed

Possible reasons:
• API requires authentication
• API blocked request
• Invalid endpoint`);

setStatus("Runner Error");

}

setLoading(false);

};

const clearResponse=()=>{
setEndpoint("");
setHeaders("");
setBody("");
setResponse("");
setStatus("");
setStatusCode(null);
setTime(null);
};

const clearHistory=()=>{
setHistory([]);
};

const copyResponse=async()=>{
if(!response) return;
await navigator.clipboard.writeText(response);
};

return(

<section className="py-10 bg-black border-t border-white/5 relative overflow-hidden">

<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]"/>

<div className="max-w-5xl mx-auto px-4 relative z-10">

<div className="text-center mb-6">

<h2 className="text-3xl md:text-4xl font-bold text-white">
Live API Request Runner
</h2>

<p className="text-slate-400 text-sm mt-2">
Run real APIs and inspect JSON responses instantly.
</p>

</div>

<p className="text-center text-xs text-slate-500 mb-3">
Try these example APIs to quickly test the runner
</p>

<div className="flex flex-wrap justify-center gap-2 mb-5">

{presets.map((p,i)=>(
<button
key={i}
onClick={()=>setEndpoint(p.url)}
className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
>
{p.name}
</button>
))}

</div>

<div className="bg-[#070707] border border-white/10 rounded-2xl p-4">

<div className="flex flex-wrap gap-2 mb-3 items-center">

<div className="relative">

<button
onClick={()=>setShowMethods(!showMethods)}
className="px-3 py-2 text-xs rounded bg-black border border-white/10"
>
{method}
</button>

{showMethods && (

<div className="absolute top-9 left-0 bg-black border border-white/10 rounded shadow-lg z-20">

{methods.map(m=>(
<div
key={m}
onClick={()=>{setMethod(m);setShowMethods(false)}}
className="px-4 py-2 text-xs hover:bg-white/10 cursor-pointer"
>
{m}
</div>
))}

</div>

)}

</div>

<input
value={endpoint}
onChange={(e)=>setEndpoint(e.target.value)}
className="flex-1 min-w-0 bg-black border border-white/10 text-sm px-3 py-2 rounded text-white"
placeholder="Enter API URL"
/>

<button
onClick={sendRequest}
className="px-4 py-2 text-xs rounded-full bg-green-500/20 border border-green-500/30 hover:bg-green-500/30"
>
Run
</button>

<button
onClick={clearResponse}
className="px-4 py-2 text-xs rounded-full bg-white/10 border border-white/20"
>
Clear
</button>

</div>

{/* HEADERS */}

<div className="mb-3">

<p className="text-xs text-slate-400 mb-1">
Headers (optional JSON)
</p>

<p className="text-[11px] text-slate-500 mb-2">
Add request headers here in JSON format if required.
Example: Authorization token, API key, custom headers.
</p>

<textarea
value={headers}
onChange={(e)=>{
setHeaders(e.target.value);
autoResize(e);
}}
onInput={autoResize}
rows={2}
placeholder={`{
 "Content-Type":"application/json",
 "Authorization":"Bearer YOUR_API_KEY"
}`}
className="w-full bg-black border border-white/10 rounded text-xs p-2 text-white resize-none"
/>

</div>

{method!=="GET" && (

<div className="mb-3">

<p className="text-xs text-slate-400 mb-1">
Request Body (JSON)
</p>

<p className="text-[11px] text-slate-500 mb-2">
Add JSON request body here for POST or PUT requests.
</p>

<textarea
value={body}
onChange={(e)=>{
setBody(e.target.value);
autoResize(e);
}}
onInput={autoResize}
rows={2}
placeholder={`{
 "example":"data"
}`}
className="w-full bg-black border border-white/10 rounded text-xs p-2 text-white resize-none"
/>

</div>

)}

<div className="flex flex-wrap items-center gap-3 mb-2 text-xs font-mono">

{status && <span className="text-green-400">{status}</span>}

{statusCode && (
<span className={`px-2 py-0.5 rounded ${getStatusColor()}`}>
{statusCode}
</span>
)}

{time && (
<span className="bg-white/10 px-2 py-0.5 rounded">
⏱ {time} ms
</span>
)}

<button
onClick={copyResponse}
className="ml-auto text-xs px-2 py-1 border border-white/10 rounded"
>
Copy JSON
</button>

</div>

<div className="border border-white/10 rounded-xl p-4 bg-black/80 text-xs overflow-x-auto">

<SyntaxHighlighter
language="json"
style={oneDark}
customStyle={{
background:"transparent",
margin:0,
padding:0,
textShadow:"none"
}}
codeTagProps={{
style:{textShadow:"none"}
}}
>

{loading ? "Loading..." : response || "Response will appear here"}

</SyntaxHighlighter>

</div>

</div>

{user && history.length>0 && (

<div className="mt-5">

<div className="flex justify-between items-center mb-2">

<p className="text-xs text-slate-400">Recent Requests</p>

<button
onClick={clearHistory}
className="text-xs text-red-400 hover:text-red-300"
>
Clear All
</button>

</div>

<div className="space-y-1">

{history.map((h,i)=>(
<div
key={i}
className="text-xs text-slate-400 flex justify-between bg-white/5 px-2 py-1 rounded"
>

<span>{h.method}</span>

<span className="truncate max-w-[200px]">{h.url}</span>

<span>{h.time}ms</span>

</div>
))}

</div>

</div>

)}

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

<NewsFeed />

{/* ===============================
 APIVES SPONSORS
================================ */}

<section className="py-20 bg-black border-t border-white/5 relative overflow-hidden">

{/* background glow */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.08),transparent_60%)] pointer-events-none" />

<div className="max-w-6xl mx-auto px-6 relative z-10">

{/* HEADER */}

<div className="text-center mb-14">

<p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-3">
SPONSORS
</p>

<h2 className="text-3xl md:text-4xl font-bold text-white">
Partners Powering Apives
</h2>

<p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
Developer platforms and infrastructure companies supporting the Apives ecosystem.
</p>

</div>


{/* GRID */}

<div className="grid md:grid-cols-2 gap-10 items-start">

{/* =========================
 APEX SPONSOR
========================= */}

<div className="text-center">

<p className="
text-[10px]
uppercase tracking-[0.35em]
font-black
bg-gradient-to-r from-amber-400 to-yellow-600
bg-clip-text text-transparent
mb-4
">
Apex Sponsor
</p>

<a
href="#"
onClick={(e)=>{
e.preventDefault()
handleSponsorClick(
"scoutpanels",
"https://scoutpanels.com"
)
}}
className="
relative inline-flex items-center gap-4
px-6 py-4
rounded-2xl
border border-amber-400/40
bg-gradient-to-br from-amber-400/15 to-transparent
hover:from-amber-400/25
transition-all
shadow-[0_0_40px_rgba(245,158,11,0.25)]
hover:shadow-[0_0_60px_rgba(245,158,11,0.45)]
"
>

<img
src="https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg"
alt="ScoutPanels"
className="
h-10 md:h-12 w-10 md:w-12
object-contain
rounded-2xl
bg-white/10
p-1
"
/>

<div className="text-left">

<p className="text-white font-bold text-sm md:text-base">
ScoutPanels
</p>

<p className="text-slate-400 text-xs md:text-sm">
Turning B2B feedback into adoption signals
</p>

</div>

</a>

</div>


{/* =========================
 PRIME SPONSOR
========================= */}

<div className="text-center">

<p className="
text-[10px]
uppercase tracking-[0.35em]
font-black
bg-gradient-to-r from-slate-200 to-slate-400
bg-clip-text text-transparent
mb-4
">
Prime Sponsor
</p>

<a
href="#"
onClick={(e)=>{
e.preventDefault()
handleSponsorClick(
"serpapi",
"https://serpapi.com"
)
}}
className="
relative inline-flex items-center gap-4
px-6 py-4
rounded-2xl
border border-white/20
bg-gradient-to-br from-white/10 to-transparent
hover:from-white/20
transition-all
shadow-[0_0_40px_rgba(255,255,255,0.12)]
hover:shadow-[0_0_60px_rgba(255,255,255,0.22)]
"
>

<img
src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"
alt="SerpApi"
className="
h-10 md:h-12 w-10 md:w-12
object-contain
rounded-2xl
bg-white
p-1
"
/>

<div className="text-left">

<p className="text-white font-bold text-sm md:text-base">
SerpApi
</p>

<p className="text-slate-400 text-xs md:text-sm">
Real-time Google Search results API for developers
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