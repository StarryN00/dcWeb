'use client';

import { useState } from 'react';
import {
  ProgressIndicator,
  OptionCard,
  MultiSelectCard,
  WizardStep,
  SuccessPage,
} from '@/components/wizard';
import { Input } from '@/components/ui';
import {
  HomeIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PaintBrushIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// 表单数据类型
interface FormData {
  name: string;
  phone: string;
  propertyType: string;
  area: string;
  budget: string;
  styles: string[];
  stage: string;
  timeline: string;
}

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    propertyType: '',
    area: '',
    budget: '',
    styles: [],
    stage: '',
    timeline: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [leadId, setLeadId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 6;

  // 验证当前步骤
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyType !== '';
      case 2:
        return formData.area !== '' && Number(formData.area) > 0;
      case 3:
        return formData.budget !== '' && Number(formData.budget) > 0;
      case 4:
        return formData.styles.length > 0;
      case 5:
        return formData.stage !== '';
      case 6:
        return (
          formData.timeline !== '' &&
          formData.name.trim() !== '' &&
          formData.phone.trim() !== '' &&
          /^1[3-9]\d{9}$/.test(formData.phone)
        );
      default:
        return false;
    }
  };

  // 下一步
  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 最后一步,提交表单
      await handleSubmit();
    }
  };

  // 上一步
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          propertyType: formData.propertyType,
          area: Number(formData.area),
          budget: Number(formData.budget),
          styles: formData.styles,
          stage: formData.stage,
          timeline: formData.timeline,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setScore(data.score);
        setLeadId(data.data.id);
        setSubmitted(true);
      } else {
        alert(data.error || '提交失败,请稍后重试');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败,请稍后重试');
    }
  };

  // 更新表单数据
  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData({ ...formData, [key]: value });
    // 清除错误
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  // 切换风格选择
  const toggleStyle = (style: string) => {
    const newStyles = formData.styles.includes(style)
      ? formData.styles.filter((s) => s !== style)
      : [...formData.styles, style];
    updateFormData('styles', newStyles);
  };

  // 如果已提交,显示成功页面
  if (submitted) {
    return <SuccessPage score={score} leadId={leadId} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-100 py-12 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-tr from-accent-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(12,74,110,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(12,74,110,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* 进度指示器 */}
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* 步骤 1: 物业类型 */}
        {currentStep === 1 && (
          <WizardStep
            title="您的物业类型是？"
            description="选择您需要装修的房屋类型"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={canGoNext()}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <OptionCard
                value="residence"
                label="住宅"
                description="普通住宅、商品房"
                icon={<HomeIcon className="w-6 h-6" />}
                selected={formData.propertyType === 'residence'}
                onClick={() => updateFormData('propertyType', 'residence')}
              />
              <OptionCard
                value="apartment"
                label="公寓"
                description="单身公寓、小户型"
                icon={<CubeIcon className="w-6 h-6" />}
                selected={formData.propertyType === 'apartment'}
                onClick={() => updateFormData('propertyType', 'apartment')}
              />
              <OptionCard
                value="villa"
                label="别墅"
                description="独栋别墅、联排别墅"
                icon={<HomeIcon className="w-6 h-6" />}
                selected={formData.propertyType === 'villa'}
                onClick={() => updateFormData('propertyType', 'villa')}
              />
              <OptionCard
                value="commercial"
                label="商业空间"
                description="办公室、店铺等"
                icon={<CubeIcon className="w-6 h-6" />}
                selected={formData.propertyType === 'commercial'}
                onClick={() => updateFormData('propertyType', 'commercial')}
              />
            </div>
          </WizardStep>
        )}

        {/* 步骤 2: 房屋面积 */}
        {currentStep === 2 && (
          <WizardStep
            title="房屋面积多大？"
            description="请输入您的房屋建筑面积（平方米）"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={canGoNext()}
          >
            <div className="max-w-md mx-auto">
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => updateFormData('area', e.target.value)}
                placeholder="例如: 120"
                className="text-center text-2xl py-6"
                min="1"
              />
              <p className="text-center text-stone-500 mt-4">㎡</p>

              {/* 快捷选择 */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {['80', '100', '120', '150', '180', '200'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFormData('area', size)}
                    className={`py-3 radius-md border-2 font-semibold transition-all ${
                      formData.area === size
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-neutral-300 text-neutral-700 hover:border-primary-300 hover:bg-primary-50/30'
                    }`}
                  >
                    {size}㎡
                  </button>
                ))}
              </div>
            </div>
          </WizardStep>
        )}

        {/* 步骤 3: 装修预算 */}
        {currentStep === 3 && (
          <WizardStep
            title="您的装修预算？"
            description="请输入您的预算范围（万元）"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={canGoNext()}
          >
            <div className="max-w-md mx-auto">
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => updateFormData('budget', e.target.value)}
                placeholder="例如: 25"
                className="text-center text-2xl py-6"
                min="1"
              />
              <p className="text-center text-stone-500 mt-4">万元</p>

              {/* 快捷选择 */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {['15', '25', '35', '50', '70', '100'].map((budget) => (
                  <button
                    key={budget}
                    onClick={() => updateFormData('budget', budget)}
                    className={`py-3 radius-md border-2 font-semibold transition-all ${
                      formData.budget === budget
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-neutral-300 text-neutral-700 hover:border-primary-300 hover:bg-primary-50/30'
                    }`}
                  >
                    {budget}万
                  </button>
                ))}
              </div>
            </div>
          </WizardStep>
        )}

        {/* 步骤 4: 装修风格 */}
        {currentStep === 4 && (
          <WizardStep
            title="喜欢的装修风格？"
            description="可以选择多个风格（至少选择1个）"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={canGoNext()}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { value: 'modern', label: '现代' },
                { value: 'nordic', label: '北欧' },
                { value: 'industrial', label: '工业' },
                { value: 'wabi_sabi', label: '侘寂' },
                { value: 'luxury', label: '轻奢' },
                { value: 'minimalist', label: '极简' },
                { value: 'chinese', label: '中式' },
                { value: 'european', label: '欧式' },
              ].map((style) => (
                <MultiSelectCard
                  key={style.value}
                  value={style.value}
                  label={style.label}
                  selected={formData.styles.includes(style.value)}
                  onClick={() => toggleStyle(style.value)}
                />
              ))}
            </div>
            <p className="text-center text-neutral-500 text-sm mt-4">
              已选择 {formData.styles.length} 个风格
            </p>
          </WizardStep>
        )}

        {/* 步骤 5: 装修阶段 */}
        {currentStep === 5 && (
          <WizardStep
            title="您需要什么服务？"
            description="选择您需要的装修服务类型"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={canGoNext()}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <OptionCard
                value="design_only"
                label="仅设计"
                description="只需要设计方案，不需要施工"
                icon={<PaintBrushIcon className="w-6 h-6" />}
                selected={formData.stage === 'design_only'}
                onClick={() => updateFormData('stage', 'design_only')}
              />
              <OptionCard
                value="design_and_construction"
                label="设计+施工"
                description="从设计到施工一站式服务"
                icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
                selected={formData.stage === 'design_and_construction'}
                onClick={() => updateFormData('stage', 'design_and_construction')}
              />
              <OptionCard
                value="construction_only"
                label="仅施工"
                description="已有设计方案，只需要施工"
                icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
                selected={formData.stage === 'construction_only'}
                onClick={() => updateFormData('stage', 'construction_only')}
              />
              <OptionCard
                value="supervision_only"
                label="仅监理"
                description="需要专业监理服务"
                icon={<ClockIcon className="w-6 h-6" />}
                selected={formData.stage === 'supervision_only'}
                onClick={() => updateFormData('stage', 'supervision_only')}
              />
            </div>
          </WizardStep>
        )}

        {/* 步骤 6: 时间规划和联系方式 */}
        {currentStep === 6 && (
          <WizardStep
            title="最后一步！"
            description="请留下您的联系方式，我们会尽快与您联系"
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoNext={canGoNext()}
            nextButtonText="提交需求"
          >
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* 时间规划 */}
              <div>
                <label className="block text-body-lg font-bold text-neutral-900 mb-4">
                  您的时间规划
                </label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { value: 'within_1_month', label: '1个月内' },
                    { value: '1_to_3_months', label: '1-3个月' },
                    { value: '3_to_6_months', label: '3-6个月' },
                    { value: 'over_6_months', label: '6个月以上' },
                    { value: 'no_plan', label: '暂无计划' },
                  ].map((timeline) => (
                    <button
                      key={timeline.value}
                      onClick={() => updateFormData('timeline', timeline.value)}
                      className={`py-3 radius-md border-2 font-semibold transition-all ${
                        formData.timeline === timeline.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-neutral-300 text-neutral-700 hover:border-primary-300 hover:bg-primary-50/30'
                      }`}
                    >
                      {timeline.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 联系方式 */}
              <div className="glass-card-light radius-lg p-6 shadow-elevation-2">
                <h3 className="text-body-lg font-bold text-neutral-900 mb-4">
                  您的联系方式
                </h3>
                <div className="space-y-4">
                  <Input
                    label="您的姓名"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="请输入您的姓名"
                    required
                  />
                  <Input
                    label="手机号码"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="请输入11位手机号"
                    error={
                      formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)
                        ? '请输入有效的11位手机号'
                        : ''
                    }
                    required
                  />
                </div>
              </div>

              {/* 隐私声明 */}
              <p className="text-sm text-neutral-600 text-center">
                提交即表示您同意我们的
                <a href="#" className="text-primary-600 hover:underline font-medium">
                  隐私政策
                </a>
                ，我们将严格保护您的个人信息
              </p>
            </div>
          </WizardStep>
        )}
      </div>
    </main>
  );
}
