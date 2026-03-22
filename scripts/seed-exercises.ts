// scripts/seed-exercises.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXERCISES = [
  // Chest
  { name: "Barbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Incline Barbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Decline Barbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Dumbbell Bench Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Incline Dumbbell Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Decline Dumbbell Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Cable Crossover", primaryMuscle: "Chest", mechanics: "Isolation" },
  { name: "Low Cable Crossover", primaryMuscle: "Chest", mechanics: "Isolation" },
  { name: "High Cable Crossover", primaryMuscle: "Chest", mechanics: "Isolation" },
  { name: "Pec Deck Fly", primaryMuscle: "Chest", mechanics: "Isolation" },
  { name: "Dumbbell Fly", primaryMuscle: "Chest", mechanics: "Isolation" },
  { name: "Incline Dumbbell Fly", primaryMuscle: "Chest", mechanics: "Isolation" },
  { name: "Push Up", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Weighted Push Up", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Deficit Push Up", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Chest Dips", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Machine Chest Press", primaryMuscle: "Chest", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Svend Press", primaryMuscle: "Chest", mechanics: "Isolation" },

  // Back
  { name: "Deadlift", primaryMuscle: "Back", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Sumo Deadlift", primaryMuscle: "Back", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Deficit Deadlift", primaryMuscle: "Back", secondaryMuscle: "Hamstrings", mechanics: "Compound" },
  { name: "Trap Bar Deadlift", primaryMuscle: "Back", secondaryMuscle: "Legs", mechanics: "Compound" },
  { name: "Pull Up", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Weighted Pull Up", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Chin Up", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Lat Pulldown", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Reverse Grip Lat Pulldown", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Close Grip Lat Pulldown", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Barbell Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Pendlay Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Yates Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Dumbbell Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Meadows Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Seated Cable Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "T-Bar Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Chest Supported Row", primaryMuscle: "Back", secondaryMuscle: "Biceps", mechanics: "Compound" },
  { name: "Straight Arm Pulldown", primaryMuscle: "Back", mechanics: "Isolation" },
  { name: "Dumbbell Pullover", primaryMuscle: "Back", mechanics: "Isolation" },
  { name: "Cable Pullover", primaryMuscle: "Back", mechanics: "Isolation" },
  { name: "Rack Pull", primaryMuscle: "Back", mechanics: "Compound" },

  // Shoulders
  { name: "Overhead Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Seated Barbell Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Dumbbell Shoulder Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Seated Dumbbell Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Arnold Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Machine Shoulder Press", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps", mechanics: "Compound" },
  { name: "Lateral Raise", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Cable Lateral Raise", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Machine Lateral Raise", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Lean-Away Cable Lateral Raise", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Front Raise", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Cable Front Raise", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Rear Delt Fly", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Reverse Pec Deck", primaryMuscle: "Shoulders", mechanics: "Isolation" },
  { name: "Face Pull", primaryMuscle: "Shoulders", secondaryMuscle: "Traps", mechanics: "Isolation" },
  { name: "Upright Row", primaryMuscle: "Shoulders", secondaryMuscle: "Traps", mechanics: "Compound" },
  { name: "Barbell Shrug", primaryMuscle: "Traps", mechanics: "Isolation" },
  { name: "Dumbbell Shrug", primaryMuscle: "Traps", mechanics: "Isolation" },

  // Quadriceps
  { name: "Barbell Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Front Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Zercher Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Goblet Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Hack Squat", primaryMuscle: "Quadriceps", mechanics: "Compound" },
  { name: "Leg Press", primaryMuscle: "Quadriceps", mechanics: "Compound" },
  { name: "Bulgarian Split Squat", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Lunges", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Walking Lunges", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Reverse Lunges", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Step Ups", primaryMuscle: "Quadriceps", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Leg Extension", primaryMuscle: "Quadriceps", mechanics: "Isolation" },
  { name: "Sissy Squat", primaryMuscle: "Quadriceps", mechanics: "Isolation" },
  { name: "Spanish Squat", primaryMuscle: "Quadriceps", mechanics: "Compound" },

  // Hamstrings
  { name: "Romanian Deadlift", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Stiff Leg Deadlift", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },
  { name: "Good Morning", primaryMuscle: "Hamstrings", secondaryMuscle: "Lower Back", mechanics: "Compound" },
  { name: "Lying Leg Curl", primaryMuscle: "Hamstrings", mechanics: "Isolation" },
  { name: "Seated Leg Curl", primaryMuscle: "Hamstrings", mechanics: "Isolation" },
  { name: "Nordic Hamstring Curl", primaryMuscle: "Hamstrings", mechanics: "Isolation" },
  { name: "Glute Ham Raise", primaryMuscle: "Hamstrings", secondaryMuscle: "Glutes", mechanics: "Compound" },

  // Calves
  { name: "Standing Calf Raise", primaryMuscle: "Calves", mechanics: "Isolation" },
  { name: "Seated Calf Raise", primaryMuscle: "Calves", mechanics: "Isolation" },
  { name: "Donkey Calf Raise", primaryMuscle: "Calves", mechanics: "Isolation" },
  { name: "Leg Press Calf Raise", primaryMuscle: "Calves", mechanics: "Isolation" },

  // Biceps
  { name: "Barbell Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "EZ Bar Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Dumbbell Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Incline Dumbbell Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Hammer Curl", primaryMuscle: "Biceps", secondaryMuscle: "Forearms", mechanics: "Isolation" },
  { name: "Cross Body Hammer Curl", primaryMuscle: "Biceps", secondaryMuscle: "Forearms", mechanics: "Isolation" },
  { name: "Preacher Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Machine Preacher Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Spider Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Concentration Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Cable Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Bayesian Curl", primaryMuscle: "Biceps", mechanics: "Isolation" },
  { name: "Reverse Curl", primaryMuscle: "Biceps", secondaryMuscle: "Forearms", mechanics: "Isolation" },

  // Triceps
  { name: "Tricep Pushdown", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Rope Tricep Pushdown", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "V-Bar Pushdown", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Straight Bar Pushdown", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Overhead Tricep Extension", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Cable Overhead Extension", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Dumbbell Overhead Extension", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Skullcrusher", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Dumbbell Skullcrusher", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Close Grip Bench Press", primaryMuscle: "Triceps", secondaryMuscle: "Chest", mechanics: "Compound" },
  { name: "Tricep Kickback", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "Cable Kickback", primaryMuscle: "Triceps", mechanics: "Isolation" },
  { name: "JM Press", primaryMuscle: "Triceps", mechanics: "Compound" },

  // Abs & Core
  { name: "Crunch", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Decline Crunch", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Cable Crunch", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Hanging Leg Raise", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Hanging Knee Raise", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Captain's Chair Leg Raise", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Lying Leg Raise", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Ab Wheel Rollout", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Plank", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Russian Twist", primaryMuscle: "Abs", mechanics: "Isolation" },
  { name: "Woodchopper", primaryMuscle: "Abs", mechanics: "Isolation" },

  // Glutes
  { name: "Hip Thrust", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Barbell Hip Thrust", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Machine Hip Thrust", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Glute Bridge", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Cable Pull Through", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Cable Kickback (Glutes)", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Machine Glute Kickback", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Hip Abductor", primaryMuscle: "Glutes", mechanics: "Isolation" },
  { name: "Hip Adductor", primaryMuscle: "Legs", mechanics: "Isolation" },
  
  // Forearms
  { name: "Wrist Curl", primaryMuscle: "Forearms", mechanics: "Isolation" },
  { name: "Reverse Wrist Curl", primaryMuscle: "Forearms", mechanics: "Isolation" },
  { name: "Farmers Walk", primaryMuscle: "Forearms", secondaryMuscle: "Traps", mechanics: "Compound" }
];

async function main() {
  console.log('Clearing old general library exercises...');
  // Delete where primary muscle is NOT Custom
  await prisma.exercise.deleteMany({
    where: { primaryMuscle: { not: "Custom" } }
  });

  console.log(`Seeding ${EXERCISES.length} standard exercises into the Library...`);
  await prisma.exercise.createMany({
    data: EXERCISES,
    skipDuplicates: true
  });
  
  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
