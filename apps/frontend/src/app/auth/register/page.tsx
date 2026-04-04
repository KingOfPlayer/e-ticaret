'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Activity, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await api.post('/auth/register', { email, password }, true);
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Kayıt işlemi başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[440px] relative z-10">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Activity className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-1">
               <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic block">EcoSystem</span>
               <div className="h-[2px] w-12 bg-emerald-500/40 mx-auto rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 animate-[slide-right_2s_infinite]" />
               </div>
            </div>
          </Link>
        </div>

        <div className="glass-panel border border-slate-200 rounded-[2.5rem] p-10 shadow-sm bg-white backdrop-blur-3xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 text-center mb-4">
               <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-500 decoration-wavy underline-offset-8">YENİ ÜYELİK</h1>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Ekosisteme dahil olmak için form doldurun</p>
            </div>

            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-black uppercase tracking-widest text-center animate-shake shadow-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">E-POSTA ADRESİ</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@ecosystem.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-5 text-[13px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold tracking-tight shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ERİŞİM ANAHTARI (ŞİFRE)</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-5 text-[13px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold tracking-tight shadow-sm"
                />
              </div>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest ml-1">
                EN AZ 8 KARAKTER, GÜÇLÜ BİR ŞİFRE SEÇİN
              </p>
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-5 font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 disabled:grayscale overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  HESABI OLUŞTUR
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
             <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
               Zaten bir hesabınız var mı?
             </p>
             <Link
               href="/auth/login"
               className="inline-block mt-3 text-emerald-600 font-black text-[11px] uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors border-b border-emerald-500/20 pb-0.5"
             >
               MEVCUT OTURUMU AÇIN
             </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          REGISTRATION PROTOCOL v1.2.0
        </p>
      </div>
    </div>
  );
}
