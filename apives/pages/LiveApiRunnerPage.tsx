import React from "react";
import LiveApiRunner from "../components/LiveApiRunner";
import { BackButton } from "../components/BackButton";

const LiveApiRunnerPage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden selection:bg-mora-500/30">

      {/* BACK BUTTON */}
      <div className="absolute top-20 left-4 lg:left-8 z-20">
        <BackButton />
      </div>

      {/* HERO */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">

        <div className="text-center mb-3">

          <h1 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight leading-none">
            Live API
            <span className="block text-mora-500">
              Runner Request
            </span>
          </h1>

          <p className="text-slate-400 mt-5 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Test endpoints, inspect JSON responses, validate integrations,
            debug requests, and experiment with APIs before deploying
            them into production environments.
          </p>

        </div>

      </div>

      {/* RUNNER */}
      <div className="relative z-10 mt-8">
        <LiveApiRunner />
      </div>

    </div>
  );
};

export default LiveApiRunnerPage;