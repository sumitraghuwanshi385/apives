import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  Zap,
  MessageSquare,
  X
} from 'lucide-react';

/* X (Twitter) Icon */
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC = () => {
  const location = useLocation();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);

  if (location.pathname === '/access') return null;

  return (
    <footer className="bg-dark-900 border-t border-white/5 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-mora-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

          {/* Brand */}
          <div className="md:col-span-3">
            <img
              src="https://i.postimg.cc/Fsby98j9/IMG-20251219-132426.png"
              alt="Apives"
              className="w-12 h-12 mb-4"
            />
            <p className="text-sm text-slate-400 mb-4">
              The next-generation API ecosystem for builders worldwide.
            </p>
            <a
              href="https://x.com/useapives"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <XIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-mora-400 uppercase mb-4">Platform</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/browse">Marketplace</Link></li>
              <li><Link to="/fresh">Fresh Nodes</Link></li>
              <li><Link to="/popular">Top Rated</Link></li>
              <li><Link to="/submit">Submit API</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-mora-400 uppercase mb-4">Support</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/support">Help</Link></li>
              <li><Link to="/docs">Docs</Link></li>
              <li>
                <button onClick={() => setIsFeedbackOpen(true)}>Feedback</button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <div className="bg-black/80 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
                <Zap size={14} className="text-mora-500" /> Newsletter
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                New APIs directly in your inbox.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  const res = await fetch(
                    'https://formsubmit.co/ajax/beatslevelone@gmail.com',
                    {
                      method: 'POST',
                      body: formData,
                      headers: { Accept: 'application/json' },
                    }
                  );

                  if (res.ok) setNewsletterDone(true);
                }}
                className="relative"
              >
                <input type="hidden" name="_subject" value="Newsletter - Apives" />
                <input type="hidden" name="_captcha" value="false" />

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white"
                />

                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-mora-500 text-black rounded-full flex items-center justify-center"
                >
                  <ArrowRight size={12} />
                </button>

                {newsletterDone && (
                  <p className="text-green-400 text-[10px] mt-2 font-bold">
                    Subscribed successfully
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/5 pt-6 text-center text-slate-500 text-sm">
          © 2025 Apives Ecosystem
        </div>
      </div>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-dark-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm relative">
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-3 right-3 text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-4">
              <MessageSquare className="mx-auto text-mora-500 mb-2" />
              <h2 className="text-lg font-bold text-white">Share Feedback</h2>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                const res = await fetch(
                  'https://formsubmit.co/ajax/beatslevelone@gmail.com',
                  {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' },
                  }
                );

                if (res.ok) {
                  setFeedbackSubmitted(true);
                  setTimeout(() => {
                    setIsFeedbackOpen(false);
                    setFeedbackSubmitted(false);
                  }, 2000);
                }
              }}
              className="space-y-3"
            >
              <input type="hidden" name="_subject" value="Feedback - Apives" />
              <input type="hidden" name="_captcha" value="false" />

              <input
                name="name"
                required
                placeholder="Name"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />

              <textarea
                name="message"
                required
                rows={3}
                placeholder="Your feedback..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white resize-none"
              />

              {feedbackSubmitted && (
                <p className="text-green-400 text-xs text-center font-bold">
                  Thanks! Feedback sent.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-mora-600 hover:bg-mora-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-[10px]"
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