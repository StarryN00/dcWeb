# API 测试文档

## 概述

本文档描述了如何测试所有 API 端点,确保它们正常工作。

---

## 前提条件

在运行测试之前,请确保:

1. ✅ PostgreSQL 数据库已启动
   ```bash
   ./scripts/db-manager.sh status
   # 如果未启动:
   ./scripts/db-manager.sh start
   ```

2. ✅ Prisma 迁移已完成
   ```bash
   ./scripts/db-manager.sh migrate
   ```

3. ✅ 开发服务器正在运行
   ```bash
   npm run dev
   # 服务器应该在 http://localhost:3600 运行
   ```

---

## 快速测试

### 方法一: 使用自动化测试脚本 (推荐)

```bash
cd /mnt/d/AIProgram/dcWeb
./scripts/test-api.sh
```

这个脚本会自动测试所有端点,包括:
- ✅ 案例 CRUD 操作 (创建、读取、更新、删除)
- ✅ 潜客 CRUD 操作
- ✅ 筛选和排序功能
- ✅ 错误处理 (404, 400)
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

### 方法二: 手动测试 (使用 curl)

#### 1. 测试案例 API

**获取案例列表**:
```bash
curl http://localhost:3600/api/cases
```

**创建新案例**:
```bash
curl -X POST http://localhost:3600/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "title": "现代简约风格住宅",
    "location": "北京 · 朝阳区",
    "style": "modern",
    "area": 120,
    "duration": 60,
    "price": 25,
    "images": ["https://via.placeholder.com/800x600"],
    "description": "这是一个测试案例",
    "testimonial": "非常满意",
    "foremanName": "张师傅",
    "foremanPhone": "13800138000",
    "stage": "完工阶段"
  }'
```

**获取案例详情** (替换 `{case_id}`):
```bash
curl http://localhost:3600/api/cases/{case_id}
```

**更新案例** (替换 `{case_id}`):
```bash
curl -X PUT http://localhost:3600/api/cases/{case_id} \
  -H "Content-Type: application/json" \
  -d '{"title": "更新后的标题"}'
```

**删除案例** (替换 `{case_id}`):
```bash
curl -X DELETE http://localhost:3600/api/cases/{case_id}
```

**测试筛选功能**:
```bash
# 按风格筛选
curl http://localhost:3600/api/cases?style=modern

# 按面积范围筛选
curl http://localhost:3600/api/cases?minArea=100&maxArea=200

# 按价格范围筛选
curl http://localhost:3600/api/cases?minPrice=20&maxPrice=50

# 只获取推荐案例
curl http://localhost:3600/api/cases?featured=true
```

#### 2. 测试潜客 API

**提交潜客信息**:
```bash
curl -X POST http://localhost:3600/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "propertyType": "apartment",
    "area": 120,
    "budget": 30,
    "styles": ["modern", "nordic"],
    "stage": "design_and_construction",
    "timeline": "within_1_month"
  }'
```

**获取潜客列表**:
```bash
curl http://localhost:3600/api/leads
```

**获取潜客详情** (替换 `{lead_id}`):
```bash
curl http://localhost:3600/api/leads/{lead_id}
```

**更新潜客状态** (替换 `{lead_id}`):
```bash
curl -X PUT http://localhost:3600/api/leads/{lead_id} \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

**删除潜客** (替换 `{lead_id}`):
```bash
curl -X DELETE http://localhost:3600/api/leads/{lead_id}
```

**测试筛选功能**:
```bash
# 按状态筛选
curl http://localhost:3600/api/leads?status=pending

# 按评分范围筛选
curl http://localhost:3600/api/leads?minScore=80&maxScore=100

# 按评分排序
curl http://localhost:3600/api/leads?sortBy=score&order=desc
```

---

### 方法三: 使用 Postman/Insomnia

导入以下 JSON 到 Postman:

```json
{
  "info": {
    "name": "dcWeb API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Cases",
      "item": [
        {
          "name": "Get Cases",
          "request": {
            "method": "GET",
            "url": "http://localhost:3600/api/cases"
          }
        },
        {
          "name": "Create Case",
          "request": {
            "method": "POST",
            "url": "http://localhost:3600/api/cases",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"测试案例\",\n  \"location\": \"北京 · 朝阳区\",\n  \"style\": \"modern\",\n  \"area\": 120,\n  \"duration\": 60,\n  \"price\": 25,\n  \"images\": [\"https://via.placeholder.com/800x600\"],\n  \"description\": \"测试描述\",\n  \"testimonial\": \"测试感言\",\n  \"foremanName\": \"张师傅\",\n  \"foremanPhone\": \"13800138000\",\n  \"stage\": \"完工阶段\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Leads",
      "item": [
        {
          "name": "Get Leads",
          "request": {
            "method": "GET",
            "url": "http://localhost:3600/api/leads"
          }
        },
        {
          "name": "Create Lead",
          "request": {
            "method": "POST",
            "url": "http://localhost:3600/api/leads",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"张三\",\n  \"phone\": \"13800138000\",\n  \"propertyType\": \"apartment\",\n  \"area\": 120,\n  \"budget\": 30,\n  \"styles\": [\"modern\", \"nordic\"],\n  \"stage\": \"design_and_construction\",\n  \"timeline\": \"within_1_month\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 测试检查清单

### 案例 API ✅

- [ ] `GET /api/cases` - 获取空列表 (首次运行)
- [ ] `POST /api/cases` - 创建案例成功
- [ ] `GET /api/cases` - 获取包含新案例的列表
- [ ] `GET /api/cases/[id]` - 获取案例详情
- [ ] `PUT /api/cases/[id]` - 更新案例成功
- [ ] `DELETE /api/cases/[id]` - 删除案例成功
- [ ] `GET /api/cases?style=modern` - 筛选功能正常
- [ ] `GET /api/cases?minArea=100&maxArea=200` - 范围筛选正常
- [ ] `GET /api/cases?featured=true` - 推荐筛选正常
- [ ] `POST /api/cases` (缺少字段) - 返回 400 错误
- [ ] `GET /api/cases/invalid-id` - 返回 404 错误

### 潜客 API ✅

- [ ] `POST /api/leads` - 提交潜客信息成功
- [ ] 自动评分正确 (检查返回的 score 字段)
- [ ] `GET /api/leads` - 获取潜客列表
- [ ] `GET /api/leads/[id]` - 获取潜客详情
- [ ] `PUT /api/leads/[id]` - 更新状态成功
- [ ] `DELETE /api/leads/[id]` - 删除潜客成功
- [ ] `GET /api/leads?status=pending` - 状态筛选正常
- [ ] `GET /api/leads?minScore=80` - 评分筛选正常
- [ ] `GET /api/leads?sortBy=score&order=desc` - 排序功能正常
- [ ] `POST /api/leads` (无效手机号) - 返回 400 错误
- [ ] `GET /api/leads/invalid-id` - 返回 404 错误

### 潜客评分验证 ✅

测试不同预算的评分:

| 预算(万) | 面积(㎡) | 时间 | 预期评分 | 等级 |
|---------|---------|------|---------|------|
| 50 | 200 | 1个月内 | 100 | A级 |
| 30 | 150 | 1个月内 | 90 | A级 |
| 20 | 120 | 1-3个月 | 83 | B级 |
| 10 | 80 | 3-6个月 | 69 | C级 |
| 5 | 50 | 暂无计划 | 62 | C级 |

---

## 故障排除

### 问题 1: 连接被拒绝

**错误**: `curl: (7) Failed to connect to localhost port 3600`

**解决**:
```bash
# 检查开发服务器是否运行
ps aux | grep "next dev"

# 如果没有运行,启动它
npm run dev
```

### 问题 2: 数据库连接错误

**错误**: API 返回 500 错误,日志显示数据库连接失败

**解决**:
```bash
# 检查 PostgreSQL 状态
./scripts/db-manager.sh status

# 如果未运行,启动它
./scripts/db-manager.sh start

# 检查 .env 文件中的 DATABASE_URL 是否正确
cat .env | grep DATABASE_URL
```

### 问题 3: Prisma 找不到表

**错误**: `The table "public.Case" does not exist`

**解决**:
```bash
# 运行 Prisma 迁移
./scripts/db-manager.sh migrate

# 或者
npx prisma db push
```

### 问题 4: 测试脚本没有输出

**原因**: 可能是脚本权限问题

**解决**:
```bash
# 添加执行权限
chmod +x scripts/test-api.sh

# 运行
./scripts/test-api.sh
```

---

## 查看测试日志

开发服务器会在终端显示所有 API 请求:

```
GET /api/cases 200 in 45ms
POST /api/cases 201 in 123ms
GET /api/leads 200 in 32ms
```

如果看到错误:
```
GET /api/cases/invalid-id 404 in 12ms
POST /api/cases 400 in 8ms
```

可以检查终端中的详细错误日志。

---

## 下一步

测试通过后,可以继续:

1. ✅ 开发前端页面
2. ✅ 添加 NextAuth.js 认证
3. ✅ 创建示例数据
4. ✅ 部署到 Vercel

---

**文档创建时间**: 2026-01-17
**适用版本**: dcWeb v1.0.0
