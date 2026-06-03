'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Terminal, Code2, Copy, Download, Upload, Trash2, Clock,
  CheckCircle2, XCircle, Search, Zap 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BackButton } from "../components/BackButton";

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
  payloadCategory: string;
}

const glassPill = "backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]";

const CurlConverterPage: React.FC = () => {
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

  // Auth simulation (same as other Apives tools)
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem("mora_user");

  // Load History
  useEffect(() => {
    if (!isLoggedIn) return;
    const saved = localStorage.getItem('apives-curl-converter-history');
    if (saved) setHistory(JSON.parse(saved));
  }, [isLoggedIn]);

  const saveToHistory = useCallback((data: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if (!isLoggedIn) return;
    const newItem: HistoryItem = {
      ...data,
      id: Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
    const updated = [newItem, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('apives-curl-converter-history', JSON.stringify(updated));
  }, [history, isLoggedIn]);

  const detectInputType = (text: string): 'curl' | 'fetch' | 'axios' | 'unknown' => {
    const t = text.toLowerCase().trim();
    if (t.startsWith('curl')) return 'curl';
    if (t.includes('fetch(') || t.includes('.then(') || t.includes('response.json')) return 'fetch';
    if (t.includes('axios.') || t.includes('axios(')) return 'axios';
    return 'unknown';
  };

  const parseCurl = (curlStr: string) => {
    try {
      const urlMatch = curlStr.match(/"(https?:\/\/[^"]+)"/) || curlStr.match(/'(https?:\/\/[^']+)'/);
      const url = urlMatch ? urlMatch[1] : 'https://api.example.com';
      
      const methodMatch = curlStr.match(/-X\s+([A-Z]+)/);
      const method = methodMatch ? methodMatch[1] : 'GET';

      const headers: Record<string, string> = {};
      const headerMatches = [...curlStr.matchAll(/-H\s+"([^"]+)"/g)];
      headerMatches.forEach(match => {
        const [key, value] = match[1].split(':').map(s => s.trim());
        if (key && value) headers[key] = value;
      });

      const bodyMatch = curlStr.match(/--data-raw\s+'([^']+)'|--data\s+'([^']+)'/);
      const body = bodyMatch ? bodyMatch[1] || bodyMatch[2] : '';

      return { method, url, headers, body };
    } catch {
      return { method: 'GET', url: 'https://api.example.com', headers: {}, body: '' };
    }
  };

  const generateFetchCode = (data: any) => {
    const { method, url, headers, body } = data;
    const headerStr = Object.entries(headers).map(([k, v]) => `    '\( {k}': ' \){v}'`).join(',\n');
    
    return `fetch("${url}", {
  method: "${method}",
  headers: {
${headerStr || "    'Content-Type': 'application/json'"}
  }${body ? `,\n  body: \( {body.startsWith('{') ? body : `' \){body}'`}` : ''}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));`;
  };

  const generateAxiosCode = (data: any) => {
    const { method, url, headers, body } = data;
    const headerStr = Object.entries(headers).map(([k, v]) => `    '\( {k}': ' \){v}'`).join(',\n');
    
    return `axios({
  method: '${method.toLowerCase()}',
  url: '${url}',
  headers: {${headerStr ? '\n' + headerStr : ''}}
${body ? `,\n  data: \( {body.startsWith('{') ? body : `' \){body}'`}` : ''}
})
  .then(res => console.log(res.data))
  .catch(err => console.error('Error:', err));`;
  };

  const handleConvert = async () => {
    if (!input.trim()) {
      setError("Please enter a request");
      return;
    }

    setIsConverting(true);
    setError('');

    try {
      const type = detectInputType(input);
      setInputType(type);

      let parsedData: any = { method: 'GET', url: '', headers: {}, body: '' };

      if (type === 'curl') {
        parsedData = parseCurl(input);
      } else {
        // Basic fallback for Fetch/Axios
        parsedData.url = input.match(/https?:\/\/[^\s'"]+/)?.[0] || 'https://api.example.com';
      }

      const fetchGenerated = generateFetchCode(parsedData);
      const axiosGenerated = generateAxiosCode(parsedData);
      const curlGenerated = input;

      setFetchCode(fetchGenerated);
      setAxiosCode(axiosGenerated);
      setCurlCode(curlGenerated);

      // Request Intelligence
      const info: RequestInfo = {
        method: parsedData.method,
        url: parsedData.url,
        headersCount: Object.keys(parsedData.headers).length,
        queryParamsCount: new URL(parsedData.url).searchParams.toString().length > 0 ? 
          new URL(parsedData.url).searchParams.toString().split('&').length : 0,
        bodySize: parsedData.body ? parsedData.body.length : 0,
        authType: Object.keys(parsedData.headers).some(h => h.toLowerCase().includes('authorization')) ? 'Bearer/Token' : 'None',
        contentType: parsedData.headers['Content-Type'] || 'application/json',
        payloadCategory: parsedData.body && parsedData.body.length > 5000 ? 'Large' : parsedData.body && parsedData.body.length > 500 ? 'Medium' : 'Small'
      };
      setRequestInfo(info);

      saveToHistory({
        inputType: type,
        input,
        fetchCode: fetchGenerated,
        axiosCode: axiosGenerated,
        curlCode: curlGenerated
      });
    } catch (err) {
      setError("Failed to parse request. Please check format.");
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInput(item.input);
    setInputType(item.inputType);
    setFetchCode(item.fetchCode);
    setAxiosCode(item.axiosCode);
    setCurlCode(item.curlCode);
  };

  const clearAll = () => {
    setInput('');
    setFetchCode('');
    setAxiosCode('');
    setCurlCode('');
    setError('');
    setRequestInfo(null);
    setInputType('unknown');
    setSearchTerm('');
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    return history.filter(h => 
      h.input.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

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
            Convert API requests between cURL, Fetch, and Axios instantly with precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-2xl">
                  <Braces size={24} className="text-mora-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Input Request</h2>
                  <p className="text-sm text-white/50">Paste cURL, Fetch or Axios code</p>
                </div>
                {inputType !== 'unknown' && (
                  <div className="ml-auto px-3 py-1 text-xs bg-mora-500/10 text-mora-400 rounded-full font-medium">
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
                  className="flex-1 bg-mora-500 hover:bg-mora-600 disabled:bg-white/10 text-black font-semibold py-3.5 rounded-2xl transition-all disabled:cursor-not-allowed"
                >
                  {isConverting ? 'Converting...' : 'Convert'}
                </button>
                <button
                  onClick={clearAll}
                  className="px-8 border border-white/20 hover:bg-white/5 py-3.5 rounded-2xl text-red-400 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-2xl">
                  <Code2 size={24} className="text-mora-500" />
                </div>
                <h2 className="text-2xl font-semibold">Converted Output</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 flex items-start gap-3">
                  <XCircle size={20} className="mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {(fetchCode || axiosCode) && (
                <div className="space-y-8">
                  {/* Fetch */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <div className="font-medium flex items-center gap-2">Fetch <span className="text-xs text-white/40">JavaScript</span></div>
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(fetchCode, 'fetch')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">
                          {copied === 'fetch' ? '✓ Copied' : 'Copy'}
                        </button>
                        <button onClick={() => downloadCode(fetchCode, 'fetch-request.js')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">Download</button>
                      </div>
                    </div>
                    <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                      <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '20px' }}>
                        {fetchCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {/* Axios */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <div className="font-medium flex items-center gap-2">Axios <span className="text-xs text-white/40">JavaScript</span></div>
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(axiosCode, 'axios')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">
                          {copied === 'axios' ? '✓ Copied' : 'Copy'}
                        </button>
                        <button onClick={() => downloadCode(axiosCode, 'axios-request.js')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">Download</button>
                      </div>
                    </div>
                    <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                      <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '20px' }}>
                        {axiosCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              )}

              {!fetchCode && !axiosCode && (
                <div className="h-96 flex items-center justify-center text-white/40 border border-dashed border-white/10 rounded-3xl">
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
                  {Object.entries(requestInfo).map(([key, value]) => (
                    <div key={key} className="bg-black/60 rounded-2xl p-4">
                      <div className="text-xs text-white/50 tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="font-semibold text-lg">{value}</div>
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

export default CurlConverterPage;