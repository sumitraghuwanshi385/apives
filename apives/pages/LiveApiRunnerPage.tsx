import React from "react";
import LiveApiRunner from "../components/LiveApiRunner";
import { BackButton } from "../components/BackButton";

const LiveApiRunnerPage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 relative overflow-hidden selection:bg-mora-500/30">

      <div className="absolute top-20 left-4 lg:left-8 z-20">
        <BackButton />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        <div className="text-center mb-0">

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

      {/* Almost no gap */}
      <div className="relative z-10 mt-1">
        <LiveApiRunner />
      </div>

    </div>
  );
};

export default LiveApiRunnerPage;