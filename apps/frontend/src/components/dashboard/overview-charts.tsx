'use client';

import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

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
