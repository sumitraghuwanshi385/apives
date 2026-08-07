import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, ArrowUp, ArrowDown, GripVertical, RotateCcw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { EndpointSpec } from '../../services/architectEngine';

interface EndpointCardsProps {
  endpoints: EndpointSpec[];
  onCopy: (text: string, label: string) => void;
}

export const EndpointCards: React.FC<EndpointCardsProps> = ({ endpoints, onCopy }) => {
  const [orderedEndpoints, setOrderedEndpoints] = useState<EndpointSpec[]>(endpoints);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setOrderedEndpoints(endpoints);
  }, [endpoints]);

  const toggleEndpointExpand = (id: string) => {
    setExpandedEndpoints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const moveEndpoint = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedEndpoints.length) return;

    const list = [...orderedEndpoints];
    const [moved] = list.splice(index, 1);
    list.splice(newIndex, 0, moved);
    setOrderedEndpoints(list);
  };

  const resetOrder = () => {
    setOrderedEndpoints(endpoints);
  };

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    POST: 'bg-mora-500/20 text-mora-400 border-mora-500/40',
    PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/40',
    PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
  };

  const handleCopy = (ep: EndpointSpec, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${ep.method} ${ep.path}`;
    onCopy(text, ep.path);
    setCopiedId(ep.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isReordered = JSON.stringify(orderedEndpoints.map(e => e.id)) !== JSON.stringify(endpoints.map(e => e.id));

  return (
    <div className="space-y-4">
      {/* FLOW VISUALIZER TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-black/60 border border-white/10 rounded-2xl p-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-mora-400" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Endpoint Flow Visualizer ({orderedEndpoints.length})
          </span>
          <span className="hidden sm:inline-block text-[10px] text-slate-400 font-sans border-l border-white/10 pl-2">
            Tactile Framer Motion layout reordering enabled
          </span>
        </div>

        {isReordered && (
          <button
            onClick={resetOrder}
            className="self-start sm:self-auto bg-white/5 hover:bg-white/10 border border-white/10 text-mora-300 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
          >
            <RotateCcw size={11} /> Reset Order
          </button>
        )}
      </div>

      {/* ENDPOINT CARDS CONTAINER WITH FRAMER MOTION LAYOUT */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {orderedEndpoints.map((ep, index) => {
            const isExpanded = expandedEndpoints[ep.id] ?? true;

            return (
              <motion.div
                key={ep.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 26,
                  mass: 0.8
                }}
                className="bg-dark-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md"
              >
                {/* CARD HEADER */}
                <div
                  onClick={() => toggleEndpointExpand(ep.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {/* REORDER BUTTONS */}
                    <div className="flex items-center gap-0.5 bg-black/50 border border-white/10 rounded-lg p-0.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        disabled={index === 0}
                        onClick={(e) => moveEndpoint(index, 'up', e)}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          index === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-mora-400'
                        }`}
                        title="Move Up in Execution Flow"
                      >
                        <ArrowUp size={11} />
                      </button>
                      <span className="text-[9px] font-mono font-bold text-slate-500 px-1">{index + 1}</span>
                      <button
                        disabled={index === orderedEndpoints.length - 1}
                        onClick={(e) => moveEndpoint(index, 'down', e)}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          index === orderedEndpoints.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-mora-400'
                        }`}
                        title="Move Down in Execution Flow"
                      >
                        <ArrowDown size={11} />
                      </button>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${methodColors[ep.method] || 'bg-slate-500/20 text-slate-300'}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs md:text-sm text-white font-bold">{ep.path}</span>
                    {ep.authRequired && (
                      <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                        AUTH
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopy(ep, e)}
                      title="Copy Endpoint"
                      className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center backdrop-blur-sm"
                    >
                      {copiedId === ep.id ? <Check size={11} className="text-mora-400" /> : <Copy size={11} />}
                    </button>
                    {isExpanded ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                  <div className="p-4 border-t border-white/5 bg-black/40 space-y-3.5 text-xs font-mono">
                    <p className="text-slate-300 font-sans text-xs md:text-sm">{ep.description}</p>

                    {/* HEADERS */}
                    {ep.headers && Object.keys(ep.headers).length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block mb-1 font-bold">Request Headers</span>
                        <div className="bg-black border border-white/10 rounded-xl p-2.5 text-slate-300">
                          {Object.entries(ep.headers).map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b border-white/5 py-1 last:border-none">
                              <span className="text-mora-400">{k}:</span>
                              <span className="text-slate-400">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* REQUEST BODY IF PRESENT */}
                    {ep.requestBody && (
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block mb-1 font-bold">Request Payload Example</span>
                        <pre className="bg-black border border-white/10 rounded-xl p-2.5 text-slate-300 overflow-x-auto text-[11px]">
                          {JSON.stringify(ep.requestBody, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* RESPONSE BODY */}
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block mb-1 font-bold">Response Body Example (200 OK)</span>
                      <pre className="bg-black border border-white/10 rounded-xl p-2.5 text-mora-400 overflow-x-auto text-[11px]">
                        {JSON.stringify(ep.responseBody, null, 2)}
                      </pre>
                    </div>

                    {/* STATUS CODES */}
                    {ep.statusCodes && ep.statusCodes.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block mb-1 font-bold">Status Codes</span>
                        <div className="flex flex-wrap gap-2">
                          {ep.statusCodes.map((sc) => (
                            <span key={sc.code} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 text-[11px]">
                              <strong className="text-mora-400">{sc.code}</strong> - {sc.description}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

