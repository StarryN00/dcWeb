# API 路由文档

## 概述

本项目实现了完整的 RESTful API 路由,包括案例管理和潜客管理两大模块。所有 API 遵循统一的响应格式。

**服务器地址**: http://localhost:3600

## 响应格式规范

### 成功响应
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功" // 可选
}
```

### 错误响应
```json
{
  "success": false,
  "error": "用户友好的错误描述",
  "message": "详细的错误信息" // 可选
}
```

---

## 案例相关 API

### 1. 获取案例列表
**端点**: `GET /api/cases`

**查询参数**:
- `style` (string, 可选): 装修风格筛选
- `minArea` (number, 可选): 最小面积(㎡)
- `maxArea` (number, 可选): 最大面积(㎡)
- `minPrice` (number, 可选): 最小价格(万元)
- `maxPrice` (number, 可选): 最大价格(万元)
- `status` (string, 可选): 状态筛选 (默认只返回 `published`)
- `featured` (boolean, 可选): 是否只返回推荐案例

**示例请求**:
```bash
# 获取所有已发布案例
curl http://localhost:3600/api/cases

# 筛选现代风格、100-200㎡、20-50万的案例
curl http://localhost:3600/api/cases?style=modern&minArea=100&maxArea=200&minPrice=20&maxPrice=50

# 只获取推荐案例
curl http://localhost:3600/api/cases?featured=true
```

**响应示例**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "cm6j1x2y3000008l5abc12345",
      "title": "现代极简风格住宅",
      "location": "北京 · 朝阳区",
      "style": "modern",
      "area": 120,
      "duration": 60,
      "price": 25,
      "images": ["https://example.com/image1.jpg"],
      "description": "...",
      "testimonial": "...",
      "foremanName": "张师傅",
      "foremanPhone": "13800138000",
      "stage": "完工阶段",
      "featured": true,
      "status": "published",
      "createdAt": "2026-01-17T10:00:00.000Z",
      "updatedAt": "2026-01-17T10:00:00.000Z"
    }
  ]
}
```

---

### 2. 创建案例
**端点**: `POST /api/cases`

**认证**: 需要管理员权限 (未来实现)

**请求体** (JSON):
```json
{
  "title": "案例标题",
  "location": "城市 · 区域",
  "style": "modern", // 必须是枚举值: modern, nordic, industrial, wabi-sabi, luxury, minimalist, chinese, european
  "area": 120, // 面积(㎡), 必须是正数
  "duration": 60, // 工期(天), 必须是正数
  "price": 25.5, // 价格(万元), 必须是正数
  "images": ["https://example.com/image1.jpg"], // 至少1张图片
  "description": "项目描述...",
  "testimonial": "业主感言...",
  "foremanName": "张师傅",
  "foremanPhone": "13800138000",
  "stage": "完工阶段",
  "featured": false, // 可选,默认 false
  "status": "draft" // 可选,默认 draft
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "案例创建成功",
  "data": { ... }
}
```

**错误示例**:
```json
{
  "success": false,
  "error": "缺少必填字段",
  "missingFields": ["title", "location"]
}
```

---

### 3. 获取单个案例详情
**端点**: `GET /api/cases/[id]`

**示例请求**:
```bash
curl http://localhost:3600/api/cases/cm6j1x2y3000008l5abc12345
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "cm6j1x2y3000008l5abc12345",
    "title": "现代极简风格住宅",
    // ... 完整案例信息
  }
}
```

**错误示例** (404):
```json
{
  "success": false,
  "error": "案例不存在"
}
```

---

### 4. 更新案例
**端点**: `PUT /api/cases/[id]`

**认证**: 需要管理员权限 (未来实现)

**请求体** (JSON): 只需提供需要更新的字段
```json
{
  "status": "published",
  "featured": true
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "案例更新成功",
  "data": { ... }
}
```

---

### 5. 删除案例
**端点**: `DELETE /api/cases/[id]`

**认证**: 需要管理员权限 (未来实现)

**响应示例**:
```json
{
  "success": true,
  "message": "案例删除成功"
}
```

---

## 潜客相关 API

### 1. 获取潜客列表
**端点**: `GET /api/leads`

**认证**: 需要管理员权限 (未来实现)

**查询参数**:
- `status` (string, 可选): 状态筛选 (pending/contacted/scheduled/closed/abandoned)
- `minScore` (number, 可选): 最低评分
- `maxScore` (number, 可选): 最高评分
- `sortBy` (string, 可选): 排序字段 (score/submittedAt), 默认 score
- `order` (string, 可选): 排序方向 (asc/desc), 默认 desc

**示例请求**:
```bash
# 获取所有潜客
curl http://localhost:3600/api/leads

# 获取待跟进的高分潜客(80分以上)
curl http://localhost:3600/api/leads?status=pending&minScore=80

# 按提交时间倒序排列
curl http://localhost:3600/api/leads?sortBy=submittedAt&order=desc
```

**响应示例**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "cm6j2a1b2000008l5def67890",
      "name": "张三",
      "phone": "13800138000",
      "propertyType": "apartment",
      "area": 120,
      "budget": 30,
      "styles": ["modern", "nordic"],
      "stage": "design_and_construction",
      "timeline": "1_month",
      "score": 85,
      "status": "pending",
      "submittedAt": "2026-01-17T10:00:00.000Z",
      "updatedAt": "2026-01-17T10:00:00.000Z"
    }
  ]
}
```

---

### 2. 提交潜客信息
**端点**: `POST /api/leads`

**认证**: 公开接口,无需认证

**请求体** (JSON):
```json
{
  "name": "张三", // 必填
  "phone": "13800138000", // 必填,11位手机号
  "propertyType": "apartment", // 必填: residence, apartment, villa, commercial, other
  "area": 120, // 必填,面积(㎡),必须是正数
  "budget": 30, // 必填,预算(万元),必须是正数
  "styles": ["modern", "nordic"], // 必填,至少选择1种风格
  "stage": "design_and_construction", // 必填: design_only, design_and_construction, construction_only, supervision_only
  "timeline": "1_month" // 必填: within_1_month, 1_to_3_months, 3_to_6_months, over_6_months, no_plan
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "提交成功,我们会尽快与您联系",
  "data": { ... },
  "score": 85 // 自动计算的评分
}
```

**错误示例**:
```json
{
  "success": false,
  "error": "请输入有效的手机号"
}
```

---

### 3. 获取单个潜客详情
**端点**: `GET /api/leads/[id]`

**认证**: 需要管理员权限 (未来实现)

**示例请求**:
```bash
curl http://localhost:3600/api/leads/cm6j2a1b2000008l5def67890
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "cm6j2a1b2000008l5def67890",
    "name": "张三",
    // ... 完整潜客信息
  }
}
```

---

### 4. 更新潜客状态
**端点**: `PUT /api/leads/[id]`

**认证**: 需要管理员权限 (未来实现)

**请求体** (JSON):
```json
{
  "status": "contacted" // pending, contacted, scheduled, closed, abandoned
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "潜客信息更新成功",
  "data": { ... }
}
```

**错误示例**:
```json
{
  "success": false,
  "error": "无效的状态值",
  "validStatuses": ["pending", "contacted", "scheduled", "closed", "abandoned"]
}
```

---

### 5. 删除潜客
**端点**: `DELETE /api/leads/[id]`

**认证**: 需要管理员权限 (未来实现)

**响应示例**:
```json
{
  "success": true,
  "message": "潜客删除成功"
}
```

---

## 潜客评分算法

**评分规则**:
- **基础分**: 50分
- **预算评分** (最高+30分):
  - ≥50万: +30分
  - ≥30万: +25分
  - ≥20万: +20分
  - ≥10万: +15分
  - <10万: +10分
- **面积评分** (最高+10分):
  - ≥200㎡: +10分
  - ≥150㎡: +8分
  - ≥100㎡: +6分
  - ≥80㎡: +4分
  - <80㎡: +2分
- **时间评分** (最高+10分):
  - 1个月内: +10分
  - 1-3个月: +7分
  - 3-6个月: +5分
  - 6个月以上: +3分
  - 暂无计划: +0分

**评分等级**:
- **A级** (90-100分): 高优先级潜客
- **B级** (75-89分): 中高优先级潜客
- **C级** (60-74分): 中等优先级潜客
- **D级** (50-59分): 低优先级潜客

---

## 枚举值参考

### CaseStyle (案例风格)
```typescript
type CaseStyle =
  | 'modern'       // 现代
  | 'nordic'       // 北欧
  | 'industrial'   // 工业
  | 'wabi_sabi'    // 侘寂
  | 'luxury'       // 轻奢
  | 'minimalist'   // 极简
  | 'chinese'      // 中式
  | 'european';    // 欧式
```

### CaseStatus (案例状态)
```typescript
type CaseStatus =
  | 'published'    // 已发布
  | 'draft';       // 草稿
```

### PropertyType (物业类型)
```typescript
type PropertyType =
  | 'residence'    // 住宅
  | 'apartment'    // 公寓
  | 'villa'        // 别墅
  | 'commercial'   // 商业空间
  | 'other';       // 其他
```

### RenovationStage (装修阶段)
```typescript
type RenovationStage =
  | 'design_only'             // 仅设计
  | 'design_and_construction' // 设计+施工
  | 'construction_only'       // 仅施工
  | 'supervision_only';       // 仅监理
```

### Timeline (时间规划)
```typescript
type Timeline =
  | 'within_1_month'   // 1个月内
  | '1_to_3_months'    // 1-3个月
  | '3_to_6_months'    // 3-6个月
  | 'over_6_months'    // 6个月以上
  | 'no_plan';         // 暂无计划
```

### LeadStatus (潜客状态)
```typescript
type LeadStatus =
  | 'pending'      // 待跟进
  | 'contacted'    // 已联系
  | 'scheduled'    // 已预约
  | 'closed'       // 已成交
  | 'abandoned';   // 已放弃
```

---

## 错误码说明

| HTTP状态码 | 说明 |
|-----------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误(缺少必填字段、数据格式错误等) |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 测试建议

### 使用 curl 测试

**创建案例**:
```bash
curl -X POST http://localhost:3600/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试案例",
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

**提交潜客**:
```bash
curl -X POST http://localhost:3600/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "phone": "13800138000",
    "propertyType": "apartment",
    "area": 120,
    "budget": 30,
    "styles": ["modern", "nordic"],
    "stage": "design_and_construction",
    "timeline": "within_1_month"
  }'
```

### 使用 Postman/Insomnia 测试

推荐使用 Postman 或 Insomnia 等工具测试 API,可以方便地保存请求、查看响应、测试不同的参数组合。

---

## 下一步开发

1. **NextAuth.js 认证**: 为管理员路由添加认证保护
2. **前端页面**: 开发对应的前端页面调用这些 API
3. **数据验证**: 使用 Zod 添加更严格的数据验证
4. **错误日志**: 集成 Sentry 或其他日志服务
5. **API 文档**: 考虑使用 Swagger/OpenAPI 生成交互式文档

---

**文档版本**: v1.0.0
**最后更新**: 2026-01-17
