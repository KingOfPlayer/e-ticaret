'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface TrafficLog {
  method: string;
  path: string;
  status: number;
  latency: string;
  time: string;
}

interface LogEntry {
  message: string;
  context: string;
  metadata?: Record<string, any>;
  timestamp?: string;
  level?: string;
}

export default function LiveTrafficPage() {
  const [filter, setFilter] = useState('Tümü');
  const [traffic, setTraffic] = useState<TrafficLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseLogsToTraffic = useCallback((logs: LogEntry[]): TrafficLog[] => {
    return logs
      .filter((log) => log.context === 'HttpLoggerMiddleware')
      .map((log) => {
        // Extract metadata from the nested structure
        const metadataEntry = log.metadata?.['0'] || {};
        const method = metadataEntry.method || 'UNKNOWN';
        const url = metadataEntry.url || 'unknown';
        const statusCode = metadataEntry.statusCode || 0;
        const duration = metadataEntry.duration || 0;

        const timestamp = log.timestamp ? new Date(log.timestamp) : new Date();
        const time = timestamp.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        return {
          method,
          path: url,
          status: statusCode,
          latency: `${duration}ms`,
          time,
        };
      })
      .sort((a, b) => {
        // Sort by time descending (most recent first)
        return (
          new Date(`1970/01/01 ${b.time}`).getTime() - new Date(`1970/01/01 ${a.time}`).getTime()
        );
      });
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from gateway log endpoint using API library
      const data = await api.get('/log', true, {
        limit: 50,
        order: 'desc',
      });

      // Extract logs from the nested structure (logs.file is an array)
      const logsArray = data.logs?.file || [];
      const parsedTraffic = parseLogsToTraffic(logsArray);
      setTraffic(parsedTraffic);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }, [parseLogsToTraffic]);

  useEffect(() => {
    fetchLogs();

    // Poll for new logs every 5 seconds
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filters = ['Tümü', 'GET', 'POST', 'PUT', 'DELETE', 'Hatalar'];

  const filteredTraffic = traffic.filter((t) => {
    if (filter === 'Tümü') return true;
    if (filter === 'Hatalar') return t.status >= 400;
    return t.method === filter;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">
            CANLI TRAFİK AKIŞI
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
            Gateway üzerinden geçen gerçek zamanlı HTTP istek analizi
          </p>
        </div>
        <div className="px-6 py-3 glass-panel border border-emerald-100 bg-emerald-50 rounded-2xl flex items-center gap-3 shadow-sm">
          <div
            className={cn(
              'w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]',
              loading ? 'bg-amber-500' : 'bg-emerald-500',
            )}
          />
          <span
            className={cn(
              'text-[10px] font-black uppercase tracking-widest',
              loading ? 'text-amber-600' : 'text-emerald-600',
            )}
          >
            {loading ? 'YÜKLENİYOR...' : 'GERÇEK ZAMANLI AKTİF'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 text-[11px] font-black uppercase tracking-widest animate-shake shadow-sm">
          <Activity className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="glass-panel border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
        {/* Filters */}
        <div className="p-6 border-b border-slate-100 flex gap-3 overflow-x-auto custom-scrollbar bg-slate-50/50">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border shadow-sm',
                filter === f
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Traffic List */}
        <div className="overflow-y-auto max-h-[700px] custom-scrollbar">
          {traffic.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-40">
              <Activity className="w-20 h-20 text-slate-300" strokeWidth={1} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                HİÇBİR VERİ AKIŞI BULUNAMADI
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredTraffic.map((t, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-10 py-6 hover:bg-slate-50/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-10">
                    <span
                      className={cn(
                        'px-4 py-2 rounded-xl text-[10px] font-black w-20 text-center uppercase tracking-widest border shadow-sm',
                        t.method === 'GET' && 'bg-blue-50 text-blue-600 border-blue-100',
                        t.method === 'POST' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                        t.method === 'DELETE' && 'bg-rose-50 text-rose-600 border-rose-100',
                        t.method === 'PUT' && 'bg-amber-50 text-amber-600 border-amber-100',
                      )}
                    >
                      {t.method}
                    </span>
                    <span className="text-[13px] font-black text-slate-400 font-mono truncate max-w-2xl group-hover:text-slate-900 transition-colors tracking-tight">
                      {t.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="flex flex-col items-end">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        DURUM
                      </p>
                      <span
                        className={cn(
                          'text-[14px] font-black font-mono tracking-tighter shadow-sm px-2 rounded-lg',
                          t.status < 400
                            ? 'text-emerald-600 bg-emerald-50/30'
                            : 'text-rose-600 bg-rose-50/30',
                        )}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div className="flex flex-col items-end w-20">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        LATENCY
                      </p>
                      <span className="text-[12px] text-slate-400 font-black font-mono">
                        {t.latency}
                      </span>
                    </div>

                    <div className="flex flex-col items-end w-24">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        TIMESTAMP
                      </p>
                      <span className="text-[12px] text-slate-500 font-black font-mono">
                        {t.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
