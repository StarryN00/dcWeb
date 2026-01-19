'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 监听滚动,添加背景
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 路由改变时关闭移动菜单
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/cases', label: '案例展示' },
    { href: '/wizard', label: '免费咨询' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">梦</span>
              </div>
              <span className="text-xl font-bold text-neutral-900 hidden sm:inline">
                梦想家装饰
              </span>
            </Link>

            {/* 桌面导航 */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-semibold transition-all duration-200 relative group ${
                    isActive(link.href)
                      ? 'text-primary-600'
                      : 'text-neutral-700 hover:text-primary-600'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all duration-200 ${
                      isActive(link.href)
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* 联系按钮 */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:400-888-8888"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <PhoneIcon className="w-5 h-5" />
                <span>400-888-8888</span>
              </a>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-neutral-900" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-neutral-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 背景遮罩 */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* 菜单内容 */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <nav className="container mx-auto px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 移动端联系按钮 */}
            <a
              href="tel:400-888-8888"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all mt-4"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>400-888-8888</span>
            </a>
          </nav>
        </div>
      </div>

      {/* 占位符,防止内容被固定导航遮挡 */}
      <div className="h-16 md:h-20" />
    </>
  );
}
