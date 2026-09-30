import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL || "";
  if (!url || url.includes("johndoe:randompassword@localhost:5432")) {
    return false;
  }
  return true;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [], // Suppress noisy unhandled connection spam in dev terminal when local DB is offline
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
