import React from "react";
import { Terminal, Zap } from "lucide-react";
import LiveApiRunner from "../components/LiveApiRunner";
import { BackButton } from "../components/BackButton";

const LiveApiRunnerPage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden selection:bg-mora-500/30">

      {/* BACK BUTTON */}
      <div className="absolute top-20 left-4 lg:left-8 z-20">
        <BackButton />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.14),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-2xl mx-auto px-6 relative z-10">

        {/* HERO */}
        <div className="text-center mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mora-500/20 bg-mora-500/10 text-mora-400 text-[11px] uppercase tracking-[0.3em] font-black mb-6">
            <Terminal size={12} />
            APIVES TOOL
          </div>

          <h1 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">
            Live API
            <span className="block text-mora-500">
              Runner
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Test endpoints, inspect JSON responses, debug integrations,
            validate payloads, and experiment with APIs before shipping.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300">
              Real Requests
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

      {/* RUNNER */}
      <div className="relative z-10">
        <LiveApiRunner />
      </div>

    </div>
  );
};

export default LiveApiRunnerPage;