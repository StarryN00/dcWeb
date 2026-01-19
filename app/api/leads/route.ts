import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateLeadScore } from '@/utils/lead-score';

/**
 * GET /api/leads
 * 获取潜客列表 (管理员功能)
 *
 * Query Parameters:
 * - status: 状态筛选 (pending/contacted/scheduled/closed/abandoned)
 * - minScore: 最低评分
 * - maxScore: 最高评分
 * - sortBy: 排序字段 (score/submittedAt)
 * - order: 排序方向 (asc/desc)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 获取筛选参数
    const status = searchParams.get('status');
    const minScore = searchParams.get('minScore');
    const maxScore = searchParams.get('maxScore');
    const sortBy = searchParams.get('sortBy') || 'score';
    const order = searchParams.get('order') || 'desc';

    // 构建查询条件
    const where: any = {};

    // 状态筛选
    if (status) {
      where.status = status;
    }

    // 评分范围筛选
    if (minScore || maxScore) {
      where.score = {};
      if (minScore) where.score.gte = parseInt(minScore);
      if (maxScore) where.score.lte = parseInt(maxScore);
    }

    // 构建排序条件
    const orderBy: any = {};
    if (sortBy === 'score') {
      orderBy.score = order;
    } else if (sortBy === 'submittedAt') {
      orderBy.submittedAt = order;
    } else {
      // 默认按评分降序,然后按提交时间降序
      orderBy.score = 'desc';
    }

    // 查询潜客
    const leads = await prisma.lead.findMany({
      where,
      orderBy: [orderBy, { submittedAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('获取潜客列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取潜客列表失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads
 * 提交潜客信息 (公开接口)
 *
 * Body:
 * - name: string (必需)
 * - phone: string (必需)
 * - propertyType: PropertyType (必需)
 * - area: number (必需)
 * - budget: number (必需)
 * - styles: CaseStyle[] (必需)
 * - stage: RenovationStage (必需)
 * - timeline: Timeline (必需)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    const requiredFields = [
      'name',
      'phone',
      'propertyType',
      'area',
      'budget',
      'styles',
      'stage',
      'timeline',
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必填字段',
          missingFields,
        },
        { status: 400 }
      );
    }

    // 验证数值字段
    if (typeof body.area !== 'number' || body.area <= 0) {
      return NextResponse.json(
        { success: false, error: '面积必须是正数' },
        { status: 400 }
      );
    }

    if (typeof body.budget !== 'number' || body.budget <= 0) {
      return NextResponse.json(
        { success: false, error: '预算必须是正数' },
        { status: 400 }
      );
    }

    // 验证风格数组
    if (!Array.isArray(body.styles) || body.styles.length === 0) {
      return NextResponse.json(
        { success: false, error: '至少需要选择一种风格' },
        { status: 400 }
      );
    }

    // 验证手机号格式(简单验证)
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { success: false, error: '请输入有效的手机号' },
        { status: 400 }
      );
    }

    // 计算潜客评分
    const score = calculateLeadScore({
      budget: body.budget,
      area: body.area,
      timeline: body.timeline,
    });

    // 创建潜客记录
    const newLead = await prisma.lead.create({
      data: {
        name: body.name,
        phone: body.phone,
        propertyType: body.propertyType,
        area: body.area,
        budget: body.budget,
        styles: body.styles,
        stage: body.stage,
        timeline: body.timeline,
        score,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: '提交成功,我们会尽快与您联系',
        data: newLead,
        score,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('提交潜客信息失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '提交失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
