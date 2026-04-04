'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Activity, Zap, ShieldCheck, AlertCircle } from 'lucide-react';

export function SystemStatus() {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [latency, setLatency] = useState<number | null>(null);

  const checkStatus = async () => {
    const start = Date.now();
    try {
      // Pinging the health or logs endpoint as a proxy for system status
      await api.get('/products', false);
      setLatency(Date.now() - start);
      setStatus('online');
    } catch (err) {
      setStatus('offline');
      setLatency(null);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-full px-5 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className={cn(
              'w-2 h-2 rounded-full shadow-sm',
              status === 'online'
                ? 'bg-emerald-500 shadow-emerald-500/20'
                : status === 'offline'
                  ? 'bg-rose-500'
                  : 'bg-slate-300 animate-pulse',
            )}
          />
          {status === 'online' && (
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-30" />
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {status === 'online'
            ? 'Sistem Aktif'
            : status === 'offline'
              ? 'Sistem Çevrimdışı'
              : 'Kontrol Ediliyor'}
        </span>
      </div>

      {status === 'online' && latency && (
        <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-black text-slate-400 tabular-nums">{latency}ms</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Güvenli</span>
      </div>
    </div>
  );
}
