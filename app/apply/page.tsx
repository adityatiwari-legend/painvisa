"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  Copy,
  Printer,
  Search,
  Upload,
  RefreshCw,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { CameraCaptureModal } from "@/components/camera/CameraCaptureModal";
import { maskPassport, formatDate } from "@/lib/utils";

interface DocumentState {
  file: File | null;
  previewUrl: string | null;
  name: string;
  size: number;
  type: string;
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State (Non-sensitive info preserved in sessionStorage)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: "",
    nationality: "Indian",
    visaType: "SCHENGEN",
    visaCategory: "Tourist Visa",
    centreName: "New Delhi",
    consent: false,
  });

  // Available options
  const [centres, setCentres] = useState<any[]>([]);
  const [visaTypes, setVisaTypes] = useState<any[]>([]);

  // Document states (Kept strictly in memory, NEVER written to localStorage)
  const [thumbDoc, setThumbDoc] = useState<DocumentState>({
    file: null,
    previewUrl: null,
    name: "",
    size: 0,
    type: "",
  });

  const [passportDoc, setPassportDoc] = useState<DocumentState>({
    file: null,
    previewUrl: null,
    name: "",
    size: 0,
    type: "",
  });

  const [aadhaarDoc, setAadhaarDoc] = useState<DocumentState>({
    file: null,
    previewUrl: null,
    name: "",
    size: 0,
    type: "",
  });

  // Camera modal state
  const [activeCameraTarget, setActiveCameraTarget] = useState<"passport" | "aadhaar" | "thumb" | null>(null);

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Load non-sensitive progress from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("spainvisa_form_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed, consent: false }));
      }
    } catch {}

    // Load centres and visa types from DB
    Promise.all([
      fetch("/api/content/centres").then((res) => res.json()),
      fetch("/api/content/visa-types").then((res) => res.json()),
    ]).then(([centresRes, visaTypesRes]) => {
      if (centresRes.success) setCentres(centresRes.centres || []);
      if (visaTypesRes.success) setVisaTypes(visaTypesRes.visaTypes || []);
    });
  }, []);

  // Save non-sensitive progress to sessionStorage
  useEffect(() => {
    try {
      const nonSensitive = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        passportNumber: formData.passportNumber,
        nationality: formData.nationality,
        visaType: formData.visaType,
        visaCategory: formData.visaCategory,
        centreName: formData.centreName,
      };
      sessionStorage.setItem("spainvisa_form_progress", JSON.stringify(nonSensitive));
    } catch {}
  }, [formData]);

  // Handle file assignment
  const handleAssignFile = (file: File, target: "thumb" | "passport" | "aadhaar") => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Selected file exceeds maximum limit of 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const docState: DocumentState = {
      file,
      previewUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    };

    if (target === "thumb") {
      if (thumbDoc.previewUrl) URL.revokeObjectURL(thumbDoc.previewUrl);
      setThumbDoc(docState);
    } else if (target === "passport") {
      if (passportDoc.previewUrl) URL.revokeObjectURL(passportDoc.previewUrl);
      setPassportDoc(docState);
    } else if (target === "aadhaar") {
      if (aadhaarDoc.previewUrl) URL.revokeObjectURL(aadhaarDoc.previewUrl);
      setAadhaarDoc(docState);
    }
  };

  const handleRemoveDoc = (target: "thumb" | "passport" | "aadhaar") => {
    if (target === "thumb") {
      if (thumbDoc.previewUrl) URL.revokeObjectURL(thumbDoc.previewUrl);
      setThumbDoc({ file: null, previewUrl: null, name: "", size: 0, type: "" });
    } else if (target === "passport") {
      if (passportDoc.previewUrl) URL.revokeObjectURL(passportDoc.previewUrl);
      setPassportDoc({ file: null, previewUrl: null, name: "", size: 0, type: "" });
    } else if (target === "aadhaar") {
      if (aadhaarDoc.previewUrl) URL.revokeObjectURL(aadhaarDoc.previewUrl);
      setAadhaarDoc({ file: null, previewUrl: null, name: "", size: 0, type: "" });
    }
  };

  // Step 1 validation
  const isStep1Valid =
    formData.name.trim().length >= 2 &&
    formData.email.includes("@") &&
    formData.phone.length >= 10 &&
    formData.dateOfBirth.length > 0 &&
    formData.passportNumber.length >= 6;

  // Step 2 validation
  const isStep2Valid = Boolean(thumbDoc.file && passportDoc.file && aadhaarDoc.file);

  // Handle final submission
  const handleSubmit = async () => {
    if (!formData.consent) {
      setSubmissionError("You must provide consent before submitting.");
      return;
    }

    if (!thumbDoc.file || !passportDoc.file || !aadhaarDoc.file) {
      setSubmissionError("All three identity documents are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("dateOfBirth", formData.dateOfBirth);
      data.append("passportNumber", formData.passportNumber);
      data.append("nationality", formData.nationality);
      data.append("visaType", formData.visaType);
      data.append("visaCategory", formData.visaCategory);
      data.append("centreName", formData.centreName);
      data.append("consent", "true");

      data.append("thumbPhoto", thumbDoc.file);
      data.append("passportPhoto", passportDoc.file);
      data.append("aadhaarPhoto", aadhaarDoc.file);

      const res = await fetch("/api/applicants", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setSubmissionError(json.error || "Application submission failed. Please verify all details.");
      } else {
        // Clear saved draft
        try {
          sessionStorage.removeItem("spainvisa_form_progress");
        } catch {}
        setSubmissionSuccess(json);
        setCurrentStep(5); // Complete screen
      }
    } catch {
      setSubmissionError("A network error occurred. Please try submitting again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (submissionSuccess?.referenceNumber) {
      navigator.clipboard.writeText(submissionSuccess.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Available categories for selected visa type
  const currentVisaTypeObj = visaTypes.find((v) => v.code === formData.visaType);
  const categoriesList = currentVisaTypeObj?.categories || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 no-print">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C79A2B]">
              Consular Application Wizard
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#333638]">
              Spain Visa Applicant Registration
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
              Register your personal information and securely capture required biometric and identity photographs.
            </p>
          </div>

          {/* Stepper Indicator */}
          {currentStep <= 4 && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E5E5E5] shadow-xs no-print">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { step: 1, label: "Personal" },
                  { step: 2, label: "Documents" },
                  { step: 3, label: "Review" },
                  { step: 4, label: "Consent & Submit" },
                ].map((item) => {
                  const isPassed = currentStep > item.step;
                  const isCurrent = currentStep === item.step;

                  return (
                    <div key={item.step} className="flex flex-col items-center space-y-1.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isPassed
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-[#C79A2B] text-white ring-4 ring-[#FAF5EA]"
                            : "bg-neutral-100 text-neutral-400 border border-neutral-300"
                        }`}
                      >
                        {isPassed ? <CheckCircle className="w-4 h-4" /> : `0${item.step}`}
                      </div>
                      <span
                        className={`text-[11px] font-semibold hidden sm:inline ${
                          isCurrent
                            ? "text-[#C79A2B]"
                            : isPassed
                            ? "text-neutral-800"
                            : "text-neutral-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: PERSONAL INFORMATION                            */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-sm space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-bold text-[#333638]">
                  Step 01: Applicant & Visa Details
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Ensure details match your official international travel passport precisely.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Full Name (As in Passport) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Given Name Surname"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="applicant@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Z1234567"
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Visa Classification *
                    </label>
                    <select
                      value={formData.visaType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        const matchingCat =
                          newType === "SCHENGEN" ? "Tourist Visa" : "Student Visa >90 days";
                        setFormData({ ...formData, visaType: newType, visaCategory: matchingCat });
                      }}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none font-medium"
                    >
                      <option value="SCHENGEN">Schengen Visa (Short Stay &le;90d)</option>
                      <option value="NATIONAL">National Visa (Long Stay &gt;90d)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Visa Category *
                    </label>
                    <select
                      value={formData.visaCategory}
                      onChange={(e) => setFormData({ ...formData, visaCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none font-medium"
                    >
                      {categoriesList.map((c: any) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Application Centre *
                    </label>
                    <select
                      value={formData.centreName}
                      onChange={(e) => setFormData({ ...formData, centreName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none font-medium"
                    >
                      {centres.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.country})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex justify-end">
                <button
                  type="button"
                  disabled={!isStep1Valid}
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  <span>Continue to Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: IDENTITY DOCUMENTS (CAMERA & FILE UPLOAD)        */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-sm space-y-8"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-bold text-[#333638]">
                  Step 02: Secure Identity Document Capture
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Upload or use your live device camera to capture required identity photographs. Documents are encrypted and processed through an isolated secure vault.
                </p>
              </div>

              {/* Upload Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. THUMB PICTURE */}
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#333638] uppercase tracking-wider">
                        1. Thumb Impression *
                      </span>
                      {thumbDoc.file && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Uploaded ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Clear thumb impression on white paper or ink scan.
                    </p>
                  </div>

                  {/* Preview or Empty Area */}
                  <div className="aspect-square bg-white rounded-xl border border-dashed border-neutral-300 flex items-center justify-center overflow-hidden relative">
                    {thumbDoc.previewUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbDoc.previewUrl}
                          alt="Thumb Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc("thumb")}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Remove document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4 text-neutral-400 space-y-1">
                        <Upload className="w-6 h-6 mx-auto opacity-50" />
                        <span className="text-[11px] block">No impression attached</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveCameraTarget("thumb")}
                      className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#C79A2B]" />
                      <span>Capture with Camera</span>
                    </button>

                    <label className="w-full py-2 px-3 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAssignFile(file, "thumb");
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* 2. PASSPORT PHOTO */}
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#333638] uppercase tracking-wider">
                        2. Passport Photograph *
                      </span>
                      {passportDoc.file && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Uploaded ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Color photo against white/light background, 35x45mm style.
                    </p>
                  </div>

                  {/* Preview Area */}
                  <div className="aspect-square bg-white rounded-xl border border-dashed border-neutral-300 flex items-center justify-center overflow-hidden relative">
                    {passportDoc.previewUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={passportDoc.previewUrl}
                          alt="Passport Photo Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc("passport")}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4 text-neutral-400 space-y-1">
                        <Camera className="w-6 h-6 mx-auto opacity-50" />
                        <span className="text-[11px] block">Camera / File required</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveCameraTarget("passport")}
                      className="w-full py-2 px-3 bg-[#C79A2B] hover:bg-[#B0851F] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Open Camera</span>
                    </button>

                    <label className="w-full py-2 px-3 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload instead</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAssignFile(file, "passport");
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* 3. AADHAAR CARD PHOTO */}
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#333638] uppercase tracking-wider">
                        3. Aadhaar Photograph *
                      </span>
                      {aadhaarDoc.file && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Uploaded ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Front view of government Aadhaar card.
                    </p>
                  </div>

                  {/* Preview Area */}
                  <div className="aspect-square bg-white rounded-xl border border-dashed border-neutral-300 flex items-center justify-center overflow-hidden relative">
                    {aadhaarDoc.previewUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={aadhaarDoc.previewUrl}
                          alt="Aadhaar Photo Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc("aadhaar")}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Remove card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4 text-neutral-400 space-y-1">
                        <Upload className="w-6 h-6 mx-auto opacity-50" />
                        <span className="text-[11px] block">Front Aadhaar card image</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveCameraTarget("aadhaar")}
                      className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#C79A2B]" />
                      <span>Open Camera</span>
                    </button>

                    <label className="w-full py-2 px-3 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload instead</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAssignFile(file, "aadhaar");
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={!isStep2Valid}
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  <span>Review Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: REVIEW                                           */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-sm space-y-8"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-bold text-[#333638]">
                  Step 03: Review Your Information
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Carefully review your personal credentials and attached identity documents prior to final submission.
                </p>
              </div>

              {/* Personal Details Summary */}
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#333638]">
                    Personal & Travel Information
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-[#C79A2B] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Full Name</span>
                    <span className="font-bold text-[#333638]">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Email Address</span>
                    <span className="font-bold text-[#333638]">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Phone Number</span>
                    <span className="font-bold text-[#333638]">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Date of Birth</span>
                    <span className="font-bold text-[#333638]">{formatDate(formData.dateOfBirth)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Passport Number</span>
                    <span className="font-bold font-mono text-[#333638]">
                      {maskPassport(formData.passportNumber)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Nationality</span>
                    <span className="font-bold text-[#333638]">{formData.nationality}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Visa Classification</span>
                    <span className="font-bold text-[#333638]">{formData.visaType}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Visa Category</span>
                    <span className="font-bold text-[#333638]">{formData.visaCategory}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Application Centre</span>
                    <span className="font-bold text-[#333638]">{formData.centreName}</span>
                  </div>
                </div>
              </div>

              {/* Documents Review */}
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#333638]">
                    Attached Identity Documents
                  </h3>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-[#C79A2B] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs text-center">
                  <div className="space-y-2">
                    <span className="font-semibold text-neutral-600 block text-[11px]">Thumb Impression</span>
                    <div className="w-24 h-24 mx-auto bg-white rounded-xl border border-neutral-300 overflow-hidden">
                      {thumbDoc.previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbDoc.previewUrl} alt="Thumb" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Attached ✓</span>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-neutral-600 block text-[11px]">Passport Photo</span>
                    <div className="w-24 h-24 mx-auto bg-white rounded-xl border border-neutral-300 overflow-hidden">
                      {passportDoc.previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={passportDoc.previewUrl} alt="Passport" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Attached ✓</span>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-neutral-600 block text-[11px]">Aadhaar Card</span>
                    <div className="w-24 h-24 mx-auto bg-white rounded-xl border border-neutral-300 overflow-hidden">
                      {aadhaarDoc.previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={aadhaarDoc.previewUrl} alt="Aadhaar" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Attached ✓</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                >
                  <span>Proceed to Consent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: CONSENT & SUBMISSION                             */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-sm space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-bold text-[#333638]">
                  Step 04: Declaration & Consent
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Please review our statutory privacy declaration before authorizing submission.
                </p>
              </div>

              {/* Privacy Policy Box */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 space-y-3 leading-relaxed max-h-48 overflow-y-auto">
                <h4 className="font-bold text-[#333638] uppercase tracking-wider text-[11px]">
                  Data Privacy & Document Handling Policy
                </h4>
                <p>
                  In compliance with European General Data Protection Regulation (GDPR) and the Digital Personal Data Protection Act, personal identity records and biometric photographs submitted through this portal are collected exclusively to facilitate visa processing with the Embassy and Consulates General of Spain.
                </p>
                <p>
                  Documents are stored in a restricted local server storage vault outside public access routes. Access is audited and restricted to authorized visa logistics personnel. Your details will never be sold or used for marketing purposes.
                </p>
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="p-4 rounded-xl border-2 border-[#C79A2B]/40 bg-[#FAF5EA]/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="w-5 h-5 rounded border-neutral-300 text-[#C79A2B] focus:ring-[#C79A2B] mt-0.5 shrink-0"
                  />
                  <span className="text-xs font-semibold text-[#333638] leading-relaxed">
                    I consent to the collection and processing of the information and documents submitted for the purpose described by this application.
                  </span>
                </label>
              </div>

              {submissionError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Navigation & Submit button */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Review</span>
                </button>

                <button
                  type="button"
                  disabled={!formData.consent || isSubmitting}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Encrypting & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* STEP 5: SUBMISSION SUCCESS & CONFIRMATION RECEIPT        */}
          {/* ======================================================== */}
          {currentStep === 5 && submissionSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E5E5E5] shadow-xl space-y-8"
            >
              {/* Success Badge */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#333638]">
                  Application Submitted Successfully
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
                  Your visa application and biometric documents have been safely received and registered into our processing queue.
                </p>
              </div>

              {/* Reference Number Box */}
              <div className="p-6 rounded-2xl bg-[#FAF5EA] border-2 border-[#C79A2B] text-center space-y-3">
                <span className="text-xs uppercase font-bold tracking-widest text-[#B0851F]">
                  Your Application Reference Number
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#333638] font-mono tracking-wider">
                  {submissionSuccess.referenceNumber}
                </div>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-800 rounded-lg border border-neutral-300 shadow-2xs transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#C79A2B]" />
                    <span>{copied ? "Copied to Clipboard!" : "Copy Reference"}</span>
                  </button>
                </div>
              </div>

              {/* Printable Application Receipt Summary */}
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-3 print:border-none print:p-0">
                <div className="font-bold text-sm text-[#333638] pb-2 border-b border-neutral-200">
                  Application Summary & Verification Receipt
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Applicant Name</span>
                    <span className="font-bold text-[#333638]">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Email</span>
                    <span className="font-bold text-[#333638]">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Phone</span>
                    <span className="font-bold text-[#333638]">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Visa Category</span>
                    <span className="font-bold text-[#333638]">{formData.visaCategory}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Application Centre</span>
                    <span className="font-bold text-[#333638]">{formData.centreName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Initial Status</span>
                    <span className="font-bold text-blue-700">SUBMITTED (In Review)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3 bg-[#333638] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-[#C79A2B]" />
                  <span>Download / Print Receipt</span>
                </button>

                <Link
                  href={`/track-application?ref=${encodeURIComponent(submissionSuccess.referenceNumber)}`}
                  className="w-full sm:w-auto px-6 py-3 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Application Status</span>
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-xl text-center transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Live Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={Boolean(activeCameraTarget)}
        onClose={() => setActiveCameraTarget(null)}
        onCapture={(file) => {
          if (activeCameraTarget) {
            handleAssignFile(file, activeCameraTarget);
            setActiveCameraTarget(null);
          }
        }}
        title={
          activeCameraTarget === "passport"
            ? "Live Passport Photograph Capture"
            : activeCameraTarget === "aadhaar"
            ? "Capture Front View of Aadhaar Card"
            : "Capture Thumb Impression"
        }
        guideText={
          activeCameraTarget === "passport"
            ? "Center your face in the oval frame, neutral expression, white background."
            : "Keep document flat, in sharp focus, without camera reflection."
        }
        aspectRatio={activeCameraTarget === "passport" ? "portrait" : "standard"}
      />

      <Footer />
    </div>
  );
}
