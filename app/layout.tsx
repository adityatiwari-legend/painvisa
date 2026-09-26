import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Spain Visa Application - India | Official Services Portal",
  description:
    "Official application information and outsourced logistics portal for applicants applying for Schengen and National visas to Spain from India, Nepal, and Sri Lanka.",
  keywords: [
    "Spain Visa India",
    "Schengen Visa",
    "National Visa Spain",
    "Spain Visa Application Centre",
    "BLS Spain Visa",
    "Visa appointment Spain",
    "Track Spain Visa application",
  ],
  authors: [{ name: "Spain Visa Portal" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface-bg text-dark-text font-sans selection:bg-gold/20 selection:text-charcoal-dark">
        {children}
      </body>
    </html>
  );
}
