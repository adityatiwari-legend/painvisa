"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle, Fingerprint } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@spainvisa-portal.com");
  const [password, setPassword] = useState("AdminSpain2026!Secure");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    document.title = "BLS Biometric Admin";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please verify credentials.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Network error while connecting to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#252525] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-700/50 overflow-hidden">
        {/* Header */}
        <div className="bg-[#333638] text-white p-8 text-center space-y-3 border-b border-neutral-700">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-600 flex items-center justify-center p-2 mx-auto">
            <Fingerprint className="w-7 h-7 text-[#C79A2B]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C79A2B] block">
              Secure Administration Portal
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              BLS Biometric Admin
            </h1>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-[#C79A2B] shrink-0 mt-0.5" />
            <span>
              Restricted authorized access. Session activity and document retrieval actions are logged to the audit registry.
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#333638] uppercase tracking-wider text-[11px] mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                  placeholder="admin@spainvisa-portal.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#333638] uppercase tracking-wider text-[11px] mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Seed Demo Credentials Hint */}
            <div className="p-3 bg-[#FAF5EA] rounded-xl border border-[#E2CCA1] text-[11px] text-[#785918] space-y-1">
              <span className="font-bold">Initial Administrator Credentials:</span>
              <div className="font-mono text-[10px] text-neutral-700">
                Email: admin@spainvisa-portal.com<br />
                Password: AdminSpain2026!Secure
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : "Authorize Access"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
