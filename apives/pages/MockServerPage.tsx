'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Waypoints, CirclePlus, History, WandSparkles, Copy, Download, Upload,
  Trash2, Clock, Plus, CheckCircle2, XCircle, Search, Filter, ChevronDown,
  Database, BarChart3, Info, Loader2, FileJson, AlertCircle, Edit3, Save,
  Layers, Hash, TrendingUp, Activity
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

type HistoryAction = 'create' | 'edit' | 'delete' | 'import' | 'export';

interface HistoryItem {
  id: string;
  action: HistoryAction;
  endpointName: string;
  endpointMethod?: string;
  endpointPath?: string;
  timestamp: string;
  details?: string;
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

  return {
    isValidJson,
    responseType,
    responseSize,
    estimatedTransferSize: responseSize + 128,
    statusCode: endpoint.statusCode,
    delay: endpoint.delay,
    createdDate: endpoint.timestamp ? new Date(endpoint.timestamp).toLocaleDateString() : 'Unknown',
    headersCount: endpoint.headers ? Object.keys(endpoint.headers).length : 0,
    isArray,
    rootKeysCount,
    nestedObjectCount,
    dataComplexity
  };
};

// ---------- Custom Select (stable, no glitches) ----------
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
        className="w-full flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]"
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
              className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
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
const glassPill = "backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] inline-flex items-center gap-2";

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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [animateEndpointId, setAnimateEndpointId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editEndpointId, setEditEndpointId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  // --- Auth check (for history) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  // --- Load endpoints & history (with safe JSON.parse) ---
  useEffect(() => {
    if (!isClient) return;
    try {
      const savedEndpoints = localStorage.getItem('apives-mock-endpoints');
      if (savedEndpoints) {
        const parsed = JSON.parse(savedEndpoints);
        setEndpoints(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.error("Failed to load endpoints:", e);
      setEndpoints([]);
    }

    if (isLoggedIn) {
      try {
        const savedHistory = localStorage.getItem('apives-mock-history');
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          setHistory(Array.isArray(parsed) ? parsed : []);
        }
      } catch (e) {
        console.error("Failed to load history:", e);
        setHistory([]);
      }
    }
  }, [isClient, isLoggedIn]);

  // --- Persist endpoints ---
  const saveEndpoints = useCallback((updated: MockEndpoint[]) => {
    setEndpoints(updated);
    try {
      localStorage.setItem('apives-mock-endpoints', JSON.stringify(updated));
    } catch (e) { console.error("Save failed:", e); }
  }, []);

  // --- Add history entry (with safe storage) ---
  const addHistory = useCallback((action: HistoryAction, endpoint: MockEndpoint | null, details?: string) => {
    if (!isLoggedIn) return;
    const newEntry: HistoryItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      action,
      endpointName: endpoint?.name || 'N/A',
      endpointMethod: endpoint?.method,
      endpointPath: endpoint?.path,
      timestamp: new Date().toISOString(),
      details
    };
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 20);
      try {
        localStorage.setItem('apives-mock-history', JSON.stringify(updated));
      } catch (e) { console.error("History save failed:", e); }
      return updated;
    });
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
      // Update existing
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
      addHistory('edit', updatedEndpoint, `Edited from ${endpoints[existingIndex].name}`);
      setIsEditing(false);
      setEditEndpointId(null);
      setAnimateEndpointId(updatedEndpoint.id);
      setTimeout(() => setAnimateEndpointId(null), 500);
    } else {
      // Create new
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
      addHistory('create', endpoint);
      setAnimateEndpointId(endpoint.id);
      setTimeout(() => setAnimateEndpointId(null), 500);
    }
    resetForm();
  };

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
      addHistory('delete', endpointToDelete);
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
    addHistory('export', null, `Exported ${endpoints.length} endpoints`);
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
          addHistory('import', newEp, `Imported from file`);
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

  // --- History handlers ---
  const deleteHistoryItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try { localStorage.setItem('apives-mock-history', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
  };

  const clearAllHistory = () => {
    setHistory([]);
    try { localStorage.setItem('apives-mock-history', JSON.stringify([])); } catch(e) {}
  };

  const exportHistory = () => {
    const data = JSON.stringify(history, null, 2);
    downloadCode(data, 'mock-history.json');
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

  const filteredHistory = useMemo(() => {
    const term = historySearchTerm.toLowerCase();
    return history.filter(item =>
      item.endpointName.toLowerCase().includes(term) ||
      (item.endpointPath && item.endpointPath.toLowerCase().includes(term))
    );
  }, [history, historySearchTerm]);

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

  // --- Templates (expanded) ---
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
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-black pt-20 md:pt-24 pb-20 relative overflow-x-hidden">
      <div className="absolute top-20 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Hero Section - "Mock Server" only, no extra line */}
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
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '12px', fontSize: '12px' }}>
                      {activeEndpoint.response}
                    </SyntaxHighlighter>
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

            {/* Stats Dashboard */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
              <h3 className="text-base md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"><Database size={18} className="text-mora-500" /> Endpoint Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2 md:gap-3">
                <div className="bg-black/60 rounded-xl p-2 md:p-3 text-center"><div className="text-lg md:text-2xl font-bold text-mora-400">{stats.total}</div><div className="text-[10px] md:text-xs text-white/50">Total</div></div>
                <div className="bg-black/60 rounded-xl p-2 md:p-3 text-center"><div className="text-lg md:text-2xl font-bold text-green-400">{stats.getCount}</div><div className="text-[10px] md:text-xs text-white/50">GET</div></div>
                <div className="bg-black/60 rounded-xl p-2 md:p-3 text-center"><div className="text-lg md:text-2xl font-bold text-blue-400">{stats.postCount}</div><div className="text-[10px] md:text-xs text-white/50">POST</div></div>
                <div className="bg-black/60 rounded-xl p-2 md:p-3 text-center"><div className="text-lg md:text-2xl font-bold text-yellow-400">{stats.putCount}</div><div className="text-[10px] md:text-xs text-white/50">PUT</div></div>
                <div className="bg-black/60 rounded-xl p-2 md:p-3 text-center"><div className="text-lg md:text-2xl font-bold text-red-400">{stats.deleteCount}</div><div className="text-[10px] md:text-xs text-white/50">DELETE</div></div>
                <div className="bg-black/60 rounded-xl p-2 md:p-3 text-center"><div className="text-sm md:text-lg font-bold">{stats.storageUsed.toFixed(1)} KB</div><div className="text-[10px] md:text-xs text-white/50">Storage</div></div>
                <div className="bg-black/60 rounded-xl p-2 md:p-3 text-center"><div className="text-sm md:text-lg font-bold">{stats.avgResponseSize.toFixed(0)} B</div><div className="text-[10px] md:text-xs text-white/50">Avg Size</div></div>
              </div>
            </div>

            {/* Mock Endpoints List - always visible */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base md:text-xl font-semibold">Mock Endpoints</h3>
                  <div className="flex gap-1 text-xs">
                    <span className="px-2 py-0.5 bg-white/10 rounded-full">Total: {stats.total}</span>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">GET: {stats.getCount}</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">POST: {stats.postCount}</span>
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">PUT: {stats.putCount}</span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">DEL: {stats.deleteCount}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative"><Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-black border border-white/10 rounded-full pl-8 pr-3 py-1.5 md:py-2 text-xs md:text-sm w-32 md:w-40 focus:border-mora-500 outline-none" /></div>
                  <CustomSelect options={filterOptions} value={filterMethod} onChange={(val) => setFilterMethod(val as string)} className="w-28 md:w-32" />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button onClick={exportCollection} className={glassPill + " text-xs md:text-sm py-1.5 md:py-2"}><Upload size={14} /> Export Collection</button>
                <button onClick={() => fileInputRef.current?.click()} className={glassPill + " text-xs md:text-sm py-1.5 md:py-2"}><Download size={14} /> Import Collection</button>
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

            {/* History Panel (Logged-in only) */}
            {isLoggedIn && (
              <div className="bg-[#070707] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-base md:text-xl font-semibold flex items-center gap-2"><History size={18} className="text-mora-500" /> Recent Activity</h3>
                  <div className="flex gap-2">
                    <button onClick={exportHistory} className={glassPill + " text-xs py-1 px-3"}>Export JSON</button>
                    <button onClick={clearAllHistory} className={glassPill + " text-xs py-1 px-3 text-red-400 hover:text-red-500"}>Clear All</button>
                  </div>
                </div>
                <div className="relative mb-3"><Search size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="text" placeholder="Search history..." value={historySearchTerm} onChange={(e) => setHistorySearchTerm(e.target.value)} className="w-full bg-black border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-xs focus:border-mora-500 outline-none" /></div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-black/40 hover:bg-black/60 rounded-xl p-2 transition-all group">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                            item.action === 'create' ? 'bg-green-500/20 text-green-400' :
                            item.action === 'edit' ? 'bg-blue-500/20 text-blue-400' :
                            item.action === 'delete' ? 'bg-red-500/20 text-red-400' :
                            'bg-white/10'
                          }`}>{item.action}</span>
                          <div className="truncate">
                            <div className="text-xs font-medium truncate">{item.endpointName}</div>
                            <div className="text-[10px] text-white/40 truncate">{item.endpointMethod && item.endpointPath ? `${item.endpointMethod} ${item.endpointPath}` : item.details || ''}</div>
                            <div className="text-[10px] text-white/30">{new Date(item.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                        <button onClick={() => deleteHistoryItem(item.id)} className="text-white/20 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-white/40 text-sm"><Activity size={24} className="mx-auto mb-2 text-white/20" />No activity yet</div>
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