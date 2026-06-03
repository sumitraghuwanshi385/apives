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
  headersCount: number;
  queryParamsCount: number;
  bodySize: number;
  authType: string;
  contentType: string;
  payloadCategory: 'Small' | 'Medium' | 'Large';
}

// ====================== Helpers ======================
const glassPill =
  'backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]';

// Robust cURL parser
function parseCurl(curlCommand: string): ParsedRequest {
  const result: ParsedRequest = {
    method: 'GET',
    url: '',
    headers: {},
    body: null,
  };

  // Extract URL (supports quotes or no quotes)
  const urlMatch = curlCommand.match(/(?:curl\s+)(['"]?)(https?:\/\/[^\s'"]+)\1/);
  if (!urlMatch) throw new Error('No valid URL found in cURL command');
  result.url = urlMatch[2];

  // Method (-X or --request)
  const methodMatch = curlCommand.match(/(?:-X|--request)\s+([A-Z]+)/);
  if (methodMatch) result.method = methodMatch[1];

  // Headers (-H or --header)
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(curlCommand)) !== null) {
    const [key, ...valueParts] = headerMatch[1].split(':');
    if (key && valueParts.length) {
      result.headers[key.trim()] = valueParts.join(':').trim();
    }
  }

  // Body: --data, --data-raw, --data-binary, -d
  const bodyRegex = /(?:--data-raw|--data|--data-binary|-d)\s+(['"])(.*?)\1/s;
  const bodyMatch = curlCommand.match(bodyRegex);
  if (bodyMatch) {
    result.body = bodyMatch[2];
    if (!methodMatch && result.body) result.method = 'POST';
  }

  return result;
}

// Fetch syntax parser (basic but covers most cases)
function parseFetch(fetchCode: string): ParsedRequest {
  const result: ParsedRequest = {
    method: 'GET',
    url: '',
    headers: {},
    body: null,
  };

  // Extract URL
  const urlMatch = fetchCode.match(/fetch\(['"`]([^'"`]+)['"`]/);
  if (!urlMatch) throw new Error('No URL found in Fetch request');
  result.url = urlMatch[1];

  // Method
  const methodMatch = fetchCode.match(/method:\s*['"`]([A-Z]+)['"`]/i);
  if (methodMatch) result.method = methodMatch[1];

  // Headers
  const headersMatch = fetchCode.match(/headers:\s*\{([^}]+)\}/s);
  if (headersMatch) {
    const headerPairs = headersMatch[1].match(/(['"]?)([\w-]+)\1\s*:\s*(['"]?)([^,}\n]+)\3/g);
    headerPairs?.forEach((pair) => {
      const [key, value] = pair.split(':').map((s) => s.trim().replace(/['"]/g, ''));
      if (key && value) result.headers[key] = value;
    });
  }

  // Body
  const bodyMatch = fetchCode.match(/body:\s*(['"`])(.*?)\1/s);
  if (bodyMatch) {
    result.body = bodyMatch[2];
    if (!methodMatch) result.method = 'POST';
  }

  return result;
}

// Axios syntax parser
function parseAxios(axiosCode: string): ParsedRequest {
  const result: ParsedRequest = {
    method: 'GET',
    url: '',
    headers: {},
    body: null,
  };

  // URL
  const urlMatch = axiosCode.match(/(?:url|axios\.(?:get|post|put|patch|delete))\s*:\s*['"`]([^'"`]+)['"`]/i);
  if (!urlMatch) throw new Error('No URL found in Axios request');
  result.url = urlMatch[1];

  // Method
  const methodMatch = axiosCode.match(/method:\s*['"`]([A-Z]+)['"`]/i);
  if (methodMatch) {
    result.method = methodMatch[1];
  } else {
    const shorthand = axiosCode.match(/axios\.(get|post|put|patch|delete)/i);
    if (shorthand) result.method = shorthand[1].toUpperCase();
  }

  // Headers
  const headersMatch = axiosCode.match(/headers:\s*\{([^}]+)\}/s);
  if (headersMatch) {
    const headerPairs = headersMatch[1].match(/(['"]?)([\w-]+)\1\s*:\s*(['"]?)([^,}\n]+)\3/g);
    headerPairs?.forEach((pair) => {
      const [key, value] = pair.split(':').map((s) => s.trim().replace(/['"]/g, ''));
      if (key && value) result.headers[key] = value;
    });
  }

  // Data
  const dataMatch = axiosCode.match(/data:\s*(['"`])(.*?)\1/s);
  if (dataMatch) {
    result.body = dataMatch[2];
    if (!methodMatch) result.method = 'POST';
  }

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

  // History ref to avoid stale closures
  const historyRef = useRef(history);
  historyRef.current = history;

  // Load history from localStorage
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

      // Prevent duplicate identical inputs
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

  // Detect input type
  const detectInputType = useCallback((text: string): 'curl' | 'fetch' | 'axios' | 'unknown' => {
    const trimmed = text.trim();
    if (trimmed.startsWith('curl')) return 'curl';
    if (/fetch\s*\(/.test(trimmed)) return 'fetch';
    if (/axios\.(get|post|put|patch|delete|request)/.test(trimmed)) return 'axios';
    return 'unknown';
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

    try {
      const detectedType = detectInputType(trimmedInput);
      setInputType(detectedType);

      let parsed: ParsedRequest;
      switch (detectedType) {
        case 'curl':
          parsed = parseCurl(trimmedInput);
          break;
        case 'fetch':
          parsed = parseFetch(trimmedInput);
          break;
        case 'axios':
          parsed = parseAxios(trimmedInput);
          break;
        default:
          throw new Error('Unsupported format. Please provide valid cURL, Fetch, or Axios code.');
      }

      if (!parsed.url) throw new Error('Could not extract a valid URL from the request.');

      const fetchGenerated = toFetchCode(parsed);
      const axiosGenerated = toAxiosCode(parsed);
      const curlGenerated = toCurlCode(parsed);

      setFetchCode(fetchGenerated);
      setAxiosCode(axiosGenerated);
      setCurlCode(curlGenerated);

      // Request Intelligence
      let queryParamsCount = 0;
      try {
        const urlObj = new URL(parsed.url);
        queryParamsCount = Array.from(urlObj.searchParams.keys()).length;
      } catch {
        // ignore invalid URL for counting params
      }

      const info: RequestInfo = {
        method: parsed.method,
        url: parsed.url,
        headersCount: Object.keys(parsed.headers).length,
        queryParamsCount,
        bodySize: parsed.body?.length || 0,
        authType: Object.keys(parsed.headers).some(
          (h) => h.toLowerCase().includes('authorization') || h.toLowerCase().includes('apikey')
        )
          ? 'Token/Bearer'
          : 'None',
        contentType: parsed.headers['Content-Type'] || parsed.headers['content-type'] || 'application/json',
        payloadCategory: !parsed.body
          ? 'Small'
          : parsed.body.length > 5000
          ? 'Large'
          : parsed.body.length > 500
          ? 'Medium'
          : 'Small',
      };
      setRequestInfo(info);

      saveToHistory({
        inputType: detectedType,
        input: trimmedInput,
        fetchCode: fetchGenerated,
        axiosCode: axiosGenerated,
        curlCode: curlGenerated,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to parse request. Please check the format.');
    } finally {
      setIsConverting(false);
    }
  }, [input, detectInputType, saveToHistory]);

  // Copy to clipboard
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

  // Load from history
  const loadFromHistory = useCallback(
    (item: HistoryItem) => {
      setInput(item.input);
      setInputType(item.inputType);
      setFetchCode(item.fetchCode);
      setAxiosCode(item.axiosCode);
      setCurlCode(item.curlCode);
      setError('');
      setRequestInfo(null);
    },
    []
  );

  // Clear all
  const clearAll = useCallback(() => {
    setInput('');
    setFetchCode('');
    setAxiosCode('');
    setCurlCode('');
    setError('');
    setRequestInfo(null);
    setInputType('unknown');
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 relative overflow-x-hidden">
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
            <Terminal size={42} className="text-mora-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-4">
            cURL ↔ Fetch ↔ Axios <span className="text-mora-500">Converter</span>
          </h1>
          <p className="max-w-md text-lg text-white/60">
            Convert API requests between cURL, Fetch, and Axios instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-2xl">
                  <Terminal size={24} className="text-mora-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Input Request</h2>
                  <p className="text-sm text-white/50">Paste cURL, Fetch or Axios</p>
                </div>
                {inputType !== 'unknown' && (
                  <div className="ml-auto px-3 py-1 bg-mora-500/10 text-mora-400 text-xs rounded-full">
                    {inputType.toUpperCase()}
                  </div>
                )}
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y min-h-[380px]"
                placeholder="Paste your cURL command, Fetch request, or Axios call here..."
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleConvert}
                  disabled={isConverting || !input.trim()}
                  className="flex-1 bg-mora-500 hover:bg-mora-600 disabled:bg-white/10 text-black font-semibold py-3.5 rounded-2xl transition-all"
                >
                  {isConverting ? 'Converting...' : 'Convert'}
                </button>
                <button onClick={clearAll} className={`${glassPill} text-red-400`}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-2xl">
                  <Code2 size={24} className="text-mora-500" />
                </div>
                <h2 className="text-2xl font-semibold">Converted Output</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 flex gap-3">
                  <XCircle size={20} />
                  {error}
                </div>
              )}

              {fetchCode || axiosCode ? (
                <div className="space-y-8">
                  {/* Fetch Block */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">Fetch</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(fetchCode, 'fetch')}
                          className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full"
                        >
                          {copied === 'fetch' ? '✓ Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => downloadCode(fetchCode, 'fetch-request.js')}
                          className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{ background: 'transparent', padding: '20px' }}
                      >
                        {fetchCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {/* Axios Block */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">Axios</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(axiosCode, 'axios')}
                          className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full"
                        >
                          {copied === 'axios' ? '✓ Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => downloadCode(axiosCode, 'axios-request.js')}
                          className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{ background: 'transparent', padding: '20px' }}
                      >
                        {axiosCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-white/40 border border-dashed border-white/10 rounded-3xl">
                  Paste a request and click Convert
                </div>
              )}
            </div>

            {/* Request Intelligence */}
            {requestInfo && (
              <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity size={20} className="text-mora-500" />
                  <h3 className="text-xl font-semibold">Request Intelligence</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/60 rounded-2xl p-4">
                    <div className="text-xs text-white/50 tracking-widest">Method</div>
                    <div className="font-semibold text-lg tabular-nums">{requestInfo.method}</div>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4">
                    <div className="text-xs text-white/50 tracking-widest">Headers</div>
                    <div className="font-semibold text-lg tabular-nums">{requestInfo.headersCount}</div>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4">
                    <div className="text-xs text-white/50 tracking-widest">Query Params</div>
                    <div className="font-semibold text-lg tabular-nums">{requestInfo.queryParamsCount}</div>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4">
                    <div className="text-xs text-white/50 tracking-widest">Body Size</div>
                    <div className="font-semibold text-lg tabular-nums">{requestInfo.bodySize} bytes</div>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4">
                    <div className="text-xs text-white/50 tracking-widest">Auth Type</div>
                    <div className="font-semibold text-lg tabular-nums">{requestInfo.authType}</div>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4">
                    <div className="text-xs text-white/50 tracking-widest">Content-Type</div>
                    <div className="font-semibold text-lg truncate">{requestInfo.contentType}</div>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4">
                    <div className="text-xs text-white/50 tracking-widest">Payload</div>
                    <div className="font-semibold text-lg">{requestInfo.payloadCategory}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        {isLoggedIn && history.length > 0 && (
          <div className="mt-16">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Clock size={18} className="text-mora-500" /> Recent Conversions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#070707] border border-white/10 rounded-3xl p-5 hover:border-mora-500/30 transition-all"
                >
                  <div className="text-xs text-white/50 mb-3">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <div className="font-mono text-xs line-clamp-2 mb-4 text-white/70">
                    {item.input.substring(0, 140)}...
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadFromHistory(item)} className={glassPill}>
                      Load
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.fetchCode, 'history')}
                      className={glassPill}
                    >
                      Copy Fetch
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

export default CurlConverterPage;