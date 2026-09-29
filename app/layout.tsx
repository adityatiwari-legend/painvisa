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
  title: {
    default: "BLS Biometric | Spain Visa Application",
    template: "%s | BLS Biometric",
  },
  description: "Spain visa application information and services.",
  keywords: [
    "BLS Biometric",
    "Spain Visa India",
    "Schengen Visa",
    "National Visa Spain",
    "Spain Visa Application Centre",
    "Visa appointment Spain",
    "Track Spain Visa application",
  ],
  authors: [{ name: "BLS Biometric" }],
  openGraph: {
    title: "BLS Biometric | Spain Visa Application",
    siteName: "BLS Biometric",
    description: "Spain visa application information and services.",
  },
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
