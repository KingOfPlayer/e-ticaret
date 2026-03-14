import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <div className="py-8 px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
