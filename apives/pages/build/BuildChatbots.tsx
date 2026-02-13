import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import {
  ChevronDown,
  Check,
  Sparkles,
  Brain,
  Zap,
  MessageSquare,
  Layers,
  Shield
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
   CLEANER LOADER (Reduced)
================================ */
const ChatbotLoader = () => (
  <div className="flex flex-col items-center justify-center mt-24 gap-3">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border border-mora-500/30 animate-ping" />
      <div className="absolute inset-0 rounded-full border border-mora-500 border-t-transparent animate-spin" />
    </div>
    <p className="text-xs font-mono tracking-widest text-slate-400">
      Loading Chatbots...
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
    <div className="min-h-screen bg-black text-slate-100 pt-24 px-4 md:px-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
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
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h1 className="text-3xl md:text-6xl font-display font-bold text-white">
          AI Chatbots
        </h1>
        <p className="mt-4 text-slate-400 text-sm md:text-lg">
          Production-ready conversational APIs curated by Apives.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto mb-14 grid md:grid-cols-3 gap-5">

        {/* EVALUATION BOX (Padding Reduced + Cleaner) */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-mora-500" />
            How Apives Evaluates Chatbot APIs
          </h3>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-black/40 border border-white/10 rounded-xl p-3">
              <Zap className="text-mora-500 mb-1" size={14} />
              <p className="font-bold text-white text-xs">MVP Ready</p>
              <p className="text-slate-400 text-[11px]">
                Instant auth, zero friction integration.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-3">
              <Layers className="text-mora-500 mb-1" size={14} />
              <p className="font-bold text-white text-xs">Scale Safe</p>
              <p className="text-slate-400 text-[11px]">
                Streaming stability & predictable scaling.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-3">
              <Brain className="text-mora-500 mb-1" size={14} />
              <p className="font-bold text-white text-xs">Production Grade</p>
              <p className="text-slate-400 text-[11px]">
                Uptime, versioning & long context handling.
              </p>
            </div>
          </div>
        </div>

        {/* BUILDING CHATBOTS BOX (Padding Reduced) */}
        <div className="bg-gradient-to-br from-mora-500/10 to-transparent border border-white/10 rounded-2xl p-4">
          <MessageSquare className="text-mora-500 mb-2" size={16} />
          <p className="text-white font-bold text-sm mb-1">
            Building Chatbots ≠ Just LLM Calls
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Real bots need streaming UX, memory orchestration,
            cost awareness & predictable output behavior.
          </p>
        </div>
      </div>

      {/* NEW PREMIUM INTELLIGENCE BOX */}
      <div className="max-w-5xl mx-auto mb-14">
        <div className="relative bg-gradient-to-r from-mora-500/10 to-black border border-mora-500/20 rounded-2xl p-5 overflow-hidden">
          <div className="absolute inset-0 bg-mora-500/5 blur-3xl opacity-30" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-mora-400 mb-2">
              Apives Intelligence Layer
            </p>
            <p className="text-sm text-slate-300">
              APIs listed here pass conversational stress tests,
              memory chaining checks, and real SaaS deployment simulations.
            </p>
          </div>
        </div>
      </div>

      {/* NOTE BY APIVES (Renamed + Sexy UI) */}
      {(note || admin) && (
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-white/5 to-white/10 border border-mora-500/20 rounded-2xl p-5 shadow-lg">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-mora-400 mb-3">
              <Shield size={14} />
              Note by Apives
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
                  Update Note
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-300 whitespace-pre-line">
                {note}
              </p>
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