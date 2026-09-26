"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  HelpCircle,
  MapPin,
  HeartHandshake,
  Sparkles,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Search,
  ChevronDown,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Smartphone,
  Camera,
  Flame,
  Briefcase,
  Radio,
  Send,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { formatCurrency, formatDate } from "@/lib/utils";

type TabKey = "faqs" | "centres" | "feedback" | "services" | "holidays" | "links" | "security";

function GeneralInformationContent() {
  const searchParams = useSearchParams();
  const urlTab = (searchParams.get("tab") as TabKey) || "centres";
  const [activeTab, setActiveTab] = useState<TabKey>(urlTab);

  // Data states
  const [centres, setCentres] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [usefulLinks, setUsefulLinks] = useState<any[]>([]);

  // Search and filter states
  const [centreSearch, setCentreSearch] = useState("");
  const [centreCountryFilter, setCentreCountryFilter] = useState("ALL");
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategoryFilter, setFaqCategoryFilter] = useState("ALL");
  const [holidayCountryTab, setHolidayCountryTab] = useState("India");

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState<"compliment" | "complaint" | "survey">("compliment");
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    phone: "",
    referenceNumber: "",
    centre: "New Delhi",
    rating: "5",
    message: "",
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Accordion open IDs
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch all content
    Promise.all([
      fetch("/api/content/centres").then((res) => res.json()),
      fetch("/api/content/faqs").then((res) => res.json()),
      fetch("/api/content/services").then((res) => res.json()),
      fetch("/api/content/holidays").then((res) => res.json()),
      fetch("/api/content/useful-links").then((res) => res.json()),
    ]).then(([centresRes, faqsRes, servRes, holiRes, linksRes]) => {
      if (centresRes.success) setCentres(centresRes.centres || []);
      if (faqsRes.success) setFaqs(faqsRes.faqs || []);
      if (servRes.success) setServices(servRes.services || []);
      if (holiRes.success) setHolidays(holiRes.holidays || []);
      if (linksRes.success) setUsefulLinks(linksRes.usefulLinks || []);
    });
  }, []);

  // Update tab if URL changes
  useEffect(() => {
    if (searchParams.get("tab")) {
      setActiveTab(searchParams.get("tab") as TabKey);
    }
  }, [searchParams]);

  // Filtered centres
  const filteredCentres = useMemo(() => {
    return centres.filter((c) => {
      const matchesCountry = centreCountryFilter === "ALL" || c.country === centreCountryFilter;
      const matchesSearch =
        !centreSearch.trim() ||
        c.name.toLowerCase().includes(centreSearch.toLowerCase()) ||
        c.address.toLowerCase().includes(centreSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(centreSearch.toLowerCase());
      return matchesCountry && matchesSearch;
    });
  }, [centres, centreSearch, centreCountryFilter]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCat = faqCategoryFilter === "ALL" || f.category === faqCategoryFilter;
      const matchesSearch =
        !faqSearch.trim() ||
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [faqs, faqSearch, faqCategoryFilter]);

  // Filtered Holidays by country tab
  const filteredHolidays = useMemo(() => {
    return holidays.filter((h) => h.country === holidayCountryTab);
  }, [holidays, holidayCountryTab]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackForm({
        name: "",
        email: "",
        phone: "",
        referenceNumber: "",
        centre: "New Delhi",
        rating: "5",
        message: "",
      });
    }, 4000);
  };

  const tabs = [
    { key: "centres" as TabKey, label: "Contact & Centres", icon: MapPin },
    { key: "faqs" as TabKey, label: "FAQs", icon: HelpCircle },
    { key: "services" as TabKey, label: "Additional Services", icon: Sparkles },
    { key: "holidays" as TabKey, label: "Public Holidays", icon: Calendar },
    { key: "feedback" as TabKey, label: "Customer Experience", icon: HeartHandshake },
    { key: "links" as TabKey, label: "Useful Links", icon: ExternalLink },
    { key: "security" as TabKey, label: "Security Rules", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-[#333638] text-white py-12 border-b border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-[#C79A2B] text-xs font-semibold border border-neutral-700">
              <Building2 className="w-3.5 h-3.5" />
              Consular Resources & Guidelines
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              General Information & Centres
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Explore centre locations, operational schedules, additional convenience services, FAQs, and security rules across India, Nepal, and Sri Lanka.
            </p>
          </div>
        </section>

        {/* Secondary Sub-Navigation Tabs */}
        <div className="bg-white border-b border-[#E5E5E5] sticky top-20 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      active
                        ? "bg-[#C79A2B] text-white shadow-xs"
                        : "text-neutral-600 hover:text-[#333638] hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ======================================================== */}
          {/* TAB 1: CONTACT & CENTRES (13 CENTRES)                   */}
          {/* ======================================================== */}
          {activeTab === "centres" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Filter & Search Bar */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-2">
                    Country:
                  </span>
                  {["ALL", "India", "Nepal", "Sri Lanka"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCentreCountryFilter(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        centreCountryFilter === c
                          ? "bg-[#333638] text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {c === "ALL" ? "All Countries" : c}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search city, address or code..."
                    value={centreSearch}
                    onChange={(e) => setCentreSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C79A2B]"
                  />
                </div>
              </div>

              {/* Centres Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCentres.map((centre) => (
                  <div
                    key={centre.id}
                    className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs hover:border-[#C79A2B] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A2B] bg-[#FAF5EA] px-2 py-0.5 rounded border border-[#E2CCA1]">
                            {centre.country} • {centre.code}
                          </span>
                          <h3 className="text-lg font-bold text-[#333638] mt-1.5">
                            {centre.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed min-h-10">
                        {centre.address}
                      </p>

                      <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs text-neutral-700">
                        <div className="flex items-start gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#C79A2B] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-neutral-900">Submission:</span>{" "}
                            {centre.submissionHours}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-neutral-900">Passport Return:</span>{" "}
                            {centre.passportCollectionHours}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>{centre.phone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate">{centre.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      {centre.mapUrl && (
                        <a
                          href={centre.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 bg-neutral-50 hover:bg-[#FAF5EA] text-[#333638] hover:text-[#C79A2B] border border-neutral-200 hover:border-[#E2CCA1] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#C79A2B]" />
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: FAQS (SEARCHABLE ACCORDIONS)                      */}
          {/* ======================================================== */}
          {activeTab === "faqs" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Search & Category Filter */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-2">
                    Topic:
                  </span>
                  {["ALL", "General", "Application", "Documents & Fees", "Tracking & Delivery"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFaqCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        faqCategoryFilter === cat
                          ? "bg-[#C79A2B] text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search questions or keywords..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C79A2B]"
                  />
                </div>
              </div>

              {/* FAQs Accordion List */}
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = Boolean(openFaqIds[faq.id]);
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-2xs transition-all hover:border-[#C79A2B]/60"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200">
                            {faq.category}
                          </span>
                          <span className="text-sm font-bold text-[#333638]">
                            {faq.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-[#C79A2B]" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-neutral-100 bg-[#FAF5EA]/20 px-5 py-4 text-xs text-neutral-700 leading-relaxed"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ADDITIONAL SERVICES (RESPONSIVE PRICING TABLE)     */}
          {/* ======================================================== */}
          {activeTab === "services" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                      Optional Value-Added Facilities
                    </span>
                    <h2 className="text-2xl font-bold text-[#333638]">
                      Additional Value Added Services & Pricing
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      These optional services are designed to enhance your application experience and do not influence visa processing duration or consular decisions.
                    </p>
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="overflow-x-auto pt-4">
                  <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#333638] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                          Service Name
                        </th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                          Description
                        </th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">
                          Fee (Inclusive of Taxes)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      {services.map((s, idx) => (
                        <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"}>
                          <td className="py-3.5 px-4 font-bold text-[#333638] whitespace-nowrap">
                            {s.title}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600 max-w-md">
                            {s.description}
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold text-[#333638] whitespace-nowrap">
                            {formatCurrency(s.price, s.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 text-[11px] text-neutral-500 italic">
                  * Note: Additional services are strictly optional. Availing premium lounge or doorstep services does not guarantee expedited processing or visa issuance by the Embassy.
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: PUBLIC HOLIDAYS (COUNTRY TABS: INDIA, NEPAL, SRI LANKA) */}
          {/* ======================================================== */}
          {activeTab === "holidays" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                      Official Consular Closures
                    </span>
                    <h2 className="text-2xl font-bold text-[#333638]">
                      Public Holidays Schedule 2026
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      Our centres remain closed on Spanish National Day as well as designated official regional holidays.
                    </p>
                  </div>

                  {/* Country Selector */}
                  <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200">
                    {["India", "Nepal", "Sri Lanka"].map((ctry) => (
                      <button
                        key={ctry}
                        onClick={() => setHolidayCountryTab(ctry)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                          holidayCountryTab === ctry
                            ? "bg-[#C79A2B] text-white shadow-xs"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        {ctry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Holiday Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#333638] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Date</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Holiday Name</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Details / Country</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      {filteredHolidays.map((h, idx) => (
                        <tr key={h.id} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"}>
                          <td className="py-3.5 px-4 font-bold text-[#C79A2B] whitespace-nowrap">
                            {formatDate(h.date)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#333638]">
                            {h.name}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600">
                            {h.description || `${h.country} Official Observance`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: CUSTOMER EXPERIENCE (COMPLIMENTS, COMPLAINTS, SURVEY) */}
          {/* ======================================================== */}
          {activeTab === "feedback" && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                  Voice of Customer
                </span>
                <h2 className="text-2xl font-bold text-[#333638]">
                  Customer Experience & Feedback
                </h2>
                <p className="text-xs text-neutral-600">
                  Your feedback helps us maintain strict compliance and quality standards across all application centres.
                </p>
              </div>

              {/* Sub-Tabs: Compliments / Complaints / Survey */}
              <div className="flex border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => setFeedbackType("compliment")}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                    feedbackType === "compliment"
                      ? "border-[#C79A2B] text-[#C79A2B]"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Compliments
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType("complaint")}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                    feedbackType === "complaint"
                      ? "border-[#C79A2B] text-[#C79A2B]"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Complaints & Grievances
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType("survey")}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                    feedbackType === "survey"
                      ? "border-[#C79A2B] text-[#C79A2B]"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Customer Survey
                </button>
              </div>

              {feedbackSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">
                    Thank You for Your Feedback
                  </h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your response has been logged into our quality assurance and compliance tracking system.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={feedbackForm.name}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                        placeholder="applicant@domain.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">
                        Application Reference (Optional)
                      </label>
                      <input
                        type="text"
                        value={feedbackForm.referenceNumber}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, referenceNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                        placeholder="BLS-2026-XXXXXX"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">
                        Application Centre Visited
                      </label>
                      <select
                        value={feedbackForm.centre}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, centre: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                      >
                        {centres.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.country})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {feedbackType === "survey" && (
                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">
                        Overall Service Rating (1-5 Stars)
                      </label>
                      <select
                        value={feedbackForm.rating}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                      >
                        <option value="5">★★★★★ Exceptional (5/5)</option>
                        <option value="4">★★★★☆ Very Good (4/5)</option>
                        <option value="3">★★★☆☆ Average (3/5)</option>
                        <option value="2">★★☆☆☆ Below Expectations (2/5)</option>
                        <option value="1">★☆☆☆☆ Poor (1/5)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Message / Comments *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#C79A2B] focus:outline-none"
                      placeholder={
                        feedbackType === "compliment"
                          ? "Share positive experience about centre staff or process..."
                          : feedbackType === "complaint"
                          ? "Detail the grievance, date of visit, and officer details..."
                          : "Provide suggestions to improve our logistics and services..."
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C79A2B] hover:bg-[#B0851F] text-white font-bold rounded-xl shadow-sm transition-colors inline-flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: USEFUL LINKS                                      */}
          {/* ======================================================== */}
          {activeTab === "links" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usefulLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-xs hover:border-[#C79A2B] hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A2B] bg-[#FAF5EA] px-2 py-0.5 rounded border border-[#E2CCA1]">
                        {link.category}
                      </span>
                      <h3 className="text-base font-bold text-[#333638] group-hover:text-[#C79A2B] transition-colors flex items-center justify-between">
                        <span>{link.title}</span>
                        <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#C79A2B]" />
                      </h3>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {link.description}
                      </p>
                    </div>

                    <div className="pt-4 text-xs font-bold text-[#C79A2B] flex items-center gap-1">
                      Visit Official Portal →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: SECURITY RULES (ICON CARDS)                       */}
          {/* ======================================================== */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    Centre Entry Policy
                  </span>
                  <h2 className="text-2xl font-bold text-[#333638] mt-2">
                    Security Regulations & Prohibited Articles
                  </h2>
                  <p className="text-xs text-neutral-600 mt-1">
                    For security reasons and diplomatic safety compliance, the following items are strictly prohibited inside the premises of all Spain Visa Application Centres.
                  </p>
                </div>

                {/* Prohibited items grid with modern icon cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-700 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#333638] text-xs">Mobile Phones</h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Must be switched off or placed on silent mode. Photography or video recording is strictly prohibited.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-700 shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#333638] text-xs">Recording Devices</h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Audio recorders, handheld camcorders, smartwatches with camera, and recording devices are disallowed.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-700 shrink-0">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#333638] text-xs">Electronic Equipment</h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Laptops, hard drives, USB thumb drives, and portable audio players cannot be brought inside.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-700 shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#333638] text-xs">Weapons & Sharp Objects</h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Knives, scissors, blades, pepper spray, or any instrument that could be used as a weapon are prohibited.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-700 shrink-0">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#333638] text-xs">Flammable Articles</h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Lighters, matchboxes, aerosol cans, flammable liquids, and hazardous chemicals are barred.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-700 shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#333638] text-xs">Sealed Luggage / Large Bags</h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Large suitcases, backpacks, and sealed parcels cannot be stored in the centre. Only documents in clear folders are permitted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function GeneralInformationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-xs font-semibold text-neutral-400">Loading consular information...</div>}>
      <GeneralInformationContent />
    </Suspense>
  );
}

