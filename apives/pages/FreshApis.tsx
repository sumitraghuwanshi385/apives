import React, { useState, useEffect } from 'react';
import { BackButton } from '../components/BackButton';
import {
Zap, LayoutGrid, Shield, CreditCard, Cpu, Database,
MessageSquare, SlidersHorizontal, ShoppingCart, Cloud, Globe, X,
Radar, Bitcoin, Wallet, Truck, BarChart3, Music,
Video, Smartphone, Map, Home, Utensils, Trophy as SportsIcon, Newspaper,
Briefcase, Languages, Users, Stethoscope, Scale, Settings, Search,
Wrench, Gavel, BarChart4, Landmark, Umbrella, Sprout, FlaskConical,
GraduationCap, Plane, Gamepad2, Dumbbell, TrendingUp, Building, Lock
} from 'lucide-react';
import { ApiListing } from '../types';
import { Skeleton } from '../components/Skeleton';
import ApiCard from '../components/ApiCard';

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

export const FreshApis: React.FC = () => {

const [selectedPricing, setSelectedPricing] = useState('All');
const [selectedCategory, setSelectedCategory] = useState('All');
const [apis, setApis] = useState<ApiListing[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [topIds, setTopIds] = useState<string[]>([]);
const [showFilters, setShowFilters] = useState(false);

useEffect(() => {
  loadFresh(1);
}, [selectedCategory, selectedPricing]);

const loadFresh = async (pageNumber: number) => {
  setIsLoading(true);

  const query = new URLSearchParams({
    page: String(pageNumber),
    limit: "6",
    category: selectedCategory,
    pricing: selectedPricing
  });

  const res = await fetch(
    `https://apives.onrender.com/api/fresh?${query.toString()}`
  );

  const data = await res.json();

  const normalized = data.apis.map((a: any) => ({
    ...a,
    id: a._id
  }));

  if (pageNumber === 1) {
    setApis(normalized);
  } else {
    setApis(prev => [...prev, ...normalized]);
  }

  setPage(pageNumber);
  setHasMore(data.page < data.totalPages);
  setIsLoading(false);

  // REAL ranking (global top 3)
  const rankRes = await fetch(
    "https://apives.onrender.com/api/community?page=1&limit=3"
  );
  const rankData = await rankRes.json();

  setTopIds(rankData.apis.map((a: any) => a._id));
};

return (
<div className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-20 selection:bg-mora-500/30">

<div className="absolute top-24 left-4 lg:left-8 z-30">
<BackButton />
</div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<div className="text-center mb-8 md:mb-12">
<div className="inline-flex items-center justify-center p-2.5 md:p-3 bg-white/10 rounded-2xl mb-4">
<Zap className="text-white" size={24} />
</div>
<h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
Fresh APIs
</h1>
<p className="text-slate-400 mt-2 text-sm md:text-base font-light">
Recently Added APIs.
</p>
</div>

{/* FILTER BUTTON */}
<div className="max-w-xs mx-auto mb-10 md:mb-16 relative">
<button
onClick={() => setShowFilters(!showFilters)}
className={`w-full flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
showFilters 
? 'bg-white text-black border-white' 
: 'bg-white/5 border-white/10 text-slate-300'
}`}
>
<SlidersHorizontal size={14} />
Filter Nodes
</button>

{showFilters && (
<div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-4xl mt-4 px-4 z-[60]">
<div className="bg-black border border-mora-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl">

<div className="mb-6">
<h4 className="text-xs font-black text-mora-400 uppercase tracking-widest mb-3">
Pricing
</h4>
<div className="flex flex-wrap gap-2">
{['All','Free','Freemium','Paid'].map(price => (
<button
key={price}
onClick={() => setSelectedPricing(price)}
className={`px-4 py-2 rounded-full text-xs font-bold border ${
selectedPricing === price
? 'bg-white text-black border-white'
: 'bg-white/5 border-white/10 text-slate-400'
}`}
>
{price}
</button>
))}
</div>
</div>

<h4 className="text-xs font-black text-mora-400 uppercase tracking-widest mb-4">
Category
</h4>

<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto">
{CATEGORIES.map(cat => (
<button
key={cat.name}
onClick={() => { setSelectedCategory(cat.name); setShowFilters(false); }}
className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase ${
selectedCategory === cat.name
? 'bg-white text-black border-white'
: 'bg-white/5 border-white/10 text-slate-400'
}`}
>
<cat.icon size={14} />
<span>{cat.name}</span>
</button>
))}
</div>

</div>
</div>
)}
</div>

{/* GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

{isLoading ? (
[1,2,3].map(i => (
<Skeleton key={i} className="h-64 rounded-2xl" />
))
) : apis.length > 0 ? (
apis.map(api => (
<ApiCard key={api.id} api={api} topIds={topIds} />
))
) : (
<div className="col-span-full text-center py-20">
<Radar size={40} className="text-mora-500 mx-auto mb-4 opacity-50" />
<h3 className="text-2xl font-bold text-white mb-2">No Nodes</h3>
<p className="text-slate-400">No new protocols in this category.</p>
</div>
)}

</div>

{hasMore && (
<div className="flex justify-center">
<button
onClick={() => loadFresh(page + 1)}
className="px-10 py-3 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-widest"
>
Load More APIs
</button>
</div>
)}

</div>
</div>
);
};