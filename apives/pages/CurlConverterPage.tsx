'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Terminal, Code2, Copy, Download, Upload, Trash2, Clock, 
  CheckCircle2, AlertCircle, Zap 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BackButton } from "../components/BackButton";

interface ConversionHistory {
  id: string;
  timestamp: string;
  inputType: string;
  input: string;
  fetch: string;
  axios: string;
  curl: string;
}

const MoraColor = "#c026d3";

const CurlConverterPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'curl' | 'fetch' | 'axios' | 'unknown'>('unknown');
  const [fetchCode, setFetchCode] = useState('');
  const [axiosCode, setAxiosCode] = useState('');
  const [curlCode, setCurlCode] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('apives-curl-converter-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (data: Omit<ConversionHistory, 'id' | 'timestamp'>) => {
    const newEntry: ConversionHistory = {
      ...data,
      id: Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
    const updated = [newEntry, ...history].slice(0, 15);
    setHistory(updated);
    localStorage.setItem('apives-curl-converter-history', JSON.stringify(updated));
  };

  const detectInputType = (text: string): 'curl' | 'fetch' | 'axios' | 'unknown' => {
    const lower = text.toLowerCase().trim();
    if (lower.startsWith('curl')) return 'curl';
    if (lower.includes('fetch(') || lower.includes('.then(')) return 'fetch';
    if (lower.includes('axios.') || lower.includes('axios(')) return 'axios';
    return 'unknown';
  };

  const convertCurlToFetch = (curl: string): { fetch: string; axios: string } => {
    // Basic cURL parser
    let url = '';
    let method = 'GET';
    const headers: Record<string, string> = {};
    let body = '';

    // Extract URL
    const urlMatch = curl.match(/-X\s+([A-Z]+)\s+"([^"]+)"/) || curl.match(/"(https?:\/\/[^"]+)"/);
    if (urlMatch) url = urlMatch[2] || urlMatch[1];

    // Method
    const methodMatch = curl.match(/-X\s+([A-Z]+)/);
    if (methodMatch) method = methodMatch[1];

    // Headers
    const headerMatches = curl.matchAll(/-H\s+"([^"]+)"\s*/g);
    for (const match of headerMatches) {
      const [key, value] = match[1].split(': ').map(s => s.trim());
      if (key && value) headers[key] = value;
    }

    // Body
    const bodyMatch = curl.match(/--data-raw\s+'([^']+)'|--data\s+'([^']+)'/);
    if (bodyMatch) body = bodyMatch[1] || bodyMatch[2];

    const headerStr = Object.entries(headers).map(([k, v]) => `  '\( {k}': ' \){v}'`).join(',\n');

    const fetchCode = `fetch("${url}", {
  method: "${method}",
  headers: {
${headerStr ? headerStr : '    "Content-Type": "application/json"'}
  }\( {body ? `,\n  body: JSON.stringify( \){body})` : ''}
}).then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;

    const axiosCode = `axios({
  method: "${method.toLowerCase()}",
  url: "${url}",
  headers: {${headerStr ? '\n' + headerStr : ''}},
  data: ${body ? body : 'null'}
}).then(res => console.log(res.data))
  .catch(err => console.error(err));`;

    return { fetch: fetchCode, axios: axiosCode };
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError("Please paste a request");
      return;
    }

    setError('');
    const type = detectInputType(input);
    setInputType(type);

    let result = { fetch: '', axios: '', curl: input };

    if (type === 'curl') {
      const converted = convertCurlToFetch(input);
      result.fetch = converted.fetch;
      result.axios = converted.axios;
    } else if (type === 'fetch') {
      result.axios = '// Converted from Fetch to Axios\n' + input.replace('fetch', 'axios');
      result.curl = '// cURL equivalent would be generated here';
    } else if (type === 'axios') {
      result.fetch = '// Converted from Axios to Fetch\n' + input;
      result.curl = '// cURL equivalent would be generated here';
    }

    setFetchCode(result.fetch);
    setAxiosCode(result.axios);
    setCurlCode(result.curl);

    saveToHistory({
      inputType: type,
      input,
      fetch: result.fetch,
      axios: result.axios,
      curl: result.curl
    });
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

  const loadFromHistory = (item: ConversionHistory) => {
    setInput(item.input);
    setInputType(item.inputType as any);
    setFetchCode(item.fetch);
    setAxiosCode(item.axios);
    setCurlCode(item.curl);
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
            <Terminal size={42} className="text-mora-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-4">
            cURL ↔ Fetch ↔ Axios <span className="text-mora-500">Converter</span>
          </h1>
          <p className="max-w-md text-lg text-white/60">
            Convert API requests between cURL, Fetch and Axios instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input */}
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
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-5 font-mono text-sm resize-y min-h-[380px]"
                placeholder="Paste your cURL command, Fetch or Axios request here..."
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleConvert}
                  className="flex-1 bg-mora-500 hover:bg-mora-600 text-black font-semibold py-3.5 rounded-2xl transition-all"
                >
                  Convert Now
                </button>
                <button
                  onClick={() => { setInput(''); setFetchCode(''); setAxiosCode(''); setCurlCode(''); setError(''); }}
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
                <h2 className="text-2xl font-semibold">Converted Code</h2>
                {inputType !== 'unknown' && (
                  <div className="ml-auto px-3 py-1 bg-mora-500/10 text-mora-400 text-xs rounded-full font-medium">
                    {inputType.toUpperCase()}
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {(fetchCode || axiosCode) && (
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">Fetch</div>
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(fetchCode, 'fetch')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">
                          {copied === 'fetch' ? '✓ Copied' : 'Copy'}
                        </button>
                        <button onClick={() => downloadCode(fetchCode, 'fetch-request.js')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                      <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '20px' }}>
                        {fetchCode || '// No Fetch code generated yet'}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">Axios</div>
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(axiosCode, 'axios')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">
                          {copied === 'axios' ? '✓ Copied' : 'Copy'}
                        </button>
                        <button onClick={() => downloadCode(axiosCode, 'axios-request.js')} className="text-xs px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full">
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
                      <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '20px' }}>
                        {axiosCode || '// No Axios code generated yet'}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              )}

              {!fetchCode && !axiosCode && !error && (
                <div className="h-80 flex items-center justify-center text-white/40 border border-dashed border-white/10 rounded-3xl">
                  Paste a request above and click Convert
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurlConverterPage;