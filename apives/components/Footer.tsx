import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, Zap, MessageSquarePlus, Check, X, MessageSquare } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
<svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
</svg>
);

export const Footer: React.FC = () => {
const location = useLocation();
const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
const [feedbackSuccess, setFeedbackSuccess] = useState(false);
const [newsletterSuccess, setNewsletterSuccess] = useState(false);

const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const data = new FormData(form);

  await fetch('https://formsubmit.co/ajax/beatslevelone@gmail.com', {
    method: 'POST',
    body: data,
  });

  setFeedbackSuccess(true);
  form.reset();
};

const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const data = new FormData(form);

  await fetch('https://formsubmit.co/ajax/beatslevelone@gmail.com', {
    method: 'POST',
    body: data,
  });

  setNewsletterSuccess(true);
  form.reset();
};

if (location.pathname === '/access') return null;

return (
<footer className="bg-dark-900 border-t border-white/5 mt-auto relative overflow-hidden">
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-mora-500/5 blur-[80px] pointer-events-none"></div>

<div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative z-10">  
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">  
        
      <div className="md:col-span-3">  
        <div className="flex items-center mb-4 md:mb-5">  
            <img   
              src="https://i.postimg.cc/Fsby98j9/IMG-20251219-132426.png"   
              alt="Apives Logo"   
              className="w-10 h-10 md:w-12 md:h-12 object-contain"  
            />  
        </div>  
        <p className="text-[13px] md:text-sm text-slate-400 leading-relaxed mb-4 md:mb-5 font-light">  
          The next-generation API ecosystem for builders worldwide. Discover, integrate, and scale with ease.  
        </p>  
        <div className="flex items-center gap-3">  
            <a href="https://x.com/useapives" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-500 hover:text-white transition-all group">  
                <XIcon className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />  
            </a>  
        </div>  
      </div>  

      <div className="md:col-span-2">  
        <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">Platform</h3>  
        <ul className="space-y-2 md:space-y-3">  
          <li><Link to="/browse" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Marketplace</Link></li>  
          <li><Link to="/fresh" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Fresh Nodes</Link></li>  
          <li><Link to="/popular" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Top Rated</Link></li>  
          <li><Link to="/submit" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Submit API</Link></li>  
        </ul>  
      </div>  

      <div className="md:col-span-2">  
        <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">Support</h3>  
        <ul className="space-y-2 md:space-y-3">  
          <li><Link to="/support" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Help & Support</Link></li>  
          <li><Link to="/docs" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Docs</Link></li>  
          <li><Link to="/sponsorship" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Sponsorship</Link></li>  
          <li>  
              <button onClick={() => setIsFeedbackOpen(true)} className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors text-left">  
                  Feedback  
              </button>  
          </li>  
        </ul>  
      </div>  

      <div className="md:col-span-2">  
        <h3 className="text-[11px] md:text-sm font-semibold text-mora-400 tracking-widest uppercase mb-4 md:mb-5">Legal</h3>  
        <ul className="space-y-2 md:space-y-3">  
          <li><Link to="/privacy" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Privacy</Link></li>  
          <li><Link to="/terms" className="text-[13px] md:text-sm text-slate-400 hover:text-white transition-colors">Terms</Link></li>  
        </ul>  
      </div>  

      <div className="md:col-span-3">  
        <div className="bg-black/80 border border-white/10 rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:border-mora-500/30 transition-colors shadow-xl">  
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-mora-500 to-transparent opacity-70"></div>  
              
            <h3 className="text-white font-bold text-[11px] md:text-sm uppercase tracking-wider flex items-center gap-2 mb-2">  
                <Zap size={12} className="text-mora-500 fill-mora-500" /> Newsletter  
            </h3>  
              
            <p className="text-[10px] md:text-[11px] text-slate-400 mb-3 leading-relaxed font-medium">  
                New APIs in the ecosystem.  
            </p>  
              
            <form onSubmit={handleNewsletterSubmit} className="relative">
  <input type="hidden" name="_subject" value="New Newsletter Subscription - Apives" />
{newsletterSuccess && (
  <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1">
    <Check size={12} /> You’re subscribed. Welcome to Apives 🚀
  </p>
)} 
                <div className="relative group/input">  
                    <input   
                        type="email"   
                        name="email"  
                        placeholder="Email"   
                        required  
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-4 md:pl-5 pr-10 py-2 text-[10px] md:text-xs text-white focus:border-mora-500 focus:bg-black focus:outline-none transition-all placeholder-slate-600"  
                    />  
                    <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-mora-500 text-slate-400 hover:text-black rounded-full transition-all">  
                        <ArrowRight size={12} />  
                    </button>  
                </div>  
            </form>  
        </div>  
      </div>  

    </div>  

    <div className="mt-8 md:mt-10 border-t border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">  
      <p className="text-[12px] md:text-sm text-slate-500">  
        &copy; 2025 Apives Ecosystem  
      </p>  
      <p className="text-[12px] md:text-sm text-slate-500 flex items-center font-medium">  
        <span className="text-mora-400 mr-2">///</span> Global Digital Synapse  
      </p>  
    </div>  
  </div>  

  {/* Feedback Modal - Reduced Size */}  
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
          <h2 className="text-xl font-display font-bold text-white mb-1.5">Share Feedback</h2>  
          <p className="text-slate-400 text-xs">Help us refine the ecosystem.</p>  
        </div>  
          
        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
          <input type="hidden" name="_subject" value="User Feedback - Apives" />  
          <div className="space-y-1">  
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">Name</label>  
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
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">Feedback</label>  
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
    <Check size={14} /> Thanks! Your feedback really helps 💚
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