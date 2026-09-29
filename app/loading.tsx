import React from "react";
import { Fingerprint } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#333638] flex items-center justify-center p-3 shadow-lg border border-neutral-700 animate-pulse">
        <Fingerprint className="w-10 h-10 text-[#C79A2B]" />
      </div>
      <div>
        <h2 className="text-base font-extrabold text-[#333638] tracking-tight">
          BLS Biometric
        </h2>
        <p className="text-xs text-neutral-500 mt-1 font-medium">
          Loading BLS Biometric...
        </p>
      </div>
    </div>
  );
}
