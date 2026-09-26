"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminCentresPage() {
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    country: "India",
    address: "",
    submissionHours: "09:00 - 15:00 (Monday - Friday)",
    passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
    phone: "+91 120 6641000",
    email: "feedback.centre@blsspainvisa.com",
    mapUrl: "",
    isActive: true,
  });

  const fetchCentres = () => {
    setLoading(true);
    fetch("/api/admin/centres")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCentres(data.centres || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      code: "",
      name: "",
      country: "India",
      address: "",
      submissionHours: "09:00 - 15:00 (Monday - Friday)",
      passportCollectionHours: "15:00 - 16:30 (Monday - Friday)",
      phone: "+91 120 6641000",
      email: "feedback.centre@blsspainvisa.com",
      mapUrl: "",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      name: c.name,
      country: c.country,
      address: c.address,
      submissionHours: c.submissionHours,
      passportCollectionHours: c.passportCollectionHours,
      phone: c.phone,
      email: c.email,
      mapUrl: c.mapUrl || "",
      isActive: c.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/centres/${editingId}` : "/api/admin/centres";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCentres();
      } else {
        alert(data.error || "Failed to save centre");
      }
    } catch {
      alert("Error saving centre");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this centre?")) return;
    try {
      const res = await fetch(`/api/admin/centres/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCentres();
    } catch {
      alert("Error deleting centre");
    }
  };

  const handleToggleActive = async (c: any) => {
    try {
      const res = await fetch(`/api/admin/centres/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      const data = await res.json();
      if (data.success) fetchCentres();
    } catch {
      alert("Error toggling status");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Application Centres Registry"
        subtitle="Manage 13+ authorized Spain Visa Application Centres across South Asia"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-[#333638]">
              Operating Centres ({centres.length})
            </h2>
            <p className="text-xs text-neutral-500">
              New Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Kathmandu, Colombo, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Centre</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Centre Name</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Submission Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {centres.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#333638]">{c.code}</td>
                  <td className="py-3 px-4 font-bold text-neutral-900">{c.name}</td>
                  <td className="py-3 px-4 text-neutral-600">{c.country}</td>
                  <td className="py-3 px-4 text-neutral-600 max-w-xs truncate">{c.address}</td>
                  <td className="py-3 px-4 text-neutral-600 whitespace-nowrap">{c.submissionHours}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c)}
                      className="cursor-pointer"
                      title="Click to toggle active status"
                    >
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-600">
                          <XCircle className="w-3 h-3" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(c)}
                      className="p-1 rounded text-neutral-600 hover:text-[#C79A2B]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-[#333638]">
                {editingId ? "Edit Centre Details" : "Register Application Centre"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Centre Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. DEL, BOM"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Centre Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

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
                  <label className="block font-bold text-neutral-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Address *</label>
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street, Building, City, PIN..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Submission Hours</label>
                  <input
                    type="text"
                    value={form.submissionHours}
                    onChange={(e) => setForm({ ...form, submissionHours: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Collection Hours</label>
                  <input
                    type="text"
                    value={form.passportCollectionHours}
                    onChange={(e) => setForm({ ...form, passportCollectionHours: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Google Maps URL</label>
                <input
                  type="text"
                  value={form.mapUrl}
                  onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#C79A2B] rounded"
                />
                <label htmlFor="activeCheck" className="font-semibold text-neutral-700">
                  Centre is active for appointments and submissions
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
                  Save Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
