'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Server, Copy, Download, Upload, Trash2, Clock, Plus, 
  CheckCircle2, XCircle, Search, Zap, Filter 
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

interface HistoryItem {
  id: string;
  timestamp: string;
  endpoint: MockEndpoint;
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
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Auth check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("mora_user");
    setIsLoggedIn(!!user);
  }, []);

  // Load data
  useEffect(() => {
    const savedEndpoints = localStorage.getItem('apives-mock-endpoints');
    if (savedEndpoints) setEndpoints(JSON.parse(savedEndpoints));

    if (isLoggedIn) {
      const savedHistory = localStorage.getItem('apives-mock-history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    }
  }, [isLoggedIn]);

  const saveEndpoints = (updated: MockEndpoint[]) => {
    setEndpoints(updated);
    localStorage.setItem('apives-mock-endpoints', JSON.stringify(updated));
  };

  const saveHistory = (endpoint: MockEndpoint) => {
    if (!isLoggedIn) return;
    const newHistory: HistoryItem = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      endpoint
    };
    const updated = [newHistory, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('apives-mock-history', JSON.stringify(updated));
  };

  const createEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.path) return;

    try {
      JSON.parse(newEndpoint.response);
    } catch {
      alert("Invalid JSON in response");
      return;
    }

    const endpoint: MockEndpoint = {
      id: Date.now().toString(36),
      ...newEndpoint,
      path: newEndpoint.path.startsWith('/') ? newEndpoint.path : '/' + newEndpoint.path,
      timestamp: new Date().toISOString()
    };

    // Prevent duplicates
    if (endpoints.some(e => e.method === endpoint.method && e.path === endpoint.path)) {
      alert("Endpoint with same method and path already exists");
      return;
    }

    const updated = [endpoint, ...endpoints];
    saveEndpoints(updated);
    setActiveEndpoint(endpoint);
    saveHistory(endpoint);

    // Reset form
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

  const loadEndpoint = (endpoint: MockEndpoint) => {
    setActiveEndpoint(endpoint);
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const downloadCode = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateMockUrl = (endpoint: MockEndpoint) => {
    return `https://apives.com/mock/\( {endpoint.id} \){endpoint.path}`;
  };

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           e.path.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterMethod === 'All' || e.method === filterMethod;
      return matchesSearch && matchesFilter;
    });
  }, [endpoints, searchTerm, filterMethod]);

  const templates = [
    { name: "User List", json: JSON.stringify({ users: [{ id: 1, name: "John Doe", email: "john@example.com" }] }, null, 2) },
    { name: "Product List", json: JSON.stringify({ products: [{ id: "p1", name: "Wireless Headphones", price: 299.99 }] }, null, 2) },
    { name: "Auth Success", json: JSON.stringify({ success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }, null, 2) },
  ];

  const loadTemplate = (template: any) => {
    setNewEndpoint(prev => ({ ...prev, response: template.json }));
  };

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
            Create realistic mock APIs with dynamic data, error simulation, and instant sharing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CREATE PANEL */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-2xl">
                  <Plus size={24} className="text-mora-500" />
                </div>
                <h2 className="text-2xl font-semibold">Create Mock Endpoint</h2>
              </div>

              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Endpoint Name"
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint({...newEndpoint, name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newEndpoint.method}
                    onChange={(e) => setNewEndpoint({...newEndpoint, method: e.target.value})}
                    className="bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  <select
                    value={newEndpoint.statusCode}
                    onChange={(e) => setNewEndpoint({...newEndpoint, statusCode: parseInt(e.target.value)})}
                    className="bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-mora-500 outline-none"
                  >
                    {[200,201,204,400,401,403,404,429,500].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="/api/users"
                  value={newEndpoint.path}
                  onChange={(e) => setNewEndpoint({...newEndpoint, path: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm font-mono focus:border-mora-500 outline-none"
                />

                <textarea
                  value={newEndpoint.response}
                  onChange={(e) => setNewEndpoint({...newEndpoint, response: e.target.value})}
                  className="w-full h-64 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y"
                  placeholder="Response JSON..."
                />

                <button
                  onClick={createEndpoint}
                  disabled={!newEndpoint.name || !newEndpoint.path}
                  className="w-full bg-mora-500 hover:bg-mora-600 disabled:bg-white/10 text-black font-semibold py-3.5 rounded-2xl transition-all"
                >
                  Create Endpoint
                </button>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <h3 className="font-medium mb-4">Quick Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t, i) => (
                  <button key={i} onClick={() => loadTemplate(t)} className={glassPill + " text-left text-sm py-3"}>{t.name}</button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 space-y-6">
            {activeEndpoint ? (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs bg-mora-500/10 text-mora-400 rounded-full">{activeEndpoint.method}</span>
                      <span className="font-mono text-sm">{activeEndpoint.path}</span>
                    </div>
                    <div className="text-xl font-semibold mt-2">{activeEndpoint.name}</div>
                  </div>
                  <button onClick={() => setActiveEndpoint(null)} className="text-red-400">Close</button>
                </div>

                <div className="bg-black rounded-2xl p-5 mb-6 border border-white/10">
                  <div className="text-xs text-white/50 mb-2">MOCK URL</div>
                  <div className="font-mono text-sm text-mora-400 break-all">{generateMockUrl(activeEndpoint)}</div>
                </div>

                <div>
                  <div className="font-medium mb-3">Response Preview</div>
                  <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '20px' }}>
                      {activeEndpoint.response}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button onClick={() => copyToClipboard(generateMockUrl(activeEndpoint), 'url')} className={glassPill}>
                    {copied === 'url' ? '✓ Copied URL' : 'Copy URL'}
                  </button>
                  <button onClick={() => copyToClipboard(activeEndpoint.response, 'json')} className={glassPill}>
                    {copied === 'json' ? '✓ Copied' : 'Copy JSON'}
                  </button>
                  <button onClick={() => downloadCode(activeEndpoint.response, `${activeEndpoint.name}.json`)} className={glassPill}>Download JSON</button>
                </div>
              </div>
            ) : (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-12 text-center text-white/40">
                Select an endpoint or create a new one
              </div>
            )}

            {/* Endpoints List */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-semibold">Mock Endpoints</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black border border-white/10 rounded-full px-4 py-2 text-sm w-64"
                  />
                  <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="bg-black border border-white/10 rounded-full px-4 py-2 text-sm">
                    <option value="All">All</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredEndpoints.length > 0 ? filteredEndpoints.map(ep => (
                  <div key={ep.id} className="flex items-center justify-between bg-black/60 hover:bg-black/80 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all group" onClick={() => loadEndpoint(ep)}>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-white/10">{ep.method}</span>
                      <div>
                        <div className="font-medium">{ep.name}</div>
                        <div className="font-mono text-xs text-white/50">{ep.path}</div>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteEndpoint(ep.id); }} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-16 text-white/40">No endpoints found</div>
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