'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Trash2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { RouteTable } from './route-table';
import { AddRouteForm } from './add-route-form';

interface Route {
  _id: string;
  prefix: string;
  target: string;
  __v: number;
}

export function ResolverDashboard() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/route', true);
      setRoutes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshRoutes = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await api.patch('/route', {}, true);
      // Refresh routes after patching
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh routes');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddRoute = async (prefix: string, target: string) => {
    setError(null);
    try {
      await api.post('/route', { prefix, target }, true);
      setShowAddForm(false);
      // Refresh routes after adding
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add route');
    }
  };

  const handleDeleteRoute = async (prefix: string) => {
    setError(null);
    try {
      await api.delete(`/route/${prefix}`, true);
      // Refresh routes after deletion
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete route');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
              <RefreshCw className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">
                ROUTE RESOLVER
              </h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
                Service routing, prefix mapping and gateway configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefreshRoutes}
              disabled={refreshing}
              className="px-6 py-4 rounded-2xl glass-panel border border-slate-200 text-slate-600 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95 bg-white shadow-sm"
            >
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
              Sync Gateway
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Plus className="w-4 h-4" strokeWidth={3} />
              Yeni Giriş
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3 px-6 py-3 glass-panel border border-emerald-100 rounded-2xl w-fit bg-emerald-50 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
            {routes.length} AKTİF ROTA YAPILANDIRILDI
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 text-[11px] font-black uppercase tracking-widest animate-shake shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <p className="font-black">SİSTEM HATASI</p>
              <p className="text-rose-600/60 mt-1 uppercase tracking-tighter">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 transition-colors">
              ✕
            </button>
          </div>
        )}

        {/* Add Route Form */}
        {showAddForm && (
          <div className="animate-in slide-in-from-top-4 duration-500">
            <AddRouteForm onAdd={handleAddRoute} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {/* Routes Table */}
        <div className="glass-panel border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
               <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-50 border-t-emerald-500 rounded-full animate-spin" />
                  <RefreshCw className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">VERİLER ALINIYOR...</p>
            </div>
          ) : routes.length > 0 ? (
            <RouteTable routes={routes} onDelete={handleDeleteRoute} />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 gap-8 opacity-40">
               <RefreshCw className="w-20 h-20 text-slate-300" strokeWidth={1} />
               <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">GİRİŞ BULUNAMADI</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SİSTEME ROTA EKLEYEREK BAŞLAYIN</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

