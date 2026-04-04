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
  }, []);  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic drop-shadow-sm">
              KONTROL ÜNİTESİ
            </h1>
            {loading && <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              error ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            )} />
            <p
              className={cn(
                'text-[10px] font-black uppercase tracking-[0.4em] transition-colors',
                error ? 'text-rose-600' : 'text-emerald-600',
              )}
            >
              {error ? 'SİSTEM HATASI' : 'SİSTEM DURUMU: AKTİF'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-all duration-300" />
            <input
              type="text"
              placeholder="Sistem kayıtlarında ara..."
              className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 w-80 transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <button
            onClick={fetchData}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-emerald-500/20 transition-all duration-300 group shadow-sm"
          >
            <RefreshCw className={cn('w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="glass-panel p-20 rounded-[2.5rem] border border-rose-500/20 bg-white flex flex-col items-center justify-center text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-rose-500 opacity-60" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tighter italic">Veri akış hatası</h2>
          <p className="text-xs text-slate-500 mb-8 max-w-sm font-bold leading-relaxed">{error}</p>
          <button
            onClick={fetchData}
            className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Terminali Yeniden Başlat
          </button>
        </div>
      ) : (
        <>
          {/* 2. Top Stats Row */}
          <StatsCards stats={stats?.cards} />

          {/* 3. Main Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel rounded-[2.5rem] h-[450px] border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">
              <LatencyLineChart data={stats?.latencySeries} />
            </div>
            <div className="glass-panel rounded-[2.5rem] h-[450px] border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">
              <StatusDonutChart data={stats?.statusDistribution} />
            </div>
          </div>

          {/* 4. Detailed Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel rounded-[2.5rem] min-h-[500px] border border-slate-200 bg-white overflow-hidden flex flex-col shadow-sm">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex flex-col">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    SİSTEM KAYITLARI (LOGS)
                  </h3>
                  <span className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Gerçek Zamanlı Veri Akışı</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LIVE</span>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-400/20" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <LogTable logs={logs} />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="glass-panel rounded-[2.5rem] flex-1 border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">
                <RouteChart data={stats?.routes} />
              </div>
              <div className="glass-panel rounded-[2.5rem] flex-1 border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">
                <MethodChart data={stats?.statusDistribution} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

