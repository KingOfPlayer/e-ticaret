'use client';

import React, { useState, useEffect } from 'react';
import { Play, TerminalSquare, Search, ChevronRight, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const ENDPOINTS = [
  {
    id: 'login',
    method: 'POST',
    label: 'POST Login',
    url: '/api/auth/login',
    body: '{\n  "email": "admin@ecosystem.com",\n  "password": "admin123"\n}',
  },
  {
    id: 'register',
    method: 'POST',
    label: 'POST Register',
    url: '/api/auth/register',
    body: '{\n  "email": "user@test.com",\n  "password": "password123"\n}',
  },
  { id: 'products_get', method: 'GET', label: 'GET All Products', url: '/api/products', body: '' },
  {
    id: 'product_create',
    method: 'POST',
    label: 'POST Create Product (admin)',
    url: '/api/products',
    body: '{\n  "name": "Gaming PC",\n  "price": 25000,\n  "description": "High end PC",\n  "category": "Elektronik"\n}',
  },
  { id: 'orders_get', method: 'GET', label: 'GET All Orders', url: '/api/orders', body: '' },
  {
    id: 'stats',
    method: 'GET',
    label: 'GET Admin Traffic Stats',
    url: '/api/admin/stats',
    body: '',
  },
];

export default function ApiTesterPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [url, setUrl] = useState(ENDPOINTS[0].url);
  const [method, setMethod] = useState(ENDPOINTS[0].method);
  const [body, setBody] = useState(ENDPOINTS[0].body);
  const [token, setToken] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) setToken(savedToken);
  }, []);

  const selectEndpoint = (ep: (typeof ENDPOINTS)[0]) => {
    setSelectedEndpoint(ep);
    setUrl(ep.url);
    setMethod(ep.method);
    setBody(ep.body);
    setResponse(null);
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:5000${url}`, {
        method,
        headers,
        body: ['GET', 'DELETE'].includes(method) ? undefined : body,
      });
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (err: any) {
      setResponse({ status: 'Error', data: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6 animate-in fade-in duration-700">
      {/* Left Sidebar: Endpoints List (Image 4 Style) */}
      <div className="w-80 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            ENDPOINT'LER
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => selectEndpoint(ep)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group',
                selectedEndpoint.id === ep.id
                  ? 'bg-indigo-600/20 border border-indigo-500/20 text-white'
                  : 'hover:bg-white/[0.03] text-slate-400',
              )}
            >
              <span
                className={cn(
                  'text-[8px] font-black px-1.5 py-0.5 rounded uppercase w-10 text-center',
                  ep.method === 'POST'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-blue-500/20 text-blue-400',
                )}
              >
                {ep.method}
              </span>
              <span className="text-xs font-bold truncate group-hover:text-white transition-colors">
                {ep.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area: Request/Response (Image 4 Style) */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/5 p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            BİR ENDPOINT SEÇİN
          </h3>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              URL
            </label>
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 font-mono">http://localhost:5000</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Token & Method Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                METOD
              </label>
              <select
                value={method}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none"
                disabled
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                TOKEN (OTOMATİK DOLDURULUR)
              </label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                <Lock className="w-4 h-4 text-indigo-500" />
                <input
                  value={token ? `Bearer ${token.substring(0, 30)}...` : 'Token yok'}
                  disabled
                  className="flex-1 bg-transparent border-none outline-none text-[10px] text-slate-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Body Editor */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              REQUEST BODY (JSON)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-400 outline-none scrollbar-hide resize-none"
              placeholder="{}"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            <Play className="w-4 h-4" /> GÖNDER
          </button>
        </div>

        {/* Response Area */}
        <div className="flex-1 flex flex-col space-y-2 min-h-0">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              YANIT
            </label>
            {response && (
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded uppercase',
                  response.status < 400
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400',
                )}
              >
                {response.status} {response.status === 200 ? 'OK' : ''}
              </span>
            )}
          </div>
          <div className="flex-1 bg-black/60 border border-white/10 rounded-xl p-4 overflow-auto scrollbar-hide">
            {response ? (
              <pre className="text-[11px] font-mono text-indigo-300">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic text-xs">
                İsteği göndererek yanıtı buradan izleyin...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
