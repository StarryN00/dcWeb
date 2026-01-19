# 🚀 快速测试 API

## 开始测试前,请按照以下步骤操作:

### 步骤 1: 启动 PostgreSQL

```bash
# 如果还没有安装 PostgreSQL
./scripts/install-postgres.sh

# 初始化数据库
./scripts/db-manager.sh init

# 检查状态
./scripts/db-manager.sh status
```

### 步骤 2: 运行 Prisma 迁移

```bash
npm run db:push
```

### 步骤 3: 启动开发服务器(在另一个终端)

```bash
npm run dev
```

### 步骤 4: 运行测试

```bash
# 方法一: 自动化测试(推荐)
./scripts/test-api.sh

# 方法二: 创建示例数据后手动测试
npm run db:seed
npm run db:studio
```

---

## 📚 详细文档

- [快速开始指南](./docs/TESTING_QUICK_START.md) - **从这里开始**
- [完整测试文档](./docs/API_TESTING.md)
- [API 文档](./docs/API.md)
- [PostgreSQL 安装](./docs/POSTGRESQL_SETUP.md)

---

## ❓ 常见问题

**Q: PostgreSQL 未安装怎么办?**
A: 运行 `./scripts/install-postgres.sh`

**Q: 测试脚本没有执行权限?**
A: 运行 `chmod +x scripts/test-api.sh`

**Q: 数据库连接失败?**
A: 运行 `./scripts/db-manager.sh start` 启动 PostgreSQL

---

准备好了就运行: `./scripts/test-api.sh` 🎯
