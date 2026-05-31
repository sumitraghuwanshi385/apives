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
const sponsors = [
{
tier: "APEX",
name: "ScoutPanels",
description: "Turning B2B feedback into adoption signals.",
logo: "https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg",
sponsor: "scoutpanels",
url: "https://scoutpanels.com",
tierColor: "text-amber-400"
},
{
tier: "PRIME",
name: "SerpApi",
description: "Real-time Google Search results via a fast developer API.",
logo: "https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg",
sponsor: "serpapi",
url: "https://serpapi.com",
tierColor: "text-slate-300"
},
{
tier: "ZENITH",
name: "Startives",
description: "Empowering Startup Founders to Connect & Build.",
logo: "https://res.cloudinary.com/dp7avkarg/image/upload/v1774100516/Picsart_26-02-22_16-45-46-153_owkgpp.png",
sponsor: "startives",
url: "https://startives.com",
tierColor: "text-orange-400"
}
];

return (
<section
className="relative py-16 border-t border-white/5 bg-black overflow-hidden"
>
<div className="absolute inset-0 pointer-events-none">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]" />
</div>

  <div className="max-w-6xl mx-auto px-6 relative z-10">

    {/* Header */}

      <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
        Partners Powering Apives
      </h2>

      <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
        Trusted platforms helping developers, founders and AI builders
        launch faster.
      </p>
    </div>

    {/* Sponsor Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      {sponsors.map((item) => (
        <a
          key={item.name}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSponsorClick(item.sponsor, item.url);
          }}
          className="group rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 hover:border-mora-500/40 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-5">
            <span className={`text-[10px] font-black tracking-[0.25em] uppercase ${item.tierColor}`}>
              {item.tier}
            </span>

            <span className="px-2 py-1 rounded-full bg-mora-500/10 border border-mora-500/20 text-mora-400 text-[10px] font-bold">
              Partner
            </span>
          </div>

          <img
            src={item.logo}
            alt={item.name}
            className="w-14 h-14 rounded-2xl bg-white p-2 object-contain"
          />

          <h3 className="mt-4 text-white font-bold text-lg">
            {item.name}
          </h3>

          <p className="mt-2 text-slate-400 text-sm leading-relaxed">
            {item.description}
          </p>

          <div className="mt-5 text-mora-400 text-sm font-semibold">
            Visit Sponsor →
          </div>
        </a>
      ))}

    </div>

    {/* Become Sponsor */}
    <div className="mt-8 rounded-3xl border border-mora-500/20 bg-gradient-to-b from-mora-500/10 to-transparent p-8 text-center">

      <h3 className="text-xl md:text-2xl font-bold text-white">
        Become an Apives Sponsor
      </h3>

      <p className="mt-3 text-slate-400 text-sm max-w-lg mx-auto">
        Promote your API, SaaS, AI product or startup directly to
        developers, founders and builders discovering tools on Apives.
      </p>

      <button
        className="mt-6 px-6 py-3 rounded-full bg-mora-500 text-black font-bold text-sm hover:scale-105 transition-all"
      >
        Become a Sponsor
      </button>

    </div>

  </div>
</section>

);
};

export default SponsorsSection;