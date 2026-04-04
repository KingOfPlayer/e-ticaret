import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  ChevronRight,
  LogOut,
  RefreshCw,
  TerminalSquare,
  Router,
  Layers,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    title: 'GENEL',
    items: [
      { name: 'Özet', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Canlı Trafik', href: '/dashboard/live-traffic', icon: Activity },
      { name: 'Loglar', href: '/dashboard/logs', icon: RefreshCw },
    ],
  },
  {
    title: 'SERVİSLER',
    items: [
      { name: 'Servis Durumu', href: '/dashboard/service-status', icon: Layers },
      { name: 'İstek Akışı', href: '/dashboard/request-flow', icon: RefreshCw },
    ],
  },
  {
    title: 'ARAÇLAR',
    items: [
      { name: 'API Test', href: '/dashboard/api-tester', icon: TerminalSquare },
      { name: 'Route Resolver', href: '/dashboard/resolver', icon: Router },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserEmail(JSON.parse(user).email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col h-screen w-64 glass-panel rounded-none border-y-0 border-l-0 border-r border-slate-200 text-slate-600">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
          <Activity className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-slate-900 tracking-widest uppercase italic">Dispatcher</span>
          <span className="text-[9px] font-bold text-emerald-600/70 tracking-[0.3em] uppercase">Control Unit</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-10 overflow-y-auto custom-scrollbar">
        {categories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">
              {category.title}
            </h3>
            <div className="space-y-1.5">
              {category.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 border-transparent',
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm'
                        : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500',
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-4 w-4 flex-shrink-0 transition-all duration-300',
                        isActive ? 'text-emerald-600' : 'group-hover:text-slate-700',
                      )}
                    />
                    <span className="flex-1 tracking-wide">{item.name}</span>
                    {isActive ? (
                      <ChevronRight className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-6 space-y-4 border-t border-slate-100">
        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
              Sistem Operatörü
            </span>
            <span className="text-[11px] text-slate-700 mt-1.5 truncate font-bold tracking-tight">
              {userEmail || 'Tanımlanıyor...'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-[10px] font-black uppercase tracking-wider transition-all group pt-2 border-t border-slate-100"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Terminali Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

