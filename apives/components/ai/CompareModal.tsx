import { useEffect, useState } from "react";
import axios from "axios";
import { X, Zap } from "lucide-react";

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

      const res = await fetch("https://apives-3xrc.onrender.com/api/ai/compare", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: prompt,
  }),
});

const data = await res.json();

setResult(data.result);

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
          <button
  onClick={onClose}
  style={{
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",

    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",

    border: "1px solid rgba(255,255,255,0.12)",

    boxShadow: `
      inset 0 1px 2px rgba(255,255,255,0.15),
      0 4px 12px rgba(0,0,0,0.35)
    `,

    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
    e.currentTarget.style.transform = "scale(1.08)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  <X size={14} color="rgba(255,255,255,0.75)" />
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

export default CompareModal;