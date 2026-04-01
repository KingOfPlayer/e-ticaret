'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Trash2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { RouteTable } from './route-table';
import { AddRouteForm } from './add-route-form';

interface Route {
  _id: string;
  prefix: string;
  target: string;
  __v: number;
}

export function ResolverDashboard() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/route', true);
      setRoutes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshRoutes = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await api.patch('/route', {}, true);
      // Refresh routes after patching
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh routes');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddRoute = async (prefix: string, target: string) => {
    setError(null);
    try {
      await api.post('/route', { prefix, target }, true);
      setShowAddForm(false);
      // Refresh routes after adding
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add route');
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    setError(null);
    try {
      await api.delete(`/route/${routeId}`, true);
      // Refresh routes after deletion
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete route');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 border border-purple-500/40 rounded-lg">
                <RefreshCw className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Route Resolver</h1>
                <p className="text-slate-400 text-sm">Manage service routes and prefixes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefreshRoutes}
                disabled={refreshing}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white font-medium transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Route
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg w-fit">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm text-purple-400 font-medium">
              {routes.length} route{routes.length !== 1 ? 's' : ''} configured
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              ✕
            </button>
          </div>
        )}

        {/* Add Route Form */}
        {showAddForm && (
          <div className="mb-6">
            <AddRouteForm onAdd={handleAddRoute} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {/* Routes Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin mb-4">
                  <RefreshCw className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">Loading routes...</p>
              </div>
            </div>
          ) : routes.length > 0 ? (
            <RouteTable routes={routes} onDelete={handleDeleteRoute} />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="p-3 bg-slate-700/50 rounded-lg inline-block mb-3">
                  <RefreshCw className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400">No routes configured yet</p>
                <p className="text-slate-500 text-sm mt-1">Add a new route to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
