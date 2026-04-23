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
  Shield,
  Search,
  Link2,
  Radio,
  Brain,
  Bolt,
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

// ─── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
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
    background: rgba(52,211,153,0.08) !important;
    border: 1px solid rgba(52,211,153,0.20) !important;
    transition: background 0.2s, transform 0.15s;
  }
  .close-btn-green::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: linear-gradient(to right, #34d399, transparent);
    opacity: 0.7;
    border-radius: 99px 99px 0 0;
  }
  .close-btn-green:hover {
    background: rgba(52,211,153,0.14) !important;
    transform: scale(1.04);
  }

  .compare-select-btn { transition: all 0.2s ease; cursor: pointer; }
  .compare-select-btn:hover {
    border-color: rgba(52,211,153,0.5) !important;
    background: rgba(52,211,153,0.10) !important;
  }
  .compare-select-btn.selected {
    border-color: rgba(52,211,153,0.6) !important;
    background: rgba(52,211,153,0.12) !important;
  }

  .history-item { transition: background 0.15s; cursor: pointer; }
  .history-item:hover { background: rgba(52,211,153,0.06) !important; }

  textarea { resize: none; scrollbar-width: none; }
  textarea::-webkit-scrollbar { display: none; }
`;

// ─── AnimatedOrb ─────────────────────────────────────────────────────────────
const AnimatedOrb = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  const ORB_LABELS: { icon: React.ReactNode; text: string }[] = [
    { icon: <Bolt size={11} color="#34d399" strokeWidth={2.5} />, text: "INSTANT" },
    { icon: <Search size={11} color="#34d399" strokeWidth={2.5} />, text: "DISCOVER" },
    { icon: <Link2 size={11} color="#34d399" strokeWidth={2.5} />, text: "INTEGRATE" },
    { icon: <Shield size={11} color="#34d399" strokeWidth={2.5} />, text: "SECURE" },
    { icon: <Radio size={11} color="#34d399" strokeWidth={2.5} />, text: "REAL-TIME" },
    { icon: <Brain size={11} color="#34d399" strokeWidth={2.5} />, text: "INTELLIGENT" },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ORB_LABELS.length);
        setShow(true);
      }, 280);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-float" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <div style={{ position: "relative", width: "110px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", inset: "-12px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.16) 0%, transparent 70%)",
          filter: "blur(12px)",
        }} />
        <div style={{
          position: "absolute", inset: "10px", borderRadius: "50%",
          background: "radial-gradient(circle at 32% 28%, #a7f3d0, #10b981 40%, #065f46 80%)",
          animation: "orbGlow 3.5s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          top: "22%", left: "24%", width: "28%", height: "20%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)",
        }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: "absolute",
            width: "5px", height: "5px", borderRadius: "50%",
            background: "rgba(52,211,153,0.8)",
            top: `${[18, 72, 50][i]}%`,
            left: `${[72, 20, 78][i]}%`,
            animation: `dataPing 2.4s ease-out ${i * 0.8}s infinite`,
          }} />
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "120px", justifyContent: "center", height: "28px" }}>
        {show && (
          <span className="word-in" style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            color: "rgba(52,211,153,0.85)",
          }}>
            {ORB_LABELS[idx].icon}
            {ORB_LABELS[idx].text}
          </span>
        )}
      </div>
    </div>
  );
};

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
type HistoryEntry = { apiId: string; title: string; preview: string; ts: number };

const HistoryModal = ({ onClose, onSelect }: { onClose: () => void; onSelect: (apiId: string) => void }) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("apives_chat_"));
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
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(14px)",
    }} onClick={onClose}>
      <div className="slide-up" onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: "480px",
        borderRadius: "24px 24px 0 0",
        background: "rgba(5,14,9,0.99)",
        border: "1px solid rgba(52,211,153,0.12)", borderBottom: "none",
        boxShadow: "0 -12px 60px rgba(0,0,0,0.6)",
        maxHeight: "72vh", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: "36px", height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.12)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(52,211,153,0.09)", border: "1px solid rgba(52,211,153,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Clock size={14} color="#34d399" />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>
              Recent Chats
            </span>
          </div>
          <button onClick={onClose} className="glass-btn" style={{
            width: "30px", height: "30px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <X size={12} color="rgba(255,255,255,0.45)" />
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "0 12px 24px", flex: 1 }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "16px", margin: "0 auto 12px",
                background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.14)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <History size={20} color="rgba(52,211,153,0.5)" />
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.6 }}>
                No chat history yet.<br />Start a conversation to see it here.
              </p>
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.apiId} className="history-item" onClick={() => onSelect(e.apiId)} style={{
                padding: "12px 14px", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "6px",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  flexShrink: 0, width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.13)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Sparkles size={14} color="#34d399" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: "2px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {e.title}
                  </p>
                  <p style={{
                    fontSize: "11px", color: "rgba(255,255,255,0.28)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {e.preview}
                  </p>
                </div>
                <ChevronRight size={14} color="rgba(52,211,153,0.35)" style={{ flexShrink: 0 }} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── CompareModal ─────────────────────────────────────────────────────────────
type ApiOption = { _id: string; name: string; category?: string; description?: string };

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
    if (!isLoggedIn) { onNeedLogin(); return; }
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
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        background: "rgba(0,0,0,0.80)", backdropFilter: "blur(14px)",
      }}
      onClick={!picking ? onClose : undefined}
    >
      <div
        className="slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px",
          borderRadius: "24px 24px 0 0",
          background: "rgba(5,14,9,0.99)",
          border: "1px solid rgba(52,211,153,0.14)", borderBottom: "none",
          boxShadow: "0 -12px 60px rgba(0,0,0,0.65)",
          maxHeight: "88vh", display: "flex", flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom, 20px)",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: "36px", height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.12)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(52,211,153,0.50)", marginBottom: "3px" }}>
              AI-Powered
            </p>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "white" }}>
              Compare APIs
            </h3>
          </div>
          <button onClick={onClose} className="glass-btn" style={{
            width: "32px", height: "32px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <X size={13} color="rgba(255,255,255,0.45)" />
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px 0" }}>
          {!result && (
            <>
              {/* Selector row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
                {/* A */}
                <button
                  className={`compare-select-btn ${selectedA ? "selected" : ""}`}
                  onClick={() => { setPicking("A"); setSearch(""); }}
                  style={{
                    padding: "14px 12px", borderRadius: "16px", textAlign: "left",
                    background: selectedA ? "rgba(52,211,153,0.10)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedA ? "rgba(52,211,153,0.50)" : "rgba(255,255,255,0.10)"}`,
                    minHeight: "72px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(52,211,153,0.55)" }}>API A</span>
                  {selectedA
                    ? <span style={{ fontSize: "13px", fontWeight: 700, color: "#a7f3d0" }}>{selectedA.name}</span>
                    : <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>Tap to select</span>
                  }
                </button>

                {/* VS */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.20)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "9px", fontWeight: 900, color: "#34d399", letterSpacing: "0.05em" }}>VS</span>
                  </div>
                </div>

                {/* B */}
                <button
                  className={`compare-select-btn ${selectedB ? "selected" : ""}`}
                  onClick={() => { setPicking("B"); setSearch(""); }}
                  style={{
                    padding: "14px 12px", borderRadius: "16px", textAlign: "left",
                    background: selectedB ? "rgba(52,211,153,0.10)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedB ? "rgba(52,211,153,0.50)" : "rgba(255,255,255,0.10)"}`,
                    minHeight: "72px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(52,211,153,0.55)" }}>API B</span>
                  {selectedB
                    ? <span style={{ fontSize: "13px", fontWeight: 700, color: "#a7f3d0" }}>{selectedB.name}</span>
                    : <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>Tap to select</span>
                  }
                </button>
              </div>

              {/* Search / Picker */}
              {picking && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(52,211,153,0.6)", marginBottom: "8px", letterSpacing: "0.06em" }}>
                    Select API {picking}
                  </p>
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Apives library..."
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: "12px",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(52,211,153,0.22)",
                      color: "white", fontSize: "13px", outline: "none",
                      caretColor: "#34d399", marginBottom: "8px",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "180px", overflowY: "auto" }}>
                    {filtered.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "20px", fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
                        No APIs found
                      </p>
                    ) : (
                      filtered.map((api) => (
                        <button
                          key={api._id}
                          onClick={() => selectApi(api)}
                          style={{
                            padding: "10px 14px", borderRadius: "10px", textAlign: "left",
                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.80)", fontSize: "13px", cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(52,211,153,0.09)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                        >
                          <span style={{ fontWeight: 600 }}>{api.name}</span>
                          {api.category && (
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.30)", marginLeft: "8px" }}>{api.category}</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Compare button */}
              <button
                onClick={handleCompare}
                disabled={!canCompare || loadingCompare}
                style={{
                  width: "100%", padding: "14px", borderRadius: "16px",
                  fontSize: "14px", fontWeight: 700,
                  background: canCompare ? "rgba(52,211,153,0.18)" : "rgba(255,255,255,0.06)",
                  color: canCompare ? "#34d399" : "rgba(255,255,255,0.20)",
                  border: canCompare ? "1px solid rgba(52,211,153,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  cursor: canCompare ? "pointer" : "default",
                  boxShadow: canCompare ? "0 0 18px rgba(52,211,153,0.12)" : "none",
                  transition: "all 0.2s", marginBottom: "20px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {loadingCompare ? (
                  <>
                    <div style={{
                      width: "14px", height: "14px",
                      border: "2px solid rgba(52,211,153,0.2)", borderTopColor: "#34d399",
                      borderRadius: "50%", animation: "orbSpin 0.8s linear infinite",
                    }} />
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

          {/* Result */}
          {result && (
            <div style={{ paddingBottom: "20px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 14px", borderRadius: "12px",
                background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)",
                marginBottom: "14px",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#a7f3d0" }}>{selectedA?.name}</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>vs</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#a7f3d0" }}>{selectedB?.name}</span>
              </div>
              <div style={{
                padding: "16px", borderRadius: "16px",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                fontSize: "12px", lineHeight: "1.8", color: "rgba(255,255,255,0.75)",
                whiteSpace: "pre-wrap", marginBottom: "14px",
              }}>
                {result}
              </div>
              <button
                onClick={() => { setResult(null); setSelectedA(null); setSelectedB(null); }}
                style={{
                  width: "100%", padding: "12px", borderRadius: "14px",
                  fontSize: "13px", fontWeight: 600,
                  background: "rgba(52,211,153,0.09)", border: "1px solid rgba(52,211,153,0.20)",
                  color: "#6ee7b7", cursor: "pointer", marginBottom: "8px",
                }}
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
              ? "rgba(52,211,153,0.22)"
              : "rgba(255,255,255,0.06)",
            border: hasText
              ? "1px solid rgba(52,211,153,0.40)"
              : "1px solid rgba(255,255,255,0.08)",
            boxShadow: hasText ? "0 0 14px rgba(52,211,153,0.25)" : "none",
            transition: "all 0.2s ease",
          }}
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
    if (!isLoggedIn) { redirectToAccess(); return false; }
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (overrideText?: string) => {
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
        { role: "assistant", content: "Unable to fetch response. Please try again." },
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
          overflow: "hidden", background: "#060D0A", color: "white",
          fontFamily: "inherit", position: "relative",
        }}
      >
        {/* Ambient background */}
        <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-100px", left: "-80px",
            width: "380px", height: "380px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
          <div style={{
            position: "absolute", bottom: "-80px", right: "-80px",
            width: "320px", height: "320px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
          }} />
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
              className="close-btn-green"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(12px)", cursor: "pointer",
              }}
            >
              <X size={15} color="#34d399" />
            </button>
            <div>
              <p style={{
                fontSize: "15px", fontWeight: 800, color: "rgba(255,255,255,0.93)",
                lineHeight: 1.2, letterSpacing: "-0.01em",
              }}>
                Ask Apives AI
              </p>
              <p style={{
                fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em",
                color: "rgba(52,211,153,0.48)", marginTop: "1px",
              }}>
                Enterprise API Intelligence
              </p>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
  onClick={() => {
    if (!isLoggedIn) {
      redirectToAccess();
      return;
    }
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
</button>
            )}
            {hasHistory && (
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
                background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)",
                cursor: "pointer", transition: "all 0.2s",
              }}
              title="Compare APIs"
            >
              <GitCompare size={14} color="#34d399" />
            </button>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div
          ref={scrollRef}
          className="chat-scroll"
          style={{ position: "relative", zIndex: 10, flex: 1, overflowY: "auto", padding: "16px 0", minHeight: 0 }}
        >
          {/* Empty state */}
          {chat.length === 0 && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: "100%",
              padding: "32px 24px 8px", textAlign: "center",
            }}>
              <AnimatedOrb />

              {/* Hero text */}
              <h2 style={{
                fontSize: "18px", fontWeight: 900,
                marginTop: "20px", marginBottom: "6px", lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}>
                The API Intelligence
                <br />
                <span style={{ color: "#34d399" }}>you deserve</span>
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
                  <ApiBreakdown api={{ ...apiData, description: undefined }} />
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
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div
            className="shim-line"
            style={{ height: "1px", borderRadius: "99px", marginBottom: "10px", opacity: 0.45 }}
          />

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