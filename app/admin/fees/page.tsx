"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Edit, Check, X, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatCurrency } from "@/lib/utils";

export default function AdminFeesPage() {
  const [visaTypes, setVisaTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing category fee state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [feeForm, setFeeForm] = useState({
    standardFee: 0,
    childFee: 0,
    blsServiceFee: 1802,
  });

  const fetchVisaTypes = () => {
    setLoading(true);
    fetch("/api/content/visa-types")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVisaTypes(data.visaTypes || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVisaTypes();
  }, []);

  const handleStartEdit = (cat: any) => {
    setEditingCatId(cat.id);
    setFeeForm({
      standardFee: cat.standardFee,
      childFee: cat.childFee || 0,
      blsServiceFee: cat.blsServiceFee,
    });
  };

  const handleSaveFee = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/fees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeForm),
      });

      const data = await res.json();
      if (data.success) {
        setEditingCatId(null);
        fetchVisaTypes();
      } else {
        alert(data.error || "Failed to update fee");
      }
    } catch {
      alert("Error saving fee");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Visa Statutory Tariffs & Service Fees"
        subtitle="Configure consular fees and BLS logistics handling charges dynamically"
      />

      <div className="p-6 sm:p-8 space-y-8 flex-1">
        <div className="p-4 bg-[#FAF5EA] border border-[#E2CCA1] rounded-2xl text-xs text-neutral-800 space-y-1">
          <span className="font-bold text-[#333638]">Dynamic Fee Engine: </span>
          Updates made here immediately propagate across the public website calculators, Visa Types tables, and applicant registration dossiers.
        </div>

        {visaTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#333638]">{type.name}</h3>
                <span className="text-[11px] text-neutral-500">{type.tagline}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                {type.code}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#333638] text-white text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Category Name</th>
                    <th className="py-2.5 px-4">Adult Standard Fee (INR)</th>
                    <th className="py-2.5 px-4">Child (6-12y) Fee (INR)</th>
                    <th className="py-2.5 px-4">BLS Logistics Charge (INR)</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {type.categories.map((cat: any) => {
                    const isEditing = editingCatId === cat.id;

                    return (
                      <tr key={cat.id} className="hover:bg-neutral-50/80">
                        <td className="py-3 px-4 font-bold text-[#333638]">
                          {cat.name}
                        </td>

                        {/* Standard fee */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={feeForm.standardFee}
                              onChange={(e) =>
                                setFeeForm({ ...feeForm, standardFee: parseFloat(e.target.value) || 0 })
                              }
                              className="w-24 px-2 py-1 border border-neutral-300 rounded font-semibold text-xs"
                            />
                          ) : (
                            <span className="font-semibold text-neutral-800">
                              {formatCurrency(cat.standardFee)}
                            </span>
                          )}
                        </td>

                        {/* Child fee */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={feeForm.childFee}
                              onChange={(e) =>
                                setFeeForm({ ...feeForm, childFee: parseFloat(e.target.value) || 0 })
                              }
                              className="w-24 px-2 py-1 border border-neutral-300 rounded font-semibold text-xs"
                            />
                          ) : cat.childFee !== null ? (
                            <span className="text-neutral-700">{formatCurrency(cat.childFee)}</span>
                          ) : (
                            <span className="text-neutral-400">N/A</span>
                          )}
                        </td>

                        {/* BLS fee */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={feeForm.blsServiceFee}
                              onChange={(e) =>
                                setFeeForm({ ...feeForm, blsServiceFee: parseFloat(e.target.value) || 0 })
                              }
                              className="w-24 px-2 py-1 border border-neutral-300 rounded font-semibold text-xs"
                            />
                          ) : (
                            <span className="text-neutral-700">{formatCurrency(cat.blsServiceFee)}</span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveFee(cat.id)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs"
                                title="Save fee"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCatId(null)}
                                className="p-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg shadow-2xs"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(cat)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-[#FAF5EA] text-[#333638] hover:text-[#C79A2B] rounded-lg font-semibold text-[11px] border border-neutral-200 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit Fee</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
