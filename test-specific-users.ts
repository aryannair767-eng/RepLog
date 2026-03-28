import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "cmn0npadl000nxfk6kwt49y7a";

  const active = await prisma.workoutSession.count({ where: { userId, isActive: true } });
  const completed = await prisma.workoutSession.count({ where: { userId, isActive: false } });

  console.log(`For user cmn0npadl000nxfk6kwt49y7a:`);
  console.log(`Active: ${active}`);
  console.log(`Completed: ${completed}`);
  
  const userId2 = "cmn0astp00005hphyl7s0reis";
  const active2 = await prisma.workoutSession.count({ where: { userId: userId2, isActive: true } });
  const completed2 = await prisma.workoutSession.count({ where: { userId: userId2, isActive: false } });

  console.log(`\nFor user cmn0astp00005hphyl7s0reis:`);
  console.log(`Active: ${active2}`);
  console.log(`Completed: ${completed2}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
