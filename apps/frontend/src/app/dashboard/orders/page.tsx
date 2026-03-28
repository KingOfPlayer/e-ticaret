'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  ShoppingCart,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Trash2,
  Edit2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OrderModal from '@/components/orders/OrderModal';

interface Order {
  _id: string;
  customerName: string;
  productIds: string[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Siparişler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu siparişi silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter((o) =>
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sipariş Yönetimi</h1>
          <p className="text-slate-400 mt-2">
            Müşteri siparişlerini izleyin ve durumlarını güncelleyin.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">
              Toplam Sipariş
            </span>
            <span className="text-lg font-bold text-white">{orders.length}</span>
          </div>
          <button
            onClick={() => {
              setSelectedOrder(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <ShoppingCart className="w-5 h-5" />
            Yeni Sipariş Oluştur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Müşteri veya durum ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button
              onClick={fetchOrders}
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
                    Müşteri
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Tarih
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Toplam
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      Aranan kriterlere uygun sipariş bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                            getStatusStyle(order.status),
                          )}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-white">
                          ${order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
                          title="Sipariş Durumunu Güncelle"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                          title="Siparişi Sil"
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

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrders}
        order={selectedOrder}
      />
    </div>
  );
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'CANCELLED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}

function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return <CheckCircle className="w-3 h-3" />;
    case 'PENDING':
      return <Clock className="w-3 h-3" />;
    case 'CANCELLED':
      return <XCircle className="w-3 h-3" />;
    default:
      return null;
  }
}

