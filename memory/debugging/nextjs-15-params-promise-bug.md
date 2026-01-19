# Next.js 15+ 动态路由 params 变成 Promise 导致的 Bug

## Bug 概述

**日期**: 2026-01-18
**影响范围**: 所有使用动态路由参数的 API 路由
**严重程度**: 高 - 导致所有详情页 API 返回 500 错误
**Next.js 版本**: 16.1.2 (适用于 15.0.0+)

## 问题特征

### 用户报告的错误
```json
{
  "success": false,
  "error": "获取案例详情失败",
  "message": "Invalid `prisma.case.findUnique()` invocation...\nArgument `where` of type CaseWhereUniqueInput needs at least one of `id` arguments."
}
```

### 关键错误信息
```
Argument `where` of type CaseWhereUniqueInput needs at least one of `id` arguments.
Available options are marked with ?.

where: {
  id: undefined,  // ← 关键问题: id 是 undefined
  ...
}
```

### 典型场景
- 访问案例详情页 `/cases/[id]` 时
- API 路由 `/api/cases/[id]` 返回 500 错误
- Prisma 查询因为 `where: { id: undefined }` 失败

## 根本原因

### Next.js 15+ 的重大变更

在 **Next.js 15.0.0** 及以上版本中，动态路由参数 `params` 从**同步对象**变成了 **Promise 类型**。

#### 变更前 (Next.js 14 及以下)
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // params 是同步对象，可以直接访问
  const id = params.id;  // ✅ 正常工作
}
```

#### 变更后 (Next.js 15+)
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise 类型!
) {
  // params 现在是 Promise，需要先 await
  const id = params.id;  // ❌ 错误: params 是 Promise，不是对象
  // params.id 会是 undefined
}
```

### 为什么会出现这个问题

1. **类型不匹配**: 旧代码将 `params` 声明为普通对象，但实际运行时它是 Promise
2. **隐式错误**: TypeScript 可能不会报错（如果类型声明不正确）
3. **运行时失败**: 直接访问 `params.id` 得到 `undefined`
4. **级联错误**: `undefined` 传给 Prisma 导致验证失败

## 排查过程

### 1. 定位问题
- 用户报错提示 `id: undefined`
- 错误堆栈显示问题在 API 路由的 `prisma.case.findUnique()` 调用
- 检查 API 路由文件 `/app/api/cases/[id]/route.ts`

### 2. 识别根因
- 代码中使用 `params.id` 但值是 `undefined`
- 检查 `package.json` 发现使用 Next.js 16.1.2
- 查阅 Next.js 15+ 迁移文档，确认 params 类型变更

### 3. 验证影响范围
```bash
# 查找所有使用动态路由的 API 文件
find app/api -name "route.ts" -path "*/[*]/*"
```

发现受影响的文件:
- `/app/api/cases/[id]/route.ts` (GET, PUT, DELETE)
- `/app/api/leads/[id]/route.ts` (GET, PUT, DELETE)
- `/app/api/auth/[...nextauth]/route.ts` (使用 NextAuth handlers,不受影响)

## 修复方案

### 正确的代码模式

```typescript
import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js 15+ 动态路由处理器
 * params 现在是 Promise 类型
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise 类型
) {
  try {
    // 1. 先 await params
    const { id } = await params;

    // 2. 现在可以使用 id
    const caseItem = await prisma.case.findUnique({
      where: { id },  // ✅ id 有正确的值
    });

    if (!caseItem) {
      return NextResponse.json(
        { success: false, error: '案例不存在' },
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
```

### 修复步骤

1. **更新类型声明**
   ```typescript
   // 从
   { params }: { params: { id: string } }
   // 改为
   { params }: { params: Promise<{ id: string }> }
   ```

2. **await params**
   ```typescript
   // 在函数开始处
   const { id } = await params;
   ```

3. **使用解构的值**
   ```typescript
   // 将所有 params.id 替换为 id
   where: { id }
   ```

4. **清理缓存并重启**
   ```bash
   rm -rf .next
   npm run dev
   ```

## 已修复的文件

### `/app/api/cases/[id]/route.ts`
- ✅ GET 方法
- ✅ PUT 方法
- ✅ DELETE 方法

### `/app/api/leads/[id]/route.ts`
- ✅ GET 方法
- ✅ PUT 方法
- ✅ DELETE 方法

## 验证方法

### 1. 检查日志
```bash
# 查看开发服务器输出
tail -f /tmp/claude/-mnt-d-AIProgram-dcWeb/tasks/[task-id].output
```

成功的请求应该显示:
```
prisma:query SELECT ... FROM "public"."cases" WHERE ("public"."cases"."id" = $1 AND 1=1)
GET /api/cases/[id] 200 in XXXms
```

### 2. 测试 API
```bash
# 获取案例详情
curl http://localhost:3600/api/cases/[case-id]

# 应该返回 200 和案例数据
{
  "success": true,
  "data": { ... }
}
```

## 预防措施

### 1. 代码审查清单
在升级 Next.js 15+ 时，检查所有:
- [ ] API 路由中的动态参数使用
- [ ] 页面组件中的 params 使用 (如果是服务端组件)
- [ ] 中间件中的参数处理

### 2. 类型检查
确保 TypeScript 配置严格:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

### 3. 测试覆盖
为所有动态路由 API 添加集成测试:
```typescript
describe('GET /api/cases/[id]', () => {
  it('should return case detail with valid id', async () => {
    const response = await fetch(`/api/cases/${validId}`);
    expect(response.status).toBe(200);
  });
});
```

## 相关文档

- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js API Routes in App Router](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 经验教训

1. **框架升级需谨慎**: Next.js 15+ 的 params Promise 变更是破坏性的
2. **类型系统的重要性**: 正确的类型声明可以在编译时发现问题
3. **缓存清理**: Next.js 开发模式下可能缓存旧代码，修复后需清理 `.next` 目录
4. **全面测试**: 升级后应该测试所有动态路由功能

## 其他可能受影响的场景

### 服务端组件中的 params
```typescript
// app/cases/[id]/page.tsx (如果不是 'use client')
export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>  // ← 也是 Promise!
}) {
  const { id } = await params;
  // ...
}
```

### 中间件中的参数
中间件的 `NextRequest` 对象可能也有类似变化，需要查阅文档。

## 快速参考

**症状**: `id: undefined` 错误
**原因**: Next.js 15+ params 是 Promise
**修复**: `const { id } = await params`
**验证**: API 返回 200 而不是 500
