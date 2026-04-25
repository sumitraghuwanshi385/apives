
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

import SuggestedPrompts from "../components/ai/SuggestedPrompts";
import HistoryModal from "../components/ai/HistoryModal";
import CompareModal from "../components/ai/CompareModal";
import AnimatedOrb from "../components/ai/AnimatedOrb";

const API_BASE = "https://apives-3xrc.onrender.com";

// ─── Global Styles ────────────────────────────────────────────────────────────
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

  /* ── "Your Selected API" label above pill ── */
  @keyframes selectedPillIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .selected-api-label {
    animation: selectedPillIn 0.35s ease forwards;
  }

  /* ── API remove close button ── */
  .api-remove-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.35);
    cursor: pointer;
    transition: all 0.18s ease;
    flex-shrink: 0;
    margin-left: 4px;
  }
  .api-remove-btn:hover {
    background: rgba(239,68,68,0.30);
    border-color: rgba(239,68,68,0.60);
    transform: scale(1.1);
  }
`;

// ─── Strip markdown helper ─────────────────────────────────────────────────────
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

// ─── Smart intent detection ───────────────────────────────────────────────────
function isApiRelatedQuery(text: string): boolean {
  const normalized = text.toLowerCase();
  const apiKeywords = [
    "api", "endpoint", "endpoints", "auth", "authentication", "token",
    "request", "response", "parameter", "params", "integrate", "integration",
    "sdk", "webhook", "rate limit", "base url", "http", "rest", "graphql",
    "header", "key", "secret", "curl", "fetch", "axios", "postman",
    "usage", "how to use", "how do i use", "example", "documentation",
    "docs", "method", "get", "post", "put", "delete", "patch",
  ];
  return apiKeywords.some((kw) => normalized.includes(kw));
}

// ─── Robot TypingIndicator ─────────────────────────────────────────────────────
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

// ─── ApiNamePill ──────────────────────────────────────────────────────────────
const ApiNamePill = ({ name, iconUrl }: { name: string; iconUrl?: string }) => (
  <div className="api-name-pill">
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
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (listening) {
      try { recognitionRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => { setListening(true); };

    rec.onresult = (e: any) => {
      try {
        const transcript = e.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          onTranscript(transcript.trim());
        }
      } catch (err) {
        console.error("[MicButton] onresult error:", err);
      }
    };

    rec.onerror = (e: any) => {
      console.error("[MicButton] Speech error:", e.error);
      setListening(false);
    };

    rec.onend = () => { setListening(false); };

    recognitionRef.current = rec;

    try {
      rec.start();
    } catch (err) {
      console.error("[MicButton] start() error:", err);
      setListening(false);
    }
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

// ─── ClaudeInput ──────────────────────────────────────────────────────────────
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
        <MicButton
          onTranscript={(t) => onChange((value.trim() ? value.trim() + " " : "") + t)}
          disabled={disabled}
        />
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

  const apiId   = searchParams.get("apiId");
  const apiName = searchParams.get("apiName");

  // ── Auth helpers ──────────────────────────────────────────────────────────
  const isValidUser = (): boolean => {
    try {
      const data = localStorage.getItem("mora_user");
      if (!data) return false;
      const parsed = JSON.parse(data);
      return !!parsed?.token;
    } catch {
      return false;
    }
  };

  const redirectToAccess = () => {
    navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  };

  const requireLogin = (): boolean => {
    const valid = isValidUser();
    if (!valid) { redirectToAccess(); return false; }
    return true;
  };

  // ── State ─────────────────────────────────────────────────────────────────
  const [apiData, setApiData]               = useState<any>(null);
  const [input, setInput]                   = useState("");
  const [chat, setChat]                     = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading]               = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // ── FIX 1: unique chatId per session ─────────────────────────────────────
  const [chatId, setChatId] = useState(() => Date.now().toString());

  // ── FIX 3: API active control ─────────────────────────────────────────────
  const [isApiActive, setIsApiActive] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Hide global layout ────────────────────────────────────────────────────
  useEffect(() => {
    const nav    = document.querySelector("nav")    as HTMLElement | null;
    const header = document.querySelector("header") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    if (nav)    nav.style.display    = "none";
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
      if (nav)    nav.style.display    = "";
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  // ── Load API data + latest chat on apiId change ───────────────────────────
  const prevApiRef = useRef<string | null>(null);

  useEffect(() => {
    if (!apiId) return;

    const isNewApi = prevApiRef.current !== apiId;
    prevApiRef.current = apiId;

    setApiData(null);
    setInput("");

    // ── FIX 4: restore API mode when navigating back ──────────────────────
    setIsApiActive(true);

    if (isNewApi) {
      // Generate a fresh chatId for the new API session
      const newSessionId = Date.now().toString();
      setChatId(newSessionId);
      setChat([]);
    }

    // ── FIX 1: load LATEST chat for this apiId ────────────────────────────
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(`apives_chat_${apiId}_`)
      );

      if (keys.length > 0) {
        const latestKey = keys.sort().reverse()[0];
        const saved = localStorage.getItem(latestKey);

        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setChat(parsed);
            // Restore chatId from key so saves continue on same session
            const restoredId = latestKey.replace(`apives_chat_${apiId}_`, "");
            setChatId(restoredId);
          }
        }
      }
    } catch (err) {
      console.error("History load failed:", err);
    }

    axios
      .get(`${API_BASE}/api/apis/${apiId}`)
      .then((res) => {
        const api = res.data?.data || res.data;
        if (api && typeof api === "object") {
          setApiData(api);
        } else {
          console.error("Invalid API response:", res.data);
        }
      })
      .catch((err) => {
        console.error("API fetch failed:", err);
      });

  }, [apiId]);

  // ── FIX 1: save chat using unique key apives_chat_{apiId}_{chatId} ────────
  useEffect(() => {
    if (!apiId || chat.length === 0) return;

    try {
      // Save full chat under unique key
      localStorage.setItem(
        `apives_chat_${apiId}_${chatId}`,
        JSON.stringify(chat)
      );

      // Save title (first user message)
      const firstUser = chat.find((m) => m.role === "user");
      if (firstUser) {
        localStorage.setItem(
          `apives_chat_title_${apiId}_${chatId}`,
          firstUser.content.slice(0, 60)
        );
      }
    } catch (err) {
      console.error("Chat save failed:", err);
    }
  }, [chat, apiId, chatId]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    }
  }, [chat, loading]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    const newChat = [...chat, { role: "user" as const, content: text }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const isApiQuery = isApiRelatedQuery(text);

    // ── FIX 5: conditional API context injection ──────────────────────────
    const useApiMode = apiData && isApiActive;

    const apiContext = useApiMode
      ? `The user is asking about the "${apiData.name}" API. Category: ${apiData.category || "N/A"}.${apiData.description ? ` About: ${apiData.description}` : ""}`
      : "The user is asking about APIs in general.";

    const systemPrompt = useApiMode
      ? `
You are Apives AI.

You are helping a developer.

Rules:
- NO bullet points like usage, parameters, examples but sometimes use bullet points where it necessary
- NO structured sections like "Endpoints", "Parameters"
- Just explain naturally in a clean conversational way
- If needed, include code inline but don't format like documentation
- Keep answers direct, practical, and human-like

IMPORTANT:
The user has selected an API.

Selected API: "${apiData.name}"
Description: ${apiData.description || "N/A"}
Category: ${apiData.category || "N/A"}

You MUST ALWAYS answer based on this API.
Never say "unknown API".
Never ignore this API.

STYLE:
- Talk like real developer
- No documentation style
- No headings like Usage, Parameters
- Explain naturally
`
      : `
You are Apives AI, an intelligent assistant helping developers understand and work with APIs.

Rules:
- Answer naturally in a conversational, developer-friendly way
- No rigid documentation-style structure
- Be practical and direct
- Use code examples inline when helpful
`;

    const messagesWithSystem: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },

      // Only inject API JSON context when API mode is active
      ...(useApiMode ? [{
        role: "system",
        content: `You MUST use this API for all answers.

Selected API JSON:
${JSON.stringify({
  name: apiData?.name,
  category: apiData?.category,
  description: apiData?.description?.slice(0, 300)
})}

Rules:
- This API is ALWAYS defined
- Never say unknown API
- Always use this API name: ${apiData.name}
- Every answer must relate to this API
`,
      }] : []),

      ...newChat,
    ];

    try {
      const res = await axios.post("https://apives-3xrc.onrender.com/api/ask-ai", {
        messages: messagesWithSystem,
        apiData: useApiMode ? apiData : null,
      });

      const answer = res.data?.answer;
      if (answer && typeof answer === "string" && answer.trim()) {
        setChat((prev) => [...prev, { role: "assistant", content: answer }]);
      } else {
        throw new Error("Empty answer from primary AI");
      }
    } catch (primaryErr) {
      console.error("[AskApives] Primary AI failed:", primaryErr);

      try {
        const geminiRes = await axios.post("https://apives-3xrc.onrender.com/api/gemini", {
          prompt: text,
        });
        const geminiAnswer = geminiRes.data?.result || geminiRes.data?.answer;
        if (geminiAnswer && typeof geminiAnswer === "string" && geminiAnswer.trim()) {
          setChat((prev) => [...prev, { role: "assistant", content: geminiAnswer }]);
        } else {
          throw new Error("Empty answer from Gemini fallback");
        }
      } catch (fallbackErr) {
        console.error("[AskApives] Gemini fallback failed:", fallbackErr);
        setChat((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Both AI services are temporarily unavailable. Please check your internet connection and try again in a moment.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── FIX 1: New chat — generates fresh chatId ──────────────────────────────
  const startNewChat = () => {
    const newId = Date.now().toString();
    setChatId(newId);
    setChat([]);
    setInput("");
  };

  // ── Regenerate last AI response ───────────────────────────────────────────
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

  // ── FIX 3: Remove selected API handler ───────────────────────────────────
  const removeSelectedApi = () => {
    setApiData(null);
    setIsApiActive(false);
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const displayName =
    apiData?.name ||
    apiData?.title ||
    apiData?.apiName ||
    apiName ||
    null;

  const inputPlaceholder = displayName && isApiActive
    ? `Ask anything about ${displayName}...`
    : "Ask anything about any API...";

  // ── Render ────────────────────────────────────────────────────────────────
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

      {/* ── FIX 2: Main container — removed keyboard-inset-height black gap ── */}
      <div
        className="page-in"
        style={{
          display: "flex", flexDirection: "column",
          height: "100dvh", minHeight: "100dvh", overflow: "hidden",
          paddingBottom: "0px",
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

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => { if (!requireLogin()) return; setShowHistoryModal(true); }}
              className="glass-btn"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
              title="Chat history"
            >
              <History size={14} color="rgba(255,255,255,0.40)" />
            </button>

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

            <button
              onClick={() => { if (!requireLogin()) return; setShowCompareModal(true); }}
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

        {/* ── FIX 2: CHAT AREA — paddingBottom fixed to 140px ── */}
        <div
          ref={scrollRef}
          className="chat-scroll"
          style={{
            position: "relative", zIndex: 10,
            flex: 1, overflowY: "auto",
            WebkitOverflowScrolling: "touch" as any,
            paddingTop: "12px", paddingBottom: "140px",
            minHeight: 0,
          }}
        >
          {chat.length === 0 && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              minHeight: "100%",
              padding: "16px 24px 8px",
              textAlign: "center",
            }}>
              <AnimatedOrb />

              <h2 style={{
                fontSize: "26px", fontWeight: 900,
                marginTop: "14px",
                marginBottom: "6px",
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
                marginBottom: "12px",
              }}>
                Deep API analysis and instant answers on endpoints, auth, rate limits, and integration guidance.
              </p>

              {/* ── FIX 3: Show "Your Selected API" label + pill ONLY when apiData && isApiActive ── */}
              {displayName && isApiActive && (
                <div
                  className="selected-api-label"
                  style={{
                    marginBottom: "5px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 12px",
                    borderRadius: "999px",
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.18)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase" as const,
                    color: "rgba(34,197,94,0.70)",
                    boxShadow: "0 0 8px rgba(34,197,94,0.08)",
                  }}
                >
                  Your Selected API
                </div>
              )}

              {/* ── FIX 3: API name pill with ❌ remove button ── */}
              {displayName && isApiActive && (
                <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ApiNamePill
                    name={displayName}
                    iconUrl={apiData?.logo || apiData?.icon || undefined}
                  />
                  {/* ❌ Remove API button */}
                  <button
                    className="api-remove-btn"
                    onClick={removeSelectedApi}
                    title="Remove selected API"
                  >
                    <X size={10} color="rgba(239,68,68,0.80)" />
                  </button>
                </div>
              )}

              {displayName && isApiActive && (
                <p style={{
                  fontSize: "11px", color: "rgba(255,255,255,0.22)",
                  marginBottom: "12px",
                }}>
                  Ask anything about this API...
                </p>
              )}

              {/* ── FIX 3: SuggestedPrompts shown ONLY when apiData && isApiActive ── */}
              {apiData && isApiActive && (
                <div style={{ width: "100%", maxWidth: "340px", marginTop: "12px" }}>
                  <SuggestedPrompts
                    onClick={(text: string) => { sendMessage(text); }}
                  />
                </div>
              )}
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

        {/* ── FIX 2: INPUT AREA — paddingBottom uses safe-area-inset only, no keyboard gap ── */}
        <div style={{
          position: "relative", zIndex: 20, flexShrink: 0,
          padding: "8px 16px",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          background: "rgba(6,13,10,0.97)",
        }}>
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

export default AskApivesPage;