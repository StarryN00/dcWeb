import Link from 'next/link';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: '首页' },
    { href: '/cases', label: '案例展示' },
    { href: '/wizard', label: '免费咨询' },
  ];

  const services = [
    { label: '专业设计' },
    { label: '精工施工' },
    { label: '透明监理' },
    { label: '贴心保障' },
  ];

  const contactInfo = [
    {
      icon: PhoneIcon,
      label: '联系电话',
      value: '400-888-8888',
      href: 'tel:400-888-8888',
    },
    {
      icon: EnvelopeIcon,
      label: '电子邮箱',
      value: 'contact@dcweb.com',
      href: 'mailto:contact@dcweb.com',
    },
    {
      icon: MapPinIcon,
      label: '公司地址',
      value: '上海市浦东新区世纪大道XXX号',
    },
    {
      icon: ClockIcon,
      label: '工作时间',
      value: '周一至周日 9:00-18:00',
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-neutral-300">
      {/* 主要内容区 */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* 公司信息 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">梦</span>
              </div>
              <span className="text-xl font-bold text-white">梦想家装饰</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              专注于为客户提供高品质的装修设计与施工服务,
              以极简主义设计理念打造理想居住空间。
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="微信"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.5 9.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="微博"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="抖音"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 快捷链接 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">快捷导航</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-primary-500 transition-colors inline-flex items-center group"
                  >
                    <span className="mr-2 text-primary-600 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold text-white mb-4 mt-8">
              我们的服务
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <span className="text-neutral-400 inline-flex items-center">
                    <span className="mr-2 text-primary-600">✓</span>
                    {service.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系方式 */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">联系我们</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((contact) => (
                <div key={contact.label} className="space-y-1">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <contact.icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span>{contact.label}</span>
                  </div>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-white hover:text-primary-500 transition-colors block pl-7"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-white pl-7">{contact.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* 地图或二维码区域 */}
            <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
              <p className="text-sm text-neutral-400 mb-2">扫码关注我们</p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-xs text-neutral-500 text-center p-2">
                    微信公众号
                    <br />
                    二维码
                  </span>
                </div>
                <div className="flex-1 text-sm text-neutral-400">
                  <p>关注我们的公众号,获取:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• 最新装修案例</li>
                    <li>• 装修知识分享</li>
                    <li>• 独家优惠活动</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="border-t border-neutral-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <p>
              © {currentYear} 梦想家装饰. 保留所有权利.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="hover:text-primary-500 transition-colors"
              >
                隐私政策
              </Link>
              <Link
                href="#"
                className="hover:text-primary-500 transition-colors"
              >
                服务条款
              </Link>
              <Link
                href="#"
                className="hover:text-primary-500 transition-colors"
              >
                网站地图
              </Link>
            </div>
          </div>
          <p className="text-center md:text-left text-xs text-neutral-600 mt-2">
            沪ICP备XXXXXXXX号 | 增值电信业务经营许可证: 沪B2-XXXXXXXX
          </p>
        </div>
      </div>
    </footer>
  );
}
