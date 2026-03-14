'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  Activity,
  ChevronRight
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

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-950 border-r border-slate-800 text-slate-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
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
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400" 
                  : "hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white"
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="ml-2 h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-900 transition-colors">
          <Settings className="mr-3 h-5 w-5 text-slate-400" />
          Ayarlar
        </button>
      </div>
    </div>
  );
}
