import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

import "./globals.css";

/*
========================================
FONT
========================================
*/

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
========================================
ROOT LAYOUT
========================================
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        antialiased
      `}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--base)] text-[var(--text)]">

        <ThemeProvider>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {children}
          </div>

          {/* GLOBAL TOAST */}
          <Toaster
            richColors
            position="top-right"
            closeButton
            expand
            duration={3000}
            toastOptions={{
              classNames: {
                toast:
                  "rounded-2xl border border-white/10 shadow-2xl",
                title:
                  "font-bold tracking-tight",
                description:
                  "text-sm opacity-90",
              },
            }}
          />

        </ThemeProvider>

      </body>
    </html>
  );
}