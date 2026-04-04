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
    fetchLogs();
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-xl">
            SİSTEM KAYITLARI (LOGS)
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-5">
            Sistem olaylarını ve trafik akışını gerçek zamanlı izleyin
          </p>
        </div>
        <div className="px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
          <span className="text-[9px] text-emerald-600 block uppercase font-black tracking-[0.3em]">
            TOPLAM KAYIT
          </span>
          <span className="text-xl font-black text-slate-900 tabular-nums leading-none mt-1 inline-block">
            {logs.length}
          </span>
        </div>
      </div>

      {/* Filters Card */}
      <div className="glass-panel border border-slate-200 rounded-[2rem] p-8 bg-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900">
          <RefreshCw size={60} className={cn(loading && 'animate-spin')} />
        </div>
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 relative italic">
          SORGULAMA PARAMETRELERİ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 relative">
          {/* Limit */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              LİMİT
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-[12px] font-black tabular-nums text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 shadow-sm"
            />
          </div>

          {/* Start/Offset */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              KAYDIRMA (OFFSET)
            </label>
            <input
              type="number"
              min="0"
              value={start}
              onChange={(e) => setStart(parseInt(e.target.value) || 0)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-[12px] font-black tabular-nums text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 shadow-sm"
            />
          </div>

          {/* Order */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              SIRALAMA
            </label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-[12px] font-black text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none shadow-sm"
            >
              <option value="desc">Yeniden Eskiye</option>
              <option value="asc">Eskiden Yeniye</option>
            </select>
          </div>

          {/* From Date */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              BAŞLANGIÇ TARİHİ
            </label>
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-[11px] font-black text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
            />
          </div>

          {/* Until Date */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              BİTİŞ TARİHİ
            </label>
            <input
              type="datetime-local"
              value={untilDate}
              onChange={(e) => setUntilDate(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-[11px] font-black text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap relative">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Search
              size={16}
              strokeWidth={3}
              className="group-hover:scale-110 transition-transform"
            />
            SORGULA (SEARCH)
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-400 hover:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all border border-slate-200 shadow-sm active:scale-95"
          >
            <RefreshCw size={16} strokeWidth={3} className={cn(loading && 'animate-spin')} />
            SIFIRLA
          </button>

          <button
            onClick={handleDownloadLogs}
            disabled={loading || logs.length === 0}
            className="flex items-center gap-3 px-8 py-4 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 disabled:opacity-50 text-emerald-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 ml-auto shadow-sm"
          >
            <Download size={16} strokeWidth={3} />
            DIŞA AKTAR (.JSON)
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 flex items-start gap-4 animate-shake shadow-sm">
          <AlertCircle className="text-rose-500 mt-1" size={24} />
          <div>
            <p className="font-black text-rose-600 uppercase tracking-widest text-xs">
              Sorgu Hatası
            </p>
            <p className="text-rose-900/60 text-[11px] mt-1 font-bold">{error}</p>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="glass-panel border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  ZAMAN DAMGASI
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  DÜZEY
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  İLETİ (MESSAGE)
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
                  DETAY
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-relaxed">
                      {error ? 'VERI YUKLEME HATASI' : 'KAYIT BULUNAMADI. LÜTFEN SORGULAMA YAPIN.'}
                    </p>
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-emerald-500 animate-[slide-right_1.5s_infinite]" />
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        VERİ AKIŞI DİNLENİYOR...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className="hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      <td className="px-8 py-5 text-[11px] font-black text-slate-400 whitespace-nowrap group-hover:text-emerald-600 transition-colors tabular-nums">
                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-8 py-5 text-sm">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-[9px] font-black tracking-widest inline-flex border shadow-sm',
                            log.level === 'error' && 'bg-rose-50 text-rose-600 border-rose-100',
                            log.level === 'warn' &&
                              'bg-orange-50 text-orange-600 border-orange-100',
                            log.level === 'info' &&
                              'bg-emerald-50 text-emerald-600 border-emerald-100',
                            log.level === 'debug' && 'bg-slate-50 text-slate-500 border-slate-200',
                          )}
                        >
                          {String(log.level || 'INFO').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[12px] font-bold text-slate-600 max-w-lg truncate leading-relaxed group-hover:text-slate-900 transition-colors">
                        {log.message}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div
                          className={cn(
                            'w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500 mx-auto border shadow-sm',
                            expandedIndex === index
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20 shadow-lg'
                              : 'bg-white text-slate-300 border-slate-200 group-hover:border-emerald-500/30 group-hover:text-emerald-600 group-hover:bg-emerald-50',
                          )}
                        >
                          <Search
                            size={12}
                            strokeWidth={4}
                            className={cn(
                              'transition-transform duration-500',
                              expandedIndex === index ? 'rotate-45' : 'rotate-0',
                            )}
                          />
                        </div>
                      </td>
                    </tr>
                    {expandedIndex === index && (
                      <tr className="bg-slate-50/50 border-b border-slate-100 animate-in slide-in-from-top-2 duration-300">
                        <td colSpan={4} className="px-8 py-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                                TAM SİSTEM ÇIKTISI (VERBOSE DATA)
                              </p>
                            </div>
                            <pre className="bg-slate-900 p-8 rounded-[1.5rem] text-[11px] font-black font-mono overflow-auto max-h-96 whitespace-pre-wrap break-words border border-slate-800 text-emerald-400/90 leading-relaxed shadow-2xl">
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-slate-200" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] tabular-nums">
              GÖSTERİM: {start + 1} — {start + logs.length} (LİMİT: {limit})
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={loading || start === 0}
              className="px-10 py-4 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-400 hover:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all border border-slate-200 shadow-sm disabled:pointer-events-none active:scale-95"
            >
              ÖNCEKİ SAYFA
            </button>
            <button
              onClick={handleNextPage}
              disabled={loading || logs.length < limit}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-lg shadow-emerald-500/20 disabled:pointer-events-none active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              SONRAKİ SAYFA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
