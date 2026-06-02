'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileJson, Code2, CheckCircle2, XCircle, Copy, Download, Upload, 
  Trash2, Clock, Activity, Search, ChevronDown, ChevronRight 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MoraColor = '#c026d3'; // Vibrant magenta-purple accent

interface HistoryItem {
  id: string;
  timestamp: string;
  input: string;
  formatted: string;
  size: number;
  valid: boolean;
}

interface JsonStats {
  totalKeys: number;
  objects: number;
  arrays: number;
  depth: number;
  characters: number;
  lines: number;
  bytes: number;
  nodes: number;
}

const BackButton = () => (
  <button 
    onClick={() => window.history.back()}
    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm transition-all active:scale-95"
  >
    ← Back
  </button>
);

const APIResponseFormatter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [formattedOutput, setFormattedOutput] = useState<string>('');
  const [minifiedOutput, setMinifiedOutput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'raw' | 'tree'>('raw');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [stats, setStats] = useState<JsonStats | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState<boolean>(false);
  const [secondJson, setSecondJson] = useState<string>('');

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('apives-json-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history
  const saveToHistory = useCallback((input: string, formatted: string, valid: boolean) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      input,
      formatted,
      size: new Blob([formatted]).size,
      valid
    };
    
    const updated = [newItem, ...history].slice(0, 15);
    setHistory(updated);
    localStorage.setItem('apives-json-history', JSON.stringify(updated));
  }, [history]);

  const validateAndFormat = (input: string) => {
    if (!input.trim()) {
      setIsValid(null);
      setFormattedOutput('');
      setMinifiedOutput('');
      setErrorMessage('');
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      const minified = JSON.stringify(parsed);
      
      setFormattedOutput(pretty);
      setMinifiedOutput(minified);
      setIsValid(true);
      setErrorMessage('');
      setErrorLine(null);

      // Calculate stats
      const statsData = calculateStats(parsed);
      setStats(statsData);

      saveToHistory(input, pretty, true);
    } catch (err: any) {
      setIsValid(false);
      setFormattedOutput('');
      setMinifiedOutput('');
      setErrorMessage(err.message);
      
      // Try to extract line number
      const lineMatch = err.message.match(/line (\d+)/i);
      if (lineMatch) setErrorLine(parseInt(lineMatch[1]));
      else setErrorLine(null);
      
      setStats(null);
    }
  };

  const calculateStats = (obj: any): JsonStats => {
    let totalKeys = 0;
    let objects = 0;
    let arrays = 0;
    let depth = 0;
    let nodes = 0;

    const traverse = (node: any, currentDepth: number) => {
      nodes++;
      depth = Math.max(depth, currentDepth);
      
      if (Array.isArray(node)) {
        arrays++;
        node.forEach(item => traverse(item, currentDepth + 1));
      } else if (node && typeof node === 'object') {
        objects++;
        totalKeys += Object.keys(node).length;
        Object.values(node).forEach(val => traverse(val, currentDepth + 1));
      }
    };

    traverse(obj, 1);

    const str = JSON.stringify(obj);
    return {
      totalKeys,
      objects,
      arrays,
      depth,
      characters: str.length,
      lines: str.split('\n').length,
      bytes: new Blob([str]).size,
      nodes
    };
  };

  const handleFormat = () => validateAndFormat(jsonInput);
  const handleMinify = () => {
    if (!formattedOutput) return;
    setFormattedOutput(minifiedOutput);
  };

  const handleClear = () => {
    setJsonInput('');
    setFormattedOutput('');
    setMinifiedOutput('');
    setIsValid(null);
    setErrorMessage('');
    setStats(null);
    setSearchTerm('');
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const downloadJson = (content: string, suffix: string = '') => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response${suffix ? '-' + suffix : ''}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.json')) {
      alert("Please upload a valid .json file");
      return;
    }
    
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      validateAndFormat(text);
    };
    reader.readAsText(file);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // Sample Data
  const loadSample = (type: string) => {
    let sample = '';
    
    switch(type) {
      case 'user':
        sample = JSON.stringify({
          id: 123,
          name: "Alex Rivera",
          email: "alex@design.com",
          role: "Senior Designer",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg",
          preferences: {
            theme: "dark",
            notifications: true,
            language: "en"
          },
          projects: [
            { id: 1, name: "Apives Dashboard", status: "active" },
            { id: 2, name: "Mobile Banking", status: "completed" }
          ]
        }, null, 2);
        break;
      case 'product':
        sample = JSON.stringify({
          id: "prod_987",
          name: "Wireless Noise Cancelling Headphones",
          price: 299.99,
          currency: "USD",
          inStock: true,
          specs: {
            battery: "30 hours",
            driver: "40mm",
            weight: "250g"
          },
          reviews: [
            { user: "sam", rating: 5, comment: "Best headphones ever" }
          ]
        }, null, 2);
        break;
      default:
        sample = JSON.stringify({ message: "Sample loaded successfully" }, null, 2);
    }
    
    setJsonInput(sample);
    validateAndFormat(sample);
  };

  // Tree View Component
  const JsonTree: React.FC<{ data: any; search?: string }> = ({ data, search = '' }) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    
    const toggleExpand = (path: string) => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(path)) newExpanded.delete(path);
      else newExpanded.add(path);
      setExpanded(newExpanded);
    };

    const renderNode = (node: any, path: string = '', level: number = 0) => {
      if (node === null) return <span className="text-[#f87171]">null</span>;
      if (typeof node === 'boolean') return <span className="text-[#60a5fa]">{node.toString()}</span>;
      if (typeof node === 'number') return <span className="text-[#34d399]">{node}</span>;
      if (typeof node === 'string') {
        const highlighted = search && node.toLowerCase().includes(search.toLowerCase())
          ? <span className="bg-yellow-500/30 px-1 rounded">{node}</span>
          : node;
        return <span className="text-[#facc15]">"{highlighted}"</span>;
      }

      if (Array.isArray(node)) {
        const isExpanded = expanded.has(path);
        return (
          <div>
            <div 
              className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
              onClick={() => toggleExpand(path)}
            >
              <span>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
              <span className="text-[#94a3b8]">Array [{node.length}]</span>
            </div>
            {isExpanded && (
              <div className="pl-6 border-l border-white/10 ml-2">
                {node.map((item, idx) => (
                  <div key={idx} className="py-0.5">
                    {renderNode(item, `\( {path}[ \){idx}]`, level + 1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      if (node && typeof node === 'object') {
        const isExpanded = expanded.has(path);
        const keys = Object.keys(node);
        
        return (
          <div>
            <div 
              className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
              onClick={() => toggleExpand(path)}
            >
              <span>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
              <span className="text-[#94a3b8]">Object {'{'}{keys.length}{'}'}</span>
            </div>
            {isExpanded && (
              <div className="pl-6 border-l border-white/10 ml-2">
                {keys.map(key => (
                  <div key={key} className="py-1">
                    <span className="text-[#c4b5fd]">" {key} "</span>
                    <span className="text-white/50 mx-2">:</span>
                    {renderNode(node[key], `\( {path}. \){key}`, level + 1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      return <span>{String(node)}</span>;
    };

    return <div className="font-mono text-sm leading-relaxed">{renderNode(data)}</div>;
  };

  // Highlight search in raw view
  const highlightedOutput = React.useMemo(() => {
    if (!searchTerm || !formattedOutput) return formattedOutput;
    return formattedOutput.replace(
      new RegExp(searchTerm, 'gi'),
      match => `<mark class="bg-yellow-500/30 text-white px-0.5 rounded">${match}</mark>`
    );
  }, [formattedOutput, searchTerm]);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      {/* Back Button */}
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4">
            <FileJson size={42} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter text-white mb-3">
            API Response <span style={{ color: MoraColor }}>Formatter</span>
          </h1>
          <p className="max-w-md text-lg text-white/60">
            Format, validate, beautify, minify and inspect API JSON responses with advanced developer tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* INPUT WORKSPACE */}
          <div className="space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <FileJson size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium">JSON Input</h2>
                    <p className="text-sm text-white/50">Paste your API response</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-2xl text-sm transition-all"
                  >
                    <Upload size={16} /> Upload
                  </button>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Drag & Drop Area */}
              <div 
                className={`border border-dashed ${isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/10'} rounded-2xl p-8 text-center mb-4 transition-all`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto mb-3 text-white/40" size={32} />
                <p className="text-sm text-white/50">Drag &amp; drop JSON file here</p>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                onBlur={() => validateAndFormat(jsonInput)}
                className="w-full h-80 bg-black border border-white/10 focus:border-violet-500 rounded-2xl p-5 font-mono text-sm text-white resize-y min-h-[320px] outline-none"
                placeholder='Paste API response JSON here...&#10;{&#10;  "status": "success"&#10;}'
                spellCheck={false}
              />

              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button 
                  onClick={handleFormat}
                  className="px-6 py-3 bg-white text-black rounded-2xl font-medium flex items-center gap-2 hover:bg-white/90 transition-all active:scale-[0.985]"
                >
                  Format
                </button>
                <button 
                  onClick={handleMinify}
                  className="px-6 py-3 border border-white/20 hover:bg-white/5 rounded-2xl flex items-center gap-2 transition-all"
                >
                  Minify
                </button>
                <button 
                  onClick={handleClear}
                  className="px-6 py-3 border border-white/20 hover:bg-white/5 rounded-2xl flex items-center gap-2 transition-all text-red-400"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Sample Data */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Activity size={18} /> Quick Samples
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['user', 'product'].map((type) => (
                  <button
                    key={type}
                    onClick={() => loadSample(type)}
                    className="text-left border border-white/10 hover:border-white/30 p-4 rounded-2xl transition-all text-sm"
                  >
                    Load Sample {type === 'user' ? 'User' : 'Product'} API
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* OUTPUT WORKSPACE */}
          <div className="space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <Code2 size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium">Formatted Output</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode(viewMode === 'raw' ? 'tree' : 'raw')}
                    className="px-4 py-2 text-xs border border-white/10 rounded-2xl hover:bg-white/5"
                  >
                    {viewMode === 'raw' ? 'Tree View' : 'Raw View'}
                  </button>
                </div>
              </div>

              {/* Validation Status */}
              {isValid !== null && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${isValid ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  {isValid ? <CheckCircle2 className="text-emerald-400" /> : <XCircle className="text-red-400" />}
                  <div>
                    <div className="font-medium">{isValid ? 'Valid JSON' : 'Invalid JSON'}</div>
                    {!isValid && errorMessage && <div className="text-xs text-red-400 mt-1">{errorMessage}</div>}
                  </div>
                </div>
              )}

              {/* Output Area */}
              <div className="flex-1 bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[420px]">
                {formattedOutput ? (
                  <>
                    {viewMode === 'raw' ? (
                      <div className="p-4 overflow-auto font-mono text-sm h-full">
                        <SyntaxHighlighter 
                          language="json" 
                          style={vscDarkPlus} 
                          customStyle={{ background: 'transparent', margin: 0 }}
                        >
                          {formattedOutput}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <div className="p-6 overflow-auto h-full">
                        <JsonTree data={JSON.parse(formattedOutput)} search={searchTerm} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
                    Output will appear here
                  </div>
                )}
              </div>

              {/* Action Bar */}
              {formattedOutput && (
                <div className="flex flex-wrap gap-2 mt-6">
                  <button 
                    onClick={() => copyToClipboard(formattedOutput, 'pretty')}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-2xl transition-all"
                  >
                    {copied === 'pretty' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    Copy
                  </button>
                  
                  <button 
                    onClick={() => downloadJson(formattedOutput)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-2xl transition-all"
                  >
                    <Download size={18} /> Download
                  </button>
                  
                  <button 
                    onClick={() => downloadJson(minifiedOutput, 'minified')}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-2xl transition-all"
                  >
                    Minified
                  </button>
                </div>
              )}
            </div>

            {/* Statistics */}
            {stats && (
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity size={20} />
                  <h3 className="font-medium">Response Statistics</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="bg-black/50 rounded-2xl p-4">
                      <div className="text-xs text-white/50 uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-3xl font-semibold text-white tabular-nums">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {formattedOutput && (
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search keys or values..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 pl-12 py-4 rounded-3xl text-sm focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium flex items-center gap-3">
                <Clock /> Recent Sessions
              </h3>
              <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-white/60 hover:text-white">
                {showHistory ? 'Hide' : 'Show All'}
              </button>
            </div>

            {showHistory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map(item => (
                  <div key={item.id} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 hover:border-white/30 group">
                    <div className="text-xs text-white/50 mb-3">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    
                    <div className="text-sm line-clamp-2 font-mono text-white/70 mb-4">
                      {item.formatted.substring(0, 120)}...
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setJsonInput(item.input);
                          validateAndFormat(item.input);
                        }}
                        className="text-xs flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl"
                      >
                        Load Again
                      </button>
                      <button 
                        onClick={() => {
                          const updated = history.filter(h => h.id !== item.id);
                          setHistory(updated);
                          localStorage.setItem('apives-json-history', JSON.stringify(updated));
                        }}
                        className="text-xs px-4 text-red-400 hover:bg-red-500/10 rounded-2xl"
                      >
                        <Trash2 size={15} />
                      </button>
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

export default APIResponseFormatter;