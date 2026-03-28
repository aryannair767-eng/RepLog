import { prisma } from './src/lib/prisma';

async function diagnose2() {
  // Check exercises
  const exCount = await prisma.exercise.count();
  console.log(`Total exercises in DB: ${exCount}`);
  
  // Check first few exercise IDs
  const exercises = await prisma.exercise.findMany({ take: 3, select: { id: true, name: true } });
  console.log("Sample exercise IDs:");
  for (const e of exercises) {
    console.log(`  ${e.id} → ${e.name}`);
  }

  // Check workout logs
  const logs = await prisma.workoutLog.findMany({ include: { exercise: true, session: true } });
  console.log(`\nTotal workout_logs: ${logs.length}`);
  for (const l of logs) {
    console.log(`  logId=${l.id} exerciseId=${l.exerciseId} sessionId=${l.sessionId}`);
  }

  // Check if the session's user matches
  const sessions = await prisma.workoutSession.findMany();
  const users = await prisma.user.findMany();
  console.log(`\nSession userId: ${sessions[0]?.userId}`);
  console.log(`User id: ${users[0]?.id}`);
  console.log(`Match: ${sessions[0]?.userId === users[0]?.id}`);

  // Try to manually create a workout log to test FK
  if (sessions.length > 0 && exercises.length > 0) {
    console.log(`\n=== ATTEMPTING TEST INSERT ===`);
    console.log(`Using sessionId=${sessions[0].id}, exerciseId=${exercises[0].id}`);
    try {
      const testLog = await prisma.workoutLog.create({
        data: {
          sessionId: sessions[0].id,
          exerciseId: exercises[0].id,
          orderIndex: 0,
          sets: {
            create: {
              setNumber: 1,
              weight: 50,
              reps: 10,
              rpe: 7,
              rir: 3,
              isCompleted: true,
            },
          },
        },
        include: { sets: true },
      });
      console.log(`SUCCESS! Created workoutLog: ${testLog.id} with ${testLog.sets.length} set(s)`);
      
      // Verify it's queryable by getDashboardStats logic
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      weekStart.setHours(0, 0, 0, 0);
      
      const statsQuery = await prisma.setLog.findMany({
        where: {
          isCompleted: true,
          workoutLog: { session: { userId: users[0].id, startTime: { gte: weekStart } } },
        },
      });
      console.log(`Stats query now returns: ${statsQuery.length} set(s)`);
      
    } catch (e: any) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  await prisma.$disconnect();
}

diagnose2().catch(console.error);
