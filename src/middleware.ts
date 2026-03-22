// ============================================================
// src/middleware.ts
//
// Protects all routes except login, signup, and NextAuth API.
// Unauthenticated users are redirected to /login.
// ============================================================

export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect everything except login, signup, auth API, static files, and _next
    "/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico|manifest.json|icon-192.png|icon-512.png).*)",
  ],
};
