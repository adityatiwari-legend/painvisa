"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Printer,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  FileCheck2,
  Users,
} from "lucide-react";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

export default function BookAppointmentPage() {
  const [urls, setUrls] = useState({
    book: "https://india.blsspainvisa.com/book_appointment.php",
    reprint: "https://india.blsspainvisa.com/reprint_appointment.php",
    cancel: "https://india.blsspainvisa.com/cancel_appointment.php",
  });

  useEffect(() => {
    document.title = "Book Appointment | BLS Biometric";
    fetch("/api/content/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setUrls({
            book: data.settings.bls_appointment_url || "https://india.blsspainvisa.com/book_appointment.php",
            reprint: data.settings.bls_reprint_url || "https://india.blsspainvisa.com/reprint_appointment.php",
            cancel: data.settings.bls_cancel_url || "https://india.blsspainvisa.com/cancel_appointment.php",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-[#333638] text-white py-14 border-b border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-[#C79A2B] text-xs font-semibold border border-neutral-700">
              <Calendar className="w-3.5 h-3.5" />
              Official Scheduling Facility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Spain Visa Appointment Management
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Schedule your biometric enrolment and document submission at an authorized Spain Visa Application Centre in India, Nepal, or Sri Lanka.
            </p>
          </div>
        </section>

        {/* Official Protocol Advisory Notice */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-[#FAF5EA] border border-[#E2CCA1] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-neutral-800">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#C79A2B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-[#333638] uppercase tracking-wider text-[11px] mr-2">
                Official Directive:
              </span>
              Appointment services are handled through the official appointment system. Appointment slots are strictly free of charge through standard allocations. Any payment requests for scheduling are unauthorized and fraudulent.
            </div>
          </div>
        </section>

        {/* 3 LARGE INTERACTIVE CARDS */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Book Appointment */}
            <div className="bg-white rounded-3xl p-8 border border-[#E5E5E5] shadow-sm flex flex-col justify-between hover:border-[#C79A2B] hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF5EA] text-[#C79A2B] flex items-center justify-center border border-[#E2CCA1] group-hover:scale-105 transition-transform">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#333638]">
                  BOOK AN APPOINTMENT
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Select your appropriate jurisdiction, choose an available date and time slot, and generate an official appointment confirmation letter.
                </p>
                <div className="pt-2 text-xs text-neutral-500 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Individual and Family bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prime Time slots available</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href={urls.book}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#C79A2B] hover:bg-[#B0851F] text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center shadow-md flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <span>Continue to Official Appointment System</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 2: Reprint Appointment Letter */}
            <div className="bg-white rounded-3xl p-8 border border-[#E5E5E5] shadow-sm flex flex-col justify-between hover:border-[#333638] hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-[#333638] flex items-center justify-center border border-neutral-300 group-hover:scale-105 transition-transform">
                  <Printer className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#333638]">
                  REPRINT APPOINTMENT LETTER
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Lost or need an additional physical copy of your appointment booking confirmation? Retrieve and reprint your official appointment letter instantly.
                </p>
                <div className="pt-2 text-xs text-neutral-500 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Requires Reference & Passport details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Download PDF letter directly</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href={urls.reprint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#333638] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <span>Reprint Appointment Letter</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 3: Cancel Appointment */}
            <div className="bg-white rounded-3xl p-8 border border-[#E5E5E5] shadow-sm flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200 group-hover:scale-105 transition-transform">
                  <XCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#333638]">
                  CANCEL APPOINTMENT
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Unable to attend your scheduled appointment? Cancel at least 48 hours in advance so another applicant can utilize the allocated consular slot.
                </p>
                <div className="pt-2 text-xs text-neutral-500 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Instant slot cancellation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Permits immediate rescheduling</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href={urls.cancel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider rounded-xl text-center shadow-xs flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <span>Cancel Scheduled Appointment</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* What to Bring Checklist */}
        <section className="py-12 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C79A2B]">
                Preparation Checklist
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#333638]">
                What to Bring to the Application Centre
              </h2>
              <p className="text-xs text-neutral-600">
                Arrive 15 minutes prior to your allocated time slot with all required original and photocopied records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <FileCheck2 className="w-5 h-5 text-[#C79A2B]" />
                <h4 className="font-bold text-[#333638] text-sm">Appointment Letter</h4>
                <p className="text-neutral-600 leading-relaxed">
                  Printed copy of your official appointment confirmation showing applicant barcode and timestamp.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <Clock className="w-5 h-5 text-[#C79A2B]" />
                <h4 className="font-bold text-[#333638] text-sm">Original Passport</h4>
                <p className="text-neutral-600 leading-relaxed">
                  Valid for at least 3 months beyond departure date from Schengen Area, with at least 2 consecutive blank pages.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <ShieldCheck className="w-5 h-5 text-[#C79A2B]" />
                <h4 className="font-bold text-[#333638] text-sm">Travel Insurance Policy</h4>
                <p className="text-neutral-600 leading-relaxed">
                  Certificate showing minimum coverage of €30,000 including medical emergencies and repatriation across Schengen.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <Users className="w-5 h-5 text-[#C79A2B]" />
                <h4 className="font-bold text-[#333638] text-sm">Biometric Enrolment</h4>
                <p className="text-neutral-600 leading-relaxed">
                  Digital facial image capture and 10-digit fingerprint scanning will be performed at the centre for applicants aged 12+.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
