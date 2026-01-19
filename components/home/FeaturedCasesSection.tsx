'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui';

interface CaseData {
  id: string;
  title: string;
  location: string;
  style: string;
  area: number;
  duration: number;
  price: number;
  images: string[];
  featured: boolean;
}

export function FeaturedCasesSection() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取推荐案例
    fetch('/api/cases?featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCases(data.data.slice(0, 6)); // 只显示前6个
        } else {
          setCases([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('获取案例失败:', err);
        setCases([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="section-spacing bg-neutral-50">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing bg-neutral-50">
      <div className="container mx-auto container-padding">
        {/* 标题 */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-heading-1 text-neutral-900 mb-4">
            精选案例展示
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            1000+ 成功案例，多种风格任您选择
          </p>
        </div>

        {/* 案例网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseItem) => (
            <Link
              key={caseItem.id}
              href={`/cases/${caseItem.id}`}
              className="group"
            >
              <div className="property-card glass-card-light radius-lg overflow-hidden shadow-elevation-2">
                {/* 图片 */}
                <div className="relative h-64 overflow-hidden bg-neutral-200">
                  <img
                    src={caseItem.images[0] || 'https://via.placeholder.com/800x600'}
                    alt={caseItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* 推荐标签 */}
                  {caseItem.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="warning">推荐</Badge>
                    </div>
                  )}

                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* 底部信息 */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-accent-400 transition-colors">
                      {caseItem.title}
                    </h3>
                    <p className="text-sm text-neutral-200 mb-3">
                      {caseItem.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{caseItem.area}㎡</span>
                      <span>·</span>
                      <span>{caseItem.duration}天</span>
                      <span>·</span>
                      <span className="text-accent-400 font-bold">
                        {caseItem.price}万
                      </span>
                    </div>
                  </div>
                </div>

                {/* 风格标签 */}
                <div className="p-4 bg-white/50 backdrop-blur-sm">
                  <Badge variant="info" size="sm">
                    {caseItem.style}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 查看更多 */}
        <div className="text-center mt-12">
          <Link
            href="/cases"
            className="glass-card-light inline-flex items-center justify-center gap-2 px-8 py-3.5 radius-lg font-bold text-primary-900 hover:bg-white/90 transition-all duration-300 border border-neutral-300 shadow-elevation-2"
          >
            查看全部案例
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
