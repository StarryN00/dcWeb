'use client';

import { Badge } from '@/components/ui';
import {
  HomeIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface ProjectInfoCardProps {
  case: {
    title: string;
    location: string;
    style: string;
    area: number;
    duration: number;
    price: number;
    stage: string;
    foremanName: string;
    foremanPhone: string;
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

export function ProjectInfoCard({ case: caseData }: ProjectInfoCardProps) {
  return (
    <div className="sticky top-4 bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          {caseData.title}
        </h2>
        <div className="flex items-center gap-2 text-stone-600">
          <MapPinIcon className="w-5 h-5" />
          <span>{caseData.location}</span>
        </div>
      </div>

      {/* 风格标签 */}
      <div>
        <Badge variant="info" size="md">
          {styleLabels[caseData.style] || caseData.style}
        </Badge>
      </div>

      {/* 项目信息 */}
      <div className="space-y-4 py-4 border-y border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <HomeIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-stone-600">房屋面积</p>
            <p className="text-lg font-semibold text-stone-900">
              {caseData.area} ㎡
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-stone-600">装修工期</p>
            <p className="text-lg font-semibold text-stone-900">
              {caseData.duration} 天
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-stone-600">装修费用</p>
            <p className="text-lg font-semibold text-emerald-600">
              {caseData.price} 万元
            </p>
          </div>
        </div>
      </div>

      {/* 装修阶段 */}
      <div className="bg-stone-50 rounded-lg p-4">
        <p className="text-sm text-stone-600 mb-1">装修阶段</p>
        <p className="text-base font-semibold text-stone-900">
          {caseData.stage}
        </p>
      </div>

      {/* 施工队长信息 */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-emerald-800">负责工长</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-stone-900">{caseData.foremanName}</p>
            <a
              href={`tel:${caseData.foremanPhone}`}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <PhoneIcon className="w-4 h-4" />
              {caseData.foremanPhone}
            </a>
          </div>
        </div>
      </div>

      {/* CTA 按钮 */}
      <div className="space-y-3">
        <a
          href="/wizard"
          className="block w-full px-6 py-3 bg-emerald-600 text-white text-center rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          获取类似方案
        </a>
        <a
          href={`tel:${caseData.foremanPhone}`}
          className="block w-full px-6 py-3 border-2 border-emerald-600 text-emerald-600 text-center rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
        >
          电话咨询工长
        </a>
      </div>
    </div>
  );
}
