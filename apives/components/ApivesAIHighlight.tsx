import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

export const ApivesAIHighlight = () => {
  const navigate = useNavigate();

  return (
    <div className="col-span-2">
      <div
        onClick={() => navigate("/ask-apives-ai")}
        className="
          relative
          group
          cursor-pointer

          rounded-2xl
          border border-mora-500/30
          bg-mora-500/10
          backdrop-blur-md

          px-5 py-4 md:px-6 md:py-5
          overflow-hidden

          transition-all duration-500
          hover:border-mora-500/60
        "
      >

        {/* 🔥 SOFT GREEN GLOW (INTENSITY REDUCED) */}
        <div className="
          absolute inset-0
          bg-[radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.12),transparent_75%)]
        " />

        {/* 🤖 ROBOT ANIMATION */}
        <div className="relative flex items-center gap-4">

          <div className="relative">

            <div className="
              w-12 h-12 md:w-14 md:h-14
              rounded-xl
              flex items-center justify-center

              bg-mora-500/10
              border border-mora-500/30
              text-mora-400

              shadow-[0_0_25px_rgba(34,197,94,0.25)]
            ">
              <Bot size={26} />
            </div>

            {/* pulse ring */}
            <div className="
              absolute inset-0
              rounded-xl
              border border-mora-500/30
              animate-ping
            " />

          </div>

          {/* TEXT */}
          <div className="flex flex-col">

            {/* ✅ LOGO REPLACED */}
            <img
              src="https://res.cloudinary.com/dp7avkarg/image/upload/v1777024712/Picsart_26-04-24_15-27-41-095_dwsga0.png"
              alt="Apives AI"
              className="h-5 md:h-6 object-contain mb-1"            
            />

            {/* ✅ TEXT SMALL + DOWN */}
            <p className="mt-2 text-slate-400 text-[10px] md:text-[13px] leading-snug">
              The API Intelligence You Deserve — Discover & Understand APIs Faster.
            </p>

            <span className="
              mt-2
              text-[10px]
              font-black
              uppercase
              tracking-widest
              text-mora-400
            ">
              Ask Anything →
            </span>

          </div>

        </div>
      </div>
    </div>
  );
};