import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Activity,
  ChevronRight,
  LogOut,
  RefreshCw,
  TerminalSquare,
  Router,
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
      { name: 'Servis Durumu', href: '/dashboard/service-status', icon: Activity },
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
    <div className="flex flex-col h-screen w-64 glass-panel rounded-none border-t-0 border-b-0 border-l-0 border-r border-white/10 text-slate-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-widest uppercase">Dispatcher</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        {categories.map((category) => (
          <div key={category.title} className="space-y-3">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
              {category.title}
            </h3>
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                        : 'hover:bg-white/[0.03] hover:text-white text-slate-400',
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-4 w-4 flex-shrink-0 transition-colors',
                        isActive ? 'text-indigo-400' : 'group-hover:text-white',
                      )}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4 space-y-4 border-t border-slate-800">
        <div className="p-4 rounded-2xl bg-slate-900/40 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              Oturum Açan
            </span>
            <span className="text-sm text-slate-200 mt-1 truncate font-medium">
              {userEmail || 'Yükleniyor...'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-400 text-xs font-bold transition-colors group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Sistemden Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
