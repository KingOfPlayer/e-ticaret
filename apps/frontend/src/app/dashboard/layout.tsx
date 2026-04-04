'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-transparent overflow-hidden text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Sidebar />
        <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar bg-black/[0.02]">
          <div className="py-10 px-10 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}

