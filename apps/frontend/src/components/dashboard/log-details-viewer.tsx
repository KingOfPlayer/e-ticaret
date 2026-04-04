'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Clock, MapPin, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface QueryOptions {
  rows?: number;
  limit?: number;
  start?: number;
  from?: Date;
  until?: Date;
  order?: 'asc' | 'desc';
}

type LogMetadata = Record<string, unknown>;

interface LogEntry {
  context: string;
  label: string;
  level: string;
  message: string;
  metadata: Record<string, LogMetadata | string | number | boolean | null>;
  timestamp: string;
}

interface LogsResponse {
  message: string;
  logs: {
    file?: LogEntry[];
  };
}

export function LogDetailsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info' | 'debug'>('all');
  const [expandedMetaKeys, setExpandedMetaKeys] = useState<Record<string, boolean>>({});
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({
    rows: 10,
    limit: 10,
    start: 0,
    order: 'desc',
  });
  const [fromInput, setFromInput] = useState('');
  const [untilInput, setUntilInput] = useState('');

  const normalizeLogs = (payload: LogsResponse | null | undefined): LogEntry[] => {
    const fileLogs = payload?.logs?.file;
    return Array.isArray(fileLogs) ? fileLogs : [];
  };

  const normalizeLevel = (level: string | undefined) => {
    const normalized = String(level ?? '')
      .trim()
      .toLowerCase();

    if (normalized === 'warn' || normalized === 'warning') return 'warning';
    return normalized;
  };

  const fetchLogs = useCallback(async () => {
    try {
      const query: Record<string, any> = {
        limit: queryOptions.limit || 10,
        order: queryOptions.order || 'desc',
      };
      if (queryOptions.start !== undefined) query.start = queryOptions.start;
      if (fromInput) query.from = new Date(fromInput).toISOString();
      if (untilInput) query.until = new Date(untilInput).toISOString();

      const data: LogsResponse = await api.get('/log',true, query);
      setLogs(normalizeLogs(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fromInput, queryOptions, untilInput]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const extractPrimaryMeta = (log: LogEntry) => {
    const firstObjectMeta = Object.values(log.metadata ?? {}).find(
      (meta) => meta && typeof meta === 'object',
    ) as LogMetadata | undefined;

    const methodFromMessage = log.message.split(' ')[0] || '-';
    const urlFromMessage = log.message.split(' ')[1] || '-';

    const method =
      typeof firstObjectMeta?.method === 'string'
        ? String(firstObjectMeta.method)
        : methodFromMessage;
    const url =
      typeof firstObjectMeta?.url === 'string' ? String(firstObjectMeta.url) : urlFromMessage;
    const statusCode =
      typeof firstObjectMeta?.statusCode === 'number' ? Number(firstObjectMeta.statusCode) : 0;
    const duration =
      typeof firstObjectMeta?.duration === 'number' ? Number(firstObjectMeta.duration) : 0;
    const ip = typeof firstObjectMeta?.ip === 'string' ? String(firstObjectMeta.ip) : '-';

    return { method, url, statusCode, duration, ip };
  };

  const stringifyValue = (value: unknown) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-blue-600',
      POST: 'text-emerald-600',
      PUT: 'text-amber-600',
      DELETE: 'text-rose-600',
      PATCH: 'text-purple-600',
      HEAD: 'text-slate-600',
    };
    return colors[method] || 'text-slate-400';
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-emerald-600';
    if (statusCode >= 300 && statusCode < 400) return 'text-blue-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      error: 'bg-rose-50 border-rose-100 text-rose-600',
      warn: 'bg-amber-50 border-amber-100 text-amber-600',
      warning: 'bg-amber-50 border-amber-100 text-amber-600',
      info: 'bg-blue-50 border-blue-100 text-blue-600',
      debug: 'bg-purple-50 border-purple-100 text-purple-600',
    };
    return colors[level] || 'bg-slate-50 border-slate-100 text-slate-400';
  };

  const safeLogs = useMemo(() => (Array.isArray(logs) ? logs : []), [logs]);

  const filteredLogs = safeLogs.filter((log) => {
    if (filter === 'all') return true;

    const normalizedLevel = normalizeLevel(log.level);
    return normalizedLevel === filter;
  });
  const getLogRowKey = (log: LogEntry, index: number) =>
    `${log.timestamp}-${log.message}-${log.label}-${index}`;

  const toggleMeta = (rowKey: string) => {
    setExpandedMetaKeys((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const summary = useMemo(() => {
    const statusCodes = safeLogs.map((log) => extractPrimaryMeta(log).statusCode);
    return {
      success: statusCodes.filter((code) => code >= 200 && code < 300).length,
      cache: statusCodes.filter((code) => code >= 300 && code < 400).length,
      errors: statusCodes.filter((code) => code >= 400).length,
    };
  }, [safeLogs]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
        <div className="inline-block animate-spin">
          <Activity className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="text-slate-400 mt-2 font-black text-[10px] uppercase tracking-widest">VERİLER ALINIYOR...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-[10px] font-black uppercase tracking-widest">HATA: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">İSTEK KÜTÜPHANESİ</h3>
          <span className="ml-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 uppercase tracking-widest shadow-sm">
            {filteredLogs.length} {filter !== 'all' ? filter : ''} KAYIT
          </span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'info', 'warning', 'error', 'debug'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={cn(
              'px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border shadow-sm',
              filter === level
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20 shadow-lg'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300',
            )}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">ROWS</p>
          <input
            type="number"
            min={1}
            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-xs font-black rounded-lg px-2 py-1 outline-none"
            value={queryOptions.rows ?? 10}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, rows: Number(event.target.value) || 10 }))
            }
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">LIMIT</p>
          <input
            type="number"
            min={1}
            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-xs font-black rounded-lg px-2 py-1 outline-none"
            value={queryOptions.limit ?? 10}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, limit: Number(event.target.value) || 10 }))
            }
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">START</p>
          <input
            type="number"
            min={0}
            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-xs font-black rounded-lg px-2 py-1 outline-none"
            value={queryOptions.start ?? 0}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, start: Number(event.target.value) || 0 }))
            }
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">ORDER</p>
          <select
            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-xs font-black rounded-lg px-2 py-1 outline-none"
            value={queryOptions.order ?? 'desc'}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, order: event.target.value as 'asc' | 'desc' }))
            }
          >
            <option value="desc">DESC</option>
            <option value="asc">ASC</option>
          </select>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm col-span-1 md:col-span-1">
          <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">FROM</p>
          <input
            type="datetime-local"
            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-black rounded-lg px-2 py-1 outline-none"
            value={fromInput}
            onChange={(event) => setFromInput(event.target.value)}
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">UNTIL</p>
          <input
            type="datetime-local"
            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-black rounded-lg px-2 py-1 outline-none"
            value={untilInput}
            onChange={(event) => setUntilInput(event.target.value)}
          />
        </div>
      </div>

      {/* Logs Container */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden max-h-[600px] overflow-y-auto shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-[10px] font-black uppercase tracking-widest">GÖSTERİLECEK KAYIT BULUNAMADI</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log, index) => {
              const metadata = extractPrimaryMeta(log);
              const rowKey = getLogRowKey(log, index);
              const hasMeta = Object.keys(log.metadata ?? {}).length > 0;
              const isExpanded = !!expandedMetaKeys[rowKey];
              return (
                <div
                  key={index}
                  className="p-6 hover:bg-slate-50/50 transition-colors border-l-4 border-l-slate-200"
                >
                  {/* Top Row: Time, Method, URL */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-[11px] text-slate-400 font-bold font-mono whitespace-nowrap">
                        {formatTime(log.timestamp)}
                      </span>

                      <span
                        className={cn(
                          'px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest border shadow-sm',
                          getMethodColor(metadata.method),
                          metadata.method === 'GET' && 'bg-blue-50 border-blue-100',
                          metadata.method === 'POST' && 'bg-emerald-50 border-emerald-100',
                          metadata.method === 'DELETE' && 'bg-rose-50 border-rose-100',
                          metadata.method === 'PUT' && 'bg-amber-50 border-amber-100',
                        )}
                      >
                        {metadata.method}
                      </span>

                      <code className="text-[12px] text-slate-600 font-black truncate bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-sm">
                        {metadata.url}
                      </code>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                      {/* Status Code */}
                      <div className="flex flex-col items-end">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">STATUS</p>
                        <span
                          className={cn('text-sm font-black font-mono', getStatusColor(metadata.statusCode))}
                        >
                          {metadata.statusCode}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex flex-col items-end w-16">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">LATENCY</p>
                        <span className="text-xs text-amber-600 font-black font-mono">{metadata.duration}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Service, IP, Log Level */}
                  <div className="flex items-center justify-between gap-4 text-xs mt-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-black text-[9px] uppercase tracking-widest border border-slate-200">
                        {log.label}
                      </span>

                      <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest border-l border-slate-200 pl-3">
                        {log.context}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                         <MapPin className="w-3 h-3 text-slate-400" />
                         <span className="text-slate-400 font-black font-mono tracking-tighter">{metadata.ip}</span>
                      </div>

                      <span
                        className={cn(
                          'px-3 py-1 rounded-lg border font-black text-[9px] uppercase tracking-widest shadow-sm',
                          getLevelColor(normalizeLevel(log.level)),
                        )}
                      >
                        {normalizeLevel(log.level)}
                      </span>
                    </div>
                  </div>

                  {hasMeta && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => toggleMeta(rowKey)}
                        className="w-full flex items-center justify-between bg-white border border-slate-200 hover:bg-slate-50 rounded-xl px-4 py-2.5 transition-all shadow-sm"
                      >
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          SİSTEM METADATA ({Object.keys(log.metadata).length})
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                          {Object.entries(log.metadata).map(([metaKey, metaValue]) => (
                            <div key={metaKey} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 underline decoration-emerald-500/20 underline-offset-2">metadata.{metaKey}</p>
                              <pre className="text-[11px] text-slate-600 font-bold break-all whitespace-pre-wrap font-mono">
                                {stringifyValue(metaValue)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm group">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">BAŞARILI</p>
          <p className="text-2xl font-black text-emerald-600 font-mono tracking-tighter">{summary.success}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm group">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">ÖN BELLEK</p>
          <p className="text-2xl font-black text-blue-600 font-mono tracking-tighter">{summary.cache}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 shadow-sm group">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">HATALI</p>
          <p className="text-2xl font-black text-rose-600 font-mono tracking-tighter">{summary.errors}</p>
        </div>
      </div>
    </div>
  );
}
