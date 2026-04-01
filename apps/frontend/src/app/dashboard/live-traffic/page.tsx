'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveTrafficPage() {
  const [filter, setFilter] = useState('Tümü');
  const [traffic, setTraffic] = useState([
    { method: 'GET', path: '/admin/stats', status: 200, latency: '3ms', time: '18:20:19' },
    { method: 'GET', path: '/products', status: 200, latency: '12ms', time: '18:19:54' },
    { method: 'POST', path: '/login', status: 200, latency: '71ms', time: '18:19:30' },
    { method: 'GET', path: '/admin/stats', status: 200, latency: '1ms', time: '18:19:15' },
    { method: 'GET', path: '/admin/stats', status: 200, latency: '2ms', time: '18:18:59' },
    { method: 'POST', path: '/auth/login', status: 401, latency: '42ms', time: '18:18:44' },
    { method: 'GET', path: '/admin/stats', status: 503, latency: '0ms', time: '18:18:19' },
    { method: 'DELETE', path: '/products/65f2d...', status: 200, latency: '15ms', time: '18:17:10' },
  ]);

  const filters = ['Tümü', 'GET', 'POST', 'PUT', 'DELETE', 'Hatalar'];

  const filteredTraffic = traffic.filter(t => {
    if (filter === 'Tümü') return true;
    if (filter === 'Hatalar') return t.status >= 400;
    return t.method === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white/90 uppercase tracking-tight">Canlı Trafik Akışı</h1>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">GERÇEK ZAMANLI</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        {/* Filters */}
        <div className="p-4 border-b border-white/5 flex gap-2 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Traffic List (Image 2 style) */}
        <div className="overflow-y-auto max-h-[600px] scrollbar-hide">
          {filteredTraffic.map((t, index) => (
            <div 
              key={index}
              className="flex items-center justify-between px-6 py-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-6">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black w-14 text-center",
                  t.method === 'GET' && "bg-blue-500/10 text-blue-400",
                  t.method === 'POST' && "bg-emerald-500/10 text-emerald-400",
                  t.method === 'DELETE' && "bg-rose-500/10 text-rose-400",
                  t.method === 'PUT' && "bg-amber-500/10 text-amber-400",
                )}>
                  {t.method}
                </span>
                <span className="text-sm font-medium text-slate-300 font-mono">{t.path}</span>
              </div>
              
              <div className="flex items-center gap-8">
                <span className={cn(
                  "text-xs font-bold font-mono",
                  t.status < 400 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {t.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono w-10 text-right">{t.latency}</span>
                <span className="text-[10px] text-slate-600 font-mono">{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
