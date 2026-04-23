import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  X,
  Trash2,
  GitCompare,
  Mic,
  MicOff,
  ArrowUp,
  Sparkles,
  Clock,
  ChevronRight,
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

// ─── Assume your auth context / hook — adjust import to match your project ────
// useAuth should return { user } where user is null if not logged in
// If you don't have this, replace `user` checks with your own auth logic
const useAuth = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ctx = require("../context/AuthContext");
    return ctx.useAuth ? ctx.useAuth() : { user: null };
  } catch {
    return { user: typeof window !== "undefined" && localStorage.getItem("apives_user") ? { id: "local" } : null };
  }
};

// ─── Global styles ────────────────────────────────────────────────────────────
const STYLES = `
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

  .chat-scroll::-webkit-scrollbar { width: 3px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.18); border-radius: 99px; }

  @keyframes msgSlide {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .msg-enter { animation: msgSlide 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  @keyframes floatOrb {
    0%,100% { transform: translateY(0px) scale(1); }
    40%     { transform: translateY(-11px) scale(1.03); }
    70%     { transform: translateY(-5px) scale(0.98); }
  }
  .orb-float { animation: floatOrb 5.5s ease-in-out infinite; }

  @keyframes gradShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  .grad-anim { background-size: 200% 200%; animation: gradShift 4s ease infinite; }

  @keyframes typingBounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.35; }
    30%         { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes pageIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-in { animation: pageIn 0.38s ease forwards; }

  @keyframes shimLine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shim-line {
    background: linear-gradient(90deg, transparent, rgba(34,197,94,0.35) 50%, transparent);
    background-size: 200% auto;
    animation: shimLine 2.8s linear infinite;
  }

  @keyframes wordFadeIn {
    from { opacity: 0; transform: translateY(4px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .word-in { animation: wordFadeIn 0.28s ease forwards; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .modal-slide { animation: slideUp 0.32s cubic-bezier(0.34,1.4,0.64,1) forwards; }

  @keyframes micPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
    50%     { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
  }
  .mic-active { animation: micPulse 1.2s ease-in-out infinite; }

  @keyframes orbGlow {
    0%,100% { box-shadow: 0 0 28px rgba(34,197,94,0.45), 0 0 60px rgba(34,197,94,0.15); }
    50%     { box-shadow: 0 0 40px rgba(34,197,94,0.65), 0 0 80px rgba(34,197,94,0.25); }
  }
  .orb-glow-anim { animation: orbGlow 3.5s ease-in-out infinite; }

  .glass-pill-user {
    background: rgba(34,197,94,0.10);
    border: 1px solid rgba(34,197,94,0.24);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .glass-pill-ai {
    background: rgba(255,255,255,0.042);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .glass-input {
    background: rgba(255,255,255,0.035);
    border: 1.5px solid rgba(34,197,94,0.16);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: border-color 0.22s, box-shadow 0.22s;
  }
  .glass-input:focus-within {
    border-color: rgba(34,197,94,0.42);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.07);
  }
  .glass-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
    transition: background 0.18s, transform 0.12s;
  }
  .glass-btn:hover  { background: rgba(255,255,255,0.09); }
  .glass-btn:active { transform: scale(0.93); }

  .green-glow { box-shadow: 0 0 16px rgba(34,197,94,0.22), 0 0 32px rgba(34,197,94,0.07); }

  .api-card-select {
    background: rgba(255,255,255,0.035);
    border: 1.5px solid rgba(255,255,255,0.08);
    transition: background 0.18s, border-color 0.18s, transform 0.14s;
    cursor: pointer;
  }
  .api-card-select:hover  { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); }
  .api-card-select.active { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.45); }
  .api-card-select:active { transform: scale(0.98); }

  textarea { resize: none; scrollbar-width: none; }
  textarea::-webkit-scrollbar { display: none; }

  .hist-item:hover { background: rgba(255,255,255,0.05); }
`;

// ─── Orb phrases ──────────────────────────────────────────────────────────────
const ORB_PHRASES = [
  "REST & GraphQL",
  "Instant Docs",
  "Auth & Keys",
  "Rate Limits",
  "Try & Test",
  "Zero Config",
];

// ─── AnimatedOrb ──────────────────────────────────────────────────────────────
const AnimatedOrb = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ORB_PHRASES.length);
        setShow(true);
      }, 300);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="orb-float"
      style={{ position: "relative", width: "130px", height: "130px", flexShrink: 0 }}
    >
      {/* Soft outer glow — no ring */}
      <div
        className="orb-glow-anim"
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />

      {/* Main sphere — vivid green like logo */}
      <div
        style={{
          position: "absolute",
          inset: "10px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 33% 26%, #86efac, #22c55e 42%, #15803d 75%, #14532d 95%)",
          boxShadow:
            "inset 0 3px 14px rgba(255,255,255,0.28), inset 0 -4px 10px rgba(0,0,0,0.25), 0 0 36px rgba(34,197,94,0.55)",
        }}
      />

      {/* Glass sheen top-left */}
      <div
        style={{
          position: "absolute",
          top: "17%",
          left: "22%",
          width: "32%",
          height: "22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.68), transparent 65%)",
        }}
      />

      {/* Subtle inner rim */}
      <div
        style={{
          position: "absolute",
          inset: "10px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      />

      {/* Rotating text */}
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
              fontSize: "7.5px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 1px 5px rgba(0,0,0,0.55)",
              textAlign: "center",
              maxWidth: "70px",
              lineHeight: 1.3,
            }}
          >
            {ORB_PHRASES[idx]}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── TypingIndicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div
    className="glass-pill-ai"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      borderRadius: "18px 18px 18px 4px",
    }}
  >
    {/* mini orb */}
    <div
      style={{
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #86efac, #22c55e)",
        boxShadow: "0 0 6px rgba(34,197,94,0.55)",
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "rgba(34,197,94,0.60)",
      }}
    >
      Thinking
    </span>
    <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", paddingBottom: "1px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#22c55e",
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
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            marginRight: "7px",
            marginTop: "5px",
            background: "radial-gradient(circle at 35% 30%, #86efac, #16a34a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px rgba(34,197,94,0.4)",
          }}
        >
          <Sparkles size={10} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div
        className={isUser ? "glass-pill-user" : "glass-pill-ai"}
        style={{
          maxWidth: "82%",
          padding: "11px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          fontSize: "13.5px",
          lineHeight: "1.65",
          fontWeight: 500,
          color: isUser ? "rgba(220,252,231,0.94)" : "rgba(255,255,255,0.80)",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
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
  <div style={OVERLAY_STYLE}>
    <div className="modal-slide" style={{ ...MODAL_BASE, maxWidth: "320px" }}>
      <div style={ICON_BOX_RED}>
        <Trash2 size={16} color="#f87171" />
      </div>
      <p style={MODAL_TITLE}>Clear chat history?</p>
      <p style={MODAL_DESC}>
        This will permanently remove all messages for this API session.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onCancel} className="glass-btn" style={MODAL_BTN_CANCEL}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{ ...MODAL_BTN_CANCEL, background: "rgba(239,68,68,0.75)", border: "none", color: "white" }}
        >
          Clear
        </button>
      </div>
    </div>
  </div>
);

// ─── HistoryModal ─────────────────────────────────────────────────────────────
const HistoryModal = ({
  sessions,
  onSelect,
  onClose,
}: {
  sessions: ChatSession[];
  onSelect: (s: ChatSession) => void;
  onClose: () => void;
}) => (
  <div style={OVERLAY_STYLE}>
    <div className="modal-slide" style={{ ...MODAL_BASE, maxWidth: "380px", width: "92%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(34,197,94,0.5)", marginBottom: "3px" }}>
            Recent
          </p>
          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "white" }}>Chat History</h3>
        </div>
        <button onClick={onClose} className="glass-btn" style={ICON_BTN}>
          <X size={13} color="rgba(255,255,255,0.45)" />
        </button>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px 0", color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
          No chat history yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "360px", overflowY: "auto" }}>
          {sessions.map((s) => (
            <button
              key={s.apiId}
              className="hist-item"
              onClick={() => onSelect(s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "14px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.18s",
                width: "100%",
              }}
            >
              {/* Icon */}
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Sparkles size={14} color="#22c55e" />
              </div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.apiName}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.32)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.lastMsg}
                </p>
              </div>
              <ChevronRight size={14} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─── CompareModal ─────────────────────────────────────────────────────────────
const CompareModal = ({
  onClose,
  currentApiData,
}: {
  onClose: () => void;
  currentApiData: any;
}) => {
  const [allApis, setAllApis] = useState<any[]>([]);
  const [selectedA, setSelectedA] = useState<any>(currentApiData || null);
  const [selectedB, setSelectedB] = useState<any>(null);
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loadingApis, setLoadingApis] = useState(true);

  useEffect(() => {
    axios
      .get("/api/apis?limit=40")
      .then((r) => setAllApis(r.data?.apis || r.data || []))
      .catch(() => setAllApis([]))
      .finally(() => setLoadingApis(false));
  }, []);

  const canCompare = selectedA && selectedB && selectedA._id !== selectedB._id;

  const runCompare = async () => {
    if (!canCompare) return;
    setComparing(true);
    setResult(null);
    try {
      const res = await axios.post("/api/ask-ai", {
        messages: [
          {
            role: "user",
            content: `Compare these two APIs in detail. Use clear sections: Overview, Endpoints, Authentication, Rate Limits, Pricing, Pros & Cons, and Best Use Cases.

API A: ${JSON.stringify(selectedA)}

API B: ${JSON.stringify(selectedB)}`,
          },
        ],
        apiData: selectedA,
      });
      setResult(res.data.answer);
    } catch {
      setResult("Could not compare APIs. Please try again.");
    } finally {
      setComparing(false);
    }
  };

  return (
    <div style={{ ...OVERLAY_STYLE, alignItems: "flex-end" }}>
      <div
        className="modal-slide"
        style={{
          ...MODAL_BASE,
          maxWidth: "100%",
          width: "100%",
          borderRadius: "28px 28px 0 0",
          maxHeight: "88dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(34,197,94,0.5)", marginBottom: "3px" }}>
              Analysis
            </p>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "white" }}>Compare APIs</h3>
          </div>
          <button onClick={onClose} className="glass-btn" style={ICON_BTN}>
            <X size={13} color="rgba(255,255,255,0.45)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Selected pair preview */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "API A", val: selectedA, clear: () => setSelectedA(null) },
              { label: "API B", val: selectedB, clear: () => setSelectedB(null) },
            ].map(({ label, val, clear }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "14px",
                  background: val ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${val ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.08)"}`,
                  minHeight: "60px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(34,197,94,0.5)", marginBottom: "3px" }}>
                  {label}
                </p>
                {val ? (
                  <>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.88)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {val.name}
                    </p>
                    <button
                      onClick={clear}
                      style={{ position: "absolute", top: "8px", right: "8px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "14px", lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)" }}>Select below ↓</p>
                )}
              </div>
            ))}
          </div>

          {/* API list */}
          {!result && (
            <>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                {!selectedA ? "Choose API A" : !selectedB ? "Choose API B" : "Ready to compare"}
              </p>
              {loadingApis ? (
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "20px 0" }}>
                  Loading APIs...
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {allApis.map((api: any) => {
                    const isA = selectedA?._id === api._id;
                    const isB = selectedB?._id === api._id;
                    return (
                      <button
                        key={api._id}
                        className={`api-card-select${isA || isB ? " active" : ""}`}
                        onClick={() => {
                          if (!selectedA || isA) setSelectedA(isA ? null : api);
                          else if (!selectedB || isB) setSelectedB(isB ? null : api);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 14px",
                          borderRadius: "13px",
                          border: "none",
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.88)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                            {api.name}
                          </p>
                          {api.category && (
                            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>{api.category}</p>
                          )}
                        </div>
                        {(isA || isB) && (
                          <span style={{ fontSize: "9px", fontWeight: 800, padding: "3px 8px", borderRadius: "99px", background: "rgba(34,197,94,0.20)", color: "#22c55e", flexShrink: 0, marginLeft: "8px" }}>
                            {isA ? "A" : "B"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Result */}
          {result && (
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.15)",
                fontSize: "13px",
                lineHeight: "1.75",
                color: "rgba(255,255,255,0.78)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {result}
            </div>
          )}
        </div>

        {/* Action */}
        <div style={{ flexShrink: 0, marginTop: "16px" }}>
          {result ? (
            <button
              onClick={() => { setResult(null); setSelectedB(null); }}
              className="glass-btn"
              style={{ width: "100%", padding: "14px", borderRadius: "16px", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.65)", cursor: "pointer" }}
            >
              Compare Again
            </button>
          ) : (
            <button
              onClick={runCompare}
              disabled={!canCompare || comparing}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: 800,
                border: "none",
                cursor: canCompare && !comparing ? "pointer" : "default",
                background: canCompare
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "rgba(255,255,255,0.06)",
                color: canCompare ? "#052e16" : "rgba(255,255,255,0.25)",
                boxShadow: canCompare ? "0 6px 20px rgba(34,197,94,0.40)" : "none",
                transition: "all 0.2s",
              }}
            >
              {comparing ? "Comparing…" : "Compare with AI ✦"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Claude-style Input with working mic ──────────────────────────────────────
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
  const [micActive, setMicActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const hasText = value.trim().length > 0;
  const SpeechRecognition =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;
  const micSupported = !!SpeechRecognition;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  const toggleMic = () => {
    if (!micSupported) return;
    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      onChange((value ? value + " " : "") + transcript);
    };
    rec.onend = () => setMicActive(false);
    rec.onerror = () => setMicActive(false);
    rec.start();
    recognitionRef.current = rec;
    setMicActive(true);
  };

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
        placeholder={micActive ? "Listening…" : "Ask about this API…"}
        rows={1}
        style={{
          width: "100%",
          background: "transparent",
          color: "rgba(255,255,255,0.88)",
          fontSize: "14px",
          lineHeight: "1.6",
          fontWeight: 500,
          outline: "none",
          padding: "14px 20px 6px",
          fontFamily: "inherit",
          caretColor: "#22c55e",
          maxHeight: "120px",
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
        {/* Mic */}
        <button
          onClick={toggleMic}
          className={micActive ? "mic-active" : "glass-btn"}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: micSupported ? "pointer" : "not-allowed",
            background: micActive ? "rgba(34,197,94,0.22)" : undefined,
            border: micActive ? "1px solid rgba(34,197,94,0.45)" : undefined,
            opacity: micSupported ? 1 : 0.35,
            transition: "all 0.2s",
          }}
          title={micActive ? "Stop listening" : "Voice input"}
        >
          {micActive ? (
            <MicOff size={13} color="#22c55e" />
          ) : (
            <Mic size={13} color="rgba(255,255,255,0.30)" />
          )}
        </button>

        {/* Send */}
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
            cursor: hasText && !disabled ? "pointer" : "default",
            background: hasText
              ? "linear-gradient(135deg, #22c55e, #16a34a)"
              : "rgba(255,255,255,0.05)",
            border: hasText ? "none" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: hasText ? "0 4px 14px rgba(34,197,94,0.42)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowUp size={14} color={hasText ? "white" : "rgba(255,255,255,0.20)"} strokeWidth={2.8} />
        </button>
      </div>
    </div>
  );
};

// ─── Shared style tokens ──────────────────────────────────────────────────────
const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.72)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  padding: "16px",
};

const MODAL_BASE: React.CSSProperties = {
  borderRadius: "26px",
  padding: "24px",
  background: "rgba(5,14,8,0.97)",
  border: "1px solid rgba(34,197,94,0.13)",
  boxShadow: "0 28px 70px rgba(0,0,0,0.70)",
  width: "100%",
};

const ICON_BOX_RED: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "14px",
};

const MODAL_TITLE: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: "white",
  marginBottom: "6px",
};

const MODAL_DESC: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(255,255,255,0.32)",
  lineHeight: "1.65",
  marginBottom: "20px",
};

const MODAL_BTN_CANCEL: React.CSSProperties = {
  flex: 1,
  padding: "11px",
  borderRadius: "14px",
  fontSize: "12px",
  fontWeight: 600,
  color: "rgba(255,255,255,0.45)",
  cursor: "pointer",
};

const ICON_BTN: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

// ─── Chat session type ────────────────────────────────────────────────────────
interface ChatSession {
  apiId: string;
  apiName: string;
  lastMsg: string;
  timestamp: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getAllSessions = (): ChatSession[] => {
  const sessions: ChatSession[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("apives_chat_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        if (data.length > 0) {
          const apiId = key.replace("apives_chat_", "");
          const meta = JSON.parse(localStorage.getItem(`apives_meta_${apiId}`) || "{}");
          const lastUser = [...data].reverse().find((m: any) => m.role === "user");
          sessions.push({
            apiId,
            apiName: meta.name || apiId,
            lastMsg: lastUser?.content?.slice(0, 55) + (lastUser?.content?.length > 55 ? "…" : "") || "…",
            timestamp: meta.ts || 0,
          });
        }
      } catch {}
    }
  }
  return sessions.sort((a, b) => b.timestamp - a.timestamp);
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AskApivesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiId = searchParams.get("apiId");
  const { user } = useAuth();

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [contextPrompt, setContextPrompt] = useState<string | null>(null);
  const [historySessions, setHistorySessions] = useState<ChatSession[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auth guard — redirect to sign-in if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/sign-in", { replace: true });
    }
  }, [user, navigate]);

  // Load chat
  useEffect(() => {
    if (!apiId) return;
    try {
      const saved = localStorage.getItem(`apives_chat_${apiId}`);
      if (saved) setChat(JSON.parse(saved));
    } catch {}
  }, [apiId]);

  // Save chat + meta
  useEffect(() => {
    if (!apiId) return;
    localStorage.setItem(`apives_chat_${apiId}`, JSON.stringify(chat));
    if (apiData) {
      localStorage.setItem(
        `apives_meta_${apiId}`,
        JSON.stringify({ name: apiData.name, ts: Date.now() })
      );
    }
  }, [chat, apiId, apiData]);

  // Fetch API
  useEffect(() => {
    if (!apiId) return;
    axios.get(`/api/apis/${apiId}`).then((r) => setApiData(r.data)).catch(() => {});
  }, [apiId]);

  // Context prompt
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

  const openHistory = () => {
    setHistorySessions(getAllSessions());
    setShowHistoryModal(true);
  };

  const handleHistorySelect = (s: ChatSession) => {
    setShowHistoryModal(false);
    navigate(`/ask-apives?apiId=${s.apiId}`);
  };

  const openCompare = () => {
    if (!user) { navigate("/sign-in"); return; }
    setShowCompareModal(true);
  };

  const sendMessage = async (overrideText?: string) => {
    if (!user) { navigate("/sign-in"); return; }
    const text = (overrideText ?? input).trim();
    if (!text) return;
    setContextPrompt(null);
    const newChat = [...chat, { role: "user", content: text }];
    setChat(newChat);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("/api/ask-ai", { messages: newChat, apiData });
      setChat((prev) => [...prev, { role: "assistant", content: res.data.answer }]);
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
    if (apiId) {
      localStorage.removeItem(`apives_chat_${apiId}`);
      localStorage.removeItem(`apives_meta_${apiId}`);
    }
    setShowClearModal(false);
  };

  if (!user) return null; // splash while redirecting

  const hasHistory = chat.length > 0;

  return (
    <>
      <style>{STYLES}</style>

      {showClearModal && (
        <ClearModal onConfirm={clearChat} onCancel={() => setShowClearModal(false)} />
      )}
      {showHistoryModal && (
        <HistoryModal
          sessions={historySessions}
          onSelect={handleHistorySelect}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
      {showCompareModal && (
        <CompareModal onClose={() => setShowCompareModal(false)} currentApiData={apiData} />
      )}

      <div
        className="page-in"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow: "hidden",
          background: "#030A05",
          color: "white",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* ── Ambient bg ── */}
        <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0 }}>
          <div style={{
            position: "absolute", top: "-100px", left: "-80px",
            width: "380px", height: "380px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 70%)",
            filter: "blur(55px)",
          }} />
          <div style={{
            position: "absolute", bottom: "-80px", right: "-70px",
            width: "320px", height: "320px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(21,128,61,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
          {/* dot grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.018,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
        </div>

        {/* ─── HEADER ─── */}
        <div
          style={{
            position: "relative", zIndex: 20, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingLeft: "16px", paddingRight: "16px",
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
            paddingBottom: "13px",
            background: "rgba(3,10,5,0.92)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            borderBottom: "1px solid rgba(34,197,94,0.07)",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(-1)}
              className="glass-btn"
              style={{ ...ICON_BTN, width: "36px", height: "36px" }}
            >
              <X size={15} color="rgba(255,255,255,0.52)" />
            </button>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 800, color: "rgba(255,255,255,0.93)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                Ask Apives AI
              </p>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(34,197,94,0.50)", marginTop: "1px", letterSpacing: "0.03em" }}>
                Instant API intelligence
              </p>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* History */}
            <button
              onClick={openHistory}
              className="glass-btn"
              style={{ ...ICON_BTN, width: "36px", height: "36px" }}
              title="Chat history"
            >
              <Clock size={14} color="rgba(255,255,255,0.35)" />
            </button>

            {/* Clear — only when chat exists */}
            {hasHistory && (
              <button
                onClick={() => setShowClearModal(true)}
                className="glass-btn"
                style={{ ...ICON_BTN, width: "36px", height: "36px" }}
                title="Clear chat"
              >
                <Trash2 size={14} color="rgba(255,255,255,0.28)" />
              </button>
            )}

            {/* Compare — no pulse, just clean green */}
            <button
              onClick={openCompare}
              style={{
                ...ICON_BTN,
                width: "36px",
                height: "36px",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
              title="Compare APIs"
            >
              <GitCompare size={14} color="#22c55e" />
            </button>
          </div>
        </div>

        {/* ─── API PILL ─── */}
        {apiData && (
          <div style={{ position: "relative", zIndex: 10, flexShrink: 0, display: "flex", justifyContent: "center", padding: "12px 20px 0" }}>
            <div
              className="green-glow"
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "6px 16px", borderRadius: "99px",
                background: "rgba(34,197,94,0.07)",
                border: "1px solid rgba(34,197,94,0.22)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#86efac", letterSpacing: "0.02em" }}>
                {apiData.name}
              </span>
              {apiData.category && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.16)", fontSize: "10px" }}>·</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.27)", fontWeight: 500 }}>
                    {apiData.category}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─── CHAT AREA ─── */}
        <div
          ref={scrollRef}
          className="chat-scroll"
          style={{ position: "relative", zIndex: 10, flex: 1, overflowY: "auto", padding: "16px 0", minHeight: 0 }}
        >
          {/* Empty state */}
          {chat.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", padding: "24px 24px 8px", textAlign: "center" }}>
              <AnimatedOrb />

              <h2 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginTop: "22px", marginBottom: "8px", lineHeight: 1.22, letterSpacing: "-0.02em" }}>
                Ask anything about
                <br />
                <span
                  className="grad-anim"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #22c55e, #4ade80, #86efac, #22c55e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  this API
                </span>
              </h2>

              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", lineHeight: 1.75, maxWidth: "220px", marginBottom: "24px" }}>
                Understand endpoints, parameters, auth, and integration instantly.
              </p>

              {contextPrompt && (
                <div style={{ marginBottom: "20px", padding: "10px 18px", borderRadius: "18px", fontSize: "12px", fontWeight: 600, maxWidth: "300px", textAlign: "center", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.16)", color: "rgba(34,197,94,0.72)" }}>
                  {contextPrompt}
                </div>
              )}

              {apiData && (
                <div style={{ width: "100%", maxWidth: "340px" }}>
                  <ApiBreakdown api={{ ...apiData, description: undefined }} />
                </div>
              )}

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
            {loading && (
              <div className="msg-enter" style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <TypingIndicator />
              </div>
            )}
          </div>

          <div ref={bottomRef} style={{ height: "8px" }} />
        </div>

        {/* ─── INPUT AREA ─── */}
        <div
          style={{
            position: "relative", zIndex: 20, flexShrink: 0,
            padding: "8px 16px",
            paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
            background: "linear-gradient(0deg, rgba(3,10,5,1) 55%, rgba(3,10,5,0) 100%)",
          }}
        >
          <div className="shim-line" style={{ height: "1px", borderRadius: "99px", marginBottom: "10px", opacity: 0.45 }} />

          <ClaudeInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            disabled={loading}
          />

          <p style={{ textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.10)", marginTop: "8px", letterSpacing: "0.03em" }}>
            Powered by Apives AI · Results may vary
          </p>
        </div>
      </div>
    </>
  );
};

export default AskApivesPage;