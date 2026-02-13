import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import {
  ChevronDown,
  Check,
  Zap,          // ✅ Sparkles removed
  Brain,
  MessageSquare,
  Layers
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
   UNIQUE LOADER
================================ */
const ChatbotLoader = () => (
  <div className="flex flex-col items-center justify-center mt-24 gap-6">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-2 border-mora-500/30 animate-ping" />
      <div className="absolute inset-0 rounded-full border-2 border-mora-500 border-t-transparent animate-spin" />
    </div>

    <p className="text-sm font-mono uppercase tracking-[0.3em] text-slate-400">
      Initializing Chatbot API
    </p>

    <p className="text-xs text-slate-500 max-w-xs text-center">
      Evaluating latency, context depth, and conversational stability
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

  /* LOAD DATA */
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

  // ✅ FIXED TEMPLATE STRING (GitHub red error)
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

      {/* HEADER ROW */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
        <BackButton />

        {/* ✅ SELECT APIS PILL (ADMIN ONLY) */}
        {admin && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="
                flex items-center gap-2
                px-4 py-2 rounded-full
                bg-white/5 border border-white/10
                text-xs font-black uppercase tracking-widest
                hover:bg-white/10
              "
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
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl md:text-6xl font-display font-bold text-white">
          AI Chatbots
        </h1>
        <p className="mt-4 text-slate-400 text-sm md:text-lg">
          Discover APIs optimized for conversational flows, LLM reasoning,
          and production-grade assistants.
        </p>
      </div>

      {/* BEFORE YOU CHOOSE */}
      <div className="max-w-6xl mx-auto mb-16 grid md:grid-cols-3 gap-6">

        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Zap size={16} className="text-mora-500" />
            Evaluates Chatbot APIs
          </h3>

          {/* बाकी सब untouched */}
          {/* ... */}
        </div>

        <div className="bg-gradient-to-br from-mora-500/10 to-transparent border border-white/10 rounded-2xl p-6">
          <MessageSquare className="text-mora-500 mb-3" size={18} />
          <p className="text-white font-bold mb-2">
            Building Chatbots ≠ Just LLM Calls
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real chatbots need memory, streaming UX, retries, cost control,
            and predictable behavior under load. Apives surfaces APIs that
            survive real usage — not demos.
          </p>
        </div>
      </div>

      {/* बाकी पूरा code SAME */}
      {/* API CARDS / NOTES / LOADER untouched */}
    </div>
  );
}