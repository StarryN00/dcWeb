'use client';

import { ReactNode } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface WizardStepProps {
  title: string;
  description?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  nextButtonText?: string;
}

export function WizardStep({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  canGoNext,
  nextButtonText,
}: WizardStepProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-heading-2 text-neutral-900 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* 内容 */}
      <div className="max-w-4xl mx-auto">
        {children}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center max-w-4xl mx-auto pt-8">
        <button
          onClick={onPrev}
          disabled={currentStep === 1}
          className={`inline-flex items-center gap-2 px-6 py-3 radius-md font-semibold transition-all ${
            currentStep === 1
              ? 'text-neutral-400 cursor-not-allowed'
              : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
          }`}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          上一步
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`inline-flex items-center gap-2 px-8 py-3 radius-md font-semibold transition-all ${
            canGoNext
              ? 'btn-primary-real-estate'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
          }`}
        >
          {nextButtonText || (isLastStep ? '提交' : '下一步')}
          {!isLastStep && <ArrowRightIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* 提示文字 */}
      {!canGoNext && (
        <p className="text-center text-sm text-neutral-500 mt-4">
          请完成当前步骤后继续
        </p>
      )}
    </div>
  );
}
