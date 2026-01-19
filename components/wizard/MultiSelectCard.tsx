'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { CircleStackIcon } from '@heroicons/react/24/outline';

interface MultiSelectCardProps {
  value: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function MultiSelectCard({
  value,
  label,
  selected,
  onClick,
}: MultiSelectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full p-4 radius-md border-2 transition-all duration-300 ${
        selected
          ? 'border-primary-600 bg-primary-50 shadow-elevation-2'
          : 'border-neutral-300 glass-card-light hover:border-primary-400'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* 复选框图标 */}
        <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
          selected
            ? 'border-primary-600 bg-primary-600'
            : 'border-neutral-300 bg-white'
        }`}>
          {selected && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* 标签 */}
        <span className={`font-semibold ${
          selected ? 'text-primary-700' : 'text-neutral-700'
        }`}>
          {label}
        </span>
      </div>
    </button>
  );
}
