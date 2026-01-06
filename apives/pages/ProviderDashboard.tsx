
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Plus, Terminal, RefreshCw, BarChart2, Settings, Shield, 
    CheckCircle2, User, Mail, Key, Edit3, Trash2, Save, X, PauseCircle, PlayCircle,
    Cpu, Activity, Zap, Bookmark, LogOut, Globe, TrendingUp, Clock, LayoutGrid, Radio,
    Trash, Image as ImageIcon, ListPlus, Hash, ShieldAlert, AlertTriangle, Info
} from 'lucide-react';
import { MOCK_APIS, MOCK_ANALYTICS, getAllApis } from '../services/mockData';
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

  useEffect(() => {
      const storedUser = localStorage.getItem('mora_user');
      if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser({ ...parsed, joined: 'Oct 2023' });
          loadNodes();
      } else {
          navigate('/access');
      }
      setTimeout(() => setLoading(false), 800);
  }, [navigate]);

  const loadNodes = () => {
    const nodes = getAllApis(true).filter(api => api.id.startsWith('local-'));
    setMyNodes(nodes.map(n => ({...n, status: n.status || 'active'})));

    const savedIds = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
    const allApis = getAllApis();
    setSavedNodes(allApis.filter(api => savedIds.includes(api.id)));
  };

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

  const handleUnsaveNode = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedIds = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
    const updated = savedIds.filter((aid: string) => aid !== id);
    localStorage.setItem('mora_saved_apis', JSON.stringify(updated));
    loadNodes();
    showNotification('Removed from saved grid');
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
                