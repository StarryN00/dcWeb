# API 测试指南 - 快速开始

## 🎯 目标

测试所有 API 端点是否正常工作,包括案例管理和潜客管理功能。

---

## 📋 前提条件检查

在开始测试之前,请确保以下条件都已满足:

### 1. PostgreSQL 已安装并运行

```bash
# 检查状态
./scripts/db-manager.sh status

# 如果未安装,运行:
./scripts/install-postgres.sh

# 如果已安装但未运行,启动它:
./scripts/db-manager.sh start
```

**预期输出**:
```
✅ PostgreSQL 已安装
PostgreSQL 14.x
✅ PostgreSQL 服务正在运行
```

### 2. 数据库已初始化

```bash
# 初始化数据库(创建数据库和用户)
./scripts/db-manager.sh init
```

**预期输出**:
```
✅ 数据库初始化完成!
📊 数据库名称: dcweb_db
👤 用户名称: dcweb_admin
🔒 密码: dcweb_password_2026
```

### 3. .env 文件配置正确

检查 `.env` 文件:
```bash
cat .env | grep DATABASE_URL
```

**应该显示**:
```
DATABASE_URL="postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public"
```

### 4. Prisma 迁移已完成

```bash
# 运行迁移创建数据库表
./scripts/db-manager.sh migrate

# 或者使用 npm 命令
npm run db:push
```

**预期输出**:
```
✅ Prisma 迁移完成
Your database is now in sync with your Prisma schema.
```

### 5. 开发服务器正在运行

```bash
# 在另一个终端窗口启动开发服务器
npm run dev
```

**预期输出**:
```
▲ Next.js 16.1.2 (Turbopack)
- Local:         http://localhost:3600
✓ Ready in 1.2s
```

---

## 🚀 测试方法

### 方法一: 自动化测试(推荐)

这是最简单快速的方法,一键测试所有端点。

```bash
cd /mnt/d/AIProgram/dcWeb
./scripts/test-api.sh
```

**测试内容**:
- ✅ 案例 CRUD 操作(创建、读取、更新、删除)
- ✅ 潜客 CRUD 操作
- ✅ 筛选和排序功能
- ✅ 错误处理(404, 400)
- ✅ 自动清理测试数据

**预期输出**:
```
========================================
API 端点测试
========================================
✅ 开发服务器正在运行
✅ 数据库连接正常

========================================
案例 API 测试
========================================
🧪 测试 获取案例列表
✅ 测试通过 (HTTP 200)

🧪 测试 创建新案例
✅ 测试通过 (HTTP 201)
ℹ️  创建的案例ID: cm6j1x2y3000008l5abc12345

🧪 测试 获取案例详情
✅ 测试通过 (HTTP 200)
...

========================================
测试总结
========================================
总测试数: 15
通过: 15
失败: 0

🎉 所有测试通过!
```

---

### 方法二: 创建示例数据后手动测试

如果想在有数据的情况下测试,可以先创建示例数据。

#### 步骤 1: 创建种子数据

```bash
npm run db:seed
```

**这会创建**:
- ✅ 1 个管理员用户
- ✅ 6 个装修案例(不同风格)
- ✅ 6 个潜客记录(不同评分等级)

**预期输出**:
```
开始创建种子数据...
✅ 管理员创建成功: 系统管理员
✅ 案例创建成功: 现代简约 · 120㎡两居室
✅ 案例创建成功: 北欧风格 · 95㎡温馨小家
...
✅ 潜客创建成功: 张三 (评分: 90)
✅ 潜客创建成功: 李四 (评分: 100)
...

🎉 种子数据创建完成!
```

#### 步骤 2: 在浏览器中测试

打开 Prisma Studio 查看数据:
```bash
npm run db:studio
# 或
./scripts/db-manager.sh studio
```

浏览器会自动打开 http://localhost:5555

#### 步骤 3: 测试 API

**测试案例列表**:
```bash
curl http://localhost:3600/api/cases | jq
```

**预期响应**:
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "...",
      "title": "现代简约 · 120㎡两居室",
      "location": "北京 · 朝阳区",
      "style": "modern",
      "area": 120,
      ...
    }
  ]
}
```

**测试潜客列表**:
```bash
curl http://localhost:3600/api/leads | jq
```

**预期响应**:
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "...",
      "name": "李四",
      "score": 100,
      "status": "contacted",
      ...
    }
  ]
}
```

---

## 🧪 快速验证测试

如果只想快速验证 API 是否工作,运行这些命令:

```bash
# 1. 测试服务器是否运行
curl -s http://localhost:3600/api/cases | head -20

# 2. 测试创建案例
curl -X POST http://localhost:3600/api/cases \
  -H "Content-Type: application/json" \
  -d '{"title":"测试","location":"北京","style":"modern","area":100,"duration":60,"price":20,"images":["https://via.placeholder.com/800"],"description":"测试","testimonial":"测试","foremanName":"测试","foremanPhone":"13800138000","stage":"测试"}'

# 3. 测试提交潜客
curl -X POST http://localhost:3600/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"测试","phone":"13800138000","propertyType":"apartment","area":100,"budget":20,"styles":["modern"],"stage":"design_and_construction","timeline":"within_1_month"}'
```

---

## 📊 测试结果分析

### 成功的标志

- ✅ HTTP 状态码: 200 (GET), 201 (POST)
- ✅ 响应包含 `"success": true`
- ✅ 数据格式正确
- ✅ 潜客自动评分正确(50-100分)
- ✅ 筛选和排序功能正常

### 常见问题

#### 问题 1: 连接被拒绝

**错误**: `curl: (7) Failed to connect to localhost port 3600`

**原因**: 开发服务器未运行

**解决**:
```bash
npm run dev
```

#### 问题 2: 数据库连接错误

**错误**: API 返回 500,日志显示 `Can't reach database server`

**原因**: PostgreSQL 未启动

**解决**:
```bash
./scripts/db-manager.sh start
```

#### 问题 3: 表不存在

**错误**: `The table "public.Case" does not exist`

**原因**: Prisma 迁移未完成

**解决**:
```bash
npm run db:push
```

---

## 📝 测试清单

完成所有测试后,确认以下功能:

### 案例 API ✅
- [ ] 获取空案例列表
- [ ] 创建新案例
- [ ] 获取案例详情
- [ ] 更新案例
- [ ] 删除案例
- [ ] 按风格筛选
- [ ] 按面积范围筛选
- [ ] 获取推荐案例

### 潜客 API ✅
- [ ] 提交潜客信息
- [ ] 自动评分正确
- [ ] 获取潜客列表
- [ ] 获取潜客详情
- [ ] 更新潜客状态
- [ ] 删除潜客
- [ ] 按状态筛选
- [ ] 按评分筛选

### 错误处理 ✅
- [ ] 404 错误(资源不存在)
- [ ] 400 错误(缺少必填字段)
- [ ] 400 错误(无效数据)

---

## 🎉 测试完成后

如果所有测试都通过,恭喜!你的 API 已经可以正常工作了。

**下一步**:
1. ✅ 开发前端页面(案例列表、案例详情、问答向导)
2. ✅ 添加 NextAuth.js 认证
3. ✅ 开发管理后台
4. ✅ 部署到 Vercel

---

## 📚 相关文档

- [完整 API 文档](./API.md) - 所有端点的详细说明
- [API 测试文档](./API_TESTING.md) - 更详细的测试方法
- [PostgreSQL 安装指南](./POSTGRESQL_SETUP.md) - 数据库配置
- [数据库管理脚本](../scripts/README.md) - 脚本使用说明

---

**文档创建时间**: 2026-01-17
**适用版本**: dcWeb v1.0.0
