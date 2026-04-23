// ✅ FULL OPTIMIZED + PREMIUM AskApivesPage (clean, fixed, production-ready)

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
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

/* ───────── GLOBAL STYLE FIX ───────── */
const STYLES = `
  body > nav,
  #root > nav,
  nav[data-global],
  header[data-global],
  body > footer,
  footer {
    display: none !important;
  }

  .glass {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(52,211,153,0.25);
    backdrop-filter: blur(16px);
  }

  .chat-scroll::-webkit-scrollbar { width: 3px; }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.2); }
`;

/* ───────── MESSAGE ───────── */
const Message = ({ role, text }: any) => {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`glass px-4 py-2 rounded-xl max-w-[80%] text-sm ${
          isUser ? "text-green-200" : "text-white/80"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

/* ───────── MIC ───────── */
const MicBtn = ({ onText }: any) => {
  const [on, setOn] = useState(false);
  const ref = useRef<any>(null);

  const toggle = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return alert("Not supported");

    if (on) {
      ref.current.stop();
      setOn(false);
      return;
    }

    const r = new SR();
    r.onresult = (e: any) => onText(e.results[0][0].transcript);
    r.onend = () => setOn(false);

    ref.current = r;
    r.start();
    setOn(true);
  };

  return (
    <button onClick={toggle}>
      {on ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
};

/* ───────── PAGE ───────── */
const AskApivesPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const apiId = params.get("apiId");
  const apiName = params.get("apiName");

  const isLoggedIn =
    !!localStorage.getItem("apives_token") ||
    !!localStorage.getItem("apives_user");

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<any>();

  const redirect = () =>
    navigate(
      `/access?returnUrl=${encodeURIComponent(
        window.location.pathname + window.location.search
      )}`
    );

  /* ───────── FETCH API ───────── */
  useEffect(() => {
    if (!apiId) return;
    axios.get(`/api/apis/${apiId}`).then((r) => setApiData(r.data));
  }, [apiId]);

  /* ───────── SCROLL ───────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  /* ───────── SEND ───────── */
  const send = async (txt?: string) => {
    if (!isLoggedIn) return redirect();

    const message = (txt || input).trim();
    if (!message) return;

    const updated = [...chat, { role: "user", content: message }];
    setChat(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ask-ai", {
        messages: updated,
        apiData,
      });

      setChat((c) => [
        ...c,
        { role: "assistant", content: res.data?.answer || "No response" },
      ]);
    } catch {
      setChat((c) => [
        ...c,
        {
          role: "assistant",
          content: "Unable to fetch response. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const displayName = apiName || apiData?.name;

  return (
    <>
      <style>{STYLES}</style>

      <div className="h-screen flex flex-col bg-[#060D0A] text-white">

        {/* HEADER (MINIMAL) */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <button onClick={() => navigate(-1)}>
            <X size={18} color="#34d399" />
          </button>

          <div className="text-sm font-semibold text-mora-500">
            Ask Apives AI
          </div>

          <button onClick={() => isLoggedIn ? null : redirect()}>
            <GitCompare size={16} color="#34d399" />
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto chat-scroll px-3 py-4 space-y-3">
          {chat.length === 0 && (
            <div className="text-center mt-20">
              <div className="text-2xl font-bold text-mora-500">
                The API Intelligence you deserve
              </div>

              {displayName && (
                <div className="mt-4 inline-block px-4 py-2 rounded-full glass text-mora-400">
                  {displayName}
                </div>
              )}

              {apiData && (
                <div className="mt-6">
                  <ApiBreakdown api={{ ...apiData, description: undefined }} />
                </div>
              )}

              <div className="mt-6">
                <SuggestedPrompts onClick={(t: string) => send(t)} />
              </div>
            </div>
          )}

          {chat.map((m, i) => (
            <Message key={i} role={m.role} text={m.content} />
          ))}

          {loading && <div className="text-xs text-mora-400">Thinking...</div>}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-white/5">
          <div className="glass rounded-xl flex items-center px-3 py-2 gap-2">
            <input
              value={input}
              onFocus={() => !isLoggedIn && redirect()}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                displayName
                  ? `Ask anything about ${displayName}...`
                  : "Ask anything about any API..."
              }
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <MicBtn onText={(t: string) => setInput((v) => v + " " + t)} />

            <button onClick={() => send()}>
              <ArrowUp size={16} color="#34d399" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AskApivesPage;