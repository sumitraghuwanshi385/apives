import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import {
  ChevronDown,
  Check,
  Layers,
  Radio
} from "lucide-react";

/* ===============================
   ADMIN CHECK
================================ */
const isAdmin = () => {
  try {
    const u = JSON.parse(localStorage.getItem("mora_user") || "null");
    return u?.email === "beatslevelone@gmail.com";
  } catch {
    return false;
  }
};

/* ===============================
   STATIC INSIGHT DATA
================================ */

const INSIGHT_LINKS = [
  {
    title: "Google Analytics 4 – Event Architecture",
    url: "https://support.google.com/analytics/answer/10089681",
    description:
      "Explains modern event-driven analytics design including event schema modeling and structured tracking."
  },
  {
    title: "Segment – Event Tracking Best Practices",
    url: "https://segment.com/docs/connections/spec/",
    description:
      "Covers standardized event naming, property structures, and scalable ingestion pipelines."
  },
  {
    title: "Mixpanel – Product Analytics Guide",
    url: "https://mixpanel.com/blog/product-analytics-guide/",
    description:
      "Deep dive into behavioral tracking, funnels, retention metrics, and cohort analysis."
  }
];

const YOUTUBE_DATA = [
  {
    title: "FastAPI Python Tutorial: Build an Analytics API from Scratch",
    url: "https://youtu.be/tiBeLLv5GJo",
    description:
      "A complete hands-on tutorial on building an analytics API using Python FastAPI, PostgreSQL and time-series techniques — including Docker deployment and real data ingestion patterns." // based on LinkedIn summary & video topic
  },
  {
    title: "Build and Deploy Full Stack Project Management App (React + PERN)",
    url: "https://youtu.be/50NN3d-Ne1U",
    description:
      "Shows how to build a real-world project management app using React, Express, PostgreSQL and Node, covering full stack routing, databases, auth and deployment." // based on video subject classification
  },
  {
    title: "Conversational Analytics Agent Part 1 — Conversational Analytics API",
    url: "https://youtu.be/0cdVlGJk2NQ",
    description:
      "Introduces building a conversational analytics agent that can query data using natural language and analytics APIs, turning insight requests into real SQL/data retrieval workflows." // based on context about conversational analytics APIs
  }
];

export default function BuildAnalytics() {
  const admin = isAdmin();

  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FAST LOAD (IDS BASED)
  ============================== */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const uc = await apiService.getUsecaseBySlug("analytics");

        if (uc?.curatedApiIds?.length) {
          const ids = uc.curatedApiIds.map((a: any) =>
            typeof a === "string" ? a : a._id
          );

          setSelectedIds(ids);

          const res = await fetch(
            `https://apives.onrender.com/api/apis?ids=${ids.join(",")}`
          ).then(r => r.json());

          const normalized = res.apis.map((a: any) => ({
            ...a,
            id: a._id
          }));

          setAllApis(normalized);
        }

      } catch (err) {
        console.error("Analytics load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ===============================
     SAVE SELECTION
  ============================== */
  const saveSelection = async () => {
    try {
      await apiService.updateUsecase("analytics", {
        curatedApiIds: selectedIds
      });
      alert("Selection Saved ✅");
      setDropdownOpen(false);
    } catch {
      alert("Save Failed ❌");
    }
  };

  /* ===============================
     YOUTUBE PREVIEW
  ============================== */
  const YouTubePreview = ({
    url,
    title,
    description
  }: {
    url: string;
    title: string;
    description: string;
  }) => {
    let videoId = "";

    try {
      if (url.includes("watch")) {
        videoId = new URL(url).searchParams.get("v") || "";
      } else {
        videoId = url.split("/").pop() || "";
      }
    } catch {
      return null;
    }

    if (!videoId) return null;

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col bg-green-500/5 border border-green-500/30 rounded-xl p-4 hover:bg-green-500/10 transition"
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          className="w-full h-40 object-cover rounded-lg mb-3"
          loading="lazy"
          alt=""
        />
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 md:px-8">

      <div className="max-w-7xl mx-auto mb-6 flex justify-between">
        <BackButton />

        {admin && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="px-4 py-2 bg-white/10 rounded-full text-xs uppercase flex items-center gap-2"
            >
              Select APIs <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-black border border-white/10 rounded-xl p-3 z-50 max-h-80 overflow-y-auto">

                {allApis.map(api => (
                  <button
                    key={api.id}
                    onClick={() =>
                      setSelectedIds(prev =>
                        prev.includes(api.id)
                          ? prev.filter(x => x !== api.id)
                          : [...prev, api.id]
                      )
                    }
                    className={`w-full flex justify-between px-3 py-2 rounded-lg text-xs ${
                      selectedIds.includes(api.id)
                        ? "bg-mora-500 text-black"
                        : "hover:bg-white/5 text-gray-400"
                    }`}
                  >
                    {api.name}
                    {selectedIds.includes(api.id) && <Check size={14} />}
                  </button>
                ))}

                <button
                  onClick={saveSelection}
                  className="w-full mt-3 bg-mora-500 text-black py-2 rounded-full text-xs font-bold"
                >
                  Save Selection
                </button>

              </div>
            )}
          </div>
        )}
      </div>

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-6xl font-display font-bold">
          Analytics Infrastructure
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-lg">
          Production-grade analytics and tracking systems for real SaaS environments.
        </p>
      </div>

{/* ===== ARCHITECTURE SECTIONS ===== */}

  <div className="max-w-6xl mx-auto mt-10 space-y-10 px-3">    <div className="md:w-1/2 text-center md:text-left">    
  <h2 className="text-[22px] md:text-[28px] font-bold    
    bg-gradient-to-r from-green-400 to-emerald-400    
    bg-clip-text text-transparent">    
    Analytics Architecture Essentials.    
  </h2>    
  <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] max-w-[540px]">    
    Analytics systems must handle event ingestion,    
    schema consistency, real-time aggregation,    
    and reliable data pipelines.    
  </p>    
</div>    

<div className="md:w-1/2 text-center md:text-right ml-auto">    
  <h2 className="text-[22px] md:text-[28px] font-bold    
    bg-gradient-to-r from-purple-400 to-pink-400    
    bg-clip-text text-transparent">    
    Accuracy, Latency & Cost Tradeoffs.    
  </h2>    
  <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] max-w-[540px] ml-auto">    
    Analytics APIs must balance event accuracy,    
    ingestion latency, data retention,    
    and predictable pricing at scale.    
  </p>    
</div>    

<div className="md:w-1/2 text-center md:text-left">    
  <h2 className="text-[22px] md:text-[28px] font-bold    
    bg-gradient-to-r from-blue-400 to-cyan-400    
    bg-clip-text text-transparent">    
    API Choice Defines Product Insight.    
  </h2>    
  <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] max-w-[540px]">    
    The right analytics API determines insight quality,    
    decision speed, experimentation velocity,    
    and long-term data trust.    
  </p>    
</div>

  </div>  
{/* EXTRA SPACE BEFORE OPERATIONAL INSIGHT */}  <div className="mt-12"> 

      {/* OPERATIONAL INSIGHT */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-green-500/5 border border-green-500/30 rounded-2xl p-6 backdrop-blur-xl">

          <p className="text-xs uppercase text-green-400 mb-8 flex items-center gap-2 tracking-widest">
            <Radio size={14} /> Operational Insight
          </p>

          {INSIGHT_LINKS.map((item, i) => {
            const domain = new URL(item.url).hostname;

            return (
              <div key={i} className="mb-8">
                <h4 className="text-white font-semibold text-sm mb-3">
                  {item.title}
                </h4>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-300 hover:bg-green-500/20 transition"
                >
                  <img
                    src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}`}
                    className="w-4 h-4 rounded-full bg-white"
                    alt=""
                  />
                  {domain}
                </a>

                <p className="text-sm text-slate-400 mt-3">
                  {item.description}
                </p>
              </div>
            );
          })}

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {YOUTUBE_DATA.map((vid, i) => (
              <YouTubePreview
                key={i}
                url={vid.url}
                title={vid.title}
                description={vid.description}
              />
            ))}
          </div>

          <div className="mt-12 border-t border-green-500/20 pt-6">
            <h4 className="text-green-400 font-semibold mb-3">
              Why This Matters
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed space-y-3">
              Analytics systems power decision-making across product, marketing,
              and growth teams.

              <br /><br />

              Poor tracking architecture leads to misleading dashboards,
              broken funnels, and unreliable metrics that distort strategy.

              <br /><br />

              Production-ready analytics requires schema governance,
              ingestion reliability, data validation, monitoring,
              and long-term data consistency.
            </p>
          </div>

        </div>
      </div>
</div>

      {/* CURATED APIS */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={18} className="text-mora-500" />
          <h3 className="text-white font-bold text-lg">
            Curated Analytics APIs
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {allApis.map(api => (
            <ApiCard key={api.id} api={api} topIds={[]} />
          ))}
        </div>
      )}
    </div>
  );
}