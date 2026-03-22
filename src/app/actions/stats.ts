"use server";
// ============================================================
// src/app/actions/stats.ts
//
// Fetches all the numbers shown on the dashboard:
// RPE average, weekly volume, frequency, muscle distribution.
//
// HOW TO MODIFY:
// - Change "this week" to "last 14 days"? Edit the weekStart
//   calculation below.
// - Add a new stat card? Add the calculation here and add the
//   new field to the DashboardStats type in types/replog.ts.
// ============================================================

import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/types/replog";
import { getAuthUserId } from "@/lib/auth";

// Helper: returns 7 days ago at midnight to prevent "data loss" on Monday reset.
function getWeekStart(): Date {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  return weekAgo;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const userId = await getAuthUserId();
  const weekStart = getWeekStart();

  // ── Single DB query: all completed sets this week ──────────
  // We fetch everything in one go and calculate in JS to avoid
  // multiple round-trips to the database.
  const thisWeekSets = await prisma.setLog.findMany({
    where: {
      isCompleted: true,
      workoutLog: {
        session: {
          userId,

          startTime: { gte: weekStart }, // "gte" = greater than or equal
        },
      },
    },
    include: {
      workoutLog: {
        include: {
          exercise: {
            select: { primaryMuscle: true }, // only fetch what we need
          },
          session: {
            select: { startTime: true },
          },
        },
      },
    },
  });

  // ── Average RPE ────────────────────────────────────────────
  // Filter out unlogged sets (RPE = 0)
  const loggedRpeSets = thisWeekSets.filter(s => s.rpe > 0);
  const avgRpe =
    loggedRpeSets.length > 0
      ? loggedRpeSets.reduce((sum, s) => sum + s.rpe, 0) / loggedRpeSets.length
      : 0;

  // ── Total volume in kg (weight × reps per set, summed) ─────
  const weeklyVolumeKg = thisWeekSets.reduce(
    (sum, s) => sum + Number(s.weight) * s.reps,
    0
  );

  // ── Weekly frequency (how many distinct days had a session) ─
  const sessionDays = new Set(
    thisWeekSets.map((s) =>
      new Date(s.workoutLog.session.startTime).toDateString()
    )
  );
  const weeklyFrequency = sessionDays.size;

  // ── Sets broken down by day of the week ─────────────────────
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const volumeByDay = DAY_LABELS.map((day, i) => {
    const targetDate = new Date(weekStart);
    targetDate.setDate(weekStart.getDate() + i);
    const targetStr = targetDate.toDateString();

    const daySets = thisWeekSets.filter(
      (s) => new Date(s.workoutLog.session.startTime).toDateString() === targetStr
    ).length;

    return { day, totalSets: daySets };
  });

  // ── Muscle distribution (sets per muscle group this week) ──
  const muscleCounts: Record<string, number> = {};
  for (const s of thisWeekSets) {
    const muscle = s.workoutLog.exercise.primaryMuscle;
    muscleCounts[muscle] = (muscleCounts[muscle] ?? 0) + 1;
  }
  const muscleDistribution = Object.entries(muscleCounts)
    .sort(([, a], [, b]) => b - a) // sort most-trained first
    .map(([muscle, sets]) => ({ muscle, sets }));

  // ── Recent PRs (highest weight per exercise, last 30 days) ─
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const heavySets = await prisma.setLog.findMany({
    where: {
      isCompleted: true,
      createdAt: { gte: thirtyDaysAgo },
      workoutLog: { session: { userId } },
    },
    orderBy: { weight: "desc" },
    include: {
      workoutLog: {
        include: { exercise: { select: { name: true } } },
      },
    },
    take: 100, // limit to avoid huge payloads
  });

  // Keep only the highest weight per exercise
  const prMap = new Map<string, { weight: number; date: string }>();
  for (const s of heavySets) {
    const name = s.workoutLog.exercise.name;
    if (!prMap.has(name)) {
      prMap.set(name, {
        weight: Number(s.weight),
        date: s.createdAt.toISOString().split("T")[0],
      });
    }
  }
  const recentPRs = Array.from(prMap.entries())
    .slice(0, 3)
    .map(([exerciseName, { weight, date }]) => ({ exerciseName, weight, date }));

  // ── Total historic sessions (to determine new vs veteran user) ─
  const totalSessionsEver = await prisma.workoutSession.count({
    where: { userId, isActive: false },
  });

  return {
    avgRpe: Math.round(avgRpe * 10) / 10, // round to 1 decimal
    weeklyVolumeKg: Math.round(weeklyVolumeKg),
    weeklyFrequency,
    totalSetsThisWeek: thisWeekSets.length,
    volumeByDay,
    recentPRs,
    muscleDistribution,
    totalSessionsEver,
  };
}

// ── getGeneralExercises ─────────────────────────────────────────
// Returns the full standard exercise library for the search modal.
export async function getGeneralExercises() {
  return prisma.exercise.findMany({
    where: { primaryMuscle: { not: "Custom" } },
    orderBy: [{ primaryMuscle: "asc" }, { name: "asc" }],
  });
}

// ── getPersonalExercises ────────────────────────────────────────
// Returns all exercises the user created themselves.
export async function getPersonalExercises() {
  const userId = await getAuthUserId();
  return prisma.exercise.findMany({
    where: { mechanics: "Custom", userId },
    orderBy: { name: "asc" },
  });
}

// ── searchExercises ───────────────────────────────────────────
// Filters the exercise library by name or muscle group.
// Called as the user types in the search box.
export async function searchExercises(query: string) {
  return prisma.exercise.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { primaryMuscle: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
    take: 20,
  });
}

// ── createLoggableExercise ──────────────────────────────────────
// Creates a new custom exercise securely associated with the user.
export async function createLoggableExercise(name: string, primaryMuscle: string): Promise<string> {
  const userId = await getAuthUserId();

  // First check if a general exercise or a personal exercise already exists with this exact name
  const existing = await prisma.exercise.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      OR: [
        { userId: null },   // General exercise
        { userId: userId }  // Personal exercise for this exact user
      ]
    },
  });
  if (existing) return existing.id;

  const newEx = await prisma.exercise.create({
    data: {
      name,
      primaryMuscle,
      mechanics: "Custom",
      userId,
    },
  });
  return newEx.id;
}

// ── getWeeklyMuscleVolume ───────────────────────────────────────
// Returns an array of { muscle: string, sets: number } for the past 7 days.
export async function getWeeklyMuscleVolume() {
  const userId = await getAuthUserId();
  const weekStart = getWeekStart();
  
  const thisWeekSets = await prisma.setLog.findMany({
    where: {
      isCompleted: true,
      workoutLog: {
        session: {
          userId,
          startTime: { gte: weekStart },
        },
      },
    },
    include: {
      workoutLog: {
        include: {
          exercise: { select: { primaryMuscle: true } },
        },
      },
    },
  });

  const muscleCounts: Record<string, number> = {};
  for (const s of thisWeekSets) {
    const muscle = s.workoutLog.exercise.primaryMuscle;
    muscleCounts[muscle] = (muscleCounts[muscle] ?? 0) + 1;
  }
  return Object.entries(muscleCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([muscle, sets]) => ({ muscle, sets }));
}

// ── getWeeklyMuscleFrequency ────────────────────────────────────
// Returns an array of { muscle: string, frequency: number } for this week.
// Frequency = number of distinct days the muscle was trained.
export async function getWeeklyMuscleFrequency() {
  const userId = await getAuthUserId();
  const weekStart = getWeekStart();
  
  const thisWeekSets = await prisma.setLog.findMany({
    where: {
      isCompleted: true,
      workoutLog: {
        session: {
          userId,
          startTime: { gte: weekStart },
        },
      },
    },
    include: {
      workoutLog: {
        include: {
          exercise: { select: { primaryMuscle: true } },
          session: { select: { startTime: true } },
        },
      },
    },
  });

  const muscleDays: Record<string, Set<string>> = {};
  for (const s of thisWeekSets) {
    const muscle = s.workoutLog.exercise.primaryMuscle;
    const dateStr = new Date(s.workoutLog.session.startTime).toDateString();
    
    if (!muscleDays[muscle]) {
      muscleDays[muscle] = new Set();
    }
    muscleDays[muscle].add(dateStr);
  }

  return Object.entries(muscleDays)
    .sort(([, a], [, b]) => b.size - a.size)
    .map(([muscle, days]) => ({ muscle, frequency: days.size }));
}
