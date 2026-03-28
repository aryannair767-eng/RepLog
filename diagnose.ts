import { prisma } from './src/lib/prisma';

async function diagnose() {
  // 1. Who is in the database?
  const users = await prisma.user.findMany();
  console.log("=== USERS ===");
  for (const u of users) {
    console.log(`  id=${u.id}  email=${u.email}  name=${u.name}`);
  }

  // 2. What sessions exist?
  const sessions = await prisma.workoutSession.findMany({ 
    include: { _count: { select: { logs: true } } } 
  });
  console.log("\n=== SESSIONS ===");
  for (const s of sessions) {
    console.log(`  id=${s.id}  userId=${s.userId}  active=${s.isActive}  startTime=${s.startTime.toISOString()}  logs=${s._count.logs}`);
  }

  // 3. What sets exist?
  const sets = await prisma.setLog.findMany({
    include: {
      workoutLog: {
        include: {
          exercise: { select: { name: true, primaryMuscle: true } },
          session: { select: { userId: true, startTime: true, isActive: true } },
        }
      }
    }
  });
  console.log("\n=== SETS ===");
  for (const s of sets) {
    console.log(`  setId=${s.id}  completed=${s.isCompleted}  weight=${s.weight}  reps=${s.reps}  exercise=${s.workoutLog.exercise.name}  muscle=${s.workoutLog.exercise.primaryMuscle}  sessionUserId=${s.workoutLog.session.userId}  sessionStart=${s.workoutLog.session.startTime.toISOString()}  sessionActive=${s.workoutLog.session.isActive}`);
  }

  // 4. Simulate getDashboardStats query
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);
  console.log(`\n=== WEEK START: ${weekStart.toISOString()} ===`);

  if (users.length > 0) {
    const userId = users[0].id;
    console.log(`\nQuerying stats for userId: ${userId}`);
    
    const thisWeekSets = await prisma.setLog.findMany({
      where: {
        isCompleted: true,
        workoutLog: { session: { userId, startTime: { gte: weekStart } } },
      },
    });
    console.log(`  thisWeekSets (completed, this week, this user): ${thisWeekSets.length}`);

    // Without userId filter
    const allCompletedSets = await prisma.setLog.findMany({
      where: { isCompleted: true },
    });
    console.log(`  allCompletedSets (no user filter): ${allCompletedSets.length}`);

    // Without date filter  
    const allUserSets = await prisma.setLog.findMany({
      where: {
        isCompleted: true,
        workoutLog: { session: { userId } },
      },
    });
    console.log(`  allUserSets (this user, no date filter): ${allUserSets.length}`);
    
    // Without completed filter
    const allSetsThisWeek = await prisma.setLog.findMany({
      where: {
        workoutLog: { session: { userId, startTime: { gte: weekStart } } },
      },
    });
    console.log(`  allSetsThisWeek (this user, this week, any completion): ${allSetsThisWeek.length}`);
  }

  await prisma.$disconnect();
}

diagnose().catch(console.error);
