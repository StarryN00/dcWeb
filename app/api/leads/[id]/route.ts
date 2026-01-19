import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/leads/[id]
 * 获取单个潜客详情 (管理员功能)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: '潜客不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('获取潜客详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取潜客详情失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/leads/[id]
 * 更新潜客状态 (管理员功能)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 检查潜客是否存在
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: '潜客不存在',
        },
        { status: 404 }
      );
    }

    // 验证状态值(如果提供)
    const validStatuses = ['pending', 'contacted', 'scheduled', 'closed', 'abandoned'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: '无效的状态值',
          validStatuses,
        },
        { status: 400 }
      );
    }

    // 更新潜客
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        status: body.status,
        // 可以扩展更多可更新字段,如备注等
      },
    });

    return NextResponse.json({
      success: true,
      message: '潜客信息更新成功',
      data: updatedLead,
    });
  } catch (error) {
    console.error('更新潜客信息失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新潜客信息失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/leads/[id]
 * 删除潜客 (管理员功能)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查潜客是否存在
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: '潜客不存在',
        },
        { status: 404 }
      );
    }

    // 删除潜客
    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '潜客删除成功',
    });
  } catch (error) {
    console.error('删除潜客失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除潜客失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
