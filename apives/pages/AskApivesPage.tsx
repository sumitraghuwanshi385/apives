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

/* ---------------- STYLES ---------------- */
const STYLES = `
nav, header, footer, [data-global] {
  display:none !important;
}

.chat-scroll::-webkit-scrollbar {
  width:4px;
}
.chat-scroll::-webkit-scrollbar-thumb {
  background:#10b98140;
  border-radius:999px;
}

@keyframes fadeIn {
  from {opacity:0; transform:translateY(8px)}
  to {opacity:1; transform:translateY(0)}
}
.msg { animation:fadeIn .25s ease }

@keyframes orbPulse {
  0%,100% { box-shadow:0 0 30px rgba(16,185,129,0.4)}
  50% { box-shadow:0 0 60px rgba(16,185,129,0.7)}
}
`;

/* ---------------- ORB ---------------- */
const Orb = () => {
  const words = [
    "Docs",
    "Endpoints",
    "Auth",
    "Usage",
    "Requests",
    "Response",
  ];

  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((p) => (p + 1) % words.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex justify-center">
      <div
        className="w-[110px] h-[110px] rounded-full flex items-center justify-center text-xs font-semibold text-white"
        style={{
          background: "linear-gradient(135deg,#10b981,#059669)",
          animation: "orbPulse 3s ease-in-out infinite",
        }}
      >
        {words[i]}
      </div>
    </div>
  );
};

/* ---------------- MIC ---------------- */
const MicButton = ({ onText }: any) => {
  const [on, setOn] = useState(false);
  const ref = useRef<any>();

  const toggle = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      alert("Mic not supported");
      return;
    }

    if (on) {
      ref.current?.stop();
      setOn(false);
      return;
    }

    const r = new SR();
    r.lang = "en-US";

    r.onresult = (e: any) => {
      onText(e.results[0][0].transcript);
      setOn(false);
    };

    r.onerror = () => setOn(false);
    r.onend = () => setOn(false);

    ref.current = r;
    r.start();
    setOn(true);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-white/5 border border-white/10"
    >
      {on ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
};

/* ---------------- MESSAGE ---------------- */
const Message = ({ role, content }: any) => {
  const isUser = role === "user";

  return (
    <div className={`msg flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
          isUser
            ? "bg-green-500/10 border border-green-500/30"
            : "bg-white/5 border border-white/10"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

/* ---------------- PAGE ---------------- */
const AskApivesPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const apiId = params.get("apiId");
  const apiName = params.get("apiName");

  const [apiData, setApiData] = useState<any>(null);
  const [chat, setChat] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<any>();

  /* -------- LOAD CHAT -------- */
  useEffect(() => {
    if (!apiId) return;
    const saved = localStorage.getItem(`apives_chat_${apiId}`);
    if (saved) setChat(JSON.parse(saved));
  }, [apiId]);

  /* -------- SAVE CHAT -------- */
  useEffect(() => {
    if (!apiId) return;
    localStorage.setItem(`apives_chat_${apiId}`, JSON.stringify(chat));
  }, [chat, apiId]);

  /* -------- FETCH API -------- */
  useEffect(() => {
    if (!apiId) return;
    axios.get(`/api/apis/${apiId}`).then((r) => setApiData(r.data));
  }, [apiId]);

  /* -------- SCROLL -------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  /* -------- SEND -------- */
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
        { role: "assistant", content: "Error fetching response" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="h-screen flex flex-col bg-[#020705] text-white relative">

        {/* BG GLOW */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[400px] h-[400px] bg-green-500/10 blur-[120px] -top-20 -left-20"/>
          <div className="absolute w-[400px] h-[400px] bg-green-500/10 blur-[120px] bottom-0 right-0"/>
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border-b border-green-500/10">

          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 border border-white/10"
          >
            <X size={16} />
          </button>

          <div className="text-sm font-bold text-green-400">
            Ask Apives AI
          </div>

          <div className="flex gap-2">
            {/* ONLY HISTORY LOGIN */}
            <button
              onClick={() => navigate("/access")}
              className="p-2 rounded-full bg-white/5 border border-white/10"
            >
              <History size={14} />
            </button>

            <button className="p-2 rounded-full bg-white/5 border border-white/10">
              <GitCompare size={14} />
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto chat-scroll px-3 py-4 space-y-3">

          {chat.length === 0 && (
            <div className="text-center mt-16">
              <Orb />

              <h2 className="mt-4 font-bold text-lg">
                API Intelligence <br />
                <span className="text-green-400">you deserve</span>
              </h2>

              {apiName && (
                <div className="mt-3 text-green-300 text-sm">
                  {apiName}
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
            <Message key={i} role={m.role} content={m.content} />
          ))}

          {loading && <div className="text-xs text-green-400">Thinking...</div>}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-green-500/20">
          <div className="flex items-center gap-2 bg-white/5 border border-green-500/30 px-3 py-2 rounded-xl">

            <MicButton onText={(t: string) => setInput((p) => p + " " + t)} />

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${apiName || "API"}...`}
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <button
              onClick={() => send()}
              className="p-2 rounded-full bg-green-500/20 border border-green-500/40"
            >
              <ArrowUp size={14} />
            </button>

          </div>
        </div>

      </div>
    </>
  );
};

export default AskApivesPage;