"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Clock,
  Camera,
  MapPin,
  Download,
  Search,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Info,
  DollarSign,
  Briefcase,
  Plane,
  Heart,
  Anchor,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { formatCurrency } from "@/lib/utils";

// Structured Consular Jurisdiction Data
const JURISDICTION_DATA = {
  DELHI: {
    name: "Embassy of Spain — New Delhi Jurisdiction",
    description: "Applicants residing lawfully in Northern, Eastern, and Southern India for the last 6 months.",
    states: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chandigarh (UT)",
      "Delhi NCR",
      "Haryana",
      "Himachal Pradesh",
      "Jammu & Kashmir (UT)",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Ladakh (UT)",
      "Lakshadweep (UT)",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Puducherry (UT)",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Andaman & Nicobar Islands (UT)",
    ],
  },
  MUMBAI: {
    name: "Consulate General of Spain — Mumbai Jurisdiction",
    description: "Applicants residing lawfully in Western & Central India for the last 6 months.",
    states: [
      "Chhattisgarh",
      "Dadra & Nagar Haveli and Daman & Diu (UT)",
      "Goa",
      "Gujarat",
      "Madhya Pradesh",
      "Maharashtra",
    ],
  },
};

interface VisaCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  documentsRequired: string;
  standardFee: number;
  childFee: number | null;
  blsServiceFee: number;
}

interface VisaTypeData {
  id: string;
  code: string;
  name: string;
  tagline: string | null;
  maxStay: string;
  overview: string;
  photoSpecifications: string;
  processingTime: string;
  jurisdictionInfo: string | null;
  formDownloadUrl: string | null;
  categories: VisaCategory[];
}

function VisaTypesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "national" ? "national" : "schengen";
  const [activeTab, setActiveTab] = useState<"schengen" | "national">(initialTab);

  const [visaTypes, setVisaTypes] = useState<VisaTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Jurisdiction state search query
  const [jurisdictionSearch, setJurisdictionSearch] = useState("");

  // Category filter / accordion states
  const [selectedSchengenSlug, setSelectedSchengenSlug] = useState<string>("tourist-visa");
  const [expandedNationalCat, setExpandedNationalCat] = useState<string | null>(null);
  const [nationalSearch, setNationalSearch] = useState("");

  useEffect(() => {
    document.title = "Visa Types | BLS Biometric";
    fetch("/api/content/visa-types")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.visaTypes) {
          setVisaTypes(data.visaTypes);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const schengenData = visaTypes.find((v) => v.code === "SCHENGEN");
  const nationalData = visaTypes.find((v) => v.code === "NATIONAL");

  // Selected Schengen category
  const selectedSchengenCat =
    schengenData?.categories.find((c) => c.slug === selectedSchengenSlug) ||
    schengenData?.categories[0];

  // Filtered jurisdiction states
  const filteredDelhiStates = useMemo(() => {
    return JURISDICTION_DATA.DELHI.states.filter((s) =>
      s.toLowerCase().includes(jurisdictionSearch.toLowerCase())
    );
  }, [jurisdictionSearch]);

  const filteredMumbaiStates = useMemo(() => {
    return JURISDICTION_DATA.MUMBAI.states.filter((s) =>
      s.toLowerCase().includes(jurisdictionSearch.toLowerCase())
    );
  }, [jurisdictionSearch]);

  // Filtered National categories
  const filteredNationalCategories = useMemo(() => {
    if (!nationalData?.categories) return [];
    if (!nationalSearch.trim()) return nationalData.categories;
    return nationalData.categories.filter((cat) =>
      cat.name.toLowerCase().includes(nationalSearch.toLowerCase()) ||
      cat.description.toLowerCase().includes(nationalSearch.toLowerCase())
    );
  }, [nationalData, nationalSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-[#333638] text-white py-12 border-b border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-[#C79A2B] text-xs font-semibold border border-neutral-700">
              <Layers className="w-3.5 h-3.5" />
              Official Visa Classification
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Spain Visa Types & Specifications
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl font-normal">
              Select the appropriate visa classification corresponding to your intended duration of stay, purpose of visit, and territorial jurisdiction in India.
            </p>

            {/* Segmented Control / Tabs */}
            <div className="pt-6">
              <div className="inline-flex p-1.5 rounded-xl bg-neutral-900 border border-neutral-700 max-w-md w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab("schengen")}
                  className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all text-center ${
                    activeTab === "schengen"
                      ? "bg-[#C79A2B] text-white shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <div>SCHENGEN VISA</div>
                  <div className="text-[10px] font-normal opacity-90">Short Stay (Up to 90 Days)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("national")}
                  className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all text-center ${
                    activeTab === "national"
                      ? "bg-[#C79A2B] text-white shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <div>NATIONAL VISA</div>
                  <div className="text-[10px] font-normal opacity-90">Long Stay (Over 90 Days)</div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT AREA */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "schengen" ? (
            /* ======================================================== */
            /* SCHENGEN VISA TAB                                        */
            /* ======================================================== */
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Schengen Overview Banner */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                      Short Stay Visa Overview
                    </span>
                    <h2 className="text-2xl font-bold text-[#333638]">
                      Schengen Area Regulations & Eligibility
                    </h2>
                  </div>
                  {schengenData?.formDownloadUrl && (
                    <a
                      href={schengenData.formDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#333638] hover:bg-neutral-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#C79A2B]" />
                      Download Application Form
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {schengenData?.overview ||
                    "Schengen visas allow travelers to enter Spain and all other 28 Schengen member countries for short visits, tourism, business, transit, or visiting family. Stays cannot exceed 90 days in any 180-day rolling period."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#FAF5EA] border border-[#E2CCA1]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#B0851F]">
                      Maximum Duration
                    </div>
                    <div className="text-sm font-bold text-[#333638] mt-0.5">
                      90 Days within 180-day period
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Standard Processing
                    </div>
                    <div className="text-sm font-bold text-[#333638] mt-0.5">
                      Minimum 15 Calendar Days
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Territorial Validity
                    </div>
                    <div className="text-sm font-bold text-[#333638] mt-0.5">
                      All 29 Schengen Countries
                    </div>
                  </div>
                </div>
              </div>

              {/* Schengen Visa Categories Segmented Selector */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#333638]">
                  Select Category to View Requirements & Fees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {schengenData?.categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedSchengenSlug(cat.slug)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedSchengenSlug === cat.slug
                          ? "bg-[#C79A2B] text-white border-[#C79A2B] shadow-sm"
                          : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Category Detail Card */}
              {selectedSchengenCat && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left 2 Cols: Details & Documents */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 mb-2">
                        Short Stay Schengen
                      </div>
                      <h3 className="text-2xl font-bold text-[#333638]">
                        {selectedSchengenCat.name}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-2">
                        {selectedSchengenCat.description}
                      </p>
                    </div>

                    {/* Documents Required */}
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#333638] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#C79A2B]" />
                        Documents Required Checklist
                      </h4>
                      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                        {selectedSchengenCat.documentsRequired}
                      </div>
                    </div>

                    {/* Photo Specifications */}
                    <div className="space-y-3 pt-4 border-t border-neutral-100" id="photo-specs">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#333638] flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#C79A2B]" />
                        Biometric Photo Specifications
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
                        <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Recent photograph not older than 6 months</span>
                        </div>
                        <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>35mm x 45mm, light/white/off-white background</span>
                        </div>
                        <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>70-80% face coverage, full face in focus</span>
                        </div>
                        <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Neutral non-smiling expression, no sunglasses/hats</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Visa Fees & Action */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs space-y-6">
                      <div className="pb-4 border-b border-neutral-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                          Database-Driven
                        </span>
                        <h4 className="text-lg font-bold text-[#333638]">
                          Statutory Visa Fees
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                          <span className="text-neutral-600">Adult Fee:</span>
                          <span className="font-bold text-[#333638]">
                            {formatCurrency(selectedSchengenCat.standardFee)}
                          </span>
                        </div>

                        {selectedSchengenCat.childFee !== null && (
                          <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                            <span className="text-neutral-600">Children 6–12 Years:</span>
                            <span className="font-bold text-[#333638]">
                              {formatCurrency(selectedSchengenCat.childFee)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                          <span className="text-neutral-600">Children Under 6:</span>
                          <span className="font-bold text-emerald-700">Gratis (₹0)</span>
                        </div>

                        <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                          <span className="text-neutral-600">BLS Service Charge:</span>
                          <span className="font-bold text-[#333638]">
                            {formatCurrency(selectedSchengenCat.blsServiceFee)}
                          </span>
                        </div>

                        <div className="pt-2 flex justify-between items-center font-extrabold text-sm text-[#333638]">
                          <span>Total Estimated (Adult):</span>
                          <span className="text-[#C79A2B]">
                            {formatCurrency(selectedSchengenCat.standardFee + selectedSchengenCat.blsServiceFee)}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                        <span className="font-bold">Disclaimer: </span>
                        Fees are subject to change according to applicable exchange rates and official diplomatic updates without prior notice.
                      </div>

                      <Link
                        href="/apply"
                        className="w-full py-3 px-4 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center block shadow-sm transition-all"
                      >
                        Start Application For This Category
                      </Link>
                    </div>

                    {/* Processing timeline reminder */}
                    <div className="bg-[#FAF5EA] border border-[#E2CCA1] rounded-2xl p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#B0851F]">
                        <Clock className="w-4 h-4" />
                        <span>Processing Time Note</span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        Standard diplomatic processing requires a minimum of 15 calendar days from delivery to Embassy/Consulate. Early submission is strongly recommended.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* JURISDICTION SECTION (SEARCHABLE / FILTERABLE STATES) */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6" id="jurisdiction">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                      Consular Competence
                    </span>
                    <h3 className="text-2xl font-bold text-[#333638]">
                      Search Consular Jurisdiction by State / UT
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      Determine whether your application must be lodged under New Delhi or Mumbai jurisdiction based on 6-month continuous lawful residence.
                    </p>
                  </div>

                  {/* Search input */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search state (e.g. Maharashtra, Punjab)..."
                      value={jurisdictionSearch}
                      onChange={(e) => setJurisdictionSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C79A2B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* New Delhi Jurisdiction */}
                  <div className="rounded-xl border border-neutral-200 p-5 bg-neutral-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <h4 className="text-sm font-bold text-[#333638]">
                        {JURISDICTION_DATA.DELHI.name}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600">
                      {JURISDICTION_DATA.DELHI.description}
                    </p>
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Covered States & Union Territories ({filteredDelhiStates.length}):
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredDelhiStates.length > 0 ? (
                          filteredDelhiStates.map((st) => (
                            <span
                              key={st}
                              className="px-2.5 py-1 rounded bg-white text-xs text-neutral-700 border border-neutral-200 shadow-2xs font-medium"
                            >
                              {st}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-400 italic">No matches in New Delhi jurisdiction</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mumbai Jurisdiction */}
                  <div className="rounded-xl border border-neutral-200 p-5 bg-neutral-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                      <h4 className="text-sm font-bold text-[#333638]">
                        {JURISDICTION_DATA.MUMBAI.name}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600">
                      {JURISDICTION_DATA.MUMBAI.description}
                    </p>
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Covered States & Union Territories ({filteredMumbaiStates.length}):
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredMumbaiStates.length > 0 ? (
                          filteredMumbaiStates.map((st) => (
                            <span
                              key={st}
                              className="px-2.5 py-1 rounded bg-white text-xs text-neutral-700 border border-neutral-200 shadow-2xs font-medium"
                            >
                              {st}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-400 italic">No matches in Mumbai jurisdiction</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* NATIONAL VISA TAB                                        */
            /* ======================================================== */
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* National Overview Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                      Long Stay Visa Overview
                    </span>
                    <h2 className="text-2xl font-bold text-[#333638]">
                      Spanish National (Type D) Visa Categories
                    </h2>
                  </div>
                  {nationalData?.formDownloadUrl && (
                    <a
                      href={nationalData.formDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#333638] hover:bg-neutral-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#C79A2B]" />
                      Download National Form
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {nationalData?.overview ||
                    "National (Type D) visas authorize foreign nationals to reside, study, conduct research, or work in Spain for periods exceeding 90 days. All national visas are subject to initial authorization and approval by the Spanish Ministry of Foreign Affairs and competent immigration bodies."}
                </p>

                {/* Search Bar for National Visa Categories */}
                <div className="pt-2">
                  <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search among 20+ National Visa categories..."
                      value={nationalSearch}
                      onChange={(e) => setNationalSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C79A2B]"
                    />
                  </div>
                </div>
              </div>

              {/* National Visa Accordions Grid */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Showing {filteredNationalCategories.length} Categories
                </div>

                {filteredNationalCategories.map((cat) => {
                  const isExpanded = expandedNationalCat === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden transition-all shadow-2xs hover:border-[#C79A2B]/60"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedNationalCat(isExpanded ? null : cat.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#C79A2B]" />
                          <div>
                            <span className="text-sm font-bold text-[#333638]">
                              {cat.name}
                            </span>
                            <span className="text-xs text-neutral-500 block sm:inline sm:ml-2">
                              {cat.description}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                            isExpanded ? "rotate-180 text-[#C79A2B]" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-neutral-100 bg-[#FAF5EA]/30 px-5 py-5 text-xs space-y-4"
                          >
                            <div>
                              <span className="font-bold text-[#333638] uppercase tracking-wider text-[11px] block mb-1">
                                Requirements Summary:
                              </span>
                              <p className="text-neutral-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-neutral-200">
                                {cat.documentsRequired}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                              <div className="text-xs text-neutral-600">
                                Standard Statutory Fee:{" "}
                                <span className="font-bold text-[#333638]">
                                  {formatCurrency(cat.standardFee)}
                                </span>{" "}
                                + BLS Service Charge ({formatCurrency(cat.blsServiceFee)})
                              </div>
                              <Link
                                href={`/apply?category=${encodeURIComponent(cat.name)}`}
                                className="px-4 py-2 bg-[#C79A2B] hover:bg-[#B0851F] text-white font-bold rounded-lg shadow-sm transition-colors text-xs"
                              >
                                Apply Under This Category
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function VisaTypesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-xs font-semibold text-neutral-400">Loading visa information...</div>}>
      <VisaTypesContent />
    </Suspense>
  );
}

