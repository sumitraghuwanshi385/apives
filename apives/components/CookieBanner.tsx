import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("apives_cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const saveAndClose = (value: "accepted" | "rejected") => {
    localStorage.setItem("apives_cookie_consent", value);
    setShow(false);

    // show greeting only on accept
    if (value === "accepted") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* 🍪 COOKIE BANNER */}
      <div className="fixed bottom-4 left-4 right-4 z-[100]">
        <div
          className="
            relative
            max-w-4xl mx-auto
            bg-black/80 backdrop-blur-xl
            border border-green-500/30
            rounded-2xl
            p-4 md:p-5
            shadow-[0_20px_80px_rgba(0,0,0,0.8)]
            flex flex-col md:flex-row
            gap-4
            items-start md:items-center
            justify-between
          "
        >
          {/* ❌ CROSS BUTTON */}
          <button
            onClick={() => saveAndClose("rejected")}
            className="
              absolute top-3 right-3
              h-8 w-8
              rounded-full
              bg-white/10
              hover:bg-white/20
              flex items-center justify-center
              transition
            "
            aria-label="Close cookie banner"
          >
            <X size={14} className="text-slate-300" />
          </button>

          {/* TEXT */}
          <div className="pr-10">
            <p className="text-sm text-slate-300 leading-relaxed">
              We use cookies to improve Apives. Choose what works for you.
            </p>
<p> className="text-slate-400"> You can accept or reject.</p>
              <span className="ml-1">
                For more details, visit{" "}
                <Link
                  to="/cookies"
                  className="text-green-400 hover:text-green-300 underline underline-offset-2 transition"
                >
                  Cookie Policy
                </Link>
                .
              </span>
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => saveAndClose("rejected")}
              className="
                px-4 py-2
                rounded-full
                text-sm font-medium
                bg-white/10
                text-slate-300
                hover:bg-white/20
                transition
              "
            >
              Reject
            </button>

            <button
              onClick={() => saveAndClose("accepted")}
              className="
                px-5 py-2
                rounded-full
                text-sm font-bold
                bg-green-500
                text-black
                hover:bg-green-400
                transition
                shadow-[0_0_20px_rgba(34,197,94,0.6)]
              "
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      {/* ✅ TOAST GREETING */}
      {showToast && (
        <div
          className="
            fixed bottom-24 left-1/2 -translate-x-1/2
            bg-green-500
            text-black
            px-4 py-2
            rounded-full
            text-sm font-semibold
            shadow-lg
            z-[110]
            animate-fade-in
          "
        >
          Preferences saved. Enjoy exploring Apives 💚
        </div>
      )}
    </>
  );
};