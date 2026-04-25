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

        {/* 🔥 SOFT GREEN GLOW */}
        <div className="
          absolute inset-0
          bg-[radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.18),transparent_70%)]
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

            <h3 className="text-white font-bold text-sm md:text-base">
              Apives AI
            </h3>

            <p className="text-slate-400 text-[11px] md:text-sm leading-snug">
              The API Intelligence You Deserve — explore, compare and understand APIs instantly.
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