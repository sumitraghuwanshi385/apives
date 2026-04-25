import { useEffect, useState } from "react";
import {
  X,
  Clock,
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
  const [showConfirm, setShowConfirm] = useState(false);

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

  // ✅ DELETE CONFIRMED
  const confirmDelete = () => {
    selected.forEach((id) => {
      localStorage.removeItem(`apives_chat_${id}`);
      localStorage.removeItem(`apives_chat_title_${id}`);
    });

    setSelected([]);
    setSelectMode(false);
    setShowConfirm(false);
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
    <>
      {/* MAIN MODAL */}
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
            maxHeight: "72vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 20px",
              alignItems: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 700 }}>
              {selectMode
                ? `${selected.length} selected`
                : "Recent Chats"}
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              {!selectMode && (
                <button
                  onClick={() => setSelectMode(true)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} color="#ef4444" />
                </button>
              )}

              <button
                onClick={() => {
                  setSelectMode(false);
                  setSelected([]);
                }}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color="white" />
              </button>
            </div>
          </div>

          {/* LIST */}
          <div style={{ padding: "0 12px 20px", overflowY: "auto" }}>
            {entries.map((e) => {
              const isSelected = selected.includes(e.apiId);

              return (
                <div
                  key={e.apiId}
                  onClick={() => {
                    if (selectMode) toggleSelect(e.apiId);
                    else onSelect(e.apiId); // ✅ FIXED NAVIGATION
                  }}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    marginBottom: "6px",
                    border: isSelected
                      ? "1px solid #22c55e"
                      : "1px solid rgba(255,255,255,0.05)",
                    background: isSelected
                      ? "rgba(34,197,94,0.1)"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Sparkles size={14} color="#22c55e" />

                  <div style={{ flex: 1 }}>
                    <p style={{ color: "white", fontSize: "13px" }}>
                      {e.title}
                    </p>
                    <p style={{ color: "#777", fontSize: "11px" }}>
                      {e.preview}
                    </p>
                  </div>

                  {!selectMode && (
                    <ChevronRight size={14} color="#22c55e" />
                  )}
                </div>
              );
            })}
          </div>

          {/* DELETE BUTTON */}
          {selectMode && selected.length > 0 && (
            <div style={{ padding: "10px" }}>
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "12px",
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "#ef4444",
                  fontWeight: 600,
                }}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 CONFIRM MODAL */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#020202",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "20px",
              width: "90%",
              maxWidth: "320px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "white", marginBottom: "16px" }}>
              Delete selected chats?
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#111",
                  color: "white",
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#ef4444",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryModal;