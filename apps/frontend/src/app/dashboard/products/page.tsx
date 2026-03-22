'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Package, Trash2, Plus, RefreshCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get('/products');
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
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Ürün Yönetimi</h1>
          <p className="text-slate-400 mt-2">
            Envanterinizdeki ürünleri yönetin ve stok takibi yapın.
          </p>
        </div>
        <button
          onClick={() => alert('Yeni ürün ekleme formu yakında!')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button
              onClick={fetchProducts}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={cn('w-5 h-5', loading && 'animate-spin')} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Ürün Adı
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                    Stok
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Fiyat
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      Henüz ürün bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                            {product.name}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5 mt-0.5 line-clamp-1">
                            {product.description || 'Açıklama yok'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-md text-xs font-medium',
                            product.stock > 10
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400',
                          )}
                        >
                          {product.stock} Adet
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-white">
                          ${product.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
