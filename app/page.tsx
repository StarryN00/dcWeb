import {
  HeroSection,
  ServicesSection,
  FeaturedCasesSection,
  CTASection,
} from '@/components/home';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero 区域 */}
      <HeroSection />

      {/* 服务介绍 */}
      <ServicesSection />

      {/* 精选案例 */}
      <FeaturedCasesSection />

      {/* CTA 行动号召 */}
      <CTASection />
    </main>
  );
}
