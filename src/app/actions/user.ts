"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

export async function completeProfile(name: string) {
  const userId = await getAuthUserId();
  if (!name.trim()) {
    throw new Error("Name is required");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim(), isProfileComplete: true },
  });

  return { success: true };
}
