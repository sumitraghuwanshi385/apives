import React from "react";
import { Gift, CheckCircle2, ArrowRight } from "lucide-react";
import { BackButton } from "../components/BackButton";

export default function SerpApiOffer() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-20 relative selection:bg-mora-500/30">

      {/* BACK BUTTON */}
      <div className="absolute top-28 left-4 lg:left-8 z-20">
        <BackButton />
      </div>

      <div className="max-w-2xl mx-auto px-6">

        {/* ================= HERO ================= */}
        <div className="text-center mb-10">

          <div className="flex items-center justify-center gap-2 mb-5">

            <img
              src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"
              className="w-9 h-9 rounded-xl bg-white p-[3px]"
            />

            <span className="text-slate-500 text-sm font-bold">×</span>

            <img
              src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png"
              className="w-10 h-10 object-contain"
            />

          </div>

          <h1 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
            500 Free SerpAPI Credits
          </h1>

          <p className="text-slate-400 mt-2 text-xs md:text-sm max-w-md mx-auto">
            Exclusive offer for Apives builders to test and scale API-powered products faster.
          </p>

        </div>


        {/* ================= WHAT YOU GET ================= */}
        <div className="border border-green-500/20 bg-green-500/10 rounded-2xl p-4 mb-8">

          <div className="flex items-center gap-2 mb-2">
            <Gift size={16} className="text-green-400" />
            <p className="text-green-400 text-sm font-bold">
              What You Get
            </p>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed">
            Each selected user receives <span className="text-white font-semibold">500 Free SerpAPI Credits</span> to build, test, and launch projects.
          </p>

        </div>


        {/* ================= HOW TO REDEEM ================= */}
        <div className="mb-10">

          <h2 className="text-lg font-bold text-white mb-4">
            How to Redeem
          </h2>

          <div className="space-y-3 text-slate-300 text-xs">

            {[
              "Click on Claim or visit SerpAPI",
              "Contact their support via email or live chat",
              "Mention code: Apives500",
              "Credits will be added to your account"
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-mora-500 mt-0.5" />
                <p>{step}</p>
              </div>
            ))}

          </div>

        </div>


        {/* ================= DETAILS ================= */}
        <div className="mb-10">

          <h2 className="text-lg font-bold text-white mb-4">
            Important Details
          </h2>

          <div className="space-y-3 text-slate-400 text-xs">

            {[
              "Only 30 users will receive this offer",
              "Each user gets 500 Free Credits",
              "First come, first served",
              "Limited time availability"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-mora-500 mt-0.5" />
                <p>{item}</p>
              </div>
            ))}

          </div>

        </div>


        {/* ================= CTA ================= */}
        <div className="text-center">

          <button
            onClick={() => window.open("https://serpapi.com", "_blank")}
            className="px-5 py-2.5 rounded-full bg-white text-black font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2 mx-auto"
          >
            Go to SerpAPI <ArrowRight size={14} />
          </button>

        </div>

      </div>
    </div>
  );
}