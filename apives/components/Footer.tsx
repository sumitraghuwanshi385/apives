import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Instagram,
  Youtube,
  MessageSquare,
  X,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    await fetch('https://formsubmit.co/ajax/apivesecosystem@gmail.com', {
      method: 'POST',
      body: data,
    });

    setFeedbackSuccess(true);
    form.reset();
  };

  if (location.pathname === '/access') return null;

  return (
    <footer className="bg-black mt-auto relative overflow-hidden">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

          {/* BRAND */}
          <div className="md:col-span-3">

            <div className="flex items-center mb-4 md:mb-5">
              <img
                src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png"
                alt="Apives Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </div>

            <p className="text-[13px] md:text-sm text-slate-400 leading-relaxed mb-4 md:mb-5 font-light">
              A next-gen API ecosystem where builders easily discover and understand APIs.
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-3">

              {/* X */}
              <a
                href="https://x.com/useapives"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apives on X"
                className="
                  flex items-center justify-center
                  w-8 h-8 md:w-9 md:h-9
                  rounded-full
                  bg-white/5
                  hover:bg-white/10
                  border border-white/5
                  text-slate-500 hover:text-white
                  transition-all
                  group
                "
              >
                <span className="text-[14px] md:text-[16px] font-semibold leading-none group-hover:scale-110 transition-transform">
                  𝕏
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/apives.ecosystem?igsh=MTNib2NicGF4Z2Zocg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apives on Instagram"
                className="
                  flex items-center justify-center
                  w-8 h-8 md:w-9 md:h-9
                  rounded-full
                  bg-white/5
                  hover:bg-white/10
                  border border-white/5
                  text-slate-500 hover:text-white
                  transition-all
                  group
                "
              >
                <Instagram
                  className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform"
                />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@usestartives"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apives on YouTube"
                className="
                  flex items-center justify-center
                  w-8 h-8 md:w-9 md:h-9
                  rounded-full
                  bg-white/5
                  hover:bg-white/10
                  border border-white/5
                  text-slate-500 hover:text-white
                  transition-all
                  group
                "
              >
                <Youtube
                  className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform"
                />
              </a>

              {/* GLOWING DIVIDER */}
              <span
                className="
                  text-mora-500
                  font-black
                  tracking-widest
                  text-[10px] md:text-[12px]
                  select-none
                  animate-pulse
                  drop-shadow-[0_0_5px_rgba(34,197,94,0.75)]
                "
              >
                ///
              </span>

              {/* BUY ME A COFFEE */}
              <a
                href="https://buymeacoffee.com/apives"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buy me a coffee"
                className="transition-transform hover:scale-105 active:scale-95"
              >
                <img
                  src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/Picsart_26-02-08_16-44-16-359_lpylta"
                  alt="Buy me a coffee"
                  className="h-8 md:h-9 object-contain"
                />
              </a>

            </div>
          </div>

          {/* PLATFORM */}
          <div className="md:col-span-2">

            <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">
              Platform
            </h3>

            <ul className="space-y-2 md:space-y-3">

              <li>
                <Link
                  to="/browse"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Explore APIs
                </Link>
              </li>

              <li>
                <Link
                  to="/fresh"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  New Releases
                </Link>
              </li>

              <li>
                <Link
                  to="/popular"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Top Rated
                </Link>
              </li>

              <li>
                <Link
                  to="/live-api-runner"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Live API Runner
                </Link>
              </li>

              <li>
                <Link
                  to="/jwt-decoder"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  JWT Decoder
                </Link>
              </li>

              <li>
                <Link
                  to="/api-response-formatter"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  API Formatter
                </Link>
              </li>

              <li>
                <Link
                  to="/curl-converter"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  cURL Converter
                </Link>
              </li>

              <li>
                <Link
                  to="/mock-server"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Mock Server
                </Link>
              </li>

              <li>
                <Link
                  to="/architect"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  API Architect
                </Link>
              </li>

            </ul>
          </div>

          {/* SUPPORT */}
          <div className="md:col-span-2">

            <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">
              Support
            </h3>

            <ul className="space-y-2 md:space-y-3">

              <li>
                <Link
                  to="/support"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Help & Support
                </Link>
              </li>

              <li>
                <Link
                  to="/docs"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>

              <li>
                <Link
                  to="/sponsorship"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  For Sponsorship
                </Link>
              </li>

              <li>
                <Link
                  to="/blogs"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Blogs
                </Link>
              </li>

              <li>
                <Link
                  to="/offers/serpapi"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Special Offers
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors text-left"
                >
                  Feedback
                </button>
              </li>

            </ul>
          </div>

          {/* LEGAL */}
          <div className="md:col-span-2">

            <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">
              Legal
            </h3>

            <ul className="space-y-2 md:space-y-3">

              <li>
                <Link
                  to="/privacy"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/cookies"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* =====================================================
          PREMIUM 3D FOOTER END
         ===================================================== */}
      <div
        className="
          relative
          w-full
          h-[125px]
          md:h-[140px]
          bg-black
          overflow-hidden
          flex
          items-end
          justify-center
        "
      >

        {/* SOFT ATMOSPHERIC GLOW */}
        <div
          className="
            absolute
            left-1/2
            bottom-[-95px]
            -translate-x-1/2
            w-[75%]
            md:w-[55%]
            h-[190px]
            rounded-[50%]
            pointer-events-none
            blur-[35px]
          "
          style={{
            background:
              'radial-gradient(ellipse, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.08) 38%, transparent 72%)',
          }}
        />

        {/* 3D HORIZON */}
        <div
          className="
            absolute
            left-1/2
            bottom-[-72px]
            -translate-x-1/2
            w-[85%]
            md:w-[62%]
            h-[115px]
            rounded-[50%]
            border
            border-mora-500/20
            pointer-events-none
          "
          style={{
            transform:
              'translateX(-50%) perspective(500px) rotateX(62deg)',
            boxShadow:
              '0 -10px 45px rgba(34,197,94,0.12), inset 0 8px 25px rgba(34,197,94,0.05)',
          }}
        />

        {/* INNER 3D RING */}
        <div
          className="
            absolute
            left-1/2
            bottom-[-48px]
            -translate-x-1/2
            w-[58%]
            md:w-[40%]
            h-[78px]
            rounded-[50%]
            border
            border-mora-500/15
            pointer-events-none
          "
          style={{
            transform:
              'translateX(-50%) perspective(500px) rotateX(62deg)',
            boxShadow:
              '0 -5px 25px rgba(34,197,94,0.08)',
          }}
        />

        {/* CENTER LIGHT */}
        <div
          className="
            absolute
            left-1/2
            bottom-[24px]
            -translate-x-1/2
            w-[180px]
            md:w-[300px]
            h-[2px]
            rounded-full
            bg-mora-500/20
            blur-[1px]
            pointer-events-none
          "
          style={{
            boxShadow:
              '0 0 22px rgba(34,197,94,0.18)',
          }}
        />

        {/* SOFT FLOOR GRADIENT */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[65px]
            pointer-events-none
          "
          style={{
            background:
              'linear-gradient(to top, rgba(34,197,94,0.07), transparent)',
          }}
        />

        {/* COPYRIGHT */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            pointer-events-none
            z-10
          "
        >
          <span
            className="
              text-white/55
              text-[9px]
              md:text-[10px]
              font-medium
              tracking-[0.18em]
              uppercase
              translate-y-[2px]
            "
          >
            © 2026 Apives Ecosystem
          </span>
        </div>

      </div>

      {/* FEEDBACK MODAL */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">

          <div className="relative w-full max-w-sm bg-dark-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mora-500 to-transparent" />

            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">

              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-mora-500/10 mb-3 border border-mora-500/20">

                <MessageSquare
                  className="text-mora-500"
                  size={20}
                />

              </div>

              <h2 className="text-xl font-display font-bold text-white mb-1.5">
                Share Feedback
              </h2>

              <p className="text-slate-400 text-xs">
                Help us refine the ecosystem.
              </p>

            </div>

            <form
              onSubmit={handleFeedbackSubmit}
              className="space-y-3"
            >

              <input
                type="hidden"
                name="_subject"
                value="User Feedback - Apives"
              />

              <div className="space-y-1">

                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="
                    w-full
                    bg-black
                    border
                    border-white/10
                    rounded-xl
                    px-4
                    py-2.5
                    text-xs
                    text-white
                    focus:border-mora-500
                    focus:outline-none
                    transition-all
                    placeholder:text-slate-700
                  "
                />

              </div>

              <div className="space-y-1">

                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Email{' '}
                  <span className="text-slate-600 normal-case">
                    (optional)
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  className="
                    w-full
                    bg-black
                    border
                    border-white/10
                    rounded-xl
                    px-4
                    py-2.5
                    text-xs
                    text-white
                    focus:border-mora-500
                    focus:outline-none
                    transition-all
                    placeholder:text-slate-700
                  "
                />

              </div>

              <div className="space-y-1">

                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Feedback
                </label>

                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="What can we improve?"
                  className="
                    w-full
                    bg-black
                    border
                    border-white/10
                    rounded-xl
                    px-4
                    py-2.5
                    text-xs
                    text-white
                    focus:border-mora-500
                    focus:outline-none
                    transition-all
                    placeholder:text-slate-700
                    resize-none
                  "
                />

              </div>

              {feedbackSuccess && (
                <div className="
                  bg-green-500/10
                  border
                  border-green-500/20
                  text-green-400
                  text-xs
                  rounded-xl
                  px-4
                  py-3
                  flex
                  items-center
                  gap-2
                ">
                  <span>✓</span>
                  Thanks! Your feedback really helps 💚
                </div>
              )}

              <button
                type="submit"
                className="
                  w-full
                  bg-mora-600
                  hover:bg-mora-500
                  text-white
                  font-bold
                  py-3
                  rounded-xl
                  shadow-lg
                  transition-all
                  uppercase
                  tracking-widest
                  text-[10px]
                  mt-2
                "
              >
                Send Feedback
              </button>

            </form>

          </div>

        </div>
      )}

    </footer>
  );
};