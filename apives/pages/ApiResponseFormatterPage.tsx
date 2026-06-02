'use client';

import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import {
  FileJson, Code2, Copy, Download, Upload, Trash2, Clock,
  CheckCircle2, XCircle, Search, ChevronDown, ChevronRight,
  Activity, Zap
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BackButton } from "../components/BackButton";
import yaml from 'js-yaml';

// Types
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
}

// Glass Pill Style
const glassPill = "backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-mora-500/50";

// Highlight Component
const HighlightedJSON = ({ text, searchTerm }: { text: string; searchTerm: string }) => {
  if (!searchTerm.trim()) return <>{text}</>;
  const regex = new RegExp(`(\( {searchTerm.replace(/[.*+?^ \){}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-500/40 text-white rounded px-0.5">{part}</mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
};

// Tree View
const JsonTree = React.memo(({ data, searchTerm }: { data: any; searchTerm: string }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['$']));

  const toggleExpand = useCallback((path: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      return newSet;
    });
  }, []);

  const highlightText = useCallback((text: string): React.ReactNode => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(\( {searchTerm.replace(/[.*+?^ \){}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-500/40 text-white rounded px-0.5">{part}</mark> : part
    );
  }, [searchTerm]);

  const renderNode = useCallback((node: any, path: string = '$'): React.ReactNode => {
    if (node === null) return <span className="text-red-400">null</span>;
    if (typeof node === 'boolean') return <span className="text-mora-400">{highlightText(node.toString())}</span>;
    if (typeof node === 'number') return <span className="text-emerald-400">{highlightText(node.toString())}</span>;
    if (typeof node === 'string') return <span className="text-amber-400">"{highlightText(node)}"</span>;

    if (Array.isArray(node)) {
      const isOpen = expanded.has(path);
      return (
        <div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-mora-400 py-0.5" onClick={() => toggleExpand(path)}>
            {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            <span>Array [{node.length}]</span>
          </div>
          {isOpen && (
            <div className="pl-6 border-l border-white/10 ml-2 space-y-1">
              {node.map((item, idx) => renderNode(item, `\( {path}[ \){idx}]`))}
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
            <span>Object {'{'}{entries.length}{'}'}</span>
          </div>
          {isOpen && (
            <div className="pl-6 border-l border-white/10 ml-2 space-y-1">
              {entries.map(([key, val]) => (
                <div key={key} className="flex items-baseline gap-2">
                  <span className="text-violet-400">"{highlightText(key)}"</span>
                  <span className="text-white/50">:</span>
                  <div className="flex-1 min-w-0">{renderNode(val, `\( {path}. \){key}`)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  }, [expanded, searchTerm, highlightText, toggleExpand]);

  return <div className="font-mono text-[13px] leading-relaxed select-text">{renderNode(data)}</div>;
});
JsonTree.displayName = 'JsonTree';

const ApiResponseFormatterPage: React.FC = () => {
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
  const [showHistory, setShowHistory] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('apives-json-formatter-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

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

    return {
      totalKeys, objects, arrays, nodes, depth,
      characters: str.length,
      lines: str.split('\n').length,
      bytes: new Blob([str]).size,
      largestObject, largestArray,
      complexityScore: Math.round(complexityScore)
    };
  }, []);

  const validateAndFormat = useCallback((input: string) => {
    if (!input.trim()) {
      setFormattedOutput(''); setMinifiedOutput(''); setYamlOutput(''); setRawOutput('');
      setIsValid(null); setError(null); setStats(null);
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

      // Save to history (deduplicated)
      setHistory(prev => {
        if (prev[0]?.input === input) return prev;
        const newItem: HistoryItem = {
          id: Date.now().toString(36),
          timestamp: new Date().toISOString(),
          input,
          output: pretty,
          size: new Blob([pretty]).size,
          valid: true
        };
        const updated = [newItem, ...prev].slice(0, 20);
        localStorage.setItem('apives-json-formatter-history', JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      setIsValid(false);
      setFormattedOutput(''); setMinifiedOutput(''); setYamlOutput(''); setRawOutput('');
      setStats(null);

      const lineMatch = err.message.match(/line (\d+)/i);
      const colMatch = err.message.match(/column (\d+)/i);

      setError({
        message: err.message,
        line: lineMatch ? parseInt(lineMatch[1]) : 1,
        column: colMatch ? parseInt(colMatch[1]) : 1
      });
    }
  }, [calculateStats]);

  // Flatten JSON
  const flattenJson = useCallback((obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenJson(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  }, []);

  const handleFlatten = () => {
    if (!formattedOutput) return;
    const parsed = JSON.parse(formattedOutput);
    const flattened = flattenJson(parsed);
    const flattenedStr = JSON.stringify(flattened, null, 2);
    setJsonInput(flattenedStr);
    validateAndFormat(flattenedStr);
  };

  // File Upload
  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.json')) return;
    setUploadedFilename(file.name.replace('.json', ''));
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      validateAndFormat(text);
    };
    reader.readAsText(file);
  }, [validateAndFormat]);

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  }, []);

  const downloadFile = useCallback((content: string, suffix: string, ext: string = 'json') => {
    if (!content) return;
    const baseName = uploadedFilename || 'api-response';
    const blob = new Blob([content], { type: ext === 'yaml' ? 'text/yaml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `\( {baseName} \){suffix}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [uploadedFilename]);

  // Search match count
  useEffect(() => {
    if (!searchTerm || !formattedOutput) {
      setMatchCount(0);
      return;
    }
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    setMatchCount((formattedOutput.match(regex) || []).length);
  }, [searchTerm, formattedOutput]);

  // Sample Data (kept minimal)
  const loadSample = useCallback((type: string) => {
    const samples: Record<string, any> = {
      User: { id: 1, name: "Prince Gupta", email: "priiincegupta@example.com", role: "Developer" },
      Product: { id: "p123", name: "Premium Headphones", price: 299.99, inStock: true }
    };
    const sample = JSON.stringify(samples[type] || samples.User, null, 2);
    setJsonInput(sample);
    validateAndFormat(sample);
  }, [validateAndFormat]);

  const currentOutput = useMemo(() => {
    if (activeTab === 'pretty') return formattedOutput;
    if (activeTab === 'minified') return minifiedOutput;
    if (activeTab === 'raw') return rawOutput;
    return formattedOutput;
  }, [activeTab, formattedOutput, minifiedOutput, rawOutput]);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-mora-500/20 to-transparent rounded-3xl mb-6 shadow-xl shadow-mora-500/10">
            <FileJson size={48} className="text-mora-500" strokeWidth={1.4} />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-4">
            API Response <span className="text-mora-500">Formatter</span>
          </h1>
          <p className="max-w-md text-lg text-white/60">
            Professional JSON formatting, validation, analysis &amp; debugging toolkit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/5 rounded-2xl"><FileJson size={26} /></div>
                <h2 className="text-2xl font-semibold">JSON Input</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <div className="bg-white/5 px-3 py-1 rounded-full">Chars: {jsonInput.length}</div>
                <div className="bg-white/5 px-3 py-1 rounded-full">Lines: {jsonInput.split('\n').length}</div>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                onBlur={() => validateAndFormat(jsonInput)}
                className="w-full h-96 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y min-h-[320px] md:min-h-[420px]"
                placeholder="Paste your API response JSON here..."
              />

              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => validateAndFormat(jsonInput)} className={`${glassPill} bg-mora-500 text-black hover:bg-mora-600 font-semibold`}>Format JSON</button>
                <button onClick={handleFlatten} className={glassPill}>Flatten</button>
                <button onClick={() => document.getElementById('json-upload')?.click()} className={glassPill}>Upload JSON</button>
                <button onClick={() => { setJsonInput(''); setUploadedFilename(null); }} className={`${glassPill} text-red-400`}>Clear</button>
              </div>
              <input id="json-upload" type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-2xl"><Code2 size={26} /></div>
                  <h2 className="text-2xl font-semibold">Formatted Output</h2>
                </div>

                <div className="flex bg-white/5 rounded-3xl p-1 text-sm">
                  {(['pretty', 'minified', 'tree', 'raw'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-2xl transition-all ${activeTab === tab ? 'bg-white text-black' : 'hover:bg-white/10'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation Status */}
              {isValid !== null && (
                <div className={`mb-6 p-5 rounded-3xl flex gap-4 ${isValid ? 'bg-mora-500/10 border border-mora-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  {isValid ? <CheckCircle2 className="text-mora-400" size={28} /> : <XCircle className="text-red-400" size={28} />}
                  <div>
                    <div className="font-semibold">{isValid ? 'Valid JSON' : 'Invalid JSON'}</div>
                    {error && <div className="text-sm text-red-400 mt-1">Line {error.line}, Col {error.column}: {error.message}</div>}
                  </div>
                </div>
              )}

              {/* Search */}
              {isValid && (
                <div className="mb-6 relative">
                  <div className="flex items-center bg-black border border-white/10 rounded-full px-5 py-3">
                    <Search size={18} className="text-white/40 mr-3" />
                    <input
                      type="text"
                      placeholder="Search in JSON..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                    {matchCount > 0 && <span className="text-xs text-white/50">{matchCount} matches</span>}
                  </div>
                </div>
              )}

              {/* Output Display */}
              <div className="bg-black border border-white/10 rounded-2xl min-h-[420px] overflow-auto">
                {currentOutput ? (
                  activeTab === 'tree' ? (
                    <div className="p-6"><JsonTree data={JSON.parse(formattedOutput)} searchTerm={searchTerm} /></div>
                  ) : activeTab === 'raw' ? (
                    <pre className="p-6 font-mono text-sm whitespace-pre-wrap">{rawOutput}</pre>
                  ) : (
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '24px' }}>
                      {searchTerm ? <HighlightedJSON text={currentOutput} searchTerm={searchTerm} /> : currentOutput}
                    </SyntaxHighlighter>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-white/40 py-20">Format JSON to see result</div>
                )}
              </div>

              {/* Actions */}
              {formattedOutput && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-3 mt-6">
                  <button onClick={() => copyToClipboard(formattedOutput, 'pretty')} className={glassPill}>{copiedType === 'pretty' ? '✓ Copied' : 'Copy Pretty'}</button>
                  <button onClick={() => copyToClipboard(minifiedOutput, 'min')} className={glassPill}>{copiedType === 'min' ? '✓ Copied' : 'Copy Minified'}</button>
                  <button onClick={() => downloadFile(formattedOutput, '-pretty')} className={glassPill}>Download Pretty</button>
                  <button onClick={() => downloadFile(minifiedOutput, '-min')} className={glassPill}>Download Minified</button>
                  <button onClick={() => downloadFile(yamlOutput, '', 'yaml')} className={glassPill}>Download YAML</button>
                </div>
              )}
            </div>

            {/* Response Intelligence */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-mora-400" />
                <h3 className="text-xl font-semibold">Response Intelligence</h3>
              </div>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="bg-black/60 rounded-2xl p-5">
                      <div className="text-xs text-white/50 mb-1 tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-3xl font-semibold tabular-nums">{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/40 text-center py-16">Format JSON to see insights</div>
              )}
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-medium mb-6 flex items-center gap-3"><Clock /> Recent Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.slice(0, 4).map(item => (
                <div key={item.id} className="bg-[#070707] border border-white/10 rounded-3xl p-6">
                  <div className="text-xs text-white/50 mb-3">{new Date(item.timestamp).toLocaleString()}</div>
                  <div className="font-mono text-sm line-clamp-2 mb-5">{item.output.substring(0, 140)}...</div>
                  <div className="flex gap-3">
                    <button onClick={() => { setJsonInput(item.input); validateAndFormat(item.input); }} className={glassPill}>Load</button>
                    <button onClick={() => copyToClipboard(item.output, 'history')} className={glassPill}>Copy</button>
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

export default ApiResponseFormatterPage;