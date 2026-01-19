import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input 组件
 *
 * @param label - 输入框标签
 * @param error - 错误信息
 * @param helperText - 帮助文本
 *
 * @example
 * <Input label="姓名" placeholder="请输入姓名" />
 * <Input label="手机号" type="tel" error="请输入有效的手机号" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full border-2 rounded-lg px-4 py-3',
            'transition-all duration-200',
            'focus:outline-none focus:ring-4',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
              : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-100',
            'disabled:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea 组件
 */
export interface TextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, rows = 4, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full border-2 rounded-lg px-4 py-3',
            'transition-all duration-200',
            'focus:outline-none focus:ring-4',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
              : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-100',
            'disabled:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50',
            'resize-vertical',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
