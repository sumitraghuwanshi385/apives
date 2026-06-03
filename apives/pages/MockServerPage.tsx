'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Waypoints, CirclePlus, WandSparkles, Copy, Download, Upload,
  Trash2, CheckCircle2, XCircle, Search, ChevronDown,
  Database, BarChart3, Edit3, Activity
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';
import { BackButton } from "../components/BackButton";

// ---------- Types ----------
interface MockEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  statusCode: number;
  delay: number;
  response: string;
  headers: Record<string, string>;
  timestamp: string;
}

// ---------- Helper: compute response intelligence (safe) ----------
interface ResponseIntelligenceData {
  isValidJson: boolean;
  responseType: string;
  responseSize: number;
  estimatedTransferSize: number;
  statusCode: number;
  delay: number;
  createdDate: string;
  headersCount: number;
  isArray: boolean;
  rootKeysCount: number;
  nestedObjectCount: number;
  dataComplexity: 'Low' | 'Medium' | 'High';
}

const computeResponseIntelligence = (endpoint: MockEndpoint | null): ResponseIntelligenceData | null => {
  if (!endpoint) return null;
  let isValidJson = false;
  let parsed: any = null;
  let isArray = false;
  let rootKeysCount = 0;
  let nestedObjectCount = 0;

  try {
    parsed = JSON.parse(endpoint.response);
    isValidJson = true;
    isArray = Array.isArray(parsed);
    if (parsed && typeof parsed === 'object') {
      rootKeysCount = Object.keys(parsed).length;
      const countNested = (obj: any, depth: number = 0): number => {
        if (depth > 2) return 0;
        let count = 0;
        if (obj && typeof obj === 'object') {
          for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
              count++;
              count += countNested(obj[key], depth + 1);
            }
          }
        }
        return count;
      };
      nestedObjectCount = countNested(parsed);
    }
  } catch (e) { /* invalid JSON */ }

  const responseSize = new Blob([endpoint.response || '']).size;
  let responseType = 'Plain Text';
  if (endpoint.headers && endpoint.headers['Content-Type']?.includes('json')) responseType = 'JSON';
  else if (endpoint.headers && endpoint.headers['Content-Type']?.includes('xml')) responseType = 'XML';
  else responseType = 'Plain Text';

  let dataComplexity: 'Low' | 'Medium' | 'High' = 'Low';
  if (isValidJson) {
    if (rootKeysCount > 5 || nestedObjectCount > 3) dataComplexity = 'High';
    else if (rootKeysCount > 2 || nestedObjectCount > 0) dataComplexity = 'Medium';
    else dataComplexity = 'Low';
  }

  // Safe date formatting
  let createdDate = 'Unknown';
  try {
    if (endpoint.timestamp) {
      const d = new Date(endpoint.timestamp);
      if (!isNaN(d.getTime())) createdDate = d.toLocaleDateString();
    }
  } catch (e) { /* ignore */ }

  return {
    isValidJson,
    responseType,
    responseSize,
    estimatedTransferSize: responseSize + 128,
    statusCode: endpoint.statusCode,
    delay: endpoint.delay,
    createdDate,
    headersCount: endpoint.headers ? Object.keys(endpoint.headers).length : 0,
    isArray,
    rootKeysCount,
    nestedObjectCount,
    dataComplexity
  };
};

// ---------- Custom Select (compact version) ----------
interface CustomSelectProps {
  options: { value: string | number; label: string }[];
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label ?? value;

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]"
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 backdrop-blur-xl bg-black/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Glass pill style ----------
const glassPill = "backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97] inline-flex items-center gap-1.5";

// ---------- Safe SyntaxHighlighter ----------
const SafeSyntaxHighlighter: React.FC<{ language: string; children: string }> = ({ language, children }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <pre className="bg-black rounded-xl p-4 overflow-x-auto text-xs font-mono text-red-400 border border-red-500/30">
        Error displaying JSON. Raw response:
        <code className="block whitespace-pre-wrap mt-2">{children}</code>
      </pre>
    );
  }
  try {
    if (!vscDarkPlus) throw new Error('Style not loaded');
    return (
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '12px', fontSize: '12px' }}>
        {children}
      </SyntaxHighlighter>
    );
  } catch (err) {
    setHasError(true);
    return null;
  }
};

// ---------- Storage key helpers ----------
const getUserId = (): string | null => {
  try {
    const userStr = localStorage.getItem("mora_user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.email || user?.id || null;
  } catch {
    return null;
  }
};

const getStorageKey = (isLoggedIn: boolean): string => {
  if (!isLoggedIn) return 'apives-mock-endpoints-guest';
  const userId = getUserId();
  return userId ? `apives-mock-endpoints-${userId}` : 'apives-mock-endpoints-guest';
};

// ---------- Main Component ----------
const MockServerPage: React.FC = () => {
  // --- State ---
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [activeEndpoint, setActiveEndpoint] = useState<MockEndpoint | null>(null);
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    method: 'GET',
    path: '/api/',
    statusCode: 200,
    delay: 0,
    response: '{\n  "success": true,\n  "message": "Mock response from Apives"\n}',
    headers: { "Content-Type": "application/json" }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [copied, setCopied] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editEndpointId, setEditEndpointId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- Auth check ---
  useEffect(() => {
    setIsClient(true);
    try {
      const user = localStorage.getItem("mora_user");
      setIsLoggedIn(!!user);
    } catch (e) {
      console.error("Auth check error:", e);
      setIsLoggedIn(false);
    }
  }, []);

  // --- Load endpoints with correct storage key (runs on mount & auth change) ---
  const loadEndpoints = useCallback(() => {
    const key = getStorageKey(isLoggedIn);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEndpoints(Array.isArray(parsed) ? parsed : []);
      } else {
        setEndpoints([]);
      }
    } catch (e) {
      console.error("Failed to load endpoints:", e);
      setEndpoints([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isClient) return;
    loadEndpoints();
  }, [isClient, isLoggedIn, loadEndpoints]);

  // --- Persist endpoints to current user's storage ---
  const saveEndpoints = useCallback((updated: MockEndpoint[]) => {
    setEndpoints(updated);
    const key = getStorageKey(isLoggedIn);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) { console.error("Save failed:", e); }
  }, [isLoggedIn]);

  // --- Helper: generate mock URL ---
  const generateMockUrl = useCallback((endpoint: MockEndpoint) => {
    return `https://apives.com/mock/${endpoint.id}${endpoint.path}`;
  }, []);

  // --- Validate JSON response ---
  const isValidResponse = (response: string): boolean => {
    const trimmed = response?.trim();
    if (!trimmed) return false;
    try {
      JSON.parse(trimmed);
      return true;
    } catch {
      return false;
    }
  };

  // --- Create or update endpoint ---
  const saveEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.path) {
      alert("Please provide a name and path");
      return;
    }
    if (!isValidResponse(newEndpoint.response)) {
      alert("Invalid JSON in response");
      return;
    }

    const endpointPath = newEndpoint.path.startsWith('/') ? newEndpoint.path : '/' + newEndpoint.path;

    if (isEditing && editEndpointId) {
      const existingIndex = endpoints.findIndex(e => e.id === editEndpointId);
      if (existingIndex === -1) return;
      const updatedEndpoint: MockEndpoint = {
        ...endpoints[existingIndex],
        name: newEndpoint.name,
        method: newEndpoint.method,
        path: endpointPath,
        statusCode: newEndpoint.statusCode,
        delay: newEndpoint.delay,
        response: newEndpoint.response,
        headers: newEndpoint.headers,
        timestamp: new Date().toISOString()
      };
      const updatedEndpoints = [...endpoints];
      updatedEndpoints[existingIndex] = updatedEndpoint;
      saveEndpoints(updatedEndpoints);
      setActiveEndpoint(updatedEndpoint);
      setIsEditing(false);
      setEditEndpointId(null);
    } else {
      if (endpoints.some(e => e.method === newEndpoint.method && e.path === endpointPath)) {
        alert("Endpoint with same method and path already exists");
        return;
      }
      const endpoint: MockEndpoint = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        ...newEndpoint,
        path: endpointPath,
        timestamp: new Date().toISOString()
      };
      const updated = [endpoint, ...endpoints];
      saveEndpoints(updated);
      setActiveEndpoint(endpoint);
    }
    resetForm();
  };

  // Fixed resetForm: clears all fields and exits edit mode
  const resetForm = () => {
    setNewEndpoint({
      name: '',
      method: 'GET',
      path: '/api/',
      statusCode: 200,
      delay: 0,
      response: '{\n  "success": true,\n  "message": "Mock response from Apives"\n}',
      headers: { "Content-Type": "application/json" }
    });
    setIsEditing(false);
    setEditEndpointId(null);
  };

  const startEdit = (endpoint: MockEndpoint) => {
    setNewEndpoint({
      name: endpoint.name,
      method: endpoint.method,
      path: endpoint.path,
      statusCode: endpoint.statusCode,
      delay: endpoint.delay,
      response: endpoint.response,
      headers: endpoint.headers
    });
    setIsEditing(true);
    setEditEndpointId(endpoint.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEndpoint = (id: string) => {
    const endpointToDelete = endpoints.find(e => e.id === id);
    if (endpointToDelete) {
      const updated = endpoints.filter(e => e.id !== id);
      saveEndpoints(updated);
      if (activeEndpoint?.id === id) setActiveEndpoint(null);
    }
  };

  const loadEndpoint = (endpoint: MockEndpoint) => {
    setActiveEndpoint(endpoint);
  };

  const copyToClipboard = async (text: string, label: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const downloadCode = (content: string, filename: string) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Import / Export Collection ---
  const exportCollection = () => {
    const data = JSON.stringify(endpoints, null, 2);
    downloadCode(data, 'mock-collection.json');
    setImportStatus({ type: 'success', message: 'Collection exported!' });
    setTimeout(() => setImportStatus(null), 2000);
  };

  const importCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        if (!Array.isArray(imported)) throw new Error("Invalid format: expected array");

        let addedCount = 0;
        let skippedCount = 0;
        const newEndpoints = [...endpoints];

        imported.forEach((item: any) => {
          if (!item.name || !item.method || !item.path || !item.response) {
            skippedCount++;
            return;
          }
          const isDuplicate = newEndpoints.some(
            e => e.method === item.method && e.path === item.path
          );
          if (isDuplicate) {
            skippedCount++;
            return;
          }
          const newEp: MockEndpoint = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
            name: item.name,
            method: item.method,
            path: item.path.startsWith('/') ? item.path : '/' + item.path,
            statusCode: item.statusCode || 200,
            delay: item.delay || 0,
            response: item.response,
            headers: item.headers || { "Content-Type": "application/json" },
            timestamp: new Date().toISOString()
          };
          newEndpoints.push(newEp);
          addedCount++;
        });

        saveEndpoints(newEndpoints);
        setImportStatus({ type: 'success', message: `Imported ${addedCount} endpoints, skipped ${skippedCount}` });
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err) {
        setImportStatus({ type: 'error', message: 'Invalid JSON file' });
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Computed data (stats, intelligence, filtered lists) ---
  const stats = useMemo(() => {
    const total = endpoints.length;
    const getCount = endpoints.filter(e => e.method === 'GET').length;
    const postCount = endpoints.filter(e => e.method === 'POST').length;
    const putCount = endpoints.filter(e => e.method === 'PUT').length;
    const deleteCount = endpoints.filter(e => e.method === 'DELETE').length;
    const totalSizeBytes = endpoints.reduce((sum, e) => sum + (e.response ? new Blob([e.response]).size : 0), 0);
    const storageUsed = totalSizeBytes / 1024;
    const avgResponseSize = total > 0 ? totalSizeBytes / total : 0;
    return { total, getCount, postCount, putCount, deleteCount, storageUsed, avgResponseSize };
  }, [endpoints]);

  const responseIntelligence = useMemo(() => computeResponseIntelligence(activeEndpoint), [activeEndpoint]);

  const filteredEndpoints = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return endpoints.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(term) ||
                            e.path.toLowerCase().includes(term) ||
                            e.method.toLowerCase().includes(term);
      const matchesFilter = filterMethod === 'All' || e.method === filterMethod;
      return matchesSearch && matchesFilter;
    });
  }, [endpoints, searchTerm, filterMethod]);

  // --- Options for selects ---
  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' },
  ];
  const statusCodeOptions = [
    { value: 200, label: '200 OK' }, { value: 201, label: '201 Created' }, { value: 204, label: '204 No Content' },
    { value: 400, label: '400 Bad Request' }, { value: 401, label: '401 Unauthorized' }, { value: 403, label: '403 Forbidden' },
    { value: 404, label: '404 Not Found' }, { value: 429, label: '429 Too Many Requests' }, { value: 500, label: '500 Internal Server Error' },
  ];
  const delayOptions = [
    { value: 0, label: 'No Delay' }, { value: 100, label: '100ms' }, { value: 200, label: '200ms' },
    { value: 500, label: '500ms' }, { value: 1000, label: '1s' }, { value: 2000, label: '2s' },
  ];
  const filterOptions = [{ value: 'All', label: 'All Methods' }, ...methodOptions];

  // --- Templates (unchanged) ---
  const templates = [
    { name: "User List", json: JSON.stringify({ users: [{ id: 1, name: "John Doe", email: "john@example.com" }] }, null, 2) },
    { name: "Single User", json: JSON.stringify({ id: 1, name: "Jane Smith", email: "jane@example.com" }, null, 2) },
    { name: "Products", json: JSON.stringify({ products: [{ id: "p1", name: "Wireless Headphones", price: 299.99 }] }, null, 2) },
    { name: "Auth Success", json: JSON.stringify({ success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }, null, 2) },
    { name: "Auth Failed", json: JSON.stringify({ success: false, error: "Invalid credentials" }, null, 2) },
    { name: "404 Error", json: JSON.stringify({ error: "Not Found", message: "Resource does not exist" }, null, 2) },
    { name: "500 Error", json: JSON.stringify({ error: "Internal Server Error", message: "Something went wrong" }, null, 2) },
    { name: "Rate Limit", json: JSON.stringify({ error: "Too Many Requests", retryAfter: 60 }, null, 2) },
    { name: "Pagination", json: JSON.stringify({ data: [], page: 1, totalPages: 10, totalItems: 100 }, null, 2) },
    { name: "Payment Success", json: JSON.stringify({ success: true, transactionId: "txn_12345", amount: 99.99 }, null, 2) },
    { name: "Payment Failed", json: JSON.stringify({ success: false, error: "Insufficient funds" }, null, 2) },
    { name: "Order List", json: JSON.stringify({ orders: [{ id: "ord_1", total: 250.00, status: "pending" }] }, null, 2) },
    { name: "Ecommerce Product", json: JSON.stringify({ id: "prod_42", name: "Smart Watch", price: 199.99, rating: 4.5 }, null, 2) },
    { name: "Blog Posts", json: JSON.stringify({ posts: [{ id: "post_1", title: "Hello World", author: "Admin" }] }, null, 2) },
    { name: "Comments", json: JSON.stringify({ comments: [{ id: 1, postId: 1, body: "Great post!" }] }, null, 2) },
    { name: "Chat Messages", json: JSON.stringify({ messages: [{ id: "msg1", from: "user1", text: "Hi there!" }] }, null, 2) },
    { name: "Notification Feed", json: JSON.stringify({ notifications: [{ id: 1, type: "like", read: false }] }, null, 2) },
    { name: "Webhook Success", json: JSON.stringify({ status: "received", id: "whk_123", event: "user.created" }, null, 2) },
    { name: "Webhook Failure", json: JSON.stringify({ status: "failed", error: "Delivery failed", attempts: 3 }, null, 2) },
    { name: "Stripe Event", json: JSON.stringify({ id: "evt_123", type: "payment_intent.succeeded", created: Date.now() }, null, 2) },
    { name: "GitHub Event", json: JSON.stringify({ action: "opened", number: 1, pull_request: { title: "Feature" } }, null, 2) },
    { name: "AI Chat Response", json: JSON.stringify({ choices: [{ message: { role: "assistant", content: "Hello!" } }] }, null, 2) },
    { name: "Weather API", json: JSON.stringify({ location: "New York", temperature: 72, condition: "Sunny" }, null, 2) },
    { name: "Crypto Prices", json: JSON.stringify({ bitcoin: { usd: 45000, change_24h: 2.5 } }, null, 2) },
    { name: "Stock Market", json: JSON.stringify({ symbol: "AAPL", price: 175.50, change: "+1.25" }, null, 2) },
    { name: "Analytics Dashboard", json: JSON.stringify({ pageViews: 12500, uniqueVisitors: 3420, bounceRate: 38.5 }, null, 2) },
    { name: "User Profile", json: JSON.stringify({ id: 1, username: "alice", email: "alice@example.com" }, null, 2) },
    { name: "File Upload Success", json: JSON.stringify({ success: true, fileId: "file_abc" }, null, 2) },
    { name: "Multi User Team", json: JSON.stringify({ teamId: "team_1", members: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }] }, null, 2) },
    { name: "Search Results", json: JSON.stringify({ query: "laptop", results: [{ id: 1, name: "Gaming Laptop" }], totalResults: 42 }, null, 2) },
    { name: "Empty State", json: JSON.stringify({ data: [], message: "No items found" }, null, 2) },
    { name: "JWT Auth", json: JSON.stringify({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", type: "Bearer" }, null, 2) },
    { name: "Users Dashboard", json: JSON.stringify({ totalUsers: 1250, activeUsers: 980, newUsers: 45, chartData: [10,20,30] }, null, 2) },
    { name: "Admin Dashboard", json: JSON.stringify({ metrics: { revenue: 50000, orders: 320 }, recentActivities: ["Order #123 placed"] }, null, 2) },
    { name: "CRM Contacts", json: JSON.stringify({ contacts: [{ id: 1, name: "Alice", company: "Acme Inc" }] }, null, 2) },
    { name: "Invoice Data", json: JSON.stringify({ id: "INV-001", amount: 1500, dueDate: "2025-03-01", status: "pending" }, null, 2) },
    { name: "Payment Gateway", json: JSON.stringify({ success: true, transactionId: "txn_gateway_123", amount: 49.99 }, null, 2) },
    { name: "Webhook Payload", json: JSON.stringify({ event: "user.created", userId: 123, timestamp: new Date().toISOString() }, null, 2) },
    { name: "AI Completion", json: JSON.stringify({ id: "cmpl-123", object: "text_completion", choices: [{ text: "Artificial intelligence is..." }] }, null, 2) },
    { name: "Analytics Report", json: JSON.stringify({ report: "Monthly", data: { views: 5000, clicks: 300 } }, null, 2) },
    { name: "Products Catalog", json: JSON.stringify({ products: [{ id: 1, name: "Laptop", price: 999 }] }, null, 2) },
    { name: "Orders List", json: JSON.stringify({ orders: [{ id: 1, total: 250, status: "shipped" }] }, null, 2) },
    { name: "Notifications Feed", json: JSON.stringify({ notifications: [{ id: 1, message: "Your order is ready" }] }, null, 2) },
    { name: "Support Tickets", json: JSON.stringify({ tickets: [{ id: 1, subject: "Login issue", status: "open" }] }, null, 2) },
  ];

  const loadTemplate = (template: any) => {
    setNewEndpoint(prev => ({ ...prev, response: template.json }));
  };

  // --- Render ---
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-20 md:pt-24 pb-20 relative overflow-x-hidden">
      <div className="absolute top-20 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-xl md:rounded-2xl mb-4 md:mb-6">
            <Waypoints size={28} className="text-mora-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-5xl font-semibold tracking-tighter text-white mb-2">
            Mock Server
          </h1>
          <p className="max-w-md text-xs md:text-base text-white/60 px-2">
            Create realistic mock APIs with dynamic data, error simulation and instant sharing
          </p>
        </div>

        {/* Toast for import/export */}
        {importStatus && (
          <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 ${
            importStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {importStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* LEFT PANEL: Create/Edit + Templates */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="p-1.5 md:p-2.5 bg-white/5 rounded-xl md:rounded-2xl">
                  <CirclePlus size={20} className="text-mora-500 md:w-6 md:h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {isEditing ? 'Edit Endpoint' : 'Create Mock Endpoint'}
                </h2>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Endpoint Name"
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-full px-4 py-2 md:py-3 text-sm focus:border-mora-500 outline-none transition-all"
                />

                <div className="grid grid-cols-2 gap-3">
                  <CustomSelect options={methodOptions} value={newEndpoint.method} onChange={(val) => setNewEndpoint({ ...newEndpoint, method: val as string })} />
                  <CustomSelect options={statusCodeOptions} value={newEndpoint.statusCode} onChange={(val) => setNewEndpoint({ ...newEndpoint, statusCode: val as number })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="/api/users"
                    value={newEndpoint.path}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, path: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-full px-4 py-2 md:py-3 text-sm font-mono focus:border-mora-500 outline-none"
                  />
                  <CustomSelect options={delayOptions} value={newEndpoint.delay} onChange={(val) => setNewEndpoint({ ...newEndpoint, delay: val as number })} />
                </div>

                <textarea
                  value={newEndpoint.response}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, response: e.target.value })}
                  className="w-full h-48 md:h-64 bg-black border border-white/10 focus:border-mora-500 rounded-2xl p-3 md:p-5 font-mono text-xs md:text-sm resize-y"
                  placeholder="Response JSON..."
                />

                <div className="flex gap-3">
                  <button onClick={saveEndpoint} disabled={!newEndpoint.name || !newEndpoint.path} className="flex-1 bg-mora-500 hover:bg-mora-600 disabled:bg-white/10 text-black font-semibold py-2.5 md:py-3.5 rounded-full transition-all active:scale-[0.97]">
                    {isEditing ? 'Update Endpoint' : 'Create Endpoint'}
                  </button>
                  <button onClick={resetForm} className="px-4 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-sm font-medium transition-all active:scale-[0.97]">
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <WandSparkles size={18} className="text-mora-500" />
                <h3 className="font-medium">Quick Templates</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3 max-h-80 overflow-y-auto pr-1">
                {templates.map((t, i) => (
                  <button key={i} onClick={() => loadTemplate(t)} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-3 py-2 text-xs md:text-sm font-medium transition-all active:scale-[0.97] text-left truncate">
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            {/* Active Endpoint Details */}
            {activeEndpoint ? (
              <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4 md:mb-6">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 text-xs bg-mora-500/10 text-mora-400 rounded-full">{activeEndpoint.method}</span>
                      <span className="font-mono text-xs md:text-sm break-all">{activeEndpoint.path}</span>
                    </div>
                    <div className="text-lg md:text-xl font-semibold mt-1 md:mt-2">{activeEndpoint.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(activeEndpoint)} className={glassPill + " text-xs py-1 px-3"}><Edit3 size={14} /> Edit</button>
                    <button onClick={() => setActiveEndpoint(null)} className="text-red-400 text-sm hover:text-red-500">Close</button>
                  </div>
                </div>

                <div className="bg-black rounded-xl md:rounded-2xl p-3 md:p-5 mb-4 md:mb-6 border border-white/10">
                  <div className="text-xs text-white/50 mb-1 md:mb-2">MOCK URL</div>
                  <div className="font-mono text-xs md:text-sm text-mora-400 break-all">{generateMockUrl(activeEndpoint)}</div>
                </div>

                {/* Response Intelligence */}
                {responseIntelligence && (
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 size={16} className="text-mora-500" />
                      <h4 className="font-medium text-sm">Response Intelligence</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Valid JSON</div><div className="text-sm font-semibold flex items-center gap-1 mt-1">{responseIntelligence.isValidJson ? <CheckCircle2 size={14} className="text-green-400" /> : <XCircle size={14} className="text-red-400" />}{responseIntelligence.isValidJson ? 'Yes' : 'No'}</div></div>
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Response Type</div><div className="text-sm font-semibold">{responseIntelligence.responseType}</div></div>
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Size / Transfer</div><div className="text-sm font-semibold">{responseIntelligence.responseSize} B / {responseIntelligence.estimatedTransferSize} B</div></div>
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Status / Delay</div><div className="text-sm font-semibold">{responseIntelligence.statusCode} / {responseIntelligence.delay}ms</div></div>
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Created</div><div className="text-sm font-semibold truncate">{responseIntelligence.createdDate}</div></div>
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Headers</div><div className="text-sm font-semibold">{responseIntelligence.headersCount}</div></div>
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Root Keys / Array</div><div className="text-sm font-semibold">{responseIntelligence.rootKeysCount} {responseIntelligence.isArray && '(Array)'}</div></div>
                      <div className="bg-black/50 rounded-xl p-2 border border-white/5"><div className="text-xs text-white/50">Nested Objects / Complexity</div><div className="text-sm font-semibold">{responseIntelligence.nestedObjectCount} / {responseIntelligence.dataComplexity}</div></div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="font-medium mb-2 text-sm">Response Preview</div>
                  <div className="bg-black rounded-xl md:rounded-2xl overflow-hidden border border-white/10 max-h-64 overflow-y-auto">
                    <SafeSyntaxHighlighter language="json">
                      {activeEndpoint.response}
                    </SafeSyntaxHighlighter>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 md:mt-6">
                  <button onClick={() => copyToClipboard(generateMockUrl(activeEndpoint), 'url')} className={glassPill}>{copied === 'url' ? <CheckCircle2 size={16} /> : <Copy size={16} />}{copied === 'url' ? 'Copied URL' : 'Copy URL'}</button>
                  <button onClick={() => copyToClipboard(activeEndpoint.response, 'json')} className={glassPill}>{copied === 'json' ? <CheckCircle2 size={16} /> : <Copy size={16} />}{copied === 'json' ? 'Copied' : 'Copy JSON'}</button>
                  <button onClick={() => downloadCode(activeEndpoint.response, `${activeEndpoint.name}.json`)} className={glassPill}><Download size={16} /> Download JSON</button>
                </div>
              </div>
            ) : (
              <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white/40">
                <Waypoints size={32} className="mx-auto mb-3 text-white/20" />
                <p>Select an endpoint or create a new one</p>
              </div>
            )}

            {/* Recent Mock Endpoints - visible ONLY when logged in */}
            {isLoggedIn && (
              <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base md:text-xl font-semibold">Recent Mock Endpoints</h3>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="px-2 py-0.5 bg-white/10 rounded-full">Total: {stats.total}</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">GET: {stats.getCount}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">POST: {stats.postCount}</span>
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">PUT: {stats.putCount}</span>
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">DEL: {stats.deleteCount}</span>
                      <span className="px-2 py-0.5 bg-white/10 rounded-full">Storage: {stats.storageUsed.toFixed(1)} KB</span>
                      <span className="px-2 py-0.5 bg-white/10 rounded-full">Avg Size: {stats.avgResponseSize.toFixed(0)} B</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative inline-block">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-black border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-xs w-32 md:w-40 focus:border-mora-500 outline-none"
                      />
                    </div>
                    <CustomSelect options={filterOptions} value={filterMethod} onChange={(val) => setFilterMethod(val as string)} className="w-20" />
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <button onClick={exportCollection} className={glassPill}><Upload size={12} /> Export Collection</button>
                  <button onClick={() => fileInputRef.current?.click()} className={glassPill}><Download size={12} /> Import Collection</button>
                  <input ref={fileInputRef} type="file" accept=".json" onChange={importCollection} className="hidden" />
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredEndpoints.length > 0 ? (
                    filteredEndpoints.map(ep => {
                      const isActive = activeEndpoint?.id === ep.id;
                      return (
                        <div
                          key={ep.id}
                          onClick={() => loadEndpoint(ep)}
                          className={`flex items-center justify-between bg-black/60 hover:bg-black/80 border rounded-xl md:rounded-2xl p-2 md:p-3 cursor-pointer transition-all group ${
                            isActive ? 'border-mora-500 shadow-[0_0_12px_rgba(34,197,94,0.3)] bg-black/80' : 'border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                            <span className="px-2 py-0.5 md:px-2 md:py-0.5 text-[10px] md:text-xs rounded-full bg-white/10 flex-shrink-0">{ep.method}</span>
                            <div className="truncate">
                              <div className="text-sm md:text-base font-medium truncate">{ep.name}</div>
                              <div className="font-mono text-[10px] md:text-xs text-white/50 truncate">{ep.path}</div>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={(e) => { e.stopPropagation(); startEdit(ep); }} className="text-white/60 hover:text-mora-400 p-1" title="Edit"><Edit3 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); deleteEndpoint(ep.id); }} className="text-white/40 hover:text-red-400 p-1" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 md:py-16 text-white/40">
                      <Waypoints size={32} className="mx-auto mb-3 text-white/20" />
                      <p className="text-sm">No mock endpoints created yet</p>
                      <p className="text-xs mt-1">Create your first endpoint to start testing APIs</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockServerPage;