"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Search, RefreshCw, Lock, Eye, Download, UserCheck, Settings } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatDateTime } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("ALL");

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (actionFilter !== "ALL") params.set("action", actionFilter);
    params.set("limit", "50");

    fetch(`/api/admin/audit-logs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "DOCUMENT_VIEW":
        return {
          icon: Eye,
          class: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "DOCUMENT_DOWNLOAD":
        return {
          icon: Download,
          class: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "STATUS_CHANGE":
        return {
          icon: UserCheck,
          class: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "LOGIN":
        return {
          icon: Lock,
          class: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "SETTINGS_UPDATE":
        return {
          icon: Settings,
          class: "bg-cyan-100 text-cyan-800 border-cyan-200",
        };
      default:
        return {
          icon: ShieldAlert,
          class: "bg-neutral-100 text-neutral-800 border-neutral-200",
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Security Registry & Access Audit Trail"
        subtitle="Immutable ledger of staff sessions, applicant document retrievals, and status advancements"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        {/* Controls */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-neutral-600 uppercase tracking-wider">
              Filter Activity:
            </span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#C79A2B]"
            >
              <option value="ALL">All Recorded Actions</option>
              <option value="DOCUMENT_VIEW">DOCUMENT_VIEW (Staff document view)</option>
              <option value="DOCUMENT_DOWNLOAD">DOCUMENT_DOWNLOAD (Staff download)</option>
              <option value="STATUS_CHANGE">STATUS_CHANGE (Milestone advancement)</option>
              <option value="LOGIN">LOGIN (Admin session)</option>
              <option value="LOGOUT">LOGOUT (Session terminated)</option>
              <option value="SETTINGS_UPDATE">SETTINGS_UPDATE (Config modification)</option>
              <option value="CONTENT_UPDATE">CONTENT_UPDATE (Notice/Tariff change)</option>
            </select>
          </div>

          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Context Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {logs.length > 0 ? (
                  logs.map((log) => {
                    const badge = getActionBadge(log.action);
                    const Icon = badge.icon;

                    return (
                      <tr key={log.id} className="hover:bg-neutral-50 font-mono text-[11px]">
                        <td className="py-3 px-4 text-neutral-500 whitespace-nowrap">
                          {formatDateTime(log.createdAt)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${badge.class}`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{log.action}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-neutral-800">
                          {log.adminEmail || "SYSTEM / AUTO"}
                        </td>
                        <td className="py-3 px-4 text-neutral-500">{log.ipAddress || "127.0.0.1"}</td>
                        <td className="py-3 px-4 text-[#333638] font-bold">{log.entityType}</td>
                        <td className="py-3 px-4 text-neutral-600 max-w-xs truncate font-sans">
                          {log.metadata || "—"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400 font-sans">
                      {loading ? "Loading audit registry..." : "No matching audit log entries found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
