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
      const data = await api.get('/orders', false);
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
      await api.delete(`/orders/${id}`, true);
      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">
            SİPARİŞ MERKEZİ
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
            Müşteri talepleri, sevkiyat durumu ve finansal işlem takibi
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="px-6 py-4 glass-panel border border-slate-200 rounded-2xl bg-white shadow-sm">
            <span className="text-[9px] text-slate-400 block uppercase font-black tracking-[0.2em] mb-1">
              AKTİF TRAFİK
            </span>
            <span className="text-xl font-black text-slate-900 tabular-nums">{orders.length}</span>
          </div>
          <button
            onClick={() => {
              setSelectedOrder(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <ShoppingCart className="w-4 h-4" strokeWidth={3} />
            YENİ TALEP OLUŞTUR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass-panel border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Müşteri adı veya durum kodu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-[12px] font-black text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all uppercase tracking-tighter shadow-sm"
              />
            </div>
            <button
              onClick={fetchOrders}
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
                    MÜŞTERİ KİMLİĞİ
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
                    İŞLEM DURUMU
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">
                    KAYIT TARİHİ
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">
                    TOPLAM TUTAR
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">
                    KONTROLLER
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                       <div className="flex flex-col items-center gap-6 opacity-40">
                          <ShoppingBag className="w-20 h-20 text-slate-300" strokeWidth={1} />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">AKTİF SİPARİŞ VERİSİ YOK</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-all duration-300 group text-slate-900 font-medium">
                      <td className="px-8 py-6">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                          {order.customerName}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 shadow-sm leading-none',
                            getStatusStyle(order.status),
                          )}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest tabular-nums">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-[14px] font-black text-slate-900 tabular-nums tracking-tighter">
                             ₺{order.totalAmount.toLocaleString('tr-TR')}
                           </span>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">BRÜT TUTAR</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEdit(order)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all duration-300"
                              title="Güncelle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(order._id)}
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
      return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm';
    case 'PENDING':
      return 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm';
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm';
    default:
      return 'bg-slate-50 text-slate-500 border-slate-100';
  }
}

function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return <CheckCircle className="w-3.5 h-3.5" />;
    case 'PENDING':
      return <Clock className="w-3.5 h-3.5" />;
    case 'CANCELLED':
      return <XCircle className="w-3.5 h-3.5" />;
    default:
      return null;
  }
}

