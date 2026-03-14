import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Activity, ArrowRight, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">EcoSystem</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Giriş Yap
          </Link>
          <Link 
            href="/auth/register" 
            className="px-5 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95"
          >
            Hemen Katıl
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
          <Zap className="w-3 h-3" />
          Yeni Nesil Mikroservis Mimarisi
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
          E-Ticareti <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
            Yeniden Tanımlayın
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium">
          RMM Seviye 2 uyumlu, tam izole mikroservis mimarisi ile projelerinizi 
          saniyeler içinde ayağa kaldırın ve anlık trafik akışını Dashboard'dan izleyin.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/40 active:scale-95"
          >
            Dashboard'a Git
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95">
            <Globe className="w-5 h-5 text-slate-500" />
            Dokümantasyonu Oku
          </button>
        </div>

        {/* Floating Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
          <FeatureCard 
            icon={ShieldCheck} 
            title="Tam İzolasyon" 
            desc="Dış dünyaya kapalı mikroservisler ile maksimum güvenlik." 
          />
          <FeatureCard 
            icon={Activity} 
            title="Anlık İzleme" 
            desc="Tüm istekleri gerçek zamanlı olarak dashboard'dan takip edin." 
          />
          <FeatureCard 
            icon={ShoppingBag} 
            title="Modern API" 
            desc="RMM Seviye 2 standartlarında temiz ve ölçeklenebilir yapı." 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 border-t border-slate-900 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:row-start-3 md:flex-row items-center justify-between gap-6 text-sm text-slate-500 font-medium">
          <p>© 2026 EcoSystem Inc. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Gizlilik Politikası</span>
            <span className="hover:text-white cursor-pointer transition-colors">Kullanım Şartları</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500/80">Sistem Çevrimiçi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
}
