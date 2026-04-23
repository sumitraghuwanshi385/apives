import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ApiBreakdown from "../components/ai/ApiBreakdown";

const AskApivesPage = () => {
  const [params] = useSearchParams();
  const apiId = params.get("apiId");

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // fetch API
  useEffect(() => {
    const fetchApi = async () => {
      const res = await axios.get(`/api/apis/${apiId}`);
      setApiData(res.data);
    };
    fetchApi();
  }, [apiId]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newChat = [...chat, { role: "user", content: input }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ask-ai", {
        messages: newChat,
        apiData,
      });

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong..." },
      ]);
    } finally {
      setLoading(false);
    };
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0B0F] text-white font-poppins">

      {/* 🔥 HEADER */}
      <div className="px-5 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5 flex items-center justify-between">
        <h1 className="text-sm font-bold tracking-wide opacity-80">
          Ask Apives AI
        </h1>
      </div>

      {/* 🔥 API PILL */}
      {apiData && (
        <div className="px-5 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold 
          bg-gradient-to-r from-red-500 to-blue-500 shadow-lg shadow-red-500/20">
            {apiData.name}
          </div>
        </div>
      )}

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* EMPTY STATE */}
        {chat.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center opacity-80">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-blue-500 blur-2xl mb-6"></div>

            <h2 className="text-lg font-semibold">
              Ask anything about this API
            </h2>

            <p className="text-xs opacity-50 mt-1 max-w-[240px]">
              Get endpoints, usage, examples, and implementation help instantly.
            </p>

            {/* 🔥 BREAKDOWN */}
            {apiData && (
              <div className="w-full mt-6">
                <ApiBreakdown api={apiData} />
              </div>
            )}
          </div>
        )}

        {/* 🔥 CHAT */}
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md
              ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                  : "bg-white/10 backdrop-blur-md border border-white/10"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* LOADING */}
        {loading && (
          <div className="text-sm opacity-50 animate-pulse">
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 🔥 INPUT */}
      <div className="p-4 border-t border-white/10 bg-[#0B0B0F] backdrop-blur-xl">

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2 shadow-inner">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this API..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-white/30"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center hover:scale-105 transition-all"
          >
            ↑
          </button>

        </div>
      </div>
    </div>
  );
};

export default AskApivesPage;