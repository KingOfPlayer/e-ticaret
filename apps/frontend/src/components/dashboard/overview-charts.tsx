'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  Area,
  AreaChart,
  Pie,
  PieChart,
} from 'recharts';
import { Activity } from 'lucide-react';

export function MethodChart({ data = [] }: { data?: any[] }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted || !data || data.length === 0) return <NoData label="HTTP METOD DAĞILIMI" />;

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-hidden min-h-[180px]">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 shrink-0">
        HTTP METOD DAĞILIMI
      </h3>
      <div className="flex-1 min-h-0 relative w-full">
        <ResponsiveContainer width="99%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={9}
              fontWeight="black"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={9}
              fontWeight="black"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                color: '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#10b981'} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RouteChart({ data = [] }: { data?: any[] }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted || !data || data.length === 0) return <NoData label="ROTA BAZLI İSTEK SAYISI" />;

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-hidden min-h-[180px]">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 shrink-0">
        ROTA BAZLI İSTEK SAYISI
      </h3>
      <div className="flex-1 min-h-0 relative w-full">
        <ResponsiveContainer width="99%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#94a3b8"
              fontSize={9}
              fontWeight="black"
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                color: '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar
              dataKey="value"
              fill="#10b981"
              fillOpacity={0.7}
              radius={[0, 4, 4, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LatencyLineChart({ data = [] }: { data?: any[] }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted || !data || data.length === 0) return <NoData label="YANIT SÜRESİ ANALİZİ" />;

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-hidden min-h-[300px]">
      <div className="flex items-center justify-between mb-10 shrink-0">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
          YANIT SÜRESİ ANALİZİ (ms)
        </h3>
        <span className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Canlı
        </span>
      </div>
      <div className="flex-1 min-h-0 relative w-full">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={9}
              fontWeight="black"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={9}
              fontWeight="black"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                color: '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="ms"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#latencyGradient)"
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatusDonutChart({ data = [] }: { data?: any[] }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted || !data || data.length === 0) return <NoData label="DURUM DAĞILIMI" />;

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-hidden min-h-[300px]">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 shrink-0">
        DURUM DAĞILIMI
      </h3>
      <div className="flex-1 min-h-0 relative w-full">
        <ResponsiveContainer width="99%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              animationBegin={500}
              animationDuration={2000}
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                color: '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-6 mt-8 overflow-hidden">
        {data.map((s) => (
          <div key={s.name} className="flex items-center gap-2 shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-full border border-black/5"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] truncate max-w-[100px]">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoData({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col p-8 items-center justify-center opacity-30 group hover:opacity-60 transition-all duration-700 text-slate-900">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 absolute top-8 left-8">
        {label}
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 animate-[spin_10s_linear_infinite]" />
          <Activity className="w-6 h-6 text-slate-300 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 italic">
          Veri Bekleniyor...
        </p>
      </div>
    </div>
  );
}
