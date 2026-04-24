import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

import {
  X,
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
  Copy,
  RotateCcw,
  Check,
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";
import HistoryModal from "../components/ai/HistoryModal";
import CompareModal from "../components/ai/CompareModal";
import AnimatedOrb from "../components/ai/AnimatedOrb";

// ─── Global Styles ───────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

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
    0%,60%,100% { transform: translateY(0); opacity: 0.3; }
    30%         { transform: translateY(-6px); opacity: 1; }
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

  @keyframes robotBlink {
    0%,80%,100% { transform: scaleY(1); }
    85%          { transform: scaleY(0.08); }
  }
  @keyframes scanPulse {
    0%,100% { opacity:0.5; transform: translateY(0); }
    50%     { opacity:1;   transform: translateY(2px); }
  }

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

  .compare-select-btn { transition: all 0.2s ease; cursor: pointer; }
  .compare-select-btn:hover {
    border-color: rgba(21,128,61,0.7) !important;
    background: rgba(21,128,61,0.18) !important;
  }
  .compare-select-btn.selected {
    border-color: rgba(21,128,61,0.9) !important;
    background: rgba(21,128,61,0.22) !important;
  }

  .history-item { transition: background 0.15s; cursor: pointer; }
  .history-item:hover { background: rgba(21,128,61,0.12) !important; }

  textarea { resize: none; scrollbar-width: none; }
  textarea::-webkit-scrollbar { display: none; }

  .ai-action-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 8px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.04em;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .ai-action-btn:hover {
    background: rgba(21,128,61,0.12);
    border-color: rgba(21,128,61,0.35);
    color: rgba(34,197,94,0.80);
  }

  /* FIX 3: API name pill */
  .api-name-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 2px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07);
  }
`;

// ─── Strip markdown helper ────────────────────────────────────────────────────
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`{3}[\s\S]*?`{3}/g, (m) =>
      m.replace(/`{3}[a-z]*\n?/g, "").replace(/`{3}/g, "").trim()
    )
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[-*+]\s/gm, "• ")
    .replace(/^\d+\.\s/gm, (m) => m)
    .replace(/_{2}(.+?)_{2}/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .trim();
}

// ─── Robot TypingIndicator ────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 16px", borderRadius: "16px 16px 16px 4px",
    background: "rgba(5,46,22,0.60)",
    border: "1px solid rgba(21,128,61,0.35)",
    backdropFilter: "blur(16px)",
    width: "fit-content",
    boxShadow: "0 0 20px rgba(21,128,61,0.15)",
  }}>
    <div style={{ position: "relative", width: "22px", height: "22px", flexShrink: 0 }}>
      <div style={{
        width: "22px", height: "22px", borderRadius: "6px",
        background: "linear-gradient(160deg, rgba(5,46,22,0.95), rgba(2,18,9,1))",
        border: "1px solid rgba(34,197,94,0.45)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "2px",
        boxShadow: "0 0 10px rgba(34,197,94,0.20)",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{ display: "flex", gap: "3px" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              width: "5px", height: "5px", borderRadius: "2px",
              background: "rgba(2,44,22,0.95)",
              border: "0.8px solid rgba(34,197,94,0.50)",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(2,44,22,0.99)",
                transformOrigin: "center",
                animation: `robotBlink 3.5s ease-in-out ${i * 0.15}s infinite`,
              }} />
              <div style={{
                width: "3px", height: "3px", borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #4ade80, #22c55e)",
                position: "relative", zIndex: 2,
              }} />
            </div>
          ))}
        </div>
        <div style={{
          width: "8px", height: "2px", borderRadius: "0 0 4px 4px",
          border: "0.8px solid rgba(34,197,94,0.50)", borderTop: "none",
        }} />
      </div>
    </div>
    <span style={{
      fontSize: "10px", fontWeight: 700,
      letterSpacing: "0.18em", textTransform: "uppercase",
      color: "rgba(34,197,94,0.60)", fontFamily: "monospace",
    }}>
      Thinking
    </span>
    <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", paddingBottom: "1px" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          display: "inline-block", width: "5px", height: "5px", borderRadius: "50%",
          background: `rgba(34,197,94,${0.4 + i * 0.2})`,
          boxShadow: `0 0 6px rgba(34,197,94,${0.3 + i * 0.2})`,
          animation: `typingBounce 1.1s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
  </div>
);

// ─── CopyButton ───────────────────────────────────────────────────────────────
const CopyButton = ({ text, label = "Copy" }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button className="ai-action-btn" onClick={copy}>
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : label}
    </button>
  );
};

// ─── MessagePill ──────────────────────────────────────────────────────────────
const MessagePill = ({
  role, content, onRegenerate,
}: {
  role: "user" | "assistant";
  content: string;
  onRegenerate?: () => void;
}) => {
  const isUser = role === "user";
  const cleanContent = isUser ? content : stripMarkdown(content);

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", padding: "0 4px" }}>
      {!isUser && (
        <div style={{
          flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%",
          marginRight: "8px", marginTop: "4px",
          background: "radial-gradient(circle at 35% 30%, #4ade80, #15803d)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 10px rgba(34,197,94,0.35)",
        }}>
          <Sparkles size={10} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "82%" }}>
        <div
          className={isUser ? "glass-pill-user" : "glass-pill-ai"}
          style={{
            padding: "10px 16px",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            fontSize: "13px", lineHeight: "1.70", fontWeight: 450,
            color: isUser ? "rgba(236,253,245,0.92)" : "rgba(255,255,255,0.82)",
            wordBreak: "break-word", whiteSpace: "pre-wrap",
            fontFamily: "'Apives Display', -apple-system, sans-serif",
          }}
        >
          {cleanContent}
        </div>
        {!isUser && (
          <div style={{ display: "flex", gap: "6px", paddingLeft: "4px" }}>
            <CopyButton text={cleanContent} />
            {onRegenerate && (
              <button className="ai-action-btn" onClick={onRegenerate}>
                <RotateCcw size={10} />
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── FIX 3: API Name Pill (Spotify-style glassmorphism) ──────────────────────
const ApiNamePill = ({ name, iconUrl }: { name: string; iconUrl?: string }) => (
  <div className="api-name-pill">
    {/* green dot indicator */}
    <div style={{
      width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
      background: "#22c55e",
      boxShadow: "0 0 8px rgba(34,197,94,0.70)",
    }} />
    {iconUrl && (
      <img
        src={iconUrl}
        alt={name}
        style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    )}
    <span style={{
      fontSize: "13px", fontWeight: 700,
      color: "rgba(255,255,255,0.90)",
      letterSpacing: "-0.01em",
    }}>
      {name}
    </span>
  </div>
);

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
    rec.onresult = (e: any) => { onTranscript(e.results[0][0].transcript); setListening(false); };
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
      {listening ? <MicOff size={13} color="#f87171" /> : <Mic size={13} color="rgba(255,255,255,0.40)" />}
    </button>
  );
};

// ─── FIX 2: ClaudeInput — NO auth check, always open ─────────────────────────
const ClaudeInput = ({
  value, onChange, onSend, disabled, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasText && !disabled) onSend();
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
        <MicButton onTranscript={(t) => onChange(value + (value ? " " : "") + t)} disabled={disabled} />
        {/* FIX 2: send always — no auth gate */}
        <button
          onClick={onSend}
          disabled={!hasText || disabled}
          style={{
            width: "32px", height: "32px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: hasText ? "pointer" : "default",
            background: hasText ? "rgba(21,128,61,0.35)" : "rgba(255,255,255,0.06)",
            border: hasText ? "1px solid rgba(21,128,61,0.7)" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: hasText ? "0 0 18px rgba(21,128,61,0.5)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowUp size={14} color={hasText ? "#22c55e" : "rgba(255,255,255,0.18)"} strokeWidth={2.8} />
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

  // ── FIX 1: Single source of truth — NO state, NO polling, NO interval ──────
  const isValidUser = (): boolean => {
  try {
    const data = localStorage.getItem("mora_user");

    if (!data) return false;

    const parsed = JSON.parse(data);

    // 🔥 IMPORTANT: token check
    return !!parsed?.token;
  } catch {
    return false;
  }
};

  const redirectToAccess = () => {
    navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  };

  // FIX 1: requireLogin reads localStorage directly — zero state lag
  const requireLogin = (): boolean => {
    const valid = isValidUser();
    if (!valid) {
      redirectToAccess();
      return false;
    }
    return true;
  };

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hide global layout
  useEffect(() => {
    const nav = document.querySelector("nav") as HTMLElement | null;
    const header = document.querySelector("header") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    if (nav) nav.style.display = "none";
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
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
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 100) {
      requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    }
  }, [chat, loading]);

  // FIX 2: sendMessage — NO auth check, always allowed
  // FIX 4: system prompt added to force specific answers
  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    const newChat = [...chat, { role: "user" as const, content: text }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    // FIX 4: inject system message for specific, non-generic responses
    const apiContext = apiData
      ? `The user is asking about the "${apiData.name}" API. Category: ${apiData.category || "N/A"}. Description: ${apiData.description || "N/A"}.`
      : "The user is asking about APIs in general.";

    const messagesWithSystem = [
      {
        role: "system",
        content: `You are an expert API assistant on Apives. Answer specifically and precisely based on the user's exact question. ${apiContext} Avoid generic or vague responses. Each answer must be unique, detailed, and directly relevant to what was asked.`,
      },
      ...newChat,
    ];

    try {
      const res = await axios.post("https://apives-3xrc.onrender.com/api/ask-ai", {
        messages: messagesWithSystem,
        apiData,
      });
      setChat((prev) => [...prev, { role: "assistant", content: res.data.answer }]);
    } catch {
      try {
        const geminiRes = await axios.post("https://apives-3xrc.onrender.com/api/gemini", { prompt: text });
        setChat((prev) => [...prev, { role: "assistant", content: geminiRes.data.result }]);
      } catch {
        setChat((prev) => [...prev, { role: "assistant", content: "All AI services are down. Try again later." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  // New Chat — keeps history, resets state
  const startNewChat = () => {
    setChat([]);
    setInput("");
  };

  // Regenerate last AI response
  const regenerateLast = () => {
    const lastUserMsg = [...chat].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    setChat((prev) => {
      const idx = [...prev].reverse().findIndex((m) => m.role === "assistant");
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return prev.slice(0, realIdx);
    });
    sendMessage(lastUserMsg.content);
  };

  // FIX 3: displayName derived reliably from URL param OR fetched apiData
  const displayName = apiName || apiData?.name || null;
  const inputPlaceholder = displayName
    ? `Ask anything about ${displayName}...`
    : "Ask anything about any API...";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* Modals */}
      {showCompareModal && (
        <CompareModal
          onClose={() => setShowCompareModal(false)}
          isLoggedIn={isValidUser()}
          onNeedLogin={() => { setShowCompareModal(false); redirectToAccess(); }}
        />
      )}
      {showHistoryModal && (
        <HistoryModal
          onClose={() => setShowHistoryModal(false)}
          onSelect={(id) => { setShowHistoryModal(false); navigate(`/ask-apives?apiId=${id}`); }}
        />
      )}

      <div
        className="page-in"
        style={{
          display: "flex", flexDirection: "column",
          height: "100dvh", minHeight: "100dvh", overflow: "hidden",
          paddingBottom: "env(keyboard-inset-height, 0px)",
          background: "#060D0A", color: "white",
          fontFamily: "inherit", position: "relative",
        }}
      >
        {/* Ambient dot grid */}
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
          borderBottom: "1px solid rgba(34,197,94,0.08)",
        }}>
          {/* Left: close + logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(-1)}
              className="glass-btn"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(12px)", cursor: "pointer",
              }}
            >
              <X size={15} className="text-white/60" />
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
              <img
                src="https://res.cloudinary.com/dp7avkarg/image/upload/v1777024712/Picsart_26-04-24_15-27-41-095_dwsga0.png"
                alt="Apives"
                style={{ height: "22px", objectFit: "contain" }}
              />
              <span style={{
                fontSize: "9px", fontWeight: 500,
                color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em",
                marginTop: "2px",
              }}>
                AI Assistant
              </span>
            </div>
          </div>

          {/* Right: history, new chat, compare */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* FIX 1: reads localStorage directly at click time — no stale state */}
            <button
              onClick={() => {
                if (!requireLogin()) return;
                setShowHistoryModal(true);
              }}
              className="glass-btn"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
              title="Chat history"
            >
              <History size={14} color="rgba(255,255,255,0.40)" />
            </button>

            {/* New Chat */}
            <button
              onClick={startNewChat}
              className="glass-btn"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
              title="New chat"
            >
              <Plus size={15} color="rgba(255,255,255,0.40)" />
            </button>

            {/* FIX 1: reads localStorage directly at click time */}
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
              <GitCompare size={14} color="#4ade80" />
            </button>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div
          ref={scrollRef}
          className="chat-scroll"
          style={{
            position: "relative", zIndex: 10,
            flex: 1, overflowY: "auto",
            WebkitOverflowScrolling: "touch" as any,
            paddingTop: "12px", paddingBottom: "120px",
            minHeight: 0,
          }}
        >
          {/* FIX 5: Tighter empty state padding */}
          {chat.length === 0 && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              minHeight: "100%",
              padding: "16px 24px 8px", // FIX 5: reduced from 32px
              textAlign: "center",
            }}>
              <AnimatedOrb />

              <h2 style={{
                fontSize: "26px", fontWeight: 900,
                marginTop: "14px", // FIX 5: reduced from 20px
                marginBottom: "6px", // FIX 5: reduced from 8px
                lineHeight: 1.2, letterSpacing: "-0.02em",
              }}>
                The API Intelligence
                <br />
                <span style={{ color: "#22c55e", textShadow: "0 0 12px rgba(34,197,94,0.5)" }}>
                  You Deserve
                </span>
              </h2>

              <p style={{
                fontSize: "11px", color: "rgba(255,255,255,0.28)", lineHeight: 1.7,
                maxWidth: "220px",
                marginBottom: "12px", // FIX 5: reduced from 20px
              }}>
                Deep API analysis and instant answers on endpoints, auth, rate limits, and integration guidance.
              </p>

              {/* FIX 3: API Name Pill — placed right below orb area, shows reliably */}
              {displayName && (
                <div style={{ marginBottom: "8px" }}> {/* FIX 5: reduced from 16px */}
                  <ApiNamePill
                    name={displayName}
                    iconUrl={apiData?.logo || apiData?.icon || undefined}
                  />
                </div>
              )}
              {displayName && (
                <p style={{
                  fontSize: "11px", color: "rgba(255,255,255,0.22)",
                  marginBottom: "12px", // FIX 5: reduced from 20px
                }}>
                  Ask anything about this API...
                </p>
              )}

              {/* ApiBreakdown */}
              {apiData && (
                <div style={{ width: "100%", maxWidth: "340px" }}>
                  <UpgradedApiBreakdown api={apiData} />
                </div>
              )}

              {/* Suggested Prompts */}
              <div style={{ width: "100%", maxWidth: "340px", marginTop: "12px" }}> {/* FIX 5: reduced from 20px */}
                <SuggestedPrompts
                  onClick={(text: string) => {
                    // FIX 2: no auth check — anyone can use suggested prompts
                    sendMessage(text);
                  }}
                />
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 12px" }}>
            {chat.map((msg, i) => {
              const isLastAssistant = msg.role === "assistant" && i === chat.length - 1;
              return (
                <div key={i} className="msg-enter">
                  <MessagePill
                    role={msg.role}
                    content={msg.content}
                    onRegenerate={isLastAssistant ? regenerateLast : undefined}
                  />
                </div>
              );
            })}
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
        }}>
          {/* FIX 2: no isLoggedIn / onNeedLogin props — chat is fully open */}
          <ClaudeInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            disabled={loading}
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

// ─── UpgradedApiBreakdown ─────────────────────────────────────────────────────
const UpgradedApiBreakdown = ({ api }: { api: any }) => {
  if (!api) return null;

  const sections = [
    api.description && {
      key: "description",
      label: "About",
      icon: <Sparkles size={11} color="#4ade80" />,
      content: api.description,
      type: "text" as const,
    },
    api.endpoints?.length && {
      key: "endpoints",
      label: "Endpoints",
      icon: <Link2 size={11} color="#4ade80" />,
      content: api.endpoints,
      type: "list" as const,
    },
    api.params?.length && {
      key: "params",
      label: "Parameters",
      icon: <Radio size={11} color="#4ade80" />,
      content: api.params,
      type: "list" as const,
    },
    api.example && {
      key: "example",
      label: "Example",
      icon: <Zap size={11} color="#4ade80" />,
      content: typeof api.example === "string" ? api.example : JSON.stringify(api.example, null, 2),
      type: "code" as const,
    },
    api.auth && {
      key: "auth",
      label: "Auth",
      icon: <Shield size={11} color="#4ade80" />,
      content: api.auth,
      type: "badge" as const,
    },
  ].filter(Boolean) as Array<{
    key: string; label: string; icon: React.ReactNode;
    content: any; type: "text" | "list" | "code" | "badge";
  }>;

  if (!sections.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
        <div style={{ height: "1px", flex: 1, background: "rgba(34,197,94,0.15)" }} />
        <span style={{
          fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "rgba(34,197,94,0.45)",
        }}>
          API Details
        </span>
        <div style={{ height: "1px", flex: 1, background: "rgba(34,197,94,0.15)" }} />
      </div>

      {sections.map((s) => (
        <div key={s.key} style={{
          padding: "12px 14px", borderRadius: "14px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(34,197,94,0.10)",
          backdropFilter: "blur(12px)", textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
            {s.icon}
            <span style={{
              fontSize: "9px", fontWeight: 800, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(34,197,94,0.55)",
            }}>
              {s.label}
            </span>
          </div>

          {s.type === "text" && (
            <p style={{ fontSize: "12px", lineHeight: 1.7, color: "rgba(255,255,255,0.60)", fontWeight: 400 }}>
              {s.content}
            </p>
          )}

          {s.type === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {(s.content as string[]).slice(0, 5).map((item: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{
                    width: "4px", height: "4px", borderRadius: "50%", flexShrink: 0,
                    background: "rgba(34,197,94,0.50)",
                  }} />
                  <span style={{
                    fontSize: "11px", color: "rgba(255,255,255,0.55)",
                    fontFamily: "monospace", wordBreak: "break-all",
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          {s.type === "code" && (
            <div>
              <div style={{
                padding: "10px 12px", borderRadius: "10px",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(34,197,94,0.08)",
                marginBottom: "8px", overflow: "auto",
              }}>
                <pre style={{
                  fontSize: "10px", color: "rgba(34,197,94,0.75)",
                  fontFamily: "monospace", lineHeight: 1.6,
                  margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all",
                }}>
                  {s.content}
                </pre>
              </div>
              <CopyButton text={s.content} label="Copy example" />
            </div>
          )}

          {s.type === "badge" && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "3px 10px", borderRadius: "99px",
              background: "rgba(34,197,94,0.10)",
              border: "1px solid rgba(34,197,94,0.22)",
              fontSize: "11px", fontWeight: 600,
              color: "rgba(134,239,172,0.85)",
            }}>
              <Shield size={9} color="#4ade80" />
              {s.content}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AskApivesPage;