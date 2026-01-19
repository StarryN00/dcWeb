import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/cases/[id]
 * 获取单个案例详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseItem = await prisma.case.findUnique({
      where: { id },
    });

    if (!caseItem) {
      return NextResponse.json(
        {
          success: false,
          error: '案例不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: caseItem,
    });
  } catch (error) {
    console.error('获取案例详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取案例详情失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cases/[id]
 * 更新案例
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 检查案例是否存在
    const existingCase = await prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return NextResponse.json(
        {
          success: false,
          error: '案例不存在',
        },
        { status: 404 }
      );
    }

    // 验证数值字段（如果提供）
    if (body.area !== undefined && (typeof body.area !== 'number' || body.area <= 0)) {
      return NextResponse.json(
        { success: false, error: '面积必须是正数' },
        { status: 400 }
      );
    }

    if (body.duration !== undefined && (typeof body.duration !== 'number' || body.duration <= 0)) {
      return NextResponse.json(
        { success: false, error: '工期必须是正数' },
        { status: 400 }
      );
    }

    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
      return NextResponse.json(
        { success: false, error: '价格必须是正数' },
        { status: 400 }
      );
    }

    // 验证图片数组（如果提供）
    if (body.images !== undefined && (!Array.isArray(body.images) || body.images.length === 0)) {
      return NextResponse.json(
        { success: false, error: '至少需要一张图片' },
        { status: 400 }
      );
    }

    // 更新案例
    const updatedCase = await prisma.case.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      message: '案例更新成功',
      data: updatedCase,
    });
  } catch (error) {
    console.error('更新案例失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新案例失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cases/[id]
 * 删除案例
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查案例是否存在
    const existingCase = await prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return NextResponse.json(
        {
          success: false,
          error: '案例不存在',
        },
        { status: 404 }
      );
    }

    // 删除案例
    await prisma.case.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '案例删除成功',
    });
  } catch (error) {
    console.error('删除案例失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除案例失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
