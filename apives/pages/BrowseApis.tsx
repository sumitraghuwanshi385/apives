import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
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

// FIX 1: Global performance styles injected via style tag
// Add these to your global CSS / index.css instead if possible:
// html, body { overflow-x: hidden; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; background: #000; }
// * { -webkit-tap-highlight-color: transparent; }

const API_BASE_URL =
  "https://apives-3xrc.onrender.com";

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


/* =========================================================
   BROWSER CACHE
   ---------------------------------------------------------
   Persists while the SPA is running.

   So:
   Browse → API → Back

   does NOT refetch or reshuffle the APIs.
========================================================= */

interface BrowseCacheEntry {
  apis: ApiListing[];
  page: number;
  hasMore: boolean;
}

const browseApiCache =
  new Map<string, BrowseCacheEntry>();

let cachedTopIds: string[] | null = null;


/* =========================================================
   SCROLL POSITION CACHE
========================================================= */

let cachedBrowseScrollY = 0;


/* =========================================================
   CACHE KEY
========================================================= */

function getBrowseCacheKey(
  searchTerm: string,
  selectedCategory: string,
  selectedPricing: string
) {
  return JSON.stringify({
    search:
      searchTerm.trim().toLowerCase(),

    category:
      selectedCategory
        .trim()
        .toLowerCase(),

    pricing:
      selectedPricing
        .trim()
        .toLowerCase(),
  });
}


/* =========================================================
   NORMALIZE CATEGORY
========================================================= */

function normalizeCategoryValue(
  value: unknown
): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        String(item)
          .trim()
          .toLowerCase()
      )
      .filter(Boolean);
  }

  if (
    typeof value === "string"
  ) {
    return value
      .split(",")
      .map((item) =>
        item
          .trim()
          .toLowerCase()
      )
      .filter(Boolean);
  }

  return [];
}


/* =========================================================
   EXACT CATEGORY MATCH
========================================================= */

function matchesCategory(
  api: any,
  category: string
): boolean {
  if (
    !category ||
    category === "All"
  ) {
    return true;
  }

  const wanted =
    category
      .trim()
      .toLowerCase();

  const possibleValues = [
    api?.category,
    api?.categories,
    api?.tags,
    api?.type,
  ];

  return possibleValues.some(
    (value) =>
      normalizeCategoryValue(
        value
      ).includes(wanted)
  );
}


/* =========================================================
   SEARCH MATCH
========================================================= */

function getApiSearchText(
  api: any
): string {
  const values = [
    api?.name,
    api?.title,
    api?.description,
    api?.shortDescription,
    api?.category,
    api?.categories,
    api?.tags,
    api?.provider,
    api?.company,
    api?.slug,
  ];

  return values
    .flatMap((value) => {
      if (Array.isArray(value)) {
        return value;
      }

      return [value];
    })
    .filter(
      (value) =>
        value !== undefined &&
        value !== null
    )
    .map((value) =>
      String(value)
        .trim()
        .toLowerCase()
    )
    .join(" ");
}


/* =========================================================
   EXACT SEARCH MATCH
========================================================= */

function matchesSearch(
  api: any,
  searchTerm: string
): boolean {
  const query =
    searchTerm
      .trim()
      .toLowerCase();

  if (!query) {
    return true;
  }

  const searchText =
    getApiSearchText(api);

  /*
   * Every word entered by the user must
   * exist somewhere in the API data.
   *
   * Example:
   *
   * "google maps"
   *
   * will only show APIs containing
   * both "google" and "maps".
   */

  const words =
    query
      .split(/\s+/)
      .filter(Boolean);

  return words.every(
    (word) =>
      searchText.includes(word)
  );
}


/* =========================================================
   LIGHT SHUFFLE
========================================================= */

const lightShuffle = (
  arr: ApiListing[]
) => {
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
};


/* =========================================================
   BROWSE APIS
========================================================= */

export const BrowseApis: React.FC =
  () => {
    const [
      apis,
      setApis,
    ] =
      useState<ApiListing[]>(
        []
      );

    const [
      page,
      setPage,
    ] =
      useState(1);

    const [
      hasMore,
      setHasMore,
    ] =
      useState(true);

    const [
      isLoading,
      setIsLoading,
    ] =
      useState(false);

    const [
      topIds,
      setTopIds,
    ] =
      useState<string[]>(
        cachedTopIds || []
      );

    const [
      searchTerm,
      setSearchTerm,
    ] =
      useState("");

    const [
      selectedCategory,
      setSelectedCategory,
    ] =
      useState("All");

    const [
      selectedPricing,
      setSelectedPricing,
    ] =
      useState("All");

    const [
      showFilters,
      setShowFilters,
    ] =
      useState(false);


    /* =======================================================
       REQUEST CONTROL
    ======================================================= */

    const requestIdRef =
      useRef(0);

    const activeControllerRef =
      useRef<AbortController | null>(
        null
      );


    /* =======================================================
       CURRENT CACHE KEY
    ======================================================= */

    const cacheKey =
      useMemo(
        () =>
          getBrowseCacheKey(
            searchTerm,
            selectedCategory,
            selectedPricing
          ),
        [
          searchTerm,
          selectedCategory,
          selectedPricing,
        ]
      );


    /* =======================================================
       LOAD APIS
    ======================================================= */

    const loadApis = async (
      pageNumber: number,
      reset = false,
      force = false
    ) => {
      const currentRequestId =
        ++requestIdRef.current;

      const currentKey =
        getBrowseCacheKey(
          searchTerm,
          selectedCategory,
          selectedPricing
        );


      /* -----------------------------------------------------
         CACHE HIT
      ----------------------------------------------------- */

      if (
        !force &&
        pageNumber === 1
      ) {
        const cached =
          browseApiCache.get(
            currentKey
          );

        if (cached) {
          setApis(
            cached.apis
          );

          setPage(
            cached.page
          );

          setHasMore(
            cached.hasMore
          );

          setIsLoading(
            false
          );

          return;
        }
      }


      /* -----------------------------------------------------
         CANCEL PREVIOUS REQUEST
      ----------------------------------------------------- */

      activeControllerRef.current?.abort();

      const controller =
        new AbortController();

      activeControllerRef.current =
        controller;


      try {
        setIsLoading(
          true
        );


        const url =
          `${API_BASE_URL}/api/apis?page=${pageNumber}&limit=12&search=${encodeURIComponent(
            searchTerm.trim()
          )}&category=${encodeURIComponent(
            selectedCategory ===
              "All"
              ? ""
              : selectedCategory
          )}&pricing=${encodeURIComponent(
            selectedPricing ===
              "All"
              ? ""
              : selectedPricing
          )}`;


        const res =
          await fetch(
            url,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
              },
              cache:
                "no-store",
              signal:
                controller.signal,
            }
          );


        if (!res.ok) {
          throw new Error(
            `API request failed: ${res.status}`
          );
        }


        const data =
          await res.json();


        console.log(
          "API RESPONSE:",
          data
        );


        /*
        -------------------------------------------------------
        LIST
        -------------------------------------------------------
        */

        const list =
          Array.isArray(
            data?.apis
          )
            ? data.apis
            : [];


        /*
        -------------------------------------------------------
        NORMALIZE
        -------------------------------------------------------
        */

        const normalized =
          list.map(
            (a: any) => ({
              ...a,
              id:
                a._id ||
                a.id,
            })
          );


        /*
        -------------------------------------------------------
        EXACT CLIENT FILTER
        -------------------------------------------------------

        Backend is already filtering.

        This second lightweight filter guarantees
        that unrelated results never leak into the
        selected category/search result.
        */

        const exactFiltered =
          normalized.filter(
            (api: any) =>
              matchesCategory(
                api,
                selectedCategory
              ) &&
              matchesSearch(
                api,
                searchTerm
              )
          );


        /*
        -------------------------------------------------------
        SHUFFLE ONLY ON A BRAND NEW FIRST PAGE
        -------------------------------------------------------

        Cached pages are NEVER shuffled again.
        */

        const finalList =
          pageNumber === 1
            ? lightShuffle(
                exactFiltered
              )
            : exactFiltered;


        /*
        -------------------------------------------------------
        STALE REQUEST CHECK
        -------------------------------------------------------
        */

        if (
          currentRequestId !==
          requestIdRef.current
        ) {
          return;
        }


        /*
        -------------------------------------------------------
        UPDATE LIST
        -------------------------------------------------------
        */

        let nextApis: ApiListing[];

        if (
          reset ||
          pageNumber === 1
        ) {
          nextApis =
            finalList;
        } else {
          nextApis =
            [
              ...apis,
              ...finalList,
            ];
        }


        /*
        -------------------------------------------------------
        PAGINATION
        -------------------------------------------------------
        */

        const totalPages =
          Number(
            data?.totalPages
          ) || 1;

        const nextHasMore =
          pageNumber <
          totalPages;


        setApis(
          nextApis
        );

        setHasMore(
          nextHasMore
        );

        setPage(
          pageNumber
        );


        /*
        -------------------------------------------------------
        SAVE CACHE
        -------------------------------------------------------
        */

        browseApiCache.set(
          currentKey,
          {
            apis:
              nextApis,

            page:
              pageNumber,

            hasMore:
              nextHasMore,
          }
        );


        /*
        -------------------------------------------------------
        TOP 3
        -------------------------------------------------------
        */

        if (
          pageNumber === 1 &&
          cachedTopIds === null
        ) {
          try {
            const rankRes =
              await fetch(
                `${API_BASE_URL}/api/community?page=1&limit=3`,
                {
                  method: "GET",
                  headers: {
                    Accept:
                      "application/json",
                  },
                  cache:
                    "no-store",
                  signal:
                    controller.signal,
                }
              );


            if (
              rankRes.ok
            ) {
              const rankData =
                await rankRes.json();


              const ids =
                Array.isArray(
                  rankData?.apis
                )
                  ? rankData.apis
                      .map(
                        (a: any) =>
                          a?._id ||
                          a?.id
                      )
                      .filter(Boolean)
                  : [];


              cachedTopIds =
                ids;

              setTopIds(
                ids
              );
            }
          } catch (
            rankError: any
          ) {
            if (
              rankError?.name !==
              "AbortError"
            ) {
              console.error(
                "Top APIs Load Error",
                rankError
              );
            }
          }
        }
      } catch (
        err: any
      ) {
        if (
          err?.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "Pagination Load Error",
          err
        );
      } finally {
        if (
          currentRequestId ===
          requestIdRef.current
        ) {
          setIsLoading(
            false
          );
        }
      }
    };


    /* =======================================================
       INITIAL / FILTER LOAD
       -------------------------------------------------------
       One effect only.

       This fixes the previous situation where:
       initial useEffect
       +
       search/category useEffect

       could trigger two requests.
    ======================================================= */

    useEffect(() => {
      const cached =
        browseApiCache.get(
          cacheKey
        );


      /*
      -------------------------------------------------------
      CACHE EXISTS
      -------------------------------------------------------
      */

      if (cached) {
        setApis(
          cached.apis
        );

        setPage(
          cached.page
        );

        setHasMore(
          cached.hasMore
        );

        setIsLoading(
          false
        );

        return;
      }


      /*
      -------------------------------------------------------
      SEARCH DEBOUNCE
      -------------------------------------------------------
      */

      const delay =
        setTimeout(
          () => {
            loadApis(
              1,
              true
            );
          },
          searchTerm.trim()
            ? 350
            : 0
        );


      return () => {
        clearTimeout(
          delay
        );

        requestIdRef.current++;

        activeControllerRef.current?.abort();
      };
    }, [
      cacheKey,
    ]);


    /* =======================================================
       RESTORE SCROLL WHEN RETURNING TO BROWSE PAGE
    ======================================================= */

    useEffect(() => {
      const restoreTimer =
        window.setTimeout(
          () => {
            if (
              cachedBrowseScrollY >
              0
            ) {
              window.scrollTo({
                top:
                  cachedBrowseScrollY,
                behavior:
                  "auto",
              });
            }
          },
          0
        );


      return () => {
        window.clearTimeout(
          restoreTimer
        );
      };
    }, []);


    /* =======================================================
       SAVE SCROLL POSITION
    ======================================================= */

    useEffect(() => {
      const handleScroll =
        () => {
          cachedBrowseScrollY =
            window.scrollY;
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
    }, []);


    /* =======================================================
       INFINITE SCROLL
    ======================================================= */

    useEffect(() => {
      let ticking =
        false;


      const handleScroll =
        () => {
          if (
            ticking
          ) {
            return;
          }


          ticking =
            true;


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


              ticking =
                false;
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
    }, [
      page,
      hasMore,
      isLoading,
      cacheKey,
      apis,
    ]);


    return (
      // FIX 2: Main page GPU composite layer
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

          {/* HEADER */}
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


          {/* SEARCH + FILTER UI */}
          <div className="max-w-2xl mx-auto mb-8 relative px-2">

            {/* FIX 4: Search container with GPU layer + reduced shadow */}
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

              {/* FIX 3: Search bar glow — replaced heavy layered shadows with single GPU-composited box-shadow */}
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
              ></div>


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
                  e
                ) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 text-xs md:text-sm"
              />


              {/* FILTER BUTTON */}
              <button
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


            {/* FILTER PANEL */}
            {showFilters && (
              <div className="absolute top-full left-0 w-full mt-3 z-50">

                {/* FIX 5: Filter panel — removed shadow-2xl, reduced border opacity, GPU layer */}
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

                  {/* PRICING */}
                  <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-mora-400 uppercase tracking-widest mb-3">
                      Pricing
                    </h4>


                    <div className="flex flex-wrap gap-2">

                      {[
                        "All",
                        "Free",
                        "Freemium",
                      ].map(
                        (
                          price
                        ) => (
                          <button
                            key={
                              price
                            }
                            onClick={() =>
                              setSelectedPricing(
                                price
                              )
                            }
                            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border ${
                              selectedPricing ===
                              price
                                ? "bg-mora-500 text-black border-mora-500"
                                : "bg-white/5 border-white/10 text-slate-400"
                            }`}
                          >
                            {
                              price
                            }
                          </button>
                        )
                      )}

                    </div>
                  </div>


                  {/* CATEGORY */}
                  <div className="mb-3 flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-mora-400 uppercase tracking-widest">
                      Category
                    </h4>


                    <button
                      onClick={() =>
                        setShowFilters(
                          false
                        )
                      }
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
                        cat
                      ) => (
                        <button
                          key={
                            cat.name
                          }
                          onClick={() => {
                            setSelectedCategory(
                              cat.name
                            );

                            setShowFilters(
                              false
                            );
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] border ${
                            selectedCategory ===
                            cat.name
                              ? "bg-mora-500 text-black border-mora-500"
                              : "bg-white/5 border-white/10 text-slate-400"
                          }`}
                        >
                          <cat.icon
                            size={
                              14
                            }
                          />

                          {
                            cat.name
                          }
                        </button>
                      )
                    )}

                  </div>
                </div>
              </div>
            )}
          </div>


          {/* GRID */}
          {apis.length ===
            0 &&
          isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {Array.from({
                length: 12,
              }).map(
                (
                  _,
                  i
                ) => (
                  <Skeleton
                    key={i}
                    className="h-72 rounded-2xl"
                  />
                )
              )}

            </div>
          ) : (
            <>
              {/* FIX 6: Grid with CSS containment + GPU layer */}
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
                      api={
                        api
                      }
                      topIds={
                        topIds
                      }
                    />
                  )
                )}

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