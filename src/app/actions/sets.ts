"use server";
// ============================================================
// src/app/actions/sets.ts
//
// Server Actions for adding exercises and logging sets.
//
// HOW TO MODIFY:
// - Add a "notes" field to sets? Add it to the `data` object
//   in createSet() and to the SetLog model in schema.prisma.
// - Change default RPE? Edit the `rpe: 0` line in createSet().
// ============================================================

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthUserId } from "@/lib/auth";

// ── addExerciseToSession ──────────────────────────────────────
// Adds an exercise to a live session and creates the first
// empty set row so the user can start filling it in immediately.
//
// sessionId  — the ID of the active workout session
// exerciseId — the ID of the exercise from the library
export async function addExerciseToSession(
  sessionId: string,
  exerciseId: string
): Promise<string> {
  const userId = await getAuthUserId();
  const session = await prisma.workoutSession.findUnique({ where: { id: sessionId }});
  if (session?.userId !== userId) throw new Error("Unauthorized");

  // Count existing exercise slots to set the display order
  const existingCount = await prisma.workoutLog.count({
    where: { sessionId },
  });

  // Create the workout_log row (the "slot" for this exercise)
  const log = await prisma.workoutLog.create({
    data: {
      sessionId,
      exerciseId,
      orderIndex: existingCount,
      // Also create the first empty set right away
      sets: {
        create: {
          setNumber: 1,
          weight: 0,
          reps: 0,
          rpe: 0,
          rir: 0,
          isCompleted: false,
        },
      },
    },
  });

  revalidatePath("/");
  return log.id;
}

// ── updateWorkoutLogExercise ──────────────────────────────────
// Swaps the exercise in a workout log for a different one.
// Keeps all the sets intact, just changes the exercise ID.
export async function updateWorkoutLogExercise(
  workoutLogId: string,
  newExerciseId: string
): Promise<void> {
  const userId = await getAuthUserId();
  await prisma.workoutLog.updateMany({
    where: { id: workoutLogId, session: { userId } },
    data: { exerciseId: newExerciseId },
  });
  revalidatePath("/");
}

// ── addSet ────────────────────────────────────────────────────
// Adds a new empty set row to an existing exercise slot.
// Called when the user clicks "+ Add Set".
//
// workoutLogId — the ID of the workout_log (exercise slot)
export async function addSet(workoutLogId: string): Promise<string> {
  const userId = await getAuthUserId();
  const log = await prisma.workoutLog.findUnique({ where: { id: workoutLogId }, include: { session: true } });
  if (log?.session.userId !== userId) throw new Error("Unauthorized");

  // Count existing sets to determine the next set number
  const existingSetCount = await prisma.setLog.count({
    where: { workoutLogId },
  });

  const newSet = await prisma.setLog.create({
    data: {
      workoutLogId,
      setNumber: existingSetCount + 1,
      weight: 0,
      reps: 0,
      rpe: 0,
      rir: 0,
      isCompleted: false,
    },
  });

  return newSet.id;
}

// ── updateSetField ─────────────────────────────────────────────
// Updates one field (weight, reps, rpe, or rir) on a single set.
// Called whenever the user types into an input box.
// Debounce this in the UI — don't call on every keystroke.
//
// setId  — the ID of the set_log row
// field  — which column to update: "weight" | "reps" | "rpe" | "rir"
// value  — the new number
export async function updateSetField(
  setId: string,
  field: "weight" | "reps" | "rpe" | "rir",
  value: number
): Promise<void> {
  const userId = await getAuthUserId();
  // Validate: rpe and rir can't exceed 10
  const clamped =
    field === "rpe" || field === "rir" ? Math.min(value, 10) : value;

  await prisma.setLog.updateMany({
    where: { id: setId, workoutLog: { session: { userId } } },
    data: { [field]: clamped },
  });
}

// ── toggleSetComplete ─────────────────────────────────────────
// Marks a set as done (or un-done if you click again).
// This is the "check" button on each set row.
//
// setId       — the ID of the set_log row
// isCompleted — true to mark done, false to unmark
export async function toggleSetComplete(
  setId: string,
  isCompleted: boolean
): Promise<void> {
  const userId = await getAuthUserId();
  await prisma.setLog.updateMany({
    where: { id: setId, workoutLog: { session: { userId } } },
    data: { isCompleted },
  });
}

// ── removeExercise ────────────────────────────────────────────
// Removes an exercise (and all its sets) from a session.
// Cascade delete handles removing the set_log rows automatically.
export async function removeExercise(workoutLogId: string): Promise<void> {
  const userId = await getAuthUserId();
  await prisma.workoutLog.deleteMany({
    where: { id: workoutLogId, session: { userId } },
  });
  revalidatePath("/");
}

// ── removeSet ─────────────────────────────────────────────────
// Removes a single set from a workout log.
export async function removeSet(setId: string): Promise<void> {
  const userId = await getAuthUserId();
  await prisma.setLog.deleteMany({
    where: { id: setId, workoutLog: { session: { userId } } },
  });
  revalidatePath("/");
}
