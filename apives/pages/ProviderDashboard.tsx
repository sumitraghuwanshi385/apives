import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Plus, Terminal, RefreshCw, BarChart2, Settings, Shield, 
    CheckCircle2, User, Mail, Key, Edit3, Trash2, Save, X, PauseCircle, PlayCircle,
    Cpu, Activity, Zap, Bookmark, LogOut, Globe, TrendingUp, Clock, LayoutGrid, Radio,
    Trash, Image as ImageIcon, ListPlus, Hash, ShieldAlert, AlertTriangle, Info
} from 'lucide-react';
import { MOCK_ANALYTICS } from '../services/mockData';
import { apiService } from '../services/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import { CustomSelect } from '../components/CustomSelect';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface UserProfile {
    name: string;
    email: string;
    type: string;
    joined: string;
}

const Tooltip: React.FC<{ children: React.ReactNode; content: string }> = ({ children, content }) => {
  return (
    <div className="group/tooltip relative flex items-center justify-center">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover/tooltip:block px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap border border-white/10 shadow-xl z-50 animate-fade-in pointer-events-none">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'nodes' | 'saved' | 'settings'>('nodes');
  const [loading, setLoading] = useState(true);
  const [myNodes, setMyNodes] = useState<any[]>([]);
  const [savedNodes, setSavedNodes] = useState<any[]>([]);
  const [analyticsOpenId, setAnalyticsOpenId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Modal States
  const [editingNode, setEditingNode] = useState<any | null>(null);
  const [deletingNode, setDeletingNode] = useState<any | null>(null);

  const categoryOptions = ['Identity', 'Payments', 'Crypto', 'AI', 'Data', 'Messaging', 'Infrastructure', 'eCommerce', 'Health', 'Social', 'Travel'];
  const pricingOptions = ['Free', 'Freemium', 'Paid'];
  const latencyOptions = ['Low', 'Medium', 'High'];
  const stabilityOptions = ['Stable', 'Beta', 'Experimental'];
  const accessOptions = ['Public', 'Auth required', 'Partner only'];
  const methodOptions = ['GET', 'POST', 'PUT', 'DELETE'];

 
const loadNodes = async () => {
  try {
    // ✅ MY NODES from backend
    const my = await apiService.getMyApis();

    const normalizedMy = (my || []).map((n: any) => ({
      ...n,
      id: n._id || n.id,
      status: n.status || 'active',
    }));

    setMyNodes(normalizedMy);

    // ✅ SAVED (still localStorage ids, but data from backend)
    const savedIds = JSON.parse(localStorage.getItem('mora_liked_apis') || '[]');

    const all = await apiService.getAllApis();
    const normalizedAll = (all || []).map((a: any) => ({
      ...a,
      id: a._id || a.id,
    }));

    setSavedNodes(normalizedAll.filter((api: any) => savedIds.includes(api.id)));
  } catch (e) {
    console.error('loadNodes failed:', e);
    showNotification('Failed to load nodes from backend');
  }
};

useEffect(() => {
  const storedUser = localStorage.getItem('mora_user');
  if (!storedUser) {
    navigate('/access');
    return;
  }

  const parsed = JSON.parse(storedUser);
  setUser({ ...parsed, joined: 'Oct 2023' });

  (async () => {
    setLoading(true);
    await loadNodes();     // ✅ ab backend se fetch hoga
    setLoading(false);
  })();
}, [navigate]);

  const showNotification = (msg: string) => {
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusToggle = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      const nodeToUpdate = myNodes.find(n => n.id === id);
      if (!nodeToUpdate) return;

      const newStatus = nodeToUpdate.status === 'active' ? 'paused' : 'active';
      const updatedNodes = myNodes.map(n => n.id === id ? { ...n, status: newStatus } : n);
      setMyNodes(updatedNodes);

      const localApis = JSON.parse(localStorage.getItem('mora_local_apis') || '[]');
      const updatedLocal = localApis.map((a: any) => a.id === id ? { ...a, status: newStatus } : a);
      localStorage.setItem('mora_local_apis', JSON.stringify(updatedLocal));
      
      showNotification(`Node ${nodeToUpdate.name} is now ${newStatus}`);
  };

  const toggleAnalytics = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setAnalyticsOpenId(analyticsOpenId === id ? null : id);
  };

  const handleDeleteClick = (node: any, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDeletingNode(node);
  };

  const confirmDelete = () => {
      if (!deletingNode) return;
      
      const id = deletingNode.id;
      setMyNodes(prev => prev.filter(node => node.id !== id));
      
      const localApis = JSON.parse(localStorage.getItem('mora_local_apis') || '[]');
      localStorage.setItem('mora_local_apis', JSON.stringify(localApis.filter((a: any) => a.id !== id)));
      
      setDeletingNode(null);
      showNotification('Node decommissioned and purged from grid');
  };

  const handleEditClick = (node: any, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setEditingNode({
          ...node,
          provider: node.provider || user?.name || '',
          pricing: {
              type: node.pricing?.type || 'Free',
              details: node.pricing?.details || '',
              currency: node.pricing?.currency || 'INR'
          },
          tagsString: (node.tags || []).join(', '),
          latency: node.latency || 'Low',
          stability: node.stability || 'Stable',
          accessType: node.accessType || 'Public',
          externalUrl: node.externalUrl || '',
          gallery: node.gallery || [],
          features: (node.features && node.features.length > 0) ? node.features : [''],
          endpoints: (node.endpoints || []).map((ep: any) => ({
              ...ep,
              bodyJson: ep.body ? JSON.stringify(ep.body, null, 2) : '{}',
              responseJson: ep.responseExample ? JSON.stringify(ep.responseExample, null, 2) : '{"status": "ok"}'
          }))
      });
  };

  const handleEditGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if ((editingNode.gallery?.length || 0) + files.length > 4) {
      showNotification('Max 4 gallery images');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingNode((prev: any) => ({
            ...prev,
            gallery: [...(prev.gallery || []), reader.result as string].slice(0, 4)
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const saveEdit = () => {
      if (!editingNode) return;
      
      let finalEndpoints = [];
      try {
          finalEndpoints = editingNode.endpoints.map((ep: any) => ({
              method: ep.method,
              path: ep.path,
              description: ep.description,
              body: ep.bodyJson.trim() ? JSON.parse(ep.bodyJson) : {},
              responseExample: ep.responseJson.trim() ? JSON.parse(ep.responseJson) : {}
          }));
      } catch (e) {
          showNotification('Check JSON syntax in endpoints');
          return;
      }

      const tags = editingNode.tagsString.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '');
      const features = editingNode.features.filter((f: string) => f.trim() !== '');
      
      const finalUpdate = { 
          ...editingNode, 
          endpoints: finalEndpoints, 
          tags, 
          features,
          imageUrl: editingNode.gallery[0] || editingNode.imageUrl 
      };
      delete finalUpdate.tagsString;

      const localApis = JSON.parse(localStorage.getItem('mora_local_apis') || '[]');
      const updatedLocal = localApis.map((a: any) => a.id === editingNode.id ? finalUpdate : a);
      
      localStorage.setItem('mora_local_apis', JSON.stringify(updatedLocal));
      loadNodes();
      setEditingNode(null);
      showNotification('Grid node updated');
  };

  const handleLogout = () => {
      localStorage.removeItem('mora_user');
      navigate('/');
  };

  const nodeMetrics = useMemo(() => {
    const map: any = {};
    myNodes.forEach(node => {
        map[node.id] = {
            calls: Math.floor(Math.random() * 50000) + 1000,
            errorRate: (Math.random() * 0.5).toFixed(2),
            latency: Math.floor(Math.random() * 60) + 20,
            peak: (Math.random() * 2 + 0.5).toFixed(1) + 'k/s'
        }
    });
    return map;
  }, [myNodes]);

  const updateEditEndpoint = (index: number, field: string, value: string) => {
    const nextEndpoints = [...editingNode.endpoints];
    nextEndpoints[index] = { ...nextEndpoints[index], [field]: value };
    setEditingNode({ ...editingNode, endpoints: nextEndpoints });
  };

  const addEditEndpoint = () => {
    setEditingNode({
        ...editingNode,
        endpoints: [...editingNode.endpoints, { method: 'GET', path: '', description: '', bodyJson: '{}', responseJson: '{"status": "ok"}' }]
    });
  };

  const removeEditEndpoint = (index: number) => {
    setEditingNode({
        ...editingNode,
        endpoints: editingNode.endpoints.filter((_: any, i: number) => i !== index)
    });
  };

  if (loading) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/5 border-t-mora-500 rounded-full animate-spin mb-4"></div>
          <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">Accessing Grid...</span>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.05),transparent_50%)] pointer-events-none"></div>

      {notification && (
          <div className="fixed top-24 right-8 z-[150] bg-white text-black px-6 py-3 rounded-full shadow-2xl font-bold text-sm animate-slide-up flex items-center">
              <CheckCircle2 size={16} className="text-green-600 mr-2" />
              {notification}
          </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingNode && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setDeletingNode(null)}></div>
              <div className="bg-dark-900 border border-red-500/20 rounded-[2rem] w-full max-w-md relative z-10 animate-slide-up overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)]">
                  <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertTriangle size={32} className="text-red-500" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">Decommission Node?</h3>
                      <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                          This action will permanently terminate <span className="text-white font-bold">{deletingNode.name}</span> from the Apives directory. This protocol cannot be restored.
                      </p>
                      
                      <div className="flex flex-col gap-3">
                          <button 
                              onClick={confirmDelete}
                              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-full transition-all uppercase tracking-widest text-xs shadow-lg shadow-red-600/20"
                          >
                              Confirm Termination
                          </button>
                          <button 
                              onClick={() => setDeletingNode(null)}
                              className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-full transition-all uppercase tracking-widest text-xs border border-white/5"
                          >
                              Abort
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Full Feature Edit Modal */}
      {editingNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setEditingNode(null)}></div>
              <div className="bg-dark-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl relative z-10 animate-slide-up overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <div className="p-6 md:p-10 space-y-8">
                      <div className="flex justify-between items-center mb-2">
                          <div>
                              <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3"><Edit3 className="text-mora-500" /> Refine Node</h3>
                              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Update protocol specifications</p>
                          </div>
                          <button onClick={() => setEditingNode(null)} className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full"><X size={24}/></button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">API Name</label>
                              <input value={editingNode.name} onChange={(e) => setEditingNode({...editingNode, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500 outline-none text-sm" />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Provider Name</label>
                              <input value={editingNode.provider} onChange={(e) => setEditingNode({...editingNode, provider: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500 outline-none text-sm" />
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                              <CustomSelect value={editingNode.category} options={categoryOptions} onChange={(val) => setEditingNode({...editingNode, category: val})} icon={LayoutGrid} />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">External Website</label>
                              <input value={editingNode.externalUrl} onChange={(e) => setEditingNode({...editingNode, externalUrl: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500 outline-none text-sm font-mono" />
                          </div>
                      </div>

                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                          <textarea rows={3} value={editingNode.description} onChange={(e) => setEditingNode({...editingNode, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500 outline-none resize-none text-sm" />
                      </div>

                      {/* Visual Proofs */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                          <div className="flex items-center justify-between ml-1">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} className="text-mora-500" /> Neural Previews</label>
                              <span className="text-[9px] text-slate-600">{editingNode.gallery?.length || 0}/4</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {editingNode.gallery?.map((img: string, i: number) => (
                                  <div key={i} className="aspect-video bg-black rounded-xl border border-white/10 relative overflow-hidden group">
                                      <img src={img} className="w-full h-full object-cover" />
                                      <button type="button" onClick={() => setEditingNode({...editingNode, gallery: editingNode.gallery.filter((_:any, idx:number) => idx !== i)})} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                                  </div>
                              ))}
                              {editingNode.gallery?.length < 4 && (
                                  <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-600 hover:text-white hover:border-mora-500/50 transition-all">
                                      <Plus size={20}/>
                                      <span className="text-[8px] font-black uppercase tracking-widest mt-1">Upload</span>
                                  </button>
                              )}
                          </div>
                          <input type="file" multiple ref={fileInputRef} onChange={handleEditGalleryUpload} className="hidden" accept="image/*" />
                      </div>

                      {/* Configuration Matrix */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Pricing</label>
                            <CustomSelect value={editingNode.pricing.type} options={pricingOptions} onChange={(v) => setEditingNode({...editingNode, pricing: {...editingNode.pricing, type: v}})} icon={Globe} triggerClassName="!py-2.5 !text-xs" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Latency</label>
                            <CustomSelect value={editingNode.latency} options={latencyOptions} onChange={(v) => setEditingNode({...editingNode, latency: v})} icon={Activity} triggerClassName="!py-2.5 !text-xs" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Stability</label>
                            <CustomSelect value={editingNode.stability} options={stabilityOptions} onChange={(v) => setEditingNode({...editingNode, stability: v})} icon={ShieldAlert} triggerClassName="!py-2.5 !text-xs" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Access</label>
                            <CustomSelect value={editingNode.accessType} options={accessOptions} onChange={(v) => setEditingNode({...editingNode, accessType: v})} icon={Key} triggerClassName="!py-2.5 !text-xs" />
                         </div>
                      </div>

                      {editingNode.pricing.type !== 'Free' && (
                        <div className="space-y-1.5 animate-fade-in">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pricing Details</label>
                            <input value={editingNode.pricing.details} onChange={(e) => setEditingNode({...editingNode, pricing: {...editingNode.pricing, details: e.target.value}})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500 outline-none text-sm" placeholder="e.g. ₹0.10 per call" />
                        </div>
                      )}

                      {/* Feature Matrix */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                         <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ListPlus size={14} className="text-mora-500" /> Feature Matrix</label>
                            <button type="button" onClick={() => setEditingNode({...editingNode, features: [...editingNode.features, '']})} className="text-[10px] font-bold text-mora-500 uppercase hover:text-white transition-colors flex items-center gap-1"><Plus size={12}/> Add</button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {editingNode.features.map((f: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input value={f} onChange={(e) => {
                                        const nextFeatures = [...editingNode.features];
                                        nextFeatures[i] = e.target.value;
                                        setEditingNode({...editingNode, features: nextFeatures});
                                    }} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-mora-500 outline-none" />
                                    <button type="button" onClick={() => setEditingNode({...editingNode, features: editingNode.features.filter((_:any, idx:number) => idx !== i)})} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash size={16}/></button>
                                </div>
                            ))}
                         </div>
                      </div>

                      {/* Tags */}
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Hash size={14} className="text-mora-500" /> Search Tags</label>
                          <input value={editingNode.tagsString} onChange={(e) => setEditingNode({...editingNode, tagsString: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500 outline-none text-sm" placeholder="e.g. Identity, KYC, Auth" />
                      </div>

                      {/* Endpoints Structured UI (Playground Ready) */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                         <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Terminal size={14} className="text-mora-500" /> Interface Nodes (Playground Ready)</label>
                            <button type="button" onClick={addEditEndpoint} className="text-[10px] font-bold text-mora-500 uppercase hover:text-white transition-colors flex items-center gap-1"><Plus size={12}/> Add Node</button>
                         </div>
                         
                         <div className="space-y-4">
                            {editingNode.endpoints.length === 0 && <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center text-slate-600 text-xs uppercase tracking-widest font-mono">No endpoints registered. Add one to enable Playground.</div>}
                            {editingNode.endpoints.map((ep: any, i: number) => (
                                <div key={i} className="bg-black/50 border border-white/5 rounded-[1.5rem] p-5 space-y-4 animate-fade-in relative group">
                                    <button type="button" onClick={() => removeEditEndpoint(i)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"><X size={18} /></button>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="w-full sm:w-32">
                                            <CustomSelect value={ep.method} options={methodOptions} onChange={(v) => updateEditEndpoint(i, 'method', v)} triggerClassName="!py-2 !text-[10px] !font-black !uppercase" />
                                        </div>
                                        <input value={ep.path} onChange={(e) => updateEditEndpoint(i, 'path', e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-mora-500 outline-none" placeholder="/v1/endpoint" />
                                    </div>

                                    <input value={ep.description} onChange={(e) => updateEditEndpoint(i, 'description', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 outline-none" placeholder="Endpoint description" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Mock Body (JSON)</span>
                                            <textarea value={ep.bodyJson} onChange={(e) => updateEditEndpoint(i, 'bodyJson', e.target.value)} className="w-full bg-dark-950 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-blue-300 h-24 outline-none focus:border-mora-500/30" spellCheck={false} />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Mock Response (JSON)</span>
                                            <textarea value={ep.responseJson} onChange={(e) => updateEditEndpoint(i, 'responseJson', e.target.value)} className="w-full bg-dark-950 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-green-300 h-24 outline-none focus:border-mora-500/30" spellCheck={false} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                      </div>

                      <div className="pt-6 flex gap-4">
                         <button onClick={() => setEditingNode(null)} className="flex-1 py-4 bg-white/5 text-slate-400 font-bold rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-xs border border-white/5">Discard</button>
                         <button onClick={saveEdit} className="flex-2 py-4 bg-mora-600 text-white font-black rounded-full hover:bg-mora-500 transition-all uppercase tracking-widest text-xs shadow-xl shadow-mora-500/20">Commit All Changes</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl">
             <div className="flex items-center gap-3 md:gap-5 relative z-10 w-full md:w-auto">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/80 border border-white/10 flex items-center justify-center shadow-lg"><Terminal size={24} md:size={32} className="text-white" /></div>
                 <div className="overflow-hidden">
                     <h1 className="text-xl md:text-3xl font-display font-bold text-white mb-0.5 md:mb-1 tracking-tight truncate">{user?.name}</h1>
                     <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs text-slate-300 font-mono bg-black/40 px-2 md:px-3 py-1 rounded-full border border-white/10 w-fit truncate">
                        <Mail size={10}/> {user?.email}
                    </div>
                 </div>
             </div>

             <div className="mt-4 md:mt-0 flex gap-2 md:gap-3 relative z-10 w-full md:w-auto">
                <div className="flex-1 md:flex-none flex flex-col items-center md:items-end bg-black/50 border border-mora-500/20 p-3 md:p-4 rounded-2xl md:rounded-3xl min-w-[100px] md:min-w-[140px] shadow-lg">
                    <span className="text-[8px] md:text-[10px] font-black text-mora-400 uppercase tracking-widest flex items-center gap-1 mb-0.5 md:mb-1">
                        <Radio size={8} md:size={10} className="animate-pulse" /> Active
                    </span>
                    <div className="text-xl md:text-3xl font-display font-black text-white">
                        {myNodes.filter(n => n.status === 'active').length}
                    </div>
                </div>
                <div className="flex-1 md:flex-none flex flex-col items-center md:items-end bg-black/50 border border-white/10 p-3 md:p-4 rounded-2xl md:rounded-3xl min-w-[100px] md:min-w-[140px] shadow-lg">
                    <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-0.5 md:mb-1">
                        <LayoutGrid size={8} md:size={10} /> Total
                    </span>
                    <div className="text-xl md:text-3xl font-display font-black text-white">
                        {myNodes.length}
                    </div>
                </div>
             </div>
        </div>

        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-full w-fit mb-6 md:mb-8 border border-white/5 overflow-x-auto no-scrollbar">
            {[ 
              { id: 'nodes', label: 'Nodes', icon: Cpu }, 
              { id: 'saved', label: 'Saved', icon: Bookmark }, 
              { id: 'settings', label: 'Settings', icon: Settings } 
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[9px] md:text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-mora-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><tab.icon size={12} className="mr-1.5 md:mr-2" />{tab.label}</button>
            ))}
        </div>

        <div className="animate-fade-in min-h-[400px]">
            {activeTab === 'nodes' && (
                <div className="space-y-3 md:space-y-4">
                    {myNodes.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 border border-white/10 border-dashed rounded-[1.5rem] md:rounded-[2.5rem]">
                            <Cpu size={32} className="mx-auto text-slate-700 mb-3 opacity-30" />
                            <h3 className="text-base font-bold text-slate-500">No nodes in the grid</h3>
                            <Link to="/submit" className="text-mora-500 text-xs font-bold mt-2 hover:underline">Commission First Node</Link>
                        </div>
                    ) : myNodes.map((node) => (
                        <div 
                            key={node.id} 
                            className="bg-dark-900/40 backdrop-blur-md border border-white/5 hover:border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300 overflow-hidden relative group"
                        >
                            <div className="absolute top-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-mora-500 to-transparent opacity-70"></div>
                            
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 relative z-10">
                                <div className="flex items-center gap-3 md:gap-5 flex-1 cursor-pointer" onClick={() => navigate(`/api/${node.id}`)}>
                                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${node.status === 'active' ? 'bg-mora-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`}></div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-base md:text-xl font-bold text-white flex items-center gap-2 group-hover:text-mora-400 transition-colors truncate">{node.name} <span className="text-[7px] md:text-[9px] border border-white/10 px-1.5 md:px-2 py-0.5 rounded-full text-slate-400 font-mono uppercase bg-black/30 hidden sm:inline">{node.category}</span></h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-[9px] md:text-sm text-slate-500 font-mono truncate">ID: {node.id}</p>
                                            <button onClick={(e) => toggleAnalytics(node.id, e)} className={`flex items-center gap-1.5 text-[9px] font-bold uppercase transition-all px-2 py-0.5 rounded-md ${analyticsOpenId === node.id ? 'bg-mora-500/10 text-mora-400 border border-mora-500/20' : 'text-slate-600 hover:text-white'}`}>
                                                <BarChart2 size={10} /> {analyticsOpenId === node.id ? 'Hide Stats' : 'View Stats'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <Tooltip content={node.status === 'active' ? 'Pause' : 'Resume'}><button onClick={(e) => handleStatusToggle(node.id, e)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 border border-white/5 hover:text-white transition-all">{node.status === 'active' ? <PauseCircle size={16} md:size={18} /> : <PlayCircle size={16} md:size={18} />}</button></Tooltip>
                                    <Tooltip content="Edit"><button onClick={(e) => handleEditClick(node, e)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 border border-white/5 hover:bg-mora-500/10 hover:text-mora-400 transition-all"><Edit3 size={16} md:size={18} /></button></Tooltip>
                                    <Tooltip content="Delete"><button onClick={(e) => handleDeleteClick(node, e)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} md:size={18} /></button></Tooltip>
                                </div>
                            </div>

                            {analyticsOpenId === node.id && (
                                <div className="mt-6 pt-6 border-t border-white/5 animate-slide-up space-y-6">
                                    <div className="h-[200px] w-full bg-black/30 rounded-2xl p-4 border border-white/5">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={MOCK_ANALYTICS}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                                                <YAxis hide />
                                                <RechartsTooltip contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px'}} />
                                                <Line type="monotone" dataKey="requests" stroke="#22c55e" strokeWidth={3} dot={{fill: '#22c55e', r: 4}} activeDot={{r: 6, fill: '#4ade80'}} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { label: 'Total Calls', value: `${(nodeMetrics[node.id].calls / 1000).toFixed(1)}k`, color: 'text-white' },
                                            { label: 'Error Rate', value: `${nodeMetrics[node.id].errorRate}%`, color: 'text-green-500' },
                                            { label: 'Avg Latency', value: `${nodeMetrics[node.id].latency}ms`, color: 'text-yellow-500' },
                                            { label: 'Peak Load', value: nodeMetrics[node.id].peak, color: 'text-blue-500' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-black/40 p-3 rounded-xl border border-white/5">
                                                <div className="text-[8px] text-slate-500 uppercase font-black mb-1">{stat.label}</div>
                                                <div className={`text-base font-mono font-bold ${stat.color}`}>{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <Link to="/submit" className="w-full py-4 md:py-6 border-2 border-dashed border-white/10 rounded-full text-slate-500 hover:text-white hover:border-mora-500/50 hover:bg-mora-500/5 transition-all flex items-center justify-center gap-2 font-bold uppercase text-[10px] md:text-xs group"><Plus size={14} md:size={16} className="group-hover:scale-110 transition-transform" /> New Node</Link>
                </div>
            )}

            {activeTab === 'saved' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {savedNodes.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white/5 border border-white/10 border-dashed rounded-[1.5rem] md:rounded-[2.5rem]">
                            <Bookmark size={32} className="mx-auto text-slate-700 mb-3 opacity-30" />
                            <h3 className="text-base font-bold text-slate-500">No saved nodes</h3>
                        </div>
                    ) : savedNodes.map(node => (
                        <div key={node.id} className="bg-dark-900/40 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col h-full group relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-mora-500 to-transparent"></div>
                             <div className="flex justify-between items-start mb-3 pt-1">
                                <div className="overflow-hidden"><h3 className="text-base md:text-lg font-bold text-white mb-0.5 truncate">{node.name}</h3><p className="text-[10px] text-slate-500 font-mono truncate">{node.provider}</p></div>
                                <span className="text-[9px] font-black px-2 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 uppercase tracking-widest">{node.pricing.type}</span>
                            </div>
                            <p className="text-[13px] md:text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{node.description}</p>
                            <div className="mt-auto flex items-center gap-2">
                                <Link to={`/api/${node.id}`} className="flex-1 h-9 md:h-11 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white text-[10px] md:text-xs font-bold rounded-full border border-white/10 transition-all">View</Link>
                                <button className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full border border-red-500/20 transition-all"><Bookmark size={16} className="fill-current" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-fade-in relative z-10">
                    <div className="bg-dark-900/60 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl shadow-xl">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2"><User size={18} md:size={20} className="text-mora-400"/> Identity</h3>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Display Name</label>
                                <input defaultValue={user?.name} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-sm text-white focus:border-mora-500 outline-none transition-all" />
                            </div>
                            <button onClick={() => showNotification('Identity Synced')} className="text-black text-[10px] md:text-xs font-black flex items-center gap-2 hover:bg-mora-400 transition-all bg-mora-500 px-6 py-2.5 md:py-3.5 rounded-full w-full justify-center uppercase tracking-widest shadow-lg">
                                Update profile
                            </button>
                        </div>
                    </div>
                    <div className="bg-dark-900/60 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl shadow-xl">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2"><Shield size={18} md:size={20} className="text-mora-400"/> Firewall</h3>
                        <div className="space-y-4">
                            <p className="text-[12px] md:text-sm text-slate-400 leading-relaxed mb-2 md:mb-4">Disconnect from the current grid session.</p>
                            <button onClick={handleLogout} className="text-red-400 text-[10px] md:text-xs font-bold flex items-center gap-2 hover:bg-red-500/10 transition-all bg-red-500/5 px-6 py-2.5 md:py-3.5 rounded-full border border-red-500/20 w-full justify-center uppercase tracking-widest">
                                <LogOut size={14} /> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};