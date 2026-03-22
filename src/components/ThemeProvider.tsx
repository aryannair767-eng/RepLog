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

const ACCENTS = [
  { name: "Lime", color: "#CCFF00" },
  { name: "Blue", color: "#38bdf8" },
  { name: "Red", color: "#f87171" },
  { name: "Yellow", color: "#fbbf24" },
  { name: "Purple", color: "#c084fc" },
  { name: "Orange", color: "#fb923c" },
  { name: "Cyan", color: "#00F0FF" },
  { name: "White", color: "#ffffff" },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColor] = useState("#CCFF00");
  const [mode, setMode] = useState<ThemeMode>("dark");

  // Load persisted preferences on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("replog_accent_color");
    if (savedColor) setAccentColor(savedColor);

    const savedMode = localStorage.getItem("replog_theme_mode") as ThemeMode | null;
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  // Apply accent color to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", accentColor);
    const glow = accentColor.startsWith("#") ? accentColor + "4d" : "rgba(255,255,255,0.3)";
    root.style.setProperty("--accent-glow", glow);
    root.style.setProperty("--glow-primary", `0 0 20px ${glow}`);
    root.style.setProperty("--done-border", `${accentColor}4d`);
    localStorage.setItem("replog_accent_color", accentColor);
  }, [accentColor]);

  // Apply dark/light mode class
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("replog_theme_mode", mode);
  }, [mode]);

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
