import React, { useState } from "react";
import {
ShieldCheck,
KeyRound,
BadgeCheck,
AlertTriangle,
Copy,
Trash2,
FileJson
} from "lucide-react";
import { BackButton } from "../components/BackButton";

const JwtDecoderPage = () => {
const [token, setToken] = useState("");
const [header, setHeader] = useState<any>(null);
const [payload, setPayload] = useState<any>(null);
const [error, setError] = useState("");
const [isValid, setIsValid] = useState<boolean | null>(null);

const decodeJWT = () => {
try {
setError("");

  const parts = token.trim().split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const decodedHeader = JSON.parse(atob(parts[0]));
  const decodedPayload = JSON.parse(atob(parts[1]));

  setHeader(decodedHeader);
  setPayload(decodedPayload);

  if (decodedPayload.exp) {
    const expired = decodedPayload.exp * 1000 < Date.now();
    setIsValid(!expired);
  } else {
    setIsValid(true);
  }
} catch {
  setHeader(null);
  setPayload(null);
  setIsValid(false);
  setError("Unable to decode JWT token");
}

};

const clearAll = () => {
setToken("");
setHeader(null);
setPayload(null);
setError("");
setIsValid(null);
};

const copyPayload = async () => {
if (!payload) return;
await navigator.clipboard.writeText(
JSON.stringify(payload, null, 2)
);
};

return (
<div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">

  <div className="absolute top-20 left-4 lg:left-8 z-20">
    <BackButton />
  </div>

  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.14),transparent_60%)]" />
  </div>

  <div className="max-w-6xl mx-auto px-6 relative z-10">

    <div className="text-center mb-12">

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mora-500/20 bg-mora-500/10 text-mora-400 text-[11px] uppercase tracking-[0.3em] font-black mb-6">
        <ShieldCheck size={12} />
        APIVES SECURITY TOOL
      </div>

      <h1 className="text-4xl md:text-7xl font-display font-bold text-white leading-none">
        JWT Decoder
        <span className="block text-mora-500">
          & Validator
        </span>
      </h1>

      <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
        Decode JWT tokens, inspect claims, verify expiration,
        and analyze payload data instantly.
      </p>

    </div>

    <div className="grid lg:grid-cols-2 gap-6">

      <div className="bg-[#070707] border border-white/10 rounded-3xl p-5">

        <div className="flex items-center gap-2 mb-4">
          <KeyRound size={18} className="text-mora-500" />
          <h2 className="text-white font-bold">
            JWT Token
          </h2>
        </div>

        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT token here..."
          className="w-full h-[260px] bg-black border border-white/10 rounded-xl p-4 text-sm text-white resize-none"
        />

        <div className="flex gap-3 mt-4">

          <button
            onClick={decodeJWT}
            className="flex-1 py-3 rounded-xl bg-mora-500 text-black font-bold"
          >
            Decode Token
          </button>

          <button
            onClick={clearAll}
            className="px-4 rounded-xl border border-white/10 text-slate-300"
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>

      <div className="space-y-6">

        <div className="bg-[#070707] border border-white/10 rounded-3xl p-5">

          <div className="flex items-center gap-2 mb-4">

            {isValid ? (
              <BadgeCheck className="text-green-400" size={18} />
            ) : (
              <AlertTriangle className="text-yellow-400" size={18} />
            )}

            <h2 className="text-white font-bold">
              Validation Status
            </h2>

          </div>

          {isValid === null && (
            <p className="text-slate-400">
              Waiting for JWT token...
            </p>
          )}

          {isValid === true && (
            <div className="text-green-400 font-medium">
              Token appears valid.
            </div>
          )}

          {isValid === false && (
            <div className="text-red-400 font-medium">
              Token invalid or expired.
            </div>
          )}

          {error && (
            <p className="text-red-400 mt-3">
              {error}
            </p>
          )}

        </div>

        <div className="bg-[#070707] border border-white/10 rounded-3xl p-5">

          <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-2">
              <FileJson size={18} className="text-mora-500" />
              <h2 className="text-white font-bold">
                Header
              </h2>
            </div>

          </div>

          <pre className="text-xs text-slate-300 overflow-auto max-h-56">
            {header
              ? JSON.stringify(header, null, 2)
              : "Decoded header will appear here"}
          </pre>

        </div>

        <div className="bg-[#070707] border border-white/10 rounded-3xl p-5">

          <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-2">
              <FileJson size={18} className="text-mora-500" />
              <h2 className="text-white font-bold">
                Payload
              </h2>
            </div>

            <button
              onClick={copyPayload}
              className="border border-white/10 rounded-lg px-3 py-2 text-xs"
            >
              <Copy size={14} />
            </button>

          </div>

          <pre className="text-xs text-slate-300 overflow-auto max-h-72">
            {payload
              ? JSON.stringify(payload, null, 2)
              : "Decoded payload will appear here"}
          </pre>

        </div>

      </div>

    </div>

  </div>
</div>

);
};

export default JwtDecoderPage;