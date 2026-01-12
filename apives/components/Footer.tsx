import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Zap, Check, X, MessageSquare } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

export const Footer: React.FC = () => {
  const location = useLocation();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // ✅ NEW STATES (ONLY ADDITION)
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);

  if (location.pathname === '/access') return null;

  return (
    <footer className="bg-dark-900 border-t border-white/5 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-mora-500/5 blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

          <div className="md:col-span-3">
            <img
              src="https://i.postimg.cc/Fsby98j9/IMG-20251219-132426.png"
              alt="Apives Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain mb-4"
            />
            <p className="text-[13px] md:text-sm text-slate-400 leading-relaxed mb-4 font-light">
              The next-generation API ecosystem for builders worldwide.
            </p>
            <a
              href="https://x.com/useapives"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all"
            >
              <XIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-mora-400 uppercase mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-slate-400 hover:text-white">Marketplace</Link></li>
              <li><Link to="/fresh" className="text-slate-400 hover:text-white">Fresh Nodes</Link></li>
              <li><Link to="/popular" className="text-slate-400 hover:text-white">Top Rated</Link></li>
              <li><Link to="/submit" className="text-slate-400 hover:text-white">Submit API</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-mora-400 uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-slate-400 hover:text-white">Help & Support</Link></li>
              <li><Link to="/docs" className="text-slate-400 hover:text-white">Docs</Link></li>
              <li>
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="text-slate-400 hover:text-white"
                >
                  Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* ✅ NEWSLETTER */}
          <div className="md:col-span-3">
            <div className="bg-black/80 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
                <Zap size={14} className="text-mora-500" /> Newsletter
              </h3>

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
              >
                <input type="hidden" name="_subject" value="New Newsletter Subscription - Apives" />
                <input type="hidden" name="_captcha" value="false" />

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/10 rounded-full flex items-center justify-center"
                  >
                    <ArrowRight size={12} />
                  </button>
                </div>

                {newsletterDone && (
                  <p className="text-green-400 text-[10px] mt-2 font-semibold">
                    You're in! We'll keep you updated 🚀
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FEEDBACK MODAL */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-dark-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm relative">
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-3 right-3 text-slate-500"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-2 text-center">
              Share Feedback
            </h2>

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
                  setFeedbackSent(true);
                  setTimeout(() => {
                    setIsFeedbackOpen(false);
                    setFeedbackSent(false);
                  }, 2000);
                }
              }}
              className="space-y-3"
            >
              <input type="hidden" name="_subject" value="User Feedback - Apives" />
              <input type="hidden" name="_captcha" value="false" />

              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />

              <textarea
                name="message"
                required
                rows={3}
                placeholder="What can we improve?"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white resize-none"
              />

              {feedbackSent && (
                <p className="text-green-400 text-[10px] text-center font-bold">
                  Thanks! Your feedback was sent successfully.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-mora-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest"
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