/**
 * 将数据导出为CSV文件
 */

interface Lead {
  id: string;
  name: string;
  phone: string;
  propertyType: string;
  area: number;
  budget: number;
  styles: string[];
  stage: string;
  timeline: string;
  score: number;
  status: string;
  submittedAt: string;
}

// 中文映射
const PROPERTY_TYPE_MAP: Record<string, string> = {
  residential: '住宅',
  apartment: '公寓',
  villa: '别墅',
  commercial: '商业空间',
  other: '其他',
};

const RENOVATION_STAGE_MAP: Record<string, string> = {
  design_only: '仅设计',
  design_construction: '设计+施工',
  construction_only: '仅施工',
  supervision_only: '仅监理',
};

const TIMELINE_MAP: Record<string, string> = {
  within_1_month: '1个月内',
  within_1_3_months: '1-3个月',
  within_3_6_months: '3-6个月',
  over_6_months: '6个月以上',
  no_plan: '暂无计划',
};

const LEAD_STATUS_MAP: Record<string, string> = {
  pending: '待跟进',
  contacted: '已联系',
  scheduled: '已预约',
  closed: '已成交',
  abandoned: '已放弃',
};

const STYLE_MAP: Record<string, string> = {
  modern: '现代',
  nordic: '北欧',
  industrial: '工业',
  wabisabi: '侘寂',
  luxury: '轻奢',
  minimalist: '极简',
  chinese: '中式',
  european: '欧式',
};

/**
 * 将潜客数据导出为CSV
 */
export function exportLeadsToCSV(leads: Lead[], filename: string = 'leads.csv') {
  // CSV 表头
  const headers = [
    '潜客ID',
    '姓名',
    '电话',
    '物业类型',
    '面积(㎡)',
    '预算(万元)',
    '风格偏好',
    '服务类型',
    '时间规划',
    '评分',
    '状态',
    '提交时间',
  ];

  // 转换数据行
  const rows = leads.map((lead) => {
    const styles = lead.styles.map((s) => STYLE_MAP[s] || s).join('、');
    const submittedDate = new Date(lead.submittedAt).toLocaleString('zh-CN');

    return [
      lead.id,
      lead.name,
      lead.phone,
      PROPERTY_TYPE_MAP[lead.propertyType] || lead.propertyType,
      lead.area.toString(),
      lead.budget.toString(),
      styles,
      RENOVATION_STAGE_MAP[lead.stage] || lead.stage,
      TIMELINE_MAP[lead.timeline] || lead.timeline,
      lead.score.toString(),
      LEAD_STATUS_MAP[lead.status] || lead.status,
      submittedDate,
    ];
  });

  // 构建 CSV 内容
  const csvContent = [
    headers.join(','), // 表头
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ), // 数据行 (转义引号)
  ].join('\n');

  // 添加 UTF-8 BOM (让Excel正确识别中文)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  // 创建下载链接
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * 生成带时间戳的文件名
 */
export function generateFilename(prefix: string = 'leads'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${prefix}_${year}${month}${day}_${hours}${minutes}.csv`;
}
