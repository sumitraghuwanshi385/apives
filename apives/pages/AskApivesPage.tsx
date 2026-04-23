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
  History,
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

/* ─── GLOBAL STYLES ─── */
const STYLES = `
  nav, header, footer, [data-global] { display:none !important; }

  .chat-scroll::-webkit-scrollbar { width: 3px }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.2) }

  @keyframes fadeIn {
    from { opacity:0; transform:translateY(8px) }
    to { opacity:1; transform:translateY(0) }
  }
`;

/* ─── ORB ─── */
const Orb = () => {
  const words = [
    "Endpoints",
    "Docs",
    "Usage",
    "Auth",
    "Requests",
    "Response",
    "Integration",
  ];

  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((p) => (p + 1) % words.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute -inset-3 rounded-full bg-mora-green/20 blur-xl" />

        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-mora-green to-emerald-600 shadow-[0_0_40px_rgba(52,211,153,0.4)]" />

        <span className="text-xs font-semibold text-white z-10">
          {words[i]}
        </span>
      </div>
    </div>
  );
};

/* ─── MESSAGE ─── */
const Message = ({ role, content }: any) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
          isUser
            ? "bg-mora-green/10 border border-mora-green/30"
            : "bg-white/5 border border-white/10"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

/* ─── MIC ─── */
const MicButton = ({ onText }: any) => {
  const [on, setOn] = useState(false);
  const ref = useRef<any>();

  const toggle = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) return alert("Mic not supported");

    if (on) {
      ref.current.stop();
      setOn(false);
      return;
    }

    const r = new SR();
    r.onresult = (e: any) => {
      onText(e.results[0][0].transcript);
    };
    r.onend = () => setOn(false);

    ref.current = r;
    r.start();
    setOn(true);
  };

  return (
    <button
      onClick={toggle}
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        on
          ? "bg-red-500/20 border border-red-500/40"
          : "bg-white/5 border border-white/10"
      }`}
    >
      {on ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
};

/* ─── MAIN ─── */
const AskApivesPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const apiId = params.get("apiId");
  const apiName = params.get("apiName");

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const bottomRef = useRef<any>();

  const isLoggedIn =
    !!localStorage.getItem("apives_token") ||
    !!localStorage.getItem("apives_user");

  useEffect(() => {
    if (!apiId) return;
    axios.get(`/api/apis/${apiId}`).then((r) => setApiData(r.data));
  }, [apiId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = async (txt?: string) => {
    const msg = (txt || input).trim();
    if (!msg) return;

    const newChat = [...chat, { role: "user", content: msg }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ask-ai", {
        messages: newChat,
        apiData,
      });

      setChat((c) => [
        ...c,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch {
      setChat((c) => [
        ...c,
        { role: "assistant", content: "Error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="h-screen flex flex-col bg-[#060D0A] text-white">

        {/* BG EFFECT */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-mora-green/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-mora-green/10 blur-3xl" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border-b border-mora-green/10">
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <X size={16} />
          </button>

          <div className="text-sm font-bold text-mora-green">
            Ask Apives AI
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/access");
                return;
              }
              setShowHistory(true);
            }}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <History size={14} />
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto chat-scroll px-3 py-4 space-y-3">

          {chat.length === 0 && (
            <div className="text-center mt-20">
              <Orb />

              <h2 className="mt-4 font-bold text-lg">
                The API Intelligence <br />
                <span className="text-mora-green">you deserve</span>
              </h2>

              {apiName && (
                <div className="mt-3 text-mora-green text-sm">
                  {apiName}
                </div>
              )}

              {/* FIXED: description removed */}
              {apiData && (
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                  <ApiBreakdown api={{ ...apiData, description: undefined }} />
                </div>
              )}

              <div className="mt-6">
                <SuggestedPrompts onClick={(t: string) => send(t)} />
              </div>
            </div>
          )}

          {chat.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}

          {loading && <div className="text-xs text-mora-green">Thinking...</div>}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-mora-green/10">
          <div className="flex items-center gap-2 bg-white/5 border border-mora-green/20 px-3 py-2 rounded-xl">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about any API..."
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <MicButton onText={(t: string) => setInput(t)} />

            <button onClick={() => send()}>
              <ArrowUp size={16} className="text-mora-green" />
            </button>

          </div>
        </div>

      </div>
    </>
  );
};

export default AskApivesPage;