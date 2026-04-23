import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  X,
  Trash2,
  GitCompare,
  Mic,
  ArrowUp,
  Sparkles,
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

// ─── All styles ───────────────────────────────────────────────────────────────
const STYLES = `
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

  .chat-scroll::-webkit-scrollbar { width: 3px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.15); border-radius: 99px; }

  @keyframes msgSlide {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .msg-enter { animation: msgSlide 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  @keyframes floatOrb {
    0%,100% { transform: translateY(0px) scale(1) rotate(0deg); }
    33%      { transform: translateY(-10px) scale(1.04) rotate(2deg); }
    66%      { transform: translateY(-5px) scale(0.97) rotate(-2deg); }
  }
  .animate-float { animation: floatOrb 5s ease-in-out infinite; }

  @keyframes orbSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .orb-spin { animation: orbSpin 8s linear infinite; }

  @keyframes gradShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  .grad-anim {
    background-size: 200% 200%;
    animation: gradShift 4s ease infinite;
  }

  @keyframes typingBounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.35; }
    30%         { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes pulseGreen {
    0%   { box-shadow: 0 0 0 0 rgba(52,211,153,0.45); }
    70%  { box-shadow: 0 0 0 10px rgba(52,211,153,0); }
    100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
  }
  .pulse-green { animation: pulseGreen 2.2s ease-in-out infinite; }

  @keyframes wordFadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .word-in { animation: wordFadeIn 0.3s ease forwards; }
  .word-out { animation: wordFadeIn 0.3s ease reverse forwards; }

  @keyframes pageIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-in { animation: pageIn 0.4s ease forwards; }

  @keyframes shimLine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shim-line {
    background: linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.3) 50%, transparent 100%);
    background-size: 200% auto;
    animation: shimLine 2.5s linear infinite;
  }

  .glass-pill-user {
    background: rgba(52,211,153,0.10);
    border: 1px solid rgba(52,211,153,0.22);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .glass-pill-ai {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .glass-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(52,211,153,0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .glass-input:focus-within {
    border-color: rgba(52,211,153,0.38);
    box-shadow: 0 0 0 3px rgba(52,211,153,0.07);
  }
  .glass-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    backdrop-filter: blur(12px);
    transition: background 0.2s;
  }
  .glass-btn:hover { background: rgba(255,255,255,0.09); }

  .green-glow { box-shadow: 0 0 16px rgba(52,211,153,0.22), 0 0 36px rgba(52,211,153,0.08); }

  textarea { resize: none; scrollbar-width: none; }
  textarea::-webkit-scrollbar { display: none; }
`;

// ─── Rotating orb words ───────────────────────────────────────────────────────
const ORB_WORDS = ["APIs", "DISCOVER", "INTEGRATE", "ASK AI", "EXPLORE", "BUILD"];

const AnimatedOrb = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ORB_WORDS.length);
        setShow(true);
      }, 280);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center animate-float">
      {/* Glow halo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.32) 0%, rgba(16,185,129,0.12) 55%, transparent 75%)",
          filter: "blur(14px)",
        }}
      />
      {/* Spinning ring */}
      <div
        className="orb-spin"
        style={{
          position: "absolute",
          inset: "4px",
          borderRadius: "50%",
          border: "1px solid transparent",
          borderTopColor: "rgba(52,211,153,0.55)",
          borderRightColor: "rgba(52,211,153,0.12)",
        }}
      />
      {/* Main sphere */}
      <div
        style={{
          position: "absolute",
          inset: "12px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 28%, #6ee7b7, #10b981 45%, #065f46 85%)",
          boxShadow:
            "inset 0 2px 10px rgba(255,255,255,0.22), 0 0 28px rgba(52,211,153,0.50)",
        }}
      />
      {/* Shine */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "26%",
          width: "30%",
          height: "22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.65), transparent 70%)",
        }}
      />
      {/* Rotating word */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {show && (
          <span
            className="word-in"
            style={{
              fontSize: "8px",
              fontWeight: 900,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.88)",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {ORB_WORDS[idx]}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div
    className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-sm w-fit glass-pill-ai"
  >
    <div className="relative w-4 h-4 flex-shrink-0">
      <div
        className="absolute inset-0 rounded-full orb-spin"
        style={{
          background:
            "conic-gradient(rgba(52,211,153,0.9), rgba(16,185,129,0.15), rgba(52,211,153,0.9))",
          filter: "blur(1px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{ inset: "2px", background: "#060D0A", borderRadius: "50%" }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: "4px",
          background: "radial-gradient(circle, #6ee7b7, #10b981)",
          borderRadius: "50%",
        }}
      />
    </div>
    <span
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(52,211,153,0.55)",
      }}
    >
      Thinking
    </span>
    <div className="flex gap-[3px] items-end pb-[1px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#34d399",
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

// ─── Message Pill ─────────────────────────────────────────────────────────────
const MessagePill = ({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) => {
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: "0 4px",
      }}
    >
      {!isUser && (
        <div
          style={{
            flexShrink: 0,
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            marginRight: "8px",
            marginTop: "4px",
            background: "radial-gradient(circle at 35% 30%, #6ee7b7, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={10} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div
        className={isUser ? "glass-pill-user" : "glass-pill-ai"}
        style={{
          maxWidth: "82%",
          padding: "10px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          fontSize: "13px",
          lineHeight: "1.6",
          fontWeight: 500,
          color: isUser ? "rgba(236,253,245,0.92)" : "rgba(255,255,255,0.78)",
          wordBreak: "break-word",
        }}
      >
        {content}
      </div>
    </div>
  );
};

// ─── Clear Modal ──────────────────────────────────────────────────────────────
const ClearModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBottom: "32px",
      background: "rgba(0,0,0,0.72)",
      backdropFilter: "blur(12px)",
    }}
  >
    <div
      style={{
        width: "88%",
        maxWidth: "320px",
        borderRadius: "24px",
        padding: "24px",
        background: "rgba(8,20,14,0.97)",
        border: "1px solid rgba(52,211,153,0.13)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.65)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "14px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Trash2 size={16} color="#f87171" />
      </div>
      <p style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "6px" }}>
        Clear chat history?
      </p>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", lineHeight: "1.6", marginBottom: "20px" }}>
        This will permanently remove all messages for this API session.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onCancel}
          className="glass-btn"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "14px",
            fontSize: "12px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.45)",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "14px",
            fontSize: "12px",
            fontWeight: 600,
            background: "rgba(239,68,68,0.75)",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  </div>
);

// ─── Compare Modal ────────────────────────────────────────────────────────────
const CompareModal = ({ onClose }: { onClose: () => void }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBottom: "32px",
      background: "rgba(0,0,0,0.72)",
      backdropFilter: "blur(12px)",
    }}
  >
    <div
      style={{
        width: "92%",
        maxWidth: "360px",
        borderRadius: "24px",
        padding: "24px",
        background: "rgba(8,20,14,0.97)",
        border: "1px solid rgba(52,211,153,0.14)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.65)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(52,211,153,0.5)", marginBottom: "4px" }}>
            Feature
          </p>
          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "white" }}>Compare APIs</h3>
        </div>
        <button
          onClick={onClose}
          className="glass-btn"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={13} color="rgba(255,255,255,0.45)" />
        </button>
      </div>

      {/* Visual */}
      <div
        style={{
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "rgba(52,211,153,0.04)",
          border: "1px solid rgba(52,211,153,0.09)",
        }}
      >
        {["API A", "API B"].map((label, i) => (
          <>
            <div
              key={label}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "rgba(52,211,153,0.07)",
                border: "1px solid rgba(52,211,153,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 900, color: "#34d399" }}>{label}</span>
            </div>
            {i === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <div style={{ width: "10px", height: "1px", background: "rgba(52,211,153,0.35)" }} />
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(52,211,153,0.55)" }} />
                    <div style={{ width: "10px", height: "1px", background: "rgba(52,211,153,0.35)" }} />
                  </div>
                ))}
              </div>
            )}
          </>
        ))}
      </div>

      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: "1.7", marginBottom: "20px" }}>
        Compare endpoints, pricing, rate limits, and more — side by side. Coming soon.
      </p>
      <button
        onClick={onClose}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: "14px",
          fontSize: "13px",
          fontWeight: 700,
          background: "linear-gradient(135deg, #34d399, #10b981)",
          color: "#022c22",
          border: "none",
          cursor: "pointer",
        }}
      >
        Got it
      </button>
    </div>
  </div>
);

// ─── Claude-style Chat Input ──────────────────────────────────────────────────
const ClaudeInput = ({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
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
      if (hasText && !disabled) onSend();
    }
  };

  return (
    <div
      className="glass-input"
      style={{ borderRadius: "22px" }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask about this API..."
        rows={1}
        style={{
          width: "100%",
          background: "transparent",
          color: "rgba(255,255,255,0.85)",
          fontSize: "14px",
          lineHeight: "1.6",
          fontWeight: 500,
          outline: "none",
          padding: "14px 20px 6px",
          fontFamily: "inherit",
          caretColor: "#34d399",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 12px 10px",
        }}
      >
        <button
          className="glass-btn"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Mic size={13} color="rgba(255,255,255,0.28)" />
        </button>
        <button
          onClick={onSend}
          disabled={!hasText || disabled}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: hasText ? "pointer" : "default",
            background: hasText
              ? "linear-gradient(135deg, #34d399, #059669)"
              : "rgba(255,255,255,0.06)",
            border: hasText ? "none" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: hasText ? "0 4px 14px rgba(52,211,153,0.40)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowUp
            size={14}
            color={hasText ? "white" : "rgba(255,255,255,0.18)"}
            strokeWidth={2.8}
          />
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AskApivesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiId = searchParams.get("apiId");

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [contextPrompt, setContextPrompt] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat
  useEffect(() => {
    if (!apiId) return;
    try {
      const saved = localStorage.getItem(`apives_chat_${apiId}`);
      if (saved) setChat(JSON.parse(saved));
    } catch {}
  }, [apiId]);

  // Save chat
  useEffect(() => {
    if (!apiId) return;
    localStorage.setItem(`apives_chat_${apiId}`, JSON.stringify(chat));
  }, [chat, apiId]);

  // Fetch API data
  useEffect(() => {
    if (!apiId) return;
    axios
      .get(`/api/apis/${apiId}`)
      .then((res) => setApiData(res.data))
      .catch(() => {});
  }, [apiId]);

  // Context pill when coming from API details page
  useEffect(() => {
    if (apiData && chat.length === 0) {
      setContextPrompt(
        `You're exploring ${apiData.name || "this API"} — what would you like to know?`
      );
    }
  }, [apiData]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;
    setContextPrompt(null);
    const newChat = [...chat, { role: "user", content: text }];
    setChat(newChat);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("/api/ask-ai", { messages: newChat, apiData });
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
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
      <style>{STYLES}</style>

      {showClearModal && (
        <ClearModal onConfirm={clearChat} onCancel={() => setShowClearModal(false)} />
      )}
      {showCompareModal && (
        <CompareModal onClose={() => setShowCompareModal(false)} />
      )}

      <div
        className="page-in"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow: "hidden",
          background: "#060D0A",
          color: "white",
          fontFamily: "'Inter', -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* ── Ambient background ── */}
        <div
          style={{
            pointerEvents: "none",
            position: "fixed",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "-60px",
              width: "340px",
              height: "340px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-60px",
              right: "-60px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(5,150,105,0.10) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.022,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* ─────────── HEADER ─────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 20,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
            paddingBottom: "14px",
            background: "rgba(6,13,10,0.90)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(52,211,153,0.07)",
          }}
        >
          {/* Left: X + title */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(12px)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <X size={15} color="rgba(255,255,255,0.55)" />
            </button>
            <div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.92)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                Ask Apives AI
              </p>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: "rgba(52,211,153,0.50)",
                  marginTop: "1px",
                }}
              >
                API Intelligence Assistant
              </p>
            </div>
          </div>

          {/* Right: icon-only buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {hasHistory && (
              <button
                onClick={() => setShowClearModal(true)}
                className="glass-btn"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Clear chat"
              >
                <Trash2 size={14} color="rgba(255,255,255,0.30)" />
              </button>
            )}
            <button
              onClick={() => setShowCompareModal(true)}
              className="pulse-green"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(52,211,153,0.10)",
                border: "1px solid rgba(52,211,153,0.22)",
                cursor: "pointer",
              }}
              title="Compare APIs"
            >
              <GitCompare size={14} color="#34d399" />
            </button>
          </div>
        </div>

        {/* ─────────── API PILL ─────────── */}
        {apiData && (
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              padding: "12px 20px 0",
            }}
          >
            <div
              className="green-glow"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "99px",
                background: "rgba(52,211,153,0.07)",
                border: "1px solid rgba(52,211,153,0.20)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#34d399",
                  flexShrink: 0,
                  animation: "pulseGreen 2s infinite",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  color: "#6ee7b7",
                }}
              >
                {apiData.name}
              </span>
              {apiData.category && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "10px" }}>·</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>
                    {apiData.category}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─────────── CHAT SCROLL AREA ─────────── */}
        <div
          ref={scrollRef}
          className="chat-scroll"
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            overflowY: "auto",
            padding: "16px 0",
            minHeight: 0,
          }}
        >
          {/* Empty State */}
          {chat.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
                padding: "24px 24px 8px",
                textAlign: "center",
              }}
            >
              <AnimatedOrb />

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "white",
                  marginTop: "20px",
                  marginBottom: "8px",
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                }}
              >
                Ask anything about
                <br />
                <span
                  className="grad-anim"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #34d399, #10b981, #6ee7b7, #34d399)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  this API
                </span>
              </h2>

              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.26)",
                  lineHeight: 1.7,
                  maxWidth: "220px",
                  marginBottom: "24px",
                }}
              >
                Understand endpoints, parameters, auth, and integration instantly.
              </p>

              {/* Context pill from API details */}
              {contextPrompt && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "10px 18px",
                    borderRadius: "18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    maxWidth: "300px",
                    textAlign: "center",
                    background: "rgba(52,211,153,0.07)",
                    border: "1px solid rgba(52,211,153,0.16)",
                    color: "rgba(52,211,153,0.70)",
                  }}
                >
                  {contextPrompt}
                </div>
              )}

              {/* API Breakdown — no description */}
              {apiData && (
                <div style={{ width: "100%", maxWidth: "340px" }}>
                  <ApiBreakdown api={{ ...apiData, description: undefined }} />
                </div>
              )}

              {/* Suggested Prompts */}
              <div style={{ width: "100%", maxWidth: "340px", marginTop: "16px" }}>
                <SuggestedPrompts onClick={(text: string) => sendMessage(text)} />
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "0 12px" }}>
            {chat.map((msg, i) => (
              <div key={i} className="msg-enter">
                <MessagePill role={msg.role} content={msg.content} />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="msg-enter" style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <TypingIndicator />
              </div>
            )}
          </div>

          <div ref={bottomRef} style={{ height: "8px" }} />
        </div>

        {/* ─────────── INPUT AREA ─────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 20,
            flexShrink: 0,
            padding: "8px 16px",
            paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
            background:
              "linear-gradient(0deg, rgba(6,13,10,1) 60%, rgba(6,13,10,0) 100%)",
          }}
        >
          {/* Top shimmer line */}
          <div
            className="shim-line"
            style={{ height: "1px", borderRadius: "99px", marginBottom: "10px", opacity: 0.5 }}
          />

          <ClaudeInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            disabled={loading}
          />

          <p
            style={{
              textAlign: "center",
              fontSize: "10px",
              color: "rgba(255,255,255,0.11)",
              marginTop: "8px",
              letterSpacing: "0.03em",
            }}
          >
            Powered by Apives AI · Results may vary
          </p>
        </div>
      </div>
    </>
  );
};

export default AskApivesPage;