'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

/**
 * Select 组件
 *
 * @param label - 选择框标签
 * @param value - 当前选中的值
 * @param onChange - 值改变时的回调函数
 * @param options - 选项列表
 * @param placeholder - 占位文本
 * @param error - 错误信息
 *
 * @example
 * <Select
 *   label="装修风格"
 *   value={style}
 *   onChange={setStyle}
 *   options={[
 *     { value: 'modern', label: '现代' },
 *     { value: 'nordic', label: '北欧' },
 *   ]}
 * />
 */
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = '请选择',
  error,
  disabled = false,
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              'relative w-full cursor-default rounded-lg',
              'border-2 bg-white py-3 pl-4 pr-10 text-left',
              'focus:outline-none focus:ring-4',
              'transition-all duration-200',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-100',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className={cn('block truncate', !selectedOption && 'text-stone-400')}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-stone-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    cn(
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                      active ? 'bg-emerald-100 text-emerald-900' : 'text-stone-900'
                    )
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={cn(
                          'block truncate',
                          selected ? 'font-semibold' : 'font-normal'
                        )}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
