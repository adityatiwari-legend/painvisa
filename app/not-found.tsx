import React from "react";
import Link from "next/link";
import { Fingerprint, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#333638] flex items-center justify-center p-3 shadow-lg border border-neutral-700">
        <Fingerprint className="w-10 h-10 text-[#C79A2B]" />
      </div>

      <div className="max-w-md space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#C79A2B]">
          404 - Not Found
        </span>
        <h1 className="text-3xl font-extrabold text-[#333638]">
          BLS Biometric - Page Not Found
        </h1>
        <p className="text-xs text-neutral-600 leading-relaxed">
          The page or resource you are attempting to access does not exist or has been relocated within the portal.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>

      <div className="text-[11px] text-neutral-400 pt-4">
        © 2026 BLS Biometric. All rights reserved.
      </div>
    </div>
  );
}
