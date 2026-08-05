import React from 'react';
import { Cpu, Keyboard } from 'lucide-react';

interface HeroProps {
  onOpenShortcuts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenShortcuts }) => {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mora-500/10 border border-mora-500/30 text-mora-400 text-[11px] font-mono font-medium shadow-sm">
        <Cpu size={13} className="text-mora-400" />
        <span>AI-Powered Architecture</span>
        <button 
          onClick={onOpenShortcuts}
          className="ml-1 text-slate-400 hover:text-white flex items-center gap-1 border-l border-white/15 pl-1.5 text-[9px] py-0.2 focus:outline-none"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard size={9} /> Shortcuts (?)
        </button>
      </div>

      <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight mb-4 leading-tight">
        Apives <span className="text-transparent bg-clip-text bg-gradient-to-r from-mora-400 via-mora-500 to-mora-300">Architect</span>
      </h1>

      <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light">
        Design production-ready APIs with AI. Generate API architecture, OpenAPI specs, mock servers, documentation, request schemas and production code in one workspace.
      </p>
    </div>
  );
};
