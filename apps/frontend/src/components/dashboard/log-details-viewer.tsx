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
      GET: 'text-blue-400',
      POST: 'text-green-400',
      PUT: 'text-yellow-400',
      DELETE: 'text-red-400',
      PATCH: 'text-purple-400',
      HEAD: 'text-gray-400',
    };
    return colors[method] || 'text-slate-400';
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-400';
    if (statusCode >= 300 && statusCode < 400) return 'text-blue-400';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      error: 'bg-red-500/10 border-red-500/20 text-red-400',
      warn: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      debug: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    };
    return colors[level] || 'bg-slate-500/10 border-slate-500/20 text-slate-400';
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
      <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
        <div className="inline-block animate-spin">
          <Activity className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-slate-400 mt-2">Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-slate-900/50 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load logs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">Request Logs</h3>
          <span className="ml-2 px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
            {filteredLogs.length} {filter !== 'all' ? filter : ''} logs
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
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === level
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
            )}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
          <p className="text-[11px] text-slate-400 mb-1">Rows</p>
          <input
            type="number"
            min={1}
            className="w-full bg-slate-800 text-slate-100 text-sm rounded px-2 py-1 outline-none"
            value={queryOptions.rows ?? 10}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, rows: Number(event.target.value) || 10 }))
            }
          />
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
          <p className="text-[11px] text-slate-400 mb-1">Limit</p>
          <input
            type="number"
            min={1}
            className="w-full bg-slate-800 text-slate-100 text-sm rounded px-2 py-1 outline-none"
            value={queryOptions.limit ?? 10}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, limit: Number(event.target.value) || 10 }))
            }
          />
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
          <p className="text-[11px] text-slate-400 mb-1">Start</p>
          <input
            type="number"
            min={0}
            className="w-full bg-slate-800 text-slate-100 text-sm rounded px-2 py-1 outline-none"
            value={queryOptions.start ?? 0}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, start: Number(event.target.value) || 0 }))
            }
          />
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
          <p className="text-[11px] text-slate-400 mb-1">Order</p>
          <select
            className="w-full bg-slate-800 text-slate-100 text-sm rounded px-2 py-1 outline-none"
            value={queryOptions.order ?? 'desc'}
            onChange={(event) =>
              setQueryOptions((prev) => ({ ...prev, order: event.target.value as 'asc' | 'desc' }))
            }
          >
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
          <p className="text-[11px] text-slate-400 mb-1">From</p>
          <input
            type="datetime-local"
            className="w-full bg-slate-800 text-slate-100 text-sm rounded px-2 py-1 outline-none"
            value={fromInput}
            onChange={(event) => setFromInput(event.target.value)}
          />
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
          <p className="text-[11px] text-slate-400 mb-1">Until</p>
          <input
            type="datetime-local"
            className="w-full bg-slate-800 text-slate-100 text-sm rounded px-2 py-1 outline-none"
            value={untilInput}
            onChange={(event) => setUntilInput(event.target.value)}
          />
        </div>
      </div>

      {/* Logs Container */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <p>No logs found for the selected filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredLogs.map((log, index) => {
              const metadata = extractPrimaryMeta(log);
              const rowKey = getLogRowKey(log, index);
              const hasMeta = Object.keys(log.metadata ?? {}).length > 0;
              const isExpanded = !!expandedMetaKeys[rowKey];
              return (
                <div
                  key={index}
                  className="p-4 hover:bg-slate-800/30 transition-colors border-l-4 border-l-slate-700"
                >
                  {/* Top Row: Time, Method, URL */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatTime(log.timestamp)}
                      </span>

                      <span
                        className={cn(
                          'px-2 py-0.5 rounded font-bold text-xs',
                          getMethodColor(metadata.method),
                        )}
                      >
                        {metadata.method}
                      </span>

                      <code className="text-xs text-slate-300 truncate bg-slate-800/50 px-2 py-0.5 rounded">
                        {metadata.url}
                      </code>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Status Code */}
                      <div className="flex items-center gap-1">
                        <span
                          className={cn('text-sm font-bold', getStatusColor(metadata.statusCode))}
                        >
                          {metadata.statusCode}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="text-xs text-slate-400">
                        <span className="text-cyan-400 font-semibold">{metadata.duration}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Service, IP, Log Level */}
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {log.label}
                      </span>

                      <span className="text-slate-500">
                        <span className="text-slate-600">{log.context}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400 font-mono">{metadata.ip}</span>

                      <span
                        className={cn(
                          'px-2 py-0.5 rounded border',
                          getLevelColor(normalizeLevel(log.level)),
                        )}
                      >
                        {normalizeLevel(log.level).toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>

                  {hasMeta && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => toggleMeta(rowKey)}
                        className="w-full flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/60 rounded px-3 py-2 transition-colors"
                      >
                        <span className="text-xs text-slate-300 font-medium">
                          Metadata ({Object.keys(log.metadata).length})
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(log.metadata).map(([metaKey, metaValue]) => (
                            <div key={metaKey} className="bg-slate-800/40 rounded px-2 py-1">
                              <p className="text-[11px] text-slate-500">metadata.{metaKey}</p>
                              <p className="text-xs text-slate-300 break-all">
                                {stringifyValue(metaValue)}
                              </p>
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
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-xs text-green-400 mb-1">Success</p>
          <p className="text-lg font-bold text-green-400">{summary.success}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-xs text-blue-400 mb-1">Cache</p>
          <p className="text-lg font-bold text-blue-400">{summary.cache}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-xs text-red-400 mb-1">Errors</p>
          <p className="text-lg font-bold text-red-400">{summary.errors}</p>
        </div>
      </div>
    </div>
  );
}
