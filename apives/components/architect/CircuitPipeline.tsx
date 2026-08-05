import React from 'react';
import { Server } from 'lucide-react';

export const CircuitPipeline: React.FC = () => {
  const steps = [
    { step: '01', title: 'Idea', node: 'IN' },
    { step: '02', title: 'Requirements', node: 'REQ' },
    { step: '03', title: 'Endpoints', node: 'EP' },
    { step: '04', title: 'DB Schema', node: 'SQL' },
    { step: '05', title: 'Auth Security', node: 'SEC' },
    { step: '06', title: 'OpenAPI', node: 'SPEC' },
    { step: '07', title: 'Mock Server', node: 'SRV' },
    { step: '08', title: 'Testing', node: 'TEST' },
    { step: '09', title: 'Docs Ready', node: 'OUT' }
  ];

  return (
    <div className="mb-14 bg-dark-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mora-500/10 border border-mora-500/20 text-mora-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
          <Server size={12} /> Schema Circuit Architecture
        </div>
        <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Architecture Synthesis Pipeline</h2>
        <p className="text-xs text-slate-400 font-light">Automated compilation pipeline converting ideas into verified API specs.</p>
      </div>

      {/* Schema Connection Circuit Board */}
      <div className="relative py-4">
        <div className="hidden md:block absolute top-[28px] left-[4%] right-[4%] h-[2px] bg-gradient-to-r from-mora-500/20 via-mora-400/60 to-mora-500/20 z-0"></div>
        <div className="hidden md:block absolute top-[28px] left-[4%] right-[4%] h-[2px] bg-mora-400/30 blur-[2px] z-0"></div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 relative z-10">
          {steps.map((st) => (
            <div key={st.step} className="flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-xl bg-black border border-white/20 group-hover:border-mora-400 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-300 flex flex-col items-center justify-center relative mb-2.5 z-10">
                <span className="text-[9px] font-mono font-bold text-mora-400">{st.step}</span>
                <span className="text-[7px] font-mono text-slate-400 uppercase tracking-tighter">{st.node}</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-mora-500/80"></div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-mora-400/80"></div>
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-300 group-hover:text-mora-300 transition-colors">
                {st.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
