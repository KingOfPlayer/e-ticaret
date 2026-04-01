'use client';

import React, { useState } from 'react';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import { LogStatistics } from '@/components/dashboard/log-statistics';
import { LogDetailsViewer } from '@/components/dashboard/log-details-viewer';

export function LogsDashboard() {
  const [showDetails, setShowDetails] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">System Logs</h1>
              <p className="text-slate-400 text-sm">
                Real-time API requests and performance monitoring
              </p>
            </div>
          </div>

          {/* Toggle Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
              title="Toggle statistics"
            >
              {showStatistics ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
              title="Toggle log details"
            >
              {showDetails ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">Real-time Monitoring Active</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistics Section */}
        {showStatistics && (
          <div className="animate-in fade-in-50 duration-300">
            <LogStatistics />
          </div>
        )}

        {/* Detailed Logs Section */}
        {showDetails && (
          <div className="animate-in fade-in-50 duration-300">
            <LogDetailsViewer />
          </div>
        )}

        {/* Empty State */}
        {!showStatistics && !showDetails && (
          <div className="text-center py-12">
            <p className="text-slate-400">
              Both views are hidden. Click the eye icons to display statistics and/or log details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
