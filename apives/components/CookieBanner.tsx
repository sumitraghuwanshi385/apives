import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("apives_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const closeWithSave = (value: "accepted" | "rejected") => {
    localStorage.setItem("apives_cookie_consent", value);

    // 🔥 trigger exit animation
    setClosing(true);

    // 🔥 wait for animation then remove
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 350);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100]">
      <div
        className={`
          relative max-w-4xl mx-auto
          bg-black/80 backdrop-blur-xl
          border border-green-500/30
          rounded-2xl
          p-4 md:p-5
          flex flex-col md:flex-row gap-4 justify-between
          transition-all duration-300 ease-out
          ${
            closing
              ? "opacity-0 translate-y-4 scale-[0.98]"
              : "opacity-100 translate-y-0 scale-100"
          }
        `}
      >
        {/* ❌ CLOSE */}
        <button
  onClick={() => closeWithSave("rejected")}
  className="
    absolute
    top-3 right-3
    md:-top-3 md:-right-3
    h-8 w-8
    rounded-full
    bg-black/70 backdrop-blur
    border border-green-500/30
shadow-[0_0_10px_rgba(34,197,94,0.25)]
hover:border-green-400/50
    hover:bg-white/20
hover:shadow-[0_0_18px_rgba(34,197,94,0.55)]
    flex items-center justify-center
    transition
  "
>
          <X size={14} className="text-slate-300" />
        </button>

        {/* TEXT */}
        <div className="pr-10">
          <p className="text-sm text-slate-300">
            We use cookies to improve Apives.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            You can accept or reject. For details, visit{" "}
            <Link
              to="/cookies"
              className="text-green-400 underline hover:text-green-300 transition"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => closeWithSave("rejected")}
            className="px-4 py-2 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 transition"
          >
            Reject
          </button>
          <button
            onClick={() => closeWithSave("accepted")}
            className="px-5 py-2 rounded-full bg-green-500 text-black font-bold shadow hover:bg-green-400 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};