import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import {
  ChevronDown,
  Check,
  Image,
  Radio,
  Layers
} from "lucide-react";

const IMAGE_KEYWORDS = [
  "image",
  "generation",
  "diffusion",
  "text-to-image",
  "image ai",
  "vision"
];

const isAdmin = () => {
  try {
    const u = JSON.parse(localStorage.getItem("mora_user") || "null");
    return u?.email === "beatslevelone@gmail.com";
  } catch {
    return false;
  }
};

export default function BuildImageGeneration() {
  const admin = isAdmin();

  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [note, setNote] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  /* ===============================
     LOADER
  ============================== */
  const ImageLoader = () => (
    <div className="flex flex-col items-center justify-center mt-24 mb-32 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border border-mora-500/30 animate-ping" />
        <div className="absolute inset-0 rounded-full border border-mora-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs tracking-widest text-slate-400">
        Loading image APIs…
      </p>
    </div>
  );

  /* ===============================
     YOUTUBE PREVIEW (GREEN THEME)
  ============================== */
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
        className="group flex items-center gap-3 bg-green-500/5 border border-green-500/30 rounded-xl p-2 hover:bg-green-500/10 transition"
      >
        <div className="relative shrink-0">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            className="w-32 h-20 object-cover rounded-lg"
            loading="lazy"
            alt="YouTube preview"
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
     INSIGHT RENDERER (GREEN PILLS)
  ============================== */
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

                let domain = "";
                try {
                  domain = new URL(url).hostname.replace("www.", "");
                } catch {
                  return null;
                }

                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-300 hover:bg-green-500/20 transition"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                      alt=""
                      className="w-4 h-4 rounded-full bg-white"
                    />
                    <span>{domain}</span>
                  </a>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  /* ===============================
     INITIAL LOAD (DB)
  ============================== */
  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getAllApis();
        const list = Array.isArray(res) ? res : res?.data || [];
        const db = list.map(a => ({ ...a, id: a._id }));
        setAllApis(db);

        const uc = await apiService.getUsecaseBySlug("image-generation");

        if (uc) {
          setNote(uc.operationalInsight || "");
          setNoteDraft(uc.operationalInsight || "");

          if (uc.curatedApiIds) {
            const ids = uc.curatedApiIds.map((api: any) =>
              typeof api === "string" ? api : api._id
            );
            setSelectedIds(ids);
          }
        }

      } catch (err) {
        console.error("Image load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const imageApis = allApis.filter(api => {
    const text = `${api.name} ${api.description || ""}`.toLowerCase();
    return IMAGE_KEYWORDS.some(k => text.includes(k));
  });

  const visibleApis = imageApis.filter(api =>
    selectedIds.includes(api.id)
  );

  const saveSelection = async () => {
    try {
      const updated = await apiService.updateUsecase("image-generation", {
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

  const saveNote = async () => {
    try {
      const updated = await apiService.updateUsecase("image-generation", {
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

                {imageApis.map(api => (
                  <button
                    key={api.id}
                    onClick={() =>
                      setSelectedIds(prev =>
                        prev.includes(api.id)
                          ? prev.filter(x => x !== api.id)
                          : [...prev, api.id]
                      )
                    }
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

      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-6xl font-display font-bold">
          Image Generation
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-lg">
          Production-ready image generation APIs for creative, design, and vision workflows.
        </p>
      </div>
{/* ===== ARCHITECTURE SECTIONS ===== */}  
  <div className="max-w-6xl mx-auto mt-10 space-y-10 px-3">  

    <div className="md:w-1/2 text-center md:text-left">  
      <h2 className="text-[22px] md:text-[28px] font-bold  
        bg-gradient-to-r from-green-400 to-emerald-400  
        bg-clip-text text-transparent">  
        Image Generation Foundations.  
      </h2>  
      <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] max-w-[540px]">  
        High-quality image systems require prompt control, resolution scaling,  
        style consistency, seed reproducibility, and GPU-efficient inference.  
      </p>  
    </div>  
</div>
    <div className="md:w-1/2 text-center md:text-right ml-auto">  
      <h2 className="text-[22px] md:text-[28px] font-bold  
        bg-gradient-to-r from-purple-400 to-pink-400  
        bg-clip-text text-transparent">  
        Performance & Cost Control.  
      </h2>  
      <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] max-w-[540px] ml-auto">  
        Image APIs must balance latency, batch rendering,  
        GPU cost efficiency, and predictable pricing at scale.  
      </p>  
    </div>  
</div>
    <div className="md:w-1/2 text-center md:text-left">  
      <h2 className="text-[22px] md:text-[28px] font-bold  
        bg-gradient-to-r from-blue-400 to-cyan-400  
        bg-clip-text text-transparent">  
        API Choice Defines Output Quality.  
      </h2>  
      <p className="mt-1.5 text-slate-400 text-sm md:text-[15px] max-w-[540px]">  
        The right image API determines realism, artistic control,  
        output consistency, and long-term platform reliability.  
      </p>  
    </div>  

  </div> </div>  
{/* EXTRA SPACE BEFORE OPERATIONAL INSIGHT */}  <div className="mt-12">

      {(note || admin) && (
        <div className="max-w-5xl mx-auto mb-14">
          <div className="bg-green-500/5 border border-green-500/30 rounded-2xl p-4">
            <p className="text-xs uppercase text-green-400 mb-2 flex items-center gap-2">
              <Radio size={14} className="text-green-400" />
              Operational Insight
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
              <InsightRenderer text={note} />
            )}
          </div>
        </div>
      )}
</div>
      <div className="max-w-7xl mx-auto mb-6 px-1">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={18} className="text-mora-500" />
          <h3 className="text-white font-bold text-lg">
            Curated Image APIs
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-xl">
          Image generation APIs selected for production-grade creative systems.
        </p>
      </div>

      {loading ? (
        <ImageLoader />
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {visibleApis.map(api => (
            <ApiCard key={api.id} api={api} topIds={[]} />
          ))}
        </div>
      )}

      {!loading && visibleApis.length === 0 && (
        <p className="text-center text-slate-500 mt-16 text-sm">
          No image APIs selected yet.
        </p>
      )}
    </div>
  );
}