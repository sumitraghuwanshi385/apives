import { useEffect, useState } from "react";
import { X, Clock, History, ChevronRight, Sparkles } from "lucide-react";

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

export default HistoryModal;