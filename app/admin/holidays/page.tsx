"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("India");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    country: "India",
    year: 2026,
    date: "",
    name: "",
    description: "",
    isActive: true,
  });

  const fetchHolidays = () => {
    setLoading(true);
    fetch("/api/admin/holidays")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHolidays(data.holidays || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      country: selectedCountry,
      year: 2026,
      date: "",
      name: "",
      description: "",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (h: any) => {
    setEditingId(h.id);
    const dateStr = h.date ? new Date(h.date).toISOString().split("T")[0] : "";
    setForm({
      country: h.country,
      year: h.year,
      date: dateStr,
      name: h.name,
      description: h.description || "",
      isActive: h.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/holidays/${editingId}` : "/api/admin/holidays";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchHolidays();
      } else {
        alert(data.error || "Failed to save holiday");
      }
    } catch {
      alert("Error saving holiday");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this holiday?")) return;
    try {
      const res = await fetch(`/api/admin/holidays/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchHolidays();
    } catch {
      alert("Error deleting holiday");
    }
  };

  const filtered = holidays.filter((h) => h.country === selectedCountry);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Public & Consular Holidays Calendar"
        subtitle="Manage official embassy and centre closure schedules"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Country Filter */}
          <div className="inline-flex p-1 bg-white border border-neutral-300 rounded-xl shadow-2xs">
            {["India", "Nepal", "Sri Lanka"].map((ctry) => (
              <button
                key={ctry}
                type="button"
                onClick={() => setSelectedCountry(ctry)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCountry === ctry
                    ? "bg-[#C79A2B] text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {ctry}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holiday</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Holiday Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((h) => (
                <tr key={h.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-bold text-[#C79A2B] whitespace-nowrap">
                    {formatDate(h.date)}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#333638]">{h.name}</td>
                  <td className="py-3 px-4 text-neutral-600">{h.description || "—"}</td>
                  <td className="py-3 px-4">
                    {h.isActive ? (
                      <span className="text-emerald-700 font-bold">Active</span>
                    ) : (
                      <span className="text-neutral-400">Disabled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(h)}
                      className="p-1 rounded text-neutral-600 hover:text-[#C79A2B]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(h.id)}
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
                {editingId ? "Edit Holiday" : "Add Consular Holiday"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  >
                    <option value="India">India</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value, 10) || 2026 })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Holiday Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Fiesta Nacional de España"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
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
