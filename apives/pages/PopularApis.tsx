import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiClient';
import { BackButton } from '../components/BackButton';
import { Skeleton } from '../components/Skeleton';
import ApiCard from '../components/ApiCard';
import { ApiListing } from '../types';

let API_CACHE: ApiListing[] | null = null;

import { 
  Heart, LayoutGrid, Shield, CreditCard, Cpu, Database, 
  MessageSquare, SlidersHorizontal, ShoppingCart, Cloud, Globe, X, 
  Activity, Radar, Zap, Bitcoin, Wallet, Truck, BarChart3, 
  Music, Video, Smartphone, Map, Home, Utensils, Trophy as SportsIcon, 
  Newspaper, Briefcase, Languages, Users, Stethoscope, Scale, Settings, 
  Search, Wrench, Gavel, BarChart4, Landmark, Umbrella, Sprout, 
  FlaskConical, GraduationCap, Plane, Gamepad2, Dumbbell, TrendingUp, 
  Building, Lock
} from 'lucide-react';

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
  { name: 'Health', icon: Stethoscope },
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

export const PopularApis: React.FC = () => {

  const [selectedPricing, setSelectedPricing] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredApis, setFilteredApis] = useState<ApiListing[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [topIds, setTopIds] = useState<string[]>([]);

  useEffect(() => {

    const loadPopularApis = async () => {
      setIsLoading(true);

      let allApis: ApiListing[];

      if (API_CACHE) {
        allApis = API_CACHE;
      } else {
        const raw = await apiService.getAllApis();

        allApis = raw.map((a: any) => ({
          ...a,
          id: a._id
        }));

        API_CACHE = allApis;
      }

      const sorted = [...allApis].sort(
        (a, b) => (b.upvotes || 0) - (a.upvotes || 0)
      );

      setTopIds(sorted.slice(0, 3).map(a => a._id));

      const filtered = sorted.filter(api => {

        const categoryMatch =
          selectedCategory === 'All' || api.category === selectedCategory;

        const pricingMatch =
          selectedPricing === 'All' || api.pricing?.type === selectedPricing;

        return categoryMatch && pricingMatch;
      });

      setFilteredApis(filtered);
      setIsLoading(false);
    };

    loadPopularApis();

  }, [selectedCategory, selectedPricing]);

  return (
    <div className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-12 md:pb-20 relative selection:bg-mora-500/30">

      <div className="absolute top-24 left-4 lg:left-8 z-30">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-2.5 md:p-3 bg-red-500/10 rounded-2xl mb-4">
            <Heart className="text-red-500" size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Community Favorites
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base font-light">
            Most Integrated APIs.
          </p>
        </div>
<div className="max-w-xs mx-auto mb-10 md:mb-16 relative">  
             <button   
                onClick={() => setShowFilters(!showFilters)}   
                className={`w-full flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${  
                    showFilters ? 'bg-red-500 text-black border-red-500' : 'bg-white/5 border-white/10 text-slate-300'  
                }`}  
            >  
                <SlidersHorizontal size={14} md:size={16} />  
                Filter Favorites  
            </button>  
            {showFilters && (  
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-4xl mt-4 px-4 z-[60]">  
                    <div className="bg-black/95 border border-red-500/30 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-slide-up backdrop-blur-xl">

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
                                <h4 className="text-[10px] md:text-xs font-black text-red-400 uppercase tracking-widest">Category</h4>  
                                <button onClick={() => setShowFilters(false)} className="p-2 text-slate-500 hover:text-white transition-colors">  
                                    <X size={18} />  
                                </button>  
                             </div>  
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 max-h-[350px] md:max-h-[400px] overflow-y-auto custom-scrollbar pr-2">  
                                {CATEGORIES.map((cat) => (  
                                    <button   
                                        key={cat.name}   
                                        onClick={() => { setSelectedCategory(cat.name); setShowFilters(false); }}   
                                        className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-full border text-[9px] md:text-[11px] font-bold uppercase transition-all ${  
                                            selectedCategory === cat.name   
                                            ? 'bg-red-500 text-black border-red-500 shadow-md'   
                                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'  
                                        }`}  
                                    >  
                                        <cat.icon size={14} md:size={16} className={selectedCategory === cat.name ? 'text-black' : 'text-red-500/60'} />  
                                        <span className="whitespace-nowrap">{cat.name}</span>  
                                    </button>  
                                ))}  
                            </div>  
                        </div>  
                    </div>  
                )}  
            </div> 

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {isLoading ? (
            [1,2,3].map(i => (
              <Skeleton key={i} className="h-48 md:h-64 rounded-[1.5rem] md:rounded-[2rem]" />
            ))
          ) : filteredApis.length > 0 ? (
            filteredApis.slice(0, visibleCount).map(api => (
              <ApiCard key={api._id} api={api} topIds={topIds} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 px-6">
              <Radar size={40} className="text-red-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Void Sector
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-light">
                No favorites found in this category.
              </p>
<button   
                      onClick={() => setSelectedCategory('All')}  
                      className="px-8 py-3 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full"  
                  >  
                      Reset Scanning  
                  </button>  
            </div>
          )}
        </div>

{visibleCount < filteredApis.length && filteredApis.length > 0 && (  
            <div className="flex justify-center">  
                <button onClick={() => setVisibleCount(v => v + 12)} className="px-10 py-3.5 bg-white/5 border border-white/10 rounded-full text-white font-black text-[10px] md:text-xs uppercase tracking-widest active:scale-95 transition-all">Load More APIs</button>  
            </div>  
        )}  
      </div>
    </div>
  );
};