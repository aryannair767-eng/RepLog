import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { sessions: true } }
    }
  });

  console.log(`Found ${users.length} users in the database.`);
  for (const u of users) {
      console.log(`User: ${u.id} (${u.email}) -> ${u._count.sessions} sessions`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
