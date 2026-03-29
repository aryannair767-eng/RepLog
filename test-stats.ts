import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userId = 'cmnapzg9000006878cqkmquim'
  
  // What getWeekStart() does:
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  console.log("Week start:", weekAgo)

  const thisWeekSets = await prisma.setLog.findMany({
    where: {
      isCompleted: true,
      workoutLog: { session: { userId, startTime: { gte: weekAgo } } },
    },
    select: {
      id: true,
      weight: true,
      reps: true,
      rpe: true,
      rir: true,
      workoutLog: {
        select: {
          exercise: { select: { name: true, primaryMuscle: true } },
          session: { select: { startTime: true } },
        },
      },
    },
  });

  console.log(`Found ${thisWeekSets.length} sets for this week.`)
  console.log(JSON.stringify(thisWeekSets, null, 2))
}

main().catch(console.error)
