import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { CustomSelect } from '../components/CustomSelect';
import { Plus, X, Check, AlertCircle, RefreshCw, LayoutGrid, DollarSign, Activity, ShieldAlert, Key, Image as ImageIcon, ListPlus, Hash, Globe, Terminal } from 'lucide-react';
// IMPORT ADDED
import { apiService } from '../services/apiClient';

interface EndpointInput {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  bodyJson: string;
  responseJson: string;
}

export const SubmitApi: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState('Developer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    description: '',
    category: 'Identity',
    pricing: 'Free',
    pricingDetails: '',
    website: '',
    tags: '',
    latency: 'Low',
    stability: 'Stable',
    accessType: 'Public'
  });

  const [endpoints, setEndpoints] = useState<EndpointInput[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [galleryBase64, setGalleryBase64] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const MAX_GALLERY_IMAGES = 4;
  const categoryOptions = ['Identity', 'Payments', 'Crypto', 'AI', 'Data', 'Messaging', 'Infrastructure', 'eCommerce', 'Health', 'Social', 'Travel'];
  const pricingOptions = ['Free', 'Freemium', 'Paid'];
  const latencyOptions = ['Low', 'Medium', 'High'];
  const stabilityOptions = ['Stable', 'Beta', 'Experimental'];
  const accessOptions = ['Public', 'Auth required', 'Partner only'];
  const methodOptions = ['GET', 'POST', 'PUT', 'DELETE'];

  useEffect(() => {
    const userStr = localStorage.getItem('mora_user');
    if (!userStr) {
        navigate(`/access?returnUrl=${encodeURIComponent('/submit')}`);
    } else {
        const user = JSON.parse(userStr);
        setUserName(user.name);
        setFormData(prev => ({ ...prev, provider: user.name }));
        setIsAuthenticated(true);
    }
  }, [navigate]);

  const addEndpoint = () => {
    setEndpoints([...endpoints, { method: 'GET', path: '', description: '', bodyJson: '{}', responseJson: '{"status": "ok"}' }]);
  };

  const removeEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
  };

  const updateEndpoint = (index: number, field: keyof EndpointInput, value: string) => {
    const next = [...endpoints];
    next[index] = { ...next[index], [field]: value } as EndpointInput;
    setEndpoints(next);
  };

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => {
    const next = [...features];
    next[i] = val;
    setFeatures(next);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (galleryBase64.length + files.length > MAX_GALLERY_IMAGES) {
      setError(`Maximum ${MAX_GALLERY_IMAGES} images allowed.`);
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryBase64(prev => [...prev, reader.result as string].slice(0, MAX_GALLERY_IMAGES));
      reader.readAsDataURL(file);
    });
  };

  // --- UPDATED SUBMIT FUNCTION (CONNECTS TO BACKEND) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.description || !formData.website) {
      setError('Please fill in all required fields.');
      return;
    }

    let parsedEndpoints = [];
    try {
      parsedEndpoints = endpoints.map(ep => ({
        method: ep.method,
        path: ep.path,
        description: ep.description,
        body: ep.bodyJson.trim() ? JSON.parse(ep.bodyJson) : {},
        responseExample: ep.responseJson.trim() ? JSON.parse(ep.responseJson) : { success: true }
      }));
    } catch (err) {
      setError('Check your JSON syntax in endpoints.');
      return;
    }

    setIsSubmitting(true);

    // Prepare Data for Backend
    const apiPayload = {
      name: formData.name,
      provider: formData.provider || userName,
      description: formData.description,
      category: formData.category,
      pricing: { 
        type: formData.pricing, 
        details: formData.pricingDetails,
        currency: 'INR'
      },
      latency: formData.latency,
      stability: formData.stability,
      accessType: formData.accessType,
      imageUrl: galleryBase64[0] || 'https://picsum.photos/400/300?random=1', // Use first image or default
      gallery: galleryBase64,
      features: features.filter(f => f.trim() !== ''),
      externalUrl: formData.website,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      endpoints: parsedEndpoints,
      // Backend will handle 'providerId', 'createdAt', etc.
    };

    try {
      // CALL BACKEND API
      await apiService.createApi(apiPayload);
      
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Server Error: Failed to publish API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (isSuccess) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-dark-900 border border-mora-500/30 rounded-3xl p-10 text-center animate-slide-up max-w-sm w-full shadow-2xl">
        <div className="w-16 h-16 bg-mora-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-mora-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Protocol Online</h2>
        <p className="text-slate-400 mb-8">Your API has been successfully commissioned to the grid.</p>
        <button onClick={() => navigate('/provider')} className="w-full py-3 bg-mora-600 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-mora-500">Go to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 space-y-4">
            <BackButton />
            <div className="text-left">
                <h1 className="text-3xl font-display font-bold text-white">Publish Node</h1>
                <p className="text-sm text-slate-500">Register new endpoint protocols to the grid</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-dark-900/40 border border-white/5 p-6 md:p-10 rounded-[2rem] backdrop-blur-sm">
          
          {/* Base Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">API Name *</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-mora-500 outline-none" placeholder="e.g. Identity Guard" />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Provider Name</label>
                <input value={formData.provider} onChange={(e) => setFormData({...formData, provider: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-mora-500 outline-none" placeholder={userName} />
            </div>
          </div>

          <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description *</label>
              <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-mora-500 outline-none resize-none" placeholder="Explain the value proposition of this node..." />
          </div>

          {/* Visual Proofs (Gallery) */}
          <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} className="text-mora-500" /> Visual Proofs (Overview Gallery)</label>
                  <span className="text-[9px] text-slate-600">{galleryBase64.length}/{MAX_GALLERY_IMAGES}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {galleryBase64.map((img, i) => (
                      <div key={i} className="aspect-video bg-black rounded-xl border border-white/10 relative overflow-hidden group">
                          <img src={img} className="w-full h-full object-cover" alt="preview" />
                          <button type="button" onClick={() => setGalleryBase64(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                      </div>
                  ))}
                  {galleryBase64.length < MAX_GALLERY_IMAGES && (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-600 hover:text-white hover:border-mora-500/50 transition-all">
                          <Plus size={20}/>
                          <span className="text-[8px] font-black uppercase tracking-widest mt-1">Upload</span>
                      </button>
                  )}
              </div>
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <CustomSelect value={formData.category} options={categoryOptions} onChange={(v) => setFormData({...formData, category: v})} icon={LayoutGrid} />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Website URL *</label>
                <div className="relative">
                    <input required value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-mora-500 outline-none" placeholder="https://docs.yoursite.com" />
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                </div>
             </div>
          </div>

          {/* Configuration Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Pricing</label>
                <CustomSelect value={formData.pricing} options={pricingOptions} onChange={(v) => setFormData({...formData, pricing: v})} icon={DollarSign} triggerClassName="!py-2.5 !text-xs" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Latency</label>
                <CustomSelect value={formData.latency} options={latencyOptions} onChange={(v) => setFormData({...formData, latency: v})} icon={Activity} triggerClassName="!py-2.5 !text-xs" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Stability</label>
                <CustomSelect value={formData.stability} options={stabilityOptions} onChange={(v) => setFormData({...formData, stability: v})} icon={ShieldAlert} triggerClassName="!py-2.5 !text-xs" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Access</label>
                <CustomSelect value={formData.accessType} options={accessOptions} onChange={(v) => setFormData({...formData, accessType: v})} icon={Key} triggerClassName="!py-2.5 !text-xs" />
             </div>
          </div>

          {formData.pricing !== 'Free' && (
            <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pricing Details</label>
                <input value={formData.pricingDetails} onChange={(e) => setFormData({...formData, pricingDetails: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-mora-500 outline-none" placeholder="e.g. ₹0.10 per call after 1k free requests" />
            </div>
          )}

          {/* Features Matrix */}
          <div className="space-y-3">
             <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ListPlus size={14} className="text-mora-500" /> Feature Matrix</label>
                <button type="button" onClick={addFeature} className="text-[10px] font-bold text-mora-500 uppercase hover:text-white transition-colors flex items-center gap-1"><Plus size={12}/> Add Feature</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                        <input value={f} onChange={(e) => updateFeature(i, e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-mora-500 outline-none" placeholder="e.g. 256-bit encryption" />
                        <button type="button" onClick={() => removeFeature(i)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><X size={16}/></button>
                    </div>
                ))}
             </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Hash size={14} className="text-mora-500" /> Search Tags</label>
              <input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-mora-500 outline-none" placeholder="KYC, Identity, Verification (comma separated)" />
          </div>

          {/* Endpoints */}
          <div className="space-y-4 pt-4 border-t border-white/5">
             <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Terminal size={14} className="text-mora-500" /> Interface Nodes (Playground Ready)</label>
                <button type="button" onClick={addEndpoint} className="text-[10px] font-bold text-mora-500 uppercase hover:text-white transition-colors flex items-center gap-1"><Plus size={12}/> Add Node</button>
             </div>
             
             <div className="space-y-4">
                {endpoints.length === 0 && <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center text-slate-600 text-xs uppercase tracking-widest font-mono">No endpoints registered. Add one to enable Playground.</div>}
                {endpoints.map((ep, i) => (
                    <div key={i} className="bg-black/50 border border-white/5 rounded-[1.5rem] p-5 space-y-4 animate-fade-in relative group">
                        <button type="button" onClick={() => removeEndpoint(i)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"><X size={18} /></button>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="w-full sm:w-32">
                                <CustomSelect value={ep.method} options={methodOptions} onChange={(v) => updateEndpoint(i, 'method', v)} triggerClassName="!py-2 !text-[10px] !font-black !uppercase" />
                            </div>
                            <input value={ep.path} onChange={(e) => updateEndpoint(i, 'path', e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-mora-500 outline-none" placeholder="/v1/endpoint" />
                        </div>

                        <input value={ep.description} onChange={(e) => updateEndpoint(i, 'description', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 outline-none" placeholder="Endpoint description (e.g. Verify PAN details)" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Mock Body (JSON)</span>
                                <textarea value={ep.bodyJson} onChange={(e) => updateEndpoint(i, 'bodyJson', e.target.value)} className="w-full bg-dark-950 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-blue-300 h-24 outline-none focus:border-mora-500/30" spellCheck={false} placeholder='{"key": "value"}' />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Mock Response (JSON)</span>
                                <textarea value={ep.responseJson} onChange={(e) => updateEndpoint(i, 'responseJson', e.target.value)} className="w-full bg-dark-950 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-green-300 h-24 outline-none focus:border-mora-500/30" spellCheck={false} placeholder='{"status": "success"}' />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs flex items-center gap-3 animate-pulse"><AlertCircle size={16}/> {error}</div>}

          <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-mora-600 text-white font-black rounded-full uppercase text-sm tracking-widest hover:bg-mora-500 shadow-2xl shadow-mora-500/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            {isSubmitting ? <RefreshCw size={20} className="animate-spin" /> : <>Register Protocol Node</>}
          </button>
        </form>
      </div>
    </div>
  );
};