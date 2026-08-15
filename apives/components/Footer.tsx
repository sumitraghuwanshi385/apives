import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Instagram,
  Youtube,
  MessageSquare,
  X,
} from 'lucide-react';

/*
  Footer uses "JetBrains Mono" for a distinct, dev-tool feel instead of a
  generic sans font. Add this once in your index.html <head> (or global CSS):

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;800&display=swap" rel="stylesheet">
*/

// Custom X (Twitter) logo — lucide's "Twitter" icon is the old bird mark,
// this is the current X wordmark icon.
const XLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
    <footer
      className="bg-black border-t border-white/5 mt-auto relative"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >

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
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-500 hover:text-white transition-all group"
              >
                <XLogo className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/apives.ecosystem?igsh=MTNib2NicGF4Z2Zocg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apives on Instagram"
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-500 hover:text-white transition-all group"
              >
                <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@usestartives"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apives on YouTube"
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-500 hover:text-white transition-all group"
              >
                <Youtube className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
              </a>

              <span className="text-mora-500 font-black tracking-widest text-[10px] md:text-[12px] select-none">
                ///
              </span>

              {/* Buy Me a Coffee */}
              <a
                href="https://buymeacoffee.com/apives"
                target="_blank"
                rel="noopener noreferrer"
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
                <Link to="/browse" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Explore APIs
                </Link>
              </li>

              <li>
                <Link to="/popular" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Top Rated
                </Link>
              </li>

            </ul>
          </div>

          {/* TOOLS */}
          <div className="md:col-span-2">

            <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">
              Tools
            </h3>

            <ul className="space-y-2 md:space-y-3">

              <li>
                <Link to="/live-api-runner" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Live API Runner
                </Link>
              </li>

              <li>
                <Link to="/jwt-decoder" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  JWT Decoder
                </Link>
              </li>

              <li>
                <Link to="/api-response-formatter" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  API Formatter
                </Link>
              </li>

              <li>
                <Link to="/curl-converter" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  cURL Converter
                </Link>
              </li>

              <li>
                <Link to="/mock-server" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Mock Server
                </Link>
              </li>

              <li>
                <Link to="/architect" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  API Architect
                </Link>
              </li>

            </ul>
          </div>

          {/* RESOURCES (was Support) */}
          <div className="md:col-span-2">

            <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">
              Resources
            </h3>

            <ul className="space-y-2 md:space-y-3">

              <li>
                <Link to="/support" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>

              <li>
                <Link to="/blogs" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Blogs
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
                <Link to="/privacy" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="/terms" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-8 md:mt-10 border-t border-white/5 pt-6 md:pt-8">

          <div className="flex flex-col items-center">

            <p className="text-[12px] md:text-sm text-slate-500 flex items-center gap-2">
              {/* glowing /// */}
              <span className="text-mora-500 font-black tracking-widest drop-shadow-[0_0_6px_rgba(34,197,94,0.9)] animate-pulse">
                ///
              </span>

              <span>
                &copy; 2025 Apives Ecosystem
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* BOTTOM GLOW STRIP — same layout as reference image, mora green instead of blue */}
      <div className="relative w-full h-40 md:h-52 overflow-hidden pointer-events-none select-none">
        {/* base gradient: black fading into green glow at the very bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-mora-500/70 via-mora-900/30 to-transparent" />
        {/* soft radial glow for extra depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at bottom, rgba(34,197,94,0.55) 0%, rgba(34,197,94,0.15) 45%, transparent 75%)',
          }}
        />
        {/* faint vertical grid lines like the reference image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px)',
            backgroundSize: '90px 100%',
          }}
        />
        {/* subtle grain */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* FEEDBACK MODAL */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">

          <div className="relative w-full max-w-sm bg-dark-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mora-500 to-transparent"></div>

            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">

              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-mora-500/10 mb-3 border border-mora-500/20">
                <MessageSquare className="text-mora-500" size={20} />
              </div>

              <h2 className="text-xl font-display font-bold text-white mb-1.5">
                Share Feedback
              </h2>

              <p className="text-slate-400 text-xs">
                Help us refine the ecosystem.
              </p>

            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-3">

              <input type="hidden" name="_subject" value="User Feedback - Apives" />

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-mora-500 focus:outline-none transition-all placeholder-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Email <span className="text-slate-600 normal-case">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-mora-500 focus:outline-none transition-all placeholder-slate-700"
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
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-mora-500 focus:outline-none transition-all placeholder-slate-700 resize-none"
                ></textarea>
              </div>

              {feedbackSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                  <span>✓</span>
                  Thanks! Your feedback really helps 💚
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-mora-600 hover:bg-mora-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all uppercase tracking-widest text-[10px] mt-2"
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