'use client';

import React from 'react';
import { 
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid,
  Area, AreaChart, Pie, PieChart
} from 'recharts';

export function MethodChart({ data = [] }: { data?: any[] }) {
  const displayData = data.length > 0 ? data : [
    { name: 'GET', value: 0, color: '#3b82f6' },
    { name: 'POST', value: 0, color: '#10b981' },
    { name: 'PUT', value: 0, color: '#f59e0b' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">HTTP METOD DAĞILIMI</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RouteChart({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return <NoData label="ROTA BAZLI İSTEK SAYISI" />;

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">ROTA BAZLI İSTEK SAYISI</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={80} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LatencyLineChart({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return <NoData label="YANIT SÜRESİ ANALİZİ" />;

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">YANIT SÜRESİ ANALİZİ (ms)</h3>
        <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Canlı
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="ms" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#latencyGradient)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatusDonutChart({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return <NoData label="DURUM DAĞILIMI" />;

  return (
    <div className="w-full h-full flex flex-col p-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">DURUM DAĞILIMI</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={500}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4 overflow-hidden">
        {data.map((s) => (
           <div key={s.name} className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: s.color}} />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[60px]">{s.name.split(' ')[0]}</span>
           </div>
        ))}
      </div>
    </div>
  );
}

function NoData({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col p-6 items-center justify-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-500">
       <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 absolute top-6 left-6">{label}</h3>
       <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 animate-[spin_8s_linear_infinite]" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4 italic">Veri Bekleniyor...</p>
       </div>
    </div>
  );
}
