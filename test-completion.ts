import { prisma } from './src/lib/prisma';
async function run() {
  const sets = await prisma.setLog.findMany();
  console.log("TOTAL SETS:", sets.length);
  for (const s of sets) {
    console.log(`- Set ${s.id}: completed=${s.isCompleted}, weight=${s.weight}, reps=${s.reps}`);
  }
}
run();
