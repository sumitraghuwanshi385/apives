import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import { ApiCard } from "../../components/ApiCard";

const STORAGE_KEY = "apives_usecase_chatbots";

const isAdmin = () => {
  try {
    const u = JSON.parse(localStorage.getItem("mora_user") || "null");
    return u?.email === "beatslevelone@gmail.com";
  } catch {
    return false;
  }
};

export default function BuildChatbots() {
  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    apiService.getAllApis().then((res: any[]) => {
      const db = res.map(a => ({ ...a, id: a._id }));
      setAllApis(db);
    });

    setSelectedIds(
      JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    );
  }, []);

  const toggleApi = (id: string) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSelectedIds(updated);
  };

  const visibleApis = allApis.filter(api =>
    selectedIds.includes(api.id)
  );

  return (
    <div className="min-h-screen bg-black pt-28 px-4 md:px-8">
      <h1 className="text-3xl md:text-5xl font-display font-bold text-white">
        Build AI Chatbots
      </h1>

      <p className="text-slate-400 mt-2 max-w-2xl">
        APIs for chat, assistants, LLMs, moderation and conversations.
      </p>

      {/* API CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {visibleApis.map(api => (
          <ApiCard key={api.id} api={api} topIds={[]} />
        ))}
      </div>

      {/* ADMIN PANEL */}
      {isAdmin() && (
        <div className="mt-16 border border-mora-500/30 rounded-2xl p-4 bg-black/70">
          <h4 className="text-mora-400 text-xs font-black uppercase tracking-widest mb-4">
            Admin • Select APIs
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
            {allApis.map(api => (
              <button
                key={api.id}
                onClick={() => toggleApi(api.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border
                  ${
                    selectedIds.includes(api.id)
                      ? "bg-mora-500 text-black border-mora-500"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}
              >
                {api.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}