import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/cases
 * 获取案例列表
 *
 * Query Parameters:
 * - style: 装修风格筛选
 * - minArea: 最小面积
 * - maxArea: 最大面积
 * - minPrice: 最小价格
 * - maxPrice: 最大价格
 * - status: 状态筛选 (默认只返回 published)
 * - featured: 是否只返回推荐案例
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 获取筛选参数
    const style = searchParams.get('style');
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const includeAll = searchParams.get('includeAll'); // 管理后台使用

    // 构建查询条件
    const where: any = {};

    // 默认只返回已发布的案例（除非明确指定状态或 includeAll）
    if (status) {
      where.status = status;
    } else if (!includeAll) {
      where.status = 'published';
    }

    // 风格筛选
    if (style) {
      where.style = style;
    }

    // 面积范围筛选
    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseInt(minArea);
      if (maxArea) where.area.lte = parseInt(maxArea);
    }

    // 价格范围筛选
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // 推荐筛选
    if (featured === 'true') {
      where.featured = true;
    }

    // 查询案例
    const cases = await prisma.case.findMany({
      where,
      orderBy: [
        { featured: 'desc' }, // 推荐案例优先
        { createdAt: 'desc' }, // 然后按创建时间倒序
      ],
    });

    return NextResponse.json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    console.error('获取案例列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取案例列表失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cases
 * 创建新案例
 *
 * Body:
 * - title: string (必需)
 * - location: string (必需)
 * - style: CaseStyle (必需)
 * - area: number (必需)
 * - duration: number (必需)
 * - price: number (必需)
 * - images: string[] (必需)
 * - description: string (必需)
 * - testimonial: string (必需)
 * - foremanName: string (必需)
 * - foremanPhone: string (必需)
 * - stage: string (必需)
 * - featured: boolean (可选，默认 false)
 * - status: 'published' | 'draft' (可选，默认 'draft')
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    const requiredFields = [
      'title',
      'location',
      'style',
      'area',
      'duration',
      'price',
      'images',
      'description',
      'testimonial',
      'foremanName',
      'foremanPhone',
      'stage',
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

    if (typeof body.duration !== 'number' || body.duration <= 0) {
      return NextResponse.json(
        { success: false, error: '工期必须是正数' },
        { status: 400 }
      );
    }

    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { success: false, error: '价格必须是正数' },
        { status: 400 }
      );
    }

    // 验证图片数组
    if (!Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json(
        { success: false, error: '至少需要一张图片' },
        { status: 400 }
      );
    }

    // 创建案例
    const newCase = await prisma.case.create({
      data: {
        title: body.title,
        location: body.location,
        style: body.style,
        area: body.area,
        duration: body.duration,
        price: body.price,
        images: body.images,
        description: body.description,
        testimonial: body.testimonial,
        foremanName: body.foremanName,
        foremanPhone: body.foremanPhone,
        stage: body.stage,
        featured: body.featured || false,
        status: body.status || 'draft',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: '案例创建成功',
        data: newCase,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建案例失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建案例失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
