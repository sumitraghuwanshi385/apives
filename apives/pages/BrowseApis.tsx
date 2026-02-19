import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { ApiListing } from "../types";
import ApiCard from "../components/ApiCard";
import { Skeleton } from "../components/Skeleton";
import { BackButton } from "../components/BackButton";

const CATEGORIES = [
  "All",
  "AI",
  "Payments",
  "Crypto",
  "Data",
  "Finance",
  "Security",
  "Analytics",
  "Sports",
  "News",
  "Health",
  "DevOps",
  "Education",
  "Travel",
  "Gaming",
];

export const BrowseApis: React.FC = () => {
  const [apis, setApis] = useState<ApiListing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [topIds, setTopIds] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 🚀 LOAD FUNCTION
  const loadApis = async (pageNumber: number, reset = false) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `https://apives.onrender.com/api/apis?page=${pageNumber}&limit=12`
      );

      const data = await res.json();

      if (!data?.data) {
        console.error("Invalid API response");
        setIsLoading(false);
        return;
      }

      const normalized = data.data.map((a: any) => ({
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
      const matchesCategory =
        selectedCategory === "All" ||
        api.category === selectedCategory;

      const lowerSearch = searchTerm.toLowerCase();

      const matchesSearch =
        api.name?.toLowerCase().includes(lowerSearch) ||
        api.description?.toLowerCase().includes(lowerSearch) ||
        api.provider?.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesSearch;
    });
  }, [apis, searchTerm, selectedCategory]);

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

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-3">
            <Search className="text-slate-500 mr-3" size={18} />
            <input
              type="text"
              placeholder="Search APIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 text-sm"
            />
          </div>
        </div>

        {/* CATEGORY SELECT */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase border transition-all
                ${
                  selectedCategory === cat
                    ? "bg-mora-500 text-black border-mora-500"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
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