'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

interface AdminNavProps {
  userEmail: string;
  unreadCount?: number;
}

export default function AdminNav({ userEmail, unreadCount = 0 }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Genel Bakış', exact: true },
    { href: '/admin/videolar', label: 'Video Yönetimi', exact: false },
    {
      href: '/admin/mesajlar',
      label: 'İletişim Mesajları',
      badge: unreadCount > 0 ? unreadCount : undefined,
      exact: false,
    },
    { href: '/admin/kayitlar', label: 'İşlem Günlüğü', exact: false },
  ];

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo ve Başlık */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
                MG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">Admin Paneli</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                    BVA 2205
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">
                  Metehan Gezer &bull; Portfolyo Yönetimi
                </p>
              </div>
            </Link>
          </div>

          {/* Menü Linkleri */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-950/60 text-purple-200 border border-purple-700/50 shadow-sm shadow-purple-950/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profil ve Çıkış Butonu */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-zinc-200">{userEmail}</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Aktif Oturum (2 saat)
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Mobil Alt Menü */}
        <div className="md:hidden flex items-center gap-2 py-2.5 border-t border-zinc-800/60 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-950/70 text-purple-200 border border-purple-700/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
