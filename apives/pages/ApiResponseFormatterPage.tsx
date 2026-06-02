'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FileJson, Code2, Copy, Download, Upload, Trash2, Clock, 
  CheckCircle2, XCircle, Search, ChevronDown, ChevronRight, 
  Activity, Zap 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import yaml from 'js-yaml';

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

const ApiResponseFormatterPage: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [minifiedOutput, setMinifiedOutput] = useState('');
  const [yamlOutput, setYamlOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<{ message: string; line: number; column: number } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'pretty' | 'minified' | 'tree' | 'raw'>('pretty');
  const [searchTerm, setSearchTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filename, setFilename] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [copiedType, setCopiedType] = useState<string | null>(null);

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
      valid
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
      const yamlStr = yaml.dump(parsed);

      setFormattedOutput(pretty);
      setMinifiedOutput(minified);
      setYamlOutput(yamlStr);
      setIsValid(true);
      setError(null);

      const statsData = calculateStats(parsed);
      setStats(statsData);
      saveToHistory(input, pretty, true);
    } catch (err: any) {
      setIsValid(false);
      setFormattedOutput('');
      setMinifiedOutput('');
      setYamlOutput('');
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

  const [stats, setStats] = useState<Stats | null>(null);

  const calculateStats = (obj: any): Stats => {
    let totalKeys = 0, objects = 0, arrays = 0, nodes = 0, depth = 0;
    let largestObject = 0, largestArray = 0;

    const traverse = (node: any, currentDepth: number) => {
      nodes++;
      depth = Math.max(depth, currentDepth);

      if (Array.isArray(node)) {
        arrays++;
        largestArray = Math.max(largestArray, node.length);
        node.forEach((item, i) => traverse(item, currentDepth + 1));
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
      complexityScore
    };
  };

  const resetState = () => {
    setFormattedOutput(''); setMinifiedOutput(''); setYamlOutput('');
    setIsValid(null); setError(null); setStats(null);
  };

  // File Handling
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

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  const downloadFile = (content: string, suffix: string, ext: string = 'json') => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-response\( {suffix}. \){ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Tree View with Proper Paths
  const JsonTree = ({ data }: { data: any }) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['$']));

    const toggleExpand = (path: string) => {
      const newSet = new Set(expanded);
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      setExpanded(newSet);
    };

    const renderNode = (node: any, path: string = '$') => {
      if (node === null) return <span className="text-red-400">null</span>;
      if (typeof node === 'boolean') return <span className="text-mora-400">{node.toString()}</span>;
      if (typeof node === 'number') return <span className="text-emerald-400">{node}</span>;
      if (typeof node === 'string') return <span className="text-amber-400">"{node}"</span>;

      if (Array.isArray(node)) {
        const isOpen = expanded.has(path);
        return (
          <div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-mora-400" onClick={() => toggleExpand(path)}>
              {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              <span className="text-white/70">Array <span className="text-white/40">[{node.length}]</span></span>
            </div>
            {isOpen && <div className="pl-5 border-l border-white/10 ml-2 mt-1 space-y-1">
              {node.map((item, idx) => renderNode(item, `\( {path}[ \){idx}]`))}
            </div>}
          </div>
        );
      }

      if (node && typeof node === 'object') {
        const isOpen = expanded.has(path);
        return (
          <div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-mora-400" onClick={() => toggleExpand(path)}>
              {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              <span className="text-white/70">Object</span>
            </div>
            {isOpen && <div className="pl-5 border-l border-white/10 ml-2 mt-1 space-y-1">
              {Object.entries(node).map(([key, val]) => (
                <div key={key} className="flex">
                  <span className="text-violet-400 mr-2">"{key}"</span>
                  <span className="text-white/50">:</span>
                  <div className="ml-2 flex-1">{renderNode(val, `\( {path}. \){key}`)}</div>
                </div>
              ))}
            </div>}
          </div>
        );
      }
      return null;
    };

    return <div className="font-mono text-[13px] leading-relaxed">{renderNode(data)}</div>;
  };

  // Sample Data
  const loadSample = (type: string) => {
    const samples: Record<string, any> = {
      'User': { id: 1, name: "Prince Gupta", email: "priiincegupta@example.com", role: "Developer", active: true },
      'Product': { id: "prod_9382", name: "Premium Wireless Headphones", price: 299.99, inStock: true, specs: { battery: "40h" } },
      'Payment': { status: "success", amount: 149.99, currency: "USD", transactionId: "txn_9f8e2a" },
      'Analytics': { users: 12480, sessions: 8934, bounceRate: 0.42, topPages: ["/", "/dashboard"] },
      'Auth': { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", expiresIn: 3600, user: { id: 1 } },
      'Error': { error: "Validation failed", code: 400, details: { field: "email", reason: "Invalid format" } }
    };

    const sampleJson = JSON.stringify(samples[type] || samples['User'], null, 2);
    setJsonInput(sampleJson);
    validateAndFormat(sampleJson);
  };

  // Flatten JSON
  const flattenJson = (obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenJson(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const handleFlatten = () => {
    if (!formattedOutput) return;
    const parsed = JSON.parse(formattedOutput);
    const flattened = flattenJson(parsed);
    setFormattedOutput(JSON.stringify(flattened, null, 2));
  };

  const currentOutput = useMemo(() => {
    if (activeTab === 'pretty') return formattedOutput;
    if (activeTab === 'minified') return minifiedOutput;
    return formattedOutput;
  }, [activeTab, formattedOutput, minifiedOutput]);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      {/* Exact Back Button Placement */}
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
        {/* HERO - Matched JWT Style */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-5">
            <FileJson size={42} strokeWidth={1.5} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-4">
            API Response <span className="text-mora-500">Formatter</span>
          </h1>
          <p className="max-w-md text-base md:text-lg text-white/60">
            Professional-grade JSON formatting, validation, analysis, optimization and debugging toolkit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* INPUT PANEL */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-2xl"><FileJson size={24} /></div>
                <h2 className="text-2xl font-semibold">JSON Input</h2>
              </div>

              <div className="flex gap-2 mb-4 text-xs">
                <div className="bg-white/5 px-3 py-1 rounded-full">Chars: {jsonInput.length}</div>
                <div className="bg-white/5 px-3 py-1 rounded-full">Lines: {jsonInput.split('\n').length}</div>
                <div className={`px-3 py-1 rounded-full ${isValid ? 'bg-mora-500/10 text-mora-400' : isValid === false ? 'bg-red-500/10 text-red-400' : 'bg-white/5'}`}>
                  {isValid === null ? 'Ready' : isValid ? 'Valid' : 'Invalid'}
                </div>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                onBlur={() => validateAndFormat(jsonInput)}
                className="w-full h-96 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y min-h-[380px]"
                placeholder="Paste your API JSON response here..."
              />

              {/* Glass Pill Controls */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => validateAndFormat(jsonInput)} className="glass-pill bg-mora-500 text-black font-medium">Format</button>
                <button onClick={handleFlatten} className="glass-pill">Flatten</button>
                <button onClick={() => document.getElementById('json-upload')?.click()} className="glass-pill flex items-center gap-2">
                  <Upload size={16} /> Upload
                </button>
                <button onClick={() => setJsonInput('')} className="glass-pill text-red-400">Clear</button>
              </div>

              <input id="json-upload" type="file" accept=".json" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
            </div>

            {/* Samples */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Zap size={18} /> Quick Samples</h3>
              <div className="grid grid-cols-2 gap-3">
                {['User', 'Product', 'Payment', 'Analytics', 'Auth', 'Error'].map(s => (
                  <button key={s} onClick={() => loadSample(s)} className="glass-pill text-left text-sm py-3.5">{s} API</button>
                ))}
              </div>
            </div>
          </div>

          {/* OUTPUT PANEL */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-2xl"><Code2 size={24} /></div>
                  <h2 className="text-2xl font-semibold">Formatted Output</h2>
                </div>

                <div className="flex bg-white/5 rounded-3xl p-1 text-sm overflow-x-auto">
                  {(['pretty', 'minified', 'tree', 'raw'] as const).map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`glass-pill px-5 py-2 whitespace-nowrap ${activeTab === t ? 'bg-white text-black' : ''}`}>
                      {t === 'pretty' ? 'Pretty' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation */}
              {isValid !== null && (
                <div className={`mb-6 p-5 rounded-3xl flex gap-4 ${isValid ? 'bg-mora-500/10 border border-mora-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  {isValid ? <CheckCircle2 className="text-mora-400" size={26} /> : <XCircle className="text-red-400" size={26} />}
                  <div className="flex-1">
                    <div className="font-semibold">{isValid ? 'Valid JSON' : 'Invalid JSON'}</div>
                    {error && (
                      <div className="text-sm mt-2 text-red-400">
                        Line {error.line}, Column {error.column}<br />{error.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Output Area */}
              <div className="bg-black border border-white/10 rounded-2xl min-h-[460px] overflow-hidden">
                {currentOutput ? (
                  activeTab === 'tree' ? (
                    <div className="p-6 overflow-auto h-full"><JsonTree data={JSON.parse(formattedOutput)} /></div>
                  ) : (
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '24px' }}>
                      {activeTab === 'minified' ? minifiedOutput : formattedOutput}
                    </SyntaxHighlighter>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-white/40 text-sm">Format JSON to see output</div>
                )}
              </div>

              {/* Action Pills */}
              {formattedOutput && (
                <div className="flex flex-wrap gap-3 mt-6">
                  <button onClick={() => copyToClipboard(formattedOutput, 'pretty')} className="glass-pill flex items-center gap-2">
                    {copiedType === 'pretty' ? '✓ Copied' : <><Copy size={16} /> Copy Pretty</>}
                  </button>
                  <button onClick={() => copyToClipboard(minifiedOutput, 'minified')} className="glass-pill flex items-center gap-2">
                    {copiedType === 'minified' ? '✓ Copied' : 'Copy Minified'}
                  </button>
                  <button onClick={() => downloadFile(formattedOutput, '-pretty')} className="glass-pill flex items-center gap-2">
                    <Download size={16} /> Pretty
                  </button>
                  <button onClick={() => downloadFile(minifiedOutput, '-min')} className="glass-pill flex items-center gap-2">
                    <Download size={16} /> Minified
                  </button>
                  <button onClick={() => downloadFile(yamlOutput, '', 'yaml')} className="glass-pill flex items-center gap-2">
                    <Download size={16} /> YAML
                  </button>
                </div>
              )}
            </div>

            {/* Response Intelligence - Always Visible */}
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-mora-400" />
                <h3 className="text-xl font-semibold">Response Intelligence</h3>
              </div>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats).map(([label, value]) => (
                    <div key={label} className="bg-black/60 rounded-2xl p-5">
                      <div className="text-xs text-white/50 tracking-widest mb-1">{label.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-3xl font-semibold tabular-nums">{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/40 text-center py-12">Format a JSON response to view intelligence</div>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium flex items-center gap-3"><Clock /> Recent Sessions</h3>
              <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-mora-400">View All</button>
            </div>
            {showHistory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map(item => (
                  <div key={item.id} className="bg-[#070707] border border-white/10 rounded-3xl p-6 hover:border-mora-500/30 transition-all">
                    <div className="text-xs text-white/50 mb-3">{new Date(item.timestamp).toLocaleString()}</div>
                    <div className="font-mono text-sm line-clamp-2 text-white/70 mb-5">{item.output.substring(0, 140)}...</div>
                    <div className="flex gap-3">
                      <button onClick={() => { setJsonInput(item.input); validateAndFormat(item.input); }} className="glass-pill flex-1 text-sm">Load</button>
                      <button onClick={() => copyToClipboard(item.output, 'history')} className="glass-pill">Copy</button>
                      <button onClick={() => {
                        const filtered = history.filter(h => h.id !== item.id);
                        setHistory(filtered);
                        localStorage.setItem('apives-json-formatter-history', JSON.stringify(filtered));
                      }} className="glass-pill text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiResponseFormatterPage;