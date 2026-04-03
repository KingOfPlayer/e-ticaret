'use client';

import React, { useEffect, useState } from 'react';
import { Search, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { StatsCards } from '@/components/dashboard/stats-cards';
import {
  LatencyLineChart,
  StatusDonutChart,
  RouteChart,
  MethodChart,
} from '@/components/dashboard/overview-charts';
import { LogTable } from '@/components/dashboard/log-table';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const defaultLatencySeries = [
    { time: '-4m', ms: 15 },
    { time: '-3m', ms: 18 },
    { time: '-2m', ms: 12 },
    { time: '-1m', ms: 14 },
    { time: 'now', ms: 16 },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Time Series Data for Charts (5 data points, last 5 minutes)
      const timeSeriesRes = await api.get('/statistics/timeseries', true);

      // 2. Fetch Endpoint Details for aggregated stats
      const endpointDetailsRes = await api.get('/statistics', true);

      // 3. Fetch Recent Logs for the table
      const logsRes = await api.get('/log', true, { limit: 10, order: 'desc' });

      let allLogs: any[] = [];
      if (logsRes && logsRes.logs) {
        // Handle both array and object (file transport) responses
        if (Array.isArray(logsRes.logs)) {
          allLogs = logsRes.logs;
        } else if (logsRes.logs.file && Array.isArray(logsRes.logs.file)) {
          allLogs = logsRes.logs.file;
        } else {
          Object.values(logsRes.logs).forEach((transportLogs: any) => {
            if (Array.isArray(transportLogs)) allLogs = [...allLogs, ...transportLogs];
          });
        }
      }
      
      // Filter for HttpLoggerMiddleware logs only
      const filteredLogs = allLogs.filter((log: any) => log.context === 'HttpLoggerMiddleware');
      setLogs(
        filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      );

      // 3. Process Aggregate Stats from Endpoint Details
      if (endpointDetailsRes) {
        let totalRequests = 0;
        let totalLatencyWeight = 0;
        let successCount = 0;
        let errorCount = 0;
        const statusMap: Record<string, number> = {
          '2xx Success': 0,
          '4xx Client': 0,
          '5xx Server': 0,
        };
        const routes: any[] = [];

        Object.entries(endpointDetailsRes).forEach(([route, s]: [string, any]) => {
          totalRequests += s.totalRequests;
          totalLatencyWeight += s.averageResponseTime * s.totalRequests;

          Object.entries(s.statusCodeDistribution).forEach(([code, count]: [string, any]) => {
            const status = parseInt(code);
            if (status >= 200 && status < 300) {
              successCount += count;
              statusMap['2xx Success'] += count;
            } else if (status >= 400 && status < 500) {
              errorCount += count;
              statusMap['4xx Client'] += count;
            } else if (status >= 500) {
              errorCount += count;
              statusMap['5xx Server'] += count;
            }
          });

          routes.push({ name: route, value: s.totalRequests });
        });

        const avgLatency = totalRequests > 0 ? totalLatencyWeight / totalRequests : 0;
        const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;

        // Process Time Series Data for Latency Chart (5 data points from last 5 minutes)
        let latencySeries = defaultLatencySeries;
        if (Array.isArray(timeSeriesRes) && timeSeriesRes.length >= 5) {
          // Get last 5 data points (first index is current time window)
          const recentData = timeSeriesRes.slice(-5).reverse();
          latencySeries = recentData.map((t: any, idx: number) => {
            const minutesAgo = 4 - idx;
            const timeLabel = minutesAgo === 0 ? 'now' : `-${minutesAgo}m`;
            return {
              time: timeLabel,
              ms: Math.round(t.averageResponseTime || 0),
            };
          });
        }

        setStats({
          cards: {
            totalRequests,
            successRate,
            avgLatency,
            errorCount,
            trends: { requests: '+5%', success: '+0.1%', latency: '-2ms', errors: '-1' },
          },
          statusDistribution: [
            { name: '2xx Success', value: statusMap['2xx Success'], color: '#10b981' },
            { name: '4xx Client', value: statusMap['4xx Client'], color: '#f59e0b' },
            { name: '5xx Server', value: statusMap['5xx Server'], color: '#f43f5e' },
          ],
          routes: routes.sort((a, b) => b.value - a.value).slice(0, 5),
          latencySeries,
        });
      }
    } catch (err) {
      console.error('Veri çekme hatası:', err);
      setError('Sistem verileri güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-md uppercase italic flex items-center gap-2">
            Gösterge Paneli
            {loading && <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />}
          </h1>
          <p
            className={cn(
              'text-[10px] font-bold uppercase tracking-[0.3em] mt-1 transition-colors',
              error ? 'text-rose-500' : 'text-slate-500',
            )}
          >
            {error || 'Sistem Durumu: Çevrimiçi'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Rota veya Log ara..."
              className="bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 w-64 transition-all"
            />
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={cn('w-4 h-4 text-slate-400', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="glass-panel p-12 rounded-3xl border border-rose-500/20 bg-rose-500/[0.02] flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
          <h2 className="text-lg font-bold text-white mb-2">Veri Alınamadı</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-md">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Verileri Yeniden Yükle
          </button>
        </div>
      ) : (
        <>
          {/* 2. Top Stats Row */}
          <StatsCards stats={stats?.cards} />

          {/* 3. Main Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel rounded-3xl h-[400px] border border-white/5 bg-white/[0.01] flex flex-col overflow-hidden">
              <LatencyLineChart data={stats?.latencySeries} />
            </div>
            <div className="glass-panel rounded-3xl h-[400px] border border-white/5 bg-white/[0.01] flex flex-col overflow-hidden">
              <StatusDonutChart data={stats?.statusDistribution} />
            </div>
          </div>

          {/* 4. Detailed Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl h-[450px] border border-white/5 bg-white/[0.01] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  HIZLI AKIŞ (REACH)
                </h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="flex-1 overflow-auto scrollbar-hide">
                <LogTable logs={logs} />
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl h-[213px] border border-white/5 bg-white/[0.01] flex flex-col overflow-hidden">
                <RouteChart data={stats?.routes} />
              </div>
              <div className="glass-panel rounded-3xl h-[213px] border border-white/5 bg-white/[0.01] flex flex-col overflow-hidden">
                <MethodChart data={stats?.statusDistribution} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
