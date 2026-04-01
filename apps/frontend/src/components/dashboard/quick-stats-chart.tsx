'use client';

import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { time: '11:15', responses: 12 },
  { time: '11:16', responses: 25 },
  { time: '11:17', responses: 41 },
  { time: '11:18', responses: 31 },
  { time: '11:19', responses: 65 },
  { time: '11:20', responses: 45 },
  { time: '11:21', responses: 81 },
];

export function QuickStatsChart() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-slate-200">Yanıt Süresi Analizi</h3>
        <p className="text-xs text-slate-400">Son 5 dakika trafiği (ms)</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 19, 24, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                backdropFilter: 'blur(8px)',
              }}
              itemStyle={{ color: '#c4b5fd' }}
            />
            <Area
              type="monotone"
              dataKey="responses"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorResponses)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
