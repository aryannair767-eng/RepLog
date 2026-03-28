import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const users = await p.user.count();
  const exercises = await p.exercise.count();
  const accounts = await p.account.count();
  const sessions = await p.workoutSession.count();
  const logs = await p.workoutLog.count();
  const sets = await p.setLog.count();
  console.log("Table counts:");
  console.log("  users:", users);
  console.log("  exercises:", exercises);
  console.log("  accounts:", accounts);
  console.log("  workout_sessions:", sessions);
  console.log("  workout_logs:", logs);
  console.log("  set_logs:", sets);
}
main().catch(console.error).finally(() => p["$disconnect"]());
