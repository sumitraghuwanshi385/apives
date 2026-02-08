import { useState, useEffect } from "react";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("apives_cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("apives_cookie_consent", "accepted");
    setShow(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("apives_cookie_consent", "rejected");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100]">
      <div className="
        max-w-4xl mx-auto
        bg-black/80 backdrop-blur-xl
        border border-green-500/30
        rounded-2xl
        p-4 md:p-5
        shadow-[0_20px_80px_rgba(0,0,0,0.8)]
        flex flex-col md:flex-row
        gap-4
        items-center
        justify-between
      ">
        <p className="text-sm text-slate-300 leading-relaxed">
          We use cookies to improve Apives. Choose what works for you.
          <span className="text-slate-400"> You can accept or reject.</span>
        </p>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={rejectCookies}
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
            onClick={acceptCookies}
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
  );
};