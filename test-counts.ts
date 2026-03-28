import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "cmmyw76uc00017oxx55nfizny"; // using DEMO_USER_ID

  const active = await prisma.workoutSession.count({ where: { userId, isActive: true } });
  const completed = await prisma.workoutSession.count({ where: { userId, isActive: false } });
  const otherUser = await prisma.workoutSession.count({ where: { userId: { not: userId } } });

  console.log(`Active for user: ${active}`);
  console.log(`Completed for user: ${completed}`);
  console.log(`Other users: ${otherUser}`);
  
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

  console.log(`\nFetched from DB: ${sessions.length}`);
  sessions.forEach(s => {
      const sets = s.logs.reduce((sum, log) => sum + log.sets.length, 0);
      console.log(`- ${s.name}: logs=${s._count.logs}, sets=${sets}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
