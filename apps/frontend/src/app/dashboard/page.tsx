import React from 'react';
import { Activity, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Sistem Genel Bakış</h1>
        <p className="text-slate-400 mt-2">Mikroservis ekosisteminizin anlık durumu ve trafik akışı.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Ürün" 
          value="1,280" 
          change="+12%" 
          icon={Package} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Günlük Sipariş" 
          value="45" 
          change="+5%" 
          icon={ShoppingCart} 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="Aktif Servisler" 
          value="4/4" 
          change="Stabil" 
          icon={Activity} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Sistem Yükü" 
          value="12%" 
          change="-2%" 
          icon={TrendingUp} 
          color="bg-violet-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/50 border border-slate-800 p-8 h-[400px] flex items-center justify-center border-dashed">
          <div className="text-center">
            <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">Trafik Akışı Görselleştirmesi</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">Bu alanda mikroservisler arası anlık istek akışı (Canvas) görüntülenecek.</p>
          </div>
        </div>
        
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-8 h-[400px] flex items-center justify-center border-dashed">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">Hızlı İstatistikler</h3>
            <p className="text-sm text-slate-500">Servis bazlı detaylı metrikler yakında.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 transition-all hover:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          change.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
        )}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
      </div>
    </div>
  );
}

// Utility to fix missing import in the same component file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
