"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [successKey, setSuccessKey] = useState<string | null>(null);

  const fetchSettings = () => {
    setLoading(true);
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.settings || []);
          const map: Record<string, string> = {};
          data.settings?.forEach((s: any) => {
            map[s.key] = s.value;
          });
          setEditValues(map);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSetting = async (key: string, description?: string) => {
    setSavingKey(key);
    setSuccessKey(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: editValues[key],
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessKey(key);
        setTimeout(() => setSuccessKey(null), 3000);
      } else {
        alert(data.error || "Failed to update setting");
      }
    } catch {
      alert("Error saving setting");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Portal Configuration & External URLs"
        subtitle="Manage official BLS external redirect endpoints and global system parameters"
      />

      <div className="p-6 sm:p-8 space-y-6 flex-1 max-w-4xl">
        <div className="p-4 bg-[#FAF5EA] border border-[#E2CCA1] rounded-2xl text-xs text-neutral-800 space-y-1">
          <span className="font-bold text-[#333638]">System Configuration Policy: </span>
          External URLs for appointment booking, letter reprint, appointment cancellation, and official embassy tracking are dynamically loaded from this registry.
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-sm text-[#333638]">
              Configured External URLs & Site Directives
            </h3>
            <p className="text-xs text-neutral-400">
              Changes reflect immediately on public CTA buttons and links
            </p>
          </div>

          <div className="space-y-6">
            {settings.map((s) => (
              <div
                key={s.key}
                className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#333638]">
                      {s.key}
                    </span>
                    <p className="text-[11px] text-neutral-500">{s.description}</p>
                  </div>
                  {successKey === s.key && (
                    <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Saved Successfully
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editValues[s.key] ?? s.value}
                    onChange={(e) =>
                      setEditValues({ ...editValues, [s.key]: e.target.value })
                    }
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={savingKey === s.key}
                    onClick={() => handleSaveSetting(s.key, s.description)}
                    className="px-4 py-2 bg-[#333638] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <Save className="w-3.5 h-3.5 text-[#C79A2B]" />
                    <span>{savingKey === s.key ? "Saving..." : "Update"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
