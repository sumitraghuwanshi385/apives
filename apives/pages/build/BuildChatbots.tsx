import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import {
  ChevronDown,
  Check,
  Bot,
  Zap,
  Radio
} from "lucide-react";

const STORAGE_KEY = "apives_usecase_chatbots";
const NOTE_KEY = "apives_chatbot_global_note";
const CHATBOT_KEYWORDS = ["chat", "llm", "assistant", "ai", "conversation"];

const isAdmin = () => {
  try {
    const u = JSON.parse(localStorage.getItem("mora_user") || "null");
    return u?.email === "beatslevelone@gmail.com";
  } catch {
    return false;
  }
};

/* ===============================
   LOADER
================================ */
const ChatbotLoader = () => (
  <div className="flex flex-col items-center justify-center mt-24 mb-32 gap-3">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border border-mora-500/30 animate-ping" />
      <div className="absolute inset-0 rounded-full border border-mora-500 border-t-transparent animate-spin" />
    </div>
    <p className="text-xs tracking-widest text-slate-400">
      Loading chatbots…
    </p>
  </div>
);


const YouTubePreview = ({ url }: { url: string }) => {
  let videoId = "";

  try {
    videoId = url.includes("watch")
      ? new URL(url).searchParams.get("v") || ""
      : url.split("/").pop() || "";
  } catch {
    return null;
  }

  if (!videoId) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden
      bg-black/40 border border-white/10
      hover:border-red-500/40 hover:bg-red-500/5
      transition-all duration-300"
    >
      <div className="relative">
        {/* Thumbnail */}
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          className="w-full h-44 object-cover"
          loading="lazy"
        />

        {/* ▶️ Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full
            bg-black/60 border border-white/30
            flex items-center justify-center
            group-hover:scale-110 transition"
          >
            <span className="text-white text-xl ml-1">▶</span>
          </div>
        </div>

        {/* ⏱️ Duration badge (UI only) */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md
          bg-black/70 text-[10px] text-white tracking-wide">
          VIDEO
        </div>
      </div>

      {/* Footer */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white line-clamp-2">
          Watch on YouTube
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Click to open full video
        </p>
      </div>
    </a>
  );
};

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden
      bg-white/5 border border-white/10 backdrop-blur-md
      hover:bg-white/10 transition"
    >
      <div className="flex">
        <img
          src={meta.thumbnail_url}
          className="w-40 h-24 object-cover"
        />
        <div className="p-4 flex flex-col justify-center">
          <p className="text-white text-sm font-semibold line-clamp-2">
            {meta.title}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {meta.author_name}
          </p>
        </div>
      </div>
    </a>
  );
};

const InsightRenderer = ({ text }: { text: string }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const youtubeRegex =
    /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^\s]+)/;

  const paragraphs = text.split("\n");

  return (
    <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
      {paragraphs.map((para, i) => {
        if (!para.trim()) {
          return <div key={i} className="h-4" />;
        }

        const urls = para.match(urlRegex);

        // No URLs → normal paragraph
        if (!urls) {
          return <p key={i}>{para}</p>;
        }

        return (
          <div key={i} className="space-y-3">
            {/* Text without URLs */}
            <p>{para.replace(urlRegex, "").trim()}</p>

            {/* Render detected URLs */}
            {urls.map((url, idx) => {

  // ✅ YouTube link → preview component
  if (youtubeRegex.test(url)) {
    return <YouTubePreview key={idx} url={url} />;
  }

  // ✅ Normal website → glass pill
  const domain = new URL(url).hostname.replace("www.", "");
  const label = domain.includes("apives") ? "Apives" : domain;

  return (
    <a
      key={idx}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-5 py-2 rounded-full
      bg-white/10 border border-white/20
      backdrop-blur-md text-xs text-slate-200
      hover:bg-white/20 transition"
    >
      {label}
    </a>
  );
})}
          </div>
        );
      })}
    </div>
  );
};

export default function BuildChatbots() {
  const admin = isAdmin();

  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [note, setNote] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getAllApis();
        const list = Array.isArray(res) ? res : res?.data || [];
        const db = list.map(a => ({ ...a, id: a._id }));
        setAllApis(db);
      } catch (e) {
        console.error("Chatbot API fetch failed", e);
      } finally {
        setLoading(false);
      }
    })();

    // ✅ FIX: ALWAYS load curated APIs (logout ke baad bhi)
    setSelectedIds(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

    const savedNote = localStorage.getItem(NOTE_KEY);
    if (savedNote) {
      setNote(savedNote);
      setNoteDraft(savedNote);
    }
  }, []);

  const toggleApi = (id: string) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSelectedIds(updated);
  };

  const chatbotApis = allApis.filter(api => {
    const text = `${api.name} ${api.description || ""}`.toLowerCase();
    return CHATBOT_KEYWORDS.some(k => text.includes(k));
  });

  // ✅ Public + admin both see curated APIs
  const visibleApis = chatbotApis.filter(api =>
    selectedIds.includes(api.id)
  );

  const saveNote = () => {
    localStorage.setItem(NOTE_KEY, noteDraft);
    setNote(noteDraft);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 pt-20 px-4 md:px-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <BackButton />

        {admin && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full
              bg-white/5 border border-white/10
              text-xs font-black uppercase tracking-widest"
            >
              Select APIs <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto
                bg-black border border-white/10 rounded-2xl p-2 z-50">
                {chatbotApis.map(api => (
                  <button
                    key={api.id}
                    onClick={() => toggleApi(api.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                      selectedIds.includes(api.id)
                        ? "bg-mora-500 text-black"
                        : "text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    {api.name}
                    {selectedIds.includes(api.id) && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* HERO */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-6xl font-display font-bold text-white">
          AI Chatbots
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-lg">
          Production-ready conversational AI systems built for real SaaS environments.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto mb-10 grid md:grid-cols-3 gap-4">

        {/* UNDERSTAND CHATBOT AI */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Zap size={16} className="text-mora-500" />
            Understand Chatbot AI
          </h3>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <p className="font-bold text-green-400 mb-1">MVP Ready</p>
              <p className="text-slate-300">
                Fast prototyping, instant auth, minimal setup, and early traction readiness.
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
              <p className="font-bold text-purple-400 mb-1">Scale Safe</p>
              <p className="text-slate-300">
                Designed for burst traffic, queue stability, and predictable rate limits.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <p className="font-bold text-blue-400 mb-1">Production Grade</p>
              <p className="text-slate-300">
                SLA confidence, versioning discipline, and long-context reliability.
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
              <p className="font-bold text-yellow-400 mb-1">Latency Stable</p>
              <p className="text-slate-300">
                Predictable response times across regions and concurrent workloads.
              </p>
            </div>

            <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-3">
              <p className="font-bold text-pink-400 mb-1">Cost Predictable</p>
              <p className="text-slate-300">
                Transparent pricing models with controllable token economics.
              </p>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3">
              <p className="font-bold text-cyan-400 mb-1">Dev Friendly</p>
              <p className="text-slate-300">
                Clean docs, SDKs, error clarity, and fast debugging loops.
              </p>
            </div>

          </div>
        </div>

        {/* SMART CHATBOT SYSTEMS */}
        <div className="bg-gradient-to-br from-mora-500/10 to-transparent border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={16} className="text-mora-500" />
            <p className="text-white font-bold text-sm">
              Smart Chatbot Systems
            </p>
          </div>

          <p className="text-[12px] text-slate-400 leading-relaxed">
            Modern chatbots are systems, not prompts.
          </p>
          <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
            They require memory orchestration, retry strategies,
            and fallback logic for unpredictable user behavior.
          </p>
          <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
            Cost controls, latency guarantees, and streaming UX
            directly impact retention and trust.
          </p>
          <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
            Choosing the right API determines scalability,
            reliability, and long-term system health.
          </p>
        </div>

      </div>

      {/* OPERATIONAL INSIGHT */}
      {(note || admin) && (
        <div className="max-w-5xl mx-auto mb-14">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 mb-2">
              <Radio size={14} className="text-mora-500" />
              Operational Insight
            </p>

            {admin ? (
              <>
                <textarea
                  value={noteDraft}
                  onChange={e => setNoteDraft(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white mb-3"
                  rows={3}
                />
                <button
                  onClick={saveNote}
                  className="px-4 py-2 rounded-full bg-mora-500 text-black text-xs font-black uppercase tracking-widest"
                >
                  Update
                </button>
              </>
            ) : (
              <InsightRenderer text={note} />
            )}
          </div>
        </div>
      )}

      {/* API CARDS */}
      {loading ? (
        <ChatbotLoader />
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleApis.map(api => (
            <ApiCard key={api.id} api={api} topIds={[]} />
          ))}
        </div>
      )}

      {!loading && visibleApis.length === 0 && (
        <p className="text-center text-slate-500 mt-16 text-sm">
          No chatbot APIs selected yet.
        </p>
      )}
    </div>
  );
}