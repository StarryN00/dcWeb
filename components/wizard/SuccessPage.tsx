'use client';

import Link from 'next/link';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface SuccessPageProps {
  score: number;
  leadId: string;
}

function getScoreLevel(score: number) {
  if (score >= 90) return { level: 'A', label: 'A级潜客', color: 'primary', description: '您的需求非常明确，我们会优先为您安排资深设计师！' };
  if (score >= 75) return { level: 'B', label: 'B级潜客', color: 'primary', description: '您的装修计划很清晰，我们会尽快为您提供专业方案！' };
  if (score >= 60) return { level: 'C', label: 'C级潜客', color: 'accent', description: '感谢您的信任，我们会及时与您联系！' };
  return { level: 'D', label: 'D级潜客', color: 'neutral', description: '感谢您的咨询，我们会为您提供合适的方案！' };
}

export function SuccessPage({ score, leadId }: SuccessPageProps) {
  const scoreInfo = getScoreLevel(score);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-100 p-4">
      <div className="max-w-2xl w-full animate-fade-in-up">
        {/* 成功图标 */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-75" />
            <div className="relative w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircleIcon className="w-14 h-14 text-white" />
            </div>
          </div>
        </div>

        {/* 成功消息 */}
        <div className="text-center mb-8">
          <h1 className="text-heading-1 text-neutral-900 mb-4">
            提交成功！
          </h1>
          <p className="text-body-xl text-neutral-600">
            感谢您的信任，我们已收到您的装修需求
          </p>
        </div>

        {/* 评分卡片 */}
        <div className="glass-card-light radius-lg shadow-elevation-3 p-8 mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <SparklesIcon className="w-8 h-8 text-accent-500" />
            <h2 className="text-heading-3 text-neutral-900">您的评分</h2>
            <SparklesIcon className="w-8 h-8 text-accent-500" />
          </div>

          <div className="text-center mb-6">
            <div className="inline-block">
              <div className={`text-6xl font-bold gradient-text-real-estate mb-2`}>
                {score}
              </div>
              <div className="text-body-lg font-bold text-primary-700">
                {scoreInfo.label}
              </div>
            </div>
          </div>

          <p className="text-center text-neutral-600 text-body-lg">
            {scoreInfo.description}
          </p>
        </div>

        {/* 后续步骤 */}
        <div className="glass-card-light radius-lg shadow-elevation-2 p-8 mb-8 bg-gradient-to-br from-primary-50/50 to-accent-50/30">
          <h3 className="text-body-xl font-bold text-neutral-900 mb-4 text-center">
            接下来我们会做什么？
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                1
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">
                  专业顾问联系您
                </h4>
                <p className="text-neutral-600">
                  1个工作日内，我们的专业顾问会通过电话与您联系
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                2
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">
                  预约上门量房
                </h4>
                <p className="text-neutral-600">
                  确认您的时间，安排设计师免费上门测量和沟通
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                3
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">
                  定制设计方案
                </h4>
                <p className="text-neutral-600">
                  根据您的需求，为您量身定制专属装修方案和报价
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 glass-card-light px-6 py-3 text-neutral-700 text-center radius-md font-bold hover:bg-white/90 transition-all border border-neutral-300"
          >
            返回首页
          </Link>
          <Link
            href="/cases"
            className="flex-1 btn-primary-real-estate text-center"
          >
            查看案例
          </Link>
        </div>

        {/* 联系方式 */}
        <div className="text-center mt-8 glass-card-light p-6 radius-lg shadow-elevation-2">
          <p className="text-neutral-600 mb-2">
            如有疑问，请随时联系我们
          </p>
          <a
            href="tel:400-888-8888"
            className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            400-888-8888
          </a>
        </div>
      </div>
    </div>
  );
}
