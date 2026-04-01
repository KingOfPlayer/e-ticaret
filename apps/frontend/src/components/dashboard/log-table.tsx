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

export function LogTable() {
  return (
    <div className="w-full bg-transparent overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <ActivityIcon className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Sistem Logları</h3>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
            Canlı İzleme Aktif
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20">
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Path
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Servis
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                Durum
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                Gecikme
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider',
                      getMethodColor(log.method),
                    )}
                  >
                    {log.method}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-slate-300 font-mono group-hover:text-white transition-colors">
                    {log.path}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span className="text-sm text-slate-400 uppercase tracking-tight text-[11px] font-medium">
                      {log.service}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      log.statusCode >= 400 ? 'text-rose-500' : 'text-emerald-500',
                    )}
                  >
                    {log.statusCode}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span className="text-sm text-slate-300 font-medium">{log.latencyMs}ms</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 flex justify-center">
        <button className="text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2">
          Hepsini Gör <Clock className="w-3 h-3" />
        </button>
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
