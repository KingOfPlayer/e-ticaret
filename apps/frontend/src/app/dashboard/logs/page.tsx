'use client';

import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Query filter states
  const [limit, setLimit] = useState(50);
  const [start, setStart] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [fromDate, setFromDate] = useState<string>('');
  const [untilDate, setUntilDate] = useState<string>('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const query: Record<string, any> = {
        limit,
        start,
        order,
      };

      if (fromDate) {
        query.from = new Date(fromDate).getTime();
      }
      if (untilDate) {
        query.until = new Date(untilDate).getTime();
      }

      const response = await api.get('/log', true, query);

      if (response && response.logs) {
        if (Array.isArray(response.logs)) {
          setLogs(response.logs);
        } else if (response.logs.file && Array.isArray(response.logs.file)) {
          setLogs(response.logs.file);
        } else {
          setLogs([]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSearch = () => {
    setStart(0);
    fetchLogs();
  };

  const handleReset = () => {
    setLimit(50);
    setStart(0);
    setOrder('desc');
    setFromDate('');
    setUntilDate('');
    setLogs([]);
    setError(null);
  };

  const handleDownloadLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePreviousPage = () => {
    const newStart = Math.max(0, start - limit);
    setStart(newStart);
  };

  const handleNextPage = () => {
    setStart(start + limit);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Log Viewer</h1>
          <p className="text-slate-400 mt-2">Monitor and analyze system logs in real-time</p>
        </div>
        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">
            Total Logs
          </span>
          <span className="text-lg font-bold text-white">{logs.length}</span>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-white mb-4">Query Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Limit */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Limit</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Start/Offset */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Offset</label>
            <input
              type="number"
              min="0"
              value={start}
              onChange={(e) => setStart(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From Date</label>
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Until Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Until Date</label>
            <input
              type="datetime-local"
              value={untilDate}
              onChange={(e) => setUntilDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Search size={18} />
            Search
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors border border-slate-700"
          >
            <RefreshCw size={18} />
            Reset
          </button>

          <button
            onClick={handleDownloadLogs}
            disabled={loading || logs.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-300">Error</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <p>
                      {error ? 'Error loading logs' : 'No logs found. Click Search to load logs.'}
                    </p>
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                      <p className="text-slate-400">Loading logs...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap group-hover:text-indigo-400 transition-colors">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-lg text-xs font-medium w-fit inline-flex',
                            log.level === 'error' && 'bg-red-900/30 text-red-300 border border-red-700/50',
                            log.level === 'warn' && 'bg-amber-900/30 text-amber-300 border border-amber-700/50',
                            log.level === 'info' && 'bg-indigo-900/30 text-indigo-300 border border-indigo-700/50',
                            log.level === 'debug' && 'bg-slate-700/30 text-slate-300 border border-slate-600/50'
                          )}
                        >
                          {log.level?.toUpperCase() || 'INFO'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 text-center">
                        <span className="text-indigo-400 text-xs font-medium">
                          {expandedIndex === index ? '▼' : '▶'}
                        </span>
                      </td>
                    </tr>
                    {expandedIndex === index && (
                      <tr className="bg-slate-950/50 border-b border-slate-700">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Full Details
                            </p>
                            <pre className="bg-slate-900 p-4 rounded-lg text-xs overflow-auto max-h-64 whitespace-pre-wrap break-words border border-slate-800 text-slate-300">
                              {JSON.stringify(log, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing {start + 1} to {start + logs.length} logs (Limit: {limit}, Offset: {start})
          </p>
          <div className="flex gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={loading || start === 0}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors border border-slate-700"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={loading || logs.length < limit}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors border border-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
