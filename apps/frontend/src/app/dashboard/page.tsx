import React from 'react';
import { Activity, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { TrafficFlow } from '@/components/dashboard/traffic-flow';
import { LogTable } from '@/components/dashboard/log-table';
import { QuickStatsChart } from '@/components/dashboard/quick-stats-chart';
import { ServiceStatus } from '@/components/dashboard/service-status';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header & Quick Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-sm">Dispatcher Komuta Merkezi</h1>
          <p className="text-indigo-200/60 mt-2 font-medium">
            Mikroservis ekosisteminizin anlık durumu, trafik akışı ve performans analizi.
          </p>
        </div>
        <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Canlı Yayın Aktif</span>
        </div>
      </div>

      {/* 2. Service Health Pulse (Docs1 Requirement) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Servis Sağlık Durumu</h2>
        </div>
        <ServiceStatus />
      </section>

      {/* 3. Main Analytics Grid (Request Flow & Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Live Request Flow (Docs1 Requirement) */}
        <div className="lg:col-span-7 xl:col-span-8 glass-panel rounded-2xl p-6 min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white/90">İstek Akış Diyagramı</h3>
              <p className="text-xs text-indigo-200/40">Gateway ⇆ Mikroservisler arası aktif veri transferi</p>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
             <TrafficFlow />
          </div>
        </div>

        {/* Right: Performance Chart */}
        <div className="lg:col-span-5 xl:col-span-4 glass-panel rounded-2xl p-6 min-h-[450px] flex flex-col">
           <div className="mb-6">
              <h3 className="text-lg font-bold text-white/90">Yanıt Süreleri</h3>
              <p className="text-xs text-indigo-200/40">p95 / p99 Gecikme Analizi (ms)</p>
           </div>
           <div className="flex-1">
              <QuickStatsChart />
           </div>
        </div>
      </div>

      {/* 4. Real-time Logs Section (Docs1 Requirement) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Activity className="w-4 h-4 text-indigo-400" />
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sistem Log Akışı</h2>
          </div>
          <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            Tümünü Gör
          </button>
        </div>
        <div className="glass-panel overflow-hidden rounded-2xl border border-white/5">
           <LogTable />
        </div>
      </section>
    </div>
  );
}
