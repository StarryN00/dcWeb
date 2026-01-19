'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CaseFormData {
  title: string;
  location: string;
  style: string;
  area: number | string;
  duration: number | string;
  price: number | string;
  images: string;
  description: string;
  testimonial: string;
  foremanName: string;
  foremanPhone: string;
  stage: string;
  featured: boolean;
  status: 'published' | 'draft';
}

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  caseData?: any; // 编辑模式下的案例数据
  mode: 'create' | 'edit';
}

const INITIAL_FORM_DATA: CaseFormData = {
  title: '',
  location: '',
  style: 'modern',
  area: '',
  duration: '',
  price: '',
  images: '',
  description: '',
  testimonial: '',
  foremanName: '',
  foremanPhone: '',
  stage: '完工',
  featured: false,
  status: 'draft',
};

const STYLE_OPTIONS = [
  { value: 'modern', label: '现代' },
  { value: 'nordic', label: '北欧' },
  { value: 'industrial', label: '工业' },
  { value: 'wabisabi', label: '侘寂' },
  { value: 'luxury', label: '轻奢' },
  { value: 'minimalist', label: '极简' },
  { value: 'chinese', label: '中式' },
  { value: 'european', label: '欧式' },
];

const STAGE_OPTIONS = [
  '前期阶段',
  '主体拆改',
  '水电改造',
  '泥瓦施工',
  '木工施工',
  '油漆施工',
  '安装阶段',
  '完工',
];

export default function CaseModal({
  isOpen,
  onClose,
  onSuccess,
  caseData,
  mode,
}: CaseModalProps) {
  const [formData, setFormData] = useState<CaseFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 编辑模式下,填充现有数据
  useEffect(() => {
    if (mode === 'edit' && caseData) {
      setFormData({
        title: caseData.title || '',
        location: caseData.location || '',
        style: caseData.style || 'modern',
        area: caseData.area || '',
        duration: caseData.duration || '',
        price: caseData.price || '',
        images: Array.isArray(caseData.images) ? caseData.images.join('\n') : '',
        description: caseData.description || '',
        testimonial: caseData.testimonial || '',
        foremanName: caseData.foremanName || '',
        foremanPhone: caseData.foremanPhone || '',
        stage: caseData.stage || '完工',
        featured: caseData.featured || false,
        status: caseData.status || 'draft',
      });
    } else if (mode === 'create') {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [mode, caseData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 验证必填字段
      if (
        !formData.title ||
        !formData.location ||
        !formData.area ||
        !formData.duration ||
        !formData.price ||
        !formData.images ||
        !formData.description ||
        !formData.testimonial ||
        !formData.foremanName ||
        !formData.foremanPhone
      ) {
        setError('请填写所有必填字段');
        setIsSubmitting(false);
        return;
      }

      // 处理图片URL (每行一个,或逗号分隔)
      const imageUrls = formData.images
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (imageUrls.length === 0) {
        setError('请至少提供一张图片URL');
        setIsSubmitting(false);
        return;
      }

      // 构建提交数据
      const submitData = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        style: formData.style,
        area: Number(formData.area),
        duration: Number(formData.duration),
        price: Number(formData.price),
        images: imageUrls,
        description: formData.description.trim(),
        testimonial: formData.testimonial.trim(),
        foremanName: formData.foremanName.trim(),
        foremanPhone: formData.foremanPhone.trim(),
        stage: formData.stage,
        featured: formData.featured,
        status: formData.status,
      };

      // 发送请求
      const url = mode === 'create' ? '/api/cases' : `/api/cases/${caseData.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSuccess(); // 刷新列表
        onClose(); // 关闭模态框
        setFormData(INITIAL_FORM_DATA); // 重置表单
      } else {
        setError(result.error || '操作失败,请重试');
      }
    } catch (err) {
      console.error('提交失败:', err);
      setError('网络错误,请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 模态框 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-gradient-to-r from-emerald-50 to-white">
            <h2 className="text-2xl font-bold text-stone-900">
              {mode === 'create' ? '创建案例' : '编辑案例'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-stone-600" />
            </button>
          </div>

          {/* 表单内容 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-900 pb-2 border-b border-stone-200">
                基本信息
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    案例标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="例: 现代极简三居室"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    项目位置 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="例: 杭州·滨江区"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    装修风格 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    {STYLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    装修阶段 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    {STAGE_OPTIONS.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    面积 (㎡) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="120"
                    min="1"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    工期 (天) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="90"
                    min="1"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    总价 (万元) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25.8"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 图片URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">
                图片URL <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-stone-500 mb-2">
                每行一个URL,或使用逗号分隔。支持外部图片链接。
              </p>
              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                rows={4}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                required
              />
            </div>

            {/* 项目描述 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">
                项目描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="详细描述项目特点、设计理念、材料选择等..."
                rows={5}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* 业主感言 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">
                业主感言 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="业主对项目的评价和感受..."
                rows={4}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* 施工信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-900 pb-2 border-b border-stone-200">
                施工信息
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    施工队长 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="foremanName"
                    value={formData.foremanName}
                    onChange={handleChange}
                    placeholder="例: 张师傅"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="foremanPhone"
                    value={formData.foremanPhone}
                    onChange={handleChange}
                    placeholder="13800138000"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 状态设置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-900 pb-2 border-b border-stone-200">
                发布设置
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-stone-700">
                    推荐案例 (首页展示)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    发布状态
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600 border-stone-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-stone-700">草稿</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={formData.status === 'published'}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600 border-stone-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-stone-700">已发布</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-stone-700 hover:bg-stone-200 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  提交中...
                </>
              ) : mode === 'create' ? (
                '创建案例'
              ) : (
                '保存更改'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
