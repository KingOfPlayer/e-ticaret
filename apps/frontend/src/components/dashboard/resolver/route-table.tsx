import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Route {
  _id: string;
  prefix: string;
  target: string;
  __v: number;
}

interface RouteTableProps {
  routes: Route[];
  onDelete: (prefix: string) => Promise<void>;
}

export function RouteTable({ routes, onDelete }: RouteTableProps) {
  const [deletingPrefix, setDeletingPrefix] = useState<string | null>(null);

  const handleDelete = async (prefix: string) => {
    if (window.confirm('Bu rotayı sistemden silmek istediğinize emin misiniz?')) {
      setDeletingPrefix(prefix);
      try {
        await onDelete(prefix);
      } finally {
        setDeletingPrefix(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              ERİŞİM ÖNEKİ (PREFIX)
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              HEDEF SERVİS (TARGET)
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              SİSTEM KODU
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
              KAYIT KONTROL
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {routes.map((route) => (
            <tr key={route._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
              <td className="px-8 py-6">
                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                  /{route.prefix}
                </span>
              </td>
              <td className="px-8 py-6">
                <code className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[12px] font-black border border-slate-200 tracking-tight group-hover:text-slate-900 transition-colors shadow-sm">
                  {route.target}
                </code>
              </td>
              <td className="px-8 py-6">
                <code className="text-slate-400 text-[10px] font-black uppercase tracking-tighter tabular-nums">
                  {route._id}
                </code>
              </td>
              <td className="px-8 py-6 text-center">
                <button
                  onClick={() => handleDelete(route.prefix)}
                  disabled={deletingPrefix === route.prefix}
                  className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 transition-all duration-300 inline-flex items-center justify-center active:scale-90 disabled:opacity-30 shadow-sm"
                  title="Kaydı Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
