'use client';

import Link from 'next/link';
import { ArrowRightIcon, CheckBadgeIcon, ShieldCheckIcon, HomeModernIcon } from '@heroicons/react/24/outline';

interface HeroSectionProps {
  onGetQuote?: () => void;
}

export function HeroSection({ onGetQuote }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-100">
      {/* 背景装饰 - 柔和渐变 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 大圆形渐变 */}
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-tr from-accent-200/20 to-transparent rounded-full blur-3xl" />

        {/* 网格纹理 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(12,74,110,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(12,74,110,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 container mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：文案和CTA */}
          <div className="text-left">
            {/* 信任徽章 */}
            <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-down">
              <div className="trust-badge">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>10年专业经验</span>
              </div>
              <div className="trust-badge">
                <CheckBadgeIcon className="w-4 h-4" />
                <span>1000+成功案例</span>
              </div>
            </div>

            {/* 主标题 */}
            <h1 className="text-display mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="block text-neutral-900 mb-2">寻找理想家</span>
              <span className="block gradient-text-real-estate font-extrabold text-6xl md:text-7xl">
                从这里开始
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-body-xl text-neutral-600 mb-4 max-w-xl animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              专业团队为您提供一站式装修服务，让梦想家触手可及
            </p>

            <p className="text-body-lg text-neutral-500 mb-10 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              透明报价 · 全程监理 · 品质保障 · 终身维护
            </p>

            {/* CTA按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/wizard"
                className="btn-primary-real-estate inline-flex items-center justify-center gap-2 group"
              >
                <span>立即获取装修方案</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/cases"
                className="glass-card-light px-8 py-3.5 rounded-xl font-semibold text-primary-900 hover:bg-white/90 transition-all duration-300 inline-flex items-center justify-center gap-2 border border-neutral-300"
              >
                <HomeModernIcon className="w-5 h-5" />
                <span>浏览装修案例</span>
              </Link>
            </div>

            {/* 统计数字 */}
            <div className="grid grid-cols-3 gap-6 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {[
                { value: '1000+', label: '成功案例' },
                { value: '98%', label: '客户满意度' },
                { value: '10年', label: '行业经验' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：虚拟看房预览 */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* 主玻璃卡片 */}
            <div className="glass-card rounded-2xl p-6 shadow-2xl">
              {/* 虚拟看房预览图 */}
              <div className="virtual-tour-preview aspect-[4/3] mb-4 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2666&auto=format&fit=crop"
                  alt="虚拟看房预览"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* 房源信息卡片 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-neutral-900">现代简约 • 三居室</h3>
                  <div className="price-tag text-base">
                    ¥28万
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="feature-tag">120㎡</span>
                  <span className="feature-tag">南北通透</span>
                  <span className="feature-tag">精装交付</span>
                  <span className="feature-tag">45天工期</span>
                </div>

                <div className="divider-accent my-4" />

                {/* 特色服务 */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: '✓', label: '0元设计方案' },
                    { icon: '✓', label: '品质材料保障' },
                    { icon: '✓', label: '全程监理服务' },
                    { icon: '✓', label: '2年质保承诺' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-neutral-700">
                      <span className="w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 浮动徽章 - 左上 */}
            <div className="absolute -top-4 -left-4 glass-card-light px-4 py-2 rounded-xl shadow-lg animate-bounce-slow">
              <div className="text-xs text-neutral-600 mb-0.5">本月成交</div>
              <div className="text-2xl font-bold text-primary-900">156套</div>
            </div>

            {/* 浮动徽章 - 右下 */}
            <div className="absolute -bottom-4 -right-4 glass-card-light px-4 py-2 rounded-xl shadow-lg animate-pulse-slow">
              <div className="flex items-center gap-2">
                <CheckBadgeIcon className="w-6 h-6 text-primary-600" />
                <div>
                  <div className="text-xs text-neutral-600">客户满意度</div>
                  <div className="text-xl font-bold text-primary-900">98.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 滚动提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-primary-400 rounded-full flex items-start justify-center p-2">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
