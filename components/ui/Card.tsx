import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'glass';
  hoverable?: boolean;
  children: ReactNode;
}

/**
 * Card 组件
 *
 * @param variant - 卡片变体: standard (标准), glass (毛玻璃)
 * @param hoverable - 是否启用悬停效果
 *
 * @example
 * <Card variant="standard" hoverable>
 *   <h3>卡片标题</h3>
 *   <p>卡片内容</p>
 * </Card>
 */
export function Card({
  variant = 'standard',
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    standard: 'bg-stone-100 shadow-sm',
    glass: 'backdrop-blur-md bg-white/70 border border-stone-200',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-300',
        variants[variant],
        hoverable && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader 组件
 */
export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardTitle 组件
 */
export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xl font-bold text-stone-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * CardContent 组件
 */
export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-stone-600', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter 组件
 */
export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-stone-200', className)} {...props}>
      {children}
    </div>
  );
}
