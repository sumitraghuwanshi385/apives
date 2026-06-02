'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FileJson, Code2, Copy, Download, Upload, Trash2, Clock,
  CheckCircle2, XCircle, Search, ChevronDown, ChevronRight,
  Activity, Braces
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BackButton } from "../components/BackButton";
import yaml from 'js-yaml';
import { useAuth } from '@/contexts/AuthContext'; // ← Real auth context

interface HistoryItem {
  id: string;
  timestamp: string;
  input: string;
  output: string;
  size: number;
  valid: boolean;
}

interface Stats {
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
  efficiencyScore: number;
}

const glassPill = "backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]";

const ApiResponseFormatterPage: React.FC = () => {
  const { user } = useAuth(); // Real authentication
  const isLoggedIn = !!user;

  const [jsonInput, setJsonInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [minifiedOutput, setMinifiedOutput] = useState('');
  const [yamlOutput, setYamlOutput] = useState('');
  const [rawOutput, setRawOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<{ message: string; line: number; column: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'pretty' | 'minified' | 'tree' | 'raw'>('pretty');
  const [searchTerm, setSearchTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Load History - Only for authenticated users
  useEffect(() => {
    if (!isLoggedIn) {
      setHistory([]);
      return;
    }
    const saved = localStorage.getItem('apives-json-formatter-history');
    if (saved) setHistory(JSON.parse(saved));
  }, [isLoggedIn]);

  const calculateStats = useCallback((obj: any): Stats => {
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
        const keysLen = Object.keys(node).length;
        totalKeys += keysLen;
        largestObject = Math.max(largestObject, keysLen);
        Object.values(node).forEach(val => traverse(val, currentDepth + 1));
      }
    };

    traverse(obj, 1);
    const str = JSON.stringify(obj);
    const complexityScore = Math.min(100, Math.max(15, 100 - (depth * 12) - (objects * 1.2)));
    const efficiencyScore = Math.round(100 - (str.length / 1024));

    return {
      totalKeys, objects, arrays, nodes, depth,
      characters: str.length,
      lines: str.split('\n').length,
      bytes: new Blob([str]).size,
      largestObject, largestArray,
      complexityScore: Math.round(complexityScore),
      efficiencyScore: Math.max(10, efficiencyScore)
    };
  }, []);

  const validateAndFormat = useCallback((input: string) => {
    if (!input.trim()) {
      resetState();
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      const minified = JSON.stringify(parsed);
      const yamlStr = yaml.dump(parsed);

      setFormattedOutput(pretty);
      setMinifiedOutput(minified);
      setYamlOutput(yamlStr);
      setRawOutput(input);
      setIsValid(true);
      setError(null);
      setStats(calculateStats(parsed));

      if (isLoggedIn) saveToHistory(input, pretty);
    } catch (err: any) {
      setIsValid(false);
      resetState(true);
      const lineMatch = err.message.match(/line (\d+)/i);
      const colMatch = err.message.match(/column (\d+)/i);
      setError({
        message: err.message,
        line: lineMatch ? parseInt(lineMatch[1]) : 1,
        column: colMatch ? parseInt(colMatch[1]) : 1
      });
    }
  }, [calculateStats, isLoggedIn]);

  const resetState = (keepError = false) => {
    setFormattedOutput('');
    setMinifiedOutput('');
    setYamlOutput('');
    setRawOutput('');
    setSearchTerm('');
    setMatchCount(0);
    if (!keepError) setError(null);
    setStats(null);
    setIsValid(null);
    setUploadedFilename(null);
  };

  const saveToHistory = (input: string, output: string) => {
    if (!isLoggedIn) return;
    const newItem: HistoryItem = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      input,
      output,
      size: new Blob([output]).size,
      valid: true
    };
    const updated = [newItem, ...history].slice(0, 15);
    setHistory(updated);
    localStorage.setItem('apives-json-formatter-history', JSON.stringify(updated));
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.json')) return;
    setUploadedFilename(file.name.replace('.json', ''));
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      validateAndFormat(text);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1600);
  };

  const downloadFile = (content: string, suffix: string, ext: string = 'json') => {
    if (!content) return;
    const base = uploadedFilename || 'api-response';
    const blob = new Blob([content], { type: ext === 'yaml' ? 'text/yaml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `\( {base} \){suffix}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setJsonInput('');
    resetState();
  };

  // Tree View
  const JsonTree = React.memo(({ data, searchTerm }: { data: any; searchTerm: string }) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['$']));

    const toggleExpand = (path: string) => {
      setExpanded(prev => {
        const newSet = new Set(prev);
        newSet.has(path) ? newSet.delete(path) : newSet.add(path);
        return newSet;
      });
    };

    const renderNode = (node: any, path = '$'): React.ReactNode => {
      if (node === null) return <span className="text-red-400">null</span>;
      if (typeof node === 'boolean') return <span className="text-mora-400">{node}</span>;
      if (typeof node === 'number') return <span className="text-emerald-400">{node}</span>;
      if (typeof node === 'string') return <span className="text-amber-400">"{node}"</span>;

      if (Array.isArray(node)) {
        const isOpen = expanded.has(path);
        return (
          <div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-mora-400 py-0.5" onClick={() => toggleExpand(path)}>
              {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              Array [{node.length}]
            </div>
            {isOpen && (
              <div className="pl-6 border-l border-white/10 ml-2 mt-1 space-y-1">
                {node.map((item: any, idx: number) => renderNode(item, `\( {path}[ \){idx}]`))}
              </div>
            )}
          </div>
        );
      }

      if (node && typeof node === 'object') {
        const isOpen = expanded.has(path);
        const entries = Object.entries(node);
        return (
          <div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-mora-400 py-0.5" onClick={() => toggleExpand(path)}>
              {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              Object {'{'}{entries.length}{'}'}
            </div>
            {isOpen && (
              <div className="pl-6 border-l border-white/10 ml-2 mt-1 space-y-1">
                {entries.map(([key, val]) => (
                  <div key={key} className="flex items-baseline gap-2">
                    <span className="text-violet-400">"{key}"</span>
                    <span className="text-white/50">:</span>
                    <div className="flex-1">{renderNode(val, `\( {path}. \){key}`)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      return null;
    };

    return <div className="font-mono text-sm leading-relaxed">{renderNode(data)}</div>;
  });

  const currentOutput = useMemo(() => {
    if (activeTab === 'pretty') return formattedOutput;
    if (activeTab === 'minified') return minifiedOutput;
    if (activeTab === 'raw') return rawOutput;
    return formattedOutput;
  }, [activeTab, formattedOutput, minifiedOutput, rawOutput]);

  // Search
  useEffect(() => {
    if (!searchTerm.trim() || !formattedOutput) {
      setMatchCount(0);
      return;
    }
    try {
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      setMatchCount((formattedOutput.match(regex) || []).length);
    } catch {
      setMatchCount(0);
    }
  }, [searchTerm, formattedOutput]);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
        {/* Compact Hero */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center justify-center p-2.5 bg-white/5 rounded-2xl mb-4">
            <FileJson size={32} className="text-mora-500" strokeWidth={1.6} />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-white mb-3">
            API Response <span className="text-mora-500">Formatter</span>
          </h1>
          <p className="text-base text-white/60 max-w-md">
            Format, validate, analyze and debug JSON API responses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* INPUT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <Braces size={22} className="text-mora-500" />
                </div>
                <h2 className="text-xl font-semibold">JSON Input</h2>
              </div>

              <div className="flex gap-2 mb-4 text-xs">
                <div className="bg-white/5 px-3 py-1 rounded-full">Chars: {jsonInput.length}</div>
                <div className="bg-white/5 px-3 py-1 rounded-full">Lines: {jsonInput.split('\n').length}</div>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                onBlur={() => validateAndFormat(jsonInput)}
                className="w-full h-80 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y"
                placeholder="Paste JSON, API response, GraphQL response, webhook payload, or upload a .json file..."
              />

              <div className="flex gap-2 mt-5">
                <button 
                  onClick={() => document.getElementById('json-upload')?.click()} 
                  className={glassPill}
                >
                  <Upload size={16} className="mr-1.5" /> Upload
                </button>
                <button 
                  onClick={handleClear} 
                  className={`${glassPill} text-red-400`}
                >
                  Clear
                </button>
              </div>
              <input id="json-upload" type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            </div>
          </div>

          {/* OUTPUT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <Code2 size={22} className="text-mora-500" />
                </div>
                <h2 className="text-xl font-semibold">Formatted Output</h2>
              </div>

              {/* Compact Tabs */}
              <div className="flex bg-white/5 rounded-2xl p-1 mb-5 overflow-x-auto">
                {(['pretty', 'minified', 'tree', 'raw'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 text-sm rounded-xl transition-all whitespace-nowrap flex-1 ${activeTab === tab ? 'bg-white text-black' : 'hover:bg-white/10'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {isValid !== null && (
                <div className={`mb-5 p-4 rounded-2xl flex gap-3 ${isValid ? 'bg-mora-500/10 border border-mora-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  {isValid ? <CheckCircle2 className="text-mora-400" size={22} /> : <XCircle className="text-red-400" size={22} />}
                  <div>
                    <div className="font-medium">{isValid ? 'Valid JSON' : 'Invalid JSON'}</div>
                    {error && <div className="text-xs text-red-400 mt-1">Line {error.line}, Col {error.column}: {error.message}</div>}
                  </div>
                </div>
              )}

              {isValid && (
                <div className="mb-5 bg-black border border-white/10 rounded-full px-5 py-3 flex items-center">
                  <Search size={17} className="text-white/40 mr-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search keys or values..."
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  {matchCount > 0 && <span className="text-xs text-white/50 ml-2">{matchCount} matches</span>}
                </div>
              )}

              <div className="bg-black border border-white/10 rounded-2xl min-h-[400px] overflow-auto">
                {currentOutput ? (
                  activeTab === 'tree' ? (
                    <div className="p-5"><JsonTree data={JSON.parse(formattedOutput || '{}')} searchTerm={searchTerm} /></div>
                  ) : activeTab === 'raw' ? (
                    <pre className="p-5 font-mono text-sm text-white whitespace-pre-wrap">{rawOutput}</pre>
                  ) : (
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '20px' }}>
                      {searchTerm ? <HighlightedJSON text={currentOutput} searchTerm={searchTerm} /> : currentOutput}
                    </SyntaxHighlighter>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center text-white/40 text-sm">Upload or paste JSON to begin</div>
                )}
              </div>

              {formattedOutput && (
                <div className="flex flex-wrap gap-2 mt-5">
                  <button onClick={() => copyToClipboard(formattedOutput, 'pretty')} className={glassPill}>{copiedType === 'pretty' ? '✓ Copied' : 'Copy'}</button>
                  <button onClick={() => downloadFile(formattedOutput, '-pretty')} className={glassPill}>↓ Pretty</button>
                  <button onClick={() => downloadFile(minifiedOutput, '-min')} className={glassPill}>↓ Minified</button>
                  <button onClick={() => downloadFile(yamlOutput, '', 'yaml')} className={glassPill}>↓ YAML</button>
                </div>
              )}
            </div>

            {/* Response Intelligence */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-5">
              <div className="flex items-center gap-3 mb-5">
                <Activity size={20} className="text-mora-500" />
                <h3 className="text-lg font-semibold">Response Intelligence</h3>
              </div>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="bg-black/60 rounded-2xl p-4">
                      <div className="text-xs text-white/50 tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-2xl font-semibold tabular-nums mt-1">{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/40 py-12 text-center">Format JSON to unlock insights</div>
              )}
            </div>
          </div>
        </div>

        {/* History - Only visible to authenticated users */}
        {isLoggedIn && history.length > 0 && (
          <div className="mt-16">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Clock size={18} className="text-mora-500" /> Recent Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map(item => (
                <div key={item.id} className="bg-[#070707] border border-white/10 rounded-3xl p-5">
                  <div className="text-xs text-white/50 mb-3">{new Date(item.timestamp).toLocaleString()}</div>
                  <div className="font-mono text-xs line-clamp-2 mb-4 text-white/70">{item.output.substring(0, 120)}...</div>
                  <div className="flex gap-2">
                    <button onClick={() => { setJsonInput(item.input); validateAndFormat(item.input); }} className={glassPill}>Load</button>
                    <button onClick={() => copyToClipboard(item.output, 'history')} className={glassPill}>Copy</button>
                    <button 
                      onClick={() => {
                        const filtered = history.filter(h => h.id !== item.id);
                        setHistory(filtered);
                        localStorage.setItem('apives-json-formatter-history', JSON.stringify(filtered));
                      }} 
                      className={`${glassPill} text-red-400`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HighlightedJSON = ({ text, searchTerm }: { text: string; searchTerm: string }) => {
  if (!searchTerm.trim()) return <>{text}</>;
  const regex = new RegExp(`(\( {searchTerm.replace(/[.*+?^ \){}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="bg-yellow-500/30 px-0.5 rounded">{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
      )}
    </>
  );
};

export default ApiResponseFormatterPage;