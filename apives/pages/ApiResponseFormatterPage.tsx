'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FileJson, Code2, Copy, Download, Upload, Trash2, Clock, 
  CheckCircle2, XCircle, Search, ChevronDown, ChevronRight, 
  Zap, Activity 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import yaml from 'js-yaml';

const MoraColor = 'text-mora-500';

interface HistoryItem {
  id: string;
  timestamp: string;
  input: string;
  output: string;
  size: number;
  valid: boolean;
  name?: string;
}

interface JsonStats {
  totalKeys: number;
  objects: number;
  arrays: number;
  nodes: number;
  depth: number;
  characters: number;
  lines: number;
  bytes: number;
  largestObject: number;
  largestArray: number;
  complexityScore: number;
}

const BackButton = () => (
  <button 
    onClick={() => window.history.back()}
    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-medium transition-all active:scale-95"
  >
    ← Back to Tools
  </button>
);

const ApiResponseFormatterPage: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [formattedOutput, setFormattedOutput] = useState<string>('');
  const [minifiedOutput, setMinifiedOutput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<{ message: string; line: number; column: number } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'pretty' | 'minified' | 'tree' | 'raw'>('pretty');
  const [searchTerm, setSearchTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [stats, setStats] = useState<JsonStats | null>(null);
  const [filename, setFilename] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [jsonA, setJsonA] = useState('');
  const [jsonB, setJsonB] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('apives-json-formatter-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = useCallback((input: string, output: string, valid: boolean) => {
    const item: HistoryItem = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      input,
      output,
      size: new Blob([output]).size,
      valid,
      name: `Session ${history.length + 1}`
    };
    const updated = [item, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('apives-json-formatter-history', JSON.stringify(updated));
  }, [history]);

  const validateAndFormat = useCallback((input: string) => {
    if (!input.trim()) {
      resetState();
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      const minified = JSON.stringify(parsed);

      setFormattedOutput(pretty);
      setMinifiedOutput(minified);
      setIsValid(true);
      setError(null);

      const calculatedStats = calculateStats(parsed);
      setStats(calculatedStats);
      saveToHistory(input, pretty, true);
    } catch (err: any) {
      setIsValid(false);
      setFormattedOutput('');
      setMinifiedOutput('');
      setStats(null);

      const lineMatch = err.message.match(/line (\d+)/i);
      const colMatch = err.message.match(/column (\d+)/i);

      setError({
        message: err.message,
        line: lineMatch ? parseInt(lineMatch[1]) : 1,
        column: colMatch ? parseInt(colMatch[1]) : 1
      });
    }
  }, [saveToHistory]);

  const calculateStats = (obj: any): JsonStats => {
    let totalKeys = 0, objects = 0, arrays = 0, nodes = 0, depth = 0;
    let largestObject = 0, largestArray = 0;

    const traverse = (node: any, currentDepth: number) => {
      nodes++;
      depth = Math.max(depth, currentDepth);

      if (Array.isArray(node)) {
        arrays++;
        largestArray = Math.max(largestArray, node.length);
        node.forEach(item => traverse(item, currentDepth + 1));
      } else if (node && typeof node === 'object') {
        objects++;
        const keys = Object.keys(node);
        totalKeys += keys.length;
        largestObject = Math.max(largestObject, keys.length);
        Object.values(node).forEach(val => traverse(val, currentDepth + 1));
      }
    };

    traverse(obj, 1);

    const str = JSON.stringify(obj);
    const complexityScore = Math.max(10, Math.min(100, 
      Math.floor(100 - (depth * 8) - (objects * 0.8))
    ));

    return {
      totalKeys, objects, arrays, nodes, depth,
      characters: str.length,
      lines: str.split('\n').length,
      bytes: new Blob([str]).size,
      largestObject, largestArray,
      complexityScore
    };
  };

  const resetState = () => {
    setFormattedOutput('');
    setMinifiedOutput('');
    setIsValid(null);
    setError(null);
    setStats(null);
  };

  // File Upload + Drag & Drop
  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json')) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      validateAndFormat(text);
    };
    reader.readAsText(file);
  };

  // Tree View with Proper JSON Paths
  const JsonTree = ({ data }: { data: any }) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['$']));

    const toggle = (path: string) => {
      const newSet = new Set(expanded);
      if (newSet.has(path)) newSet.delete(path);
      else newSet.add(path);
      setExpanded(newSet);
    };

    const renderNode = (node: any, path: string = '$', level: number = 0) => {
      if (node === null) return <span className="text-red-400">null</span>;
      if (typeof node === 'boolean') return <span className="text-mora-400">{node.toString()}</span>;
      if (typeof node === 'number') return <span className="text-emerald-400">{node}</span>;
      if (typeof node === 'string') return <span className="text-amber-400">"{node}"</span>;

      if (Array.isArray(node)) {
        const isOpen = expanded.has(path);
        return (
          <div>
            <div onClick={() => toggle(path)} className="cursor-pointer flex items-center gap-1 hover:text-mora-400">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>Array [{node.length}]</span>
            </div>
            {isOpen && <div className="pl-6 border-l border-white/10 ml-2 mt-1">
              {node.map((item, i) => renderNode(item, `\( {path}[ \){i}]`, level + 1))}
            </div>}
          </div>
        );
      }

      if (node && typeof node === 'object') {
        const isOpen = expanded.has(path);
        return (
          <div>
            <div onClick={() => toggle(path)} className="cursor-pointer flex items-center gap-1 hover:text-mora-400">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>Object {'{'}{Object.keys(node).length}{'}'}</span>
            </div>
            {isOpen && <div className="pl-6 border-l border-white/10 ml-2 mt-1">
              {Object.entries(node).map(([key, value]) => (
                <div key={key} className="py-1">
                  <span className="text-violet-400">"{key}"</span>: {renderNode(value, `\( {path}. \){key}`, level + 1)}
                </div>
              ))}
            </div>}
          </div>
        );
      }
      return null;
    };

    return <div className="font-mono text-sm leading-relaxed">{renderNode(data)}</div>;
  };

  const currentOutput = activeTab === 'pretty' ? formattedOutput : 
                       activeTab === 'minified' ? minifiedOutput : formattedOutput;

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HERO */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
            <FileJson size={48} strokeWidth={1.4} />
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter text-white mb-4">
            API Response <span className={MoraColor}>Formatter</span>
          </h1>
          <p className="max-w-lg text-lg text-white/60">
            Professional-grade JSON formatting, validation, analysis, optimization and debugging toolkit for developers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* INPUT PANEL */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-white/5 rounded-2xl">
                  <FileJson size={24} />
                </div>
                <h2 className="text-2xl font-semibold">JSON Input</h2>
              </div>

              {/* Toolbar Chips */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <div className="text-xs bg-white/5 px-3 py-1 rounded-full">Characters: {jsonInput.length}</div>
                <div className="text-xs bg-white/5 px-3 py-1 rounded-full">Lines: {jsonInput.split('\n').length}</div>
                <div className={`text-xs px-3 py-1 rounded-full ${isValid ? 'bg-mora-500/10 text-mora-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isValid === null ? '—' : isValid ? 'Valid' : 'Invalid'}
                </div>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                onBlur={() => validateAndFormat(jsonInput)}
                className="w-full h-96 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y min-h-[380px] outline-none"
                placeholder="Paste your API response here..."
              />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <button onClick={() => validateAndFormat(jsonInput)} className="bg-mora-500 hover:bg-mora-600 text-black font-medium py-3 rounded-2xl transition-all">Format</button>
                <button onClick={() => setJsonInput(minifiedOutput || jsonInput)} className="border border-white/20 hover:bg-white/5 py-3 rounded-2xl">Minify</button>
                <button onClick={() => {/* Flatten logic */}} className="border border-white/20 hover:bg-white/5 py-3 rounded-2xl">Flatten</button>
                <button onClick={() => setJsonInput('')} className="border border-red-500/30 text-red-400 hover:bg-red-500/10 py-3 rounded-2xl">Clear</button>
              </div>
            </div>

            {/* Samples */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <h3 className="font-medium mb-4">Sample Responses</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {['User API', 'Product API', 'Payment API', 'Analytics API', 'Auth API', 'Error API'].map(name => (
                  <button key={name} className="text-left border border-white/10 hover:border-mora-500/50 p-4 rounded-2xl transition-all">
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* OUTPUT PANEL */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-2xl">
                    <Code2 size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold">Formatted Output</h2>
                </div>

                <div className="flex bg-white/5 rounded-2xl p-1 text-sm">
                  {(['pretty', 'minified', 'tree', 'raw'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-xl transition-all ${activeTab === tab ? 'bg-white text-black' : 'hover:bg-white/10'}`}
                    >
                      {tab === 'pretty' ? 'Pretty' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation Status */}
              {isValid !== null && (
                <div className={`mb-6 p-5 rounded-2xl flex gap-4 items-start ${isValid ? 'bg-mora-500/10 border border-mora-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  {isValid ? <CheckCircle2 className="text-mora-400 mt-0.5" size={24} /> : <XCircle className="text-red-400 mt-0.5" size={24} />}
                  <div>
                    <div className="font-semibold text-lg">{isValid ? 'Valid JSON' : 'Invalid JSON'}</div>
                    {error && <div className="text-sm mt-2 text-red-400">Line {error.line}, Column {error.column}: {error.message}</div>}
                  </div>
                </div>
              )}

              {/* Output Content */}
              <div className="bg-black border border-white/10 rounded-2xl overflow-hidden min-h-[460px]">
                {currentOutput ? (
                  activeTab === 'tree' ? (
                    <div className="p-6 overflow-auto h-full">
                      <JsonTree data={JSON.parse(formattedOutput)} />
                    </div>
                  ) : (
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={{ background: 'transparent', padding: '1.5rem', margin: 0 }}
                    >
                      {activeTab === 'minified' ? minifiedOutput : formattedOutput}
                    </SyntaxHighlighter>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-white/40">Output appears here after formatting</div>
                )}
              </div>

              {/* Output Actions */}
              {formattedOutput && (
                <div className="flex flex-wrap gap-3 mt-6">
                  <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-medium hover:bg-white/90">
                    <Copy size={18} /> Copy
                  </button>
                  <button onClick={() => {}} className="flex items-center gap-2 border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/5">
                    <Download size={18} /> Download
                  </button>
                </div>
              )}
            </div>

            {/* Statistics */}
            {stats && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-mora-400" />
                  <h3 className="text-xl font-semibold">Response Intelligence</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="bg-black/60 rounded-2xl p-5">
                      <div className="text-xs uppercase tracking-widest text-white/50 mb-1">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-3xl font-semibold tabular-nums">{typeof value === 'number' ? value : value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiResponseFormatterPage;