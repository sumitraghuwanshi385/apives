import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const AskApivesPage = () => {
  const [params] = useSearchParams();
  const apiId = params.get("apiId");

  const [apiData, setApiData] = useState<any>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // fetch API details
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
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0B0F] text-white">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-sm font-semibold opacity-80">Ask Apives AI</h1>
      </div>

      {/* API PILL */}
      {apiData && (
        <div className="px-4 py-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold 
          bg-gradient-to-r from-red-500 to-blue-500">
            {apiData.name}
          </div>
        </div>
      )}

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* EMPTY STATE */}
        {chat.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center opacity-70">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-blue-500 blur-xl mb-4"></div>
            <p className="text-sm">
              Ask anything about this API
            </p>
          </div>
        )}

        {/* CHAT MESSAGES */}
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* LOADING */}
        {loading && (
          <div className="text-sm opacity-50">Thinking...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10 bg-[#0B0B0F]">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-2">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this API..."
            className="flex-1 bg-transparent outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskApivesPage;