import React from 'react';
import { Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border border-mora-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-mora-500/20 border border-mora-500/40 flex items-center justify-center text-mora-400">
              <Keyboard size={16} />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">Keyboard Shortcuts</h3>
              <p className="text-[11px] font-mono text-slate-400">Apives Architect IDE Productivity Map</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {[
            { keys: ['Ctrl', 'Enter'], desc: 'Generate API Architecture from prompt' },
            { keys: ['Ctrl', 'K'], desc: 'Clear Workspace Prompt textarea' },
            { keys: ['Ctrl', 'L'], desc: 'Toggle Live API Runner & Mock Server' },
            { keys: ['?'], desc: 'Toggle Shortcut Cheat Sheet Overlay' },
            { keys: ['Esc'], desc: 'Close open overlay or confirmation modal' },
          ].map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5 hover:border-mora-500/30 transition-colors">
              <span className="text-slate-300 font-sans text-xs">{shortcut.desc}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map(k => (
                  <kbd key={k} className="px-2 py-1 rounded bg-white/10 border border-white/20 text-mora-400 font-bold text-[10px] shadow">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/10 text-center">
          <p className="text-[10px] font-mono text-slate-500">
            Press <kbd className="text-slate-300">Esc</kbd> anytime to dismiss this shortcut sheet.
          </p>
        </div>
      </div>
    </div>
  );
};
