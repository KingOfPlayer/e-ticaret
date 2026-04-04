'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  Monitor,
  ShieldCheck,
  Zap,
  Share2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity,
  AlertCircle,
} from 'lucide-react';
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

export default function RequestFlowPage() {
  const [traffic, setTraffic] = useState<TrafficLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    successCount: 0,
    errorCount: 0,
    avgLatency: 0,
  });

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

  const calculateStats = useCallback((logs: TrafficLog[]) => {
    const totalRequests = logs.length;
    const successCount = logs.filter((l) => l.status < 400).length;
    const errorCount = logs.filter((l) => l.status >= 400).length;
    const avgLatency = Math.round(
      logs.reduce((sum, log) => {
        const latency = parseInt(log.latency);
        return sum + latency;
      }, 0) / (logs.length || 1)
    );

    setStats({
      totalRequests,
      successCount,
      errorCount,
      avgLatency,
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
      calculateStats(parsedTraffic);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }, [parseLogsToTraffic, calculateStats]);

  useEffect(() => {
    fetchLogs();

    // Poll for new logs every 5 seconds
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, [fetchLogs]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm">
            İSTEK AKIŞI & MİMARİ
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
            Sistem hiyerarşisi, veri tünelleme ve güvenlik katmanları analizi
          </p>
        </div>
        <div className="px-6 py-3 glass-panel border border-emerald-100 bg-emerald-50 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">CANLI TOPOLOJİ AKTİF</span>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 text-[11px] font-black uppercase tracking-widest animate-shake shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Statistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="İSTEK TRAFİĞİ" value={stats.totalRequests} loading={loading} />
        <StatCard label="BAŞARILI VERİ" value={stats.successCount} loading={loading} color="text-emerald-600" />
        <StatCard label="KRİTİK HATA" value={stats.errorCount} loading={loading} color="text-rose-600" />
        <StatCard label="GECİKME (LATENCY)" value={`${stats.avgLatency}MS`} loading={loading} color="text-amber-600" />
      </div>

      {/* 1. İSTEK AKIŞ DİYAGRAMI */}
      <section className="glass-panel border border-slate-200 rounded-[2.5rem] p-10 shadow-sm bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-50/30 to-transparent pointer-events-none" />
        
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 relative">
          SİSTEM TOPOLOJİSİ / AKIŞ DİYAGRAMI
        </h3>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[350px] relative">
          {/* Client Node */}
          <div className="flex flex-col items-center gap-6 group">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-emerald-500/20 transition-all duration-500">
              <Monitor className="w-10 h-10 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">İSTEMCİ ÜNİTESİ</p>
              <p className="text-[12px] text-slate-900 font-black mt-1 uppercase tracking-tight">BROWSER / TERMİNAL</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-emerald-500/20 animate-pulse hidden lg:flex">
             <ArrowRight className="w-8 h-8" strokeWidth={3} />
          </div>

          {/* Gateway Node */}
          <div className="flex flex-col items-center gap-6 relative">
            <div className="absolute -inset-8 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/10 relative z-10">
                <ShieldCheck className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="absolute -top-4 -right-4 bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-xl z-20">
                GATEWAY
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">YÖNLENDİRİCİ</p>
              <p className="text-[14px] text-emerald-600 font-black font-mono mt-1">DP:5000</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-emerald-500/20 animate-pulse hidden lg:flex">
             <ArrowRight className="w-8 h-8" strokeWidth={3} />
          </div>

          {/* Services Group */}
          <div className="flex flex-col gap-6 relative">
            <ServiceNode name="AUTH-VERIFICATION" port="5001" db="AUTH_CLUSTER" color="text-emerald-600" icon="shield" />
            <ServiceNode name="PRODUCT-CORE" port="5002" db="PROD_CATALOG" color="text-emerald-600" icon="package" />
            <ServiceNode name="ORDER-EXECUTOR" port="5003" db="ORDER_LEDGER" color="text-emerald-600" icon="cart" />
          </div>
        </div>
      </section>

      {/* 2. JWT DOĞRULAMA AKIŞI */}
      <section className="glass-panel border border-slate-200 rounded-[2.5rem] p-10 shadow-sm bg-white relative overflow-hidden">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12">
          GÜVENLİK PROTOKOLÜ / JWT DOĞRULAMA
        </h3>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 py-12">
          {/* Connecting Line */}
          <div className="absolute top-[64px] left-12 right-12 h-[2px] bg-slate-100 hidden md:block" />

          <StepNode number="01" label="İSTEK KABUL" icon={Activity} active />
          <StepNode number="02" label="TOKEN ANALİZ" icon={ShieldCheck} active />

          <div className="flex flex-col items-center gap-6 z-10 relative">
            <div className="flex gap-4">
              <div className="px-5 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                UNAUTHORIZED (401)
              </div>
              <div className="px-5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                AUTHORIZED (200)
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group transition-all duration-500 hover:border-emerald-500/20">
              <Share2 className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GATEWAY YÖNLENDİRME</p>
          </div>

          <StepNode number="03" label="SERVİS İLETİM" icon={Zap} active />
          <StepNode number="04" label="LOG KAYDI" icon={CheckCircle2} active />
        </div>
      </section>
    </div>
  );
}

function ServiceNode({ name, port, db, color, icon }: any) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-56 glass-panel p-5 border-l-4 border-emerald-500 rounded-2xl bg-slate-50 hover:bg-white shadow-sm transition-all duration-300">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">MIKROSERVİS ÜNİTESİ</p>
        <p className={cn('text-[13px] font-black uppercase tracking-tight', color)}>{name}</p>
        <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">PORT: {port}</p>
      </div>
      <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-emerald-500 transition-colors">
         <ArrowRight className="w-4 h-4" />
      </div>
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4 group-hover:border-emerald-500/20 transition-all duration-300">
        <Database className="w-5 h-5 text-emerald-500" />
        <div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DATABASE</p>
           <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{db}</p>
        </div>
      </div>
    </div>
  );
}

function StepNode({ number, label, icon: Icon, active }: any) {
  return (
    <div className="flex flex-col items-center gap-6 z-10 group">
      <div
        className={cn(
          'w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-500 relative shadow-sm',
          active
            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-500/10'
            : 'bg-white border-slate-200 text-slate-400',
        )}
      >
        <Icon className="w-7 h-7" />
        <div className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-emerald-500/30 rounded-full flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-md">
          {number}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center group-hover:text-emerald-600 transition-colors">
        {label}
      </p>
    </div>
  );
}

function StatCard({ label, value, loading, color = 'text-slate-900' }: any) {
  return (
    <div className="glass-panel rounded-[1.5rem] p-6 border border-slate-200 bg-white shadow-sm hover:border-emerald-500/20 transition-all duration-500">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">
        {label}
      </p>
      <p className={cn('text-3xl font-black tabular-nums tracking-tighter', color)}>
        {loading ? <span className="animate-pulse opacity-20">---</span> : value}
      </p>
    </div>
  );
}


