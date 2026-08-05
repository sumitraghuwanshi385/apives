import React, { useState } from 'react';
import { Package, Zap, Download, Copy } from 'lucide-react';
import { FrameworkCodePreview, SupportedFramework } from '../../services/backendGenerators/types';
import { downloadFile } from '../../utils/download';

interface BackendGeneratorProps {
  projectName: string;
  selectedFramework: SupportedFramework;
  setSelectedFramework: (fw: SupportedFramework) => void;
  activeFrameworkBackend: FrameworkCodePreview;
  onCopy: (text: string, label: string) => void;
  showToast: (msg: string) => void;
}

export const BackendGenerator: React.FC<BackendGeneratorProps> = ({
  projectName,
  selectedFramework,
  setSelectedFramework,
  activeFrameworkBackend,
  onCopy,
  showToast,
}) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);

  const frameworks: SupportedFramework[] = [
    'Express.js',
    'NestJS',
    'FastAPI',
    'Go Fiber',
    'Spring Boot',
    'Laravel',
    'ASP.NET Core'
  ];

  return (
    <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 space-y-5 animate-fade-in font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-mora-500/10 border border-mora-500/20 text-mora-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Package size={12} /> Multi-Framework Production Backend Generator
          </div>
          <h3 className="text-xl font-display font-extrabold text-white">Generate Production Backend</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5 font-sans">
            Select your target backend stack to generate production controllers, routes, models, middleware, docker, and swagger specs.
          </p>
        </div>

        {/* FRAMEWORK SELECTOR CHIPS */}
        <div className="flex flex-wrap gap-1.5">
          {frameworks.map((fw) => (
            <button
              key={fw}
              onClick={() => {
                setSelectedFramework(fw);
                setSelectedFileIdx(0);
                showToast(`Generated ${fw} production backend scaffold.`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedFramework === fw
                  ? 'bg-mora-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                  : 'bg-black border border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              {fw}
            </button>
          ))}
        </div>
      </div>

      {/* FRAMEWORK DESCRIPTION & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/60 border border-white/10 p-4 rounded-2xl">
        <div>
          <h4 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <Zap size={14} className="text-mora-500" /> {activeFrameworkBackend.framework} Architecture
          </h4>
          <p className="text-xs text-slate-400 font-sans mt-0.5">{activeFrameworkBackend.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const zipBundle = activeFrameworkBackend.files.map(f => `--- FILE: ${f.path} ---\n${f.content}\n\n`).join('');
              downloadFile(zipBundle, `${projectName.toLowerCase().replace(/\s+/g, '_')}_${selectedFramework.toLowerCase().replace(/\s+/g, '')}_backend.txt`, 'text/plain');
            }}
            className="bg-mora-500 hover:bg-mora-400 text-black font-mono font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Download size={13} /> Download Backend Package
          </button>

          <button
            onClick={() => onCopy(activeFrameworkBackend.setupCommands.join('\n'), 'Setup Commands')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Copy size={12} /> Copy Setup Commands
          </button>
        </div>
      </div>

      {/* SETUP COMMANDS BANNER */}
      <div className="bg-black border border-white/10 rounded-xl p-3 font-mono text-xs space-y-1">
        <span className="text-[10px] text-slate-500 uppercase font-bold block">Terminal Quickstart Commands:</span>
        <pre className="text-mora-300 text-[11px] overflow-x-auto">
          {activeFrameworkBackend.setupCommands.join('\n')}
        </pre>
      </div>

      {/* ARTIFACT FILE CATEGORIES SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/60 border border-white/10 rounded-2xl p-3 space-y-1 font-mono text-xs max-h-96 overflow-y-auto">
          <span className="text-[10px] uppercase text-slate-500 block font-bold mb-2 px-2">Artifact Files ({activeFrameworkBackend.files.length})</span>
          {activeFrameworkBackend.files.map((file, idx) => (
            <button
              key={file.name + idx}
              onClick={() => setSelectedFileIdx(idx)}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between text-xs ${
                selectedFileIdx === idx
                  ? 'bg-mora-500/20 text-mora-300 font-bold border border-mora-500/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="truncate">{file.name}</span>
              <span className="text-[9px] text-slate-500 uppercase ml-1 shrink-0">{file.category.slice(0, 10)}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 bg-black border border-white/10 rounded-2xl p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div>
              <span className="text-white font-bold">{activeFrameworkBackend.files[selectedFileIdx]?.name}</span>
              <span className="text-slate-500 text-[10px] block font-mono">{activeFrameworkBackend.files[selectedFileIdx]?.path}</span>
            </div>
            <button
              onClick={() => onCopy(activeFrameworkBackend.files[selectedFileIdx]?.content || '', activeFrameworkBackend.files[selectedFileIdx]?.name || '')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-mora-400 hover:text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              <Copy size={12} /> Copy Code
            </button>
          </div>

          <pre className="text-mora-400 overflow-x-auto max-h-[380px] leading-relaxed text-[11px]">
            {activeFrameworkBackend.files[selectedFileIdx]?.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
