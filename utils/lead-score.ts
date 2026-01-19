interface LeadData {
  budget: number;   // 预算(万元)
  area: number;     // 面积(㎡)
  timeline: string; // 时间规划
}

/**
 * 计算潜客评分
 * 总分范围: 50-100分
 */
export function calculateLeadScore(lead: LeadData): number {
  let score = 50; // 基础分

  // 1. 预算评分 (最高+30分)
  if (lead.budget >= 50) {
    score += 30;
  } else if (lead.budget >= 30) {
    score += 25;
  } else if (lead.budget >= 20) {
    score += 20;
  } else if (lead.budget >= 10) {
    score += 15;
  } else {
    score += 10;
  }

  // 2. 面积评分 (最高+10分)
  if (lead.area >= 200) {
    score += 10;
  } else if (lead.area >= 150) {
    score += 8;
  } else if (lead.area >= 100) {
    score += 6;
  } else if (lead.area >= 80) {
    score += 4;
  } else {
    score += 2;
  }

  // 3. 时间评分 (最高+10分)
  const timelineScores: Record<string, number> = {
    'within_1_month': 10,
    'within_1_3_months': 7,
    'within_3_6_months': 5,
    'over_6_months': 3,
    'no_plan': 0,
  };
  score += timelineScores[lead.timeline] || 0;

  return Math.min(score, 100); // 最高100分
}

/**
 * 获取评分级别
 */
export function getLeadGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 90) {
    return { grade: 'A', label: 'A级潜客', color: 'emerald' };
  } else if (score >= 75) {
    return { grade: 'B', label: 'B级潜客', color: 'blue' };
  } else if (score >= 60) {
    return { grade: 'C', label: 'C级潜客', color: 'amber' };
  } else {
    return { grade: 'D', label: 'D级潜客', color: 'stone' };
  }
}
