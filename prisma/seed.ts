// ============================================================
// prisma/seed.ts — Seed the exercises table with a comprehensive
// library of general gym exercises.
//
// Run with: npx prisma db seed
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ExerciseSeed {
  name: string;
  primaryMuscle: string;
  secondaryMuscle: string | null;
  mechanics: "Compound" | "Isolation";
}

const exercises: ExerciseSeed[] = [
  // ── CHEST ──────────────────────────────────────────────────
  { name: "Barbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Incline Barbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Shoulders", mechanics: "Compound" },
  { name: "Decline Barbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Dumbbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Incline Dumbbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Shoulders", mechanics: "Compound" },
  { name: "Dumbbell Flyes", primaryMuscle: "Chest", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Incline Dumbbell Flyes", primaryMuscle: "Chest", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Cable Crossover", primaryMuscle: "Chest", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Chest Dips", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Machine Chest Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Pec Deck", primaryMuscle: "Chest", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Push-Ups", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },

  // ── BACK ───────────────────────────────────────────────────
  { name: "Barbell Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Dumbbell Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Pendlay Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "T-Bar Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Seated Cable Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Lat Pulldown", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Pull-Ups", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Chin-Ups", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Deadlift", primaryMuscle: "Back", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Rack Pull", primaryMuscle: "Back", secondaryMuscle: "Traps", mechanics: "Compound" },
  { name: "Straight Arm Pulldown", primaryMuscle: "Back", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Machine Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },

  // ── SHOULDERS ──────────────────────────────────────────────
  { name: "Overhead Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Dumbbell Shoulder Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Arnold Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Lateral Raise", primaryMuscle: "Shoulders", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Cable Lateral Raise", primaryMuscle: "Shoulders", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Front Raise", primaryMuscle: "Shoulders", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Reverse Pec Deck", primaryMuscle: "Shoulders", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Face Pull", primaryMuscle: "Shoulders", secondaryMuscle: "Traps", mechanics: "Compound" },
  { name: "Upright Row", primaryMuscle: "Shoulders", secondaryMuscle: "Traps", mechanics: "Compound" },
  { name: "Machine Shoulder Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },

  // ── BICEPS ─────────────────────────────────────────────────
  { name: "Barbell Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "EZ-Bar Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Dumbbell Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Hammer Curl", primaryMuscle: "Biceps", secondaryMuscle: "Forearms", mechanics: "Isolation" },
  { name: "Incline Dumbbell Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Preacher Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Concentration Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Cable Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Spider Curl", primaryMuscle: "Biceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Reverse Curl", primaryMuscle: "Biceps", secondaryMuscle: "Forearms", mechanics: "Isolation" },

  // ── TRICEPS ────────────────────────────────────────────────
  { name: "Tricep Pushdown", primaryMuscle: "Triceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Overhead Tricep Extension", primaryMuscle: "Triceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Skull Crushers", primaryMuscle: "Triceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Close-Grip Bench Press", primaryMuscle: "Triceps", secondaryMuscle: "Chest", mechanics: "Compound" },
  { name: "Tricep Dips", primaryMuscle: "Triceps", secondaryMuscle: "Chest", mechanics: "Compound" },
  { name: "Tricep Kickback", primaryMuscle: "Triceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Cable Overhead Extension", primaryMuscle: "Triceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Diamond Push-Ups", primaryMuscle: "Triceps", secondaryMuscle: "Chest", mechanics: "Compound" },
  { name: "Rope Pushdown", primaryMuscle: "Triceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Single-Arm Pushdown", primaryMuscle: "Triceps", secondaryMuscle: null, mechanics: "Isolation" },

  // ── QUADRICEPS ─────────────────────────────────────────────
  { name: "Barbell Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Front Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Leg Press", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Hack Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Leg Extension", primaryMuscle: "Quadriceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Bulgarian Split Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Walking Lunges", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Goblet Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Sissy Squat", primaryMuscle: "Quadriceps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Smith Machine Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },

  // ── HAMSTRINGS ─────────────────────────────────────────────
  { name: "Romanian Deadlift", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Stiff-Leg Deadlift", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Lying Leg Curl", primaryMuscle: "Hamstrings", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Seated Leg Curl", primaryMuscle: "Hamstrings", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Good Morning", primaryMuscle: "Hamstrings", secondaryMuscle: "Back", mechanics: "Compound" },
  { name: "Dumbbell Romanian Deadlift", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Nordic Hamstring Curl", primaryMuscle: "Hamstrings", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Glute-Ham Raise", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Single-Leg Deadlift", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Cable Pull-Through", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },

  // ── GLUTES ─────────────────────────────────────────────────
  { name: "Hip Thrust", primaryMuscle: "Glutes", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Barbell Hip Thrust", primaryMuscle: "Glutes", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Glute Bridge", primaryMuscle: "Glutes", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Cable Kickback", primaryMuscle: "Glutes", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Sumo Deadlift", primaryMuscle: "Glutes", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Step-Ups", primaryMuscle: "Glutes", secondaryMuscle: "Quadriceps", mechanics: "Compound" },
  { name: "Reverse Lunge", primaryMuscle: "Glutes", secondaryMuscle: "Quadriceps", mechanics: "Compound" },
  { name: "Smith Machine Hip Thrust", primaryMuscle: "Glutes", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Single-Leg Hip Thrust", primaryMuscle: "Glutes", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Abduction Machine", primaryMuscle: "Glutes", secondaryMuscle: null, mechanics: "Isolation" },

  // ── CALVES ─────────────────────────────────────────────────
  { name: "Standing Calf Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Seated Calf Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Leg Press Calf Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Smith Machine Calf Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Donkey Calf Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Single-Leg Calf Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Barbell Calf Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Tibialis Raise", primaryMuscle: "Calves", secondaryMuscle: null, mechanics: "Isolation" },

  // ── ABS ────────────────────────────────────────────────────
  { name: "Crunches", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Hanging Leg Raise", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Cable Crunch", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Ab Wheel Rollout", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Compound" },
  { name: "Plank", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Russian Twist", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Leg Raise", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Decline Sit-Up", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Mountain Climbers", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Compound" },
  { name: "Bicycle Crunch", primaryMuscle: "Abs", secondaryMuscle: null, mechanics: "Isolation" },

  // ── TRAPS ──────────────────────────────────────────────────
  { name: "Barbell Shrug", primaryMuscle: "Traps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Dumbbell Shrug", primaryMuscle: "Traps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Farmer's Walk", primaryMuscle: "Traps", secondaryMuscle: "Forearms", mechanics: "Compound" },
  { name: "Trap Bar Shrug", primaryMuscle: "Traps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Cable Shrug", primaryMuscle: "Traps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Behind-the-Back Shrug", primaryMuscle: "Traps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Smith Machine Shrug", primaryMuscle: "Traps", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Overhead Shrug", primaryMuscle: "Traps", secondaryMuscle: "Shoulders", mechanics: "Isolation" },

  // ── FOREARMS ───────────────────────────────────────────────
  { name: "Wrist Curl", primaryMuscle: "Forearms", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Reverse Wrist Curl", primaryMuscle: "Forearms", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Farmer's Carry", primaryMuscle: "Forearms", secondaryMuscle: "Traps", mechanics: "Compound" },
  { name: "Dead Hang", primaryMuscle: "Forearms", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Plate Pinch", primaryMuscle: "Forearms", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Behind-the-Back Wrist Curl", primaryMuscle: "Forearms", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Wrist Roller", primaryMuscle: "Forearms", secondaryMuscle: null, mechanics: "Isolation" },
  { name: "Grip Squeeze", primaryMuscle: "Forearms", secondaryMuscle: null, mechanics: "Isolation" },
];

async function main() {
  console.log(`Seeding ${exercises.length} exercises...`);

  let created = 0;
  let skipped = 0;

  for (const ex of exercises) {
    try {
      await prisma.exercise.create({
        data: {
          name: ex.name,
          primaryMuscle: ex.primaryMuscle,
          secondaryMuscle: ex.secondaryMuscle,
          mechanics: ex.mechanics,
          userId: null, // General exercises — not user-specific
        },
      });
      created++;
    } catch (e: any) {
      // Skip duplicates (unique constraint on [name, userId])
      if (e.code === "P2002") {
        skipped++;
      } else {
        throw e;
      }
    }
  }

  console.log(`✅ Done. Created: ${created}, Skipped (duplicates): ${skipped}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
