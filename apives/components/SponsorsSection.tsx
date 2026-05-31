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
<section className="relative py-12 md:py-16 border-t border-white/5 bg-black overflow-hidden">

  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.10),transparent_60%)]" />
  </div>

  <div className="max-w-4xl mx-auto px-5 relative z-10">

    {/* Header */}
    <div className="text-center mb-10">

      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
        Thank You To Our
        <span className="block text-mora-500">
          Sponsors
        </span>
      </h2>

      <p className="mt-3 text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
        Supporting developers, startups and builders across the Apives ecosystem.
      </p>

    </div>

    {/* APEX */}
    <div className="mb-8">

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        <span className="text-[9px] tracking-[0.45em] font-bold uppercase text-amber-400">
          APEX
        </span>

        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
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
          <div className="px-5 py-3 rounded-2xl border border-amber-500/15 bg-white/[0.02] transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1">
            <img
              src="https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg"
              alt="ScoutPanels"
              className="h-12 md:h-14 object-contain"
            />
          </div>
        </button>

      </div>

    </div>

    {/* PRIME */}
    <div className="mb-8">

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />

        <span className="text-[9px] tracking-[0.45em] font-bold uppercase text-slate-300">
          PRIME
        </span>

        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />
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
          <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-white/25 hover:-translate-y-1">
            <img
              src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"
              alt="SerpApi"
              className="h-12 md:h-14 object-contain"
            />
          </div>
        </button>

      </div>

    </div>

    {/* ZENITH */}
    <div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        <span className="text-[9px] tracking-[0.45em] font-bold uppercase text-orange-400">
          ZENITH
        </span>

        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
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
          <div className="px-5 py-3 rounded-2xl border border-orange-500/15 bg-white/[0.02] transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1">
            <img
              src="https://res.cloudinary.com/dp7avkarg/image/upload/v1774100516/Picsart_26-02-22_16-45-46-153_owkgpp.png"
              alt="Startives"
              className="h-12 md:h-14 object-contain"
            />
          </div>
        </button>

      </div>

    </div>

    {/* CTA */}
    <div className="mt-10">

      <div className="rounded-2xl border border-mora-500/15 bg-mora-500/[0.03] p-5 text-center">

        <h3 className="font-display text-lg md:text-xl font-bold text-white">
          Become A Sponsor
        </h3>

        <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
          Showcase your startup, SaaS or API to developers discovering tools on Apives.
        </p>

        <button className="mt-4 px-5 py-2 rounded-full bg-mora-500 text-black text-xs font-bold hover:scale-105 transition-all">
          Become A Sponsor
        </button>

      </div>

    </div>

  </div>

</section>

);
};

export default SponsorsSection;