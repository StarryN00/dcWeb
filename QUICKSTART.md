# 装修公司官网 - 快速入门指南

## 🚀 项目已启动

**开发服务器地址**:
- 本地: http://localhost:3600
- 网络: http://192.168.101.187:3600

**状态**: ✅ 正常运行 (Ready in 1268ms)

**技术栈版本**:
- Next.js 16.1.2
- React 19.2.3
- TypeScript 5.9.3
- Tailwind CSS 3.4.15 (稳定版)
- Prisma 7.2.0

---

## 📋 立即可用的功能

### 当前可访问的页面
- ✅ **首页**: http://localhost:3456
  - Hero 区域
  - 4个服务卡片展示
  - 项目初始化成功提示

### 项目文件结构
```
dcWeb/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局 (配置Inter字体)
│   ├── page.tsx           # 首页
│   └── globals.css        # Tailwind样式 + 自定义类
├── lib/
│   └── prisma.ts          # 数据库客户端
├── utils/
│   ├── lead-score.ts      # 潜客评分算法
│   └── cn.ts              # 类名工具
├── types/
│   └── index.ts           # TypeScript类型定义
├── prisma/
│   └── schema.prisma      # 数据库模型
└── 配置文件...
```

---

## 🔧 必要的配置步骤

### 1. 配置数据库 (必需)

编辑 `.env` 文件,修改数据库连接:

```bash
# 当前配置 (需要修改)
DATABASE_URL="postgresql://用户名:密码@localhost:5432/dcweb_db?schema=public"

# 示例配置
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/dcweb_db?schema=public"
```

**然后运行**:
```bash
# 创建数据库表
npx prisma db push

# 或使用迁移 (推荐生产环境)
npx prisma migrate dev --name init

# 查看数据库 (可选)
npx prisma studio
```

### 2. 生成 NextAuth 密钥 (推荐)

```bash
# 生成安全密钥
openssl rand -base64 32

# 复制输出结果,替换 .env 中的 NEXTAUTH_SECRET
```

---

## 🎨 使用自定义 CSS 类

### 已配置的组件类

在任何 TSX 文件中使用:

```tsx
// 标准卡片
<div className="card-standard">
  卡片内容
</div>

// 毛玻璃卡片
<div className="card-glass p-8">
  毛玻璃效果
</div>

// 主要按钮
<button className="btn-primary">
  免费获取方案
</button>

// 次要按钮
<button className="btn-secondary">
  了解更多
</button>

// 输入框
<input className="input-standard" placeholder="请输入..." />
```

### Stone 色系 (已配置)
```tsx
<div className="bg-stone-50 text-stone-900">
  <h1 className="text-stone-800">标题</h1>
  <p className="text-stone-600">描述文字</p>
  <span className="text-stone-500">次要信息</span>
</div>
```

---

## 📊 数据模型使用

### 使用 Prisma Client

```typescript
import { prisma } from '@/lib/prisma';

// 查询案例
const cases = await prisma.case.findMany({
  where: { status: 'published' },
  orderBy: { createdAt: 'desc' },
});

// 创建潜客
const lead = await prisma.lead.create({
  data: {
    name: '张三',
    phone: '13800138000',
    propertyType: 'apartment',
    area: 120,
    budget: 25,
    styles: ['modern', 'minimalist'],
    stage: 'design_construction',
    timeline: 'within_1_3_months',
    score: 75, // 使用评分算法计算
  },
});
```

### 使用评分算法

```typescript
import { calculateLeadScore, getLeadGrade } from '@/utils/lead-score';

const score = calculateLeadScore({
  budget: 25,    // 25万
  area: 120,     // 120㎡
  timeline: 'within_1_3_months', // 1-3个月
});

console.log(score); // 例: 77

const grade = getLeadGrade(score);
console.log(grade); // { grade: 'B', label: 'B级潜客', color: 'blue' }
```

---

## 🛠️ 常用命令

### 开发
```bash
# 启动开发服务器
npm run dev

# 启动并指定端口
npm run dev -- -p 3000

# 类型检查
npm run lint
```

### Prisma
```bash
# 生成 Prisma Client
npx prisma generate

# 推送模型到数据库 (开发环境)
npx prisma db push

# 创建迁移 (生产环境)
npx prisma migrate dev --name 描述

# 打开 Prisma Studio (数据库管理界面)
npx prisma studio

# 重置数据库 (慎用!)
npx prisma migrate reset
```

### 构建
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

---

## 📦 下一步开发建议

### 阶段 2: 基础组件库
创建可复用的 UI 组件:

```bash
# 创建 Button 组件
components/ui/Button.tsx

# 创建 Card 组件
components/ui/Card.tsx

# 创建 Input 组件
components/ui/Input.tsx

# 创建 Modal 组件
components/ui/Modal.tsx
```

### 阶段 3: API 路由
实现后端接口:

```bash
# 案例相关 API
app/api/cases/route.ts         # GET /api/cases (列表)
app/api/cases/[id]/route.ts    # GET /api/cases/123 (详情)

# 潜客相关 API
app/api/leads/route.ts         # POST /api/leads (提交)
```

### 阶段 4: 前台页面
开发用户界面:

```bash
# 案例列表页
app/cases/page.tsx

# 案例详情页
app/cases/[id]/page.tsx

# 需求问答向导
app/wizard/page.tsx
```

---

## 🔍 调试技巧

### 1. 查看 Tailwind 是否生效
打开浏览器开发者工具,检查元素是否有 Tailwind 类名的样式

### 2. 检查 TypeScript 错误
```bash
npx tsc --noEmit
```

### 3. 清理缓存
```bash
rm -rf .next
npm run dev
```

### 4. 查看 Prisma 生成的类型
```bash
node_modules/@prisma/client/index.d.ts
```

---

## 📚 参考资源

### 项目文档
- **产品需求**: `memory/design/product-requirements.md`
- **设计规划**: `memory/design/product-design-plan.md`
- **完成报告**: `memory/plans/phase1-completion-report.md`
- **完整计划**: `/home/starryn/.claude/plans/twinkling-waddling-mango.md`

### 技术文档
- Next.js 文档: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Prisma 文档: https://www.prisma.io/docs

---

## ❓ 常见问题

### Q: 端口被占用怎么办?
```bash
# 使用其他端口
npm run dev -- -p 3001
```

### Q: Prisma Client 找不到?
```bash
# 重新生成
npx prisma generate
```

### Q: 样式不生效?
1. 确认 `tailwind.config.ts` 中的 `content` 路径正确
2. 重启开发服务器
3. 清理 `.next` 目录

### Q: 如何添加新的数据模型?
1. 编辑 `prisma/schema.prisma`
2. 运行 `npx prisma generate`
3. 运行 `npx prisma db push`

---

## 🎉 准备就绪!

项目已经完成基础配置,可以开始开发了!

**建议顺序**:
1. ✅ 配置数据库连接
2. ✅ 开发基础 UI 组件
3. ✅ 实现 API 路由
4. ✅ 开发前台页面
5. ✅ 开发管理后台

祝开发顺利! 🚀
