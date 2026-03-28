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
        const data = await api.get('/statistics', true);
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
      <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
        <div className="inline-block animate-spin">
          <Activity className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-slate-400 mt-2">Statistics loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-slate-900/50 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load statistics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-indigo-400" />
        <h3 className="text-xl font-bold text-white">API Statistics</h3>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/40 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Routes</p>
            <p className="text-lg font-semibold text-white">{overall.totalRoutes}</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Requests</p>
            <p className="text-lg font-semibold text-white">{overall.totalRequests}</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <p className="text-xs text-slate-400">Error Count (300-598)</p>
            <p className="text-lg font-semibold text-red-400">{overall.errorStatusCount}</p>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <p className="text-xs text-slate-400">Overall Error Rate</p>
            <p className="text-lg font-semibold text-red-400">{overall.errorRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-slate-950/40 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
          <div className="col-span-4">Route</div>
          <div className="col-span-2 text-right">Requests</div>
          <div className="col-span-2 text-right">Avg (ms)</div>
          <div className="col-span-1 text-right">Min</div>
          <div className="col-span-1 text-right">Max</div>
          <div className="col-span-2 text-right">Performance</div>
        </div>

        <div className="divide-y divide-slate-800">
          {routeEntries.map(([route, stats]) => (
            <div key={route} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm hover:bg-slate-800/20">
              <div className="col-span-4 text-indigo-300 truncate" title={route}>
                {route}
              </div>
              <div className="col-span-2 text-right text-slate-200">{stats.totalRequests}</div>
              <div className="col-span-2 text-right text-cyan-400">{stats.averageResponseTime.toFixed(2)}</div>
              <div className="col-span-1 text-right text-green-400">{stats.minResponseTime}</div>
              <div className="col-span-1 text-right text-orange-400">{stats.maxResponseTime}</div>
              <div
                className={cn('col-span-2 text-right font-medium', getPerformanceClass(stats.averageResponseTime))}
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
