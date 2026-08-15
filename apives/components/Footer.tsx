import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Instagram,
  Twitter,
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
    <footer className="bg-black border-t border-white/5 mt-auto relative overflow-hidden">

      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative z-10">

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
                  text-slate-500
                  hover:text-white
                  transition-all
                  group
                "
              >
                <Twitter
                  className="
                    w-3.5 h-3.5 md:w-4 md:h-4
                    group-hover:scale-110
                    transition-transform
                  "
                />
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
                  text-slate-500
                  hover:text-white
                  transition-all
                  group
                "
              >
                <Instagram
                  className="
                    w-3.5 h-3.5 md:w-4 md:h-4
                    group-hover:scale-110
                    transition-transform
                  "
                />
              </a>

              {/* /// */}
              <span
                className="
                  text-mora-500
                  font-black
                  tracking-widest
                  text-[10px] md:text-[12px]
                  select-none
                  animate-pulse
                  drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]
                "
              >
                ///
              </span>

              {/* Buy Me a Coffee */}
              <a
                href="https://buymeacoffee.com/apives"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buy me a coffee"
                className="
                  transition-transform
                  hover:scale-105
                  active:scale-95
                "
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

            <h3
              className="
                text-[11px] md:text-sm
                font-semibold
                text-mora-400
                tracking-[0.18em]
                uppercase
                mb-4 md:mb-5
              "
            >
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
                  to="/popular"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Top Rated
                </Link>
              </li>

            </ul>
          </div>

          {/* TOOLS */}
          <div className="md:col-span-2">

            <h3
              className="
                text-[11px] md:text-sm
                font-semibold
                text-mora-400
                tracking-[0.18em]
                uppercase
                mb-4 md:mb-5
              "
            >
              Tools
            </h3>

            <ul className="space-y-2 md:space-y-3">

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

          {/* COMMUNITY */}
          <div className="md:col-span-2">

            <h3
              className="
                text-[11px] md:text-sm
                font-semibold
                text-mora-400
                tracking-[0.18em]
                uppercase
                mb-4 md:mb-5
              "
            >
              Community
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
                  to="/blogs"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Blogs
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="
                    text-[13px] md:text-sm
                    text-slate-400
                    hover:text-white
                    transition-colors
                    text-left
                  "
                >
                  Feedback
                </button>
              </li>

            </ul>
          </div>

          {/* LEGAL */}
          <div className="md:col-span-2">

            <h3
              className="
                text-[11px] md:text-sm
                font-semibold
                text-mora-400
                tracking-[0.18em]
                uppercase
                mb-4 md:mb-5
              "
            >
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
                  to="/terms"
                  className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* FINAL COPYRIGHT AREA */}
        <div
          className="
            relative
            mt-6 md:mt-7
            h-[48px] md:h-[52px]
            overflow-hidden
            flex items-center justify-center
          "
        >

          {/* SMALL ANIMATED EDGE-TO-EDGE STRIPE */}
          <div
            className="
              absolute
              left-0
              top-1/2
              -translate-y-1/2
              w-[70px]
              md:w-[100px]
              h-[1.5px]
              rounded-full
              bg-mora-500
              pointer-events-none
              animate-footer-stripe
            "
            style={{
              boxShadow:
                '0 0 7px rgba(34,197,94,0.55), 0 0 14px rgba(34,197,94,0.18)',
            }}
          />

          {/* COPYRIGHT + SMALL DIVIDER */}
          <div className="relative z-10 flex flex-col items-center bg-black px-3">

            <span
              className="
                text-white/40
                text-[8px]
                md:text-[9px]
                font-mono
                font-medium
                tracking-[0.28em]
                uppercase
                whitespace-nowrap
              "
            >
              © 2026 Apives Ecosystem
            </span>

            <span
              className="
                mt-1.5
                w-10
                h-px
                bg-white/15
                rounded-full
              "
            />

          </div>

          <style>
            {`
              @keyframes footerStripe {
                0% {
                  transform: translate3d(100vw, -50%, 0);
                  opacity: 0;
                }

                8% {
                  opacity: 1;
                }

                88% {
                  opacity: 1;
                }

                100% {
                  transform: translate3d(-120px, -50%, 0);
                  opacity: 0;
                }
              }

              .animate-footer-stripe {
                animation: footerStripe 4.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
                will-change: transform, opacity;
              }
            `}
          </style>

        </div>

      </div>

      {/* FEEDBACK MODAL */}
      {isFeedbackOpen && (
        <div
          className="
            fixed inset-0
            z-[100]
            flex items-center justify-center
            p-4
            bg-black/80
            backdrop-blur-md
            animate-fade-in
          "
        >

          <div
            className="
              relative
              w-full
              max-w-sm
              bg-dark-900
              border border-white/10
              rounded-3xl
              p-6
              shadow-2xl
              overflow-hidden
            "
          >

            <div
              className="
                absolute
                top-0
                left-0
                w-full
                h-1
                bg-gradient-to-r
                from-transparent
                via-mora-500
                to-transparent
              "
            />

            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="
                absolute
                top-3
                right-3
                text-slate-500
                hover:text-white
                transition-colors
              "
              aria-label="Close feedback"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">

              <div
                className="
                  inline-flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-full
                  bg-mora-500/10
                  mb-3
                  border
                  border-mora-500/20
                "
              >
                <MessageSquare
                  className="text-mora-500"
                  size={20}
                />
              </div>

              <h2
                className="
                  text-xl
                  font-display
                  font-bold
                  text-white
                  mb-1.5
                "
              >
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

                <label
                  className="
                    text-[9px]
                    font-bold
                    text-slate-500
                    uppercase
                    tracking-wider
                    ml-1
                  "
                >
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
                    border border-white/10
                    rounded-xl
                    px-4 py-2.5
                    text-xs
                    text-white
                    focus:border-mora-500
                    focus:outline-none
                    transition-all
                    placeholder-slate-700
                  "
                />

              </div>

              <div className="space-y-1">

                <label
                  className="
                    text-[9px]
                    font-bold
                    text-slate-500
                    uppercase
                    tracking-wider
                    ml-1
                  "
                >
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
                    border border-white/10
                    rounded-xl
                    px-4 py-2.5
                    text-xs
                    text-white
                    focus:border-mora-500
                    focus:outline-none
                    transition-all
                    placeholder-slate-700
                  "
                />

              </div>

              <div className="space-y-1">

                <label
                  className="
                    text-[9px]
                    font-bold
                    text-slate-500
                    uppercase
                    tracking-wider
                    ml-1
                  "
                >
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
                    border border-white/10
                    rounded-xl
                    px-4 py-2.5
                    text-xs
                    text-white
                    focus:border-mora-500
                    focus:outline-none
                    transition-all
                    placeholder-slate-700
                    resize-none
                  "
                />

              </div>

              {feedbackSuccess && (
                <div
                  className="
                    bg-green-500/10
                    border border-green-500/20
                    text-green-400
                    text-xs
                    rounded-xl
                    px-4 py-3
                    flex items-center gap-2
                  "
                >
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