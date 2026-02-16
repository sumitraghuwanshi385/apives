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
import ApiCard from '../components/ApiCard';
let API_CACHE: ApiListing[] | null = null;

const shuffleArray = <T,>(arr: T[]): T[] => {
  return [...arr].sort(() => Math.random() - 0.5);
};

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

export const BrowseApis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPricing, setSelectedPricing] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [topIds, setTopIds] = useState<string[]>([]);
  const [filteredApis, setFilteredApis] = useState<ApiListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadApis = async () => {
      setIsLoading(true);

      let allApis: ApiListing[];

      if (API_CACHE) {
        allApis = API_CACHE;
      } else {
        const raw = await apiService.getAllApis();

        // ✅ NORMALIZE _id → id
        allApis = raw.map((a: any) => ({
          ...a,
          id: a._id
        }));

        API_CACHE = allApis;
      }

      setTopIds(
        [...allApis]
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
          .slice(0, 3)
          .map(a => a.id)
      );

      const lowerTerm = searchTerm.trim().toLowerCase();

const scored = allApis
  .map(api => {
    let score = 0;

    const name = api.name?.toLowerCase() || '';
    const desc = api.description?.toLowerCase() || '';
    const provider = api.provider?.toLowerCase() || '';
    const tags = Array.isArray(api.tags)
      ? api.tags.join(' ').toLowerCase()
      : '';

    // 🎯 STRONG WEIGHT SYSTEM
    if (name.includes(lowerTerm)) score += 100;
    if (provider.includes(lowerTerm)) score += 70;
    if (tags.includes(lowerTerm)) score += 60;
    if (desc.includes(lowerTerm)) score += 30;

    // partial fuzzy match
    if (lowerTerm && name.startsWith(lowerTerm)) score += 120;

    return { api, score };
  })
  .filter(item => {
    const categoryMatch =
      selectedCategory === 'All' ||
      item.api.category === selectedCategory;

    const pricingMatch =
      selectedPricing === 'All' ||
      item.api.pricing?.type === selectedPricing;

    if (!lowerTerm) return categoryMatch && pricingMatch;

    return (
      categoryMatch &&
      pricingMatch &&
      item.score > 0
    );
  })
  .sort((a, b) => b.score - a.score) // 🔥 IMPORTANT
  .map(item => item.api);

setFilteredApis(scored);
      setIsLoading(false);
    };

    loadApis();
  }, [searchTerm, selectedCategory, selectedPricing]); // ✅ added selectedPricing

  return (
    <div className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-12 md:pb-20 relative selection:bg-mora-500/30">
      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* UI SAME — untouched */}
<div className="text-center mb-8 md:mb-12">  
  {/* ICON CHIP */}  
  <div className="inline-flex items-center justify-center p-3 md:p-3.5 bg-white/10 rounded-2xl mb-4">  
  <Search className="text-mora-500" size={24} md:size={28} />  
</div>    <h1 className="text-3xl md:text-6xl font-display font-bold text-white mb-2 md:mb-4 tracking-tight">  
    Explore APIs   
  </h1>    <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">  
    Browse Trusted APIs And Endpoints.  
  </p>  
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
                />  <button   
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

{/* PRICING */}

<div className="mb-6">  
  <h4 className="text-[10px] md:text-xs font-black text-mora-400 uppercase tracking-[0.4em] mb-3">  
    Pricing  
  </h4>    <div className="flex flex-wrap gap-2">  
    {['All', 'Free', 'Freemium', 'Paid'].map(price => (  
      <button  
        key={price}  
        onClick={() => setSelectedPricing(price)}  
        className={`px-4 py-2 rounded-full text-[9px] md:text-[11px] font-bold uppercase border transition-all  
          ${  
            selectedPricing === price  
              ? 'bg-mora-500 text-black border-mora-500'  
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'  
          }`}  
      >  
        {price}  
      </button>  
    ))}  
  </div>  
</div>  
                        <div className="flex items-center justify-between mb-6 md:mb-8">  
                            <h4 className="text-[10px] md:text-xs font-black text-mora-400 uppercase tracking-[0.4em]">Category</h4>  
                            <button onClick={() => setShowFilters(false)} className="p-2 text-slate-500 hover:text-white">  
                                <X size={18} />  
                            </button>  
                        </div>  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-3">  
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
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-56 md:h-72 rounded-[1.5rem] md:rounded-[2rem]"
              />
            ))}
          </div>
        ) : filteredApis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            {filteredApis.map((api) => (
              <ApiCard
                key={api.id}
                api={api}
                topIds={topIds}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6">
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              No APIs Found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};