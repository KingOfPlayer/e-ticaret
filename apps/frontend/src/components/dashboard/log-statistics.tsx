'use client';

import React, { useEffect, useState } from 'react';
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

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-400';
    if (statusCode >= 300 && statusCode < 400) return 'text-blue-400';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBgColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-500/10 border border-green-500/20';
    if (statusCode >= 300 && statusCode < 400) return 'bg-blue-500/10 border border-blue-500/20';
    if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-500/10 border border-yellow-500/20';
    return 'bg-red-500/10 border border-red-500/20';
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {statistics &&
          Object.entries(statistics).map(([route, stats]) => (
            <div
              key={route}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
            >
              {/* Route Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-indigo-300 truncate">{route}</h4>
                <span className="px-2 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-300">
                  {stats.totalRequests} requests
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Average Response Time */}
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Avg Response</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {stats.averageResponseTime.toFixed(2)}ms
                  </p>
                </div>

                {/* Min Response Time */}
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Min Response</p>
                  <p className="text-lg font-bold text-green-400">{stats.minResponseTime}ms</p>
                </div>

                {/* Max Response Time */}
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Max Response</p>
                  <p className="text-lg font-bold text-orange-400">{stats.maxResponseTime}ms</p>
                </div>

                {/* Performance Badge */}
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Performance</p>
                  <p className={cn(
                    'text-lg font-bold',
                    stats.averageResponseTime < 10 ? 'text-green-400' :
                    stats.averageResponseTime < 50 ? 'text-cyan-400' :
                    'text-yellow-400'
                  )}>
                    {stats.averageResponseTime < 10 ? 'Excellent' :
                     stats.averageResponseTime < 50 ? 'Good' :
                     'Fair'}
                  </p>
                </div>
              </div>

              {/* Status Code Distribution */}
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-3 font-medium">Status Codes</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.statusCodeDistribution).map(([code, count]) => (
                    <div
                      key={code}
                      className={cn(
                        'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                        getStatusBgColor(parseInt(code))
                      )}
                    >
                      <span className={getStatusColor(parseInt(code))}>{code}</span>
                      <span className="text-slate-400 ml-1">({count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
