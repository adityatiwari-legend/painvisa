"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Edit, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatCurrency } from "@/lib/utils";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    currency: "INR",
    isOptional: true,
    isActive: true,
  });

  const fetchServices = () => {
    setLoading(true);
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: 0,
      currency: "INR",
      isOptional: true,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: any) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description,
      price: s.price,
      currency: s.currency,
      isOptional: s.isOptional,
      isActive: s.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchServices();
      } else {
        alert(data.error || "Failed to save service");
      }
    } catch {
      alert("Error saving service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchServices();
    } catch {
      alert("Error deleting service");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Value-Added Services & Pricing"
        subtitle="Manage optional applicant convenience facilities and fee tariffs"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-[#333638]">
              Active Services Catalog ({services.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Courier, Premium Lounge, SMS alerts, Photocopy, Form filling, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Service Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Fee Tariff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-bold text-[#333638]">{s.title}</td>
                  <td className="py-3 px-4 text-neutral-600 max-w-md truncate">{s.description}</td>
                  <td className="py-3 px-4 font-extrabold text-[#333638]">
                    {formatCurrency(s.price, s.currency)}
                  </td>
                  <td className="py-3 px-4">
                    {s.isActive ? (
                      <span className="text-emerald-700 font-bold">Active</span>
                    ) : (
                      <span className="text-neutral-400">Disabled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(s)}
                      className="p-1 rounded text-neutral-600 hover:text-[#C79A2B]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
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
                {editingId ? "Edit Service" : "Add Service"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Premium Lounge Service"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Price (INR) *</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  Service is active and selectable
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
