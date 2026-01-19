import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 从环境变量解析数据库连接信息
const databaseUrl = process.env.DATABASE_URL || 'postgresql://dcweb_user:dcweb_password_2024@localhost:5432/dcweb_db?schema=public';

// 创建 PostgreSQL 连接池
const pool = new Pool({
  connectionString: databaseUrl,
});

// 创建 Prisma adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
