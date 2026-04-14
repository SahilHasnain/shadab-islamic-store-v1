import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AppShell } from "@/src/components/layout/app-shell";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopsathi V1",
  description: "Frontend-only rebuild foundation for the Shopsathi storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-page)] text-[var(--color-ink)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
