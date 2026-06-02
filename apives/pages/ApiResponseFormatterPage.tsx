'use client';

import React, { useState, useEffect, useCallback, useMemo, memo, useRef, ErrorInfo } from 'react';
import {
  FileJson, Code2, Copy, Download, Upload, Trash2, Clock,
  CheckCircle2, XCircle, Search, ChevronDown, ChevronRight,
  Activity, Zap, Wand2, Minimize2, Layers, Braces,
  Sparkles, ArrowRight, Hash, Type, Grid, Database,
  Shield, RefreshCw
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BackButton } from "../components/BackButton";
import yaml from 'js-yaml';

// ========== Error Boundary ==========
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('Caught:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-center text-white/60">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

// ========== Types ==========
interface HistoryItem {
  id: string;
  timestamp: string;
  input: string;
  output: string;
  size: number;
  valid: boolean;
}

interface Stats {
  totalKeys: number; objects: number; arrays: number; nodes: number; depth: number;
  characters: number; lines: number; bytes: number; largestObject: number; largestArray: number; complexityScore: number;
}

// ========== Auth Hook (replace with your actual auth provider) ==========
const useAuth = () => {
  // Simulate authentication – replace with real logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    // Check if user is logged in (example: localStorage token)
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      setUserId('user_' + token.substring(0, 8));
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);
  return { isAuthenticated, userId };
};

// ========== Glass Pill Style ==========
const glassPill = "backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-mora-500/50 disabled:opacity-50";

// ========== Highlighted JSON for Pretty View ==========
const HighlightedJSON = memo(({ text, searchTerm }: { text: string; searchTerm: string }) => {
  if (!searchTerm.trim()) return <>{text}</>;
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="bg-yellow-500/40 text-white rounded px-0.5">{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
      )}
    </>
  );
});
HighlightedJSON.displayName = 'HighlightedJSON';

// ========== Safe Tree View (depth limit, no recursion crash) ==========
const JsonTree = memo(({ data, searchTerm }: { data: any; searchTerm: string }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['$']));
  const toggleExpand = useCallback((path: string) => {
    setExpanded(prev => { const s = new Set(prev); s.has(path) ? s.delete(path) : s.add(path); return s; });
  }, []);

  const highlightText = useCallback((text: string): React.ReactNode => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => regex.test(part) ? <mark key={i} className="bg-yellow-500/40 text-white rounded px-0.5">{part}</mark> : part);
  }, [searchTerm]);

  const renderNode = useCallback((node: any, path: string = '$', depth: number = 0): React.ReactNode => {
    if (depth > 50) return <span className="text-red-400">Max depth exceeded</span>;
    if (node === null) return <span className="text-red-400">null</span>;
    if (typeof node === 'boolean') return <span className="text-mora-400">{highlightText(node.toString())}</span>;
    if (typeof node === 'number') return <span className="text-emerald-400">{highlightText(node.toString())}</span>;
    if (typeof node === 'string') return <span className="text-amber-400">"{highlightText(node)}"</span>;

    if (Array.isArray(node)) {
      const isOpen = expanded.has(path);
      const shouldShow = !searchTerm.trim() || JSON.stringify(node).toLowerCase().includes(searchTerm.toLowerCase());
      if (!shouldShow) return null;
      return (
        <div className="my-0.5">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-mora-400" onClick={() => toggleExpand(path)}>
            {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            <span className="text-white/70">Array [{node.length}]</span>
          </div>
          {isOpen && (
            <div className="pl-5 border-l border-white/10 ml-2 mt-1 space-y-1">
              {node.map((item, idx) => <div key={idx}>{renderNode(item, `${path}[${idx}]`, depth + 1)}</div>)}
            </div>
          )}
        </div>
      );
    }

    if (node && typeof node === 'object') {
      const isOpen = expanded.has(path);
      const entries = Object.entries(node);
      let shouldShow = !searchTerm.trim();
      if (!shouldShow) {
        shouldShow = entries.some(([k, v]) => k.toLowerCase().includes(searchTerm.toLowerCase()) || JSON.stringify(v).toLowerCase().includes(searchTerm.toLowerCase()));
      }
      if (!shouldShow) return null;
      return (
        <div className="my-0.5">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-mora-400" onClick={() => toggleExpand(path)}>
            {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            <span className="text-white/70">Object</span>
          </div>
          {isOpen && (
            <div className="pl-5 border-l border-white/10 ml-2 mt-1 space-y-1">
              {entries.map(([key, val]) => {
                const keyMatches = searchTerm && key.toLowerCase().includes(searchTerm.toLowerCase());
                const shouldShowChild = !searchTerm.trim() || keyMatches || JSON.stringify(val).toLowerCase().includes(searchTerm.toLowerCase());
                if (!shouldShowChild) return null;
                return (
                  <div key={key} className="flex flex-wrap items-baseline gap-1">
                    <span className="text-violet-400">"{highlightText(key)}"</span>
                    <span className="text-white/50">:</span>
                    <div className="flex-1">{renderNode(val, `${path}.${key}`, depth + 1)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  }, [expanded, searchTerm, highlightText, toggleExpand]);

  return <div className="font-mono text-[13px] leading-relaxed">{renderNode(data)}</div>;
});
JsonTree.displayName = 'JsonTree';

// ========== Main Component ==========
const ApiResponseFormatterPage: React.FC = () => {
  const { isAuthenticated, userId } = useAuth();
  // State
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
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load authenticated user history (only if logged in)
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setHistory([]);
      return;
    }
    try {
      const saved = localStorage.getItem(`apives-history-${userId}`);
      if (saved) setHistory(JSON.parse(saved));
      else setHistory([]);
    } catch (e) {
      console.error('Failed to load history', e);
      setHistory([]);
    }
  }, [isAuthenticated, userId]);

  // Save history only for authenticated users
  const saveHistory = useCallback((item: HistoryItem) => {
    if (!isAuthenticated || !userId) return;
    setHistory(prev => {
      const last = prev[0];
      if (last && last.input === item.input) return prev; // deduplicate
      const updated = [item, ...prev].slice(0, 20);
      try {
        localStorage.setItem(`apives-history-${userId}`, JSON.stringify(updated));
      } catch (e) { console.error('Failed to save history', e); }
      return updated;
    });
  }, [isAuthenticated, userId]);

  // Calculate Stats
  const calculateStats = useCallback((obj: any): Stats => {
    let totalKeys = 0, objects = 0, arrays = 0, nodes = 0, depth = 0;
    let largestObject = 0, largestArray = 0;
    const traverse = (node: any, currentDepth: number) => {
      if (currentDepth > 100) return;
      nodes++;
      depth = Math.max(depth, currentDepth);
      if (Array.isArray(node)) {
        arrays++;
        largestArray = Math.max(largestArray, node.length);
        node.forEach((item) => traverse(item, currentDepth + 1));
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
    const complexityScore = Math.min(100, Math.max(15, Math.round(100 - (depth * 12) - (objects * 1.2))));
    return {
      totalKeys, objects, arrays, nodes, depth,
      characters: str.length, lines: str.split('\n').length, bytes: new Blob([str]).size,
      largestObject, largestArray, complexityScore
    };
  }, []);

  // Validate & Format (safe)
  const validateAndFormat = useCallback((input: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsProcessing(true);
    const process = () => {
      if (!input.trim()) {
        setFormattedOutput(''); setMinifiedOutput(''); setYamlOutput(''); setRawOutput('');
        setIsValid(null); setError(null); setStats(null);
        setIsProcessing(false);
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

        // Save to history only if authenticated
        if (isAuthenticated) {
          saveHistory({
            id: Date.now().toString(36),
            timestamp: new Date().toISOString(),
            input,
            output: pretty,
            size: new Blob([pretty]).size,
            valid: true
          });
        }
      } catch (err: any) {
        setIsValid(false);
        setFormattedOutput(''); setMinifiedOutput(''); setYamlOutput(''); setRawOutput('');
        setStats(null);
        const lineMatch = err.message.match(/line (\d+)/i);
        const colMatch = err.message.match(/column (\d+)/i);
        setError({ message: err.message, line: lineMatch ? parseInt(lineMatch[1]) : 1, column: colMatch ? parseInt(colMatch[1]) : 1 });
      } finally { setIsProcessing(false); }
    };
    debounceRef.current = setTimeout(process, 300);
  }, [calculateStats, saveHistory, isAuthenticated]);

  // Flatten
  const flattenJson = useCallback((obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenJson(obj[k], pre + k));
      } else { acc[pre + k] = obj[k]; }
      return acc;
    }, {});
  }, []);
  const handleFlatten = useCallback(() => {
    if (!formattedOutput) return;
    try {
      const parsed = JSON.parse(formattedOutput);
      const flattened = flattenJson(parsed);
      const flattenedPretty = JSON.stringify(flattened, null, 2);
      setJsonInput(flattenedPretty);
      validateAndFormat(flattenedPretty);
    } catch (e) { console.error(e); }
  }, [formattedOutput, flattenJson, validateAndFormat]);

  // Remove empty fields
  const removeEmptyFields = useCallback(() => {
    if (!formattedOutput) return;
    const clean = (obj: any): any => {
      if (Array.isArray(obj)) return obj.map(clean).filter(v => v !== undefined && v !== null && v !== '');
      if (obj && typeof obj === 'object') {
        const result: any = {};
        Object.entries(obj).forEach(([k, v]) => {
          const cleaned = clean(v);
          if (cleaned !== undefined && cleaned !== null && cleaned !== '' && !(typeof cleaned === 'object' && Object.keys(cleaned).length === 0)) {
            result[k] = cleaned;
          }
        });
        return result;
      }
      return obj;
    };
    const parsed = JSON.parse(formattedOutput);
    const cleaned = clean(parsed);
    const pretty = JSON.stringify(cleaned, null, 2);
    setJsonInput(pretty);
    validateAndFormat(pretty);
  }, [formattedOutput, validateAndFormat]);

  // Sort keys
  const sortKeys = useCallback(() => {
    if (!formattedOutput) return;
    const sort = (obj: any): any => {
      if (Array.isArray(obj)) return obj.map(sort);
      if (obj && typeof obj === 'object') {
        return Object.keys(obj).sort().reduce((acc: any, key) => { acc[key] = sort(obj[key]); return acc; }, {});
      }
      return obj;
    };
    const parsed = JSON.parse(formattedOutput);
    const sorted = sort(parsed);
    const pretty = JSON.stringify(sorted, null, 2);
    setJsonInput(pretty);
    validateAndFormat(pretty);
  }, [formattedOutput, validateAndFormat]);

  // Generate TypeScript Interface
  const generateTypeScript = useCallback(() => {
    if (!formattedOutput) return;
    const obj = JSON.parse(formattedOutput);
    const toTS = (obj: any, name: string = 'Root'): string => {
      if (Array.isArray(obj)) {
        if (obj.length === 0) return `type ${name} = any[];`;
        return toTS(obj[0], `${name}Item`) + `\ntype ${name} = ${name}Item[];`;
      }
      if (obj && typeof obj === 'object') {
        const props = Object.entries(obj).map(([k, v]) => {
          const type = Array.isArray(v) ? `${k.charAt(0).toUpperCase() + k.slice(1)}Item[]` : typeof v === 'object' && v !== null ? `${k.charAt(0).toUpperCase() + k.slice(1)}` : typeof v;
          return `  ${k}: ${type};`;
        }).join('\n');
        const nested = Object.entries(obj).filter(([_, v]) => typeof v === 'object' && v !== null && !Array.isArray(v)).map(([k, v]) => toTS(v, k.charAt(0).toUpperCase() + k.slice(1))).join('\n');
        return `${nested}\nexport interface ${name} {\n${props}\n}`;
      }
      return '';
    };
    const tsCode = toTS(obj);
    copyToClipboard(tsCode, 'ts');
    setUploadStatus({ message: 'TypeScript interface copied!', type: 'success' });
    setTimeout(() => setUploadStatus(null), 2000);
  }, [formattedOutput]);

  // Generate JSON Schema
  const generateJsonSchema = useCallback(() => {
    if (!formattedOutput) return;
    const obj = JSON.parse(formattedOutput);
    const inferType = (val: any): any => {
      if (val === null) return { type: 'null' };
      if (Array.isArray(val)) return { type: 'array', items: val.length ? inferType(val[0]) : {} };
      if (typeof val === 'object') {
        const properties: any = {};
        Object.entries(val).forEach(([k, v]) => { properties[k] = inferType(v); });
        return { type: 'object', properties };
      }
      return { type: typeof val };
    };
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...inferType(obj)
    };
    const schemaStr = JSON.stringify(schema, null, 2);
    copyToClipboard(schemaStr, 'schema');
    setUploadStatus({ message: 'JSON Schema copied!', type: 'success' });
    setTimeout(() => setUploadStatus(null), 2000);
  }, [formattedOutput]);

  // File handling
  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.json')) { setUploadStatus({ message: 'Please upload a .json file', type: 'error' }); setTimeout(() => setUploadStatus(null), 3000); return; }
    setUploadedFilename(file.name.replace(/\.json$/, ''));
    setUploadStatus({ message: `Uploaded: ${file.name}`, type: 'success' });
    setTimeout(() => setUploadStatus(null), 3000);
    const reader = new FileReader();
    reader.onload = (e) => { const text = e.target?.result as string; setJsonInput(text); validateAndFormat(text); };
    reader.readAsText(file);
  }, [validateAndFormat]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) processFile(file); };

  // Copy & Download (fixed MIME)
  const copyToClipboard = useCallback(async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  }, []);
  const downloadFile = useCallback((content: string, suffix: string, ext: string, mime: string) => {
    if (!content) return;
    const baseName = uploadedFilename ? uploadedFilename : 'api-response';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}${suffix}.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [uploadedFilename]);

  // Search match counting
  useEffect(() => {
    if (!searchTerm.trim() || !formattedOutput) { setMatchCount(0); return; }
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    setMatchCount((formattedOutput.match(regex) || []).length);
  }, [searchTerm, formattedOutput]);

  const fullReset = useCallback(() => {
    setJsonInput(''); setFormattedOutput(''); setMinifiedOutput(''); setYamlOutput(''); setRawOutput('');
    setIsValid(null); setError(null); setStats(null); setSearchTerm(''); setUploadedFilename(null); setUploadStatus(null); setActiveTab('pretty');
  }, []);

  const currentOutput = useMemo(() => {
    if (activeTab === 'pretty') return formattedOutput;
    if (activeTab === 'minified') return minifiedOutput;
    if (activeTab === 'raw') return rawOutput;
    return formattedOutput;
  }, [activeTab, formattedOutput, minifiedOutput, rawOutput]);

  // Stats order for display
  const statsOrder = [
    { label: 'Total Keys', key: 'totalKeys' }, { label: 'Objects', key: 'objects' }, { label: 'Arrays', key: 'arrays' },
    { label: 'Nodes', key: 'nodes' }, { label: 'Depth', key: 'depth' }, { label: 'Characters', key: 'characters' },
    { label: 'Lines', key: 'lines' }, { label: 'Bytes', key: 'bytes' }, { label: 'Largest Object', key: 'largestObject' },
    { label: 'Largest Array', key: 'largestArray' }, { label: 'Complexity Score', key: 'complexityScore' }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
        <div className="absolute top-24 left-4 lg:left-8 z-30"><BackButton /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          {/* Hero with Mora Green Icon + Glow */}
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-mora-500/20 rounded-2xl mb-5 shadow-lg shadow-mora-500/20">
              <FileJson size={42} strokeWidth={1.5} className="text-mora-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-4 break-words">
              API Response <span className="text-mora-400">Formatter</span>
            </h1>
            <p className="max-w-md text-base md:text-lg text-white/60">Professional-grade JSON formatting, validation, analysis & debugging toolkit.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT PANEL */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 sm:p-6" onDragOver={handleDragOver} onDrop={handleDrop}>
                <div className="flex items-center gap-3 mb-6"><div className="p-2.5 bg-white/5 rounded-2xl"><FileJson size={24} /></div><h2 className="text-xl sm:text-2xl font-semibold">JSON Input</h2></div>
                <div className="flex flex-wrap gap-2 mb-4 text-xs">
                  <div className="bg-white/5 px-3 py-1 rounded-full">Chars: {jsonInput.length}</div>
                  <div className="bg-white/5 px-3 py-1 rounded-full">Lines: {jsonInput.split('\n').length}</div>
                  <div className={`px-3 py-1 rounded-full ${isValid ? 'bg-mora-500/10 text-mora-400' : isValid === false ? 'bg-red-500/10 text-red-400' : 'bg-white/5'}`}>
                    {isValid === null ? 'Ready' : isValid ? 'Valid' : 'Invalid'}
                  </div>
                  {uploadStatus && (<div className={`px-3 py-1 rounded-full text-xs ${uploadStatus.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{uploadStatus.message}</div>)}
                </div>
                <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} onBlur={() => validateAndFormat(jsonInput)} className="w-full bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y min-h-[280px] md:min-h-[380px]" placeholder='Paste JSON or drag & drop .json file' />
                <div className="flex flex-wrap gap-3 mt-6">
                  <button onClick={() => validateAndFormat(jsonInput)} className={`${glassPill} bg-mora-500 text-black border-mora-500 hover:bg-mora-600 font-medium shadow-lg shadow-mora-500/20`}>Format</button>
                  <button onClick={handleFlatten} className={glassPill}>Flatten</button>
                  <button onClick={() => document.getElementById('json-upload')?.click()} className={`${glassPill} flex items-center gap-2`}><Upload size={16} /> Upload</button>
                  <button onClick={fullReset} className={`${glassPill} text-red-400`}>Clear</button>
                </div>
                <input id="json-upload" type="file" accept=".json" className="hidden" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
              </div>

              {/* Quick Actions (replaces Quick Samples) */}
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 sm:p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Wand2 size={18} /> Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => validateAndFormat(jsonInput)} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><Zap size={14} /> Format JSON</button>
                  <button onClick={() => { if (minifiedOutput) copyToClipboard(minifiedOutput, 'minified'); }} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><Minimize2 size={14} /> Minify JSON</button>
                  <button onClick={() => { if (yamlOutput) copyToClipboard(yamlOutput, 'yaml'); }} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><Layers size={14} /> Convert To YAML</button>
                  <button onClick={handleFlatten} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><Layers size={14} /> Flatten JSON</button>
                  <button onClick={generateTypeScript} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><Type size={14} /> Generate TS Interface</button>
                  <button onClick={generateJsonSchema} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><Grid size={14} /> Generate JSON Schema</button>
                  <button onClick={removeEmptyFields} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><Trash2 size={14} /> Remove Empty Fields</button>
                  <button onClick={sortKeys} className={`${glassPill} text-left text-sm py-3 flex items-center gap-2`}><ArrowRight size={14} /> Sort Keys</button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3"><div className="p-2.5 bg-white/5 rounded-2xl"><Code2 size={24} /></div><h2 className="text-xl sm:text-2xl font-semibold">Formatted Output</h2></div>
                  <div className="flex bg-white/5 rounded-3xl p-1 text-sm overflow-x-auto scrollbar-thin">
                    {(['pretty', 'minified', 'tree', 'raw'] as const).map(t => (
                      <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 whitespace-nowrap rounded-2xl transition-all ${activeTab === t ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}>
                        {t === 'pretty' ? 'Pretty' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {isValid === true && (<div className="mb-6 p-5 rounded-3xl bg-mora-500/10 border border-mora-500/30"><div className="flex gap-4"><CheckCircle2 className="text-mora-400 shrink-0" size={26} /><div><div className="font-semibold text-mora-400">Valid JSON</div><div className="text-sm text-white/70">Ready to use</div></div></div></div>)}
                {isValid === false && error && (<div className="mb-6 p-5 rounded-3xl bg-red-500/10 border border-red-500/30"><div className="flex gap-4"><XCircle className="text-red-400 shrink-0" size={26} /><div><div className="font-semibold text-red-400">Invalid JSON</div><div className="text-sm text-white/70 mt-1">Line {error.line}, Column {error.column}</div><div className="text-sm text-white/50 mt-1 break-all">{error.message}</div></div></div></div>)}

                {isValid && (<div className="mb-4 flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-4 py-2"><Search size={16} className="text-white/40" /><input type="text" placeholder="Search keys & values..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent flex-1 text-sm outline-none min-w-0" />{searchTerm && <span className="text-xs text-white/50 shrink-0">{matchCount} matches</span>}</div>)}

                <div className="bg-black border border-white/10 rounded-2xl min-h-[320px] md:min-h-[460px] overflow-auto">
                  {isProcessing ? (<div className="flex items-center justify-center h-full text-white/40"><RefreshCw className="animate-spin mr-2" size={20} /> Formatting...</div>) : currentOutput ? (
                    activeTab === 'tree' && isValid ? (<div className="p-6"><JsonTree data={JSON.parse(formattedOutput)} searchTerm={searchTerm} /></div>) :
                    activeTab === 'raw' ? (<pre className="p-6 font-mono text-sm text-white/80 whitespace-pre-wrap break-all bg-transparent m-0">{rawOutput}</pre>) :
                    (<SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '24px', margin: 0 }}>{searchTerm ? <HighlightedJSON text={currentOutput} searchTerm={searchTerm} /> : currentOutput}</SyntaxHighlighter>)
                  ) : (<div className="flex items-center justify-center h-full text-white/40 text-sm p-8 text-center">Paste JSON and click Format</div>)}
                </div>

                {formattedOutput && (<div className="flex flex-wrap gap-3 mt-6">
                  <button onClick={() => downloadFile(formattedOutput, '-pretty', 'json', 'application/json')} className={`${glassPill} flex items-center gap-2`}><Download size={16} /> Pretty</button>
                  <button onClick={() => downloadFile(minifiedOutput, '-minified', 'json', 'application/json')} className={`${glassPill} flex items-center gap-2`}><Download size={16} /> Minified</button>
                  <button onClick={() => downloadFile(yamlOutput, '', 'yaml', 'text/yaml')} className={`${glassPill} flex items-center gap-2`}><Download size={16} /> YAML</button>
                  <button onClick={() => copyToClipboard(formattedOutput, 'pretty')} className={`${glassPill} flex items-center gap-2`}>{copiedType === 'pretty' ? '✓' : <Copy size={16} />} Copy</button>
                </div>)}
              </div>

              {/* Response Intelligence */}
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-6"><Activity className="text-mora-400" size={22} /><h3 className="text-xl font-semibold">Response Intelligence</h3></div>
                {stats ? (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{statsOrder.map(({ label, key }) => (<div key={key} className="bg-black/60 rounded-2xl p-4"><div className="text-xs text-white/50 tracking-wider mb-1">{label}</div><div className="text-xl md:text-3xl font-semibold tabular-nums">{stats[key as keyof Stats]}</div></div>))}</div>) : (<div className="text-white/40 text-center py-12">Format a JSON response to unlock intelligence insights</div>)}
              </div>
            </div>
          </div>

          {/* History Section - only shown for authenticated users */}
          {isAuthenticated && (
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-medium flex items-center gap-3"><Clock size={20} /> Recent Sessions</h3>{history.length > 0 && <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-mora-400 hover:underline">{showHistory ? 'Collapse' : 'View All'}</button>}</div>
              {history.length === 0 ? (<div className="text-center text-white/40 py-12 bg-[#070707] border border-white/10 rounded-3xl">No formatting sessions yet</div>) : (showHistory && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{history.map(item => (<div key={item.id} className="bg-[#070707] border border-white/10 rounded-3xl p-5 hover:border-mora-500/30 transition-all"><div className="text-xs text-white/50 mb-2">{new Date(item.timestamp).toLocaleString()}</div><div className="font-mono text-sm line-clamp-2 text-white/70 mb-4 break-words">{item.output.substring(0, 120)}...</div><div className="flex flex-wrap gap-2"><button onClick={() => { setJsonInput(item.input); validateAndFormat(item.input); }} className={`${glassPill} flex-1 text-sm`}>Load</button><button onClick={() => copyToClipboard(item.output, 'history')} className={glassPill}>Copy</button><button onClick={() => { const filtered = history.filter(h => h.id !== item.id); setHistory(filtered); if (userId) localStorage.setItem(`apives-history-${userId}`, JSON.stringify(filtered)); }} className={`${glassPill} text-red-400`}><Trash2 size={16} /></button></div></div>))}</div>))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ApiResponseFormatterPage;