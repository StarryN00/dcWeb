'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface OptionCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({
  value,
  label,
  description,
  icon,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-6 radius-lg border-2 transition-all duration-300 ${
        selected
          ? 'border-primary-600 bg-primary-50 shadow-elevation-2'
          : 'border-neutral-300 glass-card-light hover:border-primary-400 hover:shadow-elevation-2'
      }`}
    >
      {/* 图标 */}
      {icon && (
        <div className={`w-12 h-12 radius-md flex items-center justify-center mb-4 transition-colors ${
          selected ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'
        }`}>
          {icon}
        </div>
      )}

      {/* 标题 */}
      <h3 className="text-body-lg font-bold text-neutral-900 mb-2">{label}</h3>

      {/* 描述 */}
      {description && (
        <p className="text-sm text-neutral-600">{description}</p>
      )}

      {/* 选中标记 */}
      {selected && (
        <div className="absolute top-4 right-4">
          <CheckCircleIcon className="w-6 h-6 text-primary-600" />
        </div>
      )}
    </button>
  );
}
