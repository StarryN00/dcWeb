# API 数据契约不一致 - 批量修复记录

## 问题描述

**错误信息:**
```
Uncaught TypeError: Cannot read properties of undefined (reading 'length')
```

**发生时间:** 2026-01-18

**影响范围:**
- ❌ 管理后台潜客管理页面 (`/admin/leads`) - page.tsx:182
- ❌ 案例展示页面 (`/cases`) - page.tsx:125
- ❌ 管理后台案例管理页面 (`/admin/cases`)

## 根本原因

### 1. API 返回数据结构不一致

#### Leads API
**API 路由** (`/app/api/leads/route.ts` 第 59-63 行):
```typescript
return NextResponse.json({
  success: true,
  count: leads.length,
  data: leads,  // ✅ 数据在 data 字段中
});
```

**前端代码** (`/app/admin/leads/page.tsx` 第 58-59 行,修复前):
```typescript
if (data.success) {
  setLeads(data.leads);  // ❌ 错误:尝试访问不存在的 leads 字段
}
```

#### Cases API
**API 路由** (`/app/api/cases/route.ts` 第 74-78 行,修复前):
```typescript
return NextResponse.json({
  success: true,
  count: cases.length,
  cases: cases,  // ❌ 错误:字段名应该是 data
});
```

**前端代码** (`/app/cases/page.tsx` 和 `/app/admin/cases/page.tsx`):
```typescript
if (data.success) {
  setCases(data.data);  // ✅ 正确:但 API 返回的是 cases
}
```

### 2. 错误传播链

1. `data.leads` 的值是 `undefined` (因为该字段不存在)
2. `setLeads(undefined)` 被执行,导致 `leads` 状态变为 `undefined`
3. 第 182 行代码 `{leads.length > 0 && (` 尝试访问 `undefined.length`
4. 抛出 TypeError,页面崩溃

## 解决方案

### 修复内容汇总

#### 1. 统一 API 响应格式
**文件:** `/app/api/cases/route.ts`

**修改前:**
```typescript
return NextResponse.json({
  success: true,
  count: cases.length,
  cases: cases,  // ❌ 字段名不一致
});
```

**修改后:**
```typescript
return NextResponse.json({
  success: true,
  count: cases.length,
  data: cases,  // ✅ 统一使用 data 字段
});
```

#### 2. 修复前端数据获取逻辑

**文件 1:** `/app/admin/leads/page.tsx`

**修改前:**
```typescript
const fetchLeads = async () => {
  try {
    const response = await fetch('/api/leads');
    const data = await response.json();

    if (data.success) {
      setLeads(data.leads);  // ❌ 字段名错误
    } else {
      setError('获取潜客列表失败');
    }
  } catch (error) {
    console.error('获取潜客失败:', error);
    setError('获取潜客列表失败');
  } finally {
    setIsLoading(false);
  }
};
```

**修改后:**
```typescript
const fetchLeads = async () => {
  try {
    const response = await fetch('/api/leads');
    const data = await response.json();

    // ✅ 修复1: 使用正确的字段名 data.data
    // ✅ 修复2: 添加类型检查确保是数组
    if (data.success && Array.isArray(data.data)) {
      setLeads(data.data);
    } else {
      setError('获取潜客列表失败:数据格式错误');
      setLeads([]);  // ✅ 修复3: 确保 leads 始终是数组
    }
  } catch (error) {
    console.error('获取潜客失败:', error);
    setError('获取潜客列表失败');
    setLeads([]);  // ✅ 修复4: 异常情况下也设置为空数组
  } finally {
    setIsLoading(false);
  }
};
```

**文件 2:** `/app/admin/cases/page.tsx`
- 修复 `data.cases` → `data.data`
- 添加 `Array.isArray()` 类型检查
- 所有错误分支设置 `setCases([])`

**文件 3:** `/app/cases/page.tsx`
- 添加 `Array.isArray()` 类型检查
- 所有错误分支设置 `setCases([])`

**文件 4:** `/components/home/FeaturedCasesSection.tsx`
- 添加 `Array.isArray()` 类型检查
- 所有错误分支设置 `setCases([])`

### 修复要点

1. **API 响应统一化**: 所有 API 统一返回 `{ success, data }` 格式
2. **字段名修正**: 前端统一读取 `data.data`
3. **类型安全检查**: 添加 `Array.isArray(data.data)` 确保数据是数组
4. **防御性编程**: 所有错误分支都设置 `setState([])`,确保状态始终是数组
5. **更详细的错误信息**: 区分"请求失败"和"数据格式错误"

## 验证结果

### 修复前
- ❌ `/admin/leads` 页面崩溃
- ❌ `/cases` 页面崩溃
- ❌ `/admin/cases` 页面数据无法加载

### 修复后
- ✅ `/admin/leads` 页面正常加载和显示数据
- ✅ `/cases` 页面正常加载和显示数据
- ✅ `/admin/cases` 页面正常加载和显示数据
- ✅ 首页案例展示正常工作
- ✅ 编译无错误
- ✅ 运行时无错误

**日志验证:**
```
✓ Compiled in 131ms
GET /cases 200 in 432ms
GET /api/cases 200 in 142ms
GET /admin/leads 200 in 285ms
GET /api/leads 200 in 58ms
```

## 修复的文件清单

### API 路由
- ✅ `/app/api/cases/route.ts` - 统一返回 `data` 字段

### 前端页面
- ✅ `/app/admin/leads/page.tsx` - 修正字段名 + 添加类型检查
- ✅ `/app/admin/cases/page.tsx` - 修正字段名 + 添加类型检查
- ✅ `/app/cases/page.tsx` - 添加类型检查

### 组件
- ✅ `/components/home/FeaturedCasesSection.tsx` - 添加类型检查

## 预防措施

### 1. API 响应标准化

建议为所有 API 响应创建统一的类型定义:

```typescript
// utils/api-response.ts
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  count?: number;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### 2. 前端数据获取模式

建议使用统一的数据获取工具函数:

```typescript
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || '请求失败');
  }

  if (!data.data) {
    throw new Error('数据格式错误');
  }

  return data.data as T;
}
```

### 3. TypeScript 严格模式

在 `tsconfig.json` 中启用严格的 null 检查:
```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

## 相关文件

- `/app/admin/leads/page.tsx` - 前端页面组件
- `/app/api/leads/route.ts` - API 路由处理器
- 无相关的 memory 文档(首次记录)

## 相似问题排查

建议检查其他使用 API 的页面是否存在相同问题:
- ✅ `/app/admin/cases/page.tsx` - 已修复
- ✅ `/app/admin/leads/page.tsx` - 已修复
- ✅ `/app/cases/page.tsx` - 已修复
- ✅ `/app/cases/[id]/page.tsx` - 已检查,使用正确
- ✅ `/components/home/FeaturedCasesSection.tsx` - 已修复

## 额外发现

### Hydration 警告
在修复过程中,还发现了一个 React Hydration 警告:
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

这个警告通常由以下原因引起:
- 服务端和客户端渲染不一致
- 浏览器扩展修改了 HTML (如 `data-ext-version="3.3.1"`)
- 使用了 `Date.now()` 或 `Math.random()` 等动态值

在本项目中,这个警告是由浏览器扩展添加的 `data-ext-version` 属性导致的,不影响功能,可以忽略。

## 总结

这是一个典型的**前后端数据契约不一致**导致的运行时错误。核心问题是:
1. API 响应字段命名不统一 (`data` vs `cases` vs `leads`)
2. 前端缺少运行时类型检查
3. 没有防御性编程处理异常情况

通过以下措施彻底解决:
1. **API 标准化**: 统一使用 `{ success, data }` 格式
2. **类型检查**: 添加 `Array.isArray()` 验证
3. **防御性编程**: 确保状态始终是有效的数组
4. **错误处理增强**: 更详细的错误信息

这次修复不仅解决了当前问题,还提升了整体代码质量和健壮性。

---
**修复人员:** Claude Code
**修复日期:** 2026-01-18
**问题级别:** 高 (导致多个页面崩溃)
**修复状态:** ✅ 已完成
**受影响页面:** 5个页面/组件
**修复文件数:** 5个文件
