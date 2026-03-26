// ============================================================
// src/middleware.ts
//
// Protects all routes except login, signup, and NextAuth API.
// Unauthenticated users are redirected to /login.
// ============================================================

import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {
  // Standard next-auth middleware protection
});

export const config = {
  matcher: [
    // Protect everything except login, signup, auth API, static files, and _next
    "/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico|manifest.json|icon-192.png|icon-512.png).*)",
  ],
};
