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
    <div className="flex h-[calc(100vh-220px)] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Left Sidebar: Endpoints List */}
      <div className="w-80 glass-panel rounded-[2rem] flex flex-col overflow-hidden border border-slate-200 shadow-sm bg-white">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            İSTEK HAVUZU
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => selectEndpoint(ep)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left group border border-transparent',
                selectedEndpoint.id === ep.id
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm'
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900',
              )}
            >
              <div
                className={cn(
                  'text-[8px] font-black px-2 py-1 rounded-lg uppercase w-12 text-center border transition-all duration-300',
                  ep.method === 'POST'
                    ? selectedEndpoint.id === ep.id ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-emerald-600'
                    : selectedEndpoint.id === ep.id ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-slate-100 border-slate-200 text-blue-600',
                )}
              >
                {ep.method}
              </div>
              <span className="text-[11px] font-black truncate tracking-tight">
                {ep.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area: Request/Response */}
      <div className="flex-1 glass-panel rounded-[2rem] flex flex-col overflow-hidden border border-slate-200 p-8 space-y-8 shadow-sm bg-white">
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex items-center justify-between">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
               TERMINAL KONTROL
             </h3>
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">READY TO DISPATCH</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-400/20" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {/* URL Input */}
            <div className="md:col-span-3 space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] ml-1">
                DAĞITIM ROTA ADRESİ (URL)
              </label>
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-sm">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-slate-400 font-black tabular-nums opacity-50 uppercase tracking-tighter">http://gateway:5000</span>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-900 font-bold tracking-tight"
                />
              </div>
            </div>

            <div className="md:col-span-1 space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] ml-1">
                METOD
              </label>
              <div className="relative group">
                <select
                  value={method}
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[11px] text-slate-900 font-black outline-none appearance-none cursor-not-allowed opacity-80 shadow-sm"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-slate-300 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Token Row */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] ml-1">
              SİSTEM YETKİ ANAHTARI (TOKEN)
            </label>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 opacity-70">
              <Lock className="w-4 h-4 text-emerald-600" />
              <input
                value={token ? `BEARER_TOKEN/${token.substring(0, 48)}...` : 'YETKİ ANAHTARI BULUNAMADI'}
                disabled
                className="flex-1 bg-transparent border-none outline-none text-[11px] text-slate-400 font-black tracking-widest uppercase"
              />
            </div>
          </div>

          <div className="flex gap-8 min-h-0 flex-1">
            {/* Body Editor */}
            <div className="flex-1 space-y-2.5 flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] ml-1">
                İSTEK GÖVDESİ (PAYLOAD JSON)
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex-1 w-full min-h-[160px] bg-slate-50 border border-slate-200 rounded-2xl p-6 text-[12px] font-bold text-slate-900 outline-none custom-scrollbar resize-none font-mono tracking-tight ring-emerald-500/10 focus:ring-4 transition-all shadow-sm"
                placeholder="{}"
              />
            </div>

            {/* Response Area */}
            <div className="flex-1 flex flex-col space-y-2.5 min-h-0">
              <div className="flex items-center justify-between ml-1 leading-none">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em]">
                  SUNUCU YANITI (RESPONSE)
                </label>
                {response && (
                  <span
                    className={cn(
                      'text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border shadow-sm',
                      response.status < 400
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border-rose-100',
                    )}
                  >
                    STATUS {response.status}
                  </span>
                )}
              </div>
              <div className="flex-1 bg-slate-900 border border-slate-950 rounded-2xl p-6 overflow-auto custom-scrollbar shadow-inner">
                {response ? (
                  <pre className="text-[12px] font-bold font-mono text-emerald-400 leading-relaxed selection:bg-emerald-500/20 selection:text-emerald-100">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 uppercase font-black text-[10px] tracking-[0.4em] gap-4">
                    <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                       <div className="w-1/2 h-full bg-emerald-500/20 animate-[slide-right_2s_infinite]" />
                    </div>
                    VERİ BEKLENİYOR
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.3em] py-4 px-12 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:grayscale disabled:opacity-50 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Play className="w-4 h-4 fill-current" /> DAĞITIMI BAŞLAT (DISPATCH)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

