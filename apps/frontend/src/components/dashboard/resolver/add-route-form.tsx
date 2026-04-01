'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface AddRouteFormProps {
  onAdd: (prefix: string, target: string) => Promise<void>;
  onCancel: () => void;
}

export function AddRouteForm({ onAdd, onCancel }: AddRouteFormProps) {
  const [prefix, setPrefix] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!prefix.trim()) {
      setError('Prefix is required');
      return;
    }
    if (!target.trim()) {
      setError('Target is required');
      return;
    }

    // Basic URL validation for target
    try {
      new URL(target.trim());
    } catch {
      setError('Target must be a valid URL');
      return;
    }

    setLoading(true);
    try {
      await onAdd(prefix.trim(), target.trim());
      setPrefix('');
      setTarget('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Add New Route</h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Prefix Input */}
          <div>
            <label htmlFor="prefix" className="block text-sm font-medium text-slate-300 mb-2">
              Prefix
            </label>
            <input
              id="prefix"
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g., orders, products, auth"
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          {/* Target Input */}
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-slate-300 mb-2">
              Target URL
            </label>
            <input
              id="target"
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g., http://localhost:5002"
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600 disabled:opacity-50 text-white font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Adding...' : 'Add Route'}
          </button>
        </div>
      </form>
    </div>
  );
}
