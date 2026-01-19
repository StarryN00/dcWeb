'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui';

interface CaseCardProps {
  case: {
    id: string;
    title: string;
    location: string;
    style: string;
    area: number;
    duration: number;
    price: number;
    images: string[];
    featured?: boolean;
  };
}

const styleLabels: Record<string, string> = {
  modern: '现代',
  nordic: '北欧',
  industrial: '工业',
  wabi_sabi: '侘寂',
  luxury: '轻奢',
  minimalist: '极简',
  chinese: '中式',
  european: '欧式',
};

export function CaseCard({ case: caseItem }: CaseCardProps) {
  return (
    <Link href={`/cases/${caseItem.id}`} className="group block">
      <div className="property-card glass-card-light radius-lg overflow-hidden shadow-elevation-2">
        {/* 图片容器 */}
        <div className="relative h-64 overflow-hidden bg-neutral-200">
          <img
            src={caseItem.images[0] || 'https://via.placeholder.com/800x600?text=暂无图片'}
            alt={caseItem.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/800x600?text=图片加载失败';
            }}
          />

          {/* 推荐标签 */}
          {caseItem.featured && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="warning" size="sm">
                推荐
              </Badge>
            </div>
          )}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* 底部信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-accent-400 transition-colors">
              {caseItem.title}
            </h3>
            <p className="text-sm text-neutral-200 mb-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {caseItem.location}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {caseItem.area}㎡
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {caseItem.duration}天
              </span>
              <span>·</span>
              <span className="text-accent-400 font-bold flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {caseItem.price}万
              </span>
            </div>
          </div>
        </div>

        {/* 风格标签 */}
        <div className="p-4 bg-white/50 backdrop-blur-sm">
          <Badge variant="info" size="sm">
            {styleLabels[caseItem.style] || caseItem.style}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
