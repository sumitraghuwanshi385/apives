import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  X,
  GitCompare,
  Mic,
  MicOff,
  ArrowUp,
  Bolt,
  Search,
  Link2,
  Shield,
  Radio,
  Brain,
} from "lucide-react";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

/* ───────── STYLES ───────── */
const STYLES = `
body > nav, header, footer { display:none !important; }
.chat-scroll::-webkit-scrollbar { width:3px }
.chat-scroll::-webkit-scrollbar-thumb { background:#34d39930 }
`;

/* ───────── ORB ───────── */
const AnimatedOrb = () => {
  const items = [
    { icon: <Bolt size={12} />, text: "INSTANT" },
    { icon: <Search size={12} />, text: "DISCOVER" },
    { icon: <Link2 size={12} />, text: "INTEGRATE" },
    { icon: <Shield size={12} />, text: "SECURE" },
    { icon: <Radio size={12} />, text: "REALTIME" },
    { icon: <Brain size={12} />, text: "INTELLIGENT" },
  ];

  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((p) => (p + 1) % items.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-28 h-28 rounded-full bg-green-400/20 blur-xl" />
      <div className="text-xs text-green-400 flex items-center gap-2 font-bold tracking-widest">
        {items[i].icon}
        {items[i].text}
      </div>
    </div>
  );
};

/* ───────── MESSAGE ───────── */
const Message = ({ role, content }: any) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-1`}>
      <div
        className={`
        px-4 py-2 rounded-2xl max-w-[82%] text-sm leading-relaxed
        ${
          isUser
            ? "bg-green-500/10 border border-green-400/30 text-green-100"
            : "bg-white/5 border border-white/10 text-white/80"
        }
      `}
      >
        {content}
      </div>
    </div>
  );
};

/* ───────── MIC ───────── */
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

/* ───────── MAIN ───────── */
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

  /* ───────── AUTO SCROLL ───────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* ───────── SEND ───────── */
  const send = async (txt?: string) => {
    const msg = (txt || input).trim();
    if (!msg) return;

    if (!isLoggedIn) {
      redirect();
      return;
    }

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
        { role: "assistant", content: "Something went wrong" },
      ]);
    }

    setLoading(false);
  };

  const displayName = apiName || apiData?.name;

  return (
    <>
      <style>{STYLES}</style>

      <div className="h-screen flex flex-col bg-[#060D0A] text-white">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 backdrop-blur-xl">

          <button onClick={() => navigate(-1)}>
            <X size={18} color="#34d399" />
          </button>

          <div className="text-sm font-bold text-green-400 tracking-wide">
            Ask Apives AI
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                redirect();
                return;
              }
            }}
          >
            <GitCompare size={16} color="#34d399" />
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto chat-scroll px-3 py-4 space-y-3">

          {chat.length === 0 && (
            <div className="text-center mt-20">

              <AnimatedOrb />

              <h2 className="mt-5 font-bold text-lg leading-tight">
                The API Intelligence <br />
                <span className="text-green-400">you deserve</span>
              </h2>

              {displayName && (
                <div className="mt-3 text-green-300 text-sm font-medium">
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
            <Message key={i} role={m.role} content={m.content} />
          ))}

          {loading && (
            <div className="text-xs text-green-400 animate-pulse">
              Thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-white/5 bg-[#060D0A]/95 backdrop-blur-xl">

          <div className="flex items-center gap-2 bg-white/5 border border-green-400/20 px-3 py-2 rounded-2xl">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                displayName
                  ? `Ask about ${displayName}...`
                  : "Ask about any API..."
              }
              className="flex-1 bg-transparent outline-none text-sm text-white/90"
            />

            <MicButton onText={(t: string) => setInput(t)} />

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