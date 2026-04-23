import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import ChatBubble from "../components/ai/ChatBubble";
import ChatInput from "../components/ai/ChatInput";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

// ─── Typing animation dots ───────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm w-fit
    bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
    {/* Animated orb */}
    <div className="relative w-5 h-5 mr-2">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 animate-spin-slow blur-[2px] opacity-80" />
      <div className="absolute inset-[2px] rounded-full bg-[#0A0A0F]" />
      <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-violet-400 to-pink-400 opacity-90" />
    </div>
    <span className="text-[11px] font-semibold tracking-widest uppercase text-white/40 mr-1">
      Thinking
    </span>
    <span className="flex gap-[3px] items-end pb-[1px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-gradient-to-b from-violet-400 to-pink-400"
          style={{
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
    <style>{`
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-5px); opacity: 1; }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradientShift 4s ease infinite;
      }
      @keyframes floatOrb {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
        50% { transform: translateY(-12px) scale(1.05); opacity: 0.9; }
      }
      .animate-float { animation: floatOrb 4s ease-in-out infinite; }
      @keyframes pulseRing {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(139,92,246,0.4); }
        70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(139,92,246,0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(139,92,246,0); }
      }
      .animate-pulse-ring { animation: pulseRing 2s ease-in-out infinite; }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .animate-shimmer {
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
        background-size: 200% auto;
        animation: shimmer 2s linear infinite;
      }
    `}</style>
  </div>
);

// ─── Clear chat confirm modal ─────────────────────────────────────────────────
const ClearModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-[#13131A] border border-white/10 rounded-2xl p-6 w-[280px] shadow-2xl">
      <h3 className="text-sm font-bold text-white mb-1">Clear History?</h3>
      <p className="text-xs text-white/40 mb-5">
        This will permanently delete your chat for this API.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90 transition"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const AskApivesPage = () => {
  const [params] = useSearchParams();
  const apiId = params.get("apiId");

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // 🔥 LOAD CHAT FROM LOCAL STORAGE
  useEffect(() => {
    if (!apiId) return;
    const saved = localStorage.getItem(`apives_chat_${apiId}`);
    if (saved) {
      try {
        setChat(JSON.parse(saved));
      } catch {}
    }
  }, [apiId]);

  // 🔥 SAVE CHAT PER API
  useEffect(() => {
    if (!apiId) return;
    localStorage.setItem(`apives_chat_${apiId}`, JSON.stringify(chat));
  }, [chat, apiId]);

  // fetch API
  useEffect(() => {
    if (!apiId) return;
    const fetchApi = async () => {
      try {
        const res = await axios.get(`/api/apis/${apiId}`);
        setApiData(res.data);
      } catch {}
    };
    fetchApi();
  }, [apiId]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newChat = [...chat, { role: "user", content: userMsg }];
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
          content: "Something went wrong. Please try again.",
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

  return (
    <>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        .page-enter { opacity: 0; transform: translateY(8px); }
        .page-visible { opacity: 1; transform: translateY(0); transition: opacity 0.4s ease, transform 0.4s ease; }
        .pill-glow {
          box-shadow: 0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(236,72,153,0.15);
        }
        .input-area-glow {
          box-shadow: 0 -1px 0 0 rgba(255,255,255,0.05), 0 -20px 40px rgba(10,10,15,0.8);
        }
        .msg-enter {
          animation: msgSlide 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {showClearModal && (
        <ClearModal
          onConfirm={clearChat}
          onCancel={() => setShowClearModal(false)}
        />
      )}

      <div
        className={`flex flex-col bg-[#0A0A0F] text-white font-poppins ${
          mounted ? "page-visible" : "page-enter"
        }`}
        style={{
          height: "100dvh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Ambient background orbs ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div
            className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full opacity-20 animate-float"
            style={{
              background:
                "radial-gradient(circle, #7c3aed 0%, #4f46e5 50%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute -bottom-24 -right-20 w-[360px] h-[360px] rounded-full opacity-15 animate-float"
            style={{
              background:
                "radial-gradient(circle, #ec4899 0%, #f97316 50%, transparent 70%)",
              filter: "blur(60px)",
              animationDelay: "2s",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* ─────────────────── HEADER ─────────────────── */}
        <div
          className="relative z-10 flex-shrink-0 flex items-center justify-between px-5"
          style={{
            paddingTop: "env(safe-area-inset-top, 16px)",
            paddingBottom: "14px",
            background:
              "linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.92) 100%)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg animate-pulse-ring">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 leading-none mb-[3px]">
                Apives
              </p>
              <h1 className="text-[14px] font-bold tracking-tight text-white leading-none">
                Ask AI
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {hasHistory && (
              <button
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full
                  bg-white/5 border border-white/8 text-white/40 hover:text-white/70
                  hover:bg-white/10 transition-all duration-200"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Clear
              </button>
            )}
            <button
              onClick={() => alert("Compare feature coming soon 🚀")}
              className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full
                bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/20
                text-violet-300 hover:from-violet-600/30 hover:to-pink-600/30
                transition-all duration-200 font-semibold"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              Compare
            </button>
          </div>
        </div>

        {/* ─────────────────── API PILL ─────────────────── */}
        {apiData && (
          <div className="relative z-10 flex-shrink-0 flex justify-center px-5 pt-3 pb-1">
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full pill-glow
                bg-gradient-to-r from-violet-600/15 to-pink-600/15
                border border-violet-500/25 backdrop-blur-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wide text-violet-200">
                {apiData.name}
              </span>
              {apiData.category && (
                <>
                  <span className="text-white/20 text-[10px]">·</span>
                  <span className="text-[10px] text-white/35 font-medium">
                    {apiData.category}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────── CHAT AREA ─────────────────── */}
        <div
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3"
          style={{ minHeight: 0 }}
        >
          {/* ── Empty State ── */}
          {chat.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-full py-8 text-center">
              {/* Animated orb hero */}
              <div className="relative w-28 h-28 mb-6">
                <div
                  className="absolute inset-0 rounded-full animate-float"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 35%, #a78bfa, #ec4899, #f97316)",
                    filter: "blur(18px)",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="absolute inset-3 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, #c4b5fd, #f472b6 60%, #fb923c)",
                    boxShadow:
                      "inset 0 2px 8px rgba(255,255,255,0.3), 0 0 30px rgba(139,92,246,0.4)",
                  }}
                />
                {/* Shine */}
                <div
                  className="absolute inset-[14px] rounded-full opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.7), transparent 55%)",
                  }}
                />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white mb-2">
                Ask anything about
                <br />
                <span
                  className="animate-gradient bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #a78bfa, #ec4899, #fb923c, #a78bfa)",
                  }}
                >
                  this API
                </span>
              </h2>

              <p className="text-[12px] text-white/35 leading-relaxed max-w-[230px] mb-8">
                Understand endpoints, parameters, auth, and integration
                instantly.
              </p>

              {/* API Breakdown */}
              {apiData && (
                <div className="w-full max-w-[340px]">
                  <ApiBreakdown api={apiData} />
                </div>
              )}

              {/* Suggested Prompts */}
              <div className="w-full max-w-[340px] mt-4">
                <SuggestedPrompts onClick={(text: string) => setInput(text)} />
              </div>
            </div>
          )}

          {/* ── Messages ── */}
          {chat.map((msg, i) => (
            <div key={i} className="msg-enter">
              <ChatBubble role={msg.role} content={msg.content} />
            </div>
          ))}

          {/* ── Loading indicator ── */}
          {loading && (
            <div className="msg-enter flex justify-start pl-1">
              <TypingIndicator />
            </div>
          )}

          <div ref={bottomRef} className="h-2" />
        </div>

        {/* ─────────────────── INPUT AREA ─────────────────── */}
        <div
          className="relative z-10 flex-shrink-0 px-4 pt-3 pb-4 input-area-glow"
          style={{
            paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
            background:
              "linear-gradient(0deg, rgba(10,10,15,1) 60%, rgba(10,10,15,0) 100%)",
          }}
        >
          {/* Shimmer line at top */}
          <div
            className="absolute top-0 left-8 right-8 h-px rounded-full opacity-40"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.4) 30%, rgba(236,72,153,0.4) 70%, transparent)",
            }}
          />

          <ChatInput value={input} setValue={setInput} onSend={sendMessage} />

          {/* Footer hint */}
          <p className="text-center text-[10px] text-white/15 mt-2 tracking-wide">
            Powered by Apives AI · Results may vary
          </p>
        </div>
      </div>
    </>
  );
};

export default AskApivesPage;