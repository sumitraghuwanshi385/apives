import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import {
  ChevronDown,
  Check,
  Mic,
  Radio,
  Layers
} from "lucide-react";

const STORAGE_KEY = "apives_usecase_voice";
const NOTE_KEY = "apives_voice_global_note";

const VOICE_KEYWORDS = [
  "voice",
  "speech",
  "audio",
  "transcription",
  "speech-to-text",
  "stt"
];

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
const VoiceLoader = () => (
  <div className="flex flex-col items-center justify-center mt-24 mb-32 gap-3">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border border-mora-500/30 animate-ping" />
      <div className="absolute inset-0 rounded-full border border-mora-500 border-t-transparent animate-spin" />
    </div>
    <p className="text-xs tracking-widest text-slate-400">
      Loading speech APIs…
    </p>
  </div>
);

/* ===============================
   YOUTUBE PREVIEW
================================ */
const YouTubePreview = ({ url }: { url: string }) => {
  let videoId = "";

  try {
    if (url.includes("watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else {
      const lastPart = url.split("/").pop() || "";
      videoId = lastPart.split("?")[0];
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
      className="group flex items-center gap-3
      bg-white/5 border border-white/10
      rounded-xl p-2 hover:bg-white/10 transition"
    >
      <div className="relative shrink-0">
        <img
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          className="w-32 h-20 object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-white font-medium">
          YouTube Video
        </p>
        <p className="text-xs text-slate-400">
          Click to watch
        </p>
      </div>
    </a>
  );
};

/* ===============================
   INSIGHT RENDERER
================================ */
const InsightRenderer = ({ text }: { text: string }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const youtubeRegex =
    /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^\s]+)/;

  const paragraphs = text.split("\n");

  return (
    <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
      {paragraphs.map((para, i) => {
        if (!para.trim()) return <div key={i} className="h-4" />;

        const urls = para.match(urlRegex);

        if (!urls) return <p key={i}>{para}</p>;

        return (
          <div key={i} className="space-y-3">
            <p>{para.replace(urlRegex, "").trim()}</p>

            {urls.map((url, idx) => {
              if (youtubeRegex.test(url)) {
                return <YouTubePreview key={idx} url={url} />;
              }

              const domain = new URL(url).hostname.replace("www.", "");

              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-white/10 border border-white/20
                  backdrop-blur-md text-xs text-slate-200
                  hover:bg-white/20 transition"
                >
                  {domain}
                </a>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default function BuildVoiceToText() {
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
        console.error(e);
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

  const voiceApis = allApis.filter(api => {
    const text = `${api.name} ${api.description || ""}`.toLowerCase();
    return VOICE_KEYWORDS.some(k => text.includes(k));
  });

  const visibleApis = voiceApis.filter(api =>
    selectedIds.includes(api.id)
  );

  const saveNote = () => {
    localStorage.setItem(NOTE_KEY, noteDraft);
    setNote(noteDraft);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 pt-20 px-4 md:px-8">

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
                {voiceApis.map(api => (
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

      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-6xl font-display font-bold text-white">
          Voice to Text
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-lg">
          Production-ready speech recognition APIs built for real-time and batch workloads.
        </p>
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
                  rows={4}
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

      <div className="max-w-7xl mx-auto mb-6 px-1">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={18} className="text-mora-500" />
          <h3 className="text-white font-bold text-lg">
            Curated Speech APIs
          </h3>
        </div>
      </div>

      {loading ? (
        <VoiceLoader />
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 pb-6">
          {visibleApis.map(api => (
            <ApiCard key={api.id} api={api} topIds={[]} />
          ))}
        </div>
      )}
    </div>
  );
}