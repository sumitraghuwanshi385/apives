import React, {
  useEffect,
  useState,
} from "react";

import { ApiListing } from "../types";
import LandingApiCard from "../components/LandingApiCard";
import { Skeleton } from "../components/Skeleton";
import { BackButton } from "../components/BackButton";

import {
  Search,
  Server,
  Activity,
  Heart,
  Bookmark,
  Hash,
  LayoutGrid,
  Shield,
  CreditCard,
  Cpu,
  Database,
  MessageSquare,
  SlidersHorizontal,
  X,
  Cloud,
  Globe,
  GraduationCap,
  Bitcoin,
  ShoppingCart,
  Plane,
  Stethoscope,
  Radar,
  ArrowDown,
  Calendar,
  Trophy,
  Lock,
  BarChart3,
  Music,
  Video,
  Smartphone,
  Map,
  Home,
  Utensils,
  Trophy as SportsIcon,
  Newspaper,
  Briefcase,
  Languages,
  Users,
  Stethoscope as Steth,
  Scale,
  Settings,
  Wrench,
  Gavel,
  BarChart4,
  TrendingUp,
  Sprout,
  FlaskConical,
  Dumbbell,
  Wallet,
  Umbrella,
  Building,
  Zap,
  Truck,
  Landmark,
  Gamepad2,
} from "lucide-react";

/*
=========================================================
  API CONFIG
=========================================================
*/

const API_BASE_URL =
  "https://apives-3xrc.onrender.com";

const API_LIST_ENDPOINT =
  `${API_BASE_URL}/api/apis`;

const COMMUNITY_ENDPOINT =
  `${API_BASE_URL}/api/community`;

/*
=========================================================
  BROWSE PAGE CACHE
=========================================================

  sessionStorage is intentionally used instead of a
  global module cache.

  This keeps the Browse page state alive when the user:

  Browse APIs
      ↓
  opens an API
      ↓
  presses Back
      ↓
  returns to the same Browse state.

  The cache is limited to the current browser tab/session.
=========================================================
*/

const BROWSE_CACHE_KEY =
  "apives:browse-apis:v2";

const BROWSE_SCROLL_KEY =
  "apives:browse-scroll:v2";

interface BrowseCache {
  apis: ApiListing[];
  page: number;
  hasMore: boolean;
  topIds: string[];
  searchTerm: string;
  selectedCategory: string;
}

/*
=========================================================
  CATEGORIES
=========================================================
*/

const CATEGORIES = [
  { name: "All", icon: LayoutGrid },
  { name: "AI", icon: Cpu },
  { name: "Payments", icon: CreditCard },
  { name: "Crypto", icon: Bitcoin },
  { name: "Identity", icon: Shield },
  { name: "Data", icon: Database },
  { name: "Infrastructure", icon: Cloud },
  { name: "eCommerce", icon: ShoppingCart },
  { name: "Messaging", icon: MessageSquare },
  { name: "Finance", icon: Wallet },
  { name: "Logistics", icon: Truck },
  { name: "Security", icon: Lock },
  { name: "Analytics", icon: BarChart3 },
  { name: "Audio", icon: Music },
  { name: "Video", icon: Video },
  { name: "Mobile", icon: Smartphone },
  { name: "Maps", icon: Map },
  { name: "Weather", icon: Cloud },
  { name: "Real Estate", icon: Home },
  { name: "Food", icon: Utensils },
  { name: "Sports", icon: SportsIcon },
  { name: "News", icon: Newspaper },
  { name: "Jobs", icon: Briefcase },
  { name: "Translation", icon: Languages },
  { name: "Social", icon: Users },
  { name: "Health", icon: Steth },
  { name: "Legal", icon: Scale },
  { name: "DevOps", icon: Settings },
  { name: "Search", icon: Search },
  { name: "Tools", icon: Wrench },
  { name: "Government", icon: Gavel },
  { name: "Utilities", icon: Zap },
  { name: "Stocks", icon: BarChart4 },
  { name: "Banking", icon: Landmark },
  { name: "Insurance", icon: Umbrella },
  { name: "Agriculture", icon: Sprout },
  { name: "Science", icon: FlaskConical },
  { name: "Education", icon: GraduationCap },
  { name: "Travel", icon: Plane },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Fitness", icon: Dumbbell },
  { name: "IoT", icon: Radar },
  { name: "ERP", icon: Database },
  { name: "CRM", icon: Users },
  { name: "HR", icon: Briefcase },
  { name: "Marketing", icon: TrendingUp },
  { name: "Storage", icon: Database },
  { name: "Web3", icon: Globe },
  { name: "Automation", icon: Zap },
  { name: "Enterprise", icon: Building },
];

/*
=========================================================
  CACHE HELPERS
=========================================================
*/

function readBrowseCache(): BrowseCache | null {
  try {
    const raw =
      sessionStorage.getItem(
        BROWSE_CACHE_KEY
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      !Array.isArray(parsed.apis)
    ) {
      return null;
    }

    return {
      apis: parsed.apis,
      page:
        Number(parsed.page) || 1,
      hasMore:
        Boolean(parsed.hasMore),
      topIds:
        Array.isArray(parsed.topIds)
          ? parsed.topIds
          : [],
      searchTerm:
        typeof parsed.searchTerm ===
        "string"
          ? parsed.searchTerm
          : "",
      selectedCategory:
        typeof parsed.selectedCategory ===
        "string"
          ? parsed.selectedCategory
          : "All",
    };
  } catch {
    return null;
  }
}

function writeBrowseCache(
  cache: BrowseCache
) {
  try {
    sessionStorage.setItem(
      BROWSE_CACHE_KEY,
      JSON.stringify(cache)
    );
  } catch {
    /*
     * Storage can fail in private browsing
     * or when quota is exceeded.
     *
     * Browse page must continue working.
     */
  }
}

function saveScrollPosition() {
  try {
    sessionStorage.setItem(
      BROWSE_SCROLL_KEY,
      String(window.scrollY)
    );
  } catch {
    // Ignore storage errors.
  }
}

function readScrollPosition(): number {
  try {
    const value =
      sessionStorage.getItem(
        BROWSE_SCROLL_KEY
      );

    if (!value) {
      return 0;
    }

    const position =
      Number(value);

    return Number.isFinite(position)
      ? position
      : 0;
  } catch {
    return 0;
  }
}

/*
=========================================================
  NORMALIZE API
=========================================================
*/

function normalizeApi(
  api: any
): ApiListing {
  return {
    ...api,
    id:
      api?._id ||
      api?.id,
  };
}

/*
=========================================================
  LIGHT SHUFFLE
=========================================================

  Kept exactly as the original behavior.

  Important:
  This function is ONLY called when a genuinely
  new first-page result is fetched.

  Cached results are NEVER shuffled again.
=========================================================
*/

function lightShuffle(
  arr: ApiListing[]
): ApiListing[] {
  const copy = [...arr];

  for (
    let i = 0;
    i <
      Math.min(
        4,
        copy.length - 1
      );
    i++
  ) {
    const j =
      Math.floor(
        Math.random() *
          copy.length
      );

    [
      copy[i],
      copy[j],
    ] = [
      copy[j],
      copy[i],
    ];
  }

  return copy;
}

/*
=========================================================
  BROWSE APIS
=========================================================
*/

export const BrowseApis: React.FC = () => {
  /*
  =======================================================
    RESTORE EXISTING SESSION STATE FIRST
  =======================================================
  */

  const initialCache =
    readBrowseCache();

  const [
    apis,
    setApis,
  ] = useState<ApiListing[]>(
    initialCache?.apis || []
  );

  const [
    page,
    setPage,
  ] = useState(
    initialCache?.page || 1
  );

  const [
    hasMore,
    setHasMore,
  ] = useState(
    initialCache
      ? initialCache.hasMore
      : true
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    !initialCache
  );

  const [
    topIds,
    setTopIds,
  ] = useState<string[]>(
    initialCache?.topIds || []
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState(
    initialCache?.searchTerm || ""
  );

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    initialCache?.selectedCategory ||
      "All"
  );

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  /*
  =======================================================
    REQUEST REFS

    These prevent old/slower requests from overwriting
    newer search/category results.
  =======================================================
  */

  const [
    requestVersion,
    setRequestVersion,
  ] = useState(0);

  /*
  =======================================================
    CACHE CURRENT STATE
  =======================================================
  */

  useEffect(() => {
    writeBrowseCache({
      apis,
      page,
      hasMore,
      topIds,
      searchTerm,
      selectedCategory,
    });
  }, [
    apis,
    page,
    hasMore,
    topIds,
    searchTerm,
    selectedCategory,
  ]);

  /*
  =======================================================
    SAVE SCROLL POSITION

    This runs before leaving Browse page as well as while
    scrolling, so Back returns the user to the same place.
  =======================================================
  */

  useEffect(() => {
    let ticking = false;

    const handleScroll =
      () => {
        if (ticking) {
          return;
        }

        ticking = true;

        requestAnimationFrame(() => {
          saveScrollPosition();

          ticking = false;
        });
      };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      saveScrollPosition();

      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
  =======================================================
    RESTORE SCROLL POSITION

    Only when returning to an already cached Browse page.
  =======================================================
  */

  useEffect(() => {
    if (!initialCache) {
      return;
    }

    const savedPosition =
      readScrollPosition();

    if (savedPosition <= 0) {
      return;
    }

    const restore =
      () => {
        window.scrollTo({
          top: savedPosition,
          behavior: "auto",
        });
      };

    /*
     * Two frames make restoration reliable when React
     * has just painted the cached cards.
     */

    requestAnimationFrame(() => {
      requestAnimationFrame(
        restore
      );
    });
  }, []);

  /*
  =======================================================
    LOAD FUNCTION
  =======================================================

    - No pricing parameter.
    - Category is sent directly.
    - Search is sent directly.
    - AbortController prevents stale responses.
    - First page is shuffled only after a fresh request.
  =======================================================
  */

  const loadApis = async (
    pageNumber: number,
    reset = false,
    signal?: AbortSignal
  ) => {
    try {
      setIsLoading(true);

      const params =
        new URLSearchParams();

      params.set(
        "page",
        String(pageNumber)
      );

      params.set(
        "limit",
        "12"
      );

      const cleanSearch =
        searchTerm.trim();

      const cleanCategory =
        selectedCategory.trim();

      if (cleanSearch) {
        params.set(
          "search",
          cleanSearch
        );
      }

      if (
        cleanCategory &&
        cleanCategory !== "All"
      ) {
        params.set(
          "category",
          cleanCategory
        );
      }

      const requestUrl =
        `${API_LIST_ENDPOINT}?${params.toString()}`;

      console.log(
        "[Apives Browse] Loading:",
        requestUrl
      );

      const res =
        await fetch(
          requestUrl,
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",
              "Cache-Control":
                "no-cache",
            },
            cache: "no-store",
            signal,
          }
        );

      if (!res.ok) {
        throw new Error(
          `API request failed (${res.status})`
        );
      }

      const data =
        await res.json();

      if (signal?.aborted) {
        return;
      }

      console.log(
        "[Apives Browse] API RESPONSE:",
        data
      );

      const list =
        Array.isArray(data?.apis)
          ? data.apis
          : [];

      const normalized =
        list.map(
          normalizeApi
        );

      /*
      =====================================================
        EXTRA CATEGORY SAFETY

        If backend returns category metadata, make sure
        the selected category is actually represented.

        This does NOT run for "All".
      =====================================================
      */

      let categorySafeList =
        normalized;

      if (
        cleanCategory &&
        cleanCategory !== "All"
      ) {
        const apisWithCategory =
          normalized.filter(
            (api: any) =>
              typeof api?.category ===
              "string"
          );

        if (
          apisWithCategory.length >
          0
        ) {
          categorySafeList =
            normalized.filter(
              (api: any) =>
                String(
                  api?.category || ""
                )
                  .trim()
                  .toLowerCase() ===
                cleanCategory.toLowerCase()
            );
        }
      }

      /*
      =====================================================
        FIRST PAGE
      =====================================================
      */

      const finalList =
        pageNumber === 1
          ? lightShuffle(
              categorySafeList
            )
          : categorySafeList;

      if (reset) {
        setApis(
          finalList
        );
      } else {
        setApis(
          (previous) => [
            ...previous,
            ...finalList,
          ]
        );
      }

      const totalPages =
        Number(
          data?.totalPages
        ) || 1;

      setHasMore(
        pageNumber <
          totalPages
      );

      setPage(
        pageNumber
      );

      /*
      =====================================================
        TOP COMMUNITY APIS

        Only fetch if we don't already have them.

        This avoids another backend request when the user
        simply returns to Browse.
      =====================================================
      */

      if (
        pageNumber === 1 &&
        topIds.length === 0
      ) {
        try {
          const rankRes =
            await fetch(
              `${COMMUNITY_ENDPOINT}?page=1&limit=3`,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
                cache: "no-store",
                signal,
              }
            );

          if (
            rankRes.ok &&
            !signal?.aborted
          ) {
            const rankData =
              await rankRes.json();

            const rankedApis =
              Array.isArray(
                rankData?.apis
              )
                ? rankData.apis
                : [];

            setTopIds(
              rankedApis
                .map(
                  (api: any) =>
                    api?._id ||
                    api?.id
                )
                .filter(Boolean)
            );
          }
        } catch (rankError: any) {
          if (
            rankError?.name !==
            "AbortError"
          ) {
            console.error(
              "[Apives Browse] Community ranking error:",
              rankError
            );
          }
        }
      }
    } catch (error: any) {
      if (
        error?.name ===
        "AbortError"
      ) {
        return;
      }

      console.error(
        "[Apives Browse] Pagination Load Error:",
        error
      );
    } finally {
      if (
        !signal?.aborted
      ) {
        setIsLoading(
          false
        );
      }
    }
  };

  /*
  =======================================================
    INITIAL LOAD

    IMPORTANT:
    If session cache exists, do NOT fetch again.

    This is what prevents:
      Browse → API → Back
    from reshuffling/refetching the entire page.
  =======================================================
  */

  useEffect(() => {
    if (initialCache) {
      return;
    }

    const controller =
      new AbortController();

    loadApis(
      1,
      true,
      controller.signal
    );

    return () => {
      controller.abort();
    };

    // Intentionally only initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  =======================================================
    SEARCH + CATEGORY

    Search/category changes intentionally fetch a new
    result set.

    - 400ms debounce retained.
    - Previous request is cancelled.
    - Old results cannot overwrite the new selection.
    - Pricing is no longer involved.
  =======================================================
  */

  useEffect(() => {
    /*
     * Don't trigger an unnecessary request on the very
     * first render when a cached Browse state was restored.
     */

    if (
      initialCache &&
      requestVersion === 0
    ) {
      setRequestVersion(
        1
      );

      return;
    }

    const controller =
      new AbortController();

    const delay =
      window.setTimeout(
        () => {
          /*
           * New filters/search start a fresh result set.
           * Clear the old scroll position because the user
           * intentionally changed the result set.
           */

          try {
            sessionStorage.removeItem(
              BROWSE_SCROLL_KEY
            );
          } catch {
            // Ignore storage errors.
          }

          /*
           * Clear existing results only when the new
           * request starts. This preserves the existing
           * skeleton/loading behavior.
           */

          loadApis(
            1,
            true,
            controller.signal
          );
        },
        400
      );

    return () => {
      window.clearTimeout(
        delay
      );

      controller.abort();
    };

    // The request intentionally follows search/category.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    selectedCategory,
  ]);

  /*
  =======================================================
    INFINITE SCROLL
  =======================================================
  */

  useEffect(() => {
    let ticking = false;

    const handleScroll =
      () => {
        if (ticking) {
          return;
        }

        ticking = true;

        requestAnimationFrame(
          () => {
            if (
              window.innerHeight +
                window.scrollY >=
                document.body
                  .offsetHeight -
                  500 &&
              hasMore &&
              !isLoading
            ) {
              loadApis(
                page + 1
              );
            }

            ticking = false;
          }
        );
      };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

    // Existing infinite-scroll behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    hasMore,
    isLoading,
  ]);

  /*
  =======================================================
    FILTER HANDLERS
  =======================================================
  */

  const handleCategoryChange =
    (
      category: string
    ) => {
      setSelectedCategory(
        category
      );

      setShowFilters(
        false
      );
    };

  /*
  =======================================================
    RENDER
  =======================================================
  */

  return (
    <div
      className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-20 relative overflow-x-hidden"
      style={{
        transform:
          "translateZ(0)",
        willChange:
          "transform",
        backfaceVisibility:
          "hidden",
        WebkitFontSmoothing:
          "antialiased",
        contain:
          "layout paint",
      } as React.CSSProperties}
    >
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4">
            <Search
              className="text-mora-500"
              size={24}
            />
          </div>

          <h1 className="text-3xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight">
            Explore APIs
          </h1>

          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto">
            Browse trusted APIs and endpoints.
          </p>

        </div>

        {/* =================================================
            SEARCH + FILTER UI
        ================================================= */}

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
              transform:
                "translateZ(0)",
              backfaceVisibility:
                "hidden",
              willChange:
                "transform",
              contain:
                "layout paint",
            } as React.CSSProperties}
          >

            <div
              className="absolute inset-0 rounded-full pointer-events-none border border-mora-500/20"
              style={{
                boxShadow:
                  "0 0 18px rgba(34,197,94,0.10)",
                transform:
                  "translateZ(0)",
                backfaceVisibility:
                  "hidden",
                willChange:
                  "transform",
              } as React.CSSProperties}
            />

            {/* SEARCH ICON */}

            <Search
              className="text-slate-400 mr-2 flex-shrink-0"
              size={16}
            />

            {/* INPUT */}

            <input
              type="text"
              placeholder="Find APIs..."
              value={
                searchTerm
              }
              onChange={(
                event
              ) =>
                setSearchTerm(
                  event.target
                    .value
                )
              }
              className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 text-xs md:text-sm"
            />

            {/* FILTER BUTTON */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  !showFilters
                )
              }
              className={`ml-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase transition-all ${
                showFilters
                  ? "bg-mora-500 text-black"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              Filters
            </button>

          </div>

          {/* =================================================
              FILTER PANEL
          ================================================= */}

          {showFilters && (
            <div className="absolute top-full left-0 w-full mt-3 z-50">

              <div
                className="bg-black border border-mora-500/20 rounded-2xl p-5"
                style={{
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.35)",
                  transform:
                    "translateZ(0)",
                  willChange:
                    "transform",
                  contain:
                    "layout paint",
                } as React.CSSProperties}
              >

                {/* CATEGORY */}

                <div className="mb-3 flex justify-between items-center">

                  <h4 className="text-[10px] font-bold text-mora-400 uppercase tracking-widest">
                    Category
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      setShowFilters(
                        false
                      )
                    }
                    aria-label="Close filters"
                  >
                    <X
                      size={16}
                      className="text-slate-400"
                    />
                  </button>

                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto">

                  {CATEGORIES.map(
                    (
                      category
                    ) => {
                      const CategoryIcon =
                        category.icon;

                      return (
                        <button
                          key={
                            category.name
                          }
                          type="button"
                          onClick={() =>
                            handleCategoryChange(
                              category.name
                            )
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] border ${
                            selectedCategory ===
                            category.name
                              ? "bg-mora-500 text-black border-mora-500"
                              : "bg-white/5 border-white/10 text-slate-400"
                          }`}
                        >

                          <CategoryIcon
                            size={14}
                          />

                          {
                            category.name
                          }

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

            </div>
          )}

        </div>

        {/* =================================================
            GRID
        ================================================= */}

        {apis.length ===
          0 &&
        isLoading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {Array.from({
              length: 12,
            }).map(
              (
                _,
                index
              ) => (
                <Skeleton
                  key={index}
                  className="h-72 rounded-2xl"
                />
              )
            )}

          </div>

        ) : (

          <>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              style={{
                contain:
                  "layout paint",
                transform:
                  "translateZ(0)",
              } as React.CSSProperties}
            >

              {apis.map(
                (
                  api
                ) => (
                  <LandingApiCard
                    key={
                      api.id
                    }
                    api={api}
                    topIds={
                      topIds
                    }
                  />
                )
              )}

            </div>

            {/* =================================================
                GLOBAL LOADER
            ================================================= */}

            {isLoading && (

              <div className="w-full flex justify-center py-12">

                <div className="flex flex-col items-center gap-3">

                  <div className="relative w-10 h-10">

                    <div className="absolute inset-0 rounded-full border border-mora-500/20 animate-ping" />

                    <div className="absolute inset-0 rounded-full border-2 border-mora-500 border-t-transparent animate-spin" />

                  </div>

                  <p className="text-mora-400 text-[10px] uppercase tracking-[0.3em]">
                    Syncing APIs
                  </p>

                </div>

              </div>

            )}

            {/* =================================================
                END OF APIS
            ================================================= */}

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