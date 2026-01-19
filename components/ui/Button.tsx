import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

/**
 * Button 组件
 *
 * @param variant - 按钮变体: primary (主要), secondary (次要), outline (轮廓), ghost (幽灵)
 * @param size - 按钮尺寸: sm (小), md (中), lg (大)
 * @param loading - 加载状态
 * @param disabled - 禁用状态
 *
 * @example
 * <Button variant="primary" size="md">提交</Button>
 * <Button variant="outline" loading>加载中...</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-lg',
    secondary: 'bg-stone-200 text-stone-900 hover:bg-stone-300',
    outline: 'border-2 border-stone-300 text-stone-800 hover:bg-stone-50 hover:border-stone-400',
    ghost: 'text-stone-700 hover:bg-stone-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:-translate-y-0.5 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-emerald-100',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          加载中...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
