// ============================================================
// src/lib/prisma.ts
//
// This creates ONE Prisma client and reuses it across the app.
// Without this, Next.js hot-reload in dev would create hundreds
// of DB connections and crash Supabase's free tier.
//
// You never need to change this file.
// ============================================================

import { PrismaClient } from "@prisma/client";

// Attach to globalThis so hot-reload doesn't create new clients
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"] // show SQL queries in terminal during dev
        : ["error"],                 // only show errors in production
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
