'use client';

import React, { useState } from 'react';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import { LogStatistics } from '@/components/dashboard/log-statistics';
import { LogDetailsViewer } from '@/components/dashboard/log-details-viewer';

export function LogsDashboard() {
  const [showDetails, setShowDetails] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight italic underline decoration-emerald-500 decoration-wavy underline-offset-8">System Logs</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">
                Real-time API requests and performance monitoring
              </p>
            </div>
          </div>

          {/* Toggle Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95"
              title="Toggle statistics"
            >
              {showStatistics ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95"
              title="Toggle log details"
            >
              {showDetails ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3 px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full w-fit shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none">Real-time Monitoring Active</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Statistics Section */}
        {showStatistics && (
          <div className="animate-in fade-in-50 duration-500">
            <LogStatistics />
          </div>
        )}

        {/* Detailed Logs Section */}
        {showDetails && (
          <div className="animate-in fade-in-50 duration-500">
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
