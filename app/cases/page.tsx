'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CaseFilters, CaseGrid } from '@/components/cases';

interface CaseData {
  id: string;
  title: string;
  location: string;
  style: string;
  area: number;
  duration: number;
  price: number;
  images: string[];
  featured?: boolean;
}

export default function CasesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    style: searchParams.get('style') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  // 获取案例数据
  useEffect(() => {
    fetchCases();
  }, [filters]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (filters.style) params.append('style', filters.style);
      if (filters.minArea) params.append('minArea', filters.minArea);
      if (filters.maxArea) params.append('maxArea', filters.maxArea);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const queryString = params.toString();
      const url = `/api/cases${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setCases(data.data);
      } else {
        console.error('获取案例失败:', data.error || '数据格式错误');
        setCases([]);
      }
    } catch (error) {
      console.error('获取案例失败:', error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  // 更新筛选条件
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // 更新 URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    const queryString = params.toString();
    router.push(`/cases${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({
      style: '',
      minArea: '',
      maxArea: '',
      minPrice: '',
      maxPrice: '',
    });
    router.push('/cases', { scroll: false });
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* 页面头部 - 与首页风格一致的Hero区域 */}
      <section className="relative section-spacing bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-100 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-tr from-accent-200/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(12,74,110,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(12,74,110,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
        </div>

        <div className="container mx-auto container-padding relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            {/* 信任徽章 */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="trust-badge">
                <span>1000+真实案例</span>
              </div>
              <div className="trust-badge">
                <span>8大装修风格</span>
              </div>
            </div>

            <h1 className="text-display mb-4">
              <span className="block text-neutral-900 mb-2">精选装修案例</span>
              <span className="block gradient-text-real-estate">找到属于您的理想家</span>
            </h1>
            <p className="text-body-xl text-neutral-600 leading-relaxed">
              每一个案例都经过精心设计，从现代简约到典雅欧式，总有一款适合您
            </p>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* 筛选器 */}
          <CaseFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* 案例网格 */}
          <CaseGrid cases={cases} loading={loading} />

          {/* 底部CTA */}
          {!loading && cases.length > 0 && (
            <div className="mt-16 text-center">
              <div className="glass-card-light max-w-2xl mx-auto p-8 radius-lg">
                <p className="text-body-lg text-neutral-700 mb-6">
                  没有找到心仪的案例？告诉我们您的需求
                </p>
                <a
                  href="/wizard"
                  className="btn-primary-real-estate inline-flex items-center justify-center gap-2"
                >
                  <span>免费获取装修方案</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
