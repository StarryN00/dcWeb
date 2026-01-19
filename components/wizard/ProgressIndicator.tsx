'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* 进度条 */}
      <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 步骤指示 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
            {currentStep}
          </div>
          <span className="text-neutral-700 font-semibold">
            第 {currentStep} 步 / 共 {totalSteps} 步
          </span>
        </div>
        <span className="text-primary-600 font-bold">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
