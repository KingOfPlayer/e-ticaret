'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ShoppingCart, ShoppingBag, Clock, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Order {
  _id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sipariş Yönetimi</h1>
          <p className="text-slate-400 mt-2">Müşteri siparişlerini izleyin ve durumlarını güncelleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Bugünkü Kazanç</span>
            <span className="text-lg font-bold text-white">$4,250.00</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
             <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Sipariş veya müşteri ara..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button 
              onClick={fetchOrders}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Durum</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Tarih</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      Henüz sipariş bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                          getStatusStyle(order.status)
                        )}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-white">
                          ${order.totalAmount.toLocaleString()}
                        </span>
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

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'cancelled': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case 'completed': return <CheckCircle className="w-3 h-3" />;
    case 'pending': return <Clock className="w-3 h-3" />;
    case 'cancelled': return <XCircle className="w-3 h-3" />;
    default: return null;
  }
}
