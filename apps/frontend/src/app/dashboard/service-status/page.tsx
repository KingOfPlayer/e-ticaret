'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { ServiceStatus } from '@/components/dashboard/service-status';

export default function ServiceStatusPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm flex items-center gap-4">
          SİSTEM SAĞLIK MERKEZİ
        </h1>
        <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">
              Mikroservis Bağlantı Durumu ve Port Analizi
            </p>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[2.5rem] border border-slate-200 bg-white shadow-sm relative overflow-hidden">
        <div className="mb-10 flex items-center justify-between">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
            AKTİF SERVİS MATRİSİ
          </h3>
          <span className="text-[10px] text-emerald-600 font-black tracking-[0.2em] uppercase flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
            CANLI TAKİP MODU
          </span>
        </div>

        <ServiceStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/20" />
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
            OTOMATİK KONTROL ÜNİTESİ
          </h4>
          <p className="text-[12px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
            Sistem her 5 saniyede bir tüm mikroservis uç noktalarına (health-check) ping atarak
            durumlarını günceller. Olası bir kesintide uyarı mekanizması tetiklenir.
          </p>
        </div>
        <div className="glass-panel p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/20" />
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
            PORT VE İZOLASYON PROTOKOLÜ
          </h4>
          <p className="text-[12px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
            Her servis kendi izole portu üzerinden Dispatcher (Gateway) ile güvenli bir şekilde
            haberleşmektedir. Bu yapı servis bağımsızlığını ve güvenliğini garanti eder.
          </p>
        </div>
      </div>
    </div>
  );
}

