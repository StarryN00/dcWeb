'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, PhoneIcon, StarIcon } from '@heroicons/react/24/outline';

const stats = [
  { value: 1000, label: '精品案例', suffix: '+' },
  { value: 98, label: '客户满意度', suffix: '%' },
  { value: 10, label: '行业经验', suffix: '年' },
  { value: 100, label: 'VIP服务', suffix: '%' },
];

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState(stats.map(() => 0));
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // 启动数字滚动动画
          stats.forEach((stat, index) => {
            const duration = 2000; // 2秒
            const steps = 60;
            const increment = stat.value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounters((prev) => {
                const newCounters = [...prev];
                newCounters[index] = Math.floor(current);
                return newCounters;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="section-spacing relative overflow-hidden"
    >
      {/* 奢华背景 - 深色渐变 + 金色光晕 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-neutral-900 to-primary-950" />

      {/* 液态背景装饰 */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="liquid-background top-0 left-1/3 animate-float" />
        <div className="liquid-background bottom-0 right-1/3 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* 网格纹理 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,165,6,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,165,6,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto container-padding relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* VIP徽章 */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="exclusive-badge inline-flex items-center gap-2">
              <StarIcon className="w-4 h-4" />
              <span>EXCLUSIVE MEMBERSHIP</span>
            </div>
          </div>

          {/* 标题 - 奢华排版 */}
          <h2 className="text-heading-1 text-center mb-6 animate-fade-in-up font-extrabold" style={{ animationDelay: '0.1s' }}>
            <span className="block text-white mb-2 text-shadow-lg">开启专属尊享之旅</span>
            <span className="luxury-gradient-text text-5xl md:text-6xl">
              预约您的私人设计师
            </span>
          </h2>

          {/* 副标题 - 柔和色调 */}
          <p className="text-body-xl text-center mb-4 text-white/90 animate-fade-in-up max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
            只需6个问题，3分钟获得专属装修方案
          </p>

          {/* 优势标记 - 白色图标 */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up text-white/80" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="text-sm">米兰设计美学</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="text-sm">0元设计方案</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="text-sm">1对1专属服务</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="text-sm">72小时极速响应</span>
            </div>
          </div>

          {/* CTA按钮 - 极致奢华 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/wizard"
              className="group relative px-12 py-6 bg-white text-primary-950 radius-lg font-bold text-lg hover:scale-105 transition-all duration-300 shadow-luxury-xl hover:shadow-2xl overflow-hidden inline-flex items-center justify-center gap-3"
            >
              <span className="relative z-10">立即预约专属方案</span>
              <ArrowRightIcon className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="tel:400-888-8888"
              className="liquid-glass-dark px-12 py-6 text-white radius-lg font-semibold text-lg hover:scale-105 transition-all duration-300 border-glow inline-flex items-center justify-center gap-3"
            >
              <PhoneIcon className="w-6 h-6" />
              <span>VIP热线: 400-888-8888</span>
            </a>
          </div>

          {/* 信任标记 - 数字滚动动画 + 奢华装饰 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ transitionDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="liquid-glass radius-lg p-4 md:p-6 hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 luxury-gradient-text break-words">
                    {counters[index]}{stat.suffix}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 font-medium uppercase tracking-wide leading-tight">
                    {stat.label}
                  </div>
                  {/* 底部白色装饰线 */}
                  <div className="mt-3 md:mt-4 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </div>
              </div>
            ))}
          </div>

          {/* 底部信任徽章 */}
          <div className="mt-16 flex justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>ISO9001质量认证</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>中国室内装饰协会会员</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
