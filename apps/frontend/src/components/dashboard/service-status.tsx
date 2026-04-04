'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Activity, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';

interface Service {
  name: string;
  id: string;
  icon: any;
  status: 'online' | 'offline' | 'checking';
  port: number;
}

export function ServiceStatus() {
  const [services, setServices] = useState<Service[]>([
    { name: 'Gateway', id: 'gateway', icon: ShieldCheck, status: 'checking', port: 5000 },
    { name: 'Auth', id: 'auth', icon: ShieldCheck, status: 'checking', port: 5001 },
    { name: 'Product', id: 'product', icon: ShoppingBag, status: 'checking', port: 5002 },
    { name: 'Order', id: 'order', icon: Truck, status: 'checking', port: 5003 },
  ]);

  // Simulate health check (In a real app, you'd fetch /health from gateway)
  useEffect(() => {
    const checkHealth = async () => {
      const updatedServices = await Promise.all(
        services.map(async (s) => {
          try {
            // Simplified check: try to fetch. If CORS or ECONNREFUSED, it might still show offline.
            // For now, we simulate based on common connectivity
            return { ...s, status: 'online' as const };
          } catch {
            return { ...s, status: 'offline' as const };
          }
        }),
      );
      setServices(updatedServices);
    };

    const interval = setInterval(checkHealth, 5000);
    checkHealth();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="glass-panel p-6 flex items-center justify-between rounded-[1.5rem] transition-all duration-500 hover:bg-white/[0.03] border border-white/5 relative group"
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'p-3.5 rounded-2xl transition-all duration-500 border group-hover:scale-110 shadow-xl',
                service.status === 'online'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-950/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-950/20',
              )}
            >
              <service.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                {service.name}
              </p>
              <p className="text-[11px] font-black font-mono text-white/30 uppercase tracking-tighter">
                PORT: {service.port}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'text-[9px] font-black tracking-widest uppercase',
                  service.status === 'online' ? 'text-emerald-500/60' : 'text-rose-500/60',
                )}
              >
                {service.status === 'online' ? 'ACTIVE' : 'OFFLINE'}
              </span>
              <span
                className={cn(
                  'relative flex h-2 w-2',
                  service.status === 'online' ? 'text-emerald-500' : 'text-rose-400',
                )}
              >
                {service.status === 'online' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                )}
                <span
                  className={cn(
                    'relative inline-flex rounded-full h-2 w-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
                    service.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500',
                  )}
                ></span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
