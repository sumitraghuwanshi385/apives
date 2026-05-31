import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Heart,
  Bookmark,
  Activity,
  Zap,
  Hash,
  Server,
  Trophy,
  LayoutGrid,
  Image,
  Copy,
  Check,
  Play,
  Info,
  Key
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ApiListing } from '../types';
import { apiService } from '../services/apiClient';
import { ApivesAIHighlight } from '../components/ApivesAIHighlight';
import QuickStartPlayground from "../components/QuickStartPlayground";
import LiveApiRunner from "../components/LiveApiRunner";
import ApiCard from '../components/ApiCard';
import SponsorsSection from "../components/SponsorsSection";

let LANDING_API_CACHE:
  | {
      universal: ApiListing[];
      fresh: ApiListing[];
      community: ApiListing[];
    }
  | null = null;

const trackSponsor = (sponsor: string, type: "impression" | "click") => {
  console.log("SPONSOR TRACK FIRED 👉", sponsor, type);
  fetch("https://apives-3xrc.onrender.com/api/sponsor/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sponsor: sponsor,
      type: type,
      page: window.location.pathname
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Sponsor tracked:", data);
    })
    .catch(err => {
      console.error("❌ Sponsor track failed:", err);
    });
};

const handleSponsorClick = (sponsor: string, baseUrl: string) => {
  trackSponsor(sponsor, "click");
  const utmUrl = `${baseUrl}?utm_source=apives&utm_medium=sponsor&utm_campaign=apives_api_marketplace`;
  window.open(utmUrl, "_blank", "noopener,noreferrer");
};

/* ===== SECTION LOADER ===== */
const SectionLoader: React.FC<{ text: string }> = ({ text }) => (
  <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border border-mora-500/20 animate-ping"></div>
      <div className="absolute inset-0 rounded-full border-2 border-mora-500 border-t-transparent animate-spin"></div>
    </div>
    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono">
      {text}
    </p>
  </div>
);
/* ========================== */

const isNew = (dateString: string) => {
  if (!dateString) return false;
  const publishedDate = new Date(dateString).getTime();
  if (Number.isNaN(publishedDate)) return false;
  const now = Date.now();
  const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
  return (now - publishedDate) < fifteenDaysInMs;
};

const lightShuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const RANK_BADGE_STYLES = [
  { label: 'Apex', color: 'from-amber-400 to-yellow-600', text: 'text-black' },
  { label: 'Prime', color: 'from-slate-200 to-slate-400', text: 'text-black' },
  { label: 'Zenith', color: 'from-orange-400 to-amber-700', text: 'text-white' }
];

const OfferSlider: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % 2);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const diff = startX - currentX;
    if (diff > 50) setIndex((prev) => (prev + 1) % 2);
    else if (diff < -50) setIndex((prev) => (prev - 1 + 2) % 2);
    setIsDragging(false);
  };

  return (
    <div className="relative pt-3 pb-2" style={{ contain: 'layout paint', backfaceVisibility: 'hidden' }}>
      <div className="flex justify-center px-4">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="overflow-hidden w-full max-w-xl"
          style={{ maxWidth: '100%' }}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)`, willChange: 'transform' }}
          >
            {/* ================= SERPAPI ================= */}
            <div className="w-full flex-shrink-0 px-1" style={{ minWidth: '100%' }}>
              <div className="relative w-full flex items-center justify-between px-5 py-4 rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-md overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.15),transparent_70%)]" />
                </div>
                <div className="relative flex items-center gap-2">
                  <img
                    src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"
                    className="w-7 h-7 rounded-md bg-white p-[2px] object-contain"
                    alt="SerpAPI"
                  />
                  <span className="text-slate-500 text-[10px] font-bold">×</span>
                  <img
                    src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png"
                    className="w-7 h-7 object-contain"
                    alt="Apives"
                  />
                  <div>
                    <p className="text-green-400 text-[12px] font-bold">500 Free SerpAPI Credits</p>
                    <p className="text-[10px] text-slate-400">Limited builder access</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/offers/serpapi")}
                  className="relative text-[10px] px-4 py-1.5 rounded-full bg-white text-black font-bold uppercase"
                >
                  Claim
                </button>
              </div>
            </div>

            {/* ================= APIVES AI ================= */}
            <div className="w-full flex-shrink-0 px-1" style={{ minWidth: '100%' }}>
              <div className="relative w-full flex items-center justify-between px-5 py-4 rounded-xl border border-mora-500/30 bg-mora-500/10 backdrop-blur-md overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.18),transparent_70%)]" />
                </div>
                <div className="relative flex items-center gap-2">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <img
                      src="https://res.cloudinary.com/dp7avkarg/image/upload/v1777024712/Picsart_26-04-24_15-27-41-095_dwsga0.png"
                      className="w-8 h-8 object-contain"
                      alt="ApivesAI"
                    />
                    <div className="absolute inset-0 rounded-full border border-green-400/30 animate-ping pointer-events-none" />
                  </div>
                  <div>
                    <p className="text-mora-400 text-[12px] font-bold">ApivesAI</p>
                    <p className="text-[10px] text-slate-400">The API Intelligence You Deserve</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/ask-apives-ai")}
                  className="relative text-[10px] px-4 py-1.5 rounded-full bg-mora-500 text-black font-bold uppercase"
                >
                  Try
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-2">
        {[0, 1].map(i => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-mora-500" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
};


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [universalApis, setUniversalApis] = useState<ApiListing[]>([]);
  const [freshApis, setFreshApis] = useState<ApiListing[]>([]);
  const [communityApis, setCommunityApis] = useState<ApiListing[]>([]);
  const [top3Ids, setTop3Ids] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    trackSponsor("serpapi", "impression");
    trackSponsor("scoutpanels", "impression");

    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsMobile(window.innerWidth < 768));
    };
    window.addEventListener("resize", handleResize);

    const user = localStorage.getItem("mora_user");
    if (user) {
      try {
        setIsAuthenticated(true);
        setUserName(JSON.parse(user).name || "Builder");
      } catch (e) {
        // ignore parse errors
      }
    }

    let isMounted = true;

    (async () => {
      try {
        if (LANDING_API_CACHE) {
          if (isMounted) {
            setUniversalApis(LANDING_API_CACHE.universal);
            setFreshApis(LANDING_API_CACHE.fresh);
            setCommunityApis(LANDING_API_CACHE.community);
            setIsLoading(false);
          }
          return;
        }

        const res = await fetch("https://apives-3xrc.onrender.com/api/landing");
        const data = await res.json();

        const normalize = (arr: any[]) =>
          arr.map((a: any) => ({
            ...a,
            id: a._id,
            publishedAt: a.createdAt,
            tags: Array.isArray(a.tags) ? a.tags : [],
            features: Array.isArray(a.features) ? a.features : [],
          }));

        const universal = normalize(data.universal || []);
        const fresh = normalize(data.fresh || []);
        const community = normalize(data.community || []);

        LANDING_API_CACHE = { universal, fresh, community };

        if (isMounted) {
          setUniversalApis(universal);
          setFreshApis(fresh);
          setCommunityApis(community);
          setTop3Ids(
            [...community]
              .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
              .slice(0, 3)
              .map(a => a.id)
          );
          setIsLoading(false);
        }
      } catch (e) {
        console.error("LandingPage fetch failed", e);
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const updateLandingUpvotes = (apiId: string, delta: number) => {
    const update = (list: ApiListing[]) =>
      list.map(api =>
        api.id === apiId
          ? { ...api, upvotes: Math.max((api.upvotes || 0) + delta, 0) }
          : api
      );
    setUniversalApis(prev => update(prev));
    setFreshApis(prev => update(prev));
    setCommunityApis(prev => update(prev));
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-black text-slate-100 selection:bg-mora-500/30"
      style={{ overflowX: 'hidden', maxWidth: '100%' }}
    >

      {/* ================= HERO ================= */}
      <section
        className="relative pt-24 md:pt-36 pb-8 md:pb-12"
        style={{ overflow: 'hidden', contain: 'layout paint' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: 'hidden' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-3xl md:text-8xl font-display font-bold text-white tracking-tighter mb-4 md:mb-8 leading-[1] animate-slide-up">
            {isAuthenticated ? (
              <>Welcome, <span className="text-mora-500">{userName}</span>.</>
            ) : (
              <>Discover APIs. <br /><span className="text-mora-500">Deploy Potential.</span></>
            )}
          </h1>

          <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto mt-4 font-light leading-relaxed animate-fade-in opacity-80">
            {isAuthenticated
              ? 'The grid is operational. Discover and integrate verified endpoint protocols.'
              : 'Apives curates APIs with clear pricing, stability, access types, and real endpoint examples. This helps developers avoid guesswork caused by incomplete docs or outdated GitHub repositories.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 md:mt-8">
            <Link
              to="/browse"
              className="px-6 py-3 md:px-8 md:py-3.5 text-[11px] md:text-xs font-black text-black bg-mora-500 rounded-full transition-all hover:scale-105 hover:bg-white shadow-[0_0_25px_rgba(34,197,94,0.25)] active:scale-95 uppercase tracking-widest"
            >
              Explore APIs
            </Link>
            <Link
              to="/submit"
              className="px-6 py-3 md:px-8 md:py-3.5 text-[11px] md:text-xs font-black text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
            >
              Submit API
            </Link>
          </div>
        </div>
      </section>

      {/* ================= OFFER SECTION ================= */}
      <section
        className="relative py-4 md:py-6 bg-black"
        style={{ overflow: 'hidden', contain: 'layout paint' }}
      >
        <div className="text-center mb-3 md:mb-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold">
            APIVES EXCLUSIVE
          </p>
        </div>
        <OfferSlider />
      </section>

      {/* ================= QUICK START + LIVE API RUNNER ================= */}
      <section
        className="pt-4 md:pt-6 pb-6 bg-black"
        style={{ overflow: 'hidden', contain: 'layout paint' }}
      >
        <QuickStartPlayground />
        <LiveApiRunner />
      </section>

      {/* ================= WHAT ARE YOU BUILDING TODAY ================= */}
      <section
        className="py-10 md:py-16 bg-black border-t border-white/5"
        style={{ overflow: 'hidden', contain: 'layout paint', position: 'relative' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: 'hidden' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
              What are you building today?
            </h2>
            <p className="mt-2 text-slate-400 text-xs md:text-sm max-w-xl mx-auto">
              Choose a use-case and explore APIs curated specifically for that build.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[
              { title: "AI Chatbots", desc: "LLMs, chat, assistants", icon: Zap, link: "/build/chatbots" },
              { title: "Voice to Text", desc: "Speech recognition APIs", icon: Activity, link: "/build/voice" },
              { title: "Image Generation", desc: "Text → Image models", icon: Image, link: "/build/image-generation" },
              { title: "Payments", desc: "Billing & subscriptions", icon: Server, link: "/build/payments" },
              { title: "Authentication", desc: "Login, OTP, identity", icon: Hash, link: "/build/authentication" },
              { title: "Analytics", desc: "Tracking & insights", icon: TrendingUp, link: "/build/analytics" }
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="group relative bg-dark-900/50 hover:bg-dark-900/80 border border-white/10 hover:border-mora-500/40 rounded-2xl p-4 md:p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                style={{ contain: 'layout paint', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-mora-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-mora-500/10 border border-mora-500/30 text-mora-400 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-base tracking-tight">{item.title}</h3>
                    <p className="text-slate-400 text-[11px] md:text-sm mt-1">{item.desc}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-[10px] md:text-xs font-black uppercase tracking-widest text-mora-400">
                    Explore APIs →
                  </span>
                </div>
              </Link>
            ))}

            <ApivesAIHighlight />
          </div>
        </div>
      </section>

      {/* ================= UNIVERSAL GRID ================= */}
      <section
        className="pt-4 md:pt-6 pb-6 bg-black"
        style={{ overflow: 'hidden' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">
            <LayoutGrid className="mr-3 text-mora-500" size={18} /> The Universal Grid
          </h2>

          {isLoading ? (
            <SectionLoader text="Loading the Universal Grid" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
              {universalApis.map((api, idx) => (
                <ApiCard
                  key={`${api.id}-${idx}`}
                  api={api}
                  topIds={top3Ids}
                  onLikeChange={updateLandingUpvotes}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Link
              to="/browse"
              className="px-10 py-4 md:px-14 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95"
            >
              Browse All APIs
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FRESH APIS ================= */}
      <section
        className="pt-12 pb-6 md:pt-16 md:pb-12 bg-black border-t border-white/5"
        style={{ overflow: 'hidden' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">
            <Zap className="mr-3 text-white" size={18} /> Fresh APIs
          </h2>

          {isLoading ? (
            <SectionLoader text="Syncing fresh APIs" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
              {freshApis.map((api, idx) => (
                <ApiCard
                  key={`new-${api.id}`}
                  api={api}
                  topIds={top3Ids}
                  onLikeChange={updateLandingUpvotes}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Link
              to="/fresh"
              className="px-10 py-4 md:px-14 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95"
            >
              View New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY FAVORITES ================= */}
      <section
        className="pt-12 pb-6 md:pt-16 md:pb-12 bg-black border-t border-white/5"
        style={{ overflow: 'hidden' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">
            <Heart className="mr-3 text-red-500" size={18} /> Community Favorites
          </h2>

          {isLoading ? (
            <SectionLoader text="Fetching community favorites" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
              {communityApis.map((api, idx) => (
                <ApiCard
                  key={`loved-${api.id}`}
                  api={api}
                  topIds={top3Ids}
                  rankIndex={top3Ids.indexOf(api.id)}
                  onLikeChange={updateLandingUpvotes}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Link
              to="/popular"
              className="px-10 py-4 md:px-14 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all hover:bg-white/10 active:scale-95"
            >
              View Top APIs
            </Link>
          </div>
        </div>
      </section>

<SponsorsSection
  handleSponsorClick={handleSponsorClick}
/>

    </div>
  );
};