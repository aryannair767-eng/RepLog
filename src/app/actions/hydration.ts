"use server";
import { getActiveSession, getPreviousSessions } from "./session";
import { getDashboardStats, getGeneralExercises, getPersonalExercises } from "./stats";
import { getAuthUserId } from "@/lib/auth";

export async function getHydrationData() {
  const userId = await getAuthUserId();
  
  const [activeSession, stats, previousSessions, generalEx, personalEx] = await Promise.all([
    getActiveSession(),
    getDashboardStats(),
    getPreviousSessions(),
    getGeneralExercises(),
    getPersonalExercises(),
  ]);

  return {
    activeSession,
    stats,
    previousSessions,
    allExercises: [...generalEx, ...personalEx]
  };
}
