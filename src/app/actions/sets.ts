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
  await prisma.workoutLog.update({
    where: { id: workoutLogId },
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
  // Validate: rpe and rir can't exceed 10
  const clamped =
    field === "rpe" || field === "rir" ? Math.min(value, 10) : value;

  await prisma.setLog.update({
    where: { id: setId },
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
  await prisma.setLog.update({
    where: { id: setId },
    data: { isCompleted },
  });
}

// ── removeExercise ────────────────────────────────────────────
// Removes an exercise (and all its sets) from a session.
// Cascade delete handles removing the set_log rows automatically.
export async function removeExercise(workoutLogId: string): Promise<void> {
  await prisma.workoutLog.delete({
    where: { id: workoutLogId },
  });
  revalidatePath("/");
}

// ── removeSet ─────────────────────────────────────────────────
// Removes a single set from a workout log.
export async function removeSet(setId: string): Promise<void> {
  await prisma.setLog.delete({
    where: { id: setId },
  });
  revalidatePath("/");
}
