import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Finding custom exercises to delete...');
  
  // Find all custom exercises
  const customExercises = await prisma.exercise.findMany({
    where: { mechanics: "Custom" }
  });

  console.log(`Found ${customExercises.length} custom exercises.`);

  if (customExercises.length > 0) {
    const ids = customExercises.map(e => e.id);
    
    console.log('Deleting associated WorkoutLogs to satisfy foreign key constraints...');
    const deletedLogs = await prisma.workoutLog.deleteMany({
      where: { exerciseId: { in: ids } }
    });
    console.log(`Deleted ${deletedLogs.count} associated workout logs.`);

    console.log('Deleting custom exercises...');
    const deletedEx = await prisma.exercise.deleteMany({
      where: { id: { in: ids } }
    });
    console.log(`Deleted ${deletedEx.count} custom exercises.`);
  }

  console.log('Cleanup complete.');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
