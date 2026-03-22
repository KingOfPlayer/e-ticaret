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
      await api.post('/auth/register', { email, password });
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Kayıt işlemi başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">EcoSystem</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hesap Oluştur</h1>
          <p className="text-slate-400 mt-2 font-medium">
            Bize katılın ve ekosistemi yönetmeye başlayın.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">E-posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@ecosystem.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Şifre Oluştur</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 ml-1">
                En az 8 karakter, harf ve rakam içermelidir.
              </p>
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-4 font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Hemen Kayıt Ol
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm font-medium">
            Zaten bir hesabınız var mı?{' '}
            <Link
              href="/auth/login"
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
