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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // 🔥 LIGHT SHUFFLE (cheap)
  const lightShuffle = (arr: ApiListing[]) => {
    const copy = [...arr];
    for (let i = 0; i < Math.min(4, copy.length - 1); i++) {
      const j = Math.floor(Math.random() * copy.length);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const loadApis = async (pageNumber: number, reset = false) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `https://apives.onrender.com/api/apis?page=${pageNumber}&limit=12`
      );

      const data = await res.json();

      const normalized = (data.apis || []).map((a: any) => ({
        ...a,
        id: a._id,
      }));

      const shuffled = pageNumber === 1
        ? lightShuffle(normalized)
        : normalized;

      if (reset) {
        setApis(shuffled);
      } else {
        setApis((prev) => [...prev, ...shuffled]);
      }

      setHasMore(pageNumber < data.totalPages);
      setPage(pageNumber);
      setIsLoading(false);

    } catch (err) {
      console.error("Pagination Load Error", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApis(1, true);
  }, []);

  // 🔥 FILTER (fast memo)
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

        {/* GRID */}
        {apis.length === 0 && isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredApis.map((api) => (
                <ApiCard key={api.id} api={api} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => loadApis(page + 1)}
                  className="px-10 py-3 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-widest"
                >
                  Load More APIs
                </button>
              </div>
            )}

            {!hasMore && (
              <div className="text-center text-slate-500 text-xs uppercase tracking-widest mt-6">
                End of APIs
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};