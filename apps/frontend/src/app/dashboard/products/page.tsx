'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Package, Trash2, Plus, RefreshCw, Search, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductModal from '@/components/products/ProductModal';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get('/products', false);
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError('Ürünler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/products/${id}`, true);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">
            ENVANTER YÖNETİMİ
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
            Stok takibi, ürün düzenleme ve kategori bazlı analiz merkezi
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Plus className="w-4 h-4" strokeWidth={3} />
          YENİ ÜRÜN TANIMLA
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass-panel border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Kod, ad veya kategori ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-[12px] font-black text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all uppercase tracking-tighter shadow-sm"
              />
            </div>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-4 text-slate-400 hover:text-emerald-600 transition-all active:rotate-180 duration-500 border border-slate-200 rounded-2xl bg-white shadow-sm"
            >
              <RefreshCw className={cn('w-5 h-5', loading && 'animate-spin')} />
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    ÜRÜN BİLGİSİ / KATEGORİ
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
                    STOK DURUMU
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">
                    BİRİM FİYAT
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">
                    EYLEMLER
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-6 opacity-40">
                         <Package className="w-20 h-20 text-slate-300" strokeWidth={1} />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">KAYITLI ÜRÜN BULUNAMADI</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/50 transition-all duration-300 group text-slate-900 font-medium">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                            {product.name}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest opacity-80">
                            {product.category || 'KATEGORİSİZ'} •{' '}
                            {product.description || 'AÇIKLAMA GİRİLMEMİŞ'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={cn(
                            'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 shadow-sm leading-none inline-block',
                            product.stock > 10
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-100',
                          )}
                        >
                          {product.stock} ADET
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-[14px] font-black text-slate-900 tabular-nums tracking-tighter">
                             ₺{product.price.toLocaleString('tr-TR')}
                           </span>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">NET TUTAR</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all duration-300"
                              title="Düzenle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-300"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />
    </div>
  );
}
