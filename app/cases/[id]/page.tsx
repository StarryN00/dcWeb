'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageCarousel, ProjectInfoCard } from '@/components/cases';
import { Loading } from '@/components/ui';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, HeartIcon } from '@heroicons/react/24/outline';

interface CaseData {
  id: string;
  title: string;
  location: string;
  style: string;
  area: number;
  duration: number;
  price: number;
  images: string[];
  description: string;
  testimonial: string;
  foremanName: string;
  foremanPhone: string;
  stage: string;
  featured?: boolean;
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchCaseDetail(params.id as string);
    }
  }, [params.id]);

  const fetchCaseDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/cases/${id}`);
      const data = await response.json();

      if (data.success) {
        setCaseData(data.data);
      } else {
        setError(data.error || '案例不存在');
      }
    } catch (err) {
      console.error('获取案例详情失败:', err);
      setError('获取案例详情失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loading size="lg" text="加载中..." />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center animate-fade-in-up">
          <div className="inline-block p-8 glass-card-light rounded-full mb-6">
            <svg
              className="w-20 h-20 text-neutral-400"
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
          <h2 className="text-heading-3 text-neutral-900 mb-4">
            {error || '案例不存在'}
          </h2>
          <p className="text-body-lg text-neutral-600 mb-8">
            抱歉，您访问的案例可能已被删除或不存在
          </p>
          <Link
            href="/cases"
            className="btn-primary-real-estate inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            返回案例列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* 面包屑导航 */}
      <div className="bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="container mx-auto container-padding py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-primary-600 transition-colors">
              首页
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/cases" className="text-neutral-600 hover:text-primary-600 transition-colors">
              案例展示
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 font-medium">{caseData.title}</span>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <section className="section-spacing">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧: 图片和详情 */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
              {/* 返回按钮 */}
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors font-medium"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                返回
              </button>

              {/* 图片轮播 */}
              <ImageCarousel images={caseData.images} title={caseData.title} />

              {/* 项目描述 */}
              <div className="glass-card-light radius-lg shadow-elevation-2 p-6">
                <h3 className="text-body-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  项目描述
                </h3>
                <p className="text-body text-neutral-700 whitespace-pre-line">
                  {caseData.description}
                </p>
              </div>

              {/* 业主感言 */}
              <div className="glass-card-light radius-lg shadow-elevation-2 p-6 bg-gradient-to-br from-primary-50/50 to-accent-50/30">
                <h3 className="text-body-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
                  业主感言
                </h3>
                <div className="relative">
                  <svg className="absolute -top-2 -left-2 w-8 h-8 text-primary-300 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <p className="text-body text-neutral-700 italic pl-6">
                    {caseData.testimonial}
                  </p>
                </div>
                <div className="divider-accent my-4" />
                <div className="flex items-center gap-2">
                  <HeartIcon className="w-5 h-5 text-red-500 fill-red-500" />
                  <span className="text-sm text-neutral-600 font-medium">感谢业主的信任与支持</span>
                </div>
              </div>
            </div>

            {/* 右侧: 项目信息卡片 */}
            <div className="lg:col-span-1">
              <ProjectInfoCard case={caseData} />
            </div>
          </div>
        </div>
      </section>

      {/* 相关案例推荐 (暂时省略,可后续添加) */}
    </main>
  );
}
