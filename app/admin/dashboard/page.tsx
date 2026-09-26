"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Layers,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { STATUS_MAP, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-xs font-semibold text-neutral-500">
        Loading operational analytics...
      </div>
    );
  }

  const statusCounts = stats?.statusCounts || {};

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Consular Operations Dashboard"
        subtitle="Real-time application intake, document custody, and processing metrics"
      />

      <div className="p-6 sm:p-8 space-y-8 flex-1">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Total Applicants
            </span>
            <div className="text-3xl font-extrabold text-[#333638]">
              {stats?.totalApplicants || 0}
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold pt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats?.todayApplicants || 0} today</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Under Review
            </span>
            <div className="text-3xl font-extrabold text-amber-700">
              {stats?.pendingReview || 0}
            </div>
            <div className="text-[11px] text-neutral-500 pt-1">Awaiting verification</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              At Mission / Processing
            </span>
            <div className="text-3xl font-extrabold text-blue-700">
              {stats?.processing || 0}
            </div>
            <div className="text-[11px] text-neutral-500 pt-1">Consular decision stage</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Documents Vault
            </span>
            <div className="text-3xl font-extrabold text-[#C79A2B]">
              {stats?.totalDocuments || 0}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Encrypted Local Storage
            </div>
          </div>
        </div>

        {/* Visual Charts & Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown Bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-[#333638]">
                Application Status Distribution
              </h3>
              <span className="text-xs text-neutral-400">All registered files</span>
            </div>

            <div className="space-y-3">
              {[
                { key: "SUBMITTED", label: "Submitted (New)", color: "bg-blue-600" },
                { key: "DOCUMENTS_UNDER_REVIEW", label: "Documents Under Review", color: "bg-amber-500" },
                { key: "APPOINTMENT_CONFIRMED", label: "Appointment Confirmed", color: "bg-indigo-600" },
                { key: "PROCESSING", label: "Under Processing at Mission", color: "bg-cyan-600" },
                { key: "READY_FOR_COLLECTION", label: "Ready for Collection / Courier", color: "bg-emerald-500" },
                { key: "COMPLETED", label: "Completed", color: "bg-emerald-700" },
              ].map((item) => {
                const count = statusCounts[item.key] || 0;
                const total = Math.max(1, stats?.totalApplicants || 1);
                const percent = Math.round((count / total) * 100);

                return (
                  <div key={item.key} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-neutral-700">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-bold text-[#333638]">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown by Visa Type & Top Centres */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-sm text-[#333638] pb-3 border-b border-neutral-100">
                Classification Breakdown
              </h3>
              <div className="space-y-3 pt-3">
                {stats?.byVisaType?.map((v: any) => (
                  <div
                    key={v.type}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-neutral-800">
                      {v.type === "SCHENGEN" ? "Schengen Visa (Short Stay)" : "National Visa (Long Stay)"}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-300 font-bold text-[#333638]">
                      {v.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-[#333638] pb-3 border-b border-neutral-100">
                Top Application Centres
              </h3>
              <div className="space-y-2 pt-3 text-xs">
                {stats?.byCentre?.map((c: any) => (
                  <div key={c.centre} className="flex items-center justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-700">{c.centre}</span>
                    <span className="font-bold text-[#333638]">{c.count} files</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applicants Feed */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="font-bold text-sm text-[#333638]">
                Recent Applicant Intake
              </h3>
              <p className="text-xs text-neutral-400">Latest online submissions</p>
            </div>
            <Link
              href="/admin/applicants"
              className="text-xs font-bold text-[#C79A2B] hover:text-[#B0851F] flex items-center gap-1"
            >
              <span>Manage All Applicants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-50 border-y border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Centre</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stats?.recentApplicants?.map((app: any) => {
                  const meta = STATUS_MAP[app.status as keyof typeof STATUS_MAP];
                  return (
                    <tr key={app.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#333638]">
                        {app.referenceNumber}
                      </td>
                      <td className="py-3 px-3 font-medium text-neutral-900">
                        {app.name}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 truncate max-w-[150px]">
                        {app.visaCategory}
                      </td>
                      <td className="py-3 px-3 text-neutral-600">{app.centreName}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            meta?.badgeClass || "bg-neutral-100"
                          }`}
                        >
                          {meta?.label || app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-500 whitespace-nowrap">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/applicants/${app.id}`}
                          className="px-2.5 py-1 rounded bg-[#333638] text-white hover:bg-[#C79A2B] font-bold text-[11px] transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
