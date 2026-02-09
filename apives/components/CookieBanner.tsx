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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          Preferences saved. Enjoy exploring Apives 💚
        </div>
      )}
    </>
  );
};