
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiClient";
import { ApiListing } from "../../types";
import ApiCard from "../../components/ApiCard";
import { BackButton } from "../../components/BackButton";
import { Layers, Radio } from "lucide-react";

/* ===============================
   STATIC OPERATIONAL INSIGHT
================================ */

const INSIGHT_CONTENT = `
Official Documentation & Engineering Guides:-

• Microsoft Azure OpenAI - Reliability, Quotas & Production Limits
https://learn.microsoft.com/en-us/azure/ai-services/openai/overview

This documentation explains how large language models are deployed in real production environments with quotas, throttling, retries, and monitoring.

• Anthropic — Prompt Engineering & Safety Guardrails
https://docs.anthropic.com/claude/docs/prompt-engineering

Covers structured prompting, output constraints, and guardrail techniques to reduce hallucinations.

• LangSmith — LLM Observability & Tracing
https://docs.smith.langchain.com/

Shows how real chatbot systems are monitored in production.

Video References (Real Chatbot Architecture):-

• How ChatGPT Works & What is RAG
https://youtu.be/hYZKrPOyEYk

• Building a Production Chatbot with RAG
https://youtu.be/XctooiH0moI

• Building Reliable AI Systems
https://www.youtube.com/watch?v=9vM4p9NN0Ts

Why This Matters:-

Building a chatbot that works in production is less about choosing the best model and more about operational discipline.
`;

/* ===============================
   PAGE
================================ */

export default function BuildChatbots() {
  const [allApis, setAllApis] = useState<ApiListing[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD ALL APIS
  ============================== */
  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getAllApis();
        const list = Array.isArray(res) ? res : res?.data || [];
        const db = list.map((a: any) => ({ ...a, id: a._id }));
        setAllApis(db);
      } catch (err) {
        console.error("Chatbot load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ===============================
     FILTER CHATBOT APIS
  ============================== */
  const chatbotApis = allApis.filter(api => {
    const text = `${api.name} ${api.description || ""}`.toLowerCase();
    return (
      text.includes("chat") ||
      text.includes("llm") ||
      text.includes("assistant") ||
      text.includes("ai")
    );
  });

  const visibleApis = chatbotApis.slice(0, visibleCount);

  /* ===============================
     SIMPLE LINK PARSER
  ============================== */
  const renderInsight = () => {
    const lines = INSIGHT_CONTENT.split("\n");

    return (
      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith("http")) {
            const domain = new URL(line).hostname.replace("www.", "");
            return (
              <a
                key={i}
                href={line}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-300 hover:bg-green-500/20 transition"
              >
                {domain}
              </a>
            );
          }

          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto mb-6">
        <BackButton />
      </div>

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-6xl font-display font-bold">
          AI Chatbots
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-lg">
          Production-ready conversational AI systems built for real SaaS environments.
        </p>
      </div>

      {/* OPERATIONAL INSIGHT */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="bg-green-500/5 border border-green-500/30 rounded-2xl p-6 backdrop-blur-xl">
          <p className="text-xs uppercase text-green-400 mb-4 flex items-center gap-2 tracking-widest">
            <Radio size={14} /> Operational Insight
          </p>

          {renderInsight()}
        </div>
      </div>

      {/* CURATED APIs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={18} className="text-mora-500" />
          <h3 className="text-white font-bold text-lg">
            Curated Chatbot APIs
          </h3>
        </div>

        <p className="text-xs text-slate-400 max-w-xl">
          Production-ready APIs selected for building scalable, reliable AI chatbots.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-500">
          Loading chatbots...
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {visibleApis.map(api => (
              <ApiCard key={api.id} api={api} topIds={[]} />
            ))}
          </div>

          {/* LOAD MORE BUTTON */}
          {visibleCount < chatbotApis.length && (
            <div className="flex justify-center mb-24">
              <button
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}