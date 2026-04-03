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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="glass-panel p-4 flex items-center justify-between rounded-xl transition-all hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-2 rounded-lg bg-indigo-500/10 text-indigo-400',
                service.status === 'offline' && 'bg-rose-500/10 text-rose-400',
              )}
            >
              <service.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {service.name}
              </p>
              <p className="text-sm font-mono text-white/50">Port: {service.port}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'relative flex h-3 w-3',
                service.status === 'online' ? 'text-emerald-400' : 'text-rose-400',
              )}
            >
              {service.status === 'online' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={cn(
                  'relative inline-flex rounded-full h-3 w-3',
                  service.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500',
                )}
              ></span>
            </span>
            <span className="text-xs font-medium text-slate-300">
              {service.status.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
