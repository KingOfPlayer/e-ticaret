'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { X, Save, AlertCircle, ShoppingBag, Plus, Minus, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  productIds: string[];
  totalAmount: number;
  status: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: Order | null;
}

const STATUS_OPTIONS = ['PENDING', 'COMPLETED', 'CANCELLED'];

export default function OrderModal({ isOpen, onClose, onSuccess, order }: OrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    productIds: [] as string[],
    status: 'PENDING',
  });
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isCreateMode = !order;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/products', false);
        setAvailableProducts(data);
      } catch (err) {
        console.error('Ürünler yüklenemedi:', err);
      }
    };

    if (isOpen) {
      fetchProducts();
      if (order) {
        setFormData({
          customerName: order.customerName,
          productIds: order.productIds,
          status: order.status,
        });
      } else {
        setFormData({
          customerName: '',
          productIds: [],
          status: 'PENDING',
        });
      }
      setError(null);
    }
  }, [order, isOpen]);

  const totalAmount = useMemo(() => {
    return formData.productIds.reduce((sum, id) => {
      const product = availableProducts.find((p) => p._id === id);
      return sum + (product?.price || 0);
    }, 0);
  }, [formData.productIds, availableProducts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productIds.length === 0) {
      setError('Lütfen en az bir ürün seçin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isCreateMode) {
        await api.post(
          '/orders',
          {
            ...formData,
            totalAmount,
          },
          true,
        );
      } else {
        await api.put(
          `/orders/${order?._id}`,
          {
            status: formData.status,
          },
          true,
        );
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const filteredProducts = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="w-full max-w-4xl glass-panel border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 bg-white">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.3em] italic underline decoration-emerald-500 decoration-wavy underline-offset-8">
                {isCreateMode ? 'YENİ TALEP OLUŞTURMA' : 'SİPARİŞ GÜNCELLEME'}
              </h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">
                VERİ GİRİŞİ VE İŞLEM ONAYI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 text-[11px] font-black uppercase tracking-widest animate-shake shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  MÜŞTERİ TANIMLAMASI
                </label>
                <input
                  required
                  disabled={!isCreateMode}
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-[13px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold tracking-tight uppercase disabled:opacity-30 shadow-sm"
                  placeholder="Müşteri tam adını girin..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  İŞLEM DURUMU
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={cn(
                        'px-6 py-4 rounded-2xl border text-[10px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-between group active:scale-95 shadow-sm',
                        formData.status === status
                          ? status === 'COMPLETED'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20 shadow-lg'
                            : status === 'CANCELLED'
                              ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20 shadow-lg'
                              : 'bg-amber-500 text-white border-amber-400 shadow-amber-500/20 shadow-lg'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-900',
                      )}
                    >
                      {status}
                      {formData.status === status && (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                  TOPLAM ANALİZ
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
                    ₺{totalAmount.toLocaleString('tr-TR')}
                  </p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase italic">Brüt</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${Math.min((formData.productIds.length / 5) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {formData.productIds.length} ÜRÜN SEÇİLDİ
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col h-[500px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                ENVANTER LİSTESİ
              </label>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Ürün adı ile filtrele..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-[12px] font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all uppercase tracking-tight shadow-sm"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {filteredProducts.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => toggleProduct(p._id)}
                    className={cn(
                      'w-full p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group active:scale-[0.98] shadow-sm',
                      formData.productIds.includes(p._id)
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50',
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          'text-[12px] font-black group-hover:text-emerald-600 transition-colors uppercase tracking-tight',
                          formData.productIds.includes(p._id)
                            ? 'text-emerald-600'
                            : 'text-slate-900',
                        )}
                      >
                        {p.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 tabular-nums mt-1">
                        ₺{p.price.toLocaleString('tr-TR')}
                      </p>
                    </div>
                    {formData.productIds.includes(p._id) ? (
                      <div className="bg-emerald-600 rounded-lg p-1.5 shadow-lg shadow-emerald-500/20">
                        <Minus className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="bg-slate-100 group-hover:bg-emerald-50 rounded-lg p-1.5 transition-colors border border-slate-200">
                        <Plus
                          className="w-3 h-3 text-slate-400 group-hover:text-emerald-600"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center gap-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 px-6 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all border border-slate-200 active:scale-95 shadow-sm"
            >
              İŞLEMİ İPTAL ET
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-50 disabled:opacity-50 text-white px-6 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 fill-current" />
                  {isCreateMode ? 'SİPARİŞİ KAYDET' : 'DURUMU GÜNCELLE'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
