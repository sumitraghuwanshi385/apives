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

  @keyframes selectedPillIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .selected-api-label {
    animation: selectedPillIn 0.35s ease forwards;
  }

  /* ── Compare result block ── */
  .compare-result-block {
    background: rgba(5,46,22,0.35);
    border: 1px solid rgba(34,197,94,0.18);
    border-radius: 16px;
    padding: 16px;
    margin-top: 4px;
  }
  .compare-section-title {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(34,197,94,0.65);
    margin-bottom: 6px;
    margin-top: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .compare-section-title:first-child { margin-top: 0; }
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
    "explain", "breakdown", "details", "show me", "what is", "how does",
  ];
  return apiKeywords.some((kw) => normalized.includes(kw));
}

// ─── Build rich API context string for system prompt ─────────────────────────
function buildApiContext(api: any): string {
  if (!api) return "No specific API selected.";
  const parts: string[] = [`API Name: ${api.name || "Unknown"}`];
  if (api.category)    parts.push(`Category: ${api.category}`);
  if (api.description) parts.push(`Description: ${api.description}`);
  if (api.baseUrl || api.base_url) parts.push(`Base URL: ${api.baseUrl || api.base_url}`);
  if (api.auth)        parts.push(`Authentication: ${api.auth}`);
  if (api.endpoints?.length) {
    parts.push(`Endpoints: ${(api.endpoints as string[]).slice(0, 8).join(", ")}`);
  }
  if (api.params?.length) {
    parts.push(`Key Parameters: ${(api.params as string[]).slice(0, 6).join(", ")}`);
  }
  if (api.example) {
    const ex = typeof api.example === "string" ? api.example : JSON.stringify(api.example);
    parts.push(`Example: ${ex.slice(0, 400)}`);
  }
  if (api.pricing)     parts.push(`Pricing: ${api.pricing}`);
  if (api.rateLimit || api.rate_limit) parts.push(`Rate Limit: ${api.rateLimit || api.rate_limit}`);
  return parts.join("\n");
}

// ─── TypingIndicator ───────────────────────────────────────────────────────────
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

// ─── CompareResultBlock — structured comparison renderer ─────────────────────
// FIX 4 + 5: renders comparison as clean scannable sections
const CompareResultBlock = ({ content }: { content: string }) => {
  // Parse the AI text into sections by common headings
  const sectionDefs = [
    { key: "overview",        label: "Overview",               icon: "◈" },
    { key: "key differences", label: "Key Differences",        icon: "⟺" },
    { key: "pros",            label: "Pros & Cons",            icon: "±" },
    { key: "cons",            label: "Pros & Cons",            icon: "±" },
    { key: "pros & cons",    label: "Pros & Cons",            icon: "±" },
    { key: "use case",        label: "Use Cases",              icon: "◎" },
    { key: "use cases",       label: "Use Cases",              icon: "◎" },
    { key: "recommendation",  label: "Final Recommendation",  icon: "✦" },
    { key: "final",           label: "Final Recommendation",  icon: "✦" },
  ];

  // Split raw text into labeled sections based on lines that look like headings
  const lines = content.split("\n");
  const sections: { label: string; icon: string; lines: string[] }[] = [];
  let currentSection: { label: string; icon: string; lines: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentSection) currentSection.lines.push("");
      continue;
    }

    // Detect section heading: line starts with #, or is SHORT + ALL-CAPS-ish + no punctuation at end
    const isHeading =
      /^#{1,3}\s/.test(trimmed) ||
      (trimmed.length < 40 && /^[A-Z0-9 &:,\-–]+$/.test(trimmed)) ||
      sectionDefs.some((s) => trimmed.toLowerCase().startsWith(s.key));

    if (isHeading) {
      const cleanLabel = trimmed.replace(/^#{1,3}\s*/, "").replace(/[:：]$/, "").trim();
      const matched = sectionDefs.find((s) =>
        cleanLabel.toLowerCase().includes(s.key)
      );
      currentSection = {
        label: matched?.label || cleanLabel,
        icon: matched?.icon || "▸",
        lines: [],
      };
      // Deduplicate sections with same label (e.g. "pros" + "cons" both map to "Pros & Cons")
      const existing = sections.find((s) => s.label === currentSection!.label);
      if (existing) {
        currentSection = existing;
      } else {
        sections.push(currentSection);
      }
    } else {
      if (!currentSection) {
        currentSection = { label: "Overview", icon: "◈", lines: [] };
        sections.push(currentSection);
      }
      currentSection.lines.push(trimmed);
    }
  }

  // If no sections parsed, fall back to raw plain text
  if (sections.length === 0 || sections.every((s) => s.lines.every((l) => !l.trim()))) {
    return (
      <div className="compare-result-block">
        <p style={{ fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.78)", whiteSpace: "pre-wrap", margin: 0 }}>
          {stripMarkdown(content)}
        </p>
      </div>
    );
  }

  return (
    <div className="compare-result-block">
      {sections
        .filter((s) => s.lines.some((l) => l.trim()))
        .map((section, si) => (
          <div key={`${section.label}-${si}`}>
            <div className="compare-section-title">
              <span style={{ fontSize: "11px" }}>{section.icon}</span>
              {section.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {section.lines
                .filter((l) => l.trim())
                .map((line, li) => {
                  const isBullet = /^[•\-*]/.test(line);
                  const cleanLine = line.replace(/^[•\-*]\s*/, "");
                  return (
                    <div key={li} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {isBullet && (
                        <div style={{
                          width: "4px", height: "4px", borderRadius: "50%", flexShrink: 0,
                          background: "rgba(34,197,94,0.55)", marginTop: "8px",
                        }} />
                      )}
                      <p style={{
                        fontSize: "12.5px", lineHeight: 1.7,
                        color: "rgba(255,255,255,0.75)", margin: 0,
                        fontWeight: isBullet ? 400 : 450,
                      }}>
                        {cleanLine}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
};

// ─── MessagePill ──────────────────────────────────────────────────────────────
const MessagePill = ({
  role, content, onRegenerate, isCompare,
}: {
  role: "user" | "assistant";
  content: string;
  onRegenerate?: () => void;
  isCompare?: boolean;
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: isCompare ? "96%" : "82%" }}>
        {/* FIX 5: render compare content with structured block */}
        {!isUser && isCompare ? (
          <CompareResultBlock content={content} />
        ) : (
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
        )}
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

// ─── ApiNamePill ───────────────────────────────────────────────────────────────
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

// ─── Chat message type ────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isCompare?: boolean; // FIX 5: tag compare responses for structured rendering
}

// ─── AskApivesPage ────────────────────────────────────────────────────────────
const AskApivesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const apiId   = searchParams.get("apiId");
  const apiName = searchParams.get("apiName");

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

  const [apiData, setApiData]     = useState<any>(null);
  const [input, setInput]         = useState("");
  const [chat, setChat]           = useState<ChatMessage[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // FIX 1: track the previously loaded apiId to detect when history switches it
  const loadedApiIdRef = useRef<string | null>(null);

  // Hide global layout
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

  // FIX 1: Load chat from localStorage whenever apiId changes (history selection works correctly)
  useEffect(() => {
    if (!apiId) return;

    // If apiId changed (history click), reset state first
    if (loadedApiIdRef.current && loadedApiIdRef.current !== apiId) {
      setChat([]);
      setInput("");
      setApiData(null);
    }
    loadedApiIdRef.current = apiId;

    try {
      const saved = localStorage.getItem(`apives_chat_${apiId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChat(parsed);
        } else {
          setChat([]);
        }
      } else {
        setChat([]);
      }
    } catch {
      setChat([]);
    }
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

  // FIX 2: Fetch API data — use full render URL to ensure correct base
  useEffect(() => {
    if (!apiId) return;
    axios.get(`https://apives-3xrc.onrender.com/api/apis/${apiId}`)
      .then((res) => setApiData(res.data))
      .catch(() => {
        // fallback to relative path
        axios.get(`/api/apis/${apiId}`)
          .then((res) => setApiData(res.data))
          .catch(() => {});
      });
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

  // ─── FIX 2: sendMessage with proper API context ───────────────────────────
  const sendMessage = async (overrideText?: string, opts?: { isCompare?: boolean; compareApiA?: any; compareApiB?: any }) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const newChat = [...chat, userMsg];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const isApiQuery    = isApiRelatedQuery(text) || !!opts?.isCompare;
    const isCompareMode = !!opts?.isCompare;

    // FIX 2: build rich context from actual API data
    let systemPrompt: string;

    if (isCompareMode && opts?.compareApiA && opts?.compareApiB) {
      const contextA = buildApiContext(opts.compareApiA);
      const contextB = buildApiContext(opts.compareApiB);
      systemPrompt = `You are an elite API analyst on Apives. The user wants a detailed comparison of two APIs.

API A:
${contextA}

API B:
${contextB}

Provide a structured, developer-focused comparison with these sections:
1. Overview — one-line summary of each API
2. Key Differences — bullet points of the most important contrasts (auth, speed, pricing, limits, DX)
3. Pros & Cons — for each API, 3–4 clear bullet points
4. Use Cases — when to choose A vs B
5. Final Recommendation — clear winner for each scenario

Be specific, practical, and developer-friendly. No vague marketing language.`;
    } else if (isApiQuery && apiData) {
      const apiContext = buildApiContext(apiData);
      systemPrompt = `You are an elite API expert on Apives — like Stripe Docs + Postman AI combined.

Selected API context:
${apiContext}

Answer the user's question with precision and depth. Adapt your structure to the question — don't always use the same format.

Guidelines:
- Lead with a precise, direct answer (2–3 lines)
- Include relevant depth: usage, code examples (curl or JS fetch), parameters, auth — only what's needed
- For code: use real working snippets, not pseudocode
- Be comprehensive but never repetitive
- Tone: expert engineer pair-programming with the user`;
    } else {
      systemPrompt = `You are a smart, helpful AI assistant on Apives, an API discovery platform. Answer naturally and conversationally. Be concise and useful. Don't force API structure onto general questions.`;
    }

    const messagesWithSystem = [
      { role: "system", content: systemPrompt },
      ...newChat.map(({ role, content }) => ({ role, content })),
    ];

    try {
      const res = await axios.post("https://apives-3xrc.onrender.com/api/ask-ai", {
        messages: messagesWithSystem,
        apiData: isApiQuery ? (opts?.compareApiA || apiData) : undefined,
      });

      const answer = res.data?.answer;
      if (answer && typeof answer === "string" && answer.trim()) {
        setChat((prev) => [
          ...prev,
          { role: "assistant", content: answer, isCompare: isCompareMode },
        ]);
      } else {
        throw new Error("Empty answer from primary AI");
      }
    } catch (primaryErr) {
      console.error("[AskApives] Primary AI failed:", primaryErr);
      try {
        const geminiRes = await axios.post("https://apives-3xrc.onrender.com/api/gemini", { prompt: text });
        const geminiAnswer = geminiRes.data?.result || geminiRes.data?.answer;
        if (geminiAnswer && typeof geminiAnswer === "string" && geminiAnswer.trim()) {
          setChat((prev) => [
            ...prev,
            { role: "assistant", content: geminiAnswer, isCompare: isCompareMode },
          ]);
        } else {
          throw new Error("Empty Gemini answer");
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

  // FIX 4: triggerCompare — called from CompareModal with both APIs
  const triggerCompare = useCallback((apiA: any, apiB: any) => {
    setShowCompareModal(false);
    const prompt = `Compare ${apiA?.name || "API A"} vs ${apiB?.name || "API B"} in detail. Give me a comprehensive breakdown covering architecture, endpoints, authentication, pricing, rate limits, developer experience, and when to use each one.`;
    sendMessage(prompt, { isCompare: true, compareApiA: apiA, compareApiB: apiB });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, apiData]);

  const startNewChat = () => {
    setChat([]);
    setInput("");
  };

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

  const displayName = apiName || apiData?.name || null;
  const inputPlaceholder = displayName
    ? `Ask anything about ${displayName}...`
    : "Ask anything about any API...";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {showCompareModal && (
        <CompareModal
          onClose={() => setShowCompareModal(false)}
          isLoggedIn={isValidUser()}
          onNeedLogin={() => { setShowCompareModal(false); redirectToAccess(); }}
          // FIX 4: pass triggerCompare so CompareModal can fire AI comparison
          onCompare={triggerCompare}
        />
      )}

      {/* FIX 1: History — navigate replaces search param → useEffect reloads correct chat */}
      {showHistoryModal && (
        <HistoryModal
          onClose={() => setShowHistoryModal(false)}
          onSelect={(id: string) => {
            setShowHistoryModal(false);
            // FIX 1: use replace:false so back button works; chat loads via useEffect[apiId]
            navigate(`/ask-apives?apiId=${id}`, { replace: false });
          }}
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

              {displayName && (
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

              {displayName && (
                <div style={{ marginBottom: "8px" }}>
                  <ApiNamePill
                    name={displayName}
                    iconUrl={apiData?.logo || apiData?.icon || undefined}
                  />
                </div>
              )}

              {displayName && (
                <p style={{
                  fontSize: "11px", color: "rgba(255,255,255,0.22)",
                  marginBottom: "12px",
                }}>
                  Ask anything about this API...
                </p>
              )}

              {apiData && (
                <div style={{ width: "100%", maxWidth: "340px" }}>
                  <UpgradedApiBreakdown api={apiData} />
                </div>
              )}

              <div style={{ width: "100%", maxWidth: "340px", marginTop: "12px" }}>
                <SuggestedPrompts
                  onClick={(text: string) => { sendMessage(text); }}
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
                    isCompare={msg.isCompare}
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

// ─── UpgradedApiBreakdown ──────────────────────────────────────────────────────
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
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
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
          padding: "9px 12px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(34,197,94,0.10)",
          backdropFilter: "blur(12px)", textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
            {s.icon}
            <span style={{
              fontSize: "9px", fontWeight: 800, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(34,197,94,0.55)",
            }}>
              {s.label}
            </span>
          </div>

          {s.type === "text" && (
            <p style={{ fontSize: "12px", lineHeight: 1.6, color: "rgba(255,255,255,0.60)", fontWeight: 400, margin: 0 }}>
              {s.content}
            </p>
          )}

          {s.type === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
                padding: "8px 10px",
                borderRadius: "8px",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(34,197,94,0.08)",
                marginBottom: "6px",
                overflow: "auto",
              }}>
                <pre style={{
                  fontSize: "10px", color: "rgba(34,197,94,0.75)",
                  fontFamily: "monospace", lineHeight: 1.55,
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