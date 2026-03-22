// ============================================================
// src/lib/auth.ts
//
// NextAuth.js configuration with Credentials provider.
// Uses JWT strategy (encrypted cookie) so users stay
// logged in across browser restarts.
// ============================================================

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
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
