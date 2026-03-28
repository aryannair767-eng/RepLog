import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.workoutSession.findMany({ select: { userId: true, id: true, name: true }});
  const usersWithSessions = new Set(sessions.map(s => s.userId));
  console.log(`There are ${sessions.length} sessions belonging to userIds:`, [...usersWithSessions]);
}

main().catch(console.error).finally(() => prisma.$disconnect());
