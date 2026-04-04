'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface RouteStatistics {
  totalRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  statusCodeDistribution: Record<string, number>;
}

interface StatisticsData {
  [route: string]: RouteStatistics;
}

export function LogStatistics() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await api.get('/api/statistics', true);
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    const interval = setInterval(fetchStatistics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const routeEntries = useMemo(() => Object.entries(statistics ?? {}), [statistics]);

  const overall = useMemo(() => {
    let totalStatusCount = 0;
    let errorStatusCount = 0;

    routeEntries.forEach(([, stats]) => {
      Object.entries(stats.statusCodeDistribution).forEach(([code, count]) => {
        const numericCode = Number(code);
        totalStatusCount += count;
        if (numericCode >= 300 && numericCode < 599) {
          errorStatusCount += count;
        }
      });
    });

    const errorRate = totalStatusCount > 0 ? (errorStatusCount / totalStatusCount) * 100 : 0;

    return {
      totalStatusCount,
      errorStatusCount,
      errorRate,
      totalRoutes: routeEntries.length,
      totalRequests: routeEntries.reduce((sum, [, stats]) => sum + stats.totalRequests, 0),
    };
  }, [routeEntries]);

  const getPerformanceText = (averageResponseTime: number) => {
    if (averageResponseTime < 10) return 'Excellent';
    if (averageResponseTime < 50) return 'Good';
    return 'Fair';
  };

  const getPerformanceClass = (averageResponseTime: number) => {
    if (averageResponseTime < 10) return 'text-green-400';
    if (averageResponseTime < 50) return 'text-cyan-400';
    return 'text-yellow-400';
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="inline-block animate-spin">
          <Activity className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="text-slate-400 mt-3 text-[10px] font-black uppercase tracking-widest">
          Statistics loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-xs font-black uppercase tracking-tight">
            Failed to load statistics: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">
          API Statistics
        </h3>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Routes
            </p>
            <p className="text-2xl font-black text-slate-900 tabular-nums">{overall.totalRoutes}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Requests
            </p>
            <p className="text-2xl font-black text-slate-900 tabular-nums">
              {overall.totalRequests}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Error Count (300-598)
            </p>
            <p className="text-2xl font-black text-rose-600 tabular-nums">
              {overall.errorStatusCount}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Overall Error Rate
            </p>
            <p className="text-2xl font-black text-rose-600 tabular-nums">
              {overall.errorRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 gap-3 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">
          <div className="col-span-4">Route Path</div>
          <div className="col-span-2 text-right">Requests</div>
          <div className="col-span-2 text-right">Avg (ms)</div>
          <div className="col-span-1 text-right">Min</div>
          <div className="col-span-1 text-right">Max</div>
          <div className="col-span-2 text-right">Performance</div>
        </div>

        <div className="divide-y divide-slate-50">
          {routeEntries.map(([route, stats]) => (
            <div
              key={route}
              className="grid grid-cols-12 gap-3 px-6 py-4 text-[12px] hover:bg-slate-50/50 transition-colors group"
            >
              <div
                className="col-span-4 text-emerald-600 font-black truncate uppercase tracking-tight"
                title={route}
              >
                {route}
              </div>
              <div className="col-span-2 text-right text-slate-400 font-bold tabular-nums group-hover:text-slate-900 transition-colors">
                {stats.totalRequests}
              </div>
              <div className="col-span-2 text-right text-slate-900 font-black tabular-nums">
                {stats.averageResponseTime.toFixed(2)}
              </div>
              <div className="col-span-1 text-right text-emerald-600 font-bold tabular-nums">
                {stats.minResponseTime}
              </div>
              <div className="col-span-1 text-right text-orange-600 font-bold tabular-nums">
                {stats.maxResponseTime}
              </div>
              <div
                className={cn(
                  'col-span-2 text-right font-black uppercase tracking-widest text-[10px]',
                  getPerformanceClass(stats.averageResponseTime).replace('400', '600'),
                )}
              >
                {getPerformanceText(stats.averageResponseTime)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
