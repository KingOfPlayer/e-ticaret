'use client';

import React, { useState } from 'react';
import { Play, TerminalSquare, AlertCircle } from 'lucide-react';

export default function ApiTesterPage() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('/api/products');
  const [body, setBody] = useState('{\n  "name": "Yeni Ürün",\n  "price": 100\n}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleSendRequest = async () => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();
    try {
      const token = localStorage.getItem('access_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`http://localhost:5000${url}`, {
        method,
        headers,
        body: ['GET', 'DELETE'].includes(method) ? undefined : body,
      });

      const end = performance.now();
      setDuration(Math.round(end - start));
      
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error: any) {
      const end = performance.now();
      setDuration(Math.round(end - start));
      setResponse({ status: 'Error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-sm flex items-center gap-3">
          <TerminalSquare className="w-8 h-8 text-indigo-400" />
          API Tester
        </h1>
        <p className="text-indigo-200/60 mt-2">
          HATEOAS destekli (Seviye 3 RMM) Dispatcher API test aracınız.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/10"
            >
              <option className="bg-black/90">GET</option>
              <option className="bg-black/90">POST</option>
              <option className="bg-black/90">PUT</option>
              <option className="bg-black/90">DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/api/products"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-100 font-mono outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/10 placeholder:text-white/20"
            />
          </div>

          {!['GET', 'DELETE'].includes(method) && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Request Body (JSON)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono text-emerald-400 outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none scrollbar-hide"
                spellCheck={false}
              />
            </div>
          )}

          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Play className="w-5 h-5" /> GÖNDER
              </>
            )}
          </button>
        </div>

        {/* Response Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Yanıt</h3>
            {response && (
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${response.status >= 200 && response.status < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {response.status}
                </span>
                <span className="text-xs font-mono text-slate-400">{duration} ms</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 overflow-auto scrollbar-hide relative">
            {!response && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                <TerminalSquare className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">İstek atmak için GÖNDER'e tıklayın</p>
              </div>
            )}
            
            {response && (
               <pre className="text-xs font-mono text-indigo-300 whitespace-pre-wrap break-words">
                 {JSON.stringify(response.data, null, 2)}
               </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
