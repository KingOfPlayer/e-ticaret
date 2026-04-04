'use client';

import React from 'react';
import { Activity, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: 'blue' | 'emerald' | 'amber' | 'rose';
  trend?: string;
}

interface StatsData {
  totalRequests: number;
  successRate: number;
  avgLatency: number;
  errorCount: number;
  trends?: {
    requests?: string;
    success?: string;
    latency?: string;
    errors?: string;
  };
}

export function StatsCards({ stats }: { stats?: StatsData }) {
  const data = stats || {
    totalRequests: 0,
    successRate: 0,
    avgLatency: 0,
    errorCount: 0,
    trends: {},
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Toplam İstek"
        value={data.totalRequests.toLocaleString()}
        subtitle="Sistem Geneli"
        icon={Activity}
        color="blue"
        trend={data.trends?.requests}
      />
      <StatCard
        title="Başarı Oranı"
        value={`%${data.successRate.toFixed(1)}`}
        subtitle="2xx Yanıtlar"
        icon={CheckCircle2}
        color="emerald"
        trend={data.trends?.success}
      />
      <StatCard
        title="Ort. Gecikme"
        value={`${Math.round(data.avgLatency)}ms`}
        subtitle="Yanıt Süresi"
        icon={Clock}
        color="amber"
        trend={data.trends?.latency}
      />
      <StatCard
        title="Hata Sayısı"
        value={data.errorCount}
        subtitle="4xx + 5xx"
        icon={AlertCircle}
        color="rose"
        trend={data.trends?.errors}
      />
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  const colorMap = {
    blue: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-sm',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-sm',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 shadow-sm',
    rose: 'text-rose-600 bg-rose-50 border-rose-100 shadow-sm',
  };

  return (
    <div className="glass-panel group overflow-hidden relative p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Background Glow */}
      <div
        className={cn(
          'absolute -right-8 -top-8 w-32 h-32 blur-[50px] opacity-10 rounded-full transition-all duration-500 group-hover:opacity-30',
          color === 'emerald' || color === 'blue'
            ? 'bg-emerald-500'
            : color === 'amber'
              ? 'bg-amber-500'
              : 'bg-rose-500',
        )}
      />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'p-3 rounded-xl border transition-all duration-500 group-hover:scale-110',
              colorMap[color],
            )}
          >
            <Icon className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
          </div>
          {trend && (
            <div className="flex flex-col items-end">
              <span
                className={cn(
                  'text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase border',
                  trend.startsWith('+')
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : trend.startsWith('-')
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-rose-50 text-rose-600 border-rose-100',
                )}
              >
                {trend}
              </span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 leading-none">
            {title}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">
              {value}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
