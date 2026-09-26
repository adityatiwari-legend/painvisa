"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Clock,
  ShieldCheck,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { STATUS_MAP, formatDate, formatDateTime, maskPassport } from "@/lib/utils";

export default function AdminApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [applicant, setApplicant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("DOCUMENTS_UNDER_REVIEW");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<{ id: string; type: string; mimeType: string } | null>(null);

  const fetchApplicantDetail = () => {
    setLoading(true);
    fetch(`/api/admin/applicants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.applicant) {
          setApplicant(data.applicant);
          setNewStatus(data.applicant.status);
        } else {
          setError(data.error || "Applicant not found.");
        }
      })
      .catch(() => setError("Network error fetching details."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) fetchApplicantDetail();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingStatus(true);

    try {
      const res = await fetch(`/api/admin/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowStatusModal(false);
        setStatusNote("");
        fetchApplicantDetail();
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch {
      alert("Error updating status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-xs font-semibold text-neutral-500">
        Retrieving applicant dossier...
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="p-8 space-y-4">
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error || "Applicant could not be loaded."}</span>
        </div>
        <Link
          href="/admin/applicants"
          className="text-xs font-bold text-[#C79A2B] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Applicants</span>
        </Link>
      </div>
    );
  }

  const currentMeta = STATUS_MAP[applicant.status as keyof typeof STATUS_MAP];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title={`Applicant File: ${applicant.referenceNumber}`}
        subtitle={`Submitted on ${formatDate(applicant.createdAt)} • Assigned to ${applicant.centreName}`}
      />

      <div className="p-6 sm:p-8 space-y-8 flex-1">
        {/* Navigation & Status Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/admin/applicants"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#333638] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Applicants</span>
          </Link>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                currentMeta?.badgeClass || "bg-neutral-100"
              }`}
            >
              {currentMeta?.label || applicant.status}
            </span>

            <button
              type="button"
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
            >
              Advance / Update Status
            </button>
          </div>
        </div>

        {/* Top Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Personal & Application Info */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#333638] uppercase tracking-wider">
                Applicant Credentials & Visa Profile
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">
                ID: {applicant.id}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px]">Full Name</span>
                <span className="font-bold text-[#333638] text-sm">{applicant.name}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Email Address</span>
                <span className="font-semibold text-neutral-800">{applicant.email}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Phone Number</span>
                <span className="font-semibold text-neutral-800">{applicant.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Date of Birth</span>
                <span className="font-semibold text-neutral-800">{formatDate(applicant.dateOfBirth)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Passport Number</span>
                <span className="font-bold font-mono text-[#333638]">{applicant.passportNumber || "N/A"}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Nationality</span>
                <span className="font-semibold text-neutral-800">{applicant.nationality}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Visa Classification</span>
                <span className="font-bold text-[#333638]">{applicant.visaType}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Visa Category</span>
                <span className="font-bold text-[#333638]">{applicant.visaCategory}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Application Centre</span>
                <span className="font-bold text-[#333638]">{applicant.centreName}</span>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-800">Consent Verification: </span>
                {applicant.consentGiven ? (
                  <span className="text-emerald-700 font-semibold">
                    Explicit consent recorded at submission ✓
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Not recorded</span>
                )}
              </div>
              <div className="text-[11px] text-neutral-400">
                Created: {formatDateTime(applicant.createdAt)}
              </div>
            </div>
          </div>

          {/* Col 3: Milestones Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#333638] uppercase tracking-wider pb-2 border-b border-neutral-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C79A2B]" />
              <span>Status Audit Timeline</span>
            </h3>

            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 max-h-96 overflow-y-auto pr-1">
              {applicant.statusHistory?.map((hist: any) => {
                const meta = STATUS_MAP[hist.newStatus as keyof typeof STATUS_MAP];
                return (
                  <div key={hist.id} className="relative space-y-1 text-xs">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#C79A2B] ring-4 ring-white" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#333638]">
                        {meta?.label || hist.newStatus}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      By {hist.changedBy} • {formatDateTime(hist.createdAt)}
                    </div>
                    {hist.note && (
                      <p className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded-lg border border-neutral-200 mt-1">
                        {hist.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECURE IDENTITY DOCUMENTS VAULT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
              Isolated Local Vault
            </span>
            <h3 className="text-xl font-extrabold text-[#333638] mt-1">
              Uploaded Biometric & Identity Documents
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Files are retrieved on-demand through authenticated API endpoints with strict audit trails. Physical paths are never disclosed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {applicant.documents?.map((doc: any) => {
              const docLabel =
                doc.type === "PASSPORT"
                  ? "Passport Photograph"
                  : doc.type === "AADHAAR"
                  ? "Aadhaar Card Photo"
                  : "Thumb Impression";

              return (
                <div
                  key={doc.id}
                  className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#333638] uppercase tracking-wide">
                        {docLabel}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded">
                        {doc.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Size: {Math.round(doc.size / 1024)} KB • {doc.mimeType}
                    </div>
                  </div>

                  {/* Document preview container */}
                  <div className="aspect-square bg-white rounded-xl border border-neutral-300 overflow-hidden flex items-center justify-center relative group">
                    {/* Secure preview streamed via authenticated API */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/documents/${doc.id}`}
                      alt={docLabel}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewDoc({ id: doc.id, type: docLabel, mimeType: doc.mimeType })
                      }
                      className="py-2 px-3 bg-neutral-800 hover:bg-neutral-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={`/api/documents/${doc.id}?download=1`}
                      className="py-2 px-3 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STATUS UPDATE MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-[#333638]">
                Advance Application Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#333638] uppercase tracking-wider text-[11px] mb-1.5">
                  Select Next Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-semibold text-[#333638] focus:ring-2 focus:ring-[#C79A2B]"
                >
                  {Object.keys(STATUS_MAP).map((k) => (
                    <option key={k} value={k}>
                      {STATUS_MAP[k as keyof typeof STATUS_MAP].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#333638] uppercase tracking-wider text-[11px] mb-1.5">
                  Administrative Note (Recorded in Audit & Applicant Timeline)
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Identity documents verified against consular criteria. Slot confirmed."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-6 py-2.5 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors"
                >
                  {updatingStatus ? "Saving..." : "Commit Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LARGE DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h4 className="font-bold text-sm text-[#333638]">{previewDoc.type}</h4>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[70vh] flex items-center justify-center bg-neutral-900 rounded-xl overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/documents/${previewDoc.id}`}
                alt={previewDoc.type}
                className="max-h-[65vh] object-contain mx-auto"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-neutral-400">
                Audited access: /api/documents/{previewDoc.id}
              </span>
              <a
                href={`/api/documents/${previewDoc.id}?download=1`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#333638] hover:bg-neutral-800 text-white rounded-xl text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5 text-[#C79A2B]" />
                <span>Download File</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
