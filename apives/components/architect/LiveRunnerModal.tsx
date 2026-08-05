import React, { useState } from 'react';
import { Play, RefreshCw, Copy, Check } from 'lucide-react';
import { ArchitectProject, EndpointSpec } from '../../services/architectEngine';

interface LiveRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ArchitectProject | null;
  onCopy: (text: string, label: string) => void;
}

export const LiveRunnerModal: React.FC<LiveRunnerModalProps> = ({
  isOpen,
  onClose,
  project,
  onCopy,
}) => {
  if (!isOpen || !project) return null;

  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(
    project.endpoints[0]?.id || ''
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedEndpoint: EndpointSpec | undefined = project.endpoints.find(
    ep => ep.id === selectedEndpointId
  ) || project.endpoints[0];

  const handleRunRequest = () => {
    if (!selectedEndpoint) return;
    setIsLoading(true);
    setResponse(null);

    setTimeout(() => {
      setIsLoading(false);
      setResponse({
        status: 200,
        statusText: 'OK (Mock Server)',
        timeMs: Math.floor(Math.random() * 45) + 12,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-apives-mock-engine': 'v2.0-live-runner',
          'cache-control': 'no-cache, no-store'
        },
        data: selectedEndpoint.responseBody || { ok: true, message: 'Execution succeeded' }
      });
    }, 600);
  };

  const handleCopyJson = () => {
    if (!response) return;
    onCopy(JSON.stringify(response.data, null, 2), 'Response Payload');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border border-mora-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Play size={18} className="text-mora-500" />
            <h3 className="text-base font-display font-bold text-white">Live API Runner &amp; Mock Server</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-white/5 rounded"
          >
            Close ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase">Select Target Endpoint</label>
          <select
            value={selectedEndpointId}
            onChange={(e) => setSelectedEndpointId(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:border-mora-500 focus:outline-none"
          >
            {project.endpoints.map(ep => (
              <option key={ep.id} value={ep.id}>
                {ep.method} {ep.path} - {ep.description.slice(0, 45)}...
              </option>
            ))}
          </select>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleRunRequest}
              disabled={isLoading}
              className="bg-mora-500 hover:bg-mora-400 text-black font-mono font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
              <span>{isLoading ? 'Executing Request...' : 'Send Test Request'}</span>
            </button>
          </div>
        </div>

        {response && (
          <div className="bg-black border border-white/10 rounded-2xl p-4 space-y-3 font-mono text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-mora-500/20 text-mora-400 border border-mora-500/40 px-2 py-0.5 rounded font-bold">
                  {response.status} {response.statusText}
                </span>
                <span className="text-slate-400 text-[11px]">{response.timeMs}ms latency</span>
              </div>
              <button
                onClick={handleCopyJson}
                className="text-mora-400 hover:text-white text-[11px] flex items-center gap-1 transition-colors"
              >
                {copied ? <Check size={11} className="text-mora-400" /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-500 block">Response Headers</span>
              <div className="bg-white/[0.02] p-2 rounded text-slate-400 text-[10px]">
                {Object.entries(response.headers).map(([k, v]) => (
                  <div key={k}>{k}: {String(v)}</div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-500 block">Response Payload</span>
              <pre className="text-mora-400 overflow-x-auto max-h-60 leading-relaxed text-[11px]">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
