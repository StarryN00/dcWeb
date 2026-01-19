'use client';

import { CaseCard } from './CaseCard';
import { Loading, CardSkeleton } from '@/components/ui';

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

interface CaseGridProps {
  cases: CaseData[];
  loading?: boolean;
}

export function CaseGrid({ cases, loading }: CaseGridProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-8 bg-stone-100 rounded-full mb-4">
          <svg
            className="w-16 h-16 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-stone-900 mb-2">暂无匹配的案例</h3>
        <p className="text-stone-600">
          请尝试调整筛选条件,或查看全部案例
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 结果统计 */}
      <div className="mb-6">
        <p className="text-stone-600">
          共找到 <span className="font-semibold text-stone-900">{cases.length}</span> 个案例
        </p>
      </div>

      {/* 案例网格 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cases.map((caseItem) => (
          <CaseCard key={caseItem.id} case={caseItem} />
        ))}
      </div>
    </>
  );
}
