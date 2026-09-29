"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe2,
  Calendar,
  Search,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  MapPin,
  CheckCircle,
  HelpCircle,
  Plane,
  HeartHandshake,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

export default function HomePage() {
  const [appointmentUrl, setAppointmentUrl] = useState("https://india.blsspainvisa.com/book_appointment.php");

  useEffect(() => {
    document.title = "BLS Biometric | Spain Visa Application";
    fetch("/api/content/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.bls_appointment_url) {
          setAppointmentUrl(data.settings.bls_appointment_url);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-[#333638] text-white py-16 lg:py-24 overflow-hidden border-b border-neutral-700">
          {/* Subtle Spanish architectural geometric motif pattern in background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C79A2B_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading and CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-8 space-y-6"
              >
                {/* Consular Regional Badges */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/90 border border-neutral-700 text-xs font-medium text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-[#C79A2B]" />
                  <span>Consular Jurisdiction:</span>
                  <span className="text-white font-semibold">India</span>
                  <span>•</span>
                  <span className="text-white font-semibold">Nepal</span>
                  <span>•</span>
                  <span className="text-white font-semibold">Sri Lanka</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Spain Visa Application{" "}
                  <span className="text-[#C79A2B] block sm:inline">— India</span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  Welcome to BLS Biometric. Official information and logistics services for applicants applying for a visa to Spain across India, Nepal, and Sri Lanka.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href="/apply"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#C79A2B] hover:bg-[#B0851F] rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    <span>Start Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={appointmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-xl transition-all"
                  >
                    <span>Book Appointment</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C79A2B]" />
                  </a>

                  <Link
                    href="/track-application"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800/60 rounded-xl transition-all"
                  >
                    <span>Track Status</span>
                  </Link>
                </div>
              </motion.div>

              {/* Right Column: Quick Status Card / Assistance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-4"
              >
                <div className="bg-neutral-800/90 rounded-2xl p-6 border border-neutral-700 shadow-2xl backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#C79A2B]">
                      Fast Track Services
                    </span>
                    <span className="text-[11px] text-neutral-400">Verified System</span>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/visa-types"
                      className="group flex items-start gap-3.5 p-3 rounded-xl bg-neutral-750 hover:bg-neutral-700 transition-colors border border-neutral-700/60"
                    >
                      <div className="p-2 rounded-lg bg-[#C79A2B]/10 text-[#C79A2B] group-hover:bg-[#C79A2B] group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white group-hover:text-[#C79A2B] transition-colors">
                          Know Visa Requirements
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Schengen (Short stay) & National (Long stay) checklists
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#C79A2B] transition-colors mt-1" />
                    </Link>

                    <Link
                      href="/book-appointment"
                      className="group flex items-start gap-3.5 p-3 rounded-xl bg-neutral-750 hover:bg-neutral-700 transition-colors border border-neutral-700/60"
                    >
                      <div className="p-2 rounded-lg bg-[#C79A2B]/10 text-[#C79A2B] group-hover:bg-[#C79A2B] group-hover:text-white transition-colors">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white group-hover:text-[#C79A2B] transition-colors">
                          Schedule Centre Appointment
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Book, reprint confirmation or reschedule
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#C79A2B] transition-colors mt-1" />
                    </Link>

                    <Link
                      href="/general-information?tab=centres"
                      className="group flex items-start gap-3.5 p-3 rounded-xl bg-neutral-750 hover:bg-neutral-700 transition-colors border border-neutral-700/60"
                    >
                      <div className="p-2 rounded-lg bg-[#C79A2B]/10 text-[#C79A2B] group-hover:bg-[#C79A2B] group-hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white group-hover:text-[#C79A2B] transition-colors">
                          Find Nearest Centre
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          New Delhi, Mumbai, Bengaluru and 10 other cities
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#C79A2B] transition-colors mt-1" />
                    </Link>
                  </div>

                  <div className="pt-2 text-[11px] text-neutral-400 text-center">
                    Operating under bilateral consular standards
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="bg-white py-12 border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5]">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#333638]">
                  20<span className="text-[#C79A2B]">+</span>
                </div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">
                  Years of Global Experience
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5]">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#333638]">
                  70<span className="text-[#C79A2B]">+</span>
                </div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">
                  Countries of Operation
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5]">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#333638]">
                  13<span className="text-[#C79A2B]"></span>
                </div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">
                  Application Centres
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5]">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#333638]">
                  100<span className="text-[#C79A2B]">%</span>
                </div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">
                  Secure Data Vault
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO APPLY (TIMELINE SECTION) */}
        <section className="py-20 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C79A2B]">
                Step-by-Step Procedure
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333638] tracking-tight">
                How to Apply for Your Spanish Visa
              </h2>
              <p className="text-sm text-neutral-600">
                Follow three clear steps to ensure your visa documentation complies with the Embassy and Consulates General guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF5EA] text-[#C79A2B] font-extrabold text-2xl flex items-center justify-center border border-[#E2CCA1] group-hover:scale-105 transition-transform">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-[#333638]">
                    Know your visa type
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Identify whether you require a Short Stay Schengen Visa (up to 90 days for tourism, business, or family visit) or a Long Stay National Visa (for studies, employment, or residence).
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href="/visa-types"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C79A2B] hover:text-[#B0851F]"
                  >
                    Explore Visa Categories <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF5EA] text-[#C79A2B] font-extrabold text-2xl flex items-center justify-center border border-[#E2CCA1] group-hover:scale-105 transition-transform">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-[#333638]">
                    Book your appointment
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Schedule an official appointment at the designated application centre corresponding to your continuous 6-month residence jurisdiction (New Delhi or Mumbai consular area).
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C79A2B] hover:text-[#B0851F]"
                  >
                    Appointment System <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF5EA] text-[#C79A2B] font-extrabold text-2xl flex items-center justify-center border border-[#E2CCA1] group-hover:scale-105 transition-transform">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-[#333638]">
                    Visit our centre
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Arrive with your printed appointment letter, original passport, supporting financial files, and submit your biometric fingerprints and digital photograph.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href="/general-information?tab=centres"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C79A2B] hover:text-[#B0851F]"
                  >
                    Find Center Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMPORTANT NOTICES CARDS */}
        <section className="py-16 bg-white border-t border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                  Crucial Compliance
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#333638] tracking-tight">
                  Important Notices & Security Advisories
                </h2>
              </div>
              <Link
                href="/general-information?tab=faqs"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#C79A2B] hover:underline"
              >
                View all FAQs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Notice 1: Fraud warning */}
              <div className="bg-[#FAF5EA] rounded-xl p-6 border border-[#E2CCA1] space-y-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-700 w-fit">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#333638]">Fraud Advisory Warning</h3>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Appointments are provided only through official channels. Beware of touts or tout networks claiming guaranteed visa approvals or selling unauthorized slots.
                </p>
              </div>

              {/* Notice 2: Travel insurance */}
              <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] space-y-3 shadow-xs">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-700 w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#333638]">Mandatory Health Insurance</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Schengen regulations require travel health insurance covering at least €30,000 for emergency medical treatment and repatriation across all 29 member countries.
                </p>
              </div>

              {/* Notice 3: Processing Time */}
              <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] space-y-3 shadow-xs">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-700 w-fit">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#333638]">Minimum Processing Window</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Applications must be submitted at least 15 calendar days before intended departure. Peak seasons (April to July) may require up to 45 calendar days.
                </p>
              </div>

              {/* Notice 4: Holidays & Closures */}
              <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] space-y-3 shadow-xs">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-700 w-fit">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#333638]">Consular Closures & Holidays</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Centres observe official Spanish National Holidays as well as host nation gazetted holidays. Review the updated schedule before planning your centre visit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TWO MAJOR VISA PATHWAYS (SCHENGEN VS NATIONAL) */}
        <section className="py-20 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                Consular Categories
              </span>
              <h2 className="text-3xl font-extrabold text-[#333638]">
                Select Your Spanish Visa Category
              </h2>
              <p className="text-xs text-neutral-600">
                Explore comprehensive requirements, photo guidelines, and statutory fees.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Schengen Visa */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-[#C79A2B] transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200 uppercase tracking-wide">
                      Short Stay
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">Up to 90 Days</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#333638]">
                    SCHENGEN VISA
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Designed for visits not exceeding 90 days within any 180-day period. Covers tourism, family visits, business consultations, transit for seamen, and airport transit.
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-2 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Tourist & Leisure Travel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Business & Commercial Conferences</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Airport Transit & Seafarers Transit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Family Member of EU/EEA Citizens (Gratis)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 border-t border-neutral-100 mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-500 block">Adult Standard Fee</span>
                    <span className="text-lg font-bold text-[#333638]">₹9,599 + BLS Fee</span>
                  </div>
                  <Link
                    href="/visa-types?tab=schengen"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#333638] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    View Schengen Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: National Visa */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-[#C79A2B] transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 uppercase tracking-wide">
                      Long Stay
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">Over 90 Days</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#333638]">
                    NATIONAL VISA
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Type D visas required for residing, studying, working, or conducting research in Spain for more than 90 days. Includes Digital Nomad and Startup visas.
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-2 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#C79A2B]" />
                      <span>Digital Nomad & Startup Visa (Law 28/2022)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#C79A2B]" />
                      <span>Student Visa (&gt;90 days University/Master)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#C79A2B]" />
                      <span>Employment & Highly Qualified Specialists (ICT)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#C79A2B]" />
                      <span>Non-Lucrative Residence & Family Regrouping</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 border-t border-neutral-100 mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-500 block">20+ Categories</span>
                    <span className="text-lg font-bold text-[#333638]">Law 14/2013 Framework</span>
                  </div>
                  <Link
                    href="/visa-types?tab=national"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C79A2B] text-white text-xs font-semibold hover:bg-[#B0851F] transition-colors shadow-sm"
                  >
                    View National Categories <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROMINENT REGISTRATION & APPLICATION CTA BANNER */}
        <section className="py-16 bg-[#333638] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-gradient-to-r from-neutral-800 to-neutral-850 rounded-3xl p-8 sm:p-12 border border-neutral-700 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs uppercase font-bold tracking-widest text-[#C79A2B]">
                  Online Registration Portal
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Ready to Submit Your Application Online?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Complete your personal details, take your live camera photographs for passport, thumb impression, and Aadhaar card, and obtain your official Application Reference Number immediately.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Link
                  href="/apply"
                  className="px-8 py-4 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl text-center shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Start Application Now
                </Link>
                <Link
                  href="/track-application"
                  className="px-6 py-4 bg-neutral-700 hover:bg-neutral-600 text-white text-xs sm:text-sm font-semibold rounded-xl text-center transition-all"
                >
                  Track Existing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
