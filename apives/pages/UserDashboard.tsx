import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_ANALYTICS } from '../services/mockData';
import { Key, CreditCard, Activity, Copy, RefreshCw } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <div className="flex gap-2">
                 <button className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-3 py-1.5 rounded-lg font-medium transition-colors">Settings</button>
                 <button className="text-xs bg-mora-600 hover:bg-mora-500 text-white px-3 py-1.5 rounded-lg font-bold transition-colors">Add Funds</button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-900/50 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Credits</span>
              <CreditCard className="text-mora-500 opacity-50" size={14} />
            </div>
            <div>
                 <p className="text-2xl font-mono font-bold text-white tracking-tight">₹ 4,250</p>
                 <p className="text-[10px] text-mora-400 mt-1 flex items-center">
                    <RefreshCw size={8} className="mr-1"/> Auto-refill
                 </p>
            </div>
          </div>
          
          <div className="bg-dark-900/50 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Requests</span>
              <Activity className="text-blue-500 opacity-50" size={14} />
            </div>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">142.5k</p>
            <p className="text-[10px] text-slate-500 mt-1">This billing cycle</p>
          </div>

          <div className="bg-dark-900/50 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Active Keys</span>
              <Key className="text-purple-500 opacity-50" size={14} />
            </div>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">4</p>
            <div className="flex -space-x-1.5 mt-1">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-4 h-4 rounded-full bg-dark-800 border border-white/20"></div>
                ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-dark-900/30 p-6 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-slate-300 mb-6">Traffic</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_ANALYTICS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{
                        backgroundColor: '#020617', 
                        borderColor: '#1e293b', 
                        borderRadius: '8px', 
                        fontSize: '12px'
                    }}
                    itemStyle={{color: '#4ade80'}}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{r: 4, fill: '#22c55e'}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="bg-dark-900/30 p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-300">Keys</h3>
                <button className="text-[10px] bg-white text-dark-950 font-bold px-2 py-1 rounded transition-colors hover:bg-slate-200">New Key</button>
            </div>
            <div className="space-y-3">
                {[1, 2].map(key => (
                    <div key={key} className="p-3 bg-dark-950 rounded-lg border border-white/5 flex items-center justify-between group">
                        <div className="flex flex-col overflow-hidden">
                             <span className="text-[10px] font-bold text-slate-500 uppercase">Production {key}</span>
                             <code className="text-[10px] text-mora-200 truncate font-mono mt-1">sk_live_...x2M</code>
                        </div>
                        <button className="text-slate-600 hover:text-white transition-colors"><Copy size={12}/></button>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Latest Invoice</span>
                    <span className="text-white font-mono">₹ 1,200</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};