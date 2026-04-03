'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { ServiceStatus } from '@/components/dashboard/service-status';

export default function ServiceStatusPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-md uppercase italic flex items-center gap-3">
          <Activity className="w-6 h-6 text-indigo-400" />
          Servis Durumu
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 ml-9">
          Mikroservis Sağlık Kontrolü ve Port İzleme
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            AKTİF SERVİS LİSTESİ
          </h3>
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Gerçek
            Zamanlı Takip
          </span>
        </div>

        <ServiceStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Otomatik Kontrol
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sistem her 5 saniyede bir tüm mikroservis uç noktalarına (health-check) ping atarak
            durumlarını günceller.
          </p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Port Yönetimi
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Her servis kendi izole portu üzerinden Dispatcher (Gateway) ile güvenli bir şekilde
            haberleşmektedir.
          </p>
        </div>
      </div>
    </div>
  );
}
