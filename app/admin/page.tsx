'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PhotoIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface Stats {
  totalCases: number;
  publishedCases: number;
  featuredCases: number;
  totalLeads: number;
  highScoreLeads: number;
  conversionRate: string;
  averageLeadScore: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalCases: 0,
    publishedCases: 0,
    featuredCases: 0,
    totalLeads: 0,
    highScoreLeads: 0,
    conversionRate: '0%',
    averageLeadScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 认证检查
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // 获取统计数据
  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const result = await response.json();

      if (result.success && result.data) {
        setStats(result.data);
      } else {
        console.error('获取统计数据失败:', result.error);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const statCards = [
    {
      title: '总案例数',
      value: stats.totalCases,
      subtitle: `已发布: ${stats.publishedCases}`,
      icon: PhotoIcon,
      color: 'emerald',
      href: '/admin/cases',
    },
    {
      title: '总潜客数',
      value: stats.totalLeads,
      subtitle: `高分潜客: ${stats.highScoreLeads}`,
      icon: UserGroupIcon,
      color: 'blue',
      href: '/admin/leads',
    },
    {
      title: '转化率',
      value: stats.conversionRate,
      subtitle: `平均评分: ${stats.averageLeadScore}`,
      icon: ChartBarIcon,
      color: 'amber',
      href: '/admin/leads',
    },
    {
      title: '推荐案例',
      value: stats.featuredCases,
      subtitle: '展示在首页',
      icon: SparklesIcon,
      color: 'purple',
      href: '/admin/cases',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 欢迎标题 */}
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          欢迎回来, {session?.user?.name}!
        </h1>
        <p className="text-stone-600">这是您的管理后台概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-1">
                {card.value}
              </h3>
              <p className="text-sm font-semibold text-stone-700 mb-1">
                {card.title}
              </p>
              <p className="text-xs text-stone-500">{card.subtitle}</p>
            </Link>
          );
        })}
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-stone-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/cases"
            className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all"
          >
            <PhotoIcon className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="font-semibold text-stone-900">创建新案例</p>
              <p className="text-sm text-stone-600">添加装修案例</p>
            </div>
          </Link>

          <Link
            href="/admin/leads"
            className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-stone-900">查看潜客</p>
              <p className="text-sm text-stone-600">管理潜客信息</p>
            </div>
          </Link>

          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <ChartBarIcon className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-semibold text-stone-900">查看前台</p>
              <p className="text-sm text-stone-600">预览用户页面</p>
            </div>
          </a>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-stone-900 mb-4">最近活动</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
            <div>
              <p className="text-sm font-semibold text-stone-900">
                新的潜客提交
              </p>
              <p className="text-xs text-stone-600">
                张三提交了装修咨询 - 5分钟前
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="text-sm font-semibold text-stone-900">
                案例已发布
              </p>
              <p className="text-xs text-stone-600">
                "现代简约风格案例"已上线 - 1小时前
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
            <div>
              <p className="text-sm font-semibold text-stone-900">
                潜客状态更新
              </p>
              <p className="text-xs text-stone-600">
                李四已预约上门量房 - 2小时前
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
