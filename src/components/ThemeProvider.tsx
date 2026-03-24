"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeMode = "dark" | "light";

type ThemeContextType = {
  accentColor: string;
  setAccentColor: (color: string) => void;
  mode: ThemeMode;
  toggleMode: () => void;
  ACCENTS: { name: string; color: string }[];
};

const ALL_ACCENTS = [
  { name: "Lime", color: "#CCFF00" },
  { name: "Blue", color: "#38bdf8" },
  { name: "Red", color: "#f87171" },
  { name: "Yellow", color: "#fbbf24" },
  { name: "Purple", color: "#c084fc" },
  { name: "Orange", color: "#fb923c" },
  { name: "Cyan", color: "#00F0FF" },
  { name: "White", color: "#ffffff" }, // Handled conditionally
  { name: "Black", color: "#000000" }, // Light mode only
  { name: "Slate", color: "#475569" }, // Light mode only
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColor] = useState("#CCFF00");
  const [mode, setMode] = useState<ThemeMode>("dark");

  const ACCENTS = ALL_ACCENTS.filter(a => {
    if (mode === "dark" && (a.name === "Black" || a.name === "Slate")) return false;
    if (mode === "light" && a.name === "White") return false;
    return true;
  });

  const [mounted, setMounted] = useState(false);

  // Load persisted preferences on mount
  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem("replog_accent_color");
    if (savedColor) setAccentColor(savedColor);

    const savedMode = localStorage.getItem("replog_theme_mode") as ThemeMode | null;
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  // Ensure accent color is valid for the current mode
  useEffect(() => {
    const isValid = ACCENTS.some(a => a.color.toLowerCase() === accentColor.toLowerCase());
    if (!isValid) {
      setAccentColor("#CCFF00"); // Fallback to Lime
    }
  }, [mode, ACCENTS, accentColor]);

  // Apply accent color to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", accentColor);
    
    // Convert hex to RGB for semi-transparent variants
    let r = 204, g = 255, b = 0;
    if (accentColor.startsWith("#")) {
      const hex = accentColor.replace("#", "");
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    }
    
    const glow = `rgba(${r}, ${g}, ${b}, 0.3)`;
    root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
    root.style.setProperty("--accent-glow", glow);
    root.style.setProperty("--glow-primary", mode === "dark" ? `0 0 20px ${glow}` : `0 4px 12px rgba(0,0,0,0.08)`);
    root.style.setProperty("--done-border", `rgba(${r}, ${g}, ${b}, 0.3)`);

    // Add contrast color for text/icons inside accent backgrounds
    // If it's Black or Slate in light mode, the contrast should be white.
    const isDarkAccent = (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    root.style.setProperty("--accent-contrast", isDarkAccent ? "#ffffff" : "#000000");

    if (mounted) {
      localStorage.setItem("replog_accent_color", accentColor);
    }
  }, [accentColor, mode, mounted]);

  // Apply dark/light mode class
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      if (mode === "light") {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }
      localStorage.setItem("replog_theme_mode", mode);
    }
  }, [mode, mounted]);

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, mode, toggleMode, ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
