import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Heart,
  Activity,
  Zap,
  Hash,
  Server,
  LayoutGrid,
  Image,
  Terminal,
  KeyRound,
  ArrowLeftRight,
  Waypoints,
  Fingerprint
} from 'lucide-react';

import { ApiListing } from '../types';
import { ApivesAIHighlight } from '../components/ApivesAIHighlight';
import LandingApiCard from '../components/LandingApiCard';
import SponsorsSection from "../components/SponsorsSection";

let LANDING_API_CACHE:
  | {
      universal: ApiListing[];
      community: ApiListing[];
    }
  | null = null;

const trackSponsor = (
  sponsor: string,
  type: "impression" | "click"
) => {
  console.log(
    "SPONSOR TRACK FIRED 👉",
    sponsor,
    type
  );

  fetch(
    "https://apives-3xrc.onrender.com/api/sponsor/track",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sponsor: sponsor,
        type: type,
        page: window.location.pathname
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      console.log(
        "✅ Sponsor tracked:",
        data
      );
    })
    .catch(err => {
      console.error(
        "❌ Sponsor track failed:",
        err
      );
    });
};

const handleSponsorClick = (
  sponsor: string,
  baseUrl: string
) => {
  trackSponsor(
    sponsor,
    "click"
  );

  const utmUrl =
    `${baseUrl}?utm_source=apives&utm_medium=sponsor&utm_campaign=apives_api_marketplace`;

  window.open(
    utmUrl,
    "_blank",
    "noopener,noreferrer"
  );
};

/* SECTION LOADER */

const SectionLoader: React.FC<{
  text: string;
}> = ({ text }) => (
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

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [
    isAuthenticated,
    setIsAuthenticated
  ] = useState(false);

  const [
    userName,
    setUserName
  ] = useState('');

  const [
    universalApis,
    setUniversalApis
  ] = useState<ApiListing[]>([]);

  const [
    communityApis,
    setCommunityApis
  ] = useState<ApiListing[]>([]);

  const [
    top3Ids,
    setTop3Ids
  ] = useState<string[]>([]);

  const [
    isLoading,
    setIsLoading
  ] = useState(true);

  const [
    isMobile,
    setIsMobile
  ] = useState(
    typeof window !== 'undefined' &&
      window.innerWidth < 768
  );

  useEffect(() => {
    trackSponsor(
      "serpapi",
      "impression"
    );

    trackSponsor(
      "scoutpanels",
      "impression"
    );

    let rafId: number;

    const handleResize = () => {
      cancelAnimationFrame(
        rafId
      );

      rafId =
        requestAnimationFrame(
          () =>
            setIsMobile(
              window.innerWidth < 768
            )
        );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    const user =
      localStorage.getItem(
        "mora_user"
      );

    if (user) {
      try {
        setIsAuthenticated(
          true
        );

        setUserName(
          JSON.parse(user).name ||
            "Builder"
        );
      } catch (e) {
        // ignore parse errors
      }
    }

    let isMounted = true;

    (async () => {
      try {
        if (LANDING_API_CACHE) {
          if (isMounted) {
            setUniversalApis(
              LANDING_API_CACHE.universal
            );

            setCommunityApis(
              LANDING_API_CACHE.community
            );

            setTop3Ids(
              [...LANDING_API_CACHE.community]
                .sort(
                  (a, b) =>
                    (b.upvotes || 0) -
                    (a.upvotes || 0)
                )
                .slice(0, 3)
                .map(
                  a => a.id
                )
            );

            setIsLoading(
              false
            );
          }

          return;
        }

        const res =
          await fetch(
            "https://apives-3xrc.onrender.com/api/landing"
          );

        const data =
          await res.json();

        const normalize = (
          arr: any[]
        ) =>
          arr.map(
            (a: any) => ({
              ...a,
              id: a._id,
              publishedAt:
                a.createdAt,
              tags:
                Array.isArray(
                  a.tags
                )
                  ? a.tags
                  : [],
              features:
                Array.isArray(
                  a.features
                )
                  ? a.features
                  : []
            })
          );

        const universal =
          normalize(
            data.universal ||
              []
          );

        const community =
          normalize(
            data.community ||
              []
          );

        LANDING_API_CACHE = {
          universal,
          community
        };

        if (isMounted) {
          setUniversalApis(
            universal
          );

          setCommunityApis(
            community
          );

          setTop3Ids(
            [...community]
              .sort(
                (a, b) =>
                  (b.upvotes || 0) -
                  (a.upvotes || 0)
              )
              .slice(0, 3)
              .map(
                a => a.id
              )
          );

          setIsLoading(
            false
          );
        }
      } catch (e) {
        console.error(
          "LandingPage fetch failed",
          e
        );

        if (isMounted) {
          setIsLoading(
            false
          );
        }
      }
    })();

    return () => {
      isMounted = false;

      window.removeEventListener(
        "resize",
        handleResize
      );

      cancelAnimationFrame(
        rafId
      );
    };
  }, []);

  const updateLandingUpvotes = (
    apiId: string,
    delta: number
  ) => {
    const update = (
      list: ApiListing[]
    ) =>
      list.map(api =>
        api.id === apiId
          ? {
              ...api,
              upvotes:
                Math.max(
                  (api.upvotes || 0) +
                    delta,
                  0
                )
            }
          : api
      );

    setUniversalApis(
      prev =>
        update(prev)
    );

    setCommunityApis(
      prev =>
        update(prev)
    );
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-black text-slate-100 selection:bg-mora-500/30"
      style={{
        overflowX: 'hidden',
        maxWidth: '100%'
      }}
    >

      {/* HERO */}

      <section
        className="relative pt-24 md:pt-36 pb-8 md:pb-12"
        style={{
          overflow: 'hidden',
          contain: 'layout paint'
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            overflow: 'hidden'
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

          <h1 className="text-3xl md:text-8xl font-display font-bold text-white tracking-tighter mb-4 md:mb-8 leading-[1] animate-slide-up">
            {isAuthenticated ? (
              <>
                Welcome,{" "}
                <span className="text-mora-500">
                  {userName}
                </span>.
              </>
            ) : (
              <>
                Discover APIs.{" "}
                <br />
                <span className="text-mora-500">
                  Deploy Potential.
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto mt-4 font-light leading-relaxed animate-fade-in opacity-80">
            {isAuthenticated
              ? 'The grid is operational. Discover and integrate verified endpoint protocols.'
              : 'Apives curates APIs with clear pricing, stability, access types, and real endpoint examples. This helps developers avoid guesswork caused by incomplete docs or outdated GitHub repositories.'}
          </p>

          <div className="flex flex-row justify-center gap-2.5 sm:gap-4 mt-6 md:mt-8">

            <Link
              to="/browse"
              className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 text-[10px] sm:text-[11px] md:text-xs font-black text-black bg-mora-500 rounded-full transition-all hover:scale-105 hover:bg-white shadow-[0_0_25px_rgba(34,197,94,0.25)] active:scale-95 uppercase tracking-widest whitespace-nowrap"
            >
              Explore APIs
            </Link>

            <Link
              to="/submit"
              className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 text-[10px] sm:text-[11px] md:text-xs font-black text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest whitespace-nowrap"
            >
              Submit API
            </Link>

          </div>
        </div>
      </section>

      {/* DEVELOPER TOOLS — Compact Clean Section */}

      <section className="py-10 md:py-12 border-t border-white/5 bg-black">
        <div className="max-w-3xl mx-auto px-4 md:px-6">

          <div
            className="relative rounded-2xl border border-white/10 overflow-hidden px-5 py-6 md:px-8 md:py-7"
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dp7avkarg/image/upload/v1786812401/fede8efd99a6b9de59708b62fc2446c1_l6qtqb.gif)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >

            {/* Top-right glass liquid fingerprint button */}
            <Link
              to="/login"
              className="absolute top-3.5 right-3.5 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(18px) saturate(180%)',
                WebkitBackdropFilter: 'blur(18px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)'
              }}
            >
              <Fingerprint size={18} className="text-white drop-shadow-sm" strokeWidth={1.75} />
            </Link>

            <div className="relative z-10 pr-12">
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1.5">
                  Developer Toolkit
                </p>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-sm">
                  4 Tools. Login to unlock.
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-[11px] text-white font-medium">
                  <Terminal size={12} className="text-mora-400" />
                  Live API Runner
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-[11px] text-white font-medium">
                  <KeyRound size={12} className="text-mora-400" />
                  JWT Decoder
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-[11px] text-white font-medium">
                  <ArrowLeftRight size={12} className="text-mora-400" />
                  cURL Converter
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-[11px] text-white font-medium">
                  <Waypoints size={12} className="text-mora-400" />
                  Mock Server
                </span>
              </div>

              <p className="mt-4 text-[11px] text-white/75 leading-relaxed drop-shadow-sm">
                Sign in to test endpoints, decode tokens, convert requests and spin up mock APIs — all in one place.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WHAT ARE YOU BUILDING TODAY */}

      <section
        className="py-10 md:py-16 bg-black border-t border-white/5"
        style={{
          overflow: 'hidden',
          contain: 'layout paint',
          position: 'relative'
        }}
      >

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
              {
                title: "AI Chatbots",
                desc: "LLMs, chat, assistants",
                icon: Zap,
                link: "/build/chatbots"
              },
              {
                title: "Voice to Text",
                desc: "Speech recognition APIs",
                icon: Activity,
                link: "/build/voice"
              },
              {
                title: "Image Generation",
                desc: "Text → Image models",
                icon: Image,
                link: "/build/image-generation"
              },
              {
                title: "Payments",
                desc: "Billing & subscriptions",
                icon: Server,
                link: "/build/payments"
              },
              {
                title: "Authentication",
                desc: "Login, OTP, identity",
                icon: Hash,
                link: "/build/authentication"
              },
              {
                title: "Analytics",
                desc: "Tracking & insights",
                icon: TrendingUp,
                link: "/build/analytics"
              }
            ].map(
              (
                item,
                i
              ) => (
                <Link
                  key={i}
                  to={item.link}
                  className="group relative bg-dark-900/50 hover:bg-dark-900/80 border border-white/10 hover:border-mora-500/40 rounded-2xl p-4 md:p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                  style={{
                    contain: 'layout paint',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-mora-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="relative z-10 flex flex-col gap-3">

                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-mora-500/10 border border-mora-500/30 text-mora-400 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                      <item.icon
                        size={22}
                      />
                    </div>

                    <div>

                      <h3 className="text-white font-bold text-sm md:text-base tracking-tight">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-[11px] md:text-sm mt-1">
                        {item.desc}
                      </p>

                    </div>

                    <span className="mt-auto inline-flex items-center gap-1 text-[10px] md:text-xs font-black uppercase tracking-widest text-mora-400">
                      Explore APIs →
                    </span>

                  </div>

                </Link>
              )
            )}

            {/* Apives AI — full width, no green glow */}

            <div className="apives-ai-static col-span-2">
              <ApivesAIHighlight />
            </div>

          </div>
        </div>
      </section>

      {/* LISTED APIs */}

      <section
        className="pt-4 md:pt-6 pb-6 bg-black"
        style={{
          overflow: 'hidden'
        }}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-[14px] md:text-[19px] font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">

            <LayoutGrid
              className="mr-2.5 text-mora-500"
              size={14}
            />

            Listed APIs

          </h2>

          {isLoading ? (
            <SectionLoader text="Loading Listed APIs" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">

              {universalApis
                .slice(0, 15)
                .map(
                  (
                    api,
                    idx
                  ) => (
                    <LandingApiCard
                      key={`\( {api.id}- \){idx}`}
                      api={api}
                      topIds={top3Ids}
                      onLikeChange={
                        updateLandingUpvotes
                      }
                    />
                  )
                )}

            </div>
          )}

          <div className="flex justify-center">

            <Link
              to="/browse"
              className="px-7 py-3 md:px-10 md:py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95"
            >
              Browse All APIs
            </Link>

          </div>

        </div>
      </section>

      {/* COMMUNITY FAVORITES */}

      <section
        className="pt-12 pb-6 md:pt-16 md:pb-12 bg-black border-t border-white/5"
        style={{
          overflow: 'hidden'
        }}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-[14px] md:text-[19px] font-display font-bold text-white flex items-center mb-10 md:mb-16 uppercase tracking-widest">

            <Heart
              className="mr-2.5 text-red-500"
              size={14}
            />

            Community Favorites

          </h2>

          {isLoading ? (
            <SectionLoader text="Fetching community favorites" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">

              {communityApis.map(
                (
                  api,
                  idx
                ) => (
                  <LandingApiCard
                    key={`loved-${api.id}`}
                    api={api}
                    topIds={top3Ids}
                    rankIndex={
                      top3Ids.indexOf(
                        api.id
                      )
                    }
                    onLikeChange={
                      updateLandingUpvotes
                    }
                  />
                )
              )}

            </div>
          )}

          <div className="flex justify-center">

            <Link
              to="/popular"
              className="px-7 py-3 md:px-10 md:py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-white/10 active:scale-95"
            >
              View Top APIs
            </Link>

          </div>

        </div>
      </section>

      <SponsorsSection
        handleSponsorClick={
          handleSponsorClick
        }
      />

      <style>{`
        /*
          Keep the Apives AI card visually static.
          This only affects the AI highlight component,
          not the rest of the landing page.
        */

        .apives-ai-static {
          animation: none !important;
        }

        .apives-ai-static *,
        .apives-ai-static *::before,
        .apives-ai-static *::after {
          animation: none !important;
        }

        .apives-ai-static::before,
        .apives-ai-static::after {
          animation: none !important;
          opacity: 0 !important;
        }

        /* Fully kill green glow / background effects from the AI box */
        .apives-ai-static,
        .apives-ai-static * {
          box-shadow: none !important;
          filter: none !important;
        }

        .apives-ai-static [class*="mora"],
        .apives-ai-static [class*="green"],
        .apives-ai-static [style*="34,197,94"],
        .apives-ai-static [style*="rgba(34"],
        .apives-ai-static [style*="rgb(34"] {
          background-image: none !important;
          box-shadow: none !important;
        }
      `}</style>

    </div>
  );
};