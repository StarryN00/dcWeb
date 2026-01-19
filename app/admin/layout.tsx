'use client';

import { SessionProvider } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 登录页面不显示侧边栏
  if (pathname === '/admin/login') {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-stone-50">
        <AdminSidebar />

        {/* 主内容区 */}
        <main className="lg:ml-64 min-h-screen">
          {/* 移动端顶部占位 */}
          <div className="h-14 lg:hidden" />

          {/* 内容 */}
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
