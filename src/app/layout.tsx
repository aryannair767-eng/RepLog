// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "RepLog // System",
  description: "High-performance workout logging platform",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
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
        <style id="replog-theme-init">
          {`
            .light {
              --bg: #F8FAFC !important;
              --surface: #FFFFFF !important;
              --surface-solid: #FFFFFF !important;
              --surface-hover: #F1F5F9 !important;
              --surface-active: #E2E8F0 !important;
              --text-primary: #0F172A !important;
              --text-secondary: #64748B !important;
              --text-ghost: #94A3B8 !important;
              --border: #E2E8F0 !important;
              --border-hover: #CBD5E1 !important;
              --header-bg: rgba(255, 255, 255, 0.9) !important;
              --card-header-bg: #F1F5F9 !important;
              --glow-primary: 0 4px 12px rgba(0,0,0,0.08) !important;
            }
          `}
        </style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('replog_theme_mode');
                  if (mode === 'light') document.documentElement.classList.add('light');
                  var color = localStorage.getItem('replog_accent_color');
                  if (color && color.charAt(0) === '#' && color.length === 7) {
                    var r = parseInt(color.substring(1,3),16);
                    var g = parseInt(color.substring(3,5),16);
                    var b = parseInt(color.substring(5,7),16);
                    document.documentElement.style.setProperty('--accent-color', color);
                    document.documentElement.style.setProperty('--accent-rgb', r+', '+g+', '+b);
                    var glow = 'rgba('+r+','+g+','+b+',0.3)';
                    document.documentElement.style.setProperty('--accent-glow', glow);
                    document.documentElement.style.setProperty('--done-border', 'rgba('+r+','+g+','+b+',0.3)');
                    if (mode === 'light') {
                      document.documentElement.style.setProperty('--glow-primary', '0 4px 12px rgba(0,0,0,0.08)');
                    } else {
                      document.documentElement.style.setProperty('--glow-primary', '0 0 20px ' + glow);
                    }
                    var isDark = (r * 0.299 + g * 0.587 + b * 0.114) < 128;
                    document.documentElement.style.setProperty('--accent-contrast', isDark ? '#ffffff' : '#000000');
                  }
                } catch (e) {}

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
