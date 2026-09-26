"use client";

import React from "react";
import Link from "next/link";
import {
  Globe2,
  ShieldAlert,
  Lock,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#333638] text-white pt-16 pb-12 border-t border-neutral-700/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Important Prototype / Legal Disclaimer Banner */}
        <div className="mb-12 bg-neutral-800/80 border border-neutral-700 rounded-xl p-5 text-neutral-300 text-xs leading-relaxed flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-2.5 rounded-lg bg-[#C79A2B]/10 text-[#C79A2B] shrink-0 border border-[#C79A2B]/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] mr-2">
              Important Legal & Operational Disclaimer:
            </span>
            This portal is a high-fidelity demonstration and software implementation prototype. This website does not claim to represent the official diplomatic decisions of the Kingdom of Spain. Visa applications and biometric data are processed strictly in accordance with consular jurisdictions. No agent or individual can guarantee visa approval or bypass standard diplomatic assessments.
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-700/60">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-neutral-800 flex items-center justify-between p-1.5 border border-neutral-700">
                <div className="w-full h-full flex flex-col justify-between py-0.5">
                  <div className="h-1 w-full bg-[#C60B1E]" />
                  <div className="h-2 w-full bg-[#FFC400]" />
                  <div className="h-1 w-full bg-[#C60B1E]" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  BLS SPAIN VISA
                </span>
                <span className="text-[10px] text-[#C79A2B] block uppercase tracking-widest font-semibold">
                  India • Nepal • Sri Lanka
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pr-6">
              Authorized outsourced administrative and logistics service partner facilitating Schengen (Short Stay) and National (Long Stay) visa submissions to the Embassy and Consulates General of Spain.
            </p>

            <div className="pt-2 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C79A2B]" />
                <span>Helpline: +91 120 6641000 (09:00 - 17:00 IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C79A2B]" />
                <span>info.india@blsspainvisa.com</span>
              </div>
            </div>
          </div>

          {/* Column: 5 Primary Tabs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C79A2B] mb-4">
              Primary Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300 font-medium">
              <li>
                <Link href="/" className="hover:text-[#C79A2B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/visa-types" className="hover:text-[#C79A2B] transition-colors">
                  Visa Types
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-[#C79A2B] transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/general-information" className="hover:text-[#C79A2B] transition-colors">
                  General Information
                </Link>
              </li>
              <li>
                <Link href="/track-application" className="hover:text-[#C79A2B] transition-colors">
                  Track Application
                </Link>
              </li>
              <li className="pt-2 border-t border-neutral-700/60">
                <Link href="/apply" className="text-[#C79A2B] hover:text-[#FAF5EA] font-semibold flex items-center gap-1">
                  Start Application (Registration)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Diplomatic Missions & Official Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C79A2B] mb-4">
              Official Diplomatic Links
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <a
                  href="https://www.exteriores.gob.es/Embajadas/nuevadelhi/en/Paginas/index.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C79A2B] transition-colors flex items-center gap-1.5"
                >
                  <span>Embassy of Spain (New Delhi)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.exteriores.gob.es/Consulados/mumbai/en/Paginas/index.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C79A2B] transition-colors flex items-center gap-1.5"
                >
                  <span>Consulate General (Mumbai)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://nuevadelhi.cervantes.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C79A2B] transition-colors flex items-center gap-1.5"
                >
                  <span>Instituto Cervantes</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.spain.info/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C79A2B] transition-colors flex items-center gap-1.5"
                >
                  <span>Turespaña (Tourism Board)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Privacy & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C79A2B] mb-4">
              Privacy & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li className="flex items-center gap-1.5 text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C79A2B]" />
                <span>GDPR & DPDP Act Aligned</span>
              </li>
              <li className="flex items-center gap-1.5 text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C79A2B]" />
                <span>Encrypted Document Vault</span>
              </li>
              <li className="flex items-center gap-1.5 text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C79A2B]" />
                <span>Strict Access Audit Trail</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors border border-neutral-700 text-[11px]"
                >
                  <Lock className="w-3 h-3 text-[#C79A2B]" />
                  <span>Admin Portal Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} BLS Spain Visa Services Prototype. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-neutral-500">
              Compliant with Consular Processing Standards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
