"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { STATUS_MAP, formatDate } from "@/lib/utils";

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [centreFilter, setCentreFilter] = useState("ALL");
  const [visaTypeFilter, setVisaTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [centresList, setCentresList] = useState<any[]>([]);

  const fetchApplicants = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (centreFilter !== "ALL") params.set("centre", centreFilter);
    if (visaTypeFilter !== "ALL") params.set("visaType", visaTypeFilter);
    params.set("page", page.toString());
    params.set("limit", "10");

    fetch(`/api/admin/applicants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplicants(data.applicants || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalCount(data.pagination?.total || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, [page, statusFilter, centreFilter, visaTypeFilter]);

  useEffect(() => {
    fetch("/api/content/centres")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCentresList(data.centres || []);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplicants();
  };

  const handleDeleteApplicant = async (id: string, ref: string) => {
    if (!confirm(`Are you sure you want to permanently delete application ${ref} and all stored documents?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/applicants/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchApplicants();
      } else {
        alert(data.error || "Failed to delete applicant.");
      }
    } catch {
      alert("Error deleting applicant.");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Applicant Registry Management"
        subtitle="Search, verify documents, and advance consular application workflows"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        {/* Search & Filters */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Reference Number, Name, Email, Phone, Passport..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#333638] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              Search Registry
            </button>
          </form>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-600">Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#C79A2B]"
            >
              <option value="ALL">All Statuses</option>
              {Object.keys(STATUS_MAP).map((st) => (
                <option key={st} value={st}>
                  {STATUS_MAP[st as keyof typeof STATUS_MAP].label}
                </option>
              ))}
            </select>

            <select
              value={centreFilter}
              onChange={(e) => {
                setCentreFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#C79A2B]"
            >
              <option value="ALL">All Application Centres</option>
              {centresList.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={visaTypeFilter}
              onChange={(e) => {
                setVisaTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#C79A2B]"
            >
              <option value="ALL">All Visa Types</option>
              <option value="SCHENGEN">Schengen Visa</option>
              <option value="NATIONAL">National Visa</option>
            </select>

            {(search || statusFilter !== "ALL" || centreFilter !== "ALL" || visaTypeFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setCentreFilter("ALL");
                  setVisaTypeFilter("ALL");
                  setPage(1);
                }}
                className="text-[11px] font-bold text-[#C79A2B] hover:underline ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>
              Showing <span className="font-bold text-[#333638]">{applicants.length}</span> of{" "}
              <span className="font-bold text-[#333638]">{totalCount}</span> applicants
            </span>
            <button
              onClick={fetchApplicants}
              className="p-1 rounded hover:bg-neutral-100 text-neutral-600 transition-colors"
              title="Refresh table"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Visa Category</th>
                  <th className="py-3 px-4">Centre</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Docs</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {applicants.length > 0 ? (
                  applicants.map((app) => {
                    const meta = STATUS_MAP[app.status as keyof typeof STATUS_MAP];
                    return (
                      <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#333638]">
                          {app.referenceNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-neutral-900">{app.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {app.passportNumber || "No passport"}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-neutral-700">{app.email}</div>
                          <div className="text-[11px] text-neutral-400">{app.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-neutral-800 block truncate max-w-[130px]">
                            {app.visaCategory}
                          </span>
                          <span className="text-[10px] text-neutral-400 uppercase">
                            {app.visaType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700">{app.centreName}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              meta?.badgeClass || "bg-neutral-100"
                            }`}
                          >
                            {meta?.label || app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 font-bold text-neutral-700 text-[11px]">
                            {app._count?.documents || 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <Link
                            href={`/admin/applicants/${app.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#333638] text-white hover:bg-[#C79A2B] font-bold text-[11px] transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteApplicant(app.id, app.referenceNumber)}
                            className="p-1 rounded text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors inline-block"
                            title="Delete applicant (Super Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-400">
                      {loading ? "Searching..." : "No applicants found matching filter criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 disabled:opacity-40 hover:bg-neutral-50 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 disabled:opacity-40 hover:bg-neutral-50 transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
