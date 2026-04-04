import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Activity, ArrowRight, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-950/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[130px] rounded-full" />
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-2xl shadow-emerald-950/20 group-hover:border-emerald-500/40 transition-all duration-500">
            <Activity className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
              ECOSYSTEM <span className="text-emerald-500">X</span>
            </span>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] -mt-1">ULTIMATE GATEWAY</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/auth/login"
            className="px-10 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all shadow-2xl active:scale-95 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            Sisteme Giriş
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-40 pb-32 px-8 text-center max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[9px] font-black tracking-[0.3em] uppercase mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-2xl shadow-emerald-950/20">
          <Zap className="w-3 h-3 animate-pulse" />
          RMM SEVİYE 2 MİKROSERVİS MİMARİSİ
        </div>

        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-10 leading-[0.85] uppercase italic drop-shadow-2xl animate-in fade-in fill-mode-both duration-1000">
          MİMARİNİZİ<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500">
            HIZLANDIRIN
          </span>
        </h1>

        <p className="text-base text-slate-500 max-w-2xl mb-16 leading-relaxed font-black uppercase tracking-widest opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          TAM İZOLE MİKROSERVİS YAPISI, GERÇEK ZAMANLI TRAFİK ANALİZİ VE AKILLI ROTA YÖNETİMİ İLE GELECEĞİN E-TİCARET ALTYAPISI.
        </p>

        <div className="flex flex-col sm:row-start-3 sm:flex-row items-center gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link
            href="/dashboard"
            className="group flex items-center gap-4 px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-[0_0_50px_rgba(16,185,129,0.25)] active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            KONTROL ÜNİTESİNE GİT
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
          </Link>

          <button className="flex items-center gap-4 px-10 py-6 bg-white/[0.01] border border-white/5 text-slate-400 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:text-white hover:bg-white/[0.05] transition-all active:scale-95 group">
            <Globe className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            DOKÜMANTASYON
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-48 w-full text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <FeatureCard
            icon={ShieldCheck}
            title="TAM İZOLASYON"
            desc="DIŞ DÜNYAYA KAPALI, SADECE GATEWAY ÜZERİNDEN ERİŞİLEBİLEN GÜVENLİ MİKROSERVİS KÜMELERİ."
          />
          <FeatureCard
            icon={Activity}
            title="GERÇEK ZAMANLI ANALİZ"
            desc="SİSTEM ÜZERİNDEN GEÇEN HER İSTEĞİ MİLİSANİYELİK HASSASİYETLE TAKİP EDİN VE ANALİZ EDİN."
          />
          <FeatureCard
            icon={ShoppingBag}
            title="MODERN API STANDARTI"
            desc="RMM SEVİYE 2 STANDARTLARINDA, TEMİZ, ÖLÇEKLENEBİLİR VE DOKÜMANTE EDİLMİŞ API YAPISI."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-10 border-t border-white/5 mt-32 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">© 2026 ECOSYSTEM X PROJECT</p>
            <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.2em]">ALL SYSTEM PROTOCOLS SECURED</p>
          </div>
          <div className="flex items-center gap-12 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <span className="hover:text-emerald-500 cursor-pointer transition-colors px-2 py-1">GİZLİLİK</span>
            <span className="hover:text-emerald-500 cursor-pointer transition-colors px-2 py-1">KULLANIM</span>
            <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 px-5 py-2 rounded-full shadow-2xl shadow-emerald-950/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-emerald-500">SİSTEM ÇEVRİMİÇİ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 transition-all duration-500 hover:-translate-y-2 group shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/5 transition-all" />
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-8 group-hover:bg-emerald-500/10 transition-all">
        <Icon className="w-8 h-8 text-emerald-500" />
      </div>
      <h3 className="text-lg font-black text-white mb-4 tracking-tight uppercase italic">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-[11px] font-black tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
    </div>
  );
}
