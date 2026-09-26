"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, Plus, Edit, Trash2, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: "General",
    question: "",
    answer: "",
    sortOrder: 0,
    isActive: true,
  });

  const fetchFaqs = () => {
    setLoading(true);
    fetch("/api/admin/faqs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFaqs(data.faqs || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      category: "General",
      question: "",
      answer: "",
      sortOrder: faqs.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (f: any) => {
    setEditingId(f.id);
    setForm({
      category: f.category,
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder,
      isActive: f.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchFaqs();
      } else {
        alert(data.error || "Failed to save FAQ");
      }
    } catch {
      alert("Error saving FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchFaqs();
    } catch {
      alert("Error deleting FAQ");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Frequently Asked Questions (FAQ) Editor"
        subtitle="Manage knowledge base answers and public guidance"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-[#333638]">
              Published Questions ({faqs.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Categorized under General, Application, Documents & Fees, Tracking
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Question</th>
                <th className="py-3 px-4">Answer</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {faqs.map((f) => (
                <tr key={f.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {f.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#333638] max-w-xs">{f.question}</td>
                  <td className="py-3 px-4 text-neutral-600 max-w-md truncate">{f.answer}</td>
                  <td className="py-3 px-4 text-center text-neutral-500 font-mono">{f.sortOrder}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(f)}
                      className="p-1 rounded text-neutral-600 hover:text-[#C79A2B]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(f.id)}
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-[#333638]">
                {editingId ? "Edit FAQ" : "Add FAQ Entry"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  >
                    <option value="General">General</option>
                    <option value="Application">Application</option>
                    <option value="Documents & Fees">Documents & Fees</option>
                    <option value="Tracking & Delivery">Tracking & Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Answer *</label>
                <textarea
                  required
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
