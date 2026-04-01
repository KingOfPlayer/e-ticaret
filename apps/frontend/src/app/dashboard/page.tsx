import React from 'react';
import { Activity, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { TrafficFlow } from '@/components/dashboard/traffic-flow';
import { LogTable } from '@/components/dashboard/log-table';
import { QuickStatsChart } from '@/components/dashboard/quick-stats-chart';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-sm">Sistem Genel Bakış</h1>
        <p className="text-indigo-200/60 mt-2">
          Mikroservis ekosisteminizin anlık durumu ve trafik akışı.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Ürün"
          value="1,280"
          change="+12%"
          icon={Package}
          color="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
        />
        <StatCard
          title="Günlük Sipariş"
          value="45"
          change="+5%"
          icon={ShoppingCart}
          color="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        />
        <StatCard
          title="Aktif Servisler"
          value="4/4"
          change="Stabil"
          icon={Activity}
          color="bg-violet-500/20 text-violet-400 border border-violet-500/30"
        />
        <StatCard
          title="Sistem Yükü"
          value="12%"
          change="-2%"
          icon={TrendingUp}
          color="bg-rose-500/20 text-rose-400 border border-rose-500/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-8 h-[400px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle glow behind the flow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          <TrafficFlow />
        </div>

        <div className="glass-panel rounded-2xl p-8 h-[400px] flex flex-col">
          <QuickStatsChart />
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
         <LogTable />
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="glass-panel rounded-2xl p-6 transition-all hover:bg-white/[0.04]">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl', color)}>
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={cn(
            'text-xs font-semibold px-2.5 py-1 rounded-full border',
            change.startsWith('+') || change === 'Stabil'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          )}
        >
          {change}
        </span>
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <h4 className="text-3xl font-bold text-white/90 mt-1.5">{value}</h4>
      </div>
    </div>
  );
}
