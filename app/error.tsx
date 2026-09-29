"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Fingerprint } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#333638] flex items-center justify-center p-3 shadow-lg border border-neutral-700">
        <Fingerprint className="w-10 h-10 text-[#C79A2B]" />
      </div>

      <div className="max-w-md space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#C79A2B]">
          System Notice
        </span>
        <h1 className="text-2xl font-extrabold text-[#333638]">
          BLS Biometric is temporarily unavailable.
        </h1>
        <p className="text-xs text-neutral-600 leading-relaxed">
          An unexpected processing error occurred while communicating with services. Please try refreshing the portal or return to the home page.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors shadow-2xs"
        >
          <Home className="w-4 h-4 text-[#C79A2B]" />
          <span>Return to Home</span>
        </Link>
      </div>

      <div className="text-[11px] text-neutral-400 pt-4">
        © 2026 BLS Biometric. All rights reserved.
      </div>
    </div>
  );
}
