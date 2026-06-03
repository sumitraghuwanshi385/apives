'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Server, Copy, Download, Upload, Trash2, Clock, Plus, 
  CheckCircle2, XCircle, Search, Zap 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BackButton } from "../components/BackButton";

interface MockEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  statusCode: number;
  delay: number;
  response: string;
  headers: Record<string, string>;
  timestamp: string;
}

const glassPill = "backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]";

const MockServerProPage: React.FC = () => {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [activeEndpoint, setActiveEndpoint] = useState<MockEndpoint | null>(null);
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    method: 'GET',
    path: '/api/',
    statusCode: 200,
    delay: 0,
    response: '{\n  "success": true,\n  "message": "Mock response from Apives"\n}',
    headers: { "Content-Type": "application/json" }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('apives-mock-endpoints');
    if (saved) setEndpoints(JSON.parse(saved));
  }, []);

  const saveEndpoints = (updated: MockEndpoint[]) => {
    setEndpoints(updated);
    localStorage.setItem('apives-mock-endpoints', JSON.stringify(updated));
  };

  const createEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.path) return;

    const endpoint: MockEndpoint = {
      id: Date.now().toString(36),
      name: newEndpoint.name,
      method: newEndpoint.method,
      path: newEndpoint.path.startsWith('/') ? newEndpoint.path : '/' + newEndpoint.path,
      statusCode: newEndpoint.statusCode,
      delay: newEndpoint.delay,
      response: newEndpoint.response,
      headers: newEndpoint.headers,
      timestamp: new Date().toISOString()
    };

    const updated = [endpoint, ...endpoints];
    saveEndpoints(updated);
    setActiveEndpoint(endpoint);
    setNewEndpoint({
      name: '',
      method: 'GET',
      path: '/api/',
      statusCode: 200,
      delay: 0,
      response: '{\n  "success": true,\n  "message": "Mock response from Apives"\n}',
      headers: { "Content-Type": "application/json" }
    });
  };

  const deleteEndpoint = (id: string) => {
    const updated = endpoints.filter(e => e.id !== id);
    saveEndpoints(updated);
    if (activeEndpoint?.id === id) setActiveEndpoint(null);
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const generateMockUrl = (endpoint: MockEndpoint) => {
    return `https://apives.com/mock/\( {endpoint.id} \){endpoint.path}`;
  };

  const filteredEndpoints = endpoints.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
            <Server size={42} className="text-mora-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-4">
            Mock Server <span className="text-mora-500">Pro</span>
          </h1>
          <p className="max-w-md text-lg text-white/60">
            Create production-ready mock APIs, simulate responses, test applications, and share endpoints instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL - CREATE */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-2xl">
                  <Plus size={24} className="text-mora-500" />
                </div>
                <h2 className="text-2xl font-semibold">Create Mock Endpoint</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Endpoint Name</label>
                  <input
                    type="text"
                    value={newEndpoint.name}
                    onChange={(e) => setNewEndpoint({...newEndpoint, name: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none"
                    placeholder="users"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 block mb-1.5">Method</label>
                    <select
                      value={newEndpoint.method}
                      onChange={(e) => setNewEndpoint({...newEndpoint, method: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-white/60 block mb-1.5">Status Code</label>
                    <select
                      value={newEndpoint.statusCode}
                      onChange={(e) => setNewEndpoint({...newEndpoint, statusCode: parseInt(e.target.value)})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none"
                    >
                      {[200,201,204,400,401,403,404,429,500].map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Path</label>
                  <input
                    type="text"
                    value={newEndpoint.path}
                    onChange={(e) => setNewEndpoint({...newEndpoint, path: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none font-mono"
                    placeholder="/api/users"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Response Delay (ms)</label>
                  <select
                    value={newEndpoint.delay}
                    onChange={(e) => setNewEndpoint({...newEndpoint, delay: parseInt(e.target.value)})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none"
                  >
                    {[0, 300, 500, 1000, 2000, 5000].map(ms => (
                      <option key={ms} value={ms}>{ms}ms</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-2">Response JSON</label>
                  <textarea
                    value={newEndpoint.response}
                    onChange={(e) => setNewEndpoint({...newEndpoint, response: e.target.value})}
                    className="w-full h-64 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y"
                  />
                </div>

                <button
                  onClick={createEndpoint}
                  disabled={!newEndpoint.name || !newEndpoint.path}
                  className="w-full bg-mora-500 hover:bg-mora-600 disabled:bg-white/10 text-black font-semibold py-3.5 rounded-2xl transition-all"
                >
                  Create Mock Endpoint
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 space-y-6">
            {activeEndpoint ? (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 text-xs rounded-full ${activeEndpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-mora-500/20 text-mora-400'}`}>
                        {activeEndpoint.method}
                      </div>
                      <div className="font-mono text-sm text-white/70">{activeEndpoint.path}</div>
                    </div>
                    <div className="text-2xl font-semibold mt-2">{activeEndpoint.name}</div>
                  </div>
                  <button onClick={() => setActiveEndpoint(null)} className="text-red-400 hover:text-red-500">Close</button>
                </div>

                <div className="bg-black rounded-2xl p-5 border border-white/10 mb-6">
                  <div className="text-xs text-white/50 mb-2">GENERATED URL</div>
                  <div className="font-mono text-sm break-all text-mora-400">{`https://apives.com/mock/\( {activeEndpoint.id} \){activeEndpoint.path}`}</div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-3">
                    <div className="font-medium">Response Preview</div>
                    <div className="text-xs text-white/50">Status {activeEndpoint.statusCode} • {activeEndpoint.delay}ms</div>
                  </div>
                  <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '20px' }}>
                      {activeEndpoint.response}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => copyToClipboard(activeEndpoint.response, 'response')} className={glassPill}>
                    {copied === 'response' ? '✓ Copied' : 'Copy Response'}
                  </button>
                  <button onClick={() => downloadCode(activeEndpoint.response, `${activeEndpoint.name}.json`)} className={glassPill}>Download JSON</button>
                </div>
              </div>
            ) : (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-6 h-[500px] flex items-center justify-center text-white/40">
                Select or create a mock endpoint to preview
              </div>
            )}

            {/* Endpoints List */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">My Mock Endpoints</h3>
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black border border-white/10 rounded-full px-4 py-2 text-sm w-64"
                />
              </div>

              <div className="space-y-3 max-h-[500px] overflow-auto pr-2">
                {filteredEndpoints.length > 0 ? (
                  filteredEndpoints.map(endpoint => (
                    <div 
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint)}
                      className="bg-black/60 hover:bg-black/80 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all flex justify-between items-center group"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2.5 py-1 bg-white/10 rounded-full">{endpoint.method}</span>
                          <span className="font-mono text-sm text-white/80">{endpoint.path}</span>
                        </div>
                        <div className="text-sm mt-1">{endpoint.name}</div>
                      </div>
                      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => { e.stopPropagation(); deleteEndpoint(endpoint.id); }} className="text-red-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/40">No endpoints yet. Create one above.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockServerProPage;