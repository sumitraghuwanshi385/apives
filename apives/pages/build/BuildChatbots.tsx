import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Sparkles,
  Brain,
  Zap,
  Shield
} from "lucide-react";

import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";

const STORAGE_KEY = "apives_usecase_chatbots";
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
      🤖 Loading chatbots for you
    </p>

    <p className="text-xs text-slate-500 max-w-xs text-center">
      Analyzing APIs for conversations, latency, and production readiness
    </p>
  </div>
);

export default function BuildChatbots() {
  const navigate = useNavigate();
  const admin = isAdmin();

  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-black text-slate-100 pt-24 px-4 md:px-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full
          bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest
          hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {admin && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full
              bg-mora-500 text-black text-xs font-black uppercase tracking-widest"
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
        <h1 className="text-3xl md:text-6xl font-display font-bold text-white leading-tight">
          Build AI Chatbots
        </h1>
        <p className="mt-4 text-slate-400 text-sm md:text-lg">
          From MVP chat assistants to production-grade conversational systems.
          These APIs power real SaaS products.
        </p>
      </div>

      {/* GUIDE */}
      <div className="max-w-6xl mx-auto mb-20 grid md:grid-cols-3 gap-6">

        {/* BEFORE YOU CHOOSE */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-mora-500" />
            Before you choose a Chatbot API
          </h3>

          <div className="space-y-3 text-sm text-slate-300">
            <p>🚀 <b>MVP</b> → Fast setup, minimal auth, clean docs</p>
            <p>📈 <b>Scale</b> → Rate limits, streaming, predictable pricing</p>
            <p>🏭 <b>Production</b> → Reliability, versioning, uptime history</p>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              "Pricing model",
              "Response latency",
              "Context length",
              "Rate limits",
              "Streaming support",
              "Integration ease"
            ].map(item => (
              <div
                key={item}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
              >
                • {item}
              </div>
            ))}
          </div>
        </div>

        {/* ADMIN NOTE */}
        <div className="bg-gradient-to-br from-mora-500/10 to-transparent
          border border-mora-500/30 rounded-2xl p-6">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Shield size={16} className="text-mora-500" />
            Curated Picks
          </h4>
          <p className="text-xs text-slate-400">
            APIs selected and verified by
            <span className="block mt-1 font-mono text-mora-400">
              beatslevelone@gmail.com
            </span>
          </p>
          <p className="text-xs text-slate-500 mt-3">
            These APIs are tested for real chatbot use-cases — not just docs.
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