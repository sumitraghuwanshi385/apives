import React, { useState, useEffect, useRef } from "react";
import { ApiListing } from "../types";
import LandingApiCard from "../components/LandingApiCard";
import { Skeleton } from "../components/Skeleton";
import { BackButton } from "../components/BackButton";

import {
  Search, LayoutGrid, Shield, CreditCard, Cpu, Database, MessageSquare,
  X, Cloud, Globe, GraduationCap, Bitcoin, ShoppingCart, Plane,
  Stethoscope, Radar, Lock, BarChart3, Music, Video, Smartphone,
  Map, Home, Utensils, Trophy as SportsIcon, Newspaper, Briefcase,
  Languages, Users, Scale, Settings, Wrench, Gavel, BarChart4, TrendingUp,
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

export const BrowseApis: React.FC = () => {
  const [apis, setApis] = useState<ApiListing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [topIds, setTopIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Cache key for current filters so back navigation keeps same data
  const cacheKey = useRef("");
  const isFirstLoad = useRef(true);

  const loadApis = async (pageNumber: number, reset = false) => {
    try {
      setIsLoading(true);

      const query = `page=\( {pageNumber}&limit=12&search= \){encodeURIComponent(searchTerm.trim())}&category=${encodeURIComponent(selectedCategory)}`;
      
      const res = await fetch(
        `https://apives-3xrc.onrender.com/api/apis?${query}`
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

      setHasMore(pageNumber < (data.totalPages || 1));
      setPage(pageNumber);

      // Top 3 only on first page of a fresh load
      if (pageNumber === 1) {
        try {
          const rankRes = await fetch(
            "https://apives-3xrc.onrender.com/api/community?page=1&limit=3"
          );
          const rankData = await rankRes.json();
          if (rankData?.apis) {
            setTopIds(rankData.apis.map((a: any) => a._id));
          }
        } catch (e) {
          console.log("Top ranking failed", e);
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Pagination Load Error", err);
      setIsLoading(false);
    }
  };

  // Initial load only once
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      loadApis(1, true);
    }
  }, []);

  // When search or category changes → reset & fetch
  useEffect(() => {
    if (isFirstLoad.current) return;

    const currentKey = `\( {searchTerm.trim()}| \){selectedCategory}`;
    
    // Avoid unnecessary re-fetch if same filters
    if (currentKey === cacheKey.current) return;
    cacheKey.current = currentKey;

    const delay = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      loadApis(1, true);
    }, 350); // slightly faster debounce

    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory]);

  // Infinite scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 500 &&
          hasMore &&
          !isLoading
        ) {
          loadApis(page + 1);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, isLoading]);

  return (
    <div
      className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-20 relative overflow-x-hidden"
      style={{
        transform: "translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
        contain: "layout paint",
      } as React.CSSProperties}
    >
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
          <div
            className="
              relative
              flex items-center
              bg-black/50
              border border-white/10
              rounded-full
              px-4 md:px-6
              py-2 md:py-3
              shadow-lg
              overflow-hidden
              group
            "
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              willChange: "transform",
              contain: "layout paint",
            } as React.CSSProperties}
          >
            <div
              className="absolute inset-0 rounded-full pointer-events-none border border-mora-500/20"
              style={{
                boxShadow: "0 0 18px rgba(34,197,94,0.10)",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                willChange: "transform",
              } as React.CSSProperties}
            ></div>

            <Search className="text-slate-400 mr-2 flex-shrink-0" size={16} />

            <input
              type="text"
              placeholder="Find APIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 text-xs md:text-sm"
            />

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

          {/* FILTER PANEL - Pricing removed */}
          {showFilters && (
            <div className="absolute top-full left-0 w-full mt-3 z-50">
              <div
                className="bg-black border border-mora-500/20 rounded-2xl p-5"
                style={{
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  transform: "translateZ(0)",
                  willChange: "transform",
                  contain: "layout paint",
                } as React.CSSProperties}
              >
                {/* CATEGORY ONLY */}
                <div className="mb-3 flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-mora-400 uppercase tracking-widest">
                    Category
                  </h4>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto">
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
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              style={{
                contain: "layout paint",
                transform: "translateZ(0)",
              } as React.CSSProperties}
            >
              {apis.map((api) => (
                <LandingApiCard
                  key={api.id}
                  api={api}
                  topIds={topIds}
                />
              ))}
            </div>

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

            {!hasMore && apis.length > 0 && (
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