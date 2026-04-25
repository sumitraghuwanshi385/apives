import { useEffect, useState } from "react";
import {
  X,
  Clock,
  History,
  ChevronRight,
  Sparkles,
  Trash2,
} from "lucide-react";

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
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
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
  };

  // 🔴 DELETE LOGIC
  const deleteSelected = () => {
    selected.forEach((id) => {
      localStorage.removeItem(`apives_chat_${id}`);
      localStorage.removeItem(`apives_chat_title_${id}`);
    });

    setSelected([]);
    setSelectMode(false);
    loadHistory();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(14px)",
      }}
      onClick={onClose}
    >
      <div
        className="slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "24px 24px 0 0",
          background: "rgba(5,14,9,0.99)",
          border: "1px solid rgba(34,197,94,0.12)",
          borderBottom: "none",
          boxShadow: "0 -12px 60px rgba(0,0,0,0.6)",
          maxHeight: "72vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HANDLE */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div
            style={{
              width: "36px",
              height: "3px",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.12)",
            }}
          />
        </div>

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(34,197,94,0.09)",
                border: "1px solid rgba(34,197,94,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock size={14} color="#22c55e" />
            </div>

            <span style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>
              Recent Chats
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {/* 🔴 CLEAR HISTORY BUTTON */}
            <button
              onClick={() => setSelectMode(!selectMode)}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
              }}
            >
              <Trash2 size={13} color="#ef4444" />
            </button>

            <button
              onClick={onClose}
              className="glass-btn"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={12} color="rgba(255,255,255,0.45)" />
            </button>
          </div>
        </div>

        {/* 🔴 SELECT COUNT BAR */}
        {selectMode && (
          <div
            style={{
              padding: "8px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "12px", color: "#22c55e" }}>
              {selected.length} selected
            </span>

            <button
              onClick={deleteSelected}
              style={{
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.4)",
                color: "#ef4444",
                fontSize: "11px",
              }}
            >
              Delete
            </button>
          </div>
        )}

        {/* LIST */}
        <div style={{ overflowY: "auto", padding: "0 12px 24px", flex: 1 }}>
          {entries.map((e) => {
            const isSelected = selected.includes(e.apiId);

            return (
              <div
                key={e.apiId}
                className="history-item"
                onClick={() => {
                  if (selectMode) toggleSelect(e.apiId);
                  else onSelect(e.apiId);
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: isSelected
                    ? "1px solid rgba(34,197,94,0.5)"
                    : "1px solid rgba(255,255,255,0.05)",
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: isSelected
                    ? "rgba(34,197,94,0.1)"
                    : "transparent",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(34,197,94,0.07)",
                    border: "1px solid rgba(34,197,94,0.13)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={14} color="#22c55e" />
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", color: "white" }}>
                    {e.title}
                  </p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                    {e.preview}
                  </p>
                </div>

                {!selectMode && (
                  <ChevronRight size={14} color="rgba(34,197,94,0.35)" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;