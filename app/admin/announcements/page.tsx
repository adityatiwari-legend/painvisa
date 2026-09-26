"use client";

import React, { useState, useEffect } from "react";
import { Bell, Plus, Edit, Trash2, AlertCircle, CheckCircle, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    message: "",
    severity: "INFO",
    isPublished: true,
  });

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch("/api/admin/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnnouncements(data.announcements || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ title: "", message: "", severity: "INFO", isPublished: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      message: a.message,
      severity: a.severity,
      isPublished: a.isPublished,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/admin/announcements/${editingId}`
        : "/api/admin/announcements";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchAnnouncements();
      } else {
        alert(data.error || "Failed to save announcement");
      }
    } catch {
      alert("Error saving announcement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchAnnouncements();
    } catch {
      alert("Error deleting announcement");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Announcements & Emergency Alerts"
        subtitle="Manage dynamic banner alerts and holiday notifications shown across the portal"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-[#333638]">Active Public Notices</h2>
            <p className="text-xs text-neutral-500">Displayed in the top ticker bar on all public pages</p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Notice</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {announcements.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.severity === "URGENT"
                          ? "bg-red-100 text-red-800"
                          : a.severity === "WARNING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {a.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#333638]">{a.title}</td>
                  <td className="py-3 px-4 text-neutral-600 max-w-md truncate">{a.message}</td>
                  <td className="py-3 px-4">
                    {a.isPublished ? (
                      <span className="text-emerald-700 font-bold">Published</span>
                    ) : (
                      <span className="text-neutral-400 font-semibold">Draft</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-neutral-500 whitespace-nowrap">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(a)}
                      className="p-1 rounded text-neutral-600 hover:text-[#C79A2B]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="p-1 rounded text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-[#333638]">
                {editingId ? "Edit Announcement" : "Create New Announcement"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Holiday Notice: Mumbai Centre Closed"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                >
                  <option value="INFO">INFO (Standard Notice)</option>
                  <option value="WARNING">WARNING (High Importance)</option>
                  <option value="URGENT">URGENT (Critical Advisory)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Detailed text shown to public visitors..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 text-[#C79A2B] rounded"
                />
                <label htmlFor="published" className="font-semibold text-neutral-700">
                  Publish immediately
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
