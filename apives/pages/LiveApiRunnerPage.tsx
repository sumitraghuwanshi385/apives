import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Terminal, Zap } from "lucide-react";
import LiveApiRunner from "../components/LiveApiRunner";
import { BackButton } from "../components/BackButton";      

const LiveApiRunnerPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.14),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">

          {/* BACK BUTTON (thoda upar) */}
      <div className="absolute top-20 left-4 lg:left-8 z-20">
        <BackButton />
      </div>

      <div className="max-w-2xl mx-auto px-6">

          <div className="text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mora-500/20 bg-mora-500/10 text-mora-400 text-[11px] uppercase tracking-[0.3em] font-black mb-6">
              <Terminal size={12} />
              APIVES TOOL
            </div>

            <h1 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight leading-none">
              Live API
              <span className="block text-mora-500">
                Runner
              </span>
            </h1>

            <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-sm md:text-lg leading-relaxed">
              Test endpoints, inspect JSON responses, validate API behavior,
              and experiment with requests before integrating them into your applications.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">

              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300">
                Real API Requests
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300">
                JSON Inspector
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300">
                Request History
              </div>

              <div className="px-4 py-2 rounded-full border border-mora-500/20 bg-mora-500/10 text-xs text-mora-400">
                <Zap size={12} className="inline mr-1" />
                Powered by Apives
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Runner */}
      <div className="relative z-10">
        <LiveApiRunner />
      </div>

    </div>
  );
};

export default LiveApiRunnerPage;