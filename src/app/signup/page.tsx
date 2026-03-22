"use client";
// ============================================================
// src/app/signup/page.tsx — RepLog Sign Up Page
// ============================================================

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const THEME = {
  lime: "var(--accent-color)",
  black: "var(--bg)",
  surface: "var(--surface)",
  border: "var(--border)",
  border2: "var(--border)",
  textPrimary: "var(--text-primary)",
  textMuted: "var(--text-secondary)",
  textDim: "var(--text-secondary)",
  textGhost: "var(--text-ghost)",
  danger: "var(--danger)",
  fontSans: "var(--font-main)",
  fontMono: "var(--font-main)",
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed");
        setLoading(false);
        return;
      }

      // Auto-login after successful signup
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        setError("Account created but login failed. Please log in manually.");
        setLoading(false);
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "var(--bg)",
    border: `1px solid var(--border)`,
    borderRadius: "var(--radius)",
    color: THEME.textPrimary,
    fontSize: 14,
    fontFamily: THEME.fontMono,
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "var(--transition)",
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: 9,
    fontFamily: THEME.fontMono,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    color: THEME.textGhost,
    marginBottom: 6,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: THEME.black,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: THEME.fontSans,
      transition: "var(--transition)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 40,
          justifyContent: "center",
        }}>
          <div style={{
            width: 40, height: 40,
            background: THEME.lime,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em",
            textTransform: "uppercase", fontStyle: "",
            color: THEME.textPrimary, margin: 0,
          }}>
            RepLog
          </h1>
        </div>

        {/* Card */}
        <div style={{
          background: THEME.surface,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${THEME.border}`,
          borderRadius: "var(--radius)",
          padding: 32,
        }}>
          <h2 style={{
            fontSize: 14, fontWeight: 900,
            textTransform: "uppercase", fontStyle: "",
            letterSpacing: "-0.04em",
            color: THEME.textPrimary,
            marginBottom: 24,
          }}>
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            {error && (
              <div style={{
                padding: "8px 12px",
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: THEME.danger,
                fontSize: 10,
                fontFamily: THEME.fontMono,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--accent-color)",
                color: "#000",
                border: "none",
                fontSize: 12,
                borderRadius: "var(--radius)",
                fontFamily: THEME.fontMono,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 900,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 10,
            fontFamily: THEME.fontMono,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: THEME.textGhost,
          }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--accent-color)", textDecoration: "none" }}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
