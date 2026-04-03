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
        return new Date(`1970/01/01 ${b.time}`).getTime() - new Date(`1970/01/01 ${a.time}`).getTime();
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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white/90 uppercase tracking-tight">
          Canlı Trafik Akışı
        </h1>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              loading ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500 animate-pulse',
            )}
          />
          <span
            className={cn(
              'text-[10px] font-black uppercase tracking-widest',
              loading ? 'text-yellow-400' : 'text-emerald-400',
            )}
          >
            {loading ? 'YÜKLENİYOR...' : 'GERÇEK ZAMANLI'}
          </span>
        </div>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-400 text-sm">
          <p>Loglar alınamadı: {error}</p>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        {/* Filters */}
        <div className="p-4 border-b border-white/5 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                filter === f
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Traffic List */}
        <div className="overflow-y-auto max-h-[600px] scrollbar-hide">
          {traffic.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <p className="text-sm">Henüz log verisi bulunamadı</p>
            </div>
          ) : (
            filteredTraffic.map((t, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-black w-14 text-center',
                      t.method === 'GET' && 'bg-blue-500/10 text-blue-400',
                      t.method === 'POST' && 'bg-emerald-500/10 text-emerald-400',
                      t.method === 'DELETE' && 'bg-rose-500/10 text-rose-400',
                      t.method === 'PUT' && 'bg-amber-500/10 text-amber-400',
                    )}
                  >
                    {t.method}
                  </span>
                  <span className="text-sm font-medium text-slate-300 font-mono truncate max-w-md">
                    {t.path}
                  </span>
                </div>

                <div className="flex items-center gap-8">
                  <span
                    className={cn(
                      'text-xs font-bold font-mono',
                      t.status < 400 ? 'text-emerald-400' : 'text-rose-400',
                    )}
                  >
                    {t.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono w-10 text-right">
                    {t.latency}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">{t.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
