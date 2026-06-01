import React from "react";
import { Handshake } from "lucide-react";

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
    <section className="bg-black border-t border-white/10 py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Our Sponsors
        </h2>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-12">
          Companies helping power the Apives ecosystem.
        </p>

        {/* Soft green ambient glow */}
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-96 h-64 bg-green-500/8 rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-14">

            {/* APEX — Gold */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[9px] uppercase tracking-[0.45em] font-black"
                style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Apex
              </p>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleSponsorClick("scoutpanels", "https://scoutpanels.com"); }}
                className="opacity-100 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]"
              >
                <img
                  src="https://i.postimg.cc/CLGMddt9/Picsart-26-06-01-11-37-35-003.png"
                  alt="ScoutPanels"
                  className="max-h-16 max-w-[200px] w-auto h-auto object-contain"
                />
              </a>
            </div>

            {/* PRIME — Silver */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[9px] uppercase tracking-[0.45em] font-black"
                style={{ background: "linear-gradient(90deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Prime
              </p>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleSponsorClick("serpapi", "https://serpapi.com"); }}
                className="opacity-100 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]"
              >
                <img
                  src="https://i.postimg.cc/1tBGHWnW/Picsart-26-06-01-10-26-25-532.png"
                  alt="SerpApi"
                  className="max-h-16 max-w-[200px] w-auto h-auto object-contain"
                />
              </a>
            </div>

            {/* ZENITH — Bronze */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[9px] uppercase tracking-[0.45em] font-black"
                style={{ background: "linear-gradient(90deg, #cd7f32, #a0522d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Zenith
              </p>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleSponsorClick("startives", "https://startives.com"); }}
                className="opacity-100 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]"
              >
                <img
                  src="https://i.postimg.cc/6q7hprq4/Picsart-26-06-01-10-35-38-466.png"
                  alt="Startives"
                  className="max-h-16 max-w-[200px] w-auto h-auto object-contain"
                />
              </a>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-white/10 mx-auto mt-14 mb-10" />

        {/* Become a Sponsor button */}
        <a
  href="mailto:apivesecosystem@gmail.com"
  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 text-white text-sm font-medium hover:border-green-500/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.18)] transition-all duration-300 hover:scale-[1.03]"
>
  <Handshake
    size={16}
    className="text-mora-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]"
  />

  <span>Become a Sponsor</span>

  <svg
    className="w-4 h-4 text-slate-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
</a>
      </div>
    </section>
  );
};

export default SponsorsSection;