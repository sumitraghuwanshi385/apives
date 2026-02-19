import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import { Layers, Radio, ChevronDown, Check } from "lucide-react";

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
   STATIC OPERATIONAL INSIGHT
================================ */

const INSIGHT_DATA = [
  {
    title: "Microsoft Azure OpenAI - Reliability, Quotas & Production Limits",
    url: "https://learn.microsoft.com/en-us/azure/ai-services/openai/overview",
    description:
      "Explains quotas, throttling, retries, monitoring and enterprise-grade usage for real production environments."
  },
  {
    title: "Anthropic — Prompt Engineering & Safety Guardrails",
    url: "https://docs.anthropic.com/claude/docs/prompt-engineering",
    description:
      "Structured prompting, guardrails, and constraints to reduce hallucinations in production chatbots."
  },
  {
    title: "LangSmith — LLM Observability & Tracing",
    url: "https://docs.smith.langchain.com/",
    description:
      "Tracing, latency tracking, debugging and failure monitoring for real chatbot systems."
  }
];

const YOUTUBE_DATA = [
  {
    title: "How ChatGPT Works & What is RAG",
    url: "https://youtu.be/hYZKrPOyEYk"
  },
  {
    title: "Building a Production Chatbot with RAG",
    url: "https://youtu.be/XctooiH0moI"
  },
  {
    title: "Building Reliable AI Systems",
    url: "https://www.youtube.com/watch?v=9vM4p9NN0Ts"
  }
];

export default function BuildChatbots() {
  const admin = isAdmin();

  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD APIs + USECASE
  ============================== */
  useEffect(() => {
    (async () => {
      try {
        const all = await apiService.getAllApis();
        const list = Array.isArray(all) ? all : all?.data || [];
        const normalized = list.map((a: any) => ({ ...a, id: a._id }));
        setAllApis(normalized);

        const uc = await apiService.getUsecaseBySlug("chatbots");

        if (uc?.curatedApiIds) {
          const ids = uc.curatedApiIds.map((a: any) =>
            typeof a === "string" ? a : a._id
          );
          setSelectedIds(ids);
        }
      } catch (err) {
        console.error("Chatbot load failed", err);
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
      await apiService.updateUsecase("chatbots", {
        curatedApiIds: selectedIds
      });
      alert("Selection Saved ✅");
      setDropdownOpen(false);
    } catch (err) {
      alert("Save Failed ❌");
    }
  };

  const curatedApis = allApis.filter(api =>
    selectedIds.includes(api.id)
  );

  /* ===============================
     YOUTUBE PREVIEW FIX
  ============================== */
  const YouTubePreview = ({ url, title }: { url: string; title: string }) => {
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
        className="flex items-center gap-4 bg-green-500/5 border border-green-500/30 rounded-xl p-3 hover:bg-green-500/10 transition"
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          className="w-40 h-24 rounded-lg object-cover"
          loading="lazy"
        />
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-green-300 mt-1">YouTube Video</p>
        </div>
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
          AI Chatbots
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-lg">
          Production-ready conversational AI systems built for real SaaS environments.
        </p>
      </div>
{/* ===== PRODUCTION ARCHITECTURE SECTIONS ===== */}

<div className="max-w-6xl mx-auto mt-10 space-y-10 px-3">  {/* SECTION 1 */}

  <div className="flex flex-col md:flex-row items-center">  
    <div className="md:w-1/2 text-center md:text-left">  
      <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-bold tracking-tight leading-snug bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">  
        Production Architecture Essentials.  
      </h2>  
      <p className="mt-2 text-slate-400 text-sm md:text-[15px] leading-relaxed max-w-[540px] mx-auto md:mx-0">  
        Every serious AI chatbot must handle MVP readiness, scale safety,  
        production reliability, stable latency, predictable token economics,  
        and developer-friendly tooling before going live.  
      </p>  
    </div>  
  </div>  {/* SECTION 2 */}

  <div className="flex flex-col md:flex-row-reverse items-center">  
    <div className="md:w-1/2 text-center md:text-right">  
      <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-bold tracking-tight leading-snug bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">  
        Performance & Cost Intelligence.  
      </h2>  
      <p className="mt-2 text-slate-400 text-sm md:text-[15px] leading-relaxed max-w-[540px] mx-auto md:ml-auto">  
        Modern chatbots are infrastructure systems, not prompts. They require  
        memory orchestration, retries, fallback handling, streaming UX,  
        and disciplined cost controls to maintain predictable latency  
        and long-term profitability.  
      </p>  
    </div>  
  </div>  {/* SECTION 3 */}

  <div className="flex flex-col md:flex-row items-center">  
    <div className="md:w-1/2 text-center md:text-left">  
      <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-bold tracking-tight leading-snug bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">  
        API Selection Defines Success.  
      </h2>  
      <p className="mt-2 text-slate-400 text-sm md:text-[15px] leading-relaxed max-w-[540px] mx-auto md:mx-0">  
        Choosing the right AI API defines scalability, reliability,  
        and long-term system health. Poor decisions introduce hidden  
        costs, unstable latency, and fragile systems that fail  
        under real user load.  
      </p>  
    </div>  
  </div> 
 </div>  
{/* EXTRA SPACE BEFORE OPERATIONAL INSIGHT */}  <div className="mt-12"> 

      {/* OPERATIONAL INSIGHT */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="bg-green-500/5 border border-green-500/30 rounded-2xl p-6 backdrop-blur-xl">

          <p className="text-xs uppercase text-green-400 mb-6 flex items-center gap-2 tracking-widest">
            <Radio size={14} /> Operational Insight
          </p>

          {INSIGHT_DATA.map((item, i) => {
            const domain = new URL(item.url).hostname;
            return (
              <div key={i} className="mb-6">
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
                <p className="text-sm text-slate-300 mt-2">{item.description}</p>
              </div>
            );
          })}

          <div className="space-y-4 mt-10">
            {YOUTUBE_DATA.map((vid, i) => (
              <YouTubePreview key={i} url={vid.url} title={vid.title} />
            ))}
          </div>

          <div className="mt-10 text-sm text-slate-400">
            Building a chatbot that works in production requires operational discipline —
            monitoring, retries, fallback logic, and cost control.
          </div>
        </div>
      </div>
</div>

      {/* CURATED APIS */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={18} className="text-mora-500" />
          <h3 className="text-white font-bold text-lg">
            Curated Chatbot APIs
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-500">
          Loading chatbots...
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {curatedApis.slice(0, visibleCount).map(api => (
              <ApiCard key={api.id} api={api} topIds={[]} />
            ))}
          </div>

          {visibleCount < curatedApis.length && (
            <div className="flex justify-center mb-24">
              <button
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}