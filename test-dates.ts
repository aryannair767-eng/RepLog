import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.workoutSession.findMany({ select: { startTime: true } });
  
  if (sessions.length > 0) {
      sessions.sort((a,b) => b.startTime.getTime() - a.startTime.getTime());
      console.log(`Newest Session: ${sessions[0].startTime}`);
      console.log(`Oldest Session: ${sessions[sessions.length - 1].startTime}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
