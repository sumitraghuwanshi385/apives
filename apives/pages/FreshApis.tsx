import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiClient';
import { BackButton } from '../components/BackButton';
let API_CACHE: ApiListing[] | null = null;

import { 
  Zap, Heart, Bookmark, LayoutGrid, Shield, CreditCard, Cpu, Database, 
  MessageSquare, SlidersHorizontal, ShoppingCart, Cloud, Globe, X, 
  ArrowDown, Activity, Radar, Bitcoin, Wallet, Truck, BarChart3, Music, 
  Video, Smartphone, Map, Home, Utensils, Trophy as SportsIcon, Newspaper, 
  Briefcase, Languages, Users, Stethoscope, Scale, Settings, Search, 
  Wrench, Gavel, BarChart4, Landmark, Umbrella, Sprout, FlaskConical, 
  GraduationCap, Plane, Gamepad2, Dumbbell, TrendingUp, Building, Lock,
  Hash, Server, Calendar, Trophy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiListing } from '../types';
import { Skeleton } from '../components/Skeleton';

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'AI', icon: Cpu },
  { name: 'Payments', icon: CreditCard },
  { name: 'Crypto', icon: Bitcoin },
  { name: 'Identity', icon: Shield },
  { name: 'Data', icon: Database },
  { name: 'Infrastructure', icon: Cloud },
  { name: 'eCommerce', icon: ShoppingCart },
  { name: 'Messaging', icon: MessageSquare },
  { name: 'Finance', icon: Wallet },
  { name: 'Logistics', icon: Truck },
  { name: 'Security', icon: Lock },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Audio', icon: Music },
  { name: 'Video', icon: Video },
  { name: 'Mobile', icon: Smartphone },
  { name: 'Maps', icon: Map },
  { name: 'Weather', icon: Cloud },
  { name: 'Real Estate', icon: Home },
  { name: 'Food', icon: Utensils },
  { name: 'Sports', icon: SportsIcon },
  { name: 'News', icon: Newspaper },
  { name: 'Jobs', icon: Briefcase },
  { name: 'Translation', icon: Languages },
  { name: 'Social', icon: Users },
  { name: 'Health', icon: Stethoscope },
  { name: 'Legal', icon: Scale },
  { name: 'DevOps', icon: Settings },
  { name: 'Search', icon: Search },
  { name: 'Tools', icon: Wrench },
  { name: 'Government', icon: Gavel },
  { name: 'Utilities', icon: Zap },
  { name: 'Stocks', icon: BarChart4 },
  { name: 'Banking', icon: Landmark },
  { name: 'Insurance', icon: Umbrella },
  { name: 'Agriculture', icon: Sprout },
  { name: 'Science', icon: FlaskConical },
  { name: 'Education', icon: GraduationCap },
  { name: 'Travel', icon: Plane },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Fitness', icon: Dumbbell },
  { name: 'IoT', icon: Radar },
  { name: 'ERP', icon: Database },
  { name: 'CRM', icon: Users },
  { name: 'HR', icon: Briefcase },
  { name: 'Marketing', icon: TrendingUp },
  { name: 'Storage', icon: Database },
  { name: 'Web3', icon: Globe },
  { name: 'Automation', icon: Zap },
  { name: 'Enterprise', icon: Building }
];

const RANK_BADGE_STYLES = [
  { label: 'Apex', color: 'from-amber-400 to-yellow-600', text: 'text-black' },
  { label: 'Prime', color: 'from-slate-200 to-slate-400', text: 'text-black' },
  { label: 'Zenith', color: 'from-orange-400 to-amber-700', text: 'text-white' }
];

const ApiCard: React.FC<{ api: ApiListing; topIds: string[] }> = ({ api, topIds }) => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [upvotes, setUpvotes] = useState(api.upvotes);
const [showArrows, setShowArrows] = useState(false);
const [galleryIndex, setGalleryIndex] = useState(0);
const [showVerifyInfo, setShowVerifyInfo] = useState(false);

const verifiedApis = JSON.parse(
  localStorage.getItem("apives_verified_apis") || "[]"
);
const isVerified = verifiedApis.includes(api._id);

useEffect(() => {
  if (!showArrows) return;

  const t = setTimeout(() => {
    setShowArrows(false);
  }, 3000);

  return () => clearTimeout(t);
}, [showArrows]);

useEffect(() => {
  const el = document.getElementById(`fresh-gallery-${api._id}`);
  if (!el) return;

  const onScroll = () => {
    const cardWidth = el.clientWidth * 0.9; // w-[90%]
    const index = Math.round(el.scrollLeft / cardWidth);
    setGalleryIndex(index);
  };

  el.addEventListener('scroll', onScroll);
  return () => el.removeEventListener('scroll', onScroll);
}, [api._id]);
    
    const apiId = api._id;
const rankIndex = topIds.indexOf(apiId);
const isTopTier = rankIndex >= 0 && rankIndex < 3;
const rankStyle = isTopTier ? RANK_BADGE_STYLES[rankIndex] : null;

    useEffect(() => {
        const likedApis = JSON.parse(localStorage.getItem('mora_liked_apis') || '[]');
        const currentlyLiked = likedApis.includes(api._id);
        setIsLiked(currentlyLiked);
        setUpvotes(api.upvotes || 0);

        const savedApis = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
        if (savedApis.includes(api._id)) setSaved(true);
    }, [api._id, api.upvotes]);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        const userStr = localStorage.getItem('mora_user');
        if (!userStr) { navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`); return; }
        
        const savedApis = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
        if (saved) {
            setSaved(false);
            localStorage.setItem('mora_saved_apis', JSON.stringify(savedApis.filter((aid: string) => aid !== api._id)));
        } else {
            setSaved(true);
            localStorage.setItem('mora_saved_apis', JSON.stringify([...savedApis, api._id]));
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

  try {
    let res;
    const nextLiked = !isLiked;

    if (isLiked) {
      res = await apiService.unlikeApi(api._id);
    } else {
      res = await apiService.likeApi(api._id);
    }

    setIsLiked(nextLiked);
    setUpvotes(res.upvotes); // ✅ DB value only
  } catch (err) {
    console.error('Like failed', err);
  }
};
    const isNew = (createdAt?: string) => {
  if (!createdAt) return false;

  const created = new Date(createdAt);
  const now = new Date();

  const diffDays =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays <= 15;
};

    return (
        <Link to={`/api/${api._id}`} className="group relative bg-dark-900/40 hover:bg-dark-900/80 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-mora-500/30 p-4 md:p-5 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-mora-500 to-transparent opacity-70"></div>
            <div className="flex justify-between items-center mb-2 md:mb-2.5 relative z-20">
                <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="bg-mora-500/10 border border-mora-500/20 text-mora-400 text-[8px] md:text-[9px] font-bold px-2.5 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider h-5 md:h-6 flex items-center">
                        {api.category}
                    </span>
                    {isTopTier && rankStyle && (
                        <div className={`bg-gradient-to-r ${rankStyle.color} ${rankStyle.text} backdrop-blur-md border border-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full flex items-center gap-1 shadow-md h-5 md:h-6`}>
                            <Trophy size={8} className="md:w-2.5 md:h-2.5 fill-current" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">{rankStyle.label}</span>
                        </div>
                    )}
                </div>
                <button onClick={handleSave} className={`p-1.5 md:p-2 rounded-full transition-all duration-300 active:scale-75 ${saved ? 'bg-mora-500/20 text-mora-500' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                    <Bookmark size={14} className={`md:w-4 md:h-4 transition-transform duration-300 ${saved ? 'fill-current scale-110' : 'scale-100'}`} />
                </button>
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-2">
                    <h3
  className="
    font-display
    font-bold
    text-white
    text-base md:text-lg
    leading-snug
    group-hover:text-mora-400
    transition-colors
  "
>
  <span className="inline whitespace-normal align-baseline">

    {/* ✅ API NAME */}
    <span className="break-words leading-tight inline">
      {api.name}
    </span>

    {/* ✅ VERIFIED BADGE — NAME KE BILKUL PASS */}
    {isVerified && (
      <span className="relative inline-flex items-center align-baseline ml-1 shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowVerifyInfo(v => !v);
          }}
          title="Verified by Apives"
          className="
    h-5 w-5
    md:h-6 md:w-6
    flex items-center justify-center
    shrink-0"
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
                         <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 truncate"><Server size={10} /> {api.provider}</p>
                    </div>
                </div>
{/* 🔥 API CARD IMAGE PREVIEW */}
{api.gallery && api.gallery.length > 0 && (
  <div
    className="relative mb-3"
    onMouseEnter={() => setShowArrows(true)}
    onMouseLeave={() => setShowArrows(false)}
    onTouchStart={() => setShowArrows(true)}
  >
    {/* IMAGE STRIP */}
    <div
      id={`fresh-gallery-${api._id}`}
      className="flex overflow-x-auto gap-3 snap-x no-scrollbar"
    >
      {api.gallery.slice(0, 5).map((img: string, i: number) => (
        <div className="
  flex-none
  w-[90%]
  aspect-[16/9]
  rounded-xl
  overflow-hidden
  border border-white/10
  bg-black
  snap-center
">
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
          const el = document.getElementById(`fresh-gallery-${api._id}`);
          if (!el) return;
          el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
        }}
        className="
          absolute left-2 top-1/2 -translate-y-1/2
          h-8 w-8 rounded-full
          bg-black/60 border border-white/20
          text-white text-lg
          flex items-center justify-center
          backdrop-blur-sm
        "
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
          const el = document.getElementById(`fresh-gallery-${api._id}`);
          if (!el) return;
          el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
        }}
        className="
          absolute right-2 top-1/2 -translate-y-1/2
          h-8 w-8 rounded-full
          bg-black/60 border border-white/20
          text-white text-lg
          flex items-center justify-center
          backdrop-blur-sm
        "
      >
        ›
      </button>
    )}
  </div>
)}
                <p className="text-[13px] md:text-sm text-slate-400 mb-4 md:mb-6 line-clamp-4 leading-relaxed font-light">{api.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                    {api.tags.slice(0, 5).map(tag => (
                        <span key={tag} className="text-[9px] md:text-[10px] text-slate-500 bg-white/5 border border-white/10 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex items-center">
                            <Hash size={8} className="mr-0.5 text-mora-500/50" /> {tag}
                        </span>
                    ))}
                </div>

                <div className="pt-3 md:pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-3 md:gap-4">
                        <div className="flex items-center gap-1 text-[10px] md:text-xs text-slate-500"><Activity size={12} className="text-mora-500" /><span className="text-slate-300">{api.latency}</span></div>
                        <button onClick={handleLike} className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 group/like">
                            <Heart
  size={12}
  className={`${isLiked
    ? 'text-red-500 fill-current drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]'
    : 'text-red-500/50 group-hover/like:text-red-500'
  } transition-all`}
/>
                            <span className="text-slate-300 font-mono">{upvotes}</span>
                        </button>
                    </div>
                    <span className={`text-[8px] md:text-[10px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full border ${api.pricing.type === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' : api.pricing.type === 'Paid' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'} uppercase tracking-wide`}>
                        {api.pricing.type}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export const FreshApis: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredApis, setFilteredApis] = useState<ApiListing[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [topIds, setTopIds] = useState<string[]>([]);

  useEffect(() => {
  const loadFreshApis = async () => {
    setIsLoading(true);

    // ✅ 1. cache use karo
    let allApis: ApiListing[];

    if (API_CACHE) {
      allApis = API_CACHE;
    } else {
      allApis = await apiService.getAllApis();
      API_CACHE = allApis;
    }

    // ✅ 2. top 3 ids (sirf ek baar calculate)
    setTopIds(
      [...allApis]
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 3)
        .map(a => a._id)
    );

    // ✅ 3. fresh (last 15 days)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const freshApis = allApis.filter(api =>
      new Date(api.createdAt || api.publishedAt) > fifteenDaysAgo
    );

    // ✅ 4. category filter — LOCAL DATA
    const filtered =
      selectedCategory === 'All'
        ? freshApis
        : freshApis.filter(api => api.category === selectedCategory);

    setFilteredApis(filtered);
    setIsLoading(false);
  };

  loadFreshApis();
}, [selectedCategory]);

  return (
    <div className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-12 md:pb-20 relative selection:bg-mora-500/30">
        <div className="absolute top-24 left-4 lg:left-8 z-30">
            <BackButton />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center justify-center p-2.5 md:p-3 bg-white/10 rounded-2xl mb-4"><Zap className="text-white" size={24} md:size={32} /></div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Fresh APIs</h1>
                <p className="text-slate-400 mt-2 text-sm md:text-base font-light">Recently Added APIs.</p>
            </div>

            <div className="max-w-xs mx-auto mb-10 md:mb-16 relative">
                <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={`w-full flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${
                        showFilters ? 'bg-mora-500 text-black border-mora-500 shadow-lg' : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                >
                    <SlidersHorizontal size={14} md:size={16} />
                    Filter Nodes
                </button>
                {showFilters && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-4xl mt-4 px-4 z-[60]">
                         <div className="bg-black/95 border border-mora-500/30 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-slide-up backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-6 md:mb-8">
                                <h4 className="text-[10px] md:text-xs font-black text-mora-400 uppercase tracking-[0.4em]">Category</h4>
                                <button onClick={() => setShowFilters(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 max-h-[350px] md:max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {CATEGORIES.map((cat) => (
                                    <button 
                                        key={cat.name} 
                                        onClick={() => { setSelectedCategory(cat.name); setShowFilters(false); }} 
                                        className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-full border text-[9px] md:text-[11px] font-bold uppercase transition-all ${
                                            selectedCategory === cat.name 
                                            ? 'bg-mora-500 text-black border-mora-500 shadow-md' 
                                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <cat.icon size={14} md:size={16} className={selectedCategory === cat.name ? 'text-black' : 'text-mora-500/60'} />
                                        <span className="whitespace-nowrap">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                         </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
                {isLoading ? (
                  [1,2,3].map(i => <Skeleton key={i} className="h-48 md:h-64 rounded-[1.5rem] md:rounded-[2rem]" />)
                ) : filteredApis.length > 0 ? (
                  filteredApis.slice(0, visibleCount).map(api => <ApiCard key={api._id} api={api} topIds={topIds} />)
                ) : (
                  <div className="col-span-full text-center py-20 px-6 animate-fade-in">
                      <Radar size={40} className="text-mora-500 mx-auto mb-4 opacity-50" />
                      <h3 className="text-2xl font-display font-bold text-white mb-2">No Nodes</h3>
                      <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-light">No new protocols in this category.</p>
                      <button 
                          onClick={() => setSelectedCategory('All')}
                          className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full"
                      >
                          Reset Scanning
                      </button>
                  </div>
                )}
            </div>

            {visibleCount < filteredApis.length && filteredApis.length > 0 && (
                <div className="flex justify-center">
                    <button onClick={() => setVisibleCount(v => v + 12)} className="px-10 py-3.5 bg-white/5 border border-white/10 rounded-full text-white font-black text-[10px] md:text-xs uppercase tracking-widest active:scale-95 transition-all">Load More APIs</button>
                </div>
            )}
        </div>
    </div>
  );
};
