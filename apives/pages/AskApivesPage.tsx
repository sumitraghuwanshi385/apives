import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import ApiBreakdown from "../components/ai/ApiBreakdown";
import ChatBubble from "../components/ai/ChatBubble";
import ChatInput from "../components/ai/ChatInput";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";

const AskApivesPage = () => {
  const [params] = useSearchParams();
  const apiId = params.get("apiId");

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // 🔥 LOAD CHAT FROM LOCAL STORAGE
  useEffect(() => {
    if (!apiId) return;

    const saved = localStorage.getItem(`apives_chat_${apiId}`);
    if (saved) {
      setChat(JSON.parse(saved));
    }
  }, [apiId]);

  // 🔥 SAVE CHAT PER API
  useEffect(() => {
    if (!apiId) return;
    localStorage.setItem(`apives_chat_${apiId}`, JSON.stringify(chat));
  }, [chat, apiId]);

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
    <div className="flex flex-col h-screen bg-[#0A0A0F] text-white font-poppins">

      {/* 🔥 HEADER */}
      <div className="px-5 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5 flex items-center justify-between">

        <h1 className="text-sm font-bold tracking-wide opacity-80">
          Ask Apives AI
        </h1>

        {/* 🔍 Compare button */}
        <button
          onClick={() => alert("Compare feature next step 😏")}
          className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 hover:bg-white/20"
        >
          Compare APIs
        </button>

      </div>

      {/* 🔥 API PILL */}
      {apiData && (
        <div className="px-5 pt-4 flex justify-center">
          <div className="px-5 py-1.5 rounded-full text-xs font-bold 
          bg-gradient-to-r from-red-500 to-blue-500 shadow-lg shadow-red-500/20">
            {apiData.name}
          </div>
        </div>
      )}

      {/* 🔥 MAIN */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* EMPTY STATE */}
        {chat.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16 text-center">

            {/* glow */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-blue-500 blur-3xl mb-6 opacity-70"></div>

            <h2 className="text-lg font-semibold">
              Ask anything about this API
            </h2>

            <p className="text-xs opacity-50 mt-1 max-w-[260px]">
              Understand endpoints, parameters, and implementation instantly.
            </p>

            {/* breakdown */}
            <div className="w-full mt-6">
              <ApiBreakdown api={apiData} />
            </div>

            {/* prompts */}
            <SuggestedPrompts
              onClick={(text: string) => setInput(text)}
            />
          </div>
        )}

        {/* CHAT */}
        {chat.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
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
      <div className="p-4 border-t border-white/10 bg-[#0A0A0F] backdrop-blur-xl">
        <ChatInput value={input} setValue={setInput} onSend={sendMessage} />
      </div>

    </div>
  );
};

export default AskApivesPage;