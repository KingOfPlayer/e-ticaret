'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddRouteFormProps {
  onAdd: (prefix: string, target: string) => Promise<void>;
  onCancel: () => void;
}

export function AddRouteForm({ onAdd, onCancel }: AddRouteFormProps) {
  const [prefix, setPrefix] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!prefix.trim()) {
      setError('Prefix/Önek alanı zorunludur.');
      return;
    }
    if (!target.trim()) {
      setError('Hedef URL alanı zorunludur.');
      return;
    }

    // Basic URL validation for target
    try {
      new URL(target.trim());
    } catch {
      setError('Hedef geçerli bir URL olmalıdır (örn: http://...).');
      return;
    }

    setLoading(true);
    try {
      await onAdd(prefix.trim(), target.trim());
      setPrefix('');
      setTarget('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rota eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel border border-slate-200 rounded-[2rem] p-10 bg-white shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />
      
      <div className="flex items-center justify-between mb-10 relative">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
              <Plus className="w-5 h-5 text-emerald-600" />
           </div>
           <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">YENİ ROTA TANIMLAMA</h3>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Prefix Input */}
          <div className="space-y-3">
            <label htmlFor="prefix" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              ERİŞİM ÖNEKİ (PREFIX)
            </label>
            <div className="relative">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[13px]">/</span>
               <input
                 id="prefix"
                 type="text"
                 value={prefix}
                 onChange={(e) => setPrefix(e.target.value)}
                 placeholder="örn: orders"
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-6 py-5 text-[13px] font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all uppercase tracking-tight shadow-sm"
               />
            </div>
          </div>

          {/* Target Input */}
          <div className="space-y-3">
            <label htmlFor="target" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              HEDEF SERVİS URL (TARGET)
            </label>
            <input
              id="target"
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="örn: http://localhost:5002"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-[13px] font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all tracking-tight shadow-sm"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 text-[11px] font-black uppercase tracking-widest animate-shake shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-200 active:scale-95 shadow-sm"
          >
            İPTAL
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Plus className="w-4 h-4" strokeWidth={3} />
            {loading ? 'İŞLENİYOR...' : 'SİSTEME KAYDET'}
          </button>
        </div>
      </form>
    </div>
  );
}
