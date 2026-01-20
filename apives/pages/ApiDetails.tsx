import React, { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiClient';
import {
  Copy, Play, Terminal, ShieldCheck,
  Activity, Cpu, Globe, Lock, Cloud, Box,
  Check, Heart, Bookmark, CheckCircle2,
  Image as ImageIcon, Clock, Database, AlignLeft,
  Code, ArrowRight, Zap, Wifi, Calendar,
  Trophy, DollarSign, X, FileJson, ListFilter,
  TextQuote, Gauge, ShieldAlert, Key, Info,
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { BackButton } from '../components/BackButton';

const syntaxHighlight = (json: string) => {
    if (!json) return '';
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'text-orange-400';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) cls = 'text-mora-400';
            else cls = 'text-yellow-200';
        } else if (/true|false/.test(match)) cls = 'text-blue-400';
        else if (/null/.test(match)) cls = 'text-gray-500';
        return '<span class="' + cls + '">' + match + '</span>';
    });
};

export const ApiDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

console.log('DETAILS PAGE ID 👉', id);

  const [api, setApi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'playground'>('overview');
  const [playgroundSubTab, setPlaygroundSubTab] = useState<'body' | 'headers' | 'params'>('body');
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [response, setResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [upvotes, setUpvotes] = useState(0);

  
   useEffect(() => {
  if (!id) return;

  const loadApi = async () => {
    try {
      setIsLoading(true);

      const data = await apiService.getApiById(id);

      setApi({
        ...data,
        id: data._id,
        publishedAt: data.createdAt,
      });

      const likedApis = JSON.parse(
  localStorage.getItem('mora_liked_apis') || '[]'
);

setUpvotes(data.upvotes || 0);
setIsLiked(likedApis.includes(id));

      const savedApis = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
      if (savedApis.includes(id)) setIsSaved(true);

       } catch (err: any) {
  console.error('ApiDetails fetch error:', err);

  // 👇 400, 403, 404 sab pe not found dikhao
  if (
    err?.response?.status === 400 ||
    err?.response?.status === 403 ||
    err?.response?.status === 404
  ) {
    setApi(null);
  }
    } finally {
      setIsLoading(false);
    }
  };

  loadApi();
}, [id]);

  const handleLike = async () => {
  const userStr = localStorage.getItem('mora_user');
  if (!userStr) {
    navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`);
    return;
  }

  try {
    let res;

    // ✅ STEP 1: future state nikaalo
    const nextLiked = !isLiked;

    // ✅ STEP 2: backend call (sirf DB update)
    if (isLiked) {
      res = await apiService.unlikeApi(id!);
    } else {
      res = await apiService.likeApi(id!);
    }

    // ✅ STEP 3: UI state ek jagah se set
    setIsLiked(nextLiked);

    // ✅ STEP 4: SINGLE SOURCE OF TRUTH = DB
    setUpvotes(res.upvotes);

    // ✅ STEP 5: localStorage sync with SAME truth
    const likedApis = JSON.parse(
      localStorage.getItem('mora_liked_apis') || '[]'
    );

    localStorage.setItem(
      'mora_liked_apis',
      JSON.stringify(
        nextLiked
          ? [...likedApis, id]
          : likedApis.filter((x: string) => x !== id)
      )
    );
  } catch (err) {
    console.error('Like failed', err);
  }
};

  const handleSaveToggle = () => {
    const userStr = localStorage.getItem('mora_user');
    if (!userStr) { navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`); return; }
    
    const savedApis = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
    if (isSaved) {
        setIsSaved(false);
        localStorage.setItem('mora_saved_apis', JSON.stringify(savedApis.filter((aid: string) => aid !== id)));
    } else {
        setIsSaved(true);
        localStorage.setItem('mora_saved_apis', JSON.stringify([...savedApis, id]));
    }
  };

  const handleTestApi = () => {
    const endpoint = api?.endpoints?.[selectedEndpointIndex];
    if (!endpoint) return;
    setTestLoading(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(JSON.stringify(endpoint.responseExample || { status: "success", message: "Node link verified" }, null, 2));
      setTestLoading(false);
    }, 1200);
  };

  const hasEndpoints = api && api.endpoints && api.endpoints.length > 0;
  const RANK_STYLES = [
  { name: 'Apex', color: 'from-amber-400 to-yellow-600' },
  { name: 'Prime', color: 'from-slate-200 to-slate-400' },
  { name: 'Zenith', color: 'from-orange-400 to-amber-700' },
];

// 🔥 simple local ranking based on upvotes
const rank =
  upvotes >= 100 ? RANK_STYLES[0] :
  upvotes >= 25  ? RANK_STYLES[1] :
  upvotes >= 5   ? RANK_STYLES[2] :
  null;

// ⏳ LOADING
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">
        Loading node...
      </div>
    </div>
  );
}

// ❌ NOT FOUND
if (!api) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="text-red-400 font-mono text-[10px] uppercase tracking-widest">
        Node not found or deleted
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-dark-950 pt-20 relative selection:bg-mora-500/30">


      <div className="absolute top-20 left-4 lg:left-8 z-30">
  <BackButton />
</div>
      <div className="relative border-b border-white/5 pt-10 pb-4 md:pt-16 md:pb-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

           
                <div className="animate-slide-up relative">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-mora-500/10 border border-mora-500/20 text-mora-400 text-[8px] md:text-[10px] font-black px-4 md:px-5 py-1 rounded-full uppercase tracking-widest">{api.category}</span>
                        
{rank && (
  <div
    className={`bg-gradient-to-r ${rank.color} text-black text-[8px] md:text-[10px] font-black px-4 md:px-5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-amber-500/10`}
  >
    <Trophy size={10} /> {rank.name}
  </div>
)}

             <span
  className={`text-[8px] md:text-[10px] font-black px-4 md:px-5 py-1 rounded-full border uppercase tracking-widest ${
    api.pricing.type === 'Free'
      ? 'bg-green-500/10 text-green-400 border-green-500/20'
      : api.pricing.type === 'Freemium'
      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }`}
>
  {api.pricing.type}
</span>
                   </div>
               
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-8">
                        <div>
                            <h1 className="text-2xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight leading-[1.1]">{api.name}</h1>
                            <div className="text-slate-400 text-[11px] md:text-lg flex items-center gap-2 font-light">
                                <span>By <span className="text-white font-medium">{api.provider}</span></span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span className="font-mono text-slate-500 text-[9px] md:text-sm">{new Date(api.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={handleLike} className={`h-8 md:h-10 px-4 md:px-6 rounded-full font-black border transition-all flex items-center text-[10px] md:text-xs uppercase tracking-widest active:scale-95 ${isLiked ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}><Heart size={12} className={isLiked ? 'fill-current' : ''} /> <span className="ml-2">{upvotes}</span></button>
                            <button onClick={handleSaveToggle} className={`h-8 md:h-10 px-4 md:px-6 rounded-full font-black border transition-all flex items-center text-[10px] md:text-xs uppercase tracking-widest active:scale-95 ${isSaved ? 'bg-mora-500/10 text-mora-500 border-mora-500/30' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}><Bookmark size={12} className={isSaved ? 'fill-current' : ''} /> <span className="ml-2">{isSaved ? 'Saved' : 'Save'}</span></button>
                            <a href={api.externalUrl} target="_blank" className="h-8 md:h-10 px-5 md:px-8 bg-mora-600 hover:bg-mora-500 text-white rounded-full font-black shadow-lg shadow-mora-500/20 transition-all text-[10px] md:text-xs uppercase tracking-widest flex items-center active:scale-95">Visit <Globe size={12} className="ml-2" /></a>
                        </div>
                    </div>
                </div>
        </div>
      </div>
      <div className="bg-dark-950 border-b border-white/5"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1"><button onClick={() => setActiveTab('overview')} className={`relative px-4 py-3 md:px-8 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${activeTab === 'overview' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>Overview{activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mora-500"></span>}</button>{hasEndpoints && <button onClick={() => setActiveTab('playground')} className={`relative px-4 py-3 md:px-8 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${activeTab === 'playground' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>Playground{activeTab === 'playground' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mora-500"></span>}</button>}</div></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16">
        {!isLoading && api && activeTab === 'overview' && (
            <div className="space-y-10 md:space-y-16 animate-fade-in">
                <section><h2 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-6 flex items-center"><Box className="mr-3 text-mora-500" size={14}/> Node Description</h2><div className="bg-white/[0.03] rounded-2xl md:rounded-3xl p-6 md:p-10 border border-white/5 text-slate-300 text-sm md:text-lg leading-relaxed font-light">{api.description}</div></section>
                {api.gallery && api.gallery.length > 0 && (
                    <section><h2 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-6 flex items-center"><ImageIcon className="mr-3 text-mora-500" size={14}/> Neural Preview</h2><div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x no-scrollbar">{api.gallery.map((img: string, i: number) => (<div key={i} className="flex-none w-64 md:w-[450px] aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 snap-center shadow-2xl"><img src={img} className="w-full h-full object-cover" /></div>))}</div></section>
                )}
                {api.features && api.features.length > 0 && (
                    <section><h2 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-6 flex items-center"><ShieldCheck className="mr-3 text-mora-500" size={14}/> Feature Matrix</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{api.features.map((f: string, i: number) => (<div key={i} className="flex items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-mora-500/30 transition-all"><div className="w-6 h-6 rounded-full bg-mora-500/10 flex items-center justify-center mr-4 group-hover:bg-mora-500 transition-colors"><Check size={12} className="text-mora-500 group-hover:text-black" /></div><span className="text-slate-300 text-sm font-medium">{f}</span></div>))}</div></section>
          )} 
<section><h2 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-6 flex items-center"><Gauge className="mr-3 text-mora-500" size={14}/> Operational Stats</h2><div className="grid grid-cols-3 gap-3 md:gap-6"><div className="bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 flex flex-col gap-1 shadow-lg"><span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Latency</span><span className="text-lg md:text-3xl font-display font-black text-mora-400 leading-none">{api.latency}</span></div><div className="bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 flex flex-col gap-1 shadow-lg"><span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Stability</span><span className="text-lg md:text-3xl font-display font-black text-blue-400 leading-none truncate">{api.stability || 'Stable'}</span></div><div className="bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 flex flex-col gap-1 shadow-lg"><span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Access</span><span className="text-lg md:text-3xl font-display font-black text-white leading-none truncate">{api.accessType || 'Public'}</span></div></div></section>
{/* 💰 Pricing Model */}
<section className="mb-12 md:mb-16">
  {/* Section Heading */}
  <div className="flex items-center justify-between mb-4 md:mb-6">
    <h2 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.4em] flex items-center">
      <DollarSign className="mr-3 text-mora-500" size={14} />
      Pricing Model
    </h2>

    {/* Pricing Type Badge */}
    <span
      className={`
        px-4 py-1 rounded-full
        text-[9px] md:text-[10px]
        font-black uppercase tracking-widest
        ${
          api.pricing?.type === 'Free'
            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
            : api.pricing?.type === 'Paid'
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
            : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
        }
      `}
    >
      {api.pricing?.type || 'Free'}
    </span>
  </div>

  {/* Pricing Card */}
<div
  className="
    relative
    bg-white/[0.035]
    border border-mora-500/30
    rounded-2xl md:rounded-3xl
    p-5 md:p-8
    backdrop-blur-xl
    overflow-hidden

    before:content-['']
    before:absolute
    before:inset-0
    before:rounded-2xl md:before:rounded-3xl
    before:pointer-events-none
    before:shadow-[inset_0_0_40px_rgba(34,197,94,0.45)]
  "
>
   
    <div className="relative z-10">
      <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
        {api.pricing?.details ||
          'Free tier includes limited usage for testing and evaluation. Advanced features, higher rate limits, and production-grade access require an upgrade.'}
      </p>
    </div>
  </div>
</section>
          
                {hasEndpoints && (
                    <section><h2 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-6 flex items-center"><Terminal className="mr-3 text-mora-500" size={14}/> Endpoint Matrix</h2><div className="space-y-4 md:space-y-6">{api.endpoints.map((endpoint: any, idx: number) => (<div key={idx} className="bg-dark-900/30 border border-white/5 rounded-2xl overflow-hidden group"><div className="bg-white/[0.02] px-5 py-3 md:px-6 md:py-4 flex items-center gap-3 border-b border-white/5 overflow-x-auto no-scrollbar"><span className={`text-[8px] md:text-[9px] font-black px-3 py-0.5 rounded-full uppercase border tracking-widest ${endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>{endpoint.method}</span><code className="text-[10px] md:text-xs font-mono text-slate-300 whitespace-nowrap">{endpoint.path}</code></div><div className="p-5 md:p-8"><p className="text-[11px] md:text-sm text-slate-400 mb-6 font-light">{endpoint.description}</p><div className="bg-black rounded-xl border border-white/10 p-4 md:p-6 relative group/code overflow-hidden shadow-inner"><pre className="text-[10px] md:text-xs font-mono text-slate-300 overflow-x-auto custom-scrollbar pb-1" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(endpoint.responseExample || {}, null, 2)) }} /></div></div></div>))}</div></section>
                )}
                
{api.tags && api.tags.length > 0 && (
  <section>
    <h2 className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-6 flex items-center">
      <Hash className="mr-3 text-mora-500" size={14}/> Node Tags
    </h2>

    <div className="flex flex-wrap gap-2 md:gap-3">
      {api.tags.map((tag: string, i: number) => (
        <div
          key={i}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-full
            bg-white/[0.03]
            border border-white/10
            text-slate-300
            text-[10px] md:text-xs
            font-mono
            hover:border-mora-500/40
            hover:text-mora-400
            transition-all
          "
        >
          <Hash size={12} className="text-mora-500/70" />
          {tag}
        </div>
      ))}
    </div>
  </section>
)}
            </div>
        )}
        {!isLoading && api && activeTab === 'playground' && hasEndpoints && (
            <div className="flex flex-col lg:flex-row h-[550px] md:h-[650px] border border-white/10 rounded-[2rem] overflow-hidden bg-black shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-fade-in ring-1 ring-white/5">
                <div className="w-full lg:w-1/2 flex flex-col border-r border-white/10 bg-dark-950">
                    <div className="bg-dark-900/50 p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden"><span className="bg-mora-600 text-white text-[8px] md:text-[9px] font-black px-3.5 py-0.5 rounded-full mr-2.5 flex-shrink-0 shadow-lg shadow-mora-500/20">{api.endpoints[selectedEndpointIndex].method}</span><span className="font-mono text-slate-300 text-[10px] md:text-xs truncate max-w-[150px] md:max-w-none">{api.endpoints[selectedEndpointIndex].path}</span></div>
                        <button onClick={handleTestApi} disabled={testLoading} className={`bg-white/5 border border-white/10 hover:border-mora-500/50 px-5 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95 disabled:opacity-50 ${testLoading ? 'animate-pulse' : ''}`}>Transmit</button>
                    </div>
                    {api.endpoints.length > 1 && (<div className="bg-black/60 border-b border-white/5 p-2 overflow-x-auto no-scrollbar flex gap-2">{api.endpoints.map((ep: any, i: number) => (<button key={i} onClick={() => { setSelectedEndpointIndex(i); setResponse(null); }} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${selectedEndpointIndex === i ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}>Node {i + 1}</button>))}</div>)}
                    <div className="flex bg-black/40 p-1.5 gap-1.5 border-b border-white/5">
                        {[{ id: 'body', label: 'Body', icon: FileJson }, { id: 'headers', label: 'Headers', icon: ListFilter }, { id: 'params', label: 'Params', icon: TextQuote }].map(t => (
                            <button key={t.id} onClick={() => setPlaygroundSubTab(t.id as any)} className={`flex items-center gap-1.5 px-4 md:px-5 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border ${playgroundSubTab === t.id ? 'bg-mora-500 text-black border-mora-500 shadow-lg shadow-mora-500/10' : 'bg-white/5 text-slate-500 border-white/5 hover:text-slate-300'}`}><t.icon size={11} /> {t.label}</button>
                        ))}
                    </div>
                    <div className="flex-1 p-5 md:p-6 font-mono text-[11px] md:text-xs text-blue-200 bg-[#020202] overflow-auto custom-scrollbar">
                        {playgroundSubTab === 'body' && (<textarea className="w-full h-full bg-transparent outline-none resize-none scroll-smooth" defaultValue={JSON.stringify(api.endpoints[selectedEndpointIndex].body || {}, null, 2)} spellCheck={false} />)}
                        {playgroundSubTab === 'headers' && (<div className="space-y-2.5"><div className="flex gap-2.5"><input placeholder="Key" className="w-1/2 bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-mora-500/50 transition-all" defaultValue="Authorization" /><input placeholder="Value" className="w-1/2 bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-mora-500/50 transition-all" defaultValue="Bearer grid_token_..." /></div><div className="flex gap-2.5"><input placeholder="Key" className="w-1/2 bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-mora-500/50 transition-all" defaultValue="Content-Type" /><input placeholder="Value" className="w-1/2 bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-mora-500/50 transition-all" defaultValue="application/json" /></div></div>)}
                        {playgroundSubTab === 'params' && (<div className="space-y-2.5"><div className="flex gap-2.5"><input placeholder="Key" className="w-1/2 bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-mora-500/50 transition-all" defaultValue="node_id" /><input placeholder="Value" className="w-1/2 bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-mora-500/50 transition-all" defaultValue={api.id} /></div><div className="text-[9px] text-slate-600 italic uppercase tracking-wider mt-4">Node linkage parameters auto-populated for transmission.</div></div>)}
                    </div>
                </div>
                <div className="w-full lg:w-1/2 bg-dark-950 flex flex-col relative">
                    <div className="bg-dark-900/50 p-4 border-b border-white/5 text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center shadow-lg"><Terminal size={12} className="mr-2.5 text-mora-500" /> Neural Data Stream</div>
                    <div className="p-5 md:p-8 overflow-auto flex-1 custom-scrollbar bg-[#010101] shadow-inner">
                        {response ? <pre className="font-mono text-[11px] md:text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: syntaxHighlight(response) }} /> : <div className="h-full flex items-center justify-center text-slate-800 font-mono text-[9px] uppercase tracking-[0.5em] animate-pulse">Establishing Signal...</div>}
                </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
