"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Globe2,
  FileCheck2,
  Calendar,
  Info,
  Search,
  ExternalLink,
  Shield,
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visaDropdownOpen, setVisaDropdownOpen] = useState(false);
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setVisaDropdownOpen(false);
    setInfoDropdownOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: "Home",
      href: "/",
      exact: true,
    },
    {
      name: "Visa Types",
      href: "/visa-types",
      hasDropdown: true,
      dropdownItems: [
        { label: "Schengen Visa (Short Stay)", href: "/visa-types?tab=schengen", desc: "Tourism, Business, Family visit (Up to 90 days)" },
        { label: "National Visa (Long Stay)", href: "/visa-types?tab=national", desc: "Work, Study, Digital Nomad, Residence (>90 days)" },
        { label: "Jurisdiction & Centres", href: "/visa-types#jurisdiction", desc: "State-wise consular jurisdictions" },
        { label: "Photo Specifications", href: "/visa-types#photo-specs", desc: "Official biometric photograph standards" },
      ],
    },
    {
      name: "Book Appointment",
      href: "/book-appointment",
    },
    {
      name: "General Information",
      href: "/general-information",
      hasDropdown: true,
      dropdownItems: [
        { label: "Contact & Centres", href: "/general-information?tab=centres", desc: "13 application centres across India, Nepal, Sri Lanka" },
        { label: "Frequently Asked Questions", href: "/general-information?tab=faqs", desc: "Application rules, fees, timelines" },
        { label: "Additional Services", href: "/general-information?tab=services", desc: "Premium lounge, courier, SMS tracking" },
        { label: "Public Holidays", href: "/general-information?tab=holidays", desc: "Official embassy closure calendar 2026" },
        { label: "Security Regulations", href: "/general-information?tab=security", desc: "Centre entry policies and prohibited items" },
      ],
    },
    {
      name: "Track Application",
      href: "/track-application",
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E5E5E5]"
          : "bg-white border-b border-[#E5E5E5]"
      } no-print`}
    >
      {/* Top micro bar with country selector and prototype disclaimer */}
      <div className="bg-[#333638] text-white text-[12px] py-1.5 px-4 sm:px-8 border-b border-neutral-700/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#C79A2B] font-semibold tracking-wide">
              <Globe2 className="w-3.5 h-3.5" />
              SPAIN VISA APPLICATION
            </span>
            <span className="hidden sm:inline text-neutral-400">|</span>
            <span className="hidden sm:inline text-neutral-300">
              India • Nepal • Sri Lanka
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-300">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#C79A2B]/20 text-[#E2CCA1] border border-[#C79A2B]/30">
              Prototype / Demonstration
            </span>
            <Link
              href="/apply"
              className="text-[#C79A2B] hover:text-[#FAF5EA] font-semibold flex items-center gap-1 transition-colors"
            >
              Start Application
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Area */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#333638] flex items-center justify-center p-2 shadow-xs border border-neutral-700 group-hover:border-[#C79A2B] transition-colors">
              <Fingerprint className="w-6 h-6 text-[#C79A2B]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#333638]">
                  BLS
                </span>
                <span className="font-extrabold text-xl tracking-tight text-[#C79A2B]">
                  Biometric
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 tracking-wider font-semibold uppercase">
                Spain Visa Application Services
              </p>
            </div>
          </Link>

          {/* Desktop Five Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);

              if (item.hasDropdown) {
                const isOpen =
                  item.name === "Visa Types" ? visaDropdownOpen : infoDropdownOpen;
                const setOpen =
                  item.name === "Visa Types"
                    ? setVisaDropdownOpen
                    : setInfoDropdownOpen;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-semibold transition-all ${
                        active
                          ? "text-[#C79A2B] bg-[#FAF5EA]"
                          : "text-[#333638] hover:text-[#C79A2B] hover:bg-neutral-50"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#C79A2B]" : "opacity-60"
                        }`}
                      />
                    </Link>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full pt-2 w-72 z-50"
                        >
                          <div className="bg-white rounded-xl shadow-xl border border-[#E5E5E5] p-2 overflow-hidden">
                            {item.dropdownItems?.map((drop) => (
                              <Link
                                key={drop.label}
                                href={drop.href}
                                className="block p-2.5 rounded-lg hover:bg-[#FAF5EA] transition-colors group"
                                onClick={() => setOpen(false)}
                              >
                                <div className="text-xs font-semibold text-[#252525] group-hover:text-[#C79A2B]">
                                  {drop.label}
                                </div>
                                <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                                  {drop.desc}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-all ${
                    active
                      ? "text-[#C79A2B] bg-[#FAF5EA]"
                      : "text-[#333638] hover:text-[#C79A2B] hover:bg-neutral-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button: Start Application */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#C79A2B] hover:bg-[#B0851F] rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
            >
              Start Application
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#333638] hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-[#E5E5E5] px-4 pt-2 pb-6 shadow-xl overflow-hidden"
          >
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <div key={item.name} className="border-b border-neutral-100 pb-1">
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold ${
                        active
                          ? "bg-[#FAF5EA] text-[#C79A2B]"
                          : "text-[#333638] hover:bg-neutral-50"
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>

                    {item.dropdownItems && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-neutral-50/70 rounded-lg my-1">
                        {item.dropdownItems.map((drop) => (
                          <Link
                            key={drop.label}
                            href={drop.href}
                            className="block py-1.5 text-xs font-medium text-neutral-600 hover:text-[#C79A2B]"
                          >
                            • {drop.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-3">
                <Link
                  href="/apply"
                  className="w-full flex items-center justify-center py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#C79A2B] hover:bg-[#B0851F] rounded-lg shadow-sm"
                >
                  Start Application (Registration)
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
