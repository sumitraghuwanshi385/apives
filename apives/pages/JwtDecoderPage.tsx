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
  CheckCircle2,
  XCircle,
  Search,
  Check,
  Network,
Key,
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
  tokenValue: string;
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
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [payloadSearch, setPayloadSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check login status
  useEffect(() => {
    const user = localStorage.getItem("mora_user");
    setIsLoggedIn(!!user);
  }, []);

  // Load history from localStorage (only for logged-in users)
  useEffect(() => {
    if (!isLoggedIn) return;
    const savedHistory = localStorage.getItem("jwtDecodeHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [isLoggedIn]);

  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    if (!isLoggedIn) return;
    setHistory(newHistory);
    localStorage.setItem("jwtDecodeHistory", JSON.stringify(newHistory));
  }, [isLoggedIn]);

  const decodeBase64Url = (str: string): string => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return atob(base64);
  };

  const calculateSecurityScore = (hdr: any, pld: any, parts: string[], expired: boolean): number => {
    if (hdr?.alg === "none") return 0;

    let score = 0;
    if (parts.length === 3 && parts[2]?.length > 10) score += 35;
    if (pld?.exp) score += 25;
    if (hdr?.alg && hdr.alg !== "none") score += 40;

    if (expired) score = Math.max(0, score - 30);

    return Math.min(100, Math.max(0, score));
  };

  const decodeJWT = () => {
    try {
      setError("");
      setHeader(null);
      setPayload(null);
      setIsValid(null);
      setIsExpired(false);
      setSecurityScore(0);
      setPayloadSearch("");

      const trimmedToken = token.trim();
      if (!trimmedToken) throw new Error("Please enter a JWT token");

      const parts = trimmedToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Expected 3 segments (Header.Payload.Signature)");
      }

      const decodedHeaderStr = decodeBase64Url(parts[0]);
      const decodedHeader = JSON.parse(decodedHeaderStr);

      const decodedPayloadStr = decodeBase64Url(parts[1]);
      const decodedPayload = JSON.parse(decodedPayloadStr);

      setHeader(decodedHeader);
      setPayload(decodedPayload);

      const now = Date.now();
      let valid = true;
      let expired = false;

      if (decodedPayload.exp) {
        const expTime = decodedPayload.exp * 1000;
        expired = expTime < now;
        valid = !expired;
      }

      if (decodedHeader.alg === "none") valid = false;

      setIsValid(valid);
      setIsExpired(expired);
      setSecurityScore(calculateSecurityScore(decodedHeader, decodedPayload, parts, expired));

      if (isLoggedIn) {
        const historyItem: HistoryItem = {
          id: Date.now().toString(36),
          timestamp: new Date().toISOString(),
          alg: decodedHeader.alg || "unknown",
          claimsCount: Object.keys(decodedPayload).length,
          tokenLength: trimmedToken.length,
          isValid: valid,
          isExpired: expired,
          tokenValue: trimmedToken,
        };

        const updatedHistory = [historyItem, ...history].slice(0, 10);
        saveHistory(updatedHistory);
      }
    } catch (err: any) {
      setHeader(null);
      setPayload(null);
      setIsValid(false);
      setIsExpired(false);
      setSecurityScore(0);
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
    setSecurityScore(0);
    setPayloadSearch("");
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Copy failed");
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
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    if (!isLoggedIn) return;
    saveHistory([]);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setToken(item.tokenValue);
    setTimeout(() => {
      decodeJWT();
    }, 80);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getTimeStatus = (exp?: number) => {
    if (!exp) return null;
    const now = Date.now();
    const expTime = exp * 1000;

    if (expTime < now) {
      const diffMs = now - expTime;
      return { status: "expired", text: `Expired ${formatTimeAgo(diffMs)}` };
    } else {
      const diffMs = expTime - now;
      return { status: "active", text: `Expires in ${formatTimeLeft(diffMs)}` };
    }
  };

  const getTokenAge = (iat?: number) => {
    if (!iat) return null;
    const now = Date.now();
    const iatTime = iat * 1000;
    const diffMs = now - iatTime;
    return `Issued ${formatTimeAgo(diffMs)}`;
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

  const getSmartClaims = (pl: any): SmartClaim[] => {
    if (!pl) return [];
    const claims: SmartClaim[] = [];

    if (pl.sub) claims.push({ key: "sub", label: "Subject", value: pl.sub, icon: <User size={16} className="text-mora-500" /> });
    if (pl.email) claims.push({ key: "email", label: "Email", value: pl.email, icon: <Mail size={16} className="text-mora-500" /> });
    if (pl.name || pl.preferred_username) {
      claims.push({ key: "name", label: "Name", value: pl.name || pl.preferred_username, icon: <User size={16} className="text-mora-500" /> });
    }
    if (pl.role || pl.roles) {
      const roleVal = Array.isArray(pl.roles) ? pl.roles.join(", ") : (pl.role || pl.roles);
      claims.push({ key: "role", label: "Role", value: roleVal, icon: <Award size={16} className="text-mora-500" /> });
    }
    if (pl.aud) {
      const audVal = Array.isArray(pl.aud) ? pl.aud.join(", ") : pl.aud;
      claims.push({ key: "aud", label: "Audience", value: audVal, icon: <Users size={16} className="text-mora-500" /> });
    }
    if (pl.iss) claims.push({ key: "iss", label: "Issuer", value: pl.iss, icon: <Building2 size={16} className="text-mora-500" /> });
    if (pl.iat) {
      claims.push({ key: "iat", label: "Issued At", value: new Date(pl.iat * 1000).toLocaleString(), icon: <Calendar size={16} className="text-mora-500" /> });
    }
    return claims;
  };

  const smartClaims = getSmartClaims(payload);

  const parts = token.trim().split(".");
  const hasSignature = header && payload && parts.length === 3 && parts[2]?.length > 10;

  const filteredPayload = React.useMemo(() => {
    if (!payload || !payloadSearch.trim()) return payload;
    const searchTerm = payloadSearch.toLowerCase().trim();
    const filtered: any = {};
    Object.keys(payload).forEach(key => {
      if (key.toLowerCase().includes(searchTerm) || String(payload[key]).toLowerCase().includes(searchTerm)) {
        filtered[key] = payload[key];
      }
    });
    return filtered;
  }, [payload, payloadSearch]);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      {/* Back Button */}
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-6xl mx-auto px-5 lg:px-6 relative z-10">
        {/* Hero */}
        
<div className="text-center mb-8 md:mb-12">

  <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4">
    <KeyRound className="text-mora-500" size={24} />
  </div>

<h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-[0.95]">
            JWT Decoder
            <span className="block text-mora-500">
              &amp; Validator
            </span>
          </h1>

  

  <p className="text-slate-400 mt-5 max-w-2xl mx-auto text-base lg:text-lg">
    Professional-grade JWT analysis with real-time security scoring and smart insights.
  </p>

</div>

        <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
          {/* INPUT SECTION */}
          <div className="lg:col-span-5">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-2xl bg-mora-500/10 flex items-center justify-center">
                  <KeyRound size={20} className="text-mora-500" />
                </div>
                <div>
                  <h2 className="text-white text-xl lg:text-2xl font-semibold">JWT Token</h2>
                  <p className="text-xs lg:text-sm text-slate-500">Enter token to analyze</p>
                </div>
              </div>

              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full h-[220px] md:h-[280px] lg:h-[340px] bg-[#050505] border border-white/10 rounded-2xl p-5 lg:p-6 text-sm text-white font-mono resize-none focus:border-mora-500 focus:ring-2 focus:ring-mora-500/30 transition-all"
              />

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex gap-3">
                  {token && (
                    <>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        {parts.length}/3 segments
                      </span>
                      <span className="px-3 py-1 rounded-full bg-mora-500/10 border border-mora-500/30 text-mora-400">JWT</span>
                    </>
                  )}
                </div>
                <div>{token.length} characters</div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={decodeJWT}
                  disabled={!token.trim()}
                  className="flex-1 py-3.5 lg:py-4 px-6 lg:px-8 rounded-full bg-mora-500 hover:bg-mora-400 active:bg-mora-600 disabled:bg-white/10 disabled:text-slate-500 text-black font-semibold text-sm lg:text-base tracking-wide transition-all duration-200"
                >
                  DECODE &amp; ANALYZE
                </button>

                <button
                  onClick={clearAll}
                  className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-red-500/30 hover:text-red-400 transition-all group"
                >
                  <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {token && (
                <button
                  onClick={() => copyToClipboard(token, "full-token")}
                  className="mt-4 w-full py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedId === "full-token" ? (
                    <><Check size={16} className="text-mora-400" /> Copied</>
                  ) : (
                    <><Copy size={16} /> Copy Full Token</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ANALYSIS PANELS */}
          <div className="lg:col-span-7 space-y-3 md:space-y-5 lg:space-y-6">
            {/* Token Insights */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Activity size={20} className="text-mora-500" />
                <h3 className="text-white font-semibold text-lg lg:text-xl">Token Insights</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">ALGORITHM</p>
                  <p className="font-mono text-lg text-white">{header?.alg || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">TYPE</p>
                  <p className="text-white">{header?.typ || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">CLAIMS</p>
                  <p className="text-white">{payload ? Object.keys(payload).length : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">TOKEN SIZE</p>
                  <p className="text-white tabular-nums">{token.length || 0} chars</p>
                </div>
              </div>

              {payload && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">QUICK CLAIMS</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["iss", "sub", "aud", "email", "role"].map((key) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="text-mora-500">
                          {key === "iss" && <Building2 size={18} />}
                          {key === "sub" && <User size={18} />}
                          {key === "aud" && <Users size={18} />}
                          {key === "email" && <Mail size={18} />}
                          {key === "role" && <Award size={18} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-500 capitalize">{key}</p>
                          <p className="text-sm text-white truncate">{payload[key] || "—"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* JWT Structure - Compact Horizontal */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5">
                <Network size={20} className="text-mora-500" />
                <h3 className="text-white font-semibold text-lg">JWT Structure</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                {[
                  { label: "Header", present: !!header },
                  { label: "Payload", present: !!payload },
                  { label: "Signature", present: hasSignature },
                ].map((seg, i) => (
                  <div key={i} className={`flex-1 rounded-2xl px-5 py-4 border flex items-center gap-3 ${seg.present ? "border-mora-500/30 bg-mora-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                    {seg.present ? (
                      <CheckCircle2 className="text-mora-400" size={22} />
                    ) : (
                      <XCircle className="text-red-400" size={22} />
                    )}
                    <div>
                      <p className="font-medium text-white text-sm">{seg.label}</p>
                      <p className={`text-xs ${seg.present ? "text-mora-400" : "text-red-400"}`}>
                        {seg.present ? "Present" : "Missing"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Analysis */}
            {(header || payload) && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-mora-500" />
                    <h3 className="text-white font-semibold text-lg">Security Analysis</h3>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-sm font-semibold tabular-nums ${securityScore >= 80 ? "bg-mora-500/10 text-mora-400" : securityScore >= 50 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                    Score: {securityScore}/100
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-slate-400">Algorithm</span>
                    <span className={`font-mono ${header?.alg === "none" ? "text-red-400" : "text-white"}`}>{header?.alg || "—"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-slate-400">Signature</span>
                    <span className={hasSignature ? "text-mora-400" : "text-red-400"}>{hasSignature ? "Present" : "Missing"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-slate-400">Expiration Claim</span>
                    <span className={payload?.exp ? "text-mora-400" : "text-amber-400"}>{payload?.exp ? "Present" : "Missing"}</span>
                  </div>
                </div>

                {header?.alg === "none" && (
                  <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                    Critical: Algorithm is set to <span className="font-mono">'none'</span>.
                  </div>
                )}
              </div>
            )}

            {/* Validation Status - Compact */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5">
                {isValid === true && !isExpired && <div className="w-8 h-8 rounded-xl bg-mora-500/10 flex items-center justify-center"><BadgeCheck className="text-mora-400" size={22} /></div>}
                {(isValid === false || isExpired) && <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="text-red-400" size={22} /></div>}
                {isValid === null && <div className="w-8 h-8 rounded-xl bg-slate-700/50 flex items-center justify-center"><ShieldCheck className="text-slate-400" size={22} /></div>}

                <div>
                  <h3 className="text-white font-semibold text-lg">Validation Status</h3>
                  <p className="text-xs text-slate-500">Token integrity check</p>
                </div>
              </div>

              {isValid === null && !error && (
                <div className="text-center py-8 text-slate-500 text-sm">Decode a token to see results</div>
              )}

              {isValid !== null && (
                <div className={`rounded-2xl p-4 md:p-5 text-center border ${isValid && !isExpired ? "border-mora-500/30 bg-mora-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                  <div className={`text-2xl font-semibold mb-1 ${isValid && !isExpired ? "text-mora-400" : "text-red-400"}`}>
                    {isValid && !isExpired ? "Valid Token" : isExpired ? "Expired Token" : "Invalid Token"}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {header?.alg === "none" 
                      ? "Algorithm 'none' detected - insecure" 
                      : isExpired 
                        ? "This token has expired" 
                        : isValid 
                          ? "Token passed validation checks" 
                          : "Token failed validation checks"}
                  </p>
                </div>
              )}

              {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}
            </div>

            {/* Expiration Analysis */}
            {payload && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock3 size={20} className="text-mora-500" />
                  <h3 className="text-lg font-semibold text-white">Expiration Analysis</h3>
                </div>

                <div className="space-y-6">
                  {payload.iat && (
                    <div>
                      <div className="text-slate-400 text-sm">Issued At</div>
                      <div className="text-white mt-1">{new Date(payload.iat * 1000).toLocaleString()}</div>
                      <div className="text-mora-400 text-sm mt-1">{getTokenAge(payload.iat)}</div>
                    </div>
                  )}
                  {payload.exp && (
                    <div>
                      <div className="text-slate-400 text-sm">Expires At</div>
                      <div className="text-white mt-1">{new Date(payload.exp * 1000).toLocaleString()}</div>
                    </div>
                  )}

                  {getTimeStatus(payload.exp) && (
                    <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium ${getTimeStatus(payload.exp)?.status === "active" ? "bg-mora-500/10 text-mora-400" : "bg-orange-500/10 text-orange-400"}`}>
                      <Timer size={20} />
                      {getTimeStatus(payload.exp)?.text}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Header */}
            {header && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <FileJson size={20} className="text-mora-500" />
                    <h3 className="text-lg font-semibold text-white">Header</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(header, null, 2), "header")}
                      className="px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      {copiedId === "header" ? <Check size={15} className="text-mora-400" /> : <Copy size={15} />} Copy
                    </button>
                    <button 
                      onClick={() => downloadJson(header, "jwt-header.json")} 
                      className="px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      <Download size={15} /> JSON
                    </button>
                  </div>
                </div>
                <pre className="bg-black/70 p-5 rounded-2xl text-xs text-slate-300 overflow-auto max-h-60 font-mono border border-white/5">
                  {JSON.stringify(header, null, 2)}
                </pre>
              </div>
            )}

            {/* Payload */}
            {payload && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <FileJson size={20} className="text-mora-500" />
                    <h3 className="text-lg font-semibold text-white">Payload</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(payload, null, 2), "payload")}
                      className="px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      {copiedId === "payload" ? <Check size={15} className="text-mora-400" /> : <Copy size={15} />} Copy
                    </button>
                    <button 
                      onClick={() => downloadJson(payload, "jwt-payload.json")} 
                      className="px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      <Download size={15} /> JSON
                    </button>
                  </div>
                </div>

                <div className="relative mb-5">
                  <div className="absolute left-4 top-3.5 text-slate-500">
                    <Search size={17} />
                  </div>
                  <input
                    type="text"
                    value={payloadSearch}
                    onChange={(e) => setPayloadSearch(e.target.value)}
                    placeholder="Search claims..."
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 py-3 text-sm text-white placeholder:text-slate-500 focus:border-mora-500"
                  />
                </div>

                <pre className="bg-black/70 p-5 rounded-2xl text-xs text-slate-300 overflow-auto max-h-72 font-mono border border-white/5">
                  {JSON.stringify(filteredPayload || payload, null, 2)}
                </pre>

                {smartClaims.length > 0 && (
                  <div className="mt-8">
                    <h4 className="uppercase text-xs tracking-widest text-slate-500 mb-4">SMART CLAIMS</h4>
                    <div className="grid gap-3">
                      {smartClaims.map((claim, idx) => (
                        <div key={idx} className="flex gap-4 bg-black/40 border border-white/10 rounded-2xl p-5">
                          <div className="text-mora-500 mt-0.5">{claim.icon}</div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-400">{claim.label}</p>
                            <p className="text-white text-sm break-all mt-0.5">{String(claim.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Decode History */}
            {isLoggedIn && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Clock3 size={20} className="text-mora-500" />
                    <h3 className="text-lg font-semibold text-white">Decode History</h3>
                  </div>
                  {history.length > 0 && (
                    <button onClick={clearHistory} className="text-red-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors">
                      <Trash2 size={16} /> Clear
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No previous decodes yet</div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-auto pr-2 custom-scrollbar">
                    {history.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => loadFromHistory(item)}
                        className="flex items-center justify-between bg-black/40 border border-white/10 hover:border-mora-500/50 rounded-2xl px-5 py-4 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="text-xs text-slate-500 w-24 tabular-nums">
                            {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-mono text-sm text-white truncate">{item.alg}</div>
                            <div className="text-xs text-slate-500">{item.claimsCount} claims • {item.tokenLength} chars</div>
                          </div>
                        </div>
                        <div className={`px-3 py-0.5 rounded-full text-xs font-medium ${item.isValid && !item.isExpired ? "bg-mora-500/10 text-mora-400" : "bg-red-500/10 text-red-400"}`}>
                          {item.isValid && !item.isExpired ? "VALID" : "INVALID"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtDecoderPage;