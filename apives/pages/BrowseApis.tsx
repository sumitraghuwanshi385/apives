import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Server, Activity, Heart, Bookmark, Hash, LayoutGrid, Shield, 
  CreditCard, Cpu, Database, MessageSquare, SlidersHorizontal, X, Cloud, 
  Globe, GraduationCap, Bitcoin, ShoppingCart, Plane, Stethoscope, Radar, 
  ArrowDown, Calendar, Trophy, Lock, BarChart3, Music, Video, Smartphone, 
  Map, Home, Utensils, Trophy as SportsIcon, Newspaper, Briefcase, 
  Languages, Users, Stethoscope as Steth, Scale, Settings, Wrench, Gavel, BarChart4, TrendingUp, 
  Sprout, FlaskConical, Dumbbell, Wallet, Umbrella, Building, Zap, Truck,
  Landmark, Gamepad2
} from 'lucide-react';
import { apiService } from '../services/apiClient';
import { ApiListing } from '../types';
import { Skeleton } from '../components/Skeleton';
import { BackButton } from '../components/BackButton';

const RANK_BADGE_STYLES = [
  { label: 'Apex', color: 'from-amber-400 to-yellow-600', text: 'text-black' },
  { label: 'Prime', color: 'from-slate-200 to-slate-400', text: 'text-black' },
  { label: 'Zenith', color: 'from-orange-400 to-amber-700', text: 'text-white' }
];

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'AI', icon: Cpu },
  { name: 'Payments', icon: CreditCard },
  { name: 'Crypto', icon: Bitcoin },
  { name: 'Identity', icon: Shield },
  { name: 'Data', icon: Database },
  { name: 'Infrastructure', icon: Cloud },
  { name: 'eCommerce', icon: ShoppingCart },
  { name: 'Messaging', icon: MessageSquare },
  { name: 'Finance', icon: Wallet },
  { name: 'Logistics', icon: Truck },
  { name: 'Security', icon: Lock },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Audio', icon: Music },
  { name: 'Video', icon: Video },
  { name: 'Mobile', icon: Smartphone },
  { name: 'Maps', icon: Map },
  { name: 'Weather', icon: Cloud },
  { name: 'Real Estate', icon: Home },
  { name: 'Food', icon: Utensils },
  { name: 'Sports', icon: SportsIcon },
  { name: 'News', icon: Newspaper },
  { name: 'Jobs', icon: Briefcase },
  { name: 'Translation', icon: Languages },
  { name: 'Social', icon: Users },
  { name: 'Health', icon: Steth },
  { name: 'Legal', icon: Scale },
  { name: 'DevOps', icon: Settings },
  { name: 'Search', icon: Search },
  { name: 'Tools', icon: Wrench },
  { name: 'Government', icon: Gavel },
  { name: 'Utilities', icon: Zap },
  { name: 'Stocks', icon: BarChart4 },
  { name: 'Banking', icon: Landmark },
  { name: 'Insurance', icon: Umbrella },
  { name: 'Agriculture', icon: Sprout },
  { name: 'Science', icon: FlaskConical },
  { name: 'Education', icon: GraduationCap },
  { name: 'Travel', icon: Plane },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Fitness', icon: Dumbbell },
  { name: 'IoT', icon: Radar },
  { name: 'ERP', icon: Database },
  { name: 'CRM', icon: Users },
  { name: 'HR', icon: Briefcase },
  { name: 'Marketing', icon: TrendingUp },
  { name: 'Storage', icon: Database },
  { name: 'Web3', icon: Globe },
  { name: 'Automation', icon: Zap },
  { name: 'Enterprise', icon: Building }
];

const BrowseApiCard: React.FC<{
  api: ApiListing;
  topIds: string[];
}> = ({ api, topIds }) => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [upvotes, setUpvotes] = useState(api.upvotes);

    const rankIndex = topIds.indexOf(api.id);
    const isTopTier = rankIndex !== -1;
    const rankStyle = isTopTier ? RANK_BADGE_STYLES[rankIndex] : null;
  
    useEffect(() => {
        const savedApis = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
        if (savedApis.includes(api.id)) setSaved(true);

        const likedApis = JSON.parse(localStorage.getItem('mora_liked_apis') || '[]');
        const currentlyLiked = likedApis.includes(api.id);
        setIsLiked(currentlyLiked);
        setUpvotes(currentlyLiked ? api.upvotes + 1 : api.upvotes);
    }, [api.id, api.upvotes]);

    const isNew = (dateString: string) => {
        const date = new Date(dateString);
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        return date > fifteenDaysAgo;
    };
  
    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        const userStr = localStorage.getItem('mora_user');
        if (!userStr) { navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`); return; }
        const savedApis = JSON.parse(localStorage.getItem('mora_saved_apis') || '[]');
        if (saved) {
            setSaved(false);
            localStorage.setItem('mora_saved_apis', JSON.stringify(savedApis.filter((aid: string) => aid !== api.id)));
        } else {
            setSaved(true);
            localStorage.setItem('mora_saved_apis', JSON.stringify([...savedApis, api.id]));
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        const userStr = localStorage.getItem('mora_user');
        if (!userStr) { navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`); return; }
        
        const likedApis = JSON.parse(localStorage.getItem('mora_liked_apis') || '[]');
        if (isLiked) {
            setIsLiked(false); setUpvotes(prev => prev - 1);
            localStorage.setItem('mora_liked_apis', JSON.stringify(likedApis.filter((aid: string) => aid !== api.id)));
        } else {
            setIsLiked(true); setUpvotes(prev => prev + 1);
            localStorage.setItem('mora_liked_apis', JSON.stringify([...likedApis, api.id]));
        }
    };

    return (
        <Link 
            to={`/api/${api.id}`} 
            className="group relative bg-dark-900/40 hover:bg-dark-900/80 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-mora-500/30 p-4 md:p-5 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
        >
            <div className="absolute top-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-mora-500 to-transparent opacity-70"></div>
            
            <div className="flex justify-between items-center mb-2 relative z-20">
                <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="bg-mora-500/10 border border-mora-500/20 text-mora-400 text-[8px] md:text-[9px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider h-5 md:h-6 flex items-center">
                        {api.category}
                    </span>
                    {isTopTier && rankStyle && (
                        <div className={`bg-gradient-to-r ${rankStyle.color} ${rankStyle.text} backdrop-blur-md border border-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full flex items-center gap-1 shadow-md h-5 md:h-6`}>
                            <Trophy size={8} className="md:w-2.5 md:h-2.5 fill-current" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">{rankStyle.label}</span>
                        </div>
                    )}
                </div>
                <button onClick={handleSave} className={`p-1.5 md:p-2 rounded-full transition-all duration-300 active:scale-75 ${saved ? 'bg-mora-500/20 text-mora-500' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                    <Bookmark size={14} className={`md:w-4 md:h-4 transition-transform duration-300 ${saved ? 'fill-current scale-110' : 'scale-100'}`} />
                </button>
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-2">
                    <h3 className="font-display font-bold text-white text-base md:text-lg leading-tight group-hover:text-mora-400 transition-colors flex items-center gap-2">
                        {api.name}
                        {isNew(api.publishedAt) && (
                            <span className="text-[8px] md:text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">New</span>
                        )}
                    </h3>
                     <div className="flex items-center gap-2 mt-1">
                         <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1"><Server size={10} /> {api.provider}</p>
                    </div>
                </div>
                <p className="text-[13px] md:text-sm text-slate-400 mb-4 md:mb-6 line-clamp-2 leading-relaxed font-light">{api.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                    {api.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] md:text-[10px] text-slate-500 bg-white/5 border border-white/10 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex items-center">
                            <Hash size={8} className="mr-0.5 text-mora-500/50" /> {tag}
                        </span>
                    ))}
                </div>
                <div className="pt-3 md:pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-3 md:gap-4">
                        <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-slate-500">
                            <Activity size={12} className="text-mora-500" />
                            <span className="text-slate-300">{api.latency}</span>
                        </div>
                        <button onClick={handleLike} className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold group/like">
                            <Heart size={12} className={`${isLiked ? 'text-red-500 fill-current shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-red-500/50 group-hover/like:text-red-500'} transition-all`} />
                            <span className="text-slate-300 font-mono">{upvotes}</span>
                        </button>
                    </div>
                    <span className={`text-[8px] md:text-[10px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full border ${api.pricing.type === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' : api.pricing.type === 'Paid' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'} uppercase tracking-wide`}>
                        {api.pricing.type}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export const BrowseApis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
const [topIds, setTopIds] = useState<string[]>([]);
  const [filteredApis, setFilteredApis] = useState<ApiListing[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

   useEffect(() => {
  const loadApis = async () => {
    setIsLoading(true);

    const allApis = await apiService.getAllApis();

    // 🔥 top 3 ids
    setTopIds(
      [...allApis]
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 3)
        .map(a => a.id)
    );

    const lowerTerm = searchTerm.toLowerCase();

    const filtered = allApis.filter(api =>
      (selectedCategory === 'All' || api.category === selectedCategory) &&
      (
        api.name.toLowerCase().includes(lowerTerm) ||
        api.description.toLowerCase().includes(lowerTerm) ||
        api.provider.toLowerCase().includes(lowerTerm)
      )
    );

    setFilteredApis(filtered);
    setIsLoading(false);
  };

  const timer = setTimeout(loadApis, 300);
  return () => clearTimeout(timer);
}, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-12 md:pb-20 relative selection:bg-mora-500/30">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.05),transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-24 left-4 lg:left-8 z-30"><BackButton /></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-6xl font-display font-bold text-white mb-2 md:mb-4 tracking-tight">The Grid</h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">Search through verified endpoints.</p>
        </div>

        <div className="max-w-3xl mx-auto mb-10 md:mb-16 relative">
            <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 md:p-1.5 focus-within:border-mora-500/50 transition-all shadow-2xl group">
                <Search className="ml-3 md:ml-5 text-slate-500 group-focus-within:text-mora-500 transition-colors" size={16} md:size={20} />
                <input 
                    type="text" 
                    placeholder="Find APIs..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent px-3 md:px-4 py-2 md:py-3.5 text-white placeholder-slate-600 outline-none font-sans text-[13px] md:text-sm"
                />
                
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${
                        showFilters ? 'bg-mora-500 text-black border-mora-500' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                >
                    <SlidersHorizontal size={12} md:size={14} />
                    Filters
                </button>
            </div>

            {showFilters && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-4xl mt-4 md:mt-6 px-4 z-[60]">
                    <div className="bg-black/95 border border-mora-500/30 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-slide-up backdrop-blur-[50px] ring-1 ring-white/10">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <h4 className="text-[10px] md:text-xs font-black text-mora-400 uppercase tracking-[0.4em]">Category</h4>
                            <button onClick={() => setShowFilters(false)} className="p-2 text-slate-500 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-3">
                            {CATEGORIES.map((cat) => (
                                <button 
                                    key={cat.name}
                                    onClick={() => { setSelectedCategory(cat.name); setShowFilters(false); }}
                                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3.5 rounded-full border text-[9px] md:text-[11px] font-bold uppercase tracking-wider transition-all ${
                                        selectedCategory === cat.name 
                                        ? 'bg-mora-500 text-black border-mora-500' 
                                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <cat.icon size={14} md:size={16} />
                                    <span className="whitespace-nowrap">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 md:h-64 rounded-[1.5rem] md:rounded-[2rem]" />)}
          </div>
        ) : filteredApis.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
              {filteredApis.slice(0, visibleCount).map((api) => (
                <BrowseApiCard
    key={api.id}
    api={api}
    topIds={topIds}
  />
))}
            </div>
            {visibleCount < filteredApis.length && (
                <div className="flex justify-center">
                    <button 
                        onClick={() => setVisibleCount(v => v + 12)}
                        className="px-8 py-3 md:px-10 md:py-4 bg-white/5 border border-white/10 rounded-full text-white font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                    >
                        Load More Nodes
                    </button>
                </div>
            )}
          </>
        ) : (
            <div className="text-center py-20 px-6 animate-fade-in">
                <Radar size={40} className="text-mora-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-display font-bold text-white mb-2">Signal Lost</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-light">No protocol nodes matching your current parameters.</p>
                <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    className="px-8 py-3 bg-mora-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full"
                >
                    Reset Neural Scan
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
