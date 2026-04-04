'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

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
    if (window.confirm('Are you sure you want to delete this route?')) {
      setDeletingPrefix(prefix);
      try {
        await onDelete(prefix);
      } finally {
        setDeletingPrefix(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50 bg-slate-900/50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Prefix</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Target</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr
              key={route._id}
              className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30">
                  {route.prefix}
                </span>
              </td>
              <td className="px-6 py-4">
                <code className="px-3 py-1 bg-slate-700/50 text-slate-200 rounded text-sm font-mono break-all">
                  {route.target}
                </code>
              </td>
              <td className="px-6 py-4">
                <code className="text-slate-400 text-xs font-mono">
                  {route._id.substring(0, 8)}...
                </code>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => handleDelete(route.prefix)}
                  disabled={deletingPrefix === route.prefix}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 transition-all inline-flex items-center justify-center"
                  title="Delete route"
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
