'use client';

import React, { useEffect, useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category: product.category || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
      });
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (product?._id) {
        await api.put(`/products/${product._id}`, formData);
      } else {
        await api.post('/products', formData, true);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="w-full max-w-xl glass-panel border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 bg-white">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.3em] italic underline decoration-emerald-500 decoration-wavy underline-offset-8">
            {product ? 'MATERYAL GÜNCELLEME' : 'YENİ VERİ GİRİŞİ'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 text-[11px] font-black uppercase tracking-widest animate-shake shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ÜRÜN TANIMLAMASI</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-[13px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold tracking-tight uppercase shadow-sm"
              placeholder="Örn: Akıllı Saat v2"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">DETAYLI AÇIKLAMA</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-[12px] text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none font-bold leading-relaxed uppercase tracking-tight custom-scrollbar shadow-sm"
              placeholder="Ürün teknik özellikleri ve detayları..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">BİRİM FİYAT (₺)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-[13px] text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black tabular-nums tracking-tighter shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">STOK MİKTARI</label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-[13px] text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black tabular-nums tracking-tighter shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">SİSTEM KATEGORİSİ</label>
            <div className="relative group/select">
              <input
                type="text"
                list="product-categories"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-[12px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black uppercase tracking-tight shadow-sm"
                placeholder="Bir kategori seçin veya tanımlayın..."
              />
              <datalist id="product-categories">
                <option value="Teknoloji" />
                <option value="Mutfak" />
                <option value="Giyim" />
                <option value="Ev & Yaşam" />
                <option value="Spor" />
              </datalist>
            </div>
          </div>

          <div className="pt-6 flex items-center gap-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 px-6 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all border border-slate-200 active:scale-95 shadow-sm"
            >
              İPTAL ET
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 fill-current" />
                  {product ? 'SİSTEMİ GÜNCELLE' : 'ENVANTERE KAYDET'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
