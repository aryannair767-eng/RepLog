// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "RepLog // System",
  description: "High-performance workout logging platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B0B0B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('replog_theme_mode');
                  if (mode === 'light') document.documentElement.classList.add('light');
                  var color = localStorage.getItem('replog_accent_color');
                  if (color) {
                    document.documentElement.style.setProperty('--accent-color', color);
                    document.documentElement.style.setProperty('--accent-glow', color + '4d');
                    document.documentElement.style.setProperty('--glow-primary', '0 0 20px ' + color + '4d');
                  }
                } catch (e) {}

                // Register Service Worker for PWA
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('SW registered: ', registration.scope);
                    }, function(err) {
                      console.log('SW registration failed: ', err);
                    });
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
