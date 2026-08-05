import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OpenApiViewerProps {
  openApiJson: string;
  openApiYaml: string;
  onCopy: (text: string, label: string) => void;
}

export const OpenApiViewer: React.FC<OpenApiViewerProps> = ({
  openApiJson,
  openApiYaml,
  onCopy,
}) => {
  const [format, setFormat] = useState<'json' | 'yaml'>('json');
  const [copied, setCopied] = useState(false);

  const content = format === 'json' ? openApiJson : openApiYaml;

  const handleCopy = () => {
    onCopy(content, `OpenAPI Spec (${format.toUpperCase()})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFormat('json')}
            className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition-colors ${
              format === 'json' ? 'bg-mora-500 text-black' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setFormat('yaml')}
            className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition-colors ${
              format === 'yaml' ? 'bg-mora-500 text-black' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            YAML
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            {copied ? <Check size={12} className="text-mora-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Spec'}</span>
          </button>
        </div>
      </div>

      <pre className="bg-black/80 border border-white/10 rounded-xl p-4 font-mono text-xs text-mora-300 overflow-x-auto max-h-[480px] leading-relaxed">
        {content}
      </pre>
    </div>
  );
};
