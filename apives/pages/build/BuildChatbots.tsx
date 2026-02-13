import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import { ChevronDown, Check } from "lucide-react";

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
  <div className="flex flex-col items-center justify-center mt-24 gap-6">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-2 border-mora-500/30 animate-ping" />
      <div className="absolute inset-0 rounded-full border-2 border-mora-500 border-t-transparent animate-spin" />
    </div>

    <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-slate-400">
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
        setAllApis(list.map(a => ({ ...a, id: a._id })));
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
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <BackButton />

        <div className="flex items-center gap-3">
          {/* CURATED PILL */}
          <span className="
            px-4 py-1.5 rounded-full
            bg-white/5 border border-white/10
            text-[10px] font-mono tracking-wide text-slate-300
          ">
            Curated by <span className="text-mora-400">Apives</span>
          </span>

          {/* ADMIN CURATE */}
          {admin && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="
                  flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-mora-500 text-black
                  text-[10px] font-black uppercase tracking-widest
                "
              >
                Curate APIs <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto
                  bg-black border border-white/10 rounded-2xl p-2 z-50">
                  {chatbotApis.map(api => (
                    <button
                      key={api.id}
                      onClick={() => toggleApi(api.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs
                        ${selectedIds.includes(api.id)
                          ? "bg-mora-500 text-black"
                          : "text-slate-400 hover:bg-white/5"}`}
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
      </div>

      {/* HERO */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl md:text-6xl font-display font-bold text-white">
          AI Chatbots
        </h1>
        <p className="mt-4 text-slate-400 text-sm md:text-lg">
          APIs optimized for conversational flows, LLM reasoning,
          and production-grade assistants.
        </p>
      </div>

      {/* BEFORE YOU CHOOSE */}
      <div className="max-w-6xl mx-auto mb-16 grid md:grid-cols-3 gap-6">

        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">
            How Apives evaluates Chatbot APIs
          </h3>

          <div className="space-y-2 text-sm text-slate-300">
            <p><b>MVP</b> → Fast setup, minimal auth, clean docs</p>
            <p><b>Scale</b> → Streaming, predictable token economics</p>
            <p><b>Production</b> → Reliability, versioning, uptime history</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Token pricing model",
              "Response latency",
              "Context window depth",
              "Streaming support",
              "Rate-limit behavior",
              "Integration friction"
            ].map(item => (
              <span
                key={item}
                className="
                  px-3 py-1.5 rounded-full
                  bg-black/40 border border-white/10
                  text-[10px] font-mono text-slate-300
                "
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white font-bold mb-2">
            Building Chatbots ≠ Just LLM calls
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Production chatbots need memory, retries, streaming UX,
            cost control and stable behavior under load.
            Apives highlights APIs that survive real usage.
          </p>
        </div>
      </div>

      {/* GLOBAL NOTE */}
      {(note || admin) && (
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">
              Builder note
            </p>

            {admin ? (
              <>
                <textarea
                  value={noteDraft}
                  onChange={e => setNoteDraft(e.target.value)}
                  rows={3}
                  placeholder="Write a note for all builders…"
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white mb-3"
                />
                <button
                  onClick={saveNote}
                  className="px-4 py-2 rounded-full bg-mora-500 text-black text-[10px] font-black uppercase tracking-widest"
                >
                  Save note
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