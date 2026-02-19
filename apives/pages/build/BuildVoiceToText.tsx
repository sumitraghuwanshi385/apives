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
   OFFICIAL DOCUMENTATION
================================ */

const INSIGHT_LINKS = [
  {
    title: "OpenAI — Speech-to-Text (Whisper API)",
    url: "https://platform.openai.com/docs/guides/speech-to-text",
    description:
      "Production-grade Whisper transcription including streaming, file uploads and model constraints."
  },
  {
    title: "Google Cloud Speech-to-Text",
    url: "https://cloud.google.com/speech-to-text/docs",
    description:
      "Covers streaming recognition, diarization, multilingual support and scalable deployment."
  },
  {
    title: "Deepgram — Real-Time Transcription",
    url: "https://developers.deepgram.com/docs",
    description:
      "Low-latency streaming via WebSockets, noisy audio handling and scalable STT workloads."
  },
  {
    title: "AssemblyAI — Streaming & Webhooks",
    url: "https://www.assemblyai.com/docs",
    description:
      "Real-time transcription, speaker labels, summarization and webhook pipelines."
  }
];

const YOUTUBE_DATA = [
  {
    title: "Best Free Speech-To-Text APIs",
    url: "https://youtu.be/83-oicTOL70",
    description:
      "Comparison of open-source and commercial STT APIs and their real-world tradeoffs."
  },
  {
    title: "Voice to Text Converter (JavaScript)",
    url: "https://youtu.be/SFGIKucaOZA",
    description:
      "Frontend microphone capture and live transcription using Web Speech API."
  },
  {
    title: "OpenAI Whisper Demo (Python)",
    url: "https://youtu.be/HbY51mVKrcE",
    description:
      "Backend speech-to-text workflow using Whisper with multilingual support."
  },
  {
    title: "Super Fast Real-Time Speech Transcription",
    url: "https://youtu.be/k6nIxWGdrS4",
    description:
      "Streaming pipelines, buffering strategies and near-zero latency transcription."
  }
];

export default function BuildVoiceToText() {
  const admin = isAdmin();

  const [curatedApis, setCuratedApis] = useState<ApiListing[]>([]);
const [allApis, setAllApis] = useState<ApiListing[]>([]);
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [loading, setLoading] = useState(true);

  /* ===============================
     FAST LOAD (Parallel)
  ============================== */
  useEffect(() => {
  (async () => {
    try {
      const usecaseRes = await apiService.getUsecaseBySlug("voice-to-text");

      const ids =
        usecaseRes?.curatedApiIds?.map((a: any) =>
          typeof a === "string" ? a : a._id
        ) || [];

      setSelectedIds(ids);

      if (ids.length > 0) {
        const res = await fetch(
          `https://apives.onrender.com/api/apis?ids=${ids.join(",")}`
        ).then(r => r.json());

        const list = res?.apis || [];

        const normalized = list.map((a: any) => ({
          ...a,
          id: a._id
        }));

        setCuratedApis(normalized);
      } else {
        setCuratedApis([]);
      }

    } catch (err) {
      console.error("Voice-to-Text load failed", err);
    } finally {
      setLoading(false);
    }
  })();
}, []);

useEffect(() => {
  if (!dropdownOpen || !admin) return;

  (async () => {
    try {
      const res = await fetch(
        "https://apives.onrender.com/api/apis?page=1&limit=500&includePaused=true"
      ).then(r => r.json());

      const list = res?.apis || [];

      const normalized = list.map((a: any) => ({
        ...a,
        id: a._id
      }));

      setAllApis(normalized);

    } catch (err) {
      console.error("Admin full fetch failed", err);
    }
  })();
}, [dropdownOpen, admin]);

  /* ===============================
     SAVE CURATED
  ============================== */
  const saveSelection = async () => {
    try {
      await apiService.updateUsecase("voice-to-text", {
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
          Voice to Text Infrastructure
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-lg">
          Real-time speech recognition systems for scalable production workloads.
        </p>
      </div>
{/* ===== ARCHITECTURE SECTIONS ===== */}

  <div className="max-w-6xl mx-auto mt-10 space-y-10 px-3">    <div className="flex flex-col md:flex-row items-center">    
  <div className="md:w-1/2 text-center md:text-left">    
    <h2 className="text-[22px] md:text-[28px] font-bold tracking-tight leading-snug    
      bg-gradient-to-r from-green-400 to-emerald-400    
      bg-clip-text text-transparent">    
      Speech Architecture Essentials.    
    </h2>    

    <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] leading-relaxed max-w-[540px] mx-auto md:mx-0">    
      Reliable speech systems must handle streaming ingestion,    
      real-time decoding, multilingual support, speaker separation,    
      and production-grade scaling before going live.    
    </p>    
  </div>    
</div>    

<div className="flex flex-col md:flex-row-reverse items-center">    
  <div className="md:w-1/2 text-center md:text-right">    
    <h2 className="text-[22px] md:text-[28px] font-bold tracking-tight leading-snug    
      bg-gradient-to-r from-purple-400 to-pink-400    
      bg-clip-text text-transparent">    
      Accuracy, Latency & Cost Intelligence.    
    </h2>    

    <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] leading-relaxed max-w-[540px] mx-auto md:ml-auto">    
      Speech APIs must balance word accuracy, low-latency streaming,    
      background noise handling, and predictable pricing models    
      for scalable production systems.    
    </p>    
  </div>    
</div>    

<div className="flex flex-col md:flex-row items-center">    
  <div className="md:w-1/2 text-center md:text-left">    
    <h2 className="text-[22px] md:text-[28px] font-bold tracking-tight leading-snug    
      bg-gradient-to-r from-blue-400 to-cyan-400    
      bg-clip-text text-transparent">    
      API Selection Defines Transcription Quality.    
    </h2>    

    <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] leading-relaxed max-w-[540px] mx-auto md:mx-0">    
      The right speech API determines recognition precision,    
      language coverage, diarization support, and system stability.    
      Poor choices result in transcription errors and rising costs.    
    </p>    
  </div>    
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
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
              Speech-to-Text systems are real-time infrastructure — not simple file converters.

              <br /><br />

              Production deployments must handle streaming ingestion,
              audio chunking, network jitter, multilingual input and speaker diarization.

              <br /><br />

              Most failures happen due to latency spikes, noisy audio environments
              or improper streaming handling. Teams that treat speech systems
              as distributed real-time pipelines — with monitoring, retries
              and cost controls — build scalable voice products that actually work.
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
            Curated Speech APIs
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
          {curatedApis.map(api => (
            <ApiCard key={api.id} api={api} topIds={[]} />
          ))}
        </div>
      )}
    </div>
  );
}