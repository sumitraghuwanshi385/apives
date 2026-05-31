import React, { useEffect } from "react";
import {
Crown,
Star,
Gem,
TrendingUp,
Users,
Globe,
MousePointerClick,
ArrowRight
} from "lucide-react";

const trackSponsor = (
sponsor: string,
type: "impression" | "click"
) => {
fetch("https://apives-3xrc.onrender.com/api/sponsor/track", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
sponsor,
type,
page: window.location.pathname
})
}).catch(console.error);
};

const handleSponsorClick = (
sponsor: string,
baseUrl: string
) => {
trackSponsor(sponsor, "click");

const url =
"${baseUrl}?utm_source=apives&utm_medium=sponsor&utm_campaign=apives_marketplace";

window.open(
url,
"_blank",
"noopener,noreferrer"
);
};

const sponsors = [
{
tier: "Apex",
name: "ScoutPanels",
logo: "https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg",
description:
"Turning B2B feedback into adoption signals.",
website: "https://scoutpanels.com"
},
{
tier: "Prime",
name: "SerpApi",
logo: "https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg",
description:
"Real-time Google Search results via developer APIs.",
website: "https://serpapi.com"
},
{
tier: "Zenith",
name: "Startives",
logo: "https://res.cloudinary.com/dp7avkarg/image/upload/v1774100516/Picsart_26-02-22_16-45-46-153_owkgpp.png",
description:
"Empowering startup founders to connect and build.",
website: "https://startives.com"
}
];

const tierStyles: any = {
Apex:
"border-amber-400/30 bg-amber-500/10",
Prime:
"border-slate-300/20 bg-white/5",
Zenith:
"border-orange-500/30 bg-orange-500/10"
};

export const SponsorsPage = () => {
useEffect(() => {
sponsors.forEach((sponsor) => {
trackSponsor(
sponsor.name.toLowerCase(),
"impression"
);
});
}, []);

return (
<div className="min-h-screen bg-black text-white">

  {/* HERO */}

  <section className="relative pt-32 pb-20 overflow-hidden">

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_60%)]" />

    <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">

      <p className="text-mora-500 uppercase tracking-[0.4em] text-xs font-black mb-4">
        APIVES SPONSORSHIP
      </p>

      <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
        Partners Powering
        <span className="text-mora-500">
          {" "}Apives
        </span>
      </h1>

      <p className="text-slate-400 max-w-2xl mx-auto mt-6">
        Developer platforms helping builders
        discover APIs, tools, infrastructure,
        and opportunities inside the Apives
        ecosystem.
      </p>
    </div>
  </section>

  {/* SPONSORS */}

  <section className="pb-24">
    <div className="max-w-5xl mx-auto px-6">

      {sponsors.map((sponsor) => (
        <div
          key={sponsor.name}
          className={`mb-8 rounded-3xl border p-8 ${tierStyles[sponsor.tier]}`}
        >

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-5">

              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="w-16 h-16 rounded-2xl bg-white object-contain p-1"
              />

              <div>

                <div className="flex items-center gap-2 mb-2">

                  {sponsor.tier === "Apex" && (
                    <Crown className="text-amber-400" size={18} />
                  )}

                  {sponsor.tier === "Prime" && (
                    <Star size={18} />
                  )}

                  {sponsor.tier === "Zenith" && (
                    <Gem className="text-orange-400" size={18} />
                  )}

                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-black">
                    {sponsor.tier} Sponsor
                  </span>
                </div>

                <h2 className="text-2xl font-bold">
                  {sponsor.name}
                </h2>

                <p className="text-slate-400 mt-2">
                  {sponsor.description}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                handleSponsorClick(
                  sponsor.name.toLowerCase(),
                  sponsor.website
                )
              }
              className="px-6 py-3 rounded-full bg-mora-500 text-black font-black uppercase tracking-widest hover:scale-105 transition-all"
            >
              Visit
            </button>

          </div>
        </div>
      ))}

    </div>
  </section>

  {/* BENEFITS */}

  <section className="border-t border-white/5 py-24">

    <div className="max-w-6xl mx-auto px-6">

      <div className="text-center mb-16">

        <h2 className="text-4xl font-bold">
          Why Sponsor Apives?
        </h2>

        <p className="text-slate-400 mt-4">
          Reach developers actively looking
          for APIs and tools.
        </p>

      </div>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="border border-white/10 rounded-2xl p-6">
          <Users className="mb-4 text-mora-500" />
          <h3 className="font-bold mb-2">
            Developer Audience
          </h3>
          <p className="text-slate-400 text-sm">
            Reach active builders.
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl p-6">
          <TrendingUp className="mb-4 text-mora-500" />
          <h3 className="font-bold mb-2">
            Visibility
          </h3>
          <p className="text-slate-400 text-sm">
            Premium ecosystem placement.
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl p-6">
          <MousePointerClick className="mb-4 text-mora-500" />
          <h3 className="font-bold mb-2">
            Click Tracking
          </h3>
          <p className="text-slate-400 text-sm">
            Impression and click analytics.
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl p-6">
          <Globe className="mb-4 text-mora-500" />
          <h3 className="font-bold mb-2">
            Global Reach
          </h3>
          <p className="text-slate-400 text-sm">
            Exposure across the API ecosystem.
          </p>
        </div>

      </div>

    </div>
  </section>

  {/* CTA */}

  <section className="pb-24">

    <div className="max-w-4xl mx-auto px-6">

      <div className="rounded-3xl border border-mora-500/20 bg-gradient-to-br from-mora-500/10 to-transparent p-12 text-center">

        <h2 className="text-4xl font-bold mb-4">
          Become An Apives Sponsor
        </h2>

        <p className="text-slate-400 mb-8">
          Showcase your product to developers,
          startups, founders, and API consumers.
        </p>

        <button
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-mora-500 text-black font-black uppercase tracking-widest"
        >
          Apply For Sponsorship
          <ArrowRight size={18} />
        </button>

      </div>

    </div>

  </section>

</div>

);
};

export default SponsorsPage;