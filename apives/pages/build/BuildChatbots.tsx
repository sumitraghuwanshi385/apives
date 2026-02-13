import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import {
  ChevronDown,
  Check,
  Bot,
  Zap
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

  const visibleApis = admin
    ? chatbotApis.filter(api => selectedIds.includes(api.id))
    : chatbotApis;

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

            {/* MVP GREEN */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <p className="font-bold text-green-400 mb-1">MVP Ready</p>
              <p className="text-slate-300 leading-relaxed">
                Rapid integration APIs designed for immediate prototyping,
                minimal authentication overhead, and predictable early-stage deployments.
              </p>
            </div>

            {/* SCALE PURPLE */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
              <p className="font-bold text-purple-400 mb-1">Scale Safe</p>
              <p className="text-slate-300 leading-relaxed">
                Architected for concurrency bursts, controlled rate limits,
                stable streaming pipelines, and resilient backend orchestration.
              </p>
            </div>

            {/* PRODUCTION BLUE */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <p className="font-bold text-blue-400 mb-1">Production Grade</p>
              <p className="text-slate-300 leading-relaxed">
                Long-context stability, structured output reliability,
                versioning discipline, and uptime confidence for revenue-critical systems.
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
            Modern chatbot systems require memory orchestration,
            multi-step reasoning control, fallback logic, and intelligent retries.
          </p>

          <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
            They must handle token budgeting, streaming UX expectations,
            structured outputs, and latency sensitivity under real users.
          </p>

          <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
            Selecting the right API determines not just performance —
            but long-term system stability, cost efficiency, and scalability.
          </p>

          <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
            Strong architecture reduces silent failures, hallucination risks,
            and operational surprises during growth phases.
          </p>
        </div>

      </div>

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