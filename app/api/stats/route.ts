import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/stats
 * 获取管理后台统计数据
 *
 * 返回数据:
 * - totalCases: 总案例数
 * - publishedCases: 已发布案例数
 * - draftCases: 草稿案例数
 * - featuredCases: 推荐案例数
 * - totalLeads: 总潜客数
 * - highScoreLeads: 高分潜客数 (≥90分)
 * - pendingLeads: 待跟进潜客数
 * - scheduledLeads: 已预约潜客数
 * - closedLeads: 已成交潜客数
 * - conversionRate: 转化率 (已成交/总潜客)
 * - averageLeadScore: 平均潜客评分
 */
export async function GET() {
  try {
    // 并发查询所有统计数据
    const [
      totalCases,
      publishedCases,
      draftCases,
      featuredCases,
      totalLeads,
      highScoreLeads,
      leadsByStatus,
      averageScoreResult,
    ] = await Promise.all([
      // 案例统计
      prisma.case.count(),
      prisma.case.count({ where: { status: 'published' } }),
      prisma.case.count({ where: { status: 'draft' } }),
      prisma.case.count({ where: { featured: true } }),

      // 潜客统计
      prisma.lead.count(),
      prisma.lead.count({ where: { score: { gte: 90 } } }),

      // 按状态分组的潜客数
      prisma.lead.groupBy({
        by: ['status'],
        _count: true,
      }),

      // 平均潜客评分
      prisma.lead.aggregate({
        _avg: { score: true },
      }),
    ]);

    // 提取各状态的潜客数
    const getLeadCountByStatus = (status: string) => {
      const found = leadsByStatus.find((item) => item.status === status);
      return found ? found._count : 0;
    };

    const pendingLeads = getLeadCountByStatus('pending');
    const scheduledLeads = getLeadCountByStatus('scheduled');
    const closedLeads = getLeadCountByStatus('closed');

    // 计算转化率 (已成交 / 总潜客)
    const conversionRate =
      totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : '0.0';

    // 平均潜客评分
    const averageLeadScore = averageScoreResult._avg.score
      ? Math.round(averageScoreResult._avg.score)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        // 案例统计
        totalCases,
        publishedCases,
        draftCases,
        featuredCases,

        // 潜客统计
        totalLeads,
        highScoreLeads, // A级潜客 (≥90分)
        pendingLeads, // 待跟进
        scheduledLeads, // 已预约
        closedLeads, // 已成交

        // 综合指标
        conversionRate: `${conversionRate}%`, // 转化率
        averageLeadScore, // 平均评分
      },
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取统计数据失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
