import React from 'react';
import { Terminal } from 'lucide-react';
import { EXAMPLE_PROMPT_LIBRARY } from '../../services/architectEngine';

interface ExampleLibraryProps {
  onSelectTemplate: (prompt: string) => void;
}

export const ExampleLibrary: React.FC<ExampleLibraryProps> = ({ onSelectTemplate }) => {
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Example Prompt Library</h2>
          <p className="text-xs text-slate-400 font-light">Select a pre-architected industry template to instantly prefill workspace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {EXAMPLE_PROMPT_LIBRARY.map((item) => (
          <div
            key={item.title}
            onClick={() => onSelectTemplate(item.prompt)}
            className="bg-black/60 border border-white/10 hover:border-mora-500/40 rounded-2xl p-3.5 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:bg-black group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono bg-mora-500/10 text-mora-400 border border-mora-500/20 px-2 py-0.5 rounded-full uppercase font-bold">
                  {item.category}
                </span>
                <Terminal size={12} className="text-slate-600 group-hover:text-mora-400 transition-colors" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1 group-hover:text-mora-300 transition-colors">{item.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono line-clamp-2 leading-relaxed">
                {item.prompt.split('\n').join(' • ')}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono text-mora-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Load Template →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
