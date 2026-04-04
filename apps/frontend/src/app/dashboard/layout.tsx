'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-transparent overflow-hidden text-slate-100">
        <Sidebar />
        <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-hide">
          <div className="py-8 px-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
