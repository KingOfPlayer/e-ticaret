'use client';

import React from 'react';
import { Search, Clock } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { LatencyLineChart, StatusDonutChart, RouteChart, MethodChart } from '@/components/dashboard/overview-charts';
import { LogTable } from '@/components/dashboard/log-table';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-md uppercase italic">Gösterge Paneli</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Sistem Durumu: Çevrimiçi</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Rota veya Log ara..." 
              className="bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 w-64 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-sm bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
             <Clock className="w-4 h-4" />
             <span>18:41:22</span>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Row */}
      <StatsCards />

      {/* 3. Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl h-[400px] border border-white/5 bg-white/[0.01]">
           <LatencyLineChart />
        </div>
        <div className="glass-panel rounded-3xl h-[400px] border border-white/5 bg-white/[0.01]">
           <StatusDonutChart />
        </div>
      </div>

      {/* 4. Detailed Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl h-[450px] border border-white/5 bg-white/[0.01] overflow-hidden flex flex-col">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">CANLI İŞLEM AKIŞI</h3>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           </div>
           <div className="flex-1 overflow-auto scrollbar-hide">
              <LogTable />
           </div>
        </div>
        <div className="space-y-6">
           <div className="glass-panel rounded-3xl h-[213px] border border-white/5 bg-white/[0.01]">
              <RouteChart />
           </div>
           <div className="glass-panel rounded-3xl h-[213px] border border-white/5 bg-white/[0.01]">
              <MethodChart />
           </div>
        </div>
      </div>
    </div>
  );
}
