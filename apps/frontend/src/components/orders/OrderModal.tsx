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
        const data = await api.get('/products');
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
        await api.post('/orders', {
          ...formData,
          totalAmount,
        });
      } else {
        await api.put(`/orders/${order?._id}`, {
          status: formData.status,
        });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            {isCreateMode ? 'Yeni Sipariş Oluştur' : 'Sipariş Durumunu Güncelle'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Müşteri Adı</label>
                <input
                  required
                  disabled={!isCreateMode}
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium disabled:opacity-50"
                  placeholder="Müşteri adını girin..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Sipariş Durumu</label>
                <div className="grid grid-cols-1 gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={cn(
                        'px-4 py-2.5 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all text-left flex items-center justify-between',
                        formData.status === status
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300',
                      )}
                    >
                      {status}
                      {formData.status === status && <Plus className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Toplam Tutar
                </p>
                <p className="text-3xl font-bold text-white">${totalAmount.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">
                  {formData.productIds.length} Ürün Seçildi
                </p>
              </div>
            </div>

            <div className="space-y-4 flex flex-col h-[400px]">
              <label className="text-sm font-medium text-slate-300">Ürün Seçimi</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {filteredProducts.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => toggleProduct(p._id)}
                    className={cn(
                      'w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group',
                      formData.productIds.includes(p._id)
                        ? 'bg-indigo-500/10 border-indigo-500/50'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700',
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500">${p.price.toLocaleString()}</p>
                    </div>
                    {formData.productIds.includes(p._id) ? (
                      <div className="bg-indigo-600 rounded-full p-1">
                        <Minus className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="bg-slate-800 group-hover:bg-slate-700 rounded-full p-1">
                        <Plus className="w-3 h-3 text-slate-400 group-hover:text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-medium transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isCreateMode ? 'Sipariş Ver' : 'Güncelle'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
