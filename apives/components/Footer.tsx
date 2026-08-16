import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Instagram,
  Youtube,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();

  if (location.pathname === '/access') return null;

  return (
    <footer className="bg-black border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto pt-8 md:pt-10 pb-5 md:pb-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">

          {/* BRAND */}
          <div className="md:col-span-3">
            <div className="flex items-center mb-4">
              <img
                src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png"
                alt="Apives Logo"
                className="w-10 h-10 md:w-11 md:h-11 object-contain"
              />
            </div>

            <p className="text-[12px] md:text-[13px] text-slate-400 leading-relaxed mb-5 font-light tracking-wide">
              A next-gen API ecosystem where builders easily discover and understand APIs.
            </p>

            <div className="flex items-center gap-3">
              {/* X */}
              <a
                href="https://x.com/useapives"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apives on X"
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all duration-300 group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/apives.ecosystem?igsh=MTNib2NicGF4Z2Zocg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apives on Instagram"
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all duration-300 group"
              >
                <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
              </a>

              
              {/* Pulsing /// */}
              <span
                className="text-mora-500 font-black tracking-[0.3em] text-[10px] select-none
                drop-shadow-[0_0_6px_rgba(34,197,94,0.9)]
                animate-pulse"
              >
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
                  className="h-7 md:h-8 object-contain"
                />
              </a>
            </div>
          </div>

          {/* PLATFORM */}
          <div className="md:col-span-2">
            <h3 className="text-[9px] md:text-[10px] font-mono font-bold text-mora-400 tracking-[0.25em] uppercase mb-3.5">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/browse"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Explore APIs
                </Link>
              </li>
              <li>
                <Link
                  to="/popular"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Community Favourite
                </Link>
              </li>
              <li>
                <Link
                  to="/ask-apives-ai"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  ApivesAI
                </Link>
              </li>
            </ul>
          </div>

          {/* DEVELOPER TOOLKIT (was Tools) */}
          <div className="md:col-span-2">
            <h3 className="text-[9px] md:text-[10px] font-mono font-bold text-mora-400 tracking-[0.25em] uppercase mb-3.5">
              Developer ToolKit
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/live-api-runner"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Live API Runner
                </Link>
              </li>
              <li>
                <Link
                  to="/jwt-decoder"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  JWT Decoder
                </Link>
              </li>
              <li>
                <Link
                  to="/curl-converter"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  cURL Converter
                </Link>
              </li>
              <li>
                <Link
                  to="/mock-server"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Mock Server
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT (was Developer ToolKit / Resources) */}
          <div className="md:col-span-2">
            <h3 className="text-[9px] md:text-[10px] font-mono font-bold text-mora-400 tracking-[0.25em] uppercase mb-3.5">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/support"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Help & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div className="md:col-span-2">
            <h3 className="text-[9px] md:text-[10px] font-mono font-bold text-mora-400 tracking-[0.25em] uppercase mb-3.5">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Terms of Service
                </Link>
              </li>
 <li>
                <Link
                  to="/cookies"
                  className="text-[12px] md:text-[13px] text-slate-400 hover:text-mora-300 transition-colors duration-300 tracking-wide"
                >
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM EFFECT + COPYRIGHT */}
      <div className="relative h-20 md:h-24 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-mora-600/25 via-mora-900/15 to-transparent" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 3px,
              rgba(34, 197, 94, 0.12) 3px,
              rgba(34, 197, 94, 0.12) 6px
            )`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-mora-500/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-mora-950/40" />

        <div className="absolute inset-0 flex items-end justify-center pb-5 md:pb-6 z-10">
          <p className="text-[11px] md:text-xs text-slate-400 font-mono tracking-wide uppercase">
            © 2026 APIVES ECOSYSTEM
          </p>
        </div>
      </div>
    </footer>
  );
};