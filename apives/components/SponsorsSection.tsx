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
      key: "serpapi",
      name: "SerpApi",
      url: "https://serpapi.com",
      logo: "https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg",
    },
    {
      key: "startives",
      name: "Startives",
      url: "https://startives.com",
      logo: "https://res.cloudinary.com/dp7avkarg/image/upload/v1774100516/Picsart_26-02-22_16-45-46-153_owkgpp.png",
    },
    {
      key: "scoutpanels",
      name: "ScoutPanels",
      url: "https://scoutpanels.com",
      logo: "https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg",
    },
  ];

  return (
    <section className="bg-black border-t border-white/10 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* Top label */}
        <p className="text-[10px] uppercase tracking-[0.45em] text-slate-500 font-black mb-3">
          Our Sponsors
        </p>

        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Sponsored By
        </h2>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-16">
          Companies helping power the Apives ecosystem.
        </p>

        {/* Sponsor list */}
        <div className="flex flex-col items-center gap-12 mb-16">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSponsorClick(sponsor.key, sponsor.url);
              }}
              className="group flex flex-col items-center gap-3 opacity-75 hover:opacity-100 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-[0_0_0px_rgba(34,197,94,0)] group-hover:shadow-[0_0_18px_rgba(34,197,94,0.35)] transition-shadow duration-300 group-hover:scale-105 transform">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <span className="text-white font-semibold text-base tracking-wide">
                {sponsor.name}
              </span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-white/10 mx-auto mb-10" />

        {/* Become a Sponsor button */}
        <a
          href="mailto:sponsor@apives.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 text-white text-sm font-medium hover:border-green-500/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.18)] transition-all duration-300 hover:scale-[1.03]"
        >
          <span>Become a Sponsor</span>
          <svg
            className="w-4 h-4 text-slate-400 group-hover:text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

      </div>
    </section>
  );
};

export default SponsorsSection;