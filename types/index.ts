// 案例风格类型
export type CaseStyle = 'modern' | 'nordic' | 'industrial' | 'wabisabi' | 'luxury' | 'minimalist' | 'chinese' | 'european';

// 物业类型
export type PropertyType = 'residential' | 'apartment' | 'villa' | 'commercial' | 'other';

// 装修阶段
export type RenovationStage = 'design_only' | 'design_construction' | 'construction_only' | 'supervision_only';

// 时间规划
export type Timeline = 'within_1_month' | 'within_1_3_months' | 'within_3_6_months' | 'over_6_months' | 'no_plan';

// 案例状态
export type CaseStatus = 'published' | 'draft';

// 潜客状态
export type LeadStatus = 'pending' | 'contacted' | 'scheduled' | 'closed' | 'abandoned';

// 案例数据接口
export interface CaseData {
  id: string;
  title: string;
  location: string;
  style: CaseStyle;
  area: number;
  duration: number;
  price: number;
  images: string[];
  description: string;
  testimonial: string;
  foremanName: string;
  foremanPhone: string;
  stage: string;
  featured: boolean;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 潜客数据接口
export interface LeadData {
  id: string;
  name: string;
  phone: string;
  propertyType: PropertyType;
  area: number;
  budget: number;
  styles: CaseStyle[];
  stage: RenovationStage;
  timeline: Timeline;
  score: number;
  status: LeadStatus;
  submittedAt: Date;
  updatedAt: Date;
}

// 风格中文名称映射
export const StyleLabels: Record<CaseStyle, string> = {
  modern: '现代',
  nordic: '北欧',
  industrial: '工业',
  wabisabi: '侘寂',
  luxury: '轻奢',
  minimalist: '极简',
  chinese: '中式',
  european: '欧式',
};

// 物业类型中文名称映射
export const PropertyTypeLabels: Record<PropertyType, string> = {
  residential: '住宅',
  apartment: '公寓',
  villa: '别墅',
  commercial: '商业空间',
  other: '其他',
};

// 装修阶段中文名称映射
export const RenovationStageLabels: Record<RenovationStage, string> = {
  design_only: '仅设计',
  design_construction: '设计+施工',
  construction_only: '仅施工',
  supervision_only: '仅监理',
};

// 时间规划中文名称映射
export const TimelineLabels: Record<Timeline, string> = {
  within_1_month: '1个月内',
  within_1_3_months: '1-3个月',
  within_3_6_months: '3-6个月',
  over_6_months: '6个月以上',
  no_plan: '暂无计划',
};

// 潜客状态中文名称映射
export const LeadStatusLabels: Record<LeadStatus, string> = {
  pending: '待跟进',
  contacted: '已联系',
  scheduled: '已预约',
  closed: '已成交',
  abandoned: '已放弃',
};
