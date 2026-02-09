import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("apives_cookie_consent");
    if (!consent) setShowBanner(true);
  }, []);

  const saveAndClose = (value: "accepted" | "rejected") => {
    localStorage.setItem("apives_cookie_consent", value);

    if (value === "accepted") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    }

    setShowBanner(false);
  };

  return (
    <>
      {/* 🍪 COOKIE BANNER */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-[100]">
          <div className="relative max-w-4xl mx-auto bg-black/80 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 justify-between">
            
            {/* ❌ CLOSE */}
            <button
              onClick={() => saveAndClose("rejected")}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <X size={14} className="text-slate-300" />
            </button>

            <div className="pr-10">
              <p className="text-sm text-slate-300">
                We use cookies to improve Apives.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                You can accept or reject. For details, visit{" "}
                <Link to="/cookies" className="text-green-400 underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => saveAndClose("rejected")}
                className="px-4 py-2 rounded-full bg-white/10 text-slate-300"
              >
                Reject
              </button>
              <button
                onClick={() => saveAndClose("accepted")}
                className="px-5 py-2 rounded-full bg-green-500 text-black font-bold shadow"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ TOAST (independent) */}
{showToast && (
  <div
    className="
      fixed bottom-14 left-1/2 -translate-x-1/2 z-[200]
      bg-black/70 backdrop-blur-2xl
      border border-green-500/30
      text-green-400
      px-5 py-2.5
      rounded-full
      flex items-center justify-center gap-1
      text-sm font-medium
      shadow-[0_8px_30px_rgba(0,0,0,0.5)]
      whitespace-nowrap
    "
  >
    <span>Thank you. Enjoy Apives</span>

    <span
      className="
        text-green-500
        drop-shadow-[0_0_6px_rgba(34,197,94,0.9)]
        flex items-center
      "
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 21s-7.5-4.35-10-9.28C.55 8.6 2.3 5.5 5.6 5.5c2 0 3.4 1.2 4.4 2.6 1-1.4 2.4-2.6 4.4-2.6 3.3 0 5.05 3.1 3.6 6.22C19.5 16.65 12 21 12 21z" />
      </svg>
    </span>
  </div>
)}