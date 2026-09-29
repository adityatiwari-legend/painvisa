"use client";

import React, { useState } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { STATUS_MAP, formatDate, formatDateTime } from "@/lib/utils";

export default function TrackApplicationPage() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [officialUrl, setOfficialUrl] = useState<string | null>(null);

  React.useEffect(() => {
    document.title = "Track Application | BLS Biometric";
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/applications/track?referenceNumber=${encodeURIComponent(
          referenceNumber
        )}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Could not track application with the provided details.");
      } else {
        setResult(data.application);
        setOfficialUrl(data.officialTrackingUrl || null);
      }
    } catch {
      setError("Network or server error while retrieving application status.");
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = result ? STATUS_MAP[result.status as keyof typeof STATUS_MAP] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-[#333638] text-white py-14 border-b border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-[#C79A2B] text-xs font-semibold border border-neutral-700">
              <Search className="w-3.5 h-3.5" />
              Application Status Verification
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Track Your Visa Application
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Check real-time processing milestones for applications lodged through our portal using your Application Reference Number and Date of Birth.
            </p>
          </div>
        </section>

        {/* Main Tracking Section */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Tracking Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-xl font-bold text-[#333638]">
                Enter Application Credentials
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Both fields are required for authenticated verification.
              </p>
            </div>

            <form onSubmit={handleTrack} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#333638] uppercase tracking-wider mb-2">
                    Application Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BLS-2026-8F4K29"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C79A2B] font-mono uppercase"
                  />
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Found on your acknowledgement receipt or submission email.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333638] uppercase tracking-wider mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C79A2B]"
                  />
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Matching the birth date registered in your passport.
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "TRACK APPLICATION"}
                </button>

                {officialUrl && (
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#333638] hover:text-[#C79A2B] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Track on Official BLS System</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </form>
          </div>

          {/* Result Card & Status Timeline */}
          {result && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-md space-y-8 animate-in fade-in duration-300">
              {/* Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#C79A2B]">
                    Application Found
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#333638] mt-1 font-mono">
                    {result.referenceNumber}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-1">
                    Applicant: <span className="font-semibold text-neutral-800">{result.name}</span> • Passport:{" "}
                    <span className="font-mono text-neutral-800">{result.maskedPassport}</span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-[11px] text-neutral-500 mb-1">Current Status:</span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      statusMeta?.badgeClass || "bg-neutral-100 text-neutral-800 border-neutral-300"
                    }`}
                  >
                    {statusMeta?.label || result.status}
                  </span>
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                <span className="font-bold text-[#333638]">Current Stage: </span>
                {statusMeta?.description}
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Visa Type</span>
                  <span className="font-bold text-[#333638]">{result.visaType}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Category</span>
                  <span className="font-bold text-[#333638] truncate block">{result.visaCategory}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Application Centre</span>
                  <span className="font-bold text-[#333638]">{result.centreName}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Submitted Date</span>
                  <span className="font-bold text-[#333638]">{formatDate(result.submittedAt)}</span>
                </div>
              </div>

              {/* Status Timeline History */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#333638] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C79A2B]" />
                  Status Milestone History
                </h4>

                <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                  {result.history?.map((h: any, idx: number) => {
                    const hMeta = STATUS_MAP[h.status as keyof typeof STATUS_MAP];
                    return (
                      <div key={idx} className="relative space-y-1">
                        <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#C79A2B] ring-4 ring-white" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                          <span className="font-bold text-[#333638]">
                            {hMeta?.label || h.status}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {formatDateTime(h.changedAt)}
                          </span>
                        </div>
                        {h.note && (
                          <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                            {h.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 leading-relaxed">
                * Note: Internal tracking reflects document custody and procedural milestones within our application network. Official visa approvals or rejections are made strictly by the Embassy / Consulate General of Spain.
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
