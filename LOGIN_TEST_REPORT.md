# 管理员登录功能测试报告

## 测试日期
2026-01-18

## 测试环境
- **项目**: 德川装饰官网 (dcWeb)
- **技术栈**: Next.js 16 + NextAuth 5 + PostgreSQL + Prisma
- **认证方式**: Credentials Provider (用户名/密码)
- **密码加密**: bcryptjs

## 代码审查结果

### 1. 登录页面 (`app/admin/login/page.tsx`)
✅ **通过审查**

**核心功能**:
- 用户名/密码表单
- 客户端表单验证(required)
- 加载状态管理
- 错误消息显示
- 使用 NextAuth 的 `signIn` 方法

**安全性**:
- ✅ 密码输入框type="password"
- ✅ 登录失败时显示通用错误("用户名或密码错误")
- ✅ 使用 redirect: false 避免自动重定向
- ✅ 禁用按钮状态防止重复提交

**用户体验**:
- ✅ 加载状态提示("登录中...")
- ✅ 错误提示样式清晰
- ✅ 提供默认账户提示(admin / admin123)
- ✅ 返回首页链接

### 2. 认证配置 (`lib/auth.ts`)
✅ **通过审查**

**核心流程**:
```typescript
1. 接收凭据(username, password)
2. 查询数据库中的管理员记录
3. 使用bcrypt比较密码哈希
4. 返回用户信息或null
```

**安全实现**:
- ✅ 使用 bcryptjs 进行密码验证
- ✅ 不返回密码到客户端
- ✅ JWT session策略
- ✅ 错误捕获和日志记录
- ✅ 配置了NEXTAUTH_SECRET

**会话管理**:
- ✅ JWT token包含用户ID和username
- ✅ Session包含用户基本信息
- ✅ 正确配置登录页面路径

### 3. 数据模型 (`prisma/schema.prisma`)
✅ **通过审查**

**Admin模型**:
```prisma
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique  // ← 唯一索引
  password  String   // 存储哈希密码
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**安全性**:
- ✅ username字段设置unique约束
- ✅ 密码字段用于存储哈希值
- ✅ 使用cuid作为主键

### 4. 种子数据 (`prisma/seed.ts`)
⚠️ **发现问题**

**问题**:
```typescript
// ❌ 错误: 使用了 prisma.user 但schema中是 Admin
await prisma.user.create({...})
// ✅ 应该是:
await prisma.admin.create({...})
```

**影响**:
- 种子数据创建会失败
- 无法通过seed命令创建默认管理员账户

**建议修复**:
```typescript
// 第12行
await prisma.admin.deleteMany({});  // user → admin

// 第16行
const admin = await prisma.admin.create({  // user → admin
  data: {
    username: 'admin',
    password: '$2a$10$...真实的bcrypt哈希...',  // 需要生成真实哈希
    name: '系统管理员',
  },
});
```

## 功能测试场景

### 场景 1: 正常登录流程
**步骤**:
1. 访问 `/admin/login`
2. 输入正确的用户名: `admin`
3. 输入正确的密码: `admin123`
4. 点击"登录"按钮

**预期结果**:
- ✅ 显示"登录中..."状态
- ✅ 认证成功
- ✅ 重定向到 `/admin`
- ✅ 创建有效的session

### 场景 2: 错误密码
**步骤**:
1. 输入用户名: `admin`
2. 输入错误密码: `wrongpassword`
3. 点击登录

**预期结果**:
- ✅ 显示错误消息: "用户名或密码错误"
- ✅ 不创建session
- ✅ 停留在登录页面

### 场景 3: 不存在的用户
**步骤**:
1. 输入用户名: `nonexistent`
2. 输入任意密码
3. 点击登录

**预期结果**:
- ✅ 显示错误消息: "用户名或密码错误"
- ✅ 不创建session

### 场景 4: 空输入验证
**步骤**:
1. 留空用户名或密码
2. 尝试提交

**预期结果**:
- ✅ HTML5表单验证阻止提交
- ✅ 浏览器显示"请填写此字段"

### 场景 5: 网络错误处理
**步骤**:
1. 模拟网络请求失败
2. 尝试登录

**预期结果**:
- ✅ 显示错误消息: "登录失败,请稍后重试"
- ✅ 重新启用登录按钮

## 自动化测试脚本

已创建测试脚本:
- `test-login.js` - Node.js自动化测试
- `test-login-manual.sh` - Bash手动测试脚本

**运行方法**:
```bash
# 确保服务器运行
npm run dev

# 运行自动化测试
npx tsx test-login.js

# 或运行手动测试
bash test-login-manual.sh
```

## 测试前置条件

### 1. 启动数据库
```bash
npm run db:start
```

### 2. 初始化数据库
```bash
npm run db:push
```

### 3. 创建管理员账户(手动)
由于seed.ts有bug,需要手动创建:

```bash
# 方式1: 使用Prisma Studio
npx prisma studio
# 在Admin表中手动添加记录

# 方式2: 使用脚本生成密码哈希
npx tsx -e "
import { hash } from 'bcryptjs';
const hashed = await hash('admin123', 10);
console.log('密码哈希:', hashed);
"

# 然后在Prisma Studio中创建Admin记录:
# username: admin
# password: (上面生成的哈希)
# name: 系统管理员
```

### 4. 启动开发服务器
```bash
npm run dev
```

## 当前测试限制

由于测试环境限制,未能完成实际的E2E测试:
- ❌ 数据库未启动(Docker Desktop需要启动)
- ❌ 服务器端口占用问题
- ❌ 种子数据创建失败(代码bug)

## 安全性评估

### ✅ 已实现的安全措施
1. **密码保护**: 使用bcrypt哈希存储
2. **输入验证**: 前端和后端双重验证
3. **通用错误消息**: 不泄露用户是否存在
4. **JWT会话**: 使用签名token
5. **CSRF保护**: NextAuth内置支持
6. **唯一用户名**: 数据库unique约束

### ⚠️ 建议改进
1. **登录限流**: 添加防暴力破解机制
2. **日志审计**: 记录登录尝试
3. **会话过期**: 配置合理的JWT过期时间
4. **双因素认证**: 考虑添加2FA
5. **密码强度**: 添加密码复杂度要求

## 测试结论

### 代码质量: ⭐⭐⭐⭐☆ (4/5)
- 核心认证逻辑正确
- 安全实践良好
- 存在小bug(seed.ts)

### 安全性: ⭐⭐⭐⭐☆ (4/5)
- 基本安全措施完善
- 可添加更多防护

### 用户体验: ⭐⭐⭐⭐⭐ (5/5)
- 界面美观
- 错误提示清晰
- 加载状态完善

## 修复建议

### 高优先级 (必须修复)
1. **修复seed.ts**: 将`prisma.user`改为`prisma.admin`
2. **生成真实密码哈希**: 使用bcrypt生成admin123的哈希值

### 中优先级 (建议修复)
1. **添加环境变量验证**: 检查NEXTAUTH_SECRET是否设置
2. **添加登录日志**: 记录成功/失败的登录尝试
3. **添加登录限流**: 防止暴力破解

### 低优先级 (可选优化)
1. **添加"记住我"功能**: 延长session有效期
2. **添加"忘记密码"功能**: 密码重置流程
3. **添加多管理员支持**: 角色权限系统

## 附录: 修复后的seed.ts代码

```typescript
// 生成密码哈希的辅助脚本
import { hash } from 'bcryptjs';

async function generatePasswordHash() {
  const password = 'admin123';
  const hashed = await hash(password, 10);
  console.log('Generated hash:', hashed);
  return hashed;
}

// 在seed.ts中使用
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始创建种子数据...');

  // 清空现有数据
  console.log('清空现有数据...');
  await prisma.lead.deleteMany({});
  await prisma.case.deleteMany({});
  await prisma.admin.deleteMany({});  // ✅ 修复: user → admin

  // 创建管理员用户
  console.log('创建管理员用户...');
  const hashedPassword = await hash('admin123', 10);  // ✅ 修复: 生成真实哈希

  const admin = await prisma.admin.create({  // ✅ 修复: user → admin
    data: {
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
    },
  });
  console.log(`✅ 管理员创建成功: ${admin.name}`);

  // ... 其余代码不变
}
```

## 手动测试清单

### 前置准备
- [ ] Docker Desktop 已启动
- [ ] PostgreSQL 容器运行中 (`npm run db:start`)
- [ ] 数据库已初始化 (`npm run db:push`)
- [ ] 管理员账户已创建
- [ ] 开发服务器运行中 (`npm run dev`)

### 功能测试
- [ ] 访问 http://localhost:3600/admin/login 页面正常显示
- [ ] 输入正确凭据能成功登录
- [ ] 登录成功后重定向到 /admin
- [ ] 输入错误密码显示错误提示
- [ ] 输入不存在的用户名显示错误提示
- [ ] 空输入触发表单验证
- [ ] 登录状态在页面刷新后保持
- [ ] 点击"返回首页"链接正常跳转

### 安全测试
- [ ] 密码输入框以密文显示
- [ ] 错误提示不泄露用户是否存在
- [ ] Network标签中看不到明文密码
- [ ] JWT token存储在httpOnly cookie中
- [ ] 登录失败后可以重试

---

**测试人员**: Claude Code
**测试方式**: 代码审查 + 自动化测试脚本
**测试状态**: 代码审查完成,实际运行测试受环境限制未完成
**总体评价**: 登录功能实现正确,代码质量良好,存在一个seed.ts的小bug需要修复
