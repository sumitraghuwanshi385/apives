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

    if (reset) {
      setApis(normalized);
    } else {
      setApis((prev) => [...prev, ...normalized]);
    }

    setHasMore(pageNumber < data.totalPages);
    setPage(pageNumber);

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
<div className="max-w-3xl mx-auto mb-12 relative">
  <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1.5 focus-within:border-mora-500/50 transition-all shadow-2xl group">

    <Search
      className="ml-5 text-slate-500 group-focus-within:text-mora-500 transition-colors"
      size={18}
    />

    <input
      type="text"
      placeholder="Find APIs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-600 outline-none text-sm"
    />

    <button
      onClick={() => setShowFilters(!showFilters)}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
        showFilters
          ? "bg-mora-500 text-black border-mora-500"
          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
      }`}
    >
      <SlidersHorizontal size={14} />
      Filters
    </button>
  </div>

  {/* FILTER PANEL */}
  {showFilters && (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-4xl mt-6 px-4 z-[60]">
      <div className="bg-black/95 border border-mora-500/30 rounded-[2rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-[50px] ring-1 ring-white/10">

        {/* PRICING */}
        <div className="mb-8">
          <h4 className="text-xs font-black text-mora-400 uppercase tracking-[0.4em] mb-4">
            Pricing
          </h4>

          <div className="flex flex-wrap gap-3">
            {["All", "Free", "Freemium", "Paid"].map((price) => (
              <button
                key={price}
                onClick={() => setSelectedPricing(price)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase border transition-all ${
                  selectedPricing === price
                    ? "bg-mora-500 text-black border-mora-500"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-black text-mora-400 uppercase tracking-[0.4em]">
            Category
          </h4>

          <button
            onClick={() => setShowFilters(false)}
            className="p-2 text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[450px] overflow-y-auto pr-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setShowFilters(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat.name
                  ? "bg-mora-500 text-black border-mora-500"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <cat.icon size={16} />
              <span>{cat.name}</span>
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

            {isLoading && (
              <div className="flex justify-center py-10">
                <p className="text-mora-400 text-xs uppercase tracking-widest">
                  Loading More APIs...
                </p>
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