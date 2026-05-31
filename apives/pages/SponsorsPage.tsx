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
    <>
{/* ================= SPONSORS ================= */}  
  <section  
    className="pt-10 pb-20 bg-black border-t border-white/5"  
    style={{ overflow: 'hidden', position: 'relative' }}  
  >  
    <div  
      className="absolute inset-0 pointer-events-none"  
      style={{ overflow: 'hidden' }}  
    >  
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]" />  
    </div>  

    <div className="max-w-4xl mx-auto px-6 relative z-10">  
      <div className="text-center mb-14">  
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-3">  
          SPONSORS  
        </p>  
        <h2 className="text-3xl md:text-4xl font-bold text-white">  
          Partners Powering Apives  
        </h2>  
        <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">  
          Developer platforms supporting the Apives ecosystem.  
        </p>  
      </div>  

      {/* APEX SPONSOR */}  
      <div className="text-center mb-12">  
        <p className="text-[10px] uppercase tracking-[0.35em] font-black bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent mb-4">  
          Apex Sponsor  
        </p>  
        <a  
          href="#"  
          onClick={(e) => {  
            e.preventDefault();  
            handleSponsorClick("scoutpanels", "https://scoutpanels.com");  
          }}  
          className="relative inline-flex items-center gap-4 px-6 py-4 rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/15 to-transparent hover:from-amber-400/25 transition-all shadow-[0_0_25px_rgba(245,158,11,0.18)] hover:shadow-[0_0_40px_rgba(245,158,11,0.30)]"  
        >  
          <img  
            src="https://i.postimg.cc/VsZnhSDy/Picsart-26-01-18-21-34-03-305.jpg"  
            alt="ScoutPanels"  
            className="h-10 md:h-12 w-10 md:w-12 object-contain rounded-2xl bg-white p-1 flex-shrink-0"  
          />  
          <div className="text-left">  
            <p className="text-white font-bold text-sm md:text-base">ScoutPanels</p>  
            <p className="text-slate-400 text-[11px] md:text-xs leading-snug max-w-[320px]">  
              Turning B2B feedback into adoption signals  
            </p>  
          </div>  
        </a>  
      </div>  

      {/* PRIME SPONSOR */}  
      <div className="text-center">  
        <p className="text-[10px] uppercase tracking-[0.35em] font-black bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">  
          Prime Sponsor  
        </p>  
        <a  
          href="#"  
          onClick={(e) => {  
            e.preventDefault();  
            handleSponsorClick("serpapi", "https://serpapi.com");  
          }}  
          className="relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-transparent hover:from-white/20 transition-all hover:scale-[1.02] shadow-[0_0_35px_rgba(255,255,255,0.12)] hover:shadow-[0_0_55px_rgba(255,255,255,0.22)]"  
        >  
          <img  
            src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"  
            alt="SerpApi"  
            className="h-10 md:h-12 w-10 md:w-12 object-contain rounded-2xl bg-white p-1 flex-shrink-0"  
          />  
          <div className="text-left">  
            <p className="text-white font-bold text-sm md:text-base">SerpApi</p>  
            <p className="text-slate-400 text-[11px] md:text-xs leading-snug max-w-[320px]">  
              Real-time Google Search results via a fast developer API  
            </p>  
          </div>  
        </a>  
      </div>  

      {/* ZENITH SPONSOR */}  
      <div className="text-center mt-10">  
        <p className="text-[10px] uppercase tracking-[0.35em] font-black bg-gradient-to-r from-orange-500 to-amber-700 bg-clip-text text-transparent mb-4">  
          Zenith Sponsor  
        </p>  
        <a  
          href="#"  
          onClick={(e) => {  
            e.preventDefault();  
            handleSponsorClick("startives", "https://startives.com");  
          }}  
          className="relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent hover:from-orange-500/20 transition-all hover:scale-[1.02] shadow-[0_0_25px_rgba(249,115,22,0.18)] hover:shadow-[0_0_40px_rgba(249,115,22,0.30)]"  
        >  
          <img  
            src="https://res.cloudinary.com/dp7avkarg/image/upload/v1774100516/Picsart_26-02-22_16-45-46-153_owkgpp.png"  
            alt="Startives"  
            className="h-10 md:h-12 w-10 md:w-12 object-contain rounded-2xl bg-white p-1 flex-shrink-0"  
          />  
          <div className="text-left">  
            <p className="text-white font-bold text-sm md:text-base">Startives</p>  
            <p className="text-slate-400 text-[11px] md:text-xs leading-snug max-w-[320px]">  
              Empowering Startup Founders to Connect & Build.  
            </p>  
          </div>  
        </a>  
      </div>  
    </div>  
  </section>  
      
    </>
  );
};

export default SponsorsSection;