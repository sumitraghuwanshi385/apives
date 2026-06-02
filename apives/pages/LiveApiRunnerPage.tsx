import React from "react";
import { Terminal } from "lucide-react";
import LiveApiRunner from "../components/LiveApiRunner";
import { BackButton } from "../components/BackButton";

const LiveApiRunnerPage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-12 relative overflow-hidden selection:bg-mora-500/30">

      {/* Back Button */}
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 relative z-10">

        <div className="text-center mb-0">

          {/* Icon Box */}
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4">
            <Terminal
              className="text-mora-500"
              size={24}
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-[0.95]">
            Live API
            <span className="block text-mora-500">
              Runner Request
            </span>
          </h1>

          <p className="text-slate-500 mt-3 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Test endpoints, inspect JSON responses, validate integrations,
            debug requests, and experiment with APIs before deployment.
          </p>

        </div>

      </div>

      {/* Runner */}
      <div className="relative z-10 mt-1">
        <LiveApiRunner />
      </div>

    </div>
  );
};

export default LiveApiRunnerPage;