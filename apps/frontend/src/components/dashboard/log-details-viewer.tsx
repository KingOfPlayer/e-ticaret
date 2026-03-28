'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Clock, MapPin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface LogMetadata {
  duration: number;
  ip: string;
  method: string;
  statusCode: number;
  url: string;
}

interface LogEntry {
  context: string;
  label: string;
  level: string;
  message: string;
  metadata: Record<string, LogMetadata>;
  timestamp: string;
}

interface LogsResponse {
  message: string;
  logs: {
    file: LogEntry[];
  };
}

export function LogDetailsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data: LogsResponse = await api.post('/log', {}, true);
        setLogs(data.logs.file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

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
      warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      debug: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    };
    return colors[level] || 'bg-slate-500/10 border-slate-500/20 text-slate-400';
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

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
      <div className="flex gap-2 mb-4">
        {(['all', 'info', 'warning', 'error'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === level
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
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
              const metadata = log.metadata['0'];
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

                      <span className={cn('px-2 py-0.5 rounded font-bold text-xs', getMethodColor(metadata.method))}>
                        {metadata.method}
                      </span>

                      <code className="text-xs text-slate-300 truncate bg-slate-800/50 px-2 py-0.5 rounded">
                        {metadata.url}
                      </code>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Status Code */}
                      <div className="flex items-center gap-1">
                        <span className={cn('text-sm font-bold', getStatusColor(metadata.statusCode))}>
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

                      <span className={cn('px-2 py-0.5 rounded border', getLevelColor(log.level))}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                  </div>
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
          <p className="text-lg font-bold text-green-400">
            {logs.filter((l) => l.metadata['0']?.statusCode >= 200 && l.metadata['0']?.statusCode < 300).length}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-xs text-blue-400 mb-1">Cache</p>
          <p className="text-lg font-bold text-blue-400">
            {logs.filter((l) => l.metadata['0']?.statusCode >= 300 && l.metadata['0']?.statusCode < 400).length}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-xs text-red-400 mb-1">Errors</p>
          <p className="text-lg font-bold text-red-400">
            {logs.filter((l) => l.metadata['0']?.statusCode >= 400).length}
          </p>
        </div>
      </div>
    </div>
  );
}
