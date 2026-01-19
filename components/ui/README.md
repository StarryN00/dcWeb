# UI 组件库文档

## 📦 组件清单

本项目已完成 **7 个基础 UI 组件** 的开发,全部采用 TypeScript + Tailwind CSS 实现。

### 1. Button (按钮)
**位置**: `components/ui/Button.tsx`

**特性**:
- ✅ 4 种变体: primary, secondary, outline, ghost
- ✅ 3 种尺寸: sm, md, lg
- ✅ 加载状态 (loading)
- ✅ 禁用状态 (disabled)
- ✅ 悬停动画和焦点样式

**使用示例**:
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">提交</Button>
<Button variant="outline" loading>加载中...</Button>
<Button disabled>禁用按钮</Button>
```

---

### 2. Card (卡片)
**位置**: `components/ui/Card.tsx`

**特性**:
- ✅ 2 种变体: standard (标准), glass (毛玻璃)
- ✅ 悬停效果 (可选)
- ✅ 子组件: CardHeader, CardTitle, CardContent, CardFooter

**使用示例**:
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

<Card variant="standard" hoverable>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
  </CardHeader>
  <CardContent>
    卡片内容
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

---

### 3. Input (输入框)
**位置**: `components/ui/Input.tsx`

**特性**:
- ✅ 支持所有原生 input 类型
- ✅ 标签 (label)
- ✅ 错误提示 (error)
- ✅ 帮助文本 (helperText)
- ✅ 必填标记
- ✅ Textarea 变体

**使用示例**:
```tsx
import { Input, Textarea } from '@/components/ui';

<Input
  label="姓名"
  placeholder="请输入姓名"
  required
/>

<Input
  label="手机号"
  type="tel"
  error="请输入有效的手机号"
/>

<Textarea
  label="描述"
  rows={4}
  helperText="最多200字"
/>
```

---

### 4. Modal (模态框)
**位置**: `components/ui/Modal.tsx`

**特性**:
- ✅ 基于 Headless UI 实现
- ✅ 4 种尺寸: sm, md, lg, xl
- ✅ 背景遮罩和模糊效果
- ✅ 平滑动画效果
- ✅ 子组件: ModalContent, ModalFooter

**使用示例**:
```tsx
import { Modal, ModalContent, ModalFooter } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="标题"
  size="md"
>
  <ModalContent>
    <p>模态框内容</p>
  </ModalContent>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>取消</Button>
    <Button>确认</Button>
  </ModalFooter>
</Modal>
```

---

### 5. Badge (徽章)
**位置**: `components/ui/Badge.tsx`

**特性**:
- ✅ 5 种变体: default, success, warning, error, info
- ✅ 3 种尺寸: sm, md, lg
- ✅ ScoreBadge (评分徽章)
- ✅ StatusBadge (状态徽章)

**使用示例**:
```tsx
import { Badge, ScoreBadge, StatusBadge } from '@/components/ui';

<Badge variant="success">成功</Badge>
<Badge variant="warning" size="sm">警告</Badge>

// 潜客评分徽章
<ScoreBadge score={85} showGrade />  // 显示: 85分 (B级)

// 状态徽章
<StatusBadge status="published" />  // 显示: 已发布
<StatusBadge status="pending" />    // 显示: 待跟进
```

---

### 6. Select (选择框)
**位置**: `components/ui/Select.tsx`

**特性**:
- ✅ 基于 Headless UI 实现
- ✅ 标签和错误提示
- ✅ 搜索高亮
- ✅ 键盘导航支持

**使用示例**:
```tsx
import { Select } from '@/components/ui';

<Select
  label="装修风格"
  value={style}
  onChange={setStyle}
  options={[
    { value: 'modern', label: '现代' },
    { value: 'nordic', label: '北欧' },
  ]}
  placeholder="请选择"
/>
```

---

### 7. Loading (加载)
**位置**: `components/ui/Loading.tsx`

**特性**:
- ✅ 3 种尺寸: sm, md, lg
- ✅ 可选加载文本
- ✅ 全屏模式
- ✅ Skeleton (骨架屏)
- ✅ CardSkeleton (卡片骨架屏)

**使用示例**:
```tsx
import { Loading, Skeleton, CardSkeleton } from '@/components/ui';

<Loading size="md" text="加载中..." />
<Loading fullScreen />

// 骨架屏
<Skeleton className="h-6 w-3/4" />
<Skeleton className="h-4 w-full" count={3} />

// 卡片骨架屏
<CardSkeleton />
```

---

## 🎨 设计规范

### 颜色系统
- **Primary (主色)**: emerald-600
- **Text (文字)**: stone-900, stone-800, stone-600
- **Background (背景)**: stone-50, stone-100
- **Border (边框)**: stone-200, stone-300
- **Success (成功)**: emerald-*
- **Warning (警告)**: amber-*
- **Error (错误)**: red-*
- **Info (信息)**: blue-*

### 尺寸规范
- **Small**: px-3 py-1.5 text-sm
- **Medium**: px-6 py-3 text-base
- **Large**: px-8 py-4 text-lg

### 圆角规范
- **按钮/输入框**: rounded-lg (0.5rem)
- **卡片/模态框**: rounded-xl (0.75rem)
- **徽章**: rounded-full

### 阴影规范
- **默认**: shadow-sm
- **悬停**: shadow-lg
- **模态框**: shadow-2xl

---

## 📖 组件展示页

访问 **/components-showcase** 查看所有组件的实际效果和交互演示。

**地址**: http://localhost:3600/components-showcase

---

## 🚀 快速开始

### 1. 导入单个组件
```tsx
import { Button } from '@/components/ui';
```

### 2. 导入多个组件
```tsx
import {
  Button,
  Card,
  CardContent,
  Input,
  Modal,
} from '@/components/ui';
```

### 3. 组合使用
```tsx
<Card>
  <CardContent>
    <Input label="姓名" />
    <Input label="手机号" type="tel" />
    <Button className="mt-4">提交</Button>
  </CardContent>
</Card>
```

---

## 💡 最佳实践

### 1. 使用语义化的变体
```tsx
// ✅ 好的做法
<Button variant="primary">主要操作</Button>
<Button variant="outline">次要操作</Button>

// ❌ 避免这样
<Button className="bg-emerald-600">操作</Button>
```

### 2. 保持一致的尺寸
```tsx
// ✅ 同一页面使用统一尺寸
<Button size="md">按钮1</Button>
<Button size="md">按钮2</Button>

// ❌ 避免尺寸不一致
<Button size="sm">按钮1</Button>
<Button size="lg">按钮2</Button>
```

### 3. 合理使用加载状态
```tsx
// ✅ 异步操作时显示加载
<Button loading={isSubmitting}>提交</Button>

// ✅ 数据加载时使用骨架屏
{isLoading ? <CardSkeleton /> : <Card>...</Card>}
```

### 4. 提供清晰的错误反馈
```tsx
<Input
  label="手机号"
  value={phone}
  error={phoneError}  // 显示具体错误信息
/>
```

---

## 🔧 扩展组件

如需自定义样式,使用 `className` prop:

```tsx
<Button className="w-full">全宽按钮</Button>
<Card className="border-2 border-emerald-600">自定义边框</Card>
```

所有组件都支持原生 HTML 属性:

```tsx
<Input
  type="email"
  required
  maxLength={50}
  onFocus={() => console.log('focused')}
/>
```

---

## 📦 组件依赖

- **Tailwind CSS**: 样式框架
- **Headless UI**: Modal 和 Select 组件
- **Heroicons**: 图标库
- **clsx + tailwind-merge**: 类名合并工具

---

## 🎯 下一步

组件库已完成,可以开始:
1. ✅ 实现 API 路由
2. ✅ 开发前台页面
3. ✅ 开发管理后台
4. ✅ 使用这些组件快速构建界面

---

**组件库版本**: v1.0.0
**最后更新**: 2026-01-16
