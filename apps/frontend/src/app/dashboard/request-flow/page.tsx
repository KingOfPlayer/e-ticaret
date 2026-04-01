'use client';

import React from 'react';
import { Database, Monitor, ShieldCheck, Zap, Share2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RequestFlowPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white/90 uppercase tracking-tight">İstek Akışı & Mimari</h1>
        <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-widest">Sistem Hiyerarşisi ve Güvenlik Adımları</p>
      </div>

      {/* 1. İSTEK AKIŞ DİYAGRAMI (Image 3 Layout) */}
      <section className="glass-panel rounded-2xl p-8 space-y-8">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">İSTEK AKIŞ DİYAGRAMI</h3>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-8 min-h-[300px]">
          {/* Client Node */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-xl">
               <Monitor className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">İSTEMCİ</p>
              <p className="text-xs text-white/70 font-bold">Browser / API</p>
            </div>
          </div>

          <ArrowRight className="text-indigo-500/30 hidden lg:block" />

          {/* Gateway Node */}
          <div className="flex flex-col items-center gap-3">
             <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <ShieldCheck className="w-10 h-10 text-indigo-400" />
                </div>
                <div className="absolute -top-3 -right-3 bg-indigo-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter">Gateway</div>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DISPATCHER</p>
                <p className="text-xs text-indigo-400 font-bold font-mono">:5000</p>
             </div>
          </div>

          <ArrowRight className="text-indigo-500/30 hidden lg:block" />

          {/* Services Group */}
          <div className="flex flex-col gap-6">
             <ServiceNode name="Auth-Service" port="5001" db="db-auth" color="text-violet-400" />
             <ServiceNode name="Product-Service" port="5002" db="db-product" color="text-indigo-400" />
             <ServiceNode name="Order-Service" port="5003" db="db-order" color="text-purple-400" />
          </div>
        </div>
      </section>

      {/* 2. JWT DOĞRULAMA AKIŞI (Image 3 Stepper) */}
      <section className="glass-panel rounded-2xl p-8 space-y-8">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">JWT DOĞRULAMA AKIŞI</h3>
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-8">
          {/* Connecting Line */}
          <div className="absolute top-[52px] left-8 right-8 h-0.5 bg-white/5 hidden md:block" />
          
          <StepNode number="1" label="İstek Gelir" icon={Activity} active />
          <StepNode number="2" label="JWT Kontrol" icon={ShieldCheck} active />
          
          <div className="flex flex-col items-center gap-4 z-10">
             <div className="flex gap-4">
                <div className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded text-[8px] font-black uppercase tracking-widest">Geçersiz 401</div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[8px] font-black uppercase tracking-widest">Geçerli</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-slate-400" />
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yönlendirme</p>
          </div>

          <StepNode number="3" label="Servise İlet" icon={Zap} active />
          <StepNode number="4" label="Log Kaydı" icon={CheckCircle2} active />
        </div>
      </section>
    </div>
  );
}

function ServiceNode({ name, port, db, color }: any) {
  return (
    <div className="flex items-center gap-4">
       <div className="w-40 glass-panel p-3 border-l-4 border-l-indigo-500 rounded-lg bg-white/[0.02]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">MIKROSERVIS</p>
          <p className={cn("text-sm font-bold", color)}>{name}</p>
          <p className="text-[10px] font-mono text-slate-600">Port: {port}</p>
       </div>
       <ArrowRight className="w-4 h-4 text-slate-700" />
       <div className="glass-panel p-3 rounded-lg border border-indigo-500/10 bg-indigo-500/[0.02]">
          <Database className="w-4 h-4 text-indigo-400 mb-1" />
          <p className="text-[10px] font-bold text-slate-200">{db}</p>
       </div>
    </div>
  );
}

function StepNode({ number, label, icon: Icon, active }: any) {
  return (
    <div className="flex flex-col items-center gap-3 z-10 group">
       <div className={cn(
         "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300",
         active 
           ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
           : "bg-white/[0.02] border-white/10 text-slate-600"
       )}>
         <Icon className="w-6 h-6" />
         <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 border border-indigo-500/30 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-400">
           {number}
         </div>
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{label}</p>
    </div>
  );
}
