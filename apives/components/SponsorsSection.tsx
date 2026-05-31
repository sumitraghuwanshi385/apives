import React from "react";

interface SponsorsSectionProps {
  handleSponsorClick: (
    sponsor: string,
    baseUrl: string
  ) => void;
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  handleSponsorClick
}) => {
  return (
    <section className="relative py-16 md:py-20 border-t border-white/5 bg-black overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mora-500/20 bg-mora-500/10">
            <span className="w-2 h-2 rounded-full bg-mora-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.35em] font-black text-mora-400">
              Sponsored
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-white">
            Thank You To Our
            <span className="block text-mora-500">
              Sponsors
            </span>
          </h2>

          <p className="mt-4 text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Apives is proudly supported by innovative companies helping
            developers, founders and builders launch faster.
          </p>

        </div>

        {/* ================= APEX ================= */}

        <div className="mb-12">

          <div className="flex items-center gap-4 mb-8">

            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <div className="px-4 py-1 rounded-full border border-amber-500/20 bg-amber-500/10">
              <span className="text-[10px] uppercase tracking-[0.35em] font-black text-amber-400">
                Apex Sponsor
              </span>
            </div>

            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          </div>

          <div className="flex justify-center">

            <button
              onClick={() =>
                handleSponsorClick(
                  "scoutpanels",
                  "https://scoutpanels.com"
                )
              }
              className="group"
            >
              <div className="rounded-3xl border border-amber-500/20 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 hover:scale-105">
                <img
                  src="https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg"
                  alt="ScoutPanels"
                  className="h-24 md:h-28 object-contain rounded-2xl bg-white p-2"
                />
              </div>
            </button>

          </div>

        </div>

        {/* ================= PRIME ================= */}

        <div className="mb-12">

          <div className="flex items-center gap-4 mb-8">

            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />

            <div className="px-4 py-1 rounded-full border border-slate-400/20 bg-white/5">
              <span className="text-[10px] uppercase tracking-[0.35em] font-black text-slate-300">
                Prime Sponsor
              </span>
            </div>

            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />

          </div>

          <div className="flex justify-center">

            <button
              onClick={() =>
                handleSponsorClick(
                  "serpapi",
                  "https://serpapi.com"
                )
              }
              className="group"
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:scale-105">
                <img
                  src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"
                  alt="SerpApi"
                  className="h-24 md:h-28 object-contain rounded-2xl bg-white p-2"
                />
              </div>
            </button>

          </div>

        </div>

        {/* ================= ZENITH ================= */}

        <div>

          <div className="flex items-center gap-4 mb-8">

            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

            <div className="px-4 py-1 rounded-full border border-orange-500/20 bg-orange-500/10">
              <span className="text-[10px] uppercase tracking-[0.35em] font-black text-orange-400">
                Zenith Sponsor
              </span>
            </div>

            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          </div>

          <div className="flex justify-center">

            <button
              onClick={() =>
                handleSponsorClick(
                  "startives",
                  "https://startives.com"
                )
              }
              className="group"
            >
              <div className="rounded-3xl border border-orange-500/20 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/50 hover:scale-105">
                <img
                  src="https://res.cloudinary.com/dp7avkarg/image/upload/v1774100516/Picsart_26-02-22_16-45-46-153_owkgpp.png"
                  alt="Startives"
                  className="h-24 md:h-28 object-contain rounded-2xl bg-white p-2"
                />
              </div>
            </button>

          </div>

        </div>

        {/* CTA */}

        <div className="mt-16">

          <div className="rounded-3xl border border-mora-500/20 bg-gradient-to-b from-mora-500/10 to-transparent p-8 text-center">

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-mora-500/10 border border-mora-500/20 mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-mora-400">
                Partner With Apives
              </span>
            </div>

            <h3 className="text-white text-2xl font-bold">
              Become An Apives Sponsor
            </h3>

            <p className="mt-3 text-slate-400 text-sm max-w-lg mx-auto">
              Reach developers, startup founders and AI builders through
              premium sponsorship placements across the Apives ecosystem.
            </p>

            <button className="mt-6 px-6 py-3 rounded-full bg-mora-500 text-black font-bold hover:scale-105 transition-all">
              Apply For Sponsorship
            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default SponsorsSection;