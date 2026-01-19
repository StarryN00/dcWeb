'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PencilSquareIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    icon: PencilSquareIcon,
    title: '尊享设计',
    subtitle: 'Exclusive Design',
    description: '米兰设计周首席设计师坐镇，每一个空间都是独一无二的艺术品',
    features: ['米兰设计美学', '私人定制方案', '3D沉浸预览'],
    color: 'from-white/20 to-white/5',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: '匠心工艺',
    subtitle: 'Master Craftsmanship',
    description: '德系精工标准，每道工序都经过严格把控，品质超越期待',
    features: ['德系工艺标准', '环保A+材料', '零误差施工'],
    color: 'from-rose-600/20 to-rose-600/5',
  },
  {
    icon: EyeIcon,
    title: '智能监理',
    subtitle: 'Smart Supervision',
    description: 'AI+人工双重监控，施工进度与质量尽在掌握，让您更安心',
    features: ['24小时监控', '智能质检系统', '实时进度推送'],
    color: 'from-white/20 to-white/5',
  },
  {
    icon: ShieldCheckIcon,
    title: '终身保障',
    subtitle: 'Lifetime Warranty',
    description: '超越行业的2年质保承诺，终身VIP维护服务，无后顾之忧',
    features: ['2年质保承诺', '终身VIP维护', '1小时响应'],
    color: 'from-rose-600/20 to-rose-600/5',
  },
];

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing bg-gradient-to-b from-neutral-950 to-primary-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto container-padding relative z-10">
        {/* 标题区域 */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <span className="luxury-gradient-text text-sm font-bold tracking-widest uppercase">
              BRAND VALUES
            </span>
          </div>
          <h2 className="text-heading-1 text-white mb-6">
            <span className="block mb-2">为什么选择我们</span>
            <span className="luxury-gradient-text">四大核心价值</span>
          </h2>
          <p className="text-body-lg text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            以极致品质与专业服务，为您打造梦想中的理想家居
          </p>
        </div>

        {/* 服务卡片 - 奢华设计 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`luxury-card liquid-glass-dark radius-lg card-padding transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* 渐变背景装饰 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} radius-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* 内容 */}
                <div className="relative z-10">
                  {/* 图标容器 - 白色高光 */}
                  <div className="relative w-16 h-16 mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-rose-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-xl" />
                    <div className="relative w-full h-full border border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* 标题 */}
                  <div className="mb-4">
                    <h3 className="text-heading-4 text-white mb-1 font-bold">
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/90 font-semibold uppercase tracking-wider">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* 描述 */}
                  <p className="text-body-sm text-white/80 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* 特色标签 - 白色点缀 */}
                  <div className="space-y-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-white/90"
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 序号装饰 - 精致水印 */}
                <div className="absolute top-6 right-6 text-7xl font-black text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-500 pointer-events-none drop-shadow-lg">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部装饰线 */}
        <div className="mt-20 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
        </div>
      </div>
    </section>
  );
}
