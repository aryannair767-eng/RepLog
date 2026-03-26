"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeProfile } from "@/app/actions/user";

export default function CompleteProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if ((session?.user as any)?.isProfileComplete) {
        router.push("/");
      } else if (!name && session?.user?.name) {
        setName(session.user.name);
      }
    }
  }, [status, session, router, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await completeProfile(name);
      await update({ isProfileComplete: true, name });
      window.location.href = "/"; // Force hard redirect to clear next.js caching
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 48, height: 48, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", animation: "pulse 1.5s infinite" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      fontFamily: "var(--font-main), sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: 32,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      }}>
        <h2 style={{
          fontSize: 20, fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.04em",
          color: "#000",
          marginBottom: 8,
        }}>
          Complete Your Profile
        </h2>
        <p style={{
          fontSize: 14,
          color: "#6b7280",
          marginBottom: 24,
        }}>
          Almost there! Just confirm your username before dropping into the dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#374151",
              marginBottom: 8,
            }}>
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                color: "#111827",
                fontSize: 16,
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#000";
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.boxShadow = "0 0 0 1px #000";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: "12px",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#dc2626",
              borderRadius: "8px",
              fontSize: 14,
              marginBottom: 24,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#000",
              color: "#fff",
              border: "none",
              fontSize: 14,
              borderRadius: "8px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1)"; }}
          >
            {loading ? "Saving..." : "Save & Go To Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
