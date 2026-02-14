import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import { ChevronDown, Check, Radio, Layers } from "lucide-react";

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
  const admin = isAdmin();

  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    (async () => {
      try {
        // 1️⃣ Load all APIs
        const res = await apiService.getAllApis();
        const list = Array.isArray(res) ? res : res?.data || [];
        const db = list.map(a => ({ ...a, id: a._id }));
        setAllApis(db);

        // 2️⃣ Load usecase
        const uc = await apiService.getUsecaseBySlug("chatbots");

        if (uc) {
          setNote(uc.operationalInsight || "");
          setNoteDraft(uc.operationalInsight || "");

          // 🔥 IMPORTANT FIX
          if (uc.curatedApiIds) {
            const ids = uc.curatedApiIds.map((api: any) =>
              typeof api === "string" ? api : api._id
            );
            setSelectedIds(ids);
          }
        }

      } catch (err) {
        console.error("Chatbot load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===============================
  // FILTER CHATBOT APIs
  // ===============================
  const chatbotApis = allApis.filter(api => {
    const text = `${api.name} ${api.description || ""}`.toLowerCase();
    return CHATBOT_KEYWORDS.some(k => text.includes(k));
  });

  const visibleApis = chatbotApis.filter(api =>
    selectedIds.includes(api.id)
  );

  // ===============================
  // TOGGLE (NO AUTO SAVE)
  // ===============================
  const toggleApi = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  // ===============================
  // SAVE SELECTION BUTTON
  // ===============================
  const saveSelection = async () => {
    try {
      const updated = await apiService.updateUsecase("chatbots", {
        operationalInsight: noteDraft,
        curatedApiIds: selectedIds
      });

      setNote(updated.operationalInsight || "");
      setNoteDraft(updated.operationalInsight || "");

      if (updated.curatedApiIds) {
        const ids = updated.curatedApiIds.map((api: any) =>
          typeof api === "string" ? api : api._id
        );
        setSelectedIds(ids);
      }

      alert("Selection Saved ✅");
      setDropdownOpen(false);

    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed ❌");
    }
  };

  // ===============================
  // SAVE NOTE
  // ===============================
  const saveNote = async () => {
    try {
      const updated = await apiService.updateUsecase("chatbots", {
        operationalInsight: noteDraft,
        curatedApiIds: selectedIds
      });

      setNote(updated.operationalInsight || "");
      alert("Operational Insight Updated ✅");

    } catch (err) {
      console.error("Note save failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 md:px-8">

      <div className="max-w-7xl mx-auto mb-6 flex justify-between">
        <BackButton />

        {admin && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="px-4 py-2 bg-white/10 rounded-full text-xs uppercase"
            >
              Select APIs <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-black border border-white/10 rounded-xl p-3 z-50">

                {chatbotApis.map(api => (
                  <button
                    key={api.id}
                    onClick={() => toggleApi(api.id)}
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

                {/* 🔥 SAVE BUTTON */}
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

      {/* OPERATIONAL INSIGHT */}
      {(note || admin) && (
        <div className="max-w-5xl mx-auto mb-14">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs uppercase text-gray-400 mb-2 flex items-center gap-2">
              <Radio size={14} /> Operational Insight
            </p>

            {admin ? (
              <>
                <textarea
                  value={noteDraft}
                  onChange={e => setNoteDraft(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm mb-3"
                  rows={3}
                />
                <button
                  onClick={saveNote}
                  className="px-4 py-2 rounded-full bg-mora-500 text-black text-xs font-bold"
                >
                  Update Insight
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-300">{note}</p>
            )}
          </div>
        </div>
      )}

      {/* CURATED APIS */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={18} className="text-mora-500" />
          <h3 className="text-white font-bold text-lg">
            Curated Chatbot APIs
          </h3>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {visibleApis.map(api => (
            <ApiCard key={api.id} api={api} topIds={[]} />
          ))}
        </div>
      )}

      {!loading && visibleApis.length === 0 && (
        <p className="text-center text-gray-500 mt-16 text-sm">
          No chatbot APIs selected yet.
        </p>
      )}
    </div>
  );
}