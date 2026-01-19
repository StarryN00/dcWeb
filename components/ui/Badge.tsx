import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

/**
 * Badge 组件
 *
 * @param variant - 徽章变体: default, success, warning, error, info
 * @param size - 徽章尺寸: sm, md, lg
 *
 * @example
 * <Badge variant="success">已发布</Badge>
 * <Badge variant="warning" size="sm">待审核</Badge>
 */
export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-stone-100 text-stone-800 border-stone-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-full font-semibold border',
        'transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * ScoreBadge 组件 - 专门用于潜客评分显示
 */
export interface ScoreBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  score: number;
  showGrade?: boolean;
}

export function ScoreBadge({
  score,
  showGrade = true,
  className,
  ...props
}: ScoreBadgeProps) {
  // 根据评分确定等级和颜色
  let variant: BadgeProps['variant'] = 'default';
  let grade = '';

  if (score >= 90) {
    variant = 'success';
    grade = 'A';
  } else if (score >= 75) {
    variant = 'info';
    grade = 'B';
  } else if (score >= 60) {
    variant = 'warning';
    grade = 'C';
  } else {
    variant = 'default';
    grade = 'D';
  }

  return (
    <Badge variant={variant} className={className} {...props}>
      {score}分 {showGrade && `(${grade}级)`}
    </Badge>
  );
}

/**
 * StatusBadge 组件 - 专门用于状态显示
 */
export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: 'published' | 'draft' | 'pending' | 'contacted' | 'scheduled' | 'closed' | 'abandoned';
}

export function StatusBadge({
  status,
  className,
  ...props
}: StatusBadgeProps) {
  const statusConfig: Record<
    StatusBadgeProps['status'],
    { label: string; variant: BadgeProps['variant'] }
  > = {
    published: { label: '已发布', variant: 'success' },
    draft: { label: '草稿', variant: 'default' },
    pending: { label: '待跟进', variant: 'warning' },
    contacted: { label: '已联系', variant: 'info' },
    scheduled: { label: '已预约', variant: 'info' },
    closed: { label: '已成交', variant: 'success' },
    abandoned: { label: '已放弃', variant: 'error' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.label}
    </Badge>
  );
}
