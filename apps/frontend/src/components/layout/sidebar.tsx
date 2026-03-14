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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ürünler', href: '/dashboard/products', icon: Package },
  { name: 'Siparişler', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Sistem Logları', href: '/dashboard/logs', icon: Activity },
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
    <div className="flex flex-col h-screen w-64 bg-slate-950 border-r border-slate-800 text-slate-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">EcoSystem</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="ml-2 h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="p-4 rounded-2xl bg-slate-900/40 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Oturum Açan</span>
            <span className="text-sm text-slate-200 mt-1 truncate font-medium">{userEmail || 'Yükleniyor...'}</span>
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
