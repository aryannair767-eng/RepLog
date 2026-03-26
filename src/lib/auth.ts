// ============================================================
// src/lib/auth.ts
//
// NextAuth.js configuration using Google Provider exclusively
// and the Prisma Adapter for user synchronization.
// ============================================================

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Custom field map
          emailVerified: profile.email_verified ? new Date() : null,
          isProfileComplete: false, // Default to false when a new user signs up
        };
      },
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: { 
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // User is available upon initial sign in
      if (user) {
        token.id = user.id;
        token.isProfileComplete = (user as any).isProfileComplete;
      }
      
      // If we update the session (e.g. from complete-profile), handle it here
      if (trigger === "update" && session?.isProfileComplete) {
        token.isProfileComplete = session.isProfileComplete;
        token.name = session.name;
      }
      
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).isProfileComplete = token.isProfileComplete as boolean;
        session.user.name = token.name as string | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "replog-dev-secret-change-in-prod",
};

// ── getAuthUserId ────────────────────────────────────────────
// Call this from any server action to get the logged-in user's ID.
// Throws if user is not authenticated.
export async function getAuthUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    throw new Error("Not authenticated");
  }
  return (session.user as any).id;
}