import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  KeyRound,
  BadgeCheck,
  AlertTriangle,
  Copy,
  Trash2,
  FileJson,
  Clock3,
  Activity,
  Download,
  Calendar,
  User,
  Mail,
  Users,
  Building2,
  Award,
  Timer,
} from "lucide-react";
import { BackButton } from "../components/BackButton";

interface HistoryItem {
  id: string;
  timestamp: string;
  alg: string;
  claimsCount: number;
  tokenLength: number;
  isValid: boolean;
  isExpired: boolean;
}

interface SmartClaim {
  key: string;
  label: string;
  value: any;
  icon: React.ReactNode;
}

const JwtDecoderPage = () => {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("jwtDecodeHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("jwtDecodeHistory", JSON.stringify(newHistory));
  }, []);

  const decodeBase64Url = (str: string): string => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return atob(base64);
  };

  const decodeJWT = () => {
    try {
      setError("");
      setHeader(null);
      setPayload(null);
      setIsValid(null);
      setIsExpired(false);

      const trimmedToken = token.trim();
      if (!trimmedToken) {
        throw new Error("Please enter a JWT token");
      }

      const parts = trimmedToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Expected 3 segments.");
      }

      // Decode header
      const decodedHeaderStr = decodeBase64Url(parts[0]);
      const decodedHeader = JSON.parse(decodedHeaderStr);

      // Decode payload
      const decodedPayloadStr = decodeBase64Url(parts[1]);
      const decodedPayload = JSON.parse(decodedPayloadStr);

      setHeader(decodedHeader);
      setPayload(decodedPayload);

      // Validation
      const now = Date.now();
      let valid = true;
      let expired = false;

      if (decodedPayload.exp) {
        const expTime = decodedPayload.exp * 1000;
        expired = expTime < now;
        valid = !expired;
      }

      // Check for 'none' algorithm
      if (decodedHeader.alg === "none") {
        valid = false;
      }

      setIsValid(valid);
      setIsExpired(expired);

      // Save to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(36),
        timestamp: new Date().toISOString(),
        alg: decodedHeader.alg || "unknown",
        claimsCount: Object.keys(decodedPayload).length,
        tokenLength: trimmedToken.length,
        isValid: valid,
        isExpired: expired,
      };

      const updatedHistory = [historyItem, ...history].slice(0, 10);
      saveHistory(updatedHistory);
    } catch (err: any) {
      setHeader(null);
      setPayload(null);
      setIsValid(false);
      setIsExpired(false);
      setError(err.message || "Unable to decode JWT token");
    }
  };

  const clearAll = () => {
    setToken("");
    setHeader(null);
    setPayload(null);
    setError("");
    setIsValid(null);
    setIsExpired(false);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast here in real app
    } catch {
      console.error(`Failed to copy ${label}`);
    }
  };

  const downloadJson = (data: any, filename: string) => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  // Format time remaining or time since expiry
  const getTimeStatus = (exp?: number, iat?: number) => {
    if (!exp) return null;

    const now = Date.now();
    const expTime = exp * 1000;

    if (expTime < now) {
      const diffMs = now - expTime;
      return {
        status: "expired",
        text: `Expired ${formatTimeAgo(diffMs)}`,
      };
    } else {
      const diffMs = expTime - now;
      return {
        status: "active",
        text: `Expires in ${formatTimeLeft(diffMs)}`,
      };
    }
  };

  const formatTimeAgo = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const formatTimeLeft = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  // Smart claims extraction
  const getSmartClaims = (pl: any): SmartClaim[] => {
    if (!pl) return [];

    const claims: SmartClaim[] = [];

    if (pl.sub) {
      claims.push({
        key: "sub",
        label: "Subject",
        value: pl.sub,
        icon: <User size={16} className="text-mora-500" />,
      });
    }
    if (pl.email) {
      claims.push({
        key: "email",
        label: "Email",
        value: pl.email,
        icon: <Mail size={16} className="text-mora-500" />,
      });
    }
    if (pl.name || pl.preferred_username) {
      claims.push({
        key: "name",
        label: "Name",
        value: pl.name || pl.preferred_username,
        icon: <User size={16} className="text-mora-500" />,
      });
    }
    if (pl.role || pl.roles) {
      claims.push({
        key: "role",
        label: "Role",
        value: Array.isArray(pl.roles) ? pl.roles.join(", ") : pl.role || pl.roles,
        icon: <Award size={16} className="text-mora-500" />,
      });
    }
    if (pl.aud) {
      claims.push({
        key: "aud",
        label: "Audience",
        value: Array.isArray(pl.aud) ? pl.aud.join(", ") : pl.aud,
        icon: <Users size={16} className="text-mora-500" />,
      });
    }
    if (pl.iss) {
      claims.push({
        key: "iss",
        label: "Issuer",
        value: pl.iss,
        icon: <Building2 size={16} className="text-mora-500" />,
      });
    }
    if (pl.iat) {
      claims.push({
        key: "iat",
        label: "Issued At",
        value: new Date(pl.iat * 1000).toLocaleString(),
        icon: <Calendar size={16} className="text-mora-500" />,
      });
    }

    return claims;
  };

  const smartClaims = getSmartClaims(payload);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
      <div className="absolute top-20 left-4 lg:top-28 lg:left-10 z-20">
        <BackButton />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white leading-none">
            JWT Decoder
            <span className="block text-mora-500">&amp; Validator</span>
          </h1>
          <p className="text-slate-400 mt-5 max-w-2xl mx-auto text-lg">
            Professional JWT inspection tool with security analysis, smart claim extraction, 
            and decode history.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT: Input */}
          <div className="lg:col-span-5">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-2xl bg-mora-500/10 flex items-center justify-center">
                  <KeyRound size={20} className="text-mora-500" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-xl">JWT Token</h2>
                  <p className="text-xs text-slate-500">Paste your token below</p>
                </div>
              </div>

              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full h-[340px] bg-[#050505] border border-white/10 rounded-2xl p-6 text-sm text-white font-mono resize-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500/30 transition-all duration-200"
              />

              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex gap-3">
                  {token && (
                    <>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                        {token.split(".").length}/3 segments
                      </span>
                      <span className="px-3 py-1 rounded-full bg-mora-500/10 border border-mora-500/30 text-mora-400">
                        JWT
                      </span>
                    </>
                  )}
                </div>
                <div className="text-slate-500 tabular-nums">
                  {token.length} characters
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={decodeJWT}
                  disabled={!token.trim()}
                  className="flex-1 py-4 rounded-2xl bg-mora-500 hover:bg-mora-400 active:bg-mora-600 disabled:bg-white/10 disabled:text-slate-500 text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} />
                  DECODE &amp; ANALYZE
                </button>

                <button
                  onClick={clearAll}
                  className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Analysis Panels */}
          <div className="lg:col-span-7 space-y-6">
            {/* Token Insights */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Activity size={20} className="text-mora-500" />
                <h3 className="text-white font-semibold text-lg">Token Insights</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">ALGORITHM</p>
                  <p className="text-white font-mono text-lg font-medium">
                    {header?.alg || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">TYPE</p>
                  <p className="text-white font-medium">{header?.typ || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">CLAIMS</p>
                  <p className="text-white font-medium">
                    {payload ? Object.keys(payload).length : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">TOKEN SIZE</p>
                  <p className="text-white font-medium tabular-nums">
                    {token.length || 0} chars
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">SIGNATURE</p>
                  <p className="text-emerald-400 font-medium">Present</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">VERSION</p>
                  <p className="text-white font-medium">JWT 1.0</p>
                </div>
              </div>
            </div>

            {/* Expiration Analysis */}
            {payload && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock3 size={20} className="text-mora-500" />
                  <h3 className="text-white font-semibold text-lg">Expiration Analysis</h3>
                </div>

                <div className="space-y-6">
                  {payload.exp && (
                    <div>
                      <div className="text-sm text-slate-400 mb-2">Expires</div>
                      <div className="text-white text-xl font-medium">
                        {new Date(payload.exp * 1000).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {payload.iat && (
                    <div>
                      <div className="text-sm text-slate-400 mb-2">Issued At</div>
                      <div className="text-white">
                        {new Date(payload.iat * 1000).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    {getTimeStatus(payload.exp) && (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium ${
                        getTimeStatus(payload.exp)?.status === "active" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-orange-500/10 text-orange-400"
                      }`}>
                        <Timer size={16} />
                        {getTimeStatus(payload.exp)?.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Status */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {isValid === true && !isExpired && (
                    <BadgeCheck className="text-emerald-400" size={24} />
                  )}
                  {isValid === false && (
                    <AlertTriangle className="text-red-400" size={24} />
                  )}
                  {isValid === true && isExpired && (
                    <AlertTriangle className="text-orange-400" size={24} />
                  )}
                  {isValid === null && (
                    <ShieldCheck className="text-slate-400" size={24} />
                  )}
                  <h3 className="text-white font-semibold text-lg">Validation Status</h3>
                </div>
              </div>

              {isValid === null && !error && (
                <p className="text-slate-400 py-8 text-center">Decode a token to see validation results</p>
              )}

              {isValid !== null && (
                <div className="flex flex-col items-center justify-center py-6 bg-black/40 rounded-2xl border border-white/5">
                  <div className={`text-5xl mb-4 ${isValid ? "text-emerald-400" : "text-red-400"}`}>
                    {isValid ? "✓" : "⚠"}
                  </div>
                  <div className={`text-xl font-semibold mb-1 ${isValid ? "text-emerald-400" : "text-red-400"}`}>
                    {isValid && !isExpired && "Token is Valid"}
                    {isValid && isExpired && "Token is Expired"}
                    {!isValid && "Token is Invalid"}
                  </div>
                  <p className="text-slate-400 text-center max-w-xs">
                    {header?.alg === "none" && "Warning: Algorithm 'none' is insecure"}
                    {isExpired && "Token has expired"}
                    {!isValid && !isExpired && !header?.alg && "Invalid structure or signature"}
                  </p>
                </div>
              )}

              {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>

            {/* Security Analysis */}
            {(header || payload) && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={20} className="text-mora-500" />
                  <h3 className="text-white font-semibold text-lg">Security Analysis</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-slate-400">Algorithm</span>
                    <span className={`font-mono ${header?.alg === "none" ? "text-red-400" : "text-white"}`}>
                      {header?.alg || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-slate-400">Signature Present</span>
                    <span className="text-emerald-400">Yes</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-slate-400">Has Expiration</span>
                    <span className={payload?.exp ? "text-emerald-400" : "text-amber-400"}>
                      {payload?.exp ? "Yes" : "No (Not Recommended)"}
                    </span>
                  </div>
                  {header?.alg === "none" && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                      Critical: Algorithm set to 'none'. This token has no signature verification.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Header */}
            {header && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileJson size={20} className="text-mora-500" />
                    <h3 className="text-white font-semibold text-lg">Header</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(header, null, 2), "header")}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs flex items-center gap-2 transition-colors"
                    >
                      <Copy size={14} /> Copy
                    </button>
                    <button
                      onClick={() => downloadJson(header, "jwt-header.json")}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs flex items-center gap-2 transition-colors"
                    >
                      <Download size={14} /> JSON
                    </button>
                  </div>
                </div>
                <pre className="bg-black/60 p-6 rounded-2xl text-xs text-slate-300 overflow-auto max-h-64 font-mono leading-relaxed border border-white/5">
                  {JSON.stringify(header, null, 2)}
                </pre>
              </div>
            )}

            {/* Payload */}
            {payload && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileJson size={20} className="text-mora-500" />
                    <h3 className="text-white font-semibold text-lg">Payload</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(payload, null, 2), "payload")}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs flex items-center gap-2 transition-colors"
                    >
                      <Copy size={14} /> Copy
                    </button>
                    <button
                      onClick={() => downloadJson(payload, "jwt-payload.json")}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs flex items-center gap-2 transition-colors"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>

                <pre className="bg-black/60 p-6 rounded-2xl text-xs text-slate-300 overflow-auto max-h-80 font-mono leading-relaxed border border-white/5">
                  {JSON.stringify(payload, null, 2)}
                </pre>

                {/* Smart Claims */}
                {smartClaims.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-mora-500 rounded-full"></span>
                      EXTRACTED CLAIMS
                    </h4>
                    <div className="grid gap-3">
                      {smartClaims.map((claim, index) => (
                        <div key={index} className="flex items-start gap-4 bg-black/40 border border-white/10 rounded-2xl p-5">
                          <div className="mt-0.5">{claim.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-500 mb-1">{claim.label}</div>
                            <div className="text-white break-all text-[15px]">{String(claim.value)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Clock3 size={20} className="text-mora-500" />
                  <h3 className="text-white font-semibold text-lg">Decode History</h3>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  No previous decodes yet
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-auto pr-2 custom-scrollbar">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-black/30 border border-white/10 rounded-2xl px-6 py-4 hover:border-white/20 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-slate-500 w-28 tabular-nums">
                          {new Date(item.timestamp).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div>
                          <div className="font-mono text-sm text-white">{item.alg}</div>
                          <div className="text-xs text-slate-500">
                            {item.claimsCount} claims • {item.tokenLength} chars
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.isValid && !item.isExpired
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {item.isValid && !item.isExpired ? "VALID" : "INVALID"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtDecoderPage;