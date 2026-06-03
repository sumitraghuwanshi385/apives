'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Terminal,
  Code2,
  Copy,
  Download,
  Trash2,
  Clock,
  XCircle,
  Activity,
  Search,
  Check,
  AlertTriangle,
  Globe,
  Hash,
  Key,
  FileText,
  Layers,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BackButton } from '../components/BackButton';

// ====================== Types ======================
interface ParsedRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
  authType?: string;
  contentType?: string;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  inputType: 'curl' | 'fetch' | 'axios';
  input: string;
  fetchCode: string;
  axiosCode: string;
  curlCode: string;
}

interface RequestInfo {
  method: string;
  url: string;
  domain: string;
  apiVersion?: string;
  headersCount: number;
  queryParamsCount: number;
  bodySize: number;
  authType: string;
  contentType: string;
  payloadCategory: 'Small' | 'Medium' | 'Large';
  securityWarnings: string[];
  missingHeaders: string[];
}

// ====================== Helpers ======================
const glassPillCompact =
  'backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]';

// Normalize cURL command
function normalizeCurl(curl: string): string {
  return curl
    .replace(/\\\n/g, ' ') // line continuations
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Universal cURL parser
function parseCurl(curlCommand: string): ParsedRequest {
  const normalized = normalizeCurl(curlCommand);
  const result: ParsedRequest = {
    method: 'GET',
    url: '',
    headers: {},
    body: null,
  };

  // Extract URL (supports quotes, no quotes, multiline)
  const urlMatch = normalized.match(/(https?:\/\/[^\s"'\\]+)/i);
  if (!urlMatch) throw new Error('No valid URL found in cURL command');
  result.url = urlMatch[1];

  // Method
  const methodMatch = normalized.match(/(?:-X|--request)\s+([A-Z]+)/);
  if (methodMatch) result.method = methodMatch[1];

  // Headers
  const headerRegex = /(?:-H|--header)\s+['"]([^"']+)['"]/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(normalized)) !== null) {
    const [key, ...valueParts] = headerMatch[1].split(':');
    if (key && valueParts.length) {
      result.headers[key.trim()] = valueParts.join(':').trim();
    }
  }

  // Body: --data-raw, --data, --data-binary, -d
  const bodyRegex = /(?:--data-raw|--data|--data-binary|-d)\s+['"](.*?)['"]/s;
  const bodyMatch = normalized.match(bodyRegex);
  if (bodyMatch) {
    result.body = bodyMatch[1];
    if (!methodMatch && result.body) result.method = 'POST';
  }

  // Auth detection
  const authHeader = Object.entries(result.headers).find(
    ([k]) => k.toLowerCase() === 'authorization'
  );
  if (authHeader) {
    const [, value] = authHeader;
    if (value.toLowerCase().startsWith('bearer ')) result.authType = 'Bearer Token';
    else if (value.toLowerCase().startsWith('basic ')) result.authType = 'Basic Auth';
    else result.authType = 'Custom Token';
  } else if (Object.keys(result.headers).some((k) => k.toLowerCase().includes('api-key'))) {
    result.authType = 'API Key';
  } else {
    result.authType = 'None';
  }

  result.contentType = result.headers['Content-Type'] || result.headers['content-type'] || 'application/json';
  return result;
}

// Fetch parser (supports async/await, JSON.stringify, template literals, multiline)
function parseFetch(fetchCode: string): ParsedRequest {
  const result: ParsedRequest = {
    method: 'GET',
    url: '',
    headers: {},
    body: null,
  };

  // Extract URL (handle template literals partially)
  const urlMatch = fetchCode.match(/fetch\(\s*([`'"])(.*?)\1/s);
  if (!urlMatch) throw new Error('No URL found in Fetch request');
  result.url = urlMatch[2];

  // Try to find options object
  const optionsMatch = fetchCode.match(/fetch\([^,]+,\s*\{([\s\S]*?)\}\)/);
  if (optionsMatch) {
    const opts = optionsMatch[1];
    const methodMatch = opts.match(/method:\s*['"`]([A-Z]+)['"`]/i);
    if (methodMatch) result.method = methodMatch[1];
    const headersMatch = opts.match(/headers:\s*\{([\s\S]*?)\}/);
    if (headersMatch) {
      const headerPairs = headersMatch[1].match(/(['"]?)([\w-]+)\1\s*:\s*(['"]?)([^,}\n]+)\3/g);
      headerPairs?.forEach((pair) => {
        const [key, value] = pair.split(':').map((s) => s.trim().replace(/['"]/g, ''));
        if (key && value) result.headers[key] = value;
      });
    }
    const bodyMatch = opts.match(/body:\s*(['"`])([\s\S]*?)\1/);
    if (bodyMatch) {
      result.body = bodyMatch[2];
    } else {
      const jsonStringifyMatch = opts.match(/body:\s*JSON\.stringify\(([^)]+)\)/);
      if (jsonStringifyMatch) result.body = jsonStringifyMatch[1];
    }
  }

  // Detect auth from headers
  if (result.headers['Authorization']) result.authType = 'Bearer Token';
  else if (Object.keys(result.headers).some((k) => k.toLowerCase().includes('api-key'))) result.authType = 'API Key';
  else result.authType = 'None';
  result.contentType = result.headers['Content-Type'] || 'application/json';
  return result;
}

// Axios parser (supports all shorthands and full config)
function parseAxios(axiosCode: string): ParsedRequest {
  const result: ParsedRequest = {
    method: 'GET',
    url: '',
    headers: {},
    body: null,
  };

  // Shorthand: axios.get(url, config)
  const shorthandMatch = axiosCode.match(/axios\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/);
  if (shorthandMatch) {
    result.method = shorthandMatch[1].toUpperCase();
    result.url = shorthandMatch[2];
    // Extract data for POST/PUT/PATCH
    if (['post', 'put', 'patch'].includes(shorthandMatch[1])) {
      const dataMatch = axiosCode.match(new RegExp(`axios\\.${shorthandMatch[1]}\\s*\\([^,]+,\\s*([^,)]+)`));
      if (dataMatch) {
        let data = dataMatch[1].trim();
        if (data.startsWith('{') || data.startsWith('[')) result.body = data;
        else if (data.match(/^['"`]/)) result.body = data.slice(1, -1);
      }
    }
    // Extract headers from config
    const headersMatch = axiosCode.match(/headers:\s*\{([\s\S]*?)\}/);
    if (headersMatch) {
      const headerPairs = headersMatch[1].match(/(['"]?)([\w-]+)\1\s*:\s*(['"]?)([^,}\n]+)\3/g);
      headerPairs?.forEach((pair) => {
        const [key, value] = pair.split(':').map((s) => s.trim().replace(/['"]/g, ''));
        if (key && value) result.headers[key] = value;
      });
    }
  } else {
    // Full axios({ method, url, headers, data })
    const configMatch = axiosCode.match(/axios\(\s*\{([\s\S]*?)\}\s*\)/);
    if (!configMatch) throw new Error('Invalid Axios format');
    const config = configMatch[1];
    const methodMatch = config.match(/method:\s*['"`]([A-Z]+)['"`]/i);
    if (methodMatch) result.method = methodMatch[1];
    const urlMatch = config.match(/url:\s*['"`]([^'"`]+)['"`]/);
    if (urlMatch) result.url = urlMatch[1];
    const headersMatch = config.match(/headers:\s*\{([\s\S]*?)\}/);
    if (headersMatch) {
      const headerPairs = headersMatch[1].match(/(['"]?)([\w-]+)\1\s*:\s*(['"]?)([^,}\n]+)\3/g);
      headerPairs?.forEach((pair) => {
        const [key, value] = pair.split(':').map((s) => s.trim().replace(/['"]/g, ''));
        if (key && value) result.headers[key] = value;
      });
    }
    const dataMatch = config.match(/data:\s*([^,}\n]+)/);
    if (dataMatch) result.body = dataMatch[1].trim();
  }

  // Auth detection
  if (result.headers['Authorization']) result.authType = 'Bearer Token';
  else if (Object.keys(result.headers).some((k) => k.toLowerCase().includes('api-key'))) result.authType = 'API Key';
  else result.authType = 'None';
  result.contentType = result.headers['Content-Type'] || 'application/json';
  return result;
}

// Convert parsed request to Fetch code
function toFetchCode(req: ParsedRequest): string {
  const headers = Object.entries(req.headers)
    .map(([k, v]) => `    "${k}": "${v.replace(/"/g, '\\"')}"`)
    .join(',\n');
  const bodyPart = req.body
    ? `,\n  body: ${req.body.startsWith('{') || req.body.startsWith('[') ? req.body : JSON.stringify(req.body)}`
    : '';
  return `fetch("${req.url}", {
  method: "${req.method}",
  headers: {
${headers || '    "Content-Type": "application/json"'}
  }${bodyPart}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));`;
}

// Convert parsed request to Axios code
function toAxiosCode(req: ParsedRequest): string {
  const headers = Object.entries(req.headers)
    .map(([k, v]) => `    "${k}": "${v.replace(/"/g, '\\"')}"`)
    .join(',\n');
  const bodyPart = req.body
    ? `,\n  data: ${req.body.startsWith('{') || req.body.startsWith('[') ? req.body : JSON.stringify(req.body)}`
    : '';
  return `axios({
  method: "${req.method.toLowerCase()}",
  url: "${req.url}",
  headers: {${headers ? `\n${headers}\n  ` : ''}}${bodyPart}
})
  .then(res => console.log(res.data))
  .catch(err => console.error('Error:', err));`;
}

// Convert parsed request to cURL code
function toCurlCode(req: ParsedRequest): string {
  let curl = `curl -X ${req.method} "${req.url}"`;
  for (const [key, value] of Object.entries(req.headers)) {
    curl += ` \\\n  -H "${key}: ${value}"`;
  }
  if (req.body) {
    curl += ` \\\n  --data-raw '${req.body.replace(/'/g, "\\'")}'`;
  }
  return curl;
}

// ====================== Component ======================
const CurlConverterPage: React.FC = () => {
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem('mora_user');
    setIsLoggedIn(!!user);
  }, []);

  // State
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'curl' | 'fetch' | 'axios' | 'unknown'>('unknown');
  const [fetchCode, setFetchCode] = useState('');
  const [axiosCode, setAxiosCode] = useState('');
  const [curlCode, setCurlCode] = useState('');
  const [error, setError] = useState('');
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [autoDetect, setAutoDetect] = useState(true);

  // Refs
  const historyRef = useRef(history);
  historyRef.current = history;

  // Load history
  useEffect(() => {
    if (!isLoggedIn) {
      setHistory([]);
      return;
    }
    const saved = localStorage.getItem('apives-curl-converter-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed) ? parsed.slice(0, 20) : []);
      } catch {
        setHistory([]);
      }
    }
  }, [isLoggedIn]);

  // Save to history with duplicate prevention
  const saveToHistory = useCallback(
    (data: Omit<HistoryItem, 'id' | 'timestamp'>) => {
      if (!isLoggedIn) return;
      const exists = historyRef.current.some((item) => item.input === data.input);
      if (exists) return;
      const newItem: HistoryItem = {
        ...data,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
      };
      const updated = [newItem, ...historyRef.current].slice(0, 20);
      setHistory(updated);
      localStorage.setItem('apives-curl-converter-history', JSON.stringify(updated));
    },
    [isLoggedIn]
  );

  // Auto-detect input type while typing
  useEffect(() => {
    if (!autoDetect || !input.trim()) return;
    const detected = (() => {
      const t = input.trim();
      if (t.startsWith('curl')) return 'curl';
      if (/fetch\s*\(/.test(t)) return 'fetch';
      if (/axios\.(get|post|put|patch|delete|request)/.test(t)) return 'axios';
      return 'unknown';
    })();
    setInputType(detected);
  }, [input, autoDetect]);

  // Memoized parsing functions for performance
  const parseRequest = useCallback((rawInput: string, detectedType: 'curl' | 'fetch' | 'axios'): ParsedRequest => {
    switch (detectedType) {
      case 'curl': return parseCurl(rawInput);
      case 'fetch': return parseFetch(rawInput);
      case 'axios': return parseAxios(rawInput);
      default: throw new Error('Unsupported format');
    }
  }, []);

  // Main conversion logic
  const handleConvert = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError('Please paste a request (cURL, Fetch, or Axios)');
      return;
    }

    setIsConverting(true);
    setError('');
    setSuccessToast(null);

    try {
      let detectedType = inputType;
      if (detectedType === 'unknown') {
        detectedType = (() => {
          if (trimmedInput.startsWith('curl')) return 'curl';
          if (/fetch\s*\(/.test(trimmedInput)) return 'fetch';
          if (/axios\.(get|post|put|patch|delete|request)/.test(trimmedInput)) return 'axios';
          throw new Error('Could not detect request format. Please provide valid cURL, Fetch, or Axios.');
        })();
        setInputType(detectedType);
      }

      const parsed = parseRequest(trimmedInput, detectedType);
      if (!parsed.url) throw new Error('No valid URL found in the request.');

      const fetchGenerated = toFetchCode(parsed);
      const axiosGenerated = toAxiosCode(parsed);
      const curlGenerated = toCurlCode(parsed);

      setFetchCode(fetchGenerated);
      setAxiosCode(axiosGenerated);
      setCurlCode(curlGenerated);

      // Build Request Intelligence
      let queryParamsCount = 0;
      let domain = '';
      let apiVersion: string | undefined;
      try {
        const urlObj = new URL(parsed.url);
        domain = urlObj.hostname;
        queryParamsCount = Array.from(urlObj.searchParams.keys()).length;
        const versionMatch = urlObj.pathname.match(/\/v\d+\//);
        if (versionMatch) apiVersion = versionMatch[0].slice(1, -1);
      } catch { /* ignore */ }

      const securityWarnings: string[] = [];
      const missingHeaders: string[] = [];
      if (!parsed.headers['Authorization'] && !parsed.headers['authorization'] && parsed.authType === 'None') {
        if (parsed.url.includes('/api/') || parsed.url.includes('/v1/') || parsed.url.includes('/v2/')) {
          missingHeaders.push('Authorization');
          securityWarnings.push('No authentication header detected for API endpoint');
        }
      }
      if (!parsed.headers['Content-Type'] && parsed.body) {
        missingHeaders.push('Content-Type');
        securityWarnings.push('Missing Content-Type header for request body');
      }

      const info: RequestInfo = {
        method: parsed.method,
        url: parsed.url,
        domain,
        apiVersion,
        headersCount: Object.keys(parsed.headers).length,
        queryParamsCount,
        bodySize: parsed.body?.length || 0,
        authType: parsed.authType || 'None',
        contentType: parsed.contentType || 'application/json',
        payloadCategory: !parsed.body ? 'Small' : parsed.body.length > 5000 ? 'Large' : parsed.body.length > 500 ? 'Medium' : 'Small',
        securityWarnings,
        missingHeaders,
      };
      setRequestInfo(info);

      saveToHistory({
        inputType: detectedType,
        input: trimmedInput,
        fetchCode: fetchGenerated,
        axiosCode: axiosGenerated,
        curlCode: curlGenerated,
      });

      setSuccessToast('Conversion successful!');
      setTimeout(() => setSuccessToast(null), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to parse request. Please check the format.');
    } finally {
      setIsConverting(false);
    }
  }, [input, inputType, parseRequest, saveToHistory]);

  // Copy to clipboard with feedback
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  }, []);

  // Download code
  const downloadCode = useCallback((code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Copy all three outputs
  const copyAll = useCallback(() => {
    const all = `// Fetch\n${fetchCode}\n\n// Axios\n${axiosCode}\n\n// cURL\n${curlCode}`;
    copyToClipboard(all, 'all');
  }, [fetchCode, axiosCode, curlCode, copyToClipboard]);

  // Download all as a single file
  const downloadAll = useCallback(() => {
    const content = `// Fetch\n${fetchCode}\n\n// Axios\n${axiosCode}\n\n// cURL\n${curlCode}`;
    downloadCode(content, 'converted-requests.txt');
  }, [fetchCode, axiosCode, curlCode, downloadCode]);

  const clearOutput = useCallback(() => {
    setFetchCode('');
    setAxiosCode('');
    setCurlCode('');
    setRequestInfo(null);
    setError('');
  }, []);

  const loadFromHistory = useCallback((item: HistoryItem) => {
    setInput(item.input);
    setInputType(item.inputType);
    setFetchCode(item.fetchCode);
    setAxiosCode(item.axiosCode);
    setCurlCode(item.curlCode);
    setError('');
    setRequestInfo(null);
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    const updated = historyRef.current.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('apives-curl-converter-history', JSON.stringify(updated));
  }, []);

  const clearAllHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('apives-curl-converter-history');
  }, []);

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curl-converter-history-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [history]);

  const clearAll = useCallback(() => {
    setInput('');
    setFetchCode('');
    setAxiosCode('');
    setCurlCode('');
    setError('');
    setRequestInfo(null);
    setInputType('unknown');
  }, []);

  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return history;
    const searchLower = historySearch.toLowerCase();
    return history.filter((item) => item.input.toLowerCase().includes(searchLower) || item.inputType.includes(searchLower));
  }, [history, historySearch]);

  // Helper for method badge color
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/20 text-green-400';
      case 'POST': return 'bg-blue-500/20 text-blue-400';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400';
      case 'PATCH': return 'bg-purple-500/20 text-purple-400';
      case 'DELETE': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 md:pt-28 pb-16 relative overflow-x-hidden">
      <div className="absolute top-20 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-2 md:p-3 bg-white/10 rounded-xl md:rounded-2xl mb-4 md:mb-6">
            <Terminal size={28} className="text-mora-500 md:w-[42px] md:h-[42px]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-6xl font-semibold tracking-tighter text-white mb-2 md:mb-4">
            cURL ↔ Fetch ↔ Axios <span className="text-mora-500">Converter</span>
          </h1>
          <p className="max-w-md text-sm md:text-lg text-white/60">
            Convert API requests between cURL, Fetch, and Axios instantly
          </p>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="fixed bottom-4 right-4 z-50 bg-green-500/90 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Check size={16} /> {successToast}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
                <div className="p-2 bg-white/5 rounded-xl md:rounded-2xl">
                  <Terminal size={20} className="text-mora-500 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold">Input Request</h2>
                  <p className="text-xs md:text-sm text-white/50">Paste cURL, Fetch or Axios</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs text-white/50">
                    <input type="checkbox" checked={autoDetect} onChange={(e) => setAutoDetect(e.target.checked)} className="rounded" />
                    Auto-detect
                  </label>
                  {inputType !== 'unknown' && (
                    <div className="px-2 py-0.5 md:px-3 md:py-1 bg-mora-500/10 text-mora-400 text-[10px] md:text-xs rounded-full">
                      {inputType.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 md:h-96 bg-black border border-white/10 focus:border-mora-500 rounded-xl md:rounded-2xl p-3 md:p-5 font-mono text-xs md:text-sm resize-y min-h-[200px] md:min-h-[380px]"
                placeholder="Paste your cURL command, Fetch request, or Axios call here..."
              />

              <div className="flex gap-2 md:gap-3 mt-4 md:mt-6">
                <button
                  onClick={handleConvert}
                  disabled={isConverting || !input.trim()}
                  className="flex-1 bg-mora-500 hover:bg-mora-600 disabled:bg-white/10 text-black font-semibold py-2 md:py-3.5 rounded-full text-sm md:text-base transition-all"
                >
                  {isConverting ? 'Converting...' : 'Convert'}
                </button>
                <button onClick={clearAll} className={`${glassPillCompact} text-red-400`}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Output Panel - Three sections */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 bg-white/5 rounded-xl md:rounded-2xl">
                    <Code2 size={20} className="text-mora-500 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-semibold">Converted Output</h2>
                </div>
                {(fetchCode || axiosCode || curlCode) && (
                  <div className="flex gap-2">
                    <button onClick={copyAll} className={`${glassPillCompact} flex items-center gap-1`}>
                      <Copy size={12} /> Copy All
                    </button>
                    <button onClick={downloadAll} className={`${glassPillCompact} flex items-center gap-1`}>
                      <Download size={12} /> Download All
                    </button>
                    <button onClick={clearOutput} className={`${glassPillCompact} text-red-400`}>
                      Clear Output
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/30 rounded-xl md:rounded-2xl text-red-400 flex gap-2 md:gap-3 text-sm">
                  <XCircle size={18} className="md:w-5 md:h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {(fetchCode || axiosCode || curlCode) ? (
                <div className="space-y-6 md:space-y-8">
                  {/* Fetch Block */}
                  <div>
                    <div className="flex justify-between items-center mb-2 md:mb-3">
                      <div className="font-medium text-sm md:text-base">Fetch</div>
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(fetchCode, 'fetch')} className="text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                          {copied === 'fetch' ? <Check size={12} /> : <Copy size={12} />}
                          {copied === 'fetch' ? 'Copied' : 'Copy'}
                        </button>
                        <button onClick={() => downloadCode(fetchCode, 'fetch-request.js')} className="text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                          <Download size={12} /> Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-black rounded-xl md:rounded-2xl overflow-auto border border-white/10 max-h-[200px] md:max-h-[280px]">
                      <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers customStyle={{ background: 'transparent', padding: '12px', margin: 0, fontSize: '12px' }}>
                        {fetchCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {/* Axios Block */}
                  <div>
                    <div className="flex justify-between items-center mb-2 md:mb-3">
                      <div className="font-medium text-sm md:text-base">Axios</div>
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(axiosCode, 'axios')} className="text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                          {copied === 'axios' ? <Check size={12} /> : <Copy size={12} />}
                          {copied === 'axios' ? 'Copied' : 'Copy'}
                        </button>
                        <button onClick={() => downloadCode(axiosCode, 'axios-request.js')} className="text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                          <Download size={12} /> Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-black rounded-xl md:rounded-2xl overflow-auto border border-white/10 max-h-[200px] md:max-h-[280px]">
                      <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers customStyle={{ background: 'transparent', padding: '12px', margin: 0, fontSize: '12px' }}>
                        {axiosCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {/* cURL Block - NEW */}
                  <div>
                    <div className="flex justify-between items-center mb-2 md:mb-3">
                      <div className="font-medium text-sm md:text-base">cURL</div>
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(curlCode, 'curl')} className="text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                          {copied === 'curl' ? <Check size={12} /> : <Copy size={12} />}
                          {copied === 'curl' ? 'Copied' : 'Copy'}
                        </button>
                        <button onClick={() => downloadCode(curlCode, 'curl-command.sh')} className="text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                          <Download size={12} /> Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-black rounded-xl md:rounded-2xl overflow-auto border border-white/10 max-h-[200px] md:max-h-[280px]">
                      <SyntaxHighlighter language="bash" style={vscDarkPlus} showLineNumbers customStyle={{ background: 'transparent', padding: '12px', margin: 0, fontSize: '12px' }}>
                        {curlCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 md:h-80 flex items-center justify-center text-white/40 border border-dashed border-white/10 rounded-xl md:rounded-3xl text-sm">
                  Paste a request and click Convert
                </div>
              )}
            </div>

            {/* Request Intelligence - Enhanced */}
            {requestInfo && (
              <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <Activity size={18} className="text-mora-500 md:w-5 md:h-5" />
                  <h3 className="text-base md:text-xl font-semibold">Request Intelligence</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mb-4">
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Method</div>
                    <div className={`font-semibold text-sm md:text-lg tabular-nums inline-block px-2 py-0.5 rounded-full ${getMethodColor(requestInfo.method)}`}>
                      {requestInfo.method}
                    </div>
                  </div>
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Headers</div>
                    <div className="font-semibold text-sm md:text-lg">{requestInfo.headersCount}</div>
                  </div>
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Query Params</div>
                    <div className="font-semibold text-sm md:text-lg">{requestInfo.queryParamsCount}</div>
                  </div>
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Body Size</div>
                    <div className="font-semibold text-sm md:text-lg">{requestInfo.bodySize} b</div>
                  </div>
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Auth Type</div>
                    <div className="font-semibold text-sm md:text-lg truncate">{requestInfo.authType}</div>
                  </div>
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Content-Type</div>
                    <div className="font-semibold text-sm md:text-lg truncate">{requestInfo.contentType}</div>
                  </div>
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Payload</div>
                    <div className="font-semibold text-sm md:text-lg">{requestInfo.payloadCategory}</div>
                  </div>
                  <div className="bg-black/60 rounded-xl md:rounded-2xl p-2 md:p-4">
                    <div className="text-[10px] md:text-xs text-white/50 tracking-widest">Domain</div>
                    <div className="font-semibold text-sm md:text-lg truncate">{requestInfo.domain || '—'}</div>
                  </div>
                </div>
                {/* Security warnings */}
                {(requestInfo.securityWarnings.length > 0 || requestInfo.missingHeaders.length > 0) && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold mb-2">
                      <AlertTriangle size={14} /> Recommendations
                    </div>
                    {requestInfo.missingHeaders.length > 0 && (
                      <div className="text-yellow-300/80 text-xs">Missing headers: {requestInfo.missingHeaders.join(', ')}</div>
                    )}
                    {requestInfo.securityWarnings.map((w, i) => (
                      <div key={i} className="text-yellow-300/80 text-xs">{w}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* History Section with full management */}
        {isLoggedIn && history.length > 0 && (
          <div className="mt-12 md:mt-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-medium flex items-center gap-2">
                <Clock size={16} className="text-mora-500 md:w-[18px] md:h-[18px]" /> Recent Conversions
              </h3>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="text" placeholder="Search history..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} className="pl-7 pr-2 py-1 text-xs bg-black/50 border border-white/10 rounded-full focus:border-mora-500 outline-none" />
                </div>
                <button onClick={exportHistory} className={`${glassPillCompact} flex items-center gap-1`}><Download size={12} /> Export</button>
                <button onClick={clearAllHistory} className={`${glassPillCompact} text-red-400 flex items-center gap-1`}><Trash2 size={12} /> Clear all</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="bg-[#070707] border border-white/10 rounded-2xl p-3 md:p-5 hover:border-mora-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] md:text-xs text-white/50">{new Date(item.timestamp).toLocaleString()}</div>
                    <button onClick={() => deleteHistoryItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                  <div className="font-mono text-[10px] md:text-xs line-clamp-2 mb-3 text-white/70">{item.input.substring(0, 120)}...</div>
                  <div className="flex gap-2">
                    <button onClick={() => loadFromHistory(item)} className={glassPillCompact}>Load</button>
                    <button onClick={() => copyToClipboard(item.fetchCode, 'history')} className={glassPillCompact}>Copy Fetch</button>
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

export default CurlConverterPage;