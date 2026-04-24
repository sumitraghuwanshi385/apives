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
Plus,
  ChevronRight,
  Zap,
  Shield,
  Search,
  Link2,
  Radio,
  Brain,
  Bolt,
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";
import HistoryModal from "../components/ai/HistoryModal";
import CompareModal from "../components/ai/CompareModal";
import AnimatedOrb from "../components/ai/AnimatedOrb";

// ─── Global Styles ──────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

  /* Hide global Navbar + Footer on this page */
  body > nav,
  #root > nav,
  nav[data-global],
  header[data-global],
  body > footer,
  #root > footer,
  footer { display: none !important; }

  .chat-scroll::-webkit-scrollbar { width: 3px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(21,128,61,0.25); border-radius: 99px; }

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
    background: linear-gradient(90deg, transparent 0%, rgba(21,128,61,0.25) 50%, transparent 100%);
    background-size: 200% auto;
    animation: shimLine 2.5s linear infinite;
  }

  @keyframes orbGlow {
    0%,100% { box-shadow: 0 0 28px rgba(21,128,61,0.45), inset 0 2px 10px rgba(255,255,255,0.16); }
    50%      { box-shadow: 0 0 48px rgba(21,128,61,0.75), inset 0 2px 12px rgba(255,255,255,0.22); }
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

  /* 🔥 USER MESSAGE */
  .glass-pill-user {
    background: rgba(21,128,61,0.18);
    border: 1px solid rgba(21,128,61,0.45);
    backdrop-filter: blur(16px);
  }

  .glass-pill-ai {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
  }

  /* 🔥 INPUT BOX */
  .glass-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(21,128,61,0.45);
    backdrop-filter: blur(20px);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .glass-input:focus-within {
    border-color: rgba(21,128,61,0.9);
    box-shadow: 0 0 0 3px rgba(21,128,61,0.18);
  }

  .glass-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
    transition: background 0.2s, transform 0.15s;
  }
  .glass-btn:hover { background: rgba(255,255,255,0.09); transform: scale(1.04); }

  /* 🔥 CLOSE BTN */
  .close-btn-green {
    position: relative;
    overflow: hidden;
    background: rgba(21,128,61,0.15) !important;
    border: 1px solid rgba(21,128,61,0.45) !important;
    transition: background 0.2s, transform 0.15s;
  }

  .close-btn-green::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: linear-gradient(to right, #22c55e, transparent);
    opacity: 0.8;
    border-radius: 99px 99px 0 0;
  }

  .close-btn-green:hover {
    background: rgba(21,128,61,0.28) !important;
    transform: scale(1.04);
  }

  /* 🔥 COMPARE */
  .compare-select-btn { transition: all 0.2s ease; cursor: pointer; }

  .compare-select-btn:hover {
    border-color: rgba(21,128,61,0.7) !important;
    background: rgba(21,128,61,0.18) !important;
  }

  .compare-select-btn.selected {
    border-color: rgba(21,128,61,0.9) !important;
    background: rgba(21,128,61,0.22) !important;
  }

  /* 🔥 HISTORY */
  .history-item { transition: background 0.15s; cursor: pointer; }
  .history-item:hover { background: rgba(21,128,61,0.12) !important; }

  textarea { resize: none; scrollbar-width: none; }
  textarea::-webkit-scrollbar { display: none; }
`;

// ─── RobotAnimatedOrb ─────────────────────────────────────────────────────────────


// ─── TypingIndicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", borderRadius: "18px 18px 18px 4px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)", width: "fit-content",
  }}>
    <div style={{ position: "relative", width: "14px", height: "14px" }}>
      <div style={{
        position: "absolute", inset: "3px", borderRadius: "50%",
        background: "radial-gradient(circle, #6ee7b7, #10b981)",
      }} />
    </div>
    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(52,211,153,0.55)" }}>
      Thinking
    </span>
    <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", paddingBottom: "1px" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          display: "inline-block", width: "4px", height: "4px", borderRadius: "50%",
          background: "#34d399",
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  </div>
);

// ─── MessagePill ──────────────────────────────────────────────────────────────
const MessagePill = ({ role, content }: { role: "user" | "assistant"; content: string }) => {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", padding: "0 4px" }}>
      {!isUser && (
        <div style={{
          flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%",
          marginRight: "8px", marginTop: "4px",
          background: "radial-gradient(circle at 35% 30%, #6ee7b7, #059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={10} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div className={isUser ? "glass-pill-user" : "glass-pill-ai"} style={{
        maxWidth: "82%", padding: "10px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        fontSize: "13px", lineHeight: "1.65", fontWeight: 450,
        color: isUser ? "rgba(236,253,245,0.92)" : "rgba(255,255,255,0.80)",
        wordBreak: "break-word", whiteSpace: "pre-wrap",
      }}>
        {content}
      </div>
    </div>
  );
};

// ─── ClearModal ───────────────────────────────────────────────────────────────
const ClearModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 60,
    display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "32px",
    background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)",
  }}>
    <div className="slide-up" style={{
      width: "88%", maxWidth: "320px", borderRadius: "24px", padding: "24px",
      background: "rgba(6,16,11,0.98)", border: "1px solid rgba(52,211,153,0.12)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.70)",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "14px",
        background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
      }}>
        <Trash2 size={16} color="#f87171" />
      </div>
      <p style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "6px" }}>
        Clear chat history?
      </p>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", lineHeight: "1.6", marginBottom: "20px" }}>
        This will permanently remove all messages for this API session.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onCancel} className="glass-btn" style={{
          flex: 1, padding: "10px", borderRadius: "14px",
          fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.45)", cursor: "pointer",
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: "10px", borderRadius: "14px", fontSize: "13px", fontWeight: 600,
          background: "rgba(239,68,68,0.75)", color: "white", border: "none", cursor: "pointer",
        }}>Clear</button>
      </div>
    </div>
  </div>
);

// ─── HistoryModal ─────────────────────────────────────────────────────────────

// ─── CompareModal ─────────────────────────────────────────────────────────────


// ─── MicButton ────────────────────────────────────────────────────────────────
const MicButton = ({ onTranscript, disabled }: { onTranscript: (t: string) => void; disabled: boolean }) => {
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
      className={listening ? "mic-active" : ""}
      title={listening ? "Listening… tap to stop" : "Voice input"}
      style={{
        width: "32px", height: "32px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: listening ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.05)",
        border: listening ? "1px solid rgba(239,68,68,0.45)" : "1px solid rgba(255,255,255,0.09)",
        cursor: "pointer", transition: "all 0.2s",
      }}
    >
      {listening
        ? <MicOff size={13} color="#f87171" />
        : <Mic size={13} color="rgba(255,255,255,0.40)" />
      }
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
        onSend();
      }
    }
  };


  return (
    <div className="glass-input" style={{ borderRadius: "22px" }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        rows={1}
        style={{
          width: "100%", background: "transparent",
          color: "rgba(255,255,255,0.85)", fontSize: "14px",
          lineHeight: "1.6", fontWeight: 450, outline: "none",
          padding: "14px 20px 6px", fontFamily: "inherit", caretColor: "#34d399",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 12px 10px" }}>
        <MicButton
          onTranscript={(t) => onChange(value + (value ? " " : "") + t)}
          disabled={disabled}
        />
        <button
          onClick={() => {
            onSend();
          }}
          disabled={!hasText || disabled}
          style={{
            width: "32px", height: "32px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: hasText ? "pointer" : "default",
            background: hasText
  ? "rgba(21,128,61,0.35)"
  : "rgba(255,255,255,0.06)",

border: hasText
  ? "1px solid rgba(21,128,61,0.7)"
  : "1px solid rgba(255,255,255,0.08)",

boxShadow: hasText
  ? "0 0 18px rgba(21,128,61,0.5)"
  : "none",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowUp
            size={14}
            color={hasText ? "#22c55e" : "rgba(255,255,255,0.18)"}
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

useEffect(() => {
  const checkAuth = () => {
    setIsLoggedIn(isValidUser());
  };

  checkAuth();

  // 🔥 other tabs detect
  window.addEventListener("storage", checkAuth);

  // 🔥 same tab instant fix (IMPORTANT)
  const interval = setInterval(checkAuth, 1000);

  return () => {
    window.removeEventListener("storage", checkAuth);
    clearInterval(interval);
  };
}, []);

const isValidUser = () => {
  const token = localStorage.getItem("apives_token");
  const user = localStorage.getItem("apives_user");

  if (!token) return false;

  if (!user) return false;

  try {
    JSON.parse(user);
    return true; // 🔥 bas parse ho gaya = logged in
  } catch {
    return false;
  }
};

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Redirect helper — used for every auth-gated action
  const redirectToAccess = () => {
    navigate(
      `/access?returnUrl=${encodeURIComponent(
        window.location.pathname + window.location.search
      )}`
    );
  };

  const requireLogin = (): boolean => {
  const valid = isValidUser(); // 🔥 direct check
  if (!valid) {
    redirectToAccess();
    return false;
  }
  return true;
};

useEffect(() => {
  const hideGlobalLayout = () => {
    const nav = document.querySelector("nav");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (nav) nav.style.display = "none";
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
  };

  hideGlobalLayout();

  return () => {
    const nav = document.querySelector("nav");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (nav) nav.style.display = "";
    if (header) header.style.display = "";
    if (footer) footer.style.display = "";
  };
}, []);

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
      localStorage.setItem(`apives_chat_title_${apiId}`, firstUser.content.slice(0, 60));
    }
  }, [chat, apiId]);

  // Fetch API data
  useEffect(() => {
    if (!apiId) return;
    axios.get(`/api/apis/${apiId}`)
      .then((res) => setApiData(res.data))
      .catch(() => {});
  }, [apiId]);

  // Auto scroll
  useEffect(() => {
  if (!scrollRef.current) return;

  const el = scrollRef.current;

  // only auto scroll if already near bottom
  const distanceFromBottom =
    el.scrollHeight - el.scrollTop - el.clientHeight;

  if (distanceFromBottom < 100) {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }
}, [chat, loading]);

  const sendMessage = async (overrideText) => {
  const text = (overrideText ?? input).trim();
  if (!text) return;

  const newChat = [
    ...chat,
    { role: "user", content: text },
  ];

  setChat(newChat);
  setInput("");
  setLoading(true);

  try {
    // 🔥 PRIMARY: GROQ
    const res = await axios.post(
      "https://apives-3xrc.onrender.com/api/ask-ai",
      {
        messages: newChat,
        apiData,
      }
    );

    setChat((prev) => [
      ...prev,
      { role: "assistant", content: res.data.answer },
    ]);

  } catch (err) {
    console.log("⚠️ Groq failed → switching to Gemini");

    try {
      // 🤖 FALLBACK: GEMINI
      const geminiRes = await axios.post(
        "https://apives-3xrc.onrender.com/api/gemini",
        {
          prompt: text,
        }
      );

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: geminiRes.data.result },
      ]);

    } catch (err2) {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "All AI services are down. Try again later.",
        },
      ]);
    }
  } finally {
    // ✅ ALWAYS RUNS
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
      <style>{GLOBAL_STYLES}</style>

      {/* Modals */}
      {showClearModal && (
        <ClearModal onConfirm={clearChat} onCancel={() => setShowClearModal(false)} />
      )}
      {showCompareModal && (
        <CompareModal
          onClose={() => setShowCompareModal(false)}
          isLoggedIn={isLoggedIn}
          onNeedLogin={() => { setShowCompareModal(false); redirectToAccess(); }}
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

      <div
        className="page-in"
        style={{
          display: "flex", flexDirection: "column", height: "100dvh",
minHeight: "100dvh",
overflow: "hidden",
paddingBottom: "env(keyboard-inset-height, 0px)", background: "#060D0A", color: "white",
          fontFamily: "inherit", position: "relative",
        }}
      >
        {/* Ambient background */}
        <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
          
          
          <div style={{
            position: "absolute", inset: 0, opacity: 0.016,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />
        </div>

        {/* ── HEADER ── */}
        <div style={{
          position: "relative", zIndex: 20, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: "16px", paddingRight: "16px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
          paddingBottom: "14px",
          background: "rgba(6,13,10,0.95)", backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderBottom: "1px solid rgba(52,211,153,0.07)",
        }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
  <button
    onClick={() => navigate(-1)}
    className="glass-btn"
    style={{
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(12px)",
      cursor: "pointer",
    }}
  >
    <X size={15} className="text-white/60" />
  </button>

  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  
  {/* Logo + Text vertical */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
    
    {/* Logo */}
    <img
      src="https://res.cloudinary.com/dp7avkarg/image/upload/v1777024712/Picsart_26-04-24_15-27-41-095_dwsga0.png"
      alt="Apives"
      style={{
        height: "22px",
        objectFit: "contain",
      }}
    />

    {/* Subtitle under logo */}
    <span
  style={{
    fontSize: "9px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.06em",
    marginTop: "2px",
    fontFamily: "inherit",
  }}
>
  AI Assistant
</span>

  </div>

</div>
</div>


          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
  onClick={() => {
  if (!requireLogin()) return;
  setShowHistoryModal(true);
}}
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
title="Chat history"

> 

  <History size={14} color="rgba(255,255,255,0.40)" />  
</button>  {hasHistory && (  
          <button  
            onClick={() => setShowClearModal(true)}  
            className="glass-btn"  
            style={{  
              width: "36px", height: "36px", borderRadius: "50%",  
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",  
            }}  
          >  
            <Trash2 size={14} color="rgba(255,255,255,0.30)" />  
          </button>  
        )}  
        <button  
          onClick={() => {  
            if (!requireLogin()) return;  
            setShowCompareModal(true);  
          }}  
          style={{  
            width: "36px", height: "36px", borderRadius: "50%",  
            display: "flex", alignItems: "center", justifyContent: "center",  
            background: "rgba(34,197,94,0.18)",

border: "1px solid rgba(34,197,94,0.5)",
cursor: "pointer", transition: "all 0.2s",
}}
title="Compare APIs"
>
<GitCompare size={14} color="#4ade80"/>
</button>
</div>
</div>

        {/* ── CHAT AREA ── */}
        <div
  ref={scrollRef}
  className="chat-scroll"
  style={{
  position: "relative",
  zIndex: 10,
  flex: 1,
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  paddingTop: "16px",
  paddingBottom: "120px",
  minHeight: 0,
}}
>

  {/* ✅ EMPTY STATE FIX */}
  {chat.length === 0 && (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "32px 24px 8px",
        textAlign: "center",
      }}
    >
      <AnimatedOrb />

      <h2 style={{
        fontSize: "26px",
        fontWeight: 900,
        marginTop: "20px",
        marginBottom: "8px",
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      }}>
        The API Intelligence
        <br />
        <span style={{
          color: "#22c55e",
          textShadow: "0 0 12px rgba(34,197,94,0.5)"
        }}>
          You Deserve
        </span>
      </h2>
    

              <p style={{
                fontSize: "11px", color: "rgba(255,255,255,0.28)", lineHeight: 1.7,
                maxWidth: "220px", marginBottom: "20px",
              }}>
                Deep API analysis and instant answers on endpoints, auth, rate limits, and integration guidance.
              </p>

              {/* API context pill — shown when apiId / apiName is present */}
              {displayName && (
                <div style={{
                  marginBottom: "16px", padding: "8px 20px", borderRadius: "999px",
                  fontSize: "12px", fontWeight: 600, maxWidth: "280px", textAlign: "center",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(52,211,153,0.30)",
                  color: "rgba(52,211,153,0.75)", display: "inline-flex", alignItems: "center", gap: "8px",
                }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#34d399", flexShrink: 0,
                    boxShadow: "0 0 6px rgba(52,211,153,0.60)",
                  }} />
                  {displayName}
                </div>
              )}
              {displayName && (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginBottom: "20px" }}>
                  Ask anything about this API…
                </p>
              )}

              {/* API Breakdown — without description */}
              {apiData && (
                <div style={{ width: "100%", maxWidth: "340px" }}>
                  <ApiBreakdown api={apiData} />
                </div>
              )}

              {/* Suggested Prompts */}
              <div style={{ width: "100%", maxWidth: "340px", marginTop: "20px" }}>
                <SuggestedPrompts
                  onClick={(text: string) => {
                    
                    sendMessage(text);
                  }}
                />
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
            {loading && (
              <div className="msg-enter" style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <TypingIndicator />
              </div>
            )}
          </div>
          <div ref={bottomRef} style={{ height: "8px" }} />
        </div>

        {/* ── INPUT AREA ── */}
        <div style={{
          position: "relative", zIndex: 20, flexShrink: 0,
          padding: "8px 16px",
          paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
          background: "rgba(6,13,10,0.97)",
          borderTop: "none",
        }}>

          <ClaudeInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            disabled={loading}
            isLoggedIn={isLoggedIn}
            onNeedLogin={redirectToAccess}
            placeholder={inputPlaceholder}
          />

          <p style={{
            textAlign: "center", fontSize: "10px",
            color: "rgba(255,255,255,0.10)", marginTop: "8px", letterSpacing: "0.03em",
          }}>
            Powered by Apives AI · Results may vary
          </p>
        </div>
      </div>
    </>
  );
};

export default AskApivesPage;