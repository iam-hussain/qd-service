import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

try {
  await prisma.$connect();
  const tableNames = (await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) as any[];
  console.table(tableNames);

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  console.log('DB truncated successfully!');
} catch (error) {
  console.log({ error });
}
