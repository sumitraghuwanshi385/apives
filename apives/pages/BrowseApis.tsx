import React, { useState, useEffect, useMemo } from "react";
import { ApiListing } from "../types";
import ApiCard from "../components/ApiCard";
import { Skeleton } from "../components/Skeleton";
import { BackButton } from "../components/BackButton";

import {
Search, Server, Activity, Heart, Bookmark, Hash, LayoutGrid, Shield,
CreditCard, Cpu, Database, MessageSquare, SlidersHorizontal, X, Cloud,
Globe, GraduationCap, Bitcoin, ShoppingCart, Plane, Stethoscope, Radar,
ArrowDown, Calendar, Trophy, Lock, BarChart3, Music, Video, Smartphone,
Map, Home, Utensils, Trophy as SportsIcon, Newspaper, Briefcase,
Languages, Users, Stethoscope as Steth, Scale, Settings, Wrench, Gavel, BarChart4, TrendingUp,
Sprout, FlaskConical, Dumbbell, Wallet, Umbrella, Building, Zap, Truck,
Landmark, Gamepad2
} from 'lucide-react';

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
{ name: 'Health', icon: Steth },
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

export const BrowseApis: React.FC = () => {
  const [apis, setApis] = useState<ApiListing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [topIds, setTopIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
const [selectedPricing, setSelectedPricing] = useState("All");
const [showFilters, setShowFilters] = useState(false);

// 🔥 VERY LIGHT SHUFFLE (cheap, no heavy sort)
const lightShuffle = (arr: ApiListing[]) => {
  const copy = [...arr];
  for (let i = 0; i < Math.min(4, copy.length - 1); i++) {
    const j = Math.floor(Math.random() * copy.length);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

  // 🚀 LOAD FUNCTION
 const loadApis = async (pageNumber: number, reset = false) => {
  try {
    setIsLoading(true);

    const res = await fetch(
      `https://apives.onrender.com/api/apis?page=${pageNumber}&limit=12`
    );

    const data = await res.json();

    console.log("API RESPONSE:", data);

    const list = Array.isArray(data.apis) ? data.apis : [];

    const normalized = list.map((a: any) => ({
      ...a,
      id: a._id,
    }));

    const finalList =
  pageNumber === 1 ? lightShuffle(normalized) : normalized;

if (reset) {
  setApis(finalList);
} else {
  setApis((prev) => [...prev, ...finalList]);
}

    setHasMore(pageNumber < data.totalPages);
    setPage(pageNumber);

// 🔥 Fetch real top 3 most liked APIs (only first page)
if (pageNumber === 1) {
  const rankRes = await fetch(
    "https://apives.onrender.com/api/community?page=1&limit=3"
  );
  const rankData = await rankRes.json();

  setTopIds(rankData.apis.map((a: any) => a._id));
}

    setIsLoading(false);

  } catch (err) {
    console.error("Pagination Load Error", err);
    setIsLoading(false);
  }
};

  // 🚀 Initial Load
  useEffect(() => {
    loadApis(1, true);
  }, []);

  // 🚀 Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !isLoading
      ) {
        loadApis(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, isLoading]);

  // 🔥 LIGHT FRONTEND FILTER (FAST)
  const filteredApis = useMemo(() => {
  return apis.filter((api) => {
    const categoryMatch =
      selectedCategory === "All" ||
      api.category === selectedCategory;

    const pricingMatch =
      selectedPricing === "All" ||
      api.pricing?.type === selectedPricing;

    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      api.name?.toLowerCase().includes(lowerSearch) ||
      api.description?.toLowerCase().includes(lowerSearch) ||
      api.provider?.toLowerCase().includes(lowerSearch);

    return categoryMatch && pricingMatch && matchesSearch;
  });
}, [apis, searchTerm, selectedCategory, selectedPricing]);

  return (
    <div className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-20 relative">
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4">
            <Search className="text-mora-500" size={24} />
          </div>

          <h1 className="text-3xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight">
            Explore APIs
          </h1>

          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto">
            Browse trusted APIs and endpoints.
          </p>
        </div>

        {/* SEARCH + FILTER UI */}
<div className="max-w-2xl mx-auto mb-8 relative px-2">

  <div className="
  relative
  flex items-center
  bg-black/50
  border border-white/10
  rounded-full
  px-4 md:px-6
  py-2 md:py-3
  shadow-xl
  overflow-hidden
  group
">

    {/* Navbar Style Glow */}
<div className="absolute inset-0 rounded-full pointer-events-none hidden md:block">
  <div className="absolute top-0 bottom-0 left-0 w-[50%] border-l-[2px] border-mora-500 rounded-l-full shadow-[-15px_0_30px_-5px_rgba(34,197,94,0.45)] opacity-80 group-hover:opacity-100 transition-all duration-500"></div>
  <div className="absolute top-0 bottom-0 right-0 w-[50%] border-r-[2px] border-mora-500 rounded-r-full shadow-[15px_0_30px_-5px_rgba(34,197,94,0.45)] opacity-80 group-hover:opacity-100 transition-all duration-500"></div>
</div>

    {/* SEARCH ICON */}
    <Search
      className="text-slate-400 mr-2 flex-shrink-0"
      size={16}
    />

    {/* INPUT */}
    <input
      type="text"
      placeholder="Find APIs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 text-xs md:text-sm"
    />

    {/* FILTER BUTTON */}
    <button
      onClick={() => setShowFilters(!showFilters)}
      className={`ml-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase transition-all ${
        showFilters
          ? "bg-mora-500 text-black"
          : "bg-white/10 text-slate-300"
      }`}
    >
      Filters
    </button>
  </div>


  {/* FILTER PANEL */}
  {showFilters && (
    <div className="absolute top-full left-0 w-full mt-3 z-50">
      <div className="bg-black border border-mora-500/30 rounded-2xl p-5 shadow-2xl">

        {/* PRICING */}
        <div className="mb-6">
          <h4 className="text-[10px] font-bold text-mora-400 uppercase tracking-widest mb-3">
            Pricing
          </h4>

          <div className="flex flex-wrap gap-2">
            {["All", "Free", "Freemium", "Paid"].map((price) => (
              <button
                key={price}
                onClick={() => setSelectedPricing(price)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border ${
                  selectedPricing === price
                    ? "bg-mora-500 text-black border-mora-500"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mb-3 flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-mora-400 uppercase tracking-widest">
            Category
          </h4>
          <button onClick={() => setShowFilters(false)}>
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setShowFilters(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] border ${
                selectedCategory === cat.name
                  ? "bg-mora-500 text-black border-mora-500"
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              <cat.icon size={14} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )}
</div>
 {/* GRID */}
        {apis.length === 0 && isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredApis.map((api) => (
                <ApiCard
                  key={api.id}
                  api={api}
                  topIds={topIds}
                />
              ))}
            </div>

           {/* GLOBAL LOADER */}
{isLoading && (
  <div className="w-full flex justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border border-mora-500/20 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-2 border-mora-500 border-t-transparent animate-spin"></div>
      </div>

      <p className="text-mora-400 text-[10px] uppercase tracking-[0.3em]">
        Syncing APIs
      </p>
    </div>
  </div>
)}

            {!hasMore && (
              <div className="text-center text-slate-500 text-xs uppercase tracking-widest">
                End of APIs
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};