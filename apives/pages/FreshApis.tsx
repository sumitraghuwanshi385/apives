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

const [selectedPricing, setSelectedPricing] = useState<string>('All');
const [selectedCategory, setSelectedCategory] = useState<string>('All');
const [filteredApis, setFilteredApis] = useState<ApiListing[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [showFilters, setShowFilters] = useState(false);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [topIds, setTopIds] = useState<string[]>([]);

useEffect(() => {
  const loadFreshApis = async () => {
    setIsLoading(true);

    try {
      const query = new URLSearchParams({
        page: "1",
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

      setFilteredApis(normalized);
      setPage(1);
      setHasMore(data.page < data.totalPages);

      setTopIds(
        [...normalized]
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
          .slice(0, 3)
          .map(a => a.id)
      );

    } catch (err) {
      console.error("Fresh load failed", err);
    }

    setIsLoading(false);
  };

  loadFreshApis();

}, [selectedCategory, selectedPricing]);

const loadMore = async () => {
  const nextPage = page + 1;

  const query = new URLSearchParams({
    page: String(nextPage),
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

  setFilteredApis(prev => [...prev, ...normalized]);
  setPage(nextPage);
  setHasMore(data.page < data.totalPages);
};

return (
<div className="min-h-screen bg-dark-950 pt-24 md:pt-32 pb-20 selection:bg-mora-500/30">

<div className="absolute top-24 left-4 lg:left-8 z-30">
<BackButton />
</div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<div className="text-center mb-12">
<div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4">
<Zap className="text-white" size={32} />
</div>
<h1 className="text-4xl font-display font-bold text-white">Fresh APIs</h1>
<p className="text-slate-400 mt-2">Recently Added APIs.</p>
</div>

{/* GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

{isLoading ? (
[1,2,3].map(i => (
<Skeleton key={i} className="h-64 rounded-[2rem]" />
))
) : filteredApis.length > 0 ? (
filteredApis.map(api => (
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

{hasMore && filteredApis.length > 0 && (
<div className="flex justify-center">
<button
onClick={loadMore}
className="px-10 py-3.5 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95"
>
Load More APIs
</button>
</div>
)}

</div>
</div>
);
};