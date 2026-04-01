'use client';

import React from 'react';
import { 
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid,
  Line, LineChart, Area, AreaChart, Pie, PieChart
} from 'recharts';

const methodData = [
  { name: 'GET', value: 42, color: '#3b82f6' },
  { name: 'POST', value: 12, color: '#10b981' },
  { name: 'OPTIONS', value: 18, color: '#f59e0b' },
];

const routeData = [
  { name: '/admin/stats', value: 41 },
  { name: '/login', value: 24 },
  { name: '/register', value: 8 },
  { name: '/products', value: 5 },
  { name: '/orders', value: 2 },
];

export function MethodChart() {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">HTTP METOD DAĞILIMI</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={methodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
              {methodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RouteChart() {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">ROTA BAZLI İSTEK SAYISI</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={routeData} layout="vertical" margin={{ left: 20 }}>
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

const latencyData = [
  { time: '18:41:20', ms: 14 },
  { time: '18:41:21', ms: 72 },
  { time: '18:41:22', ms: 12 },
  { time: '18:41:23', ms: 45 },
  { time: '18:41:24', ms: 81 },
  { time: '18:41:25', ms: 33 },
  { time: '18:41:26', ms: 18 },
  { time: '18:41:27', ms: 54 },
];

const statusData = [
  { name: '2xx Success', value: 840, color: '#10b981' },
  { name: '4xx Client', value: 120, color: '#f59e0b' },
  { name: '5xx Server', value: 40, color: '#f43f5e' },
];

export function LatencyLineChart() {
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
          <AreaChart data={latencyData}>
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

export function StatusDonutChart() {
  return (
    <div className="w-full h-full flex flex-col p-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">DURUM DAĞILIMI</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={500}
              animationDuration={1500}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {statusData.map((s) => (
           <div key={s.name} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: s.color}} />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.name.split(' ')[0]}</span>
           </div>
        ))}
      </div>
    </div>
  );
}
