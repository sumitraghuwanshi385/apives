import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";

import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import { ApiCard } from "../../components/ApiCard";

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
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white">
          Best APIs to Build AI Chatbots
        </h1>
        <p className="mt-4 text-slate-400 text-sm md:text-base">
          Build SaaS apps, AI wrappers, or ChatGPT-style products using
          scalable, production-ready APIs.
        </p>
      </div>

      {/* GUIDE */}
      <div className="max-w-5xl mx-auto mb-16 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-white font-bold mb-4">💡 Before You Choose an API</h3>

        <ul className="text-slate-300 text-sm space-y-2 mb-6">
          <li>🔹 MVP → fast setup & clean docs</li>
          <li>🔹 Scale → rate limits & predictable pricing</li>
          <li>🔹 Production → reliability & versioning</li>
        </ul>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
            Things to Compare
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-300">
            <span>• Pricing model</span>
            <span>• Response speed</span>
            <span>• API docs</span>
            <span>• Rate limits</span>
            <span>• Reliability</span>
            <span>• Integration ease</span>
          </div>
        </div>
      </div>

      {/* API CARDS */}
      {loading ? (
        <p className="text-center text-slate-500 mt-20 text-sm">
          Loading chatbot APIs…
        </p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleApis.map(api => (
            <ApiCard key={api.id} api={api} topIds={[]} />
          ))}
        </div>
      )}

      {!loading && visibleApis.length === 0 && (
        <p className="text-center text-slate-500 mt-12 text-sm">
          No APIs selected yet.
        </p>
      )}
    </div>
  );
}