'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Video,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  Globe,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Skip layout sidebar for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projets', href: '/admin/projects', icon: FolderKanban },
    { name: 'Articles Blog', href: '/admin/blog', icon: FileText },
    { name: 'Vidéos YouTube', href: '/admin/videos', icon: Video },
    { name: 'Galerie Photos', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Messages & Contact', href: '/admin/messages', icon: Mail },
    { name: 'Paramètres Site', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex text-white font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-brand-darkCard border-r border-brand-gold/20 flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          <Logo variant="light" className="mb-8" />

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-brand-gold text-brand-dark shadow-md font-bold'
                      : 'text-brand-beige/70 hover:bg-brand-gold/10 hover:text-brand-gold'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-brand-gold/15">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-gold hover:bg-brand-gold/10 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Voir le site public</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
