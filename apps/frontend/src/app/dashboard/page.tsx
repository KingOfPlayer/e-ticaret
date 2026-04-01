'use client';

import React from 'react';
import { Database, TrendingUp, Search, Clock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MethodChart, RouteChart } from '@/components/dashboard/overview-charts';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1200 pb-12">
      {/* 1. Header (Görseldeki gibi sağ üst saat/search/user placeholder) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white/90 drop-shadow-sm uppercase">Özet</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-sm bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
             <Clock className="w-4 h-4" />
             <span>18:41:22</span>
          </div>
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-xl text-xs font-bold text-slate-300">
             <span>Oğuzhan</span>
             <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black">Admin</span>
          </div>
        </div>
      </div>

      {/* 2. Three Service Cards (Image 1 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ServiceCard
          title="Dispatcher"
          port="8000"
          requests="156"
          latency="3ms"
          errors="0"
          db="MongoDB"
          color="text-emerald-400"
        />
        <ServiceCard
          title="Auth Service"
          port="5001"
          requests="42"
          latency="8ms"
          errors="1"
          db="MongoDB"
          color="text-emerald-400"
        />
        <ServiceCard
          title="Product Service"
          port="5002"
          requests="12"
          latency="12ms"
          errors="0"
          db="MongoDB"
          color="text-emerald-400"
        />
      </div>

      {/* 3. Overview Charts (Image 1 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl h-[400px]">
           <MethodChart />
        </div>
        <div className="glass-panel rounded-2xl h-[400px]">
           <RouteChart />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ title, port, requests, latency, errors, db, color }: any) {
  return (
    <div className="glass-panel rounded-2xl p-6 transition-all border border-white/5 bg-white/[0.01]">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h4>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-emerald-400 font-mono text-xs font-black">:{port}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-widest">İstek Sayısı</span>
          <span className="text-slate-200 font-mono text-sm">{requests}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-widest">Ort. Süre</span>
          <span className="text-slate-200 font-mono text-sm">{latency}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-widest">Hata</span>
          <span className={cn("font-mono text-sm", parseInt(errors) > 0 ? "text-rose-500" : "text-slate-200 text-emerald-500")}>
            {errors}
          </span>
        </div>
        <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-widest">DB</span>
          <span className="text-indigo-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <Database className="w-3 h-3" /> {db}
          </span>
        </div>
      </div>
    </div>
  );
}
