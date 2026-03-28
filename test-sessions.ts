import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "cmmyw76uc00017oxx55nfizny"; // using DEMO_USER_ID from env
  const sessions = await prisma.workoutSession.findMany({
    where: { userId, isActive: false },
    orderBy: { startTime: "desc" },
    take: 20,
    include: {
      logs: {
        include: {
          sets: {
            where: { isCompleted: true },
            select: { id: true }
          }
        }
      },
      _count: { select: { logs: true } }
    },
  });

  const processed = sessions.map((s) => ({
    id: s.id,
    name: s.name,
    startTime: s.startTime,
    logCount: s._count.logs,
    completedSetCount: s.logs.reduce(
      (sum, log) => sum + log.sets.length, 0
    ),
  })).filter(s => !(s.completedSetCount === 0 && s.logCount === 0));
  
  console.log("Returned sessions length:", processed.length);
  console.log(processed.map(s => `${s.name}: logs=${s.logCount}, sets=${s.completedSetCount}`).join("\n"));
}

main().catch(console.error).finally(() => prisma.$disconnect());
