import React from 'react';
import { Wand2, Keyboard, RefreshCw } from 'lucide-react';
import { SMART_CHIPS } from '../../services/architectEngine';

interface PromptWorkspaceProps {
  promptText: string;
  setPromptText: (val: string) => void;
  onClearText: () => void;
  onChipClick: (chip: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStep: number;
}

export const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({
  promptText,
  setPromptText,
  onClearText,
  onChipClick,
  onGenerate,
  isGenerating,
  generationStep,
}) => {
  return (
    <div className="bg-dark-900/80 border border-white/10 hover:border-mora-500/40 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 relative group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-mora-500 via-mora-400 to-transparent opacity-80"></div>
      
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Wand2 size={14} className="text-mora-500" />
          Describe API System Architecture
        </label>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            <Keyboard size={10} /> Ctrl+Enter to generate
          </span>
          {promptText && (
            <button 
              onClick={onClearText}
              className="text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1"
            >
              Clear Text (Ctrl+K)
            </button>
          )}
        </div>
      </div>

      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        placeholder="e.g. Build an enterprise API for HR Management System. Include employee directory, leave management workflows, payroll integration & RBAC permissions..."
        className="w-full h-40 bg-black/80 border border-white/10 rounded-2xl p-4 text-slate-100 placeholder-slate-600 font-mono text-xs md:text-sm focus:outline-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500 transition-all leading-relaxed resize-none"
      />

      {/* QUICK SMART CHIPS */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap">Insert Spec:</span>
        {SMART_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onChipClick(chip)}
            className="bg-white/5 hover:bg-mora-500/20 text-slate-300 hover:text-mora-300 border border-white/10 hover:border-mora-500/40 text-[10px] font-mono px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
          >
            + {chip}
          </button>
        ))}
      </div>

      {/* GENERATE SUBMIT ACTION */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
        <div className="text-[11px] font-mono text-slate-400">
          {promptText ? `${promptText.length} characters entered` : 'Ready to compile architecture'}
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !promptText.trim()}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 ${
            isGenerating || !promptText.trim()
              ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              : 'bg-gradient-to-r from-mora-500 to-mora-400 text-black hover:from-mora-400 hover:to-mora-300 shadow-mora-500/20 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} className="animate-spin text-black" />
              <span>
                {generationStep === 1 && 'Parsing Natural Language Requirements...'}
                {generationStep === 2 && 'Synthesizing OpenAPI 3.1 & Entities...'}
                {generationStep === 3 && 'Compiling Controllers & Code Generators...'}
                {generationStep === 4 && 'Finalizing Production Architecture...'}
                {generationStep === 0 && 'Processing...'}
              </span>
            </>
          ) : (
            <>
              <Wand2 size={16} />
              <span>Generate API Architecture</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
