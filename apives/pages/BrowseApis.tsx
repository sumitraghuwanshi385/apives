import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ApiListing } from "../types";
import ApiCard from "../components/ApiCard";
import { Skeleton } from "../components/Skeleton";
import { BackButton } from "../components/BackButton";

export const BrowseApis: React.FC = () => {
  const [apis, setApis] = useState<ApiListing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [topIds, setTopIds] = useState<string[]>([]);

  // 🚀 LOAD FUNCTION
  const loadApis = async (pageNumber: number, reset = false) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `https://apives.onrender.com/api/apis?page=${pageNumber}&limit=12`
      );

      const data = await res.json();

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

      // 🔥 calculate top3
      const sorted = [...normalized]
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 3)
        .map((a) => a.id);

      setTopIds(sorted);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {apis.map((api) => (
                <ApiCard
                  key={api.id}
                  api={api}
                  topIds={topIds}
                />
              ))}
            </div>

            {/* LOADING BOTTOM */}
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