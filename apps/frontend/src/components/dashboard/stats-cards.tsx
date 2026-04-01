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
    trends: {}
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
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-100 shadow-amber-500/5',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5',
  };

  return (
    <div className="glass-panel group overflow-hidden relative p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
      {/* Background Glow */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-20 rounded-full transition-all duration-500 group-hover:opacity-40",
        color === 'blue' && "bg-blue-500",
        color === 'emerald' && "bg-emerald-500",
        color === 'amber' && "bg-amber-500",
        color === 'rose' && "bg-rose-500",
      )} />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={cn("p-2.5 rounded-xl border transition-transform duration-300 group-hover:scale-110", colorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : (trend.startsWith('-') ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500")
            )}>
              {trend}
            </span>
          )}
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
            {title}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">
              {value}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
