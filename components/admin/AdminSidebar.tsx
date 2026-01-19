'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  HomeIcon,
  PhotoIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const menuItems = [
  { href: '/admin', label: '仪表盘', icon: HomeIcon },
  { href: '/admin/cases', label: '案例管理', icon: PhotoIcon },
  { href: '/admin/leads', label: '潜客管理', icon: UserGroupIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  return (
    <>
      {/* 移动端顶部栏 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <span className="font-bold text-stone-900">管理后台</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-stone-100"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 侧边栏 */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-stone-900 to-stone-800 text-white z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">梦</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">梦想家装饰</h1>
                <p className="text-xs text-stone-400">管理后台</p>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 用户信息和登出 */}
          <div className="p-4 border-t border-stone-700">
            {session?.user && (
              <div className="mb-3 px-4 py-2 bg-stone-700/50 rounded-lg">
                <p className="text-sm font-semibold">{session.user.name}</p>
                <p className="text-xs text-stone-400">
                  @{(session.user as any).username}
                </p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-stone-300 hover:bg-stone-700 hover:text-white rounded-lg transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">退出登录</span>
            </button>
            <Link
              href="/"
              className="mt-2 block text-center text-sm text-stone-400 hover:text-emerald-400 transition-colors"
            >
              返回前台
            </Link>
          </div>
        </div>
      </aside>

      {/* 移动端遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
