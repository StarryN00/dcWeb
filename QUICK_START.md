# 快速启动指南

## 🚀 5分钟快速上手

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
# DATABASE_URL="postgresql://用户名:密码@localhost:5432/dcweb_db"
# NEXTAUTH_URL="http://localhost:3600"
# NEXTAUTH_SECRET="your-secret-key"
```

### 3. 初始化数据库 (如果PostgreSQL已安装)
```bash
# 生成 Prisma Client
npx prisma generate

# 推送数据库 Schema
npx prisma db push

# 创建管理员账户
npx ts-node prisma/seed-admin.ts

# (可选) 导入示例案例和潜客数据
npx ts-node prisma/seed.ts
```

### 4. 启动开发服务器
```bash
npm run dev
```

### 5. 访问应用
- **前台首页**: http://localhost:3600
- **管理后台**: http://localhost:3600/admin/login
  - 用户名: `admin`
  - 密码: `admin123`

---

## 📦 如果PostgreSQL未安装

### 方案A: 使用在线数据库
1. 注册 [Supabase](https://supabase.com) 或 [Neon](https://neon.tech) 免费账户
2. 创建PostgreSQL数据库
3. 复制连接字符串到 `.env` 的 `DATABASE_URL`
4. 继续执行步骤3-5

### 方案B: 跳过数据库 (仅预览前端)
1. 注释掉所有数据库相关代码
2. 使用模拟数据
3. 只能访问静态页面,功能受限

---

## 🗂️ 项目结构速览

```
dcWeb/
├── app/                # 页面 (Next.js App Router)
│   ├── page.tsx        # 首页
│   ├── cases/          # 案例展示
│   ├── wizard/         # 问答向导
│   └── admin/          # 管理后台
├── components/         # React 组件
├── lib/                # 工具库
├── prisma/             # 数据库
└── .env                # 环境变量
```

---

## 🎨 主要功能

### 前台 (用户端)
- **首页**: 展示服务和精选案例
- **案例展示**: 浏览和筛选装修案例
- **问答向导**: 6步表单提交装修需求

### 后台 (管理端)
- **仪表盘**: 统计数据概览
- **案例管理**: 管理装修案例 (创建/编辑/删除)
- **潜客管理**: 查看潜客信息和评分

---

## 🔑 默认管理员账户

- **用户名**: admin
- **密码**: admin123

⚠️ **重要**: 生产环境请立即修改密码!

---

## 🐛 常见问题

### Q: npm install 失败?
A: 尝试清除缓存: `npm cache clean --force && npm install`

### Q: 数据库连接失败?
A: 检查PostgreSQL是否运行: `./scripts/db-manager.sh status`

### Q: 页面空白或报错?
A: 检查浏览器控制台,可能是环境变量未配置

### Q: 图片不显示?
A: 当前使用外部图片链接,需要网络连接

---

## 📚 更多文档

- **完整项目总结**: PROJECT_SUMMARY.md
- **设计文档**: memory/design/
- **开发进度**: memory/progress/
- **CLAUDE.md**: 项目核心知识库

---

## 💬 需要帮助?

1. 查看 PROJECT_SUMMARY.md 了解完整功能
2. 阅读 CLAUDE.md 了解业务逻辑
3. 检查 memory/design/ 目录的设计文档

---

## 🎉 开始开发

```bash
# 启动开发服务器
npm run dev

# 打开 Prisma Studio (数据库可视化)
npx prisma studio

# 运行测试 (如果数据库运行)
./scripts/test-api.sh
```

---

**祝您开发愉快!** 🚀
