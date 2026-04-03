'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, Globe, Shield, Zap } from 'lucide-react';

interface Log {
  id: string;
  path: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  service: string;
  createdAt: string | Date;
}

const mockLogs: Log[] = [
  {
    id: '1',
    path: '/api/auth/login',
    method: 'POST',
    statusCode: 200,
    latencyMs: 45,
    service: 'auth-service',
    createdAt: new Date(),
  },
  {
    id: '2',
    path: '/api/products',
    method: 'GET',
    statusCode: 200,
    latencyMs: 12,
    service: 'product-service',
    createdAt: new Date(),
  },
  {
    id: '3',
    path: '/api/orders',
    method: 'POST',
    statusCode: 201,
    latencyMs: 89,
    service: 'order-service',
    createdAt: new Date(),
  },
  {
    id: '4',
    path: '/api/products/123',
    method: 'DELETE',
    statusCode: 204,
    latencyMs: 34,
    service: 'product-service',
    createdAt: new Date(),
  },
  {
    id: '5',
    path: '/api/auth/register',
    method: 'POST',
    statusCode: 400,
    latencyMs: 23,
    service: 'auth-service',
    createdAt: new Date(),
  },
];

export function LogTable({ logs = [] }: { logs?: any[] }) {
  const displayLogs = logs.length > 0 ? logs : [];

  return (
    <div className="w-full bg-transparent overflow-hidden">
      <div className="overflow-x-auto h-[350px]">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md">
            <tr className="border-b border-white/5">
              <th className="w-20 px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Method
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Path
              </th>
              <th className="w-32 px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Servis
              </th>
              <th className="w-20 px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                Durum
              </th>
              <th className="w-24 px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                Gecikme
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest italic">
                    Veri akışı bekleniyor...
                  </p>
                </td>
              </tr>
            ) : (
              displayLogs.map((log, index) => (
                <tr key={index} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[9px] font-black tracking-widest border',
                        getMethodColor(log.method || 'GET'),
                      )}
                    >
                      {log.method || 'GET'}
                    </span>
                  </td>
                  <td className="px-6 py-4 truncate">
                    <code className="text-xs text-slate-300 font-mono group-hover:text-indigo-300 transition-colors">
                      {log.url || '/'}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
                      <span className="text-[10px] text-slate-400 uppercase font-black truncate">
                        {log.label || 'system'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        'text-xs font-black font-mono',
                        (log.statusCode || 200) >= 400 ? 'text-rose-500' : 'text-emerald-500',
                      )}
                    >
                      {log.statusCode || 200}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-slate-300 font-mono italic">
                        {log.responseTime || '0'}ms
                      </span>
                      <Zap className="w-3 h-3 text-amber-500" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getMethodColor(method: string) {
  switch (method) {
    case 'GET':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    case 'POST':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'PUT':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'DELETE':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
