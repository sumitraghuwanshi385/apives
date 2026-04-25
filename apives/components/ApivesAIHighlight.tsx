import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

const ApivesAIHighlight = () => {
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
          bg-black
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
          bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.10),transparent_75%)]
        " />

        {/* CONTENT */}
        <div className="relative flex items-center gap-4">

          {/* ICON */}
          <div className="relative">
            <div className="
              w-12 h-12 md:w-14 md:h-14
              rounded-xl
              flex items-center justify-center
              bg-mora-500/10
              border border-mora-500/30
              text-mora-400
              shadow-[0_0_20px_rgba(34,197,94,0.18)]
            ">
              <Bot size={26} />
            </div>

            <div className="
              absolute inset-0
              rounded-xl
              border border-mora-500/20
              animate-ping
            " />
          </div>

          {/* TEXT */}
          <div className="flex flex-col">

            <img
              src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png"
              alt="Apives AI"
              className="h-5 md:h-6 object-contain"
            />

            <p className="
              mt-1.5
              text-slate-300
              text-[11px] md:text-sm
              leading-snug
            ">
              The API Intelligence You Deserve — Discover and understand APIs faster.
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

export default ApivesAIHighlight;