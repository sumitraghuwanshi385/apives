import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  X,
  Trash2,
  GitCompare,
  Mic,
  MicOff,
  ArrowUp,
  Sparkles,
  History,
  Clock,
  ChevronRight,
  Zap,
} from "lucide-react";
import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

// ─── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

  /* Hide global Navbar + Footer on this page */
  nav, header, footer, [data-global] {
    display: none !important;
  }

  .chat-scroll::-webkit-scrollbar { width: 3px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.15); border-radius: 99px; }

  @keyframes msgSlide {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .msg-enter { animation: msgSlide 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  @keyframes floatOrb {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-7px); }
  }
  .animate-float { animation: floatOrb 4s ease-in-out infinite; }

  @keyframes typingBounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.35; }
    30%         { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes wordFadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .word-in { animation: wordFadeIn 0.28s ease forwards; }

  @keyframes pageIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-in { animation: pageIn 0.3s ease forwards; }

  @keyframes shimLine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shim-line {
    background: linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.25) 50%, transparent 100%);
    background-size: 200% auto;
    animation: shimLine 2.5s linear infinite;
  }

  @keyframes orbGlow {
    0%,100% { box-shadow: 0 0 28px rgba(52,211,153,0.38), inset 0 2px 10px rgba(255,255,255,0.16); }
    50%      { box-shadow: 0 0 48px rgba(52,211,153,0.60), inset 0 2px 12px rgba(255,255,255,0.22); }
  }

  @keyframes dataPing {
    0%   { transform: scale(1); opacity: 1; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slideUp 0.36s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  @keyframes micPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    50%     { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
  }
  .mic-active { animation: micPulse 1.2s ease-in-out infinite; }

  @keyframes orbSpin {
    to { transform: rotate(360deg); }
  }

  .glass-pill-user {
    background: rgba(52,211,153,0.09);
    border: 1px solid rgba(52,211,153,0.20);
    backdrop-filter: blur(16px);
  }
  .glass-pill-ai {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
  }
  .glass-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(52,211,153,0.18);
    backdrop-filter: blur(20px);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .glass-input:focus-within {
    border-color: rgba(52,211,153,0.38);
    box-shadow: 0 0 0 3px rgba(52,211,153,0.07);
  }
  textarea { resize: none; scrollbar-width: none; }
  textarea::-webkit-scrollbar { display: none; }
`;

// ─── AnimatedOrb ─────────────────────────────────────────────────────────────
const AnimatedOrb = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  const WORDS = [
    "Endpoints",
    "Docs",
    "Usage",
    "Auth",
    "Requests",
    "Response",
    "Integration",
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % WORDS.length);
        setShow(true);
      }, 280);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-float flex flex-col items-center gap-4">
      {/* Orb */}
      <div className="relative w-[110px] h-[110px] flex items-center justify-center">
        {/* Outer glow */}
        <div className="absolute -inset-3 rounded-full bg-mora-green/16 blur-xl" />
        {/* Core gradient */}
        <div
          className="absolute inset-[10px] rounded-full bg-gradient-to-br from-mora-green to-emerald-600"
          style={{
            animation: "orbGlow 3.5s ease-in-out infinite",
          }}
        />
        {/* Highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: "22%",
            left: "24%",
            width: "28%",
            height: "20%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)",
          }}
        />
        {/* Data pings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-[5px] h-[5px] rounded-full bg-mora-green/80"
            style={{
              top: `${[18, 72, 50][i]}%`,
              left: `${[72, 20, 78][i]}%`,
              animation: `dataPing 2.4s ease-out ${i * 0.8}s infinite`,
            }}
          />
        ))}
        {/* Rotating word inside the orb */}
        {show && (
          <span className="word-in absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
            {WORDS[idx]}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── TypingIndicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-bl bg-white/5 border border-white/10 backdrop-blur-xl w-fit">
    <div className="relative w-3.5 h-3.5">
      <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-mora-green to-emerald-600" />
    </div>
    <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-mora-green/60">
      Thinking
    </span>
    <div className="flex gap-0.5 items-end pb-px">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1 h-1 rounded-full bg-mora-green"
          style={{
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

// ─── MessagePill ──────────────────────────────────────────────────────────────
const MessagePill = ({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) => {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-1`}>
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-mora-green to-emerald-600 flex items-center justify-center mr-2 mt-1">
          <Sparkles size={10} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div
        className={`${
          isUser ? "glass-pill-user" : "glass-pill-ai"
        } max-w-[82%] px-4 py-2.5 text-[13px] leading-relaxed font-medium break-words whitespace-pre-wrap`}
        style={{
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          color: isUser ? "rgba(236,253,245,0.92)" : "rgba(255,255,255,0.80)",
        }}
      >
        {content}
      </div>
    </div>
  );
};

// ─── ClearModal ───────────────────────────────────────────────────────────────
const ClearModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div
    className="fixed inset-0 z-60 flex items-end justify-center pb-8 bg-black/70 backdrop-blur-xl"
    onClick={onCancel}
  >
    <div
      className="slide-up w-[88%] max-w-[320px] rounded-3xl p-6 bg-[#060F0B] border border-mora-green/10 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <Trash2 size={16} color="#f87171" />
      </div>
      <p className="text-[15px] font-bold text-white mb-1.5">
        Clear chat history?
      </p>
      <p className="text-xs text-white/30 leading-relaxed mb-5">
        This will permanently remove all messages for this API session.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-2xl text-[13px] font-semibold bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-2xl text-[13px] font-semibold bg-red-500/80 text-white hover:bg-red-500 transition"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
);

// ─── HistoryModal ─────────────────────────────────────────────────────────────
type HistoryEntry = {
  apiId: string;
  title: string;
  preview: string;
  ts: number;
};

const HistoryModal = ({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (apiId: string) => void;
}) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("apives_chat_")
    );
    const result: HistoryEntry[] = [];
    keys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const msgs = JSON.parse(raw);
        if (!msgs?.length) return;
        const apiId = key.replace("apives_chat_", "");
        const firstUser = msgs.find((m: any) => m.role === "user");
        const title = firstUser?.content?.slice(0, 48) || apiId;
        const last = msgs[msgs.length - 1];
        const preview = (last?.content?.slice(0, 60) ?? "") + "...";
        result.push({ apiId, title, preview, ts: Date.now() });
      } catch {}
    });
    setEntries(result.reverse());
  }, []);

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-black/75 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="slide-up w-full max-w-[480px] rounded-t-3xl bg-[#050E09] border border-mora-green/10 border-b-0 shadow-[0_-12px_60px_rgba(0,0,0,0.6)] max-h-[72vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3">
          <div className="w-9 h-1 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-mora-green/10 border border-mora-green/20 flex items-center justify-center">
              <Clock size={14} className="text-mora-green" />
            </div>
            <span className="text-[15px] font-bold text-white">
              Recent Chats
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
          >
            <X size={12} className="text-white/40" />
          </button>
        </div>
        <div className="overflow-y-auto px-3 pb-6 flex-1">
          {entries.length === 0 ? (
            <div className="text-center py-10 px-5">
              <div className="w-12 h-12 rounded-2xl bg-mora-green/10 border border-mora-green/15 mx-auto mb-3 flex items-center justify-center">
                <History size={20} className="text-mora-green/50" />
              </div>
              <p className="text-[13px] text-white/30 leading-relaxed">
                No chat history yet.
                <br />
                Start a conversation to see it here.
              </p>
            </div>
          ) : (
            entries.map((e) => (
              <div
                key={e.apiId}
                onClick={() => onSelect(e.apiId)}
                className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 mb-1.5 cursor-pointer hover:bg-mora-green/5 transition"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-mora-green/10 border border-mora-green/15 flex items-center justify-center">
                  <Sparkles size={14} className="text-mora-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white/85 truncate mb-0.5">
                    {e.title}
                  </p>
                  <p className="text-[11px] text-white/30 truncate">
                    {e.preview}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-mora-green/40 flex-shrink-0"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── CompareModal ─────────────────────────────────────────────────────────────
type ApiOption = {
  _id: string;
  name: string;
  category?: string;
  description?: string;
};

const CompareModal = ({
  onClose,
  isLoggedIn,
  onNeedLogin,
}: {
  onClose: () => void;
  isLoggedIn: boolean;
  onNeedLogin: () => void;
}) => {
  const [apis, setApis] = useState<ApiOption[]>([]);
  const [search, setSearch] = useState("");
  const [selectedA, setSelectedA] = useState<ApiOption | null>(null);
  const [selectedB, setSelectedB] = useState<ApiOption | null>(null);
  const [picking, setPicking] = useState<"A" | "B" | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  useEffect(() => {
    axios
      .get("https://apives-3xrc.onrender.com/api/apis")
      .then((r) => setApis(r.data?.apis || r.data || []))
      .catch(() => {});
  }, []);

  const filtered = apis
    .filter((a) => a.name?.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 30);

  const selectApi = (api: ApiOption) => {
    if (picking === "A") setSelectedA(api);
    else if (picking === "B") setSelectedB(api);
    setPicking(null);
    setSearch("");
  };

  const handleCompare = async () => {
    if (!isLoggedIn) {
      onNeedLogin();
      return;
    }
    if (!selectedA || !selectedB) return;
    setLoadingCompare(true);
    try {
      const prompt = `Compare these two APIs in detail:\n\nAPI A: ${selectedA.name}\n${selectedA.description || ""}\n\nAPI B: ${selectedB.name}\n${selectedB.description || ""}\n\nGive a structured comparison covering:\n1. Primary Use Case\n2. Key Features\n3. Authentication\n4. Rate Limits and Pricing\n5. Developer Experience\n6. Best For (who should use each)\n7. Verdict\n\nBe concise but comprehensive.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text =
        data.content?.map((b: any) => b.text || "").join("\n") ||
        "Comparison unavailable.";
      setResult(text);
    } catch {
      setResult("Unable to compare right now. Please try again.");
    } finally {
      setLoadingCompare(false);
    }
  };

  const canCompare = !!selectedA && !!selectedB;

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-black/80 backdrop-blur-xl"
      onClick={!picking ? onClose : undefined}
    >
      <div
        className="slide-up w-full max-w-[480px] rounded-t-3xl bg-[#050E09] border border-mora-green/15 border-b-0 shadow-[0_-12px_60px_rgba(0,0,0,0.65)] max-h-[88vh] flex flex-col pb-[env(safe-area-inset-bottom,20px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3">
          <div className="w-9 h-1 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-mora-green/50 mb-0.5">
              AI-Powered
            </p>
            <h3 className="text-lg font-extrabold text-white">Compare APIs</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
          >
            <X size={13} className="text-white/40" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 pt-4">
          {!result && (
            <>
              <div className="grid grid-cols-[1fr_40px_1fr] gap-2 items-center mb-4">
                <button
                  onClick={() => {
                    setPicking("A");
                    setSearch("");
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    selectedA
                      ? "bg-mora-green/10 border-mora-green/50"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-mora-green/60">
                    API A
                  </span>
                  {selectedA ? (
                    <span className="text-[13px] font-bold text-mora-green block mt-1">
                      {selectedA.name}
                    </span>
                  ) : (
                    <span className="text-xs text-white/25 block mt-1">
                      Tap to select
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-mora-green/10 border border-mora-green/20 flex items-center justify-center">
                    <span className="text-[9px] font-black text-mora-green tracking-wider">
                      VS
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPicking("B");
                    setSearch("");
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    selectedB
                      ? "bg-mora-green/10 border-mora-green/50"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-mora-green/60">
                    API B
                  </span>
                  {selectedB ? (
                    <span className="text-[13px] font-bold text-mora-green block mt-1">
                      {selectedB.name}
                    </span>
                  ) : (
                    <span className="text-xs text-white/25 block mt-1">
                      Tap to select
                    </span>
                  )}
                </button>
              </div>

              {picking && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-mora-green/60 mb-2 tracking-wider">
                    Select API {picking}
                  </p>
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Apives library..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-mora-green/20 text-white text-[13px] outline-none caret-mora-green mb-2"
                  />
                  <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto">
                    {filtered.length === 0 ? (
                      <p className="text-center py-5 text-xs text-white/25">
                        No APIs found
                      </p>
                    ) : (
                      filtered.map((api) => (
                        <button
                          key={api._id}
                          onClick={() => selectApi(api)}
                          className="px-3.5 py-2.5 rounded-xl text-left bg-white/5 border border-white/10 text-white/80 text-[13px] hover:bg-mora-green/10 transition"
                        >
                          <span className="font-semibold">{api.name}</span>
                          {api.category && (
                            <span className="text-[11px] text-white/30 ml-2">
                              {api.category}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleCompare}
                disabled={!canCompare || loadingCompare}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all mb-5 ${
                  canCompare
                    ? "bg-mora-green/15 border border-mora-green/30 text-mora-green shadow-[0_0_18px_rgba(52,211,153,0.12)] cursor-pointer"
                    : "bg-white/5 border border-white/10 text-white/20 cursor-default"
                }`}
              >
                {loadingCompare ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-mora-green/20 border-t-mora-green rounded-full animate-[orbSpin_0.8s_linear_infinite]" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <Zap size={15} />
                    Compare with AI
                  </>
                )}
              </button>
            </>
          )}

          {result && (
            <div className="pb-5">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-mora-green/10 border border-mora-green/15 mb-3.5">
                <span className="text-[11px] font-bold text-mora-green">
                  {selectedA?.name}
                </span>
                <span className="text-[10px] text-white/25">vs</span>
                <span className="text-[11px] font-bold text-mora-green">
                  {selectedB?.name}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs leading-relaxed text-white/75 whitespace-pre-wrap mb-3.5">
                {result}
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedA(null);
                  setSelectedB(null);
                }}
                className="w-full py-3 rounded-2xl text-[13px] font-semibold bg-mora-green/10 border border-mora-green/20 text-mora-green hover:bg-mora-green/15 transition mb-2"
              >
                Compare Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MicButton ────────────────────────────────────────────────────────────────
const MicButton = ({
  onTranscript,
  disabled,
}: {
  onTranscript: (t: string) => void;
  disabled: boolean;
}) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggle = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      onTranscript(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, onTranscript]);

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        listening
          ? "bg-red-500/20 border border-red-500/50 mic-active"
          : "bg-white/5 border border-white/10"
      }`}
      title={listening ? "Listening… tap to stop" : "Voice input"}
    >
      {listening ? (
        <MicOff size={13} color="#f87171" />
      ) : (
        <Mic size={13} className="text-white/40" />
      )}
    </button>
  );
};

// ─── ClaudeInput ──────────────────────────────────────────────────────────────
const ClaudeInput = ({
  value,
  onChange,
  onSend,
  disabled,
  isLoggedIn,
  onNeedLogin,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  isLoggedIn: boolean;
  onNeedLogin: () => void;
  placeholder: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasText && !disabled) {
        if (!isLoggedIn) {
          onNeedLogin();
          return;
        }
        onSend();
      }
    }
  };

  const handleSendClick = () => {
    if (!isLoggedIn) {
      onNeedLogin();
      return;
    }
    onSend();
  };

  return (
    <div className="glass-input rounded-[22px]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        rows={1}
        className="w-full bg-transparent text-white/85 text-sm leading-relaxed font-medium outline-none px-5 pt-3.5 pb-1.5 font-inherit caret-mora-green"
      />
      <div className="flex items-center justify-between px-3 pb-2.5">
        <MicButton
          onTranscript={(t) => onChange(value + (value ? " " : "") + t)}
          disabled={disabled}
        />
        <button
          onClick={handleSendClick}
          disabled={!hasText || disabled}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            hasText
              ? "bg-mora-green/20 border border-mora-green/40 shadow-[0_0_14px_rgba(52,211,153,0.25)] cursor-pointer"
              : "bg-white/5 border border-white/10 cursor-default"
          }`}
        >
          <ArrowUp
            size={14}
            color={hasText ? "#34d399" : "rgba(255,255,255,0.18)"}
            strokeWidth={2.8}
          />
        </button>
      </div>
    </div>
  );
};

// ─── AskApivesPage ────────────────────────────────────────────────────────────
const AskApivesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const apiId = searchParams.get("apiId");
  const apiName = searchParams.get("apiName");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth on mount and listen for storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("apives_token");
      const user = localStorage.getItem("apives_user");
      setIsLoggedIn(!!token || !!user);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Redirect helper — only for non-logged-in users
  const redirectToAccess = useCallback(() => {
    navigate(
      `/access?returnUrl=${encodeURIComponent(
        window.location.pathname + window.location.search
      )}`
    );
  }, [navigate]);

  // Load persisted chat
  useEffect(() => {
    if (!apiId) return;
    try {
      const saved = localStorage.getItem(`apives_chat_${apiId}`);
      if (saved) setChat(JSON.parse(saved));
    } catch {}
  }, [apiId]);

  // Persist chat
  useEffect(() => {
    if (!apiId) return;
    localStorage.setItem(`apives_chat_${apiId}`, JSON.stringify(chat));
    const firstUser = chat.find((m) => m.role === "user");
    if (firstUser) {
      localStorage.setItem(
        `apives_chat_title_${apiId}`,
        firstUser.content.slice(0, 60)
      );
    }
  }, [chat, apiId]);

  // Fetch API data
  useEffect(() => {
    if (!apiId) return;
    axios
      .get(`/api/apis/${apiId}`)
      .then((res) => setApiData(res.data))
      .catch(() => {});
  }, [apiId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (overrideText?: string) => {
    if (!isLoggedIn) {
      redirectToAccess();
      return;
    }
    const text = (overrideText ?? input).trim();
    if (!text) return;

    const newChat: { role: "user" | "assistant"; content: string }[] = [
      ...chat,
      { role: "user", content: text },
    ];
    setChat(newChat);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ask-ai", {
        messages: newChat,
        apiData,
      });
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to fetch response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChat([]);
    if (apiId) localStorage.removeItem(`apives_chat_${apiId}`);
    setShowClearModal(false);
  };

  const hasHistory = chat.length > 0;

  // Derive display name from URL param or fetched data
  const displayName = apiName || apiData?.name || null;
  const inputPlaceholder = displayName
    ? `Ask anything about ${displayName}...`
    : "Ask anything about any API...";

  return (
    <>
      <style>{STYLES}</style>

      {/* Modals */}
      {showClearModal && (
        <ClearModal
          onConfirm={clearChat}
          onCancel={() => setShowClearModal(false)}
        />
      )}
      {showCompareModal && (
        <CompareModal
          onClose={() => setShowCompareModal(false)}
          isLoggedIn={isLoggedIn}
          onNeedLogin={() => {
            setShowCompareModal(false);
            redirectToAccess();
          }}
        />
      )}
      {showHistoryModal && (
        <HistoryModal
          onClose={() => setShowHistoryModal(false)}
          onSelect={(id) => {
            setShowHistoryModal(false);
            navigate(`/ask-apives?apiId=${id}`);
          }}
        />
      )}

      <div className="page-in flex flex-col h-dvh overflow-hidden bg-[#060D0A] text-white font-inherit relative">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-[100px] -left-[80px] w-[380px] h-[380px] rounded-full bg-mora-green/12 blur-[60px]" />
          <div className="absolute -bottom-[80px] -right-[80px] w-[320px] h-[320px] rounded-full bg-mora-green/8 blur-[70px]" />
          <div
            className="absolute inset-0 opacity-[0.016]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* ── HEADER ── */}
        <div className="relative z-20 flex-shrink-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top,0px)+14px)] pb-3.5 bg-[#060D0A]/95 backdrop-blur-3xl">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all"
            >
              <X size={15} className="text-white/60" />
            </button>
            <div>
              <p className="text-[15px] font-extrabold text-white/95 leading-tight tracking-tight">
                Ask Apives AI
              </p>
              <p className="text-[10px] font-medium tracking-wider text-mora-green/50 mt-0.5">
                Enterprise API Intelligence
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all"
                title="Chat history"
              >
                <History size={14} className="text-white/40" />
              </button>
            )}
            {hasHistory && (
              <button
                onClick={() => setShowClearModal(true)}
                className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all"
              >
                <Trash2 size={14} className="text-white/30" />
              </button>
            )}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  redirectToAccess();
                  return;
                }
                setShowCompareModal(true);
              }}
              className="w-9 h-9 rounded-full bg-mora-green/10 border border-mora-green/20 flex items-center justify-center hover:bg-mora-green/15 transition"
              title="Compare APIs"
            >
              <GitCompare size={14} className="text-mora-green" />
            </button>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div
          ref={scrollRef}
          className="chat-scroll relative z-10 flex-1 overflow-y-auto py-4 min-h-0"
        >
          {/* Empty state */}
          {chat.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-8 text-center">
              <AnimatedOrb />

              {/* Hero text */}
              <h2 className="text-lg font-black mt-5 mb-1.5 leading-tight tracking-tight">
                The API Intelligence
                <br />
                <span className="text-mora-green">you deserve</span>
              </h2>

              <p className="text-[11px] text-white/30 leading-relaxed max-w-[220px] mb-5">
                Deep API analysis and instant answers on endpoints, auth, rate
                limits, and integration guidance.
              </p>

              {/* API context pill */}
              {displayName && (
                <div className="mb-4 px-5 py-2 rounded-full text-xs font-semibold max-w-[280px] text-center bg-white/5 border border-mora-green/30 text-mora-green/75 inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mora-green flex-shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  {displayName}
                </div>
              )}
              {displayName && (
                <p className="text-[11px] text-white/25 mb-5">
                  Ask anything about this API…
                </p>
              )}

              {/* API Breakdown — without description */}
              {apiData && (
                <div className="w-full max-w-[340px]">
                  <ApiBreakdown
                    api={{ ...apiData, description: undefined }}
                  />
                </div>
              )}

              {/* Suggested Prompts */}
              <div className="w-full max-w-[340px] mt-5">
                <SuggestedPrompts
                  onClick={(text: string) => {
                    sendMessage(text);
                  }}
                />
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex flex-col gap-2.5 px-3">
            {chat.map((msg, i) => (
              <div key={i} className="msg-enter">
                <MessagePill role={msg.role} content={msg.content} />
              </div>
            ))}
            {loading && (
              <div className="msg-enter flex justify-start pl-2">
                <TypingIndicator />
              </div>
            )}
          </div>
          <div ref={bottomRef} className="h-2" />
        </div>

        {/* ── INPUT AREA ── */}
        <div className="relative z-20 flex-shrink-0 px-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom,16px))] bg-[#060D0A]/97 border-t border-white/5">
          <div className="shim-line h-px rounded-full mb-2.5 opacity-45" />

          <ClaudeInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            disabled={loading}
            isLoggedIn={isLoggedIn}
            onNeedLogin={redirectToAccess}
            placeholder={inputPlaceholder}
          />

          <p className="text-center text-[10px] text-white/10 mt-2 tracking-wider">
            Powered by Apives AI · Results may vary
          </p>
        </div>
      </div>
    </>
  );
};

export default AskApivesPage;